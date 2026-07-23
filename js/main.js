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

  wrap.appendChild(makeBtn("All", "*", true));
  tags.forEach((t) => wrap.appendChild(makeBtn(t, t, false)));

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
// BOOT
// ------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  renderIndex();
  renderMeta();
  buildFilters();
  initSpy();
  initCopy();
});
