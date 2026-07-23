// ============================================================
// Charger — scripts
// ------------------------------------------------------------
// CONTENT lives in /content.json (works, about, contact) — the
// single source of truth, editable from the dev dashboard. This
// file fetches it and renders the page; if the fetch fails, the
// FALLBACK works below and the baked-in HTML keep the page whole.
//
// PIPELINE:
//   /content.json → render works / about / contact
//   plus: header filters, footer meta, hover previews, scroll-spy,
//   copy buttons, custom cursor, clock, reveals.
//
// Text fields support minimal emphasis: *italic* and **bold**.
// ============================================================

/**
 * @typedef {Object} Work
 * @property {string} title  - Project name.
 * @property {string} type   - Type / medium / client. (Column T.)
 * @property {number|string} year - Year (or "2024–25").
 * @property {string} [url]  - Optional link (live site, repo, case study).
 * @property {string} [media] - Optional preview image (assets/images/…).
 * @property {string[]} [tags] - Optional filter tags (e.g. ["Web","Tool"]).
 */

/** @type {Work[]} Fallback if /content.json can't be fetched. */
const FALLBACK_WORKS = [
  { title: "Placeholder Project One", type: "Design & Build", year: 2026, tags: ["Web"], url: "#" },
  { title: "Placeholder Project Two", type: "Tool", year: 2025, tags: ["Tool"], url: "#" },
  { title: "Placeholder Project Three", type: "Experiment", year: 2025, tags: ["Web"], url: "#" },
  { title: "Placeholder Project Four", type: "Client Work", year: 2024, tags: ["Client"], url: "#" },
];

// ------------------------------------------------------------
// CONTENT
// ------------------------------------------------------------
async function loadContent() {
  try {
    const res = await fetch("/content.json", { cache: "no-cache" });
    if (!res.ok) throw new Error(String(res.status));
    const data = await res.json();
    if (!Array.isArray(data.works)) throw new Error("bad shape");
    return data;
  } catch {
    return { works: FALLBACK_WORKS, about: null, contact: null };
  }
}

// ------------------------------------------------------------
// UTIL
// ------------------------------------------------------------
function pad(n) {
  return String(n).padStart(3, "0");
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

/** Escape, then allow **bold** and *italic* only. */
function richText(str) {
  return escapeHtml(str)
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>");
}

// ------------------------------------------------------------
// RENDER — index rows
// ------------------------------------------------------------

/** Preview image for a work: its media, or a generated number card. */
function thumbFor(work, num) {
  if (work.media) return work.media;
  const svg =
    "<svg xmlns='http://www.w3.org/2000/svg' width='480' height='320'>" +
    "<rect width='480' height='320' fill='#f4f3ef'/>" +
    "<rect x='1' y='1' width='478' height='318' fill='none' stroke='#dddbd4' stroke-width='2'/>" +
    "<text x='34' y='216' font-family='Space Grotesk, Helvetica, Arial, sans-serif' font-size='150' font-weight='500' fill='#d9d7d0'>" +
    pad(num) +
    "</text></svg>";
  return "data:image/svg+xml," + encodeURIComponent(svg);
}

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
  row.dataset.thumb = thumbFor(work, num);

  row.innerHTML = `
    <span class="c-num">${pad(num)}</span>
    <span class="c-title">${escapeHtml(work.title)}</span>
    <span class="c-role">${escapeHtml(work.type || work.role || "")}</span>
    <span class="c-year">${escapeHtml(String(work.year))}</span>
  `;

  li.appendChild(row);
  return li;
}

function renderIndex(works) {
  const list = document.querySelector("[data-items]");
  if (!list) return;

  const rows = works.map((work, i) => renderRow(work, i + 1)).reverse();
  rows.forEach((li, i) => {
    li.style.animationDelay = `${0.05 + i * 0.03}s`;
    list.appendChild(li);
  });
}

// ------------------------------------------------------------
// RENDER — about + contact (leave baked HTML if content missing)
// ------------------------------------------------------------
function renderAbout(about) {
  const body = document.querySelector("[data-about-body]");
  if (!body || !about) return;
  const parts = [];
  if (about.lede) parts.push(`<p class="lede">${richText(about.lede)}</p>`);
  (about.paragraphs || []).forEach((p) => parts.push(`<p>${richText(p)}</p>`));
  if (parts.length) body.innerHTML = parts.join("");
}

function renderContact(contact) {
  const list = document.querySelector("[data-contact-list]");
  if (!list || !contact || !contact.length) return;
  list.innerHTML = "";
  contact.forEach((row) => {
    const li = document.createElement("li");
    const k = document.createElement("span");
    k.className = "k";
    k.textContent = row.label;
    li.appendChild(k);

    let v;
    if (row.href) {
      v = document.createElement("a");
      v.href = row.href;
      if (/^https?:/.test(row.href)) {
        v.rel = "me noopener";
        v.target = "_blank";
      }
    } else {
      v = document.createElement("span");
    }
    v.textContent = row.value;
    if (row.href && row.href.startsWith("mailto:")) v.dataset.copy = row.value;
    li.appendChild(v);
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

function renderMeta(works) {
  set("[data-count]", pad(works.length));
  set("[data-year]", String(new Date().getFullYear()));

  const years = works.map((w) => parseInt(String(w.year), 10)).filter(Boolean);
  if (years.length) {
    const lo = Math.min(...years);
    const hi = Math.max(...years);
    set("[data-years]", lo === hi ? String(hi) : `${lo}–${hi}`);
  }
}

// ------------------------------------------------------------
// FILTERS — comma-separated word list from tags; hidden if < 2.
// ------------------------------------------------------------
function buildFilters(works) {
  const wrap = document.querySelector("[data-filters]");
  if (!wrap) return;

  const tags = [...new Set(works.flatMap((w) => w.tags || []))];
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
// PREVIEW — a floating image that trails the cursor over index
// rows, in the manner of the Watanabe / Archivio references.
// Fine pointers only.
// ------------------------------------------------------------
function initPreview() {
  if (!window.matchMedia("(pointer: fine)").matches) return;
  const list = document.querySelector("[data-items]");
  if (!list) return;

  const box = document.createElement("div");
  box.className = "preview";
  box.setAttribute("aria-hidden", "true");
  const img = document.createElement("img");
  img.alt = "";
  box.appendChild(img);
  document.body.appendChild(box);

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let x = 0;
  let y = 0;
  let px = 0;
  let py = 0;
  let visible = false;
  let raf = null;

  function place() {
    box.style.transform = `translate(${px}px, ${py}px)`;
  }
  function loop() {
    px += (x - px) * (reduce ? 1 : 0.14);
    py += (y - py) * (reduce ? 1 : 0.14);
    place();
    raf = visible ? requestAnimationFrame(loop) : null;
  }

  list.addEventListener("pointerover", (e) => {
    const row = e.target.closest(".row");
    if (!row || !list.contains(row)) return;
    const src = row.dataset.thumb;
    if (!src) return;
    if (img.getAttribute("src") !== src) img.src = src;
    if (!visible) {
      visible = true;
      px = x = e.clientX + 28;
      py = y = e.clientY - 90;
      place();
      box.classList.add("on");
      if (!raf) raf = requestAnimationFrame(loop);
    }
  });
  list.addEventListener("pointermove", (e) => {
    x = e.clientX + 28;
    y = e.clientY - 90;
  });
  list.addEventListener("pointerleave", () => {
    visible = false;
    box.classList.remove("on");
  });
}

// ------------------------------------------------------------
// SCROLL-SPY
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
// COPY — small "Copy" button after any [data-copy] element.
// ------------------------------------------------------------
function initCopy() {
  if (!navigator.clipboard) return;
  document.querySelectorAll("[data-copy]").forEach((el) => {
    if (el.nextElementSibling && el.nextElementSibling.classList.contains("copy-btn")) return;
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
        /* clipboard unavailable */
      }
    });
    el.after(btn);
  });
}

// ------------------------------------------------------------
// CURSOR — dot + trailing ring; fine pointers, no reduced motion.
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
// CLOCK — live HH:MM in the footer.
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
// REVEAL — sections fade up as they enter the viewport (fail-open).
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
    const r = el.getBoundingClientRect();
    if (r.top < innerHeight && r.bottom > 0) reveal(el);
    else io.observe(el);
  });

  setTimeout(() => {
    if (!ioFired) targets.forEach(reveal);
  }, 1500);
}

// ------------------------------------------------------------
// BOOT
// ------------------------------------------------------------
document.documentElement.classList.add("js");

document.addEventListener("DOMContentLoaded", async () => {
  const content = await loadContent();

  renderIndex(content.works);
  renderMeta(content.works);
  buildFilters(content.works);
  renderAbout(content.about);
  renderContact(content.contact);

  initPreview();
  initSpy();
  initCopy();
  initCursor();
  initClock();
  initReveal();
});
