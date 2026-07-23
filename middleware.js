// ============================================================
// Charger — Vercel Edge Middleware (the staff door)
// ------------------------------------------------------------
// Runs on EVERY request, before routing/rewrites. Public traffic
// falls through untouched. Private traffic — /hq, /_private, or
// any host on PRIVATE_HOSTS (e.g. hq.charger.tools) — requires a
// signed session cookie, obtained by POSTing the password to
// /hq/login (the login page is rendered right here).
//
// Auth model:
//   • HQ_PASSWORD          — the password (Vercel env var)
//   • HQ_SESSION_SECRET    — HMAC key for session cookies (env var)
//   • Cookie: chg_hq=<expiryMs>.<hmacSHA256(secret, "hq1:"+expiryMs)>
//     HttpOnly, SameSite=Lax, Secure, 7-day expiry,
//     Domain=.charger.tools in prod so it spans subdomains.
//
// FAILS CLOSED: if either env var is missing, the private area
// serves a 503 "register closed" page and nothing else.
//
// To add another private subdomain: create _private/<name>/,
// add "<name>." below, and add a host rewrite in vercel.json.
// ============================================================

const COOKIE = "chg_hq";
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
const PRIVATE_HOSTS = ["hq."]; // host prefixes that are staff-only
const PRIVATE_PATH = /^\/(hq|_private)(\/|$)/;
const APEX = "charger.tools"; // cookies span *.charger.tools

export default async function middleware(request) {
  const url = new URL(request.url);
  const host = (request.headers.get("host") || url.hostname).toLowerCase().split(":")[0];
  const privateHost = PRIVATE_HOSTS.some((p) => host.startsWith(p));
  const privatePath = PRIVATE_PATH.test(url.pathname);

  if (!privateHost && !privatePath) return; // public — pass through

  const password = process.env.HQ_PASSWORD;
  const secret = process.env.HQ_SESSION_SECRET;
  if (!password || !secret) {
    // Fail closed: no credentials configured, no door.
    return loginPage(503, "REGISTER CLOSED — SET HQ_PASSWORD + HQ_SESSION_SECRET", "/", true);
  }

  const home = privateHost ? "/" : "/hq";

  // --- Log out -------------------------------------------------------
  if (url.pathname === "/hq/logout") {
    return redirect(home === "/" ? "https://" + APEX + "/" : "/", {
      "Set-Cookie": buildCookie("", 0, url, host),
    });
  }

  // --- Log in --------------------------------------------------------
  if (url.pathname === "/hq/login" && request.method === "POST") {
    // Same-origin form posts only (CSRF).
    const origin = request.headers.get("origin");
    if (origin) {
      let originHost = "";
      try {
        originHost = new URL(origin).hostname.toLowerCase();
      } catch {}
      if (originHost !== host) return loginPage(403, "CROSS-ORIGIN POST REFUSED", home);
    }

    let attempt = "";
    let next = home;
    try {
      const form = await request.formData();
      attempt = String(form.get("password") || "");
      const rawNext = String(form.get("next") || "");
      if (/^\/(?!\/)/.test(rawNext)) next = rawNext; // internal paths only
    } catch {
      return loginPage(400, "MALFORMED REQUEST", home);
    }

    if (await safeEqual(attempt, password)) {
      const expiry = Date.now() + SESSION_TTL_MS;
      const token = expiry + "." + (await hmacHex(secret, "hq1:" + expiry));
      return redirect(next, {
        "Set-Cookie": buildCookie(token, SESSION_TTL_MS, url, host),
      });
    }

    await sleep(400); // mildly slow down brute force
    return loginPage(401, "INCORRECT PASSWORD — TRY AGAIN", home, false, nextPathFor(url, privateHost));
  }

  // --- Session check -------------------------------------------------
  if (await hasValidSession(request, secret)) return; // continue to static files

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
  if (url.pathname === "/hq/login" || url.pathname === "/hq/logout") {
    return privateHost ? "/" : "/hq";
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
function redirect(location, extraHeaders = {}) {
  return new Response(null, {
    status: 303,
    headers: { Location: location, "Cache-Control": "no-store", ...extraHeaders },
  });
}

function loginPage(status, notice, home, disabled = false, next = "") {
  const noticeHtml = notice
    ? '<p class="notice">** ' + escapeHtml(notice) + " **</p>"
    : "";
  const form = disabled
    ? ""
    : '<form method="post" action="/hq/login">' +
      '<input type="hidden" name="next" value="' + escapeHtml(next || home) + '" />' +
      '<label class="k" for="pw">Staff password</label>' +
      '<input id="pw" type="password" name="password" autocomplete="current-password" autofocus required />' +
      '<button type="submit">[ Sign in ]</button>' +
      "</form>";

  const html =
    "<!doctype html>" +
    '<html lang="en"><head><meta charset="utf-8" />' +
    '<meta name="viewport" content="width=device-width, initial-scale=1" />' +
    '<meta name="robots" content="noindex, nofollow" />' +
    "<title>Charger — Staff Only</title><style>" +
    ":root{--desk:#17161a;--paper:#faf7ef;--ink:#26231b;--ink-soft:#5d5849;--ink-faint:#948d7b}" +
    "*{box-sizing:border-box}" +
    "body{margin:0;min-height:100svh;display:grid;place-items:center;padding:1.5rem .9rem;" +
    "font-family:ui-monospace,'SF Mono','Menlo','Consolas','Courier New',monospace;" +
    "font-size:.92rem;letter-spacing:.03em;line-height:1.55;color:var(--ink);" +
    "background:var(--desk) radial-gradient(120% 90% at 50% 0%,#17161a 40%,#0d0c10 100%) fixed}" +
    ".wrap{width:min(21rem,100%);transform:rotate(-.5deg);" +
    "filter:drop-shadow(0 2px 3px rgba(0,0,0,.3)) drop-shadow(0 24px 40px rgba(0,0,0,.45))}" +
    ".tear{height:12px;background-repeat:repeat-x}" +
    ".tear.t{background-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='12'%3E%3Cpath d='M0 12L7 0l7 12z' fill='%23faf7ef'/%3E%3C/svg%3E\")}" +
    ".tear.b{background-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='12'%3E%3Cpath d='M0 0l7 12L14 0z' fill='%23faf7ef'/%3E%3C/svg%3E\")}" +
    ".card{background:var(--paper);padding:1.7rem 1.5rem 1.9rem;text-align:center}" +
    "h1{margin:0;font-size:1.3rem;font-weight:800;letter-spacing:.24em;text-indent:.24em;text-transform:uppercase}" +
    ".sub{margin:.35rem 0 0;font-size:.8rem;letter-spacing:.18em;text-transform:uppercase;color:var(--ink-soft)}" +
    ".stars{margin:1rem 0;letter-spacing:.55ch;color:var(--ink-soft);white-space:nowrap;overflow:hidden}" +
    ".notice{margin:0 0 1rem;font-size:.8rem;letter-spacing:.08em;text-transform:uppercase}" +
    "form{display:grid;gap:.7rem;justify-items:center}" +
    ".k{font-size:.8rem;letter-spacing:.12em;text-transform:uppercase;color:var(--ink-soft)}" +
    "input[type=password]{width:100%;font:inherit;letter-spacing:.3ch;text-align:center;color:var(--ink);" +
    "background:transparent;border:0;border-bottom:2px dotted rgba(38,35,27,.4);padding:.3rem .2rem}" +
    "input[type=password]:focus{outline:none;border-bottom-color:var(--ink)}" +
    "button{font:inherit;letter-spacing:.12em;text-transform:uppercase;color:var(--ink-soft);" +
    "background:none;border:0;cursor:pointer;margin-top:.3rem}" +
    "button:hover{color:var(--ink)}" +
    ".fine{margin:1.4rem 0 0;font-size:.7rem;letter-spacing:.1em;text-transform:uppercase;color:var(--ink-faint)}" +
    ".fine a{color:inherit;text-decoration:underline dotted;text-underline-offset:3px}" +
    "</style></head><body>" +
    '<div class="wrap"><div class="tear t"></div><main class="card">' +
    "<h1>Charger</h1>" +
    '<p class="sub">Staff Only</p>' +
    '<div class="stars">* * * * * * * * * * * *</div>' +
    noticeHtml +
    form +
    '<p class="fine"><a href="https://' + APEX + '/">&larr; Customer side</a></p>' +
    "</main><div class=\"tear b\"></div></div>" +
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
