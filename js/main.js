// ============================================================
// Charger — scripts
// ------------------------------------------------------------
// The site is a receipt; this file prints it. Everything about a
// work entry lives in the WORKS array below — the single source
// of truth.
//
// PIPELINE:
//   WORKS (data) → renderItems() → <ol data-items> in index.html
//   plus: date/time/order meta, totals, dept filters, barcode.
//
// To ADD a project: append an object to WORKS. Entries are
// numbered 001..N in source order and displayed reversed
// (highest number prints first). Nothing else to touch.
// ============================================================

/**
 * @typedef {Object} Work
 * @property {string} title  - Project name.
 * @property {string} role   - Your role / the client / the medium.
 * @property {number|string} year - Year (or "2024–25").
 * @property {string} [url]  - Optional link (live site, repo, case study).
 * @property {string[]} [tags] - Optional dept tags (e.g. ["Web","Tool"]).
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
// RENDER — line items
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
 * One receipt line item. Whole row is a link when `url` is present.
 * @param {Work} work
 * @param {number} num 1-based display number
 */
function renderItem(work, num) {
  const li = document.createElement("li");
  li.className = "item";
  if (work.tags) li.dataset.tags = work.tags.join(",");

  const row = document.createElement(work.url ? "a" : "div");
  row.className = "item__row";
  if (work.url) {
    row.href = work.url;
    if (/^https?:/.test(work.url)) {
      row.target = "_blank";
      row.rel = "noopener";
    }
    row.setAttribute("aria-label", `${work.title}, ${work.year}`);
  }

  const dept = work.tags && work.tags.length ? `DEPT:${work.tags.join("/")}` : "";
  row.innerHTML = `
    <span class="item__line">
      <span class="item__num">${pad(num)}</span>
      <span class="item__title">${escapeHtml(work.title)}</span>
      <span class="item__leader" aria-hidden="true"></span>
      <span class="item__year">${escapeHtml(String(work.year))}</span>
    </span>
    <span class="item__sub">
      <span>${escapeHtml(work.role)}</span>
      <span>${escapeHtml(dept)}</span>
    </span>
  `;

  li.appendChild(row);
  return li;
}

/** Print all items into <ol data-items>, newest number first. */
function renderItems() {
  const list = document.querySelector("[data-items]");
  if (!list) return;

  const items = WORKS.map((work, i) => renderItem(work, i + 1)).reverse();
  items.forEach((li, i) => {
    // Staggered "printing" — CSS animates .item; we set the delay here
    // via CSSOM (keeps the strict CSP happy).
    li.style.animationDelay = `${0.15 + i * 0.05}s`;
    list.appendChild(li);
  });
}

// ------------------------------------------------------------
// META — date, time, order #, totals, footer year
// ------------------------------------------------------------
function set(selector, text) {
  const el = document.querySelector(selector);
  if (el) el.textContent = text;
}

function printMeta() {
  const now = new Date();
  const p2 = (n) => String(n).padStart(2, "0");
  const date = `${now.getFullYear()}-${p2(now.getMonth() + 1)}-${p2(now.getDate())}`;
  const time = `${p2(now.getHours())}:${p2(now.getMinutes())}`;

  set("[data-date]", date);
  set("[data-time]", time);
  set("[data-order]", `CT-${date.replaceAll("-", "")}-${p2(now.getHours())}${p2(now.getMinutes())}`);
  set("[data-year]", String(now.getFullYear()));

  set("[data-items-count]", String(WORKS.length));
  const years = WORKS.map((w) => parseInt(String(w.year), 10)).filter(Boolean);
  if (years.length) {
    const lo = Math.min(...years);
    const hi = Math.max(...years);
    set("[data-items-years]", lo === hi ? String(hi) : `${lo}–${String(hi).slice(2)}`);
  }
}

// ------------------------------------------------------------
// DEPT FILTERS — generated from tags; hidden if fewer than 2.
// ------------------------------------------------------------
function buildDepts() {
  const wrap = document.querySelector("[data-depts]");
  if (!wrap) return;

  const tags = [...new Set(WORKS.flatMap((w) => w.tags || []))];
  if (tags.length < 2) return;

  wrap.hidden = false;
  const makeBtn = (label, value, pressed) => {
    const b = document.createElement("button");
    b.className = "bracket";
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
    document.querySelectorAll("[data-items] .item").forEach((li) => {
      const tags = (li.dataset.tags || "").split(",");
      li.hidden = value !== "*" && !tags.includes(value);
    });
  });
}

// ------------------------------------------------------------
// BARCODE — decorative, deterministic from a seed string.
// ------------------------------------------------------------
function printBarcode() {
  const el = document.querySelector("[data-barcode]");
  if (!el) return;

  // Tiny string hash → mulberry32 PRNG, so the barcode is stable.
  let h = 2166136261;
  const seed = "charger.tools";
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  const rand = () => {
    h = Math.imul(h ^ (h >>> 15), h | 1);
    h ^= h + Math.imul(h ^ (h >>> 7), h | 61);
    return ((h ^ (h >>> 14)) >>> 0) / 4294967296;
  };

  const frag = document.createDocumentFragment();
  for (let i = 0; i < 42; i++) {
    const bar = document.createElement("span");
    bar.style.width = `${1 + Math.floor(rand() * 3)}px`;
    if (rand() > 0.72) bar.style.width = "4px";
    frag.appendChild(bar);
  }
  el.appendChild(frag);
}

// ------------------------------------------------------------
// BOOT
// ------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  renderItems();
  printMeta();
  buildDepts();
  printBarcode();
});
