// ============================================================
// Charger — Vercel Edge Middleware (the staff door)
// ------------------------------------------------------------
// Runs on EVERY request, before routing/rewrites. Public traffic
// falls through untouched. Private traffic — /dev, /_private, or
// any host on PRIVATE_HOSTS (e.g. dev.charger.tools) — requires a
// signed session cookie, obtained by POSTing the password to
// /dev/login (the login page is rendered right here).
//
// Auth model:
//   • DEV_PASSWORD          — the password (Vercel env var)
//   • DEV_SESSION_SECRET    — HMAC key for session cookies (env var)
//   • Cookie: chg_dev=<expiryMs>.<hmacSHA256(secret, "hq1:"+expiryMs)>
//     HttpOnly, SameSite=Lax, Secure, 7-day expiry,
//     Domain=.charger.tools in prod so it spans subdomains.
//
// FAILS CLOSED: if either env var is missing, the private area
// serves a 503 "register closed" page and nothing else.
//
// To add another private subdomain: create _private/<name>/,
// add "<name>." below, and add a host rewrite in vercel.json.
// ============================================================

const COOKIE = "chg_dev";
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
const PRIVATE_HOSTS = ["dev."]; // host prefixes that are staff-only
// On the apex only the raw file tree is gated; /dev there is NOT
// intercepted, so the vercel.json redirect can bounce it to the
// dev.charger.tools subdomain (the private area's real home).
const PRIVATE_PATH = /^\/_private(\/|$)/;
const APEX = "charger.tools"; // cookies span *.charger.tools

export default async function middleware(request) {
  const url = new URL(request.url);
  const host = (request.headers.get("host") || url.hostname).toLowerCase().split(":")[0];
  const privateHost = PRIVATE_HOSTS.some((p) => host.startsWith(p));
  const privatePath = PRIVATE_PATH.test(url.pathname);
  // Login/logout endpoints work on any host (the apex /_private login
  // form posts to /dev/login on the apex).
  const authPath = url.pathname === "/dev/login" || url.pathname === "/dev/logout";

  if (!privateHost && !privatePath && !authPath) {
    // Apex /dev is just a signpost: the private area lives on the
    // subdomain. Redirected here (not in vercel.json) because
    // vercel.json redirects run BEFORE middleware and would also
    // swallow the /dev/login + /dev/logout endpoints.
    if (/^\/dev(\/|$)/.test(url.pathname)) {
      const rest = url.pathname.slice(4) || "/";
      return redirect("https://dev." + APEX + rest + url.search, {}, 307);
    }
    return; // public — pass through
  }

  const password = process.env.DEV_PASSWORD;
  const secret = process.env.DEV_SESSION_SECRET;
  if (!password || !secret) {
    // Fail closed: no credentials configured, no door.
    return loginPage(503, "Login is disabled — DEV_PASSWORD and DEV_SESSION_SECRET are not configured.", "/", true);
  }

  const home = privateHost ? "/" : "/dev";

  // --- Log out -------------------------------------------------------
  if (url.pathname === "/dev/logout") {
    return redirect(home === "/" ? "https://" + APEX + "/" : "/", {
      "Set-Cookie": buildCookie("", 0, url, host),
    });
  }

  // --- Log in --------------------------------------------------------
  if (url.pathname === "/dev/login" && request.method === "POST") {
    // Same-origin form posts only (CSRF).
    const origin = request.headers.get("origin");
    if (origin) {
      let originHost = "";
      try {
        originHost = new URL(origin).hostname.toLowerCase();
      } catch {}
      if (originHost !== host) return loginPage(403, "Cross-origin request refused.", home);
    }

    let attempt = "";
    let next = home;
    try {
      const form = await request.formData();
      attempt = String(form.get("password") || "");
      const rawNext = String(form.get("next") || "");
      if (/^\/(?!\/)/.test(rawNext)) next = rawNext; // internal paths only
    } catch {
      return loginPage(400, "Malformed request.", home);
    }

    if (await safeEqual(attempt, password)) {
      const expiry = Date.now() + SESSION_TTL_MS;
      const token = expiry + "." + (await hmacHex(secret, "hq1:" + expiry));
      return redirect(next, {
        "Set-Cookie": buildCookie(token, SESSION_TTL_MS, url, host),
      });
    }

    await sleep(400); // mildly slow down brute force
    return loginPage(401, "Incorrect password — try again.", home, false, nextPathFor(url, privateHost));
  }

  // --- Session check -------------------------------------------------
  if (await hasValidSession(request, secret)) {
    if (privateHost) {
      // Serve the private tree for this host from the middleware itself.
      // The vercel.json host rewrite can't do it: the filesystem is
      // checked before rewrites, so "/" would ship the public index.html.
      let path = url.pathname;
      if (path === "/dev" || path.startsWith("/dev/")) {
        path = path.slice(4) || "/"; // normalize apex-style /dev links
      }
      const dest = new URL("/_private/dev" + (path === "/" ? "/" : path), url);
      return new Response(null, {
        headers: { "x-middleware-rewrite": dest.toString() },
      });
    }
    return; // apex — continue to static files (vercel.json maps /dev)
  }

  return loginPage(401, null, home, false, nextPathFor(url, privateHost));
}

// ------------------------------------------------------------
// Session
// ------------------------------------------------------------
async function hasValidSession(request, secret) {
  const cookies = request.headers.get("cookie") || "";
  const match = cookies.match(new RegExp("(?:^|;\\s*)" + COOKIE + "=([^;]+)"));
  if (!match) return false;

  const [expStr, sig] = match[1].split(".");
  const expiry = Number(expStr);
  if (!Number.isFinite(expiry) || !sig) return false;
  const now = Date.now();
  if (expiry < now) return false; // expired
  if (expiry > now + SESSION_TTL_MS + 60_000) return false; // future-dated / forged

  return safeEqual(sig, await hmacHex(secret, "hq1:" + expiry));
}

function buildCookie(value, maxAgeMs, url, host) {
  let cookie =
    COOKIE + "=" + value + "; Path=/; HttpOnly; SameSite=Lax; Max-Age=" + Math.floor(maxAgeMs / 1000);
  if (url.protocol === "https:") cookie += "; Secure";
  if (host === APEX || host.endsWith("." + APEX)) cookie += "; Domain=." + APEX;
  return cookie;
}

function nextPathFor(url, privateHost) {
  if (url.pathname === "/dev/login" || url.pathname === "/dev/logout") {
    return privateHost ? "/" : "/dev";
  }
  return url.pathname + url.search;
}

// ------------------------------------------------------------
// Crypto helpers (Web Crypto, edge runtime)
// ------------------------------------------------------------
const enc = new TextEncoder();

async function hmacHex(key, message) {
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    enc.encode(key),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", cryptoKey, enc.encode(message));
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

/** Constant-time-ish comparison: HMAC both sides with a random key. */
async function safeEqual(a, b) {
  const key = crypto.getRandomValues(new Uint8Array(32));
  const keyStr = String.fromCharCode(...key);
  const [ha, hb] = await Promise.all([hmacHex(keyStr, a), hmacHex(keyStr, b)]);
  return ha === hb;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ------------------------------------------------------------
// Responses
// ------------------------------------------------------------
function redirect(location, extraHeaders = {}, status = 303) {
  return new Response(null, {
    status,
    headers: { Location: location, "Cache-Control": "no-store", ...extraHeaders },
  });
}

function loginPage(status, notice, home, disabled = false, next = "") {
  const noticeHtml = notice ? '<p class="notice">' + escapeHtml(notice) + "</p>" : "";
  const form = disabled
    ? ""
    : '<form method="post" action="/dev/login">' +
      '<input type="hidden" name="next" value="' + escapeHtml(next || home) + '" />' +
      '<label for="pw">Password</label>' +
      '<input id="pw" type="password" name="password" autocomplete="current-password" autofocus required />' +
      "<button type=\"submit\">Sign in</button>" +
      "</form>";

  const html =
    "<!doctype html>" +
    '<html lang="en"><head><meta charset="utf-8" />' +
    '<meta name="viewport" content="width=device-width, initial-scale=1" />' +
    '<meta name="robots" content="noindex, nofollow" />' +
    "<title>Charger — Staff</title><style>" +
    ":root{--bg:#fbfbf9;--ink:#161613;--muted:#a4a29a;--muted-dark:#6e6c66;--line:#e9e8e3}" +
    "@media (prefers-color-scheme:dark){:root{--bg:#131312;--ink:#e9e8e4;--muted:#63625c;--muted-dark:#93918a;--line:#262623}}" +
    "*{box-sizing:border-box}" +
    "body{margin:0;min-height:100svh;background:var(--bg);color:var(--ink);" +
    "font:400 .875rem/1.5 'Helvetica Neue','Inter','Arial',system-ui,sans-serif;" +
    "padding:clamp(1.25rem,3.5vh,2rem) clamp(1.25rem,4vw,2.5rem);-webkit-font-smoothing:antialiased}" +
    ".top{display:flex;gap:2rem}" +
    ".wordmark{font-weight:500;color:var(--ink);text-decoration:none}" +
    ".where{color:var(--muted)}" +
    "main{margin-top:clamp(5rem,22vh,12rem);max-width:19rem}" +
    ".notice{margin:0 0 1.4rem;color:var(--muted-dark)}" +
    "form{display:grid;gap:.6rem}" +
    "label{color:var(--muted)}" +
    "input[type=password]{width:100%;font:inherit;color:var(--ink);background:transparent;" +
    "border:0;border-bottom:1px solid var(--line);border-radius:0;padding:.25rem 0}" +
    "input[type=password]:focus{outline:none;border-bottom-color:var(--ink)}" +
    "button{font:inherit;color:var(--muted);background:none;border:0;padding:0;cursor:pointer;" +
    "justify-self:start;margin-top:.6rem;transition:color .15s}" +
    "button:hover{color:var(--ink)}" +
    ".fine{margin-top:clamp(4rem,14vh,7rem);font-size:.75rem}" +
    ".fine a{color:var(--muted);text-decoration:none}" +
    ".fine a:hover{color:var(--ink)}" +
    "</style></head><body>" +
    '<header class="top"><a class="wordmark" href="https://' + APEX + '/">C.</a>' +
    '<span class="where">Staff</span></header>' +
    "<main>" +
    noticeHtml +
    form +
    '<p class="fine"><a href="https://' + APEX + '/">&larr; Back to the index</a></p>' +
    "</main>" +
    "</body></html>";

  return new Response(html, {
    status,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Frame-Options": "DENY",
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "strict-origin-when-cross-origin",
      "Content-Security-Policy":
        "default-src 'none'; style-src 'unsafe-inline'; img-src data:; form-action 'self'; base-uri 'none'; frame-ancestors 'none'",
    },
  });
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[c]);
}
