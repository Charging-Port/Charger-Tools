// ============================================================
// Charger — scripts
// ------------------------------------------------------------
// Everything about a work entry lives in the WORKS array below —
// the single source of truth.
//
// PIPELINE:
//   WORKS (data) → renderIndex() → <ol data-items> in index.html
//   plus: header filters, footer count/years, © year.
//
// To ADD a project: append an object to WORKS. Entries are
// numbered 001..N in source order and displayed reversed
// (highest number first). Nothing else to touch.
// ============================================================

/**
 * @typedef {Object} Work
 * @property {string} title  - Project name.
 * @property {string} role   - Your role / the client / the medium.
 * @property {number|string} year - Year (or "2024–25").
 * @property {string} [url]  - Optional link (live site, repo, case study).
 * @property {string[]} [tags] - Optional filter tags (e.g. ["Web","Tool"]).
 */

/** @type {Work[]} */
const WORKS = [
  // --- Placeholder entries. Replace with real work. -----------------
  { title: "Placeholder Project One", role: "Design & Build", year: 2026, tags: ["Web"], url: "#" },
  { title: "Placeholder Project Two", role: "Tool", year: 2025, tags: ["Tool"], url: "#" },
  { title: "Placeholder Project Three", role: "Experiment", year: 2025, tags: ["Web"], url: "#" },
  { title: "Placeholder Project Four", role: "Client Work", year: 2024, tags: ["Client"], url: "#" },
];

// ------------------------------------------------------------
// RENDER
// ------------------------------------------------------------

/** Zero-pad an index to 3 digits: 7 → "007". */
function pad(n) {
  return String(n).padStart(3, "0");
}

function escapeHtml(str) {
  return str.replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[c]);
}

/**
 * One index row. The whole row is a link when `url` is present.
 * @param {Work} work
 * @param {number} num 1-based display number
 */
function renderRow(work, num) {
  const li = document.createElement("li");
  li.className = "work";
  if (work.tags) li.dataset.tags = work.tags.join(",");

  const row = document.createElement(work.url ? "a" : "div");
  row.className = "row grid";
  if (work.url) {
    row.href = work.url;
    if (/^https?:/.test(work.url)) {
      row.target = "_blank";
      row.rel = "noopener";
      row.classList.add("ext"); // shows the ↗ hint on hover
    }
    row.setAttribute("aria-label", `${work.title}, ${work.year}`);
  }

  row.innerHTML = `
    <span class="c-num">${pad(num)}</span>
    <span class="c-title">${escapeHtml(work.title)}</span>
    <span class="c-role">${escapeHtml(work.role)}</span>
    <span class="c-year">${escapeHtml(String(work.year))}</span>
  `;

  li.appendChild(row);
  return li;
}

/** Render all rows into <ol data-items>, newest number first. */
function renderIndex() {
  const list = document.querySelector("[data-items]");
  if (!list) return;

  const rows = WORKS.map((work, i) => renderRow(work, i + 1)).reverse();
  rows.forEach((li, i) => {
    // Staggered entrance — delay set via CSSOM (CSP-safe).
    li.style.animationDelay = `${0.05 + i * 0.03}s`;
    list.appendChild(li);
  });
}

// ------------------------------------------------------------
// META — footer count, year span, © year
// ------------------------------------------------------------
function set(selector, text) {
  const el = document.querySelector(selector);
  if (el) el.textContent = text;
}

function renderMeta() {
  set("[data-count]", pad(WORKS.length));
  set("[data-year]", String(new Date().getFullYear()));

  const years = WORKS.map((w) => parseInt(String(w.year), 10)).filter(Boolean);
  if (years.length) {
    const lo = Math.min(...years);
    const hi = Math.max(...years);
    set("[data-years]", lo === hi ? String(hi) : `${lo}–${hi}`);
  }
}

// ------------------------------------------------------------
// FILTERS — a comma-separated word list in the header,
// generated from tags; hidden if fewer than 2 distinct tags.
// ------------------------------------------------------------
function buildFilters() {
  const wrap = document.querySelector("[data-filters]");
  if (!wrap) return;

  const tags = [...new Set(WORKS.flatMap((w) => w.tags || []))];
  if (tags.length < 2) return;

  const makeBtn = (label, value, pressed) => {
    const b = document.createElement("button");
    b.className = "filter";
    b.textContent = label;
    b.dataset.filter = value;
    b.setAttribute("aria-pressed", String(pressed));
    return b;
  };

  const makeSep = () => {
    const s = document.createElement("span");
    s.className = "sep";
    s.setAttribute("aria-hidden", "true");
    s.textContent = ",";
    return s;
  };

  wrap.appendChild(makeBtn("All", "*", true));
  tags.forEach((t) => {
    wrap.appendChild(makeSep());
    wrap.appendChild(makeBtn(t, t, false));
  });

  wrap.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-filter]");
    if (!btn) return;
    wrap
      .querySelectorAll("[data-filter]")
      .forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
    const value = btn.dataset.filter;
    document.querySelectorAll("[data-items] .work").forEach((li) => {
      const tags = (li.dataset.tags || "").split(",");
      li.hidden = value !== "*" && !tags.includes(value);
    });
  });
}

// ------------------------------------------------------------
// SCROLL-SPY — darken the About/Contact header links while
// their section is in view.
// ------------------------------------------------------------
function initSpy() {
  if (!("IntersectionObserver" in window)) return;
  const pairs = [
    ["about", ".about-link"],
    ["contact", ".contact-link"],
  ];
  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const pair = pairs.find(([id]) => id === entry.target.id);
        const link = pair && document.querySelector(pair[1]);
        if (link) link.classList.toggle("active", entry.isIntersecting);
      });
    },
    { rootMargin: "-25% 0px -25% 0px" }
  );
  pairs.forEach(([id]) => {
    const el = document.getElementById(id);
    if (el) spy.observe(el);
  });
}

// ------------------------------------------------------------
// COPY — progressive enhancement: a small "Copy" button after
// any element with data-copy (used for the email address).
// ------------------------------------------------------------
function initCopy() {
  if (!navigator.clipboard) return;
  document.querySelectorAll("[data-copy]").forEach((el) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "copy-btn";
    btn.textContent = "Copy";
    btn.setAttribute("aria-label", `Copy ${el.dataset.copy}`);
    btn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(el.dataset.copy);
        btn.textContent = "Copied";
        btn.classList.add("did");
        setTimeout(() => {
          btn.textContent = "Copy";
          btn.classList.remove("did");
        }, 1600);
      } catch {
        /* clipboard unavailable — leave the button as-is */
      }
    });
    el.after(btn);
  });
}

// ------------------------------------------------------------
// CURSOR — a small dot with a trailing ring. Fine pointers only;
// skipped entirely under prefers-reduced-motion. Blend-mode
// difference (in CSS) keeps it visible over paper, chips, and
// dark mode.
// ------------------------------------------------------------
function initCursor() {
  if (!window.matchMedia("(pointer: fine)").matches) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const dot = document.createElement("div");
  dot.className = "cursor-dot";
  const ring = document.createElement("div");
  ring.className = "cursor-ring";
  dot.setAttribute("aria-hidden", "true");
  ring.setAttribute("aria-hidden", "true");
  document.body.append(dot, ring);
  document.documentElement.classList.add("has-cursor");

  const HOVER = "a, button, input, textarea, label, [role='button']";
  let x = innerWidth / 2;
  let y = innerHeight / 2;
  let rx = x;
  let ry = y;
  let ringScale = 1;
  let overLink = false;
  let pressed = false;
  let shown = false;

  addEventListener(
    "pointermove",
    (e) => {
      x = e.clientX;
      y = e.clientY;
      if (!shown) {
        shown = true;
        rx = x;
        ry = y;
        dot.style.opacity = "1";
        ring.style.opacity = "1";
      }
      dot.style.transform = `translate(${x}px, ${y}px)`;
      overLink = !!(e.target.closest && e.target.closest(HOVER));
    },
    { passive: true }
  );
  document.documentElement.addEventListener("pointerleave", () => {
    shown = false;
    dot.style.opacity = "0";
    ring.style.opacity = "0";
  });
  addEventListener("pointerdown", () => (pressed = true));
  addEventListener("pointerup", () => (pressed = false));

  (function loop() {
    const target = (overLink ? 1.7 : 1) * (pressed ? 0.8 : 1);
    rx += (x - rx) * 0.16;
    ry += (y - ry) * 0.16;
    ringScale += (target - ringScale) * 0.16;
    ring.style.transform = `translate(${rx}px, ${ry}px) scale(${ringScale})`;
    requestAnimationFrame(loop);
  })();
}

// ------------------------------------------------------------
// CLOCK — a small live HH:MM in the footer; the colon blinks
// via CSS. Purely a sign of life.
// ------------------------------------------------------------
function initClock() {
  const el = document.querySelector("[data-clock]");
  if (!el) return;
  const p2 = (n) => String(n).padStart(2, "0");
  const tick = () => {
    const now = new Date();
    el.innerHTML = "";
    el.append(p2(now.getHours()));
    const colon = document.createElement("span");
    colon.className = "clock-colon";
    colon.textContent = ":";
    el.append(colon, p2(now.getMinutes()));
  };
  tick();
  setInterval(tick, 20 * 1000);
}

// ------------------------------------------------------------
// REVEAL — sections fade up as they enter the viewport.
// (CSS hides them only when html.js is set, so no-JS still works.)
// ------------------------------------------------------------
function initReveal() {
  const targets = [...document.querySelectorAll(".section, .footer")];
  if (!targets.length) return;
  const reveal = (el) => el.classList.add("in");

  if (!("IntersectionObserver" in window)) {
    targets.forEach(reveal);
    return;
  }

  let ioFired = false;
  const io = new IntersectionObserver(
    (entries) => {
      ioFired = true;
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          reveal(entry.target);
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08 }
  );

  targets.forEach((el) => {
    // Anything already in view reveals immediately — content must
    // never wait on the observer.
    const r = el.getBoundingClientRect();
    if (r.top < innerHeight && r.bottom > 0) reveal(el);
    else io.observe(el);
  });

  // Fail-open: a healthy engine always fires the initial callback.
  // If it never comes (broken embedders), show everything.
  setTimeout(() => {
    if (!ioFired) targets.forEach(reveal);
  }, 1500);
}

// ------------------------------------------------------------
// BOOT
// ------------------------------------------------------------
document.documentElement.classList.add("js");

document.addEventListener("DOMContentLoaded", () => {
  renderIndex();
  renderMeta();
  buildFilters();
  initSpy();
  initCopy();
  initCursor();
  initClock();
  initReveal();
});
