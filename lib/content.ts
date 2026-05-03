import { kvGet, kvSet } from "./storage";
import { getAllProducts as readProductsFromDisk } from "./products";
import { getAllPosts as readPostsFromDisk } from "./blog";
import type { Product, ProductStatus, BlogPost } from "@/types";
import { safeUrl } from "./utils";

/**
 * The single source of typed admin-editable content for the public site.
 *
 * Every editable scope has:
 *  - a baked-in default (so the site renders even when KV is empty)
 *  - a KV key (`ct:content:<scope>`) that, when present, overrides the default
 *  - a Zod-style validator that runs on every write so a malformed payload
 *    can never silently corrupt the visible site
 *
 * `products` and `blog` use the existing on-disk content as the default;
 * once an admin saves through the inline UI, the saved snapshot lives in KV
 * and supersedes the disk content for all readers.
 */

// ── Types ────────────────────────────────────────────────────────────────────

export interface HeroCurrentlyItem {
  label: string;
  text: string;
  href?: string;
}

export interface HeroContent {
  eyebrow: string;
  headline: string; // markdown-ish; supports **bold** and *italic accent*
  intro: string[]; // paragraphs of plain text (HTML stripped at render)
  links: { label: string; href: string }[];
  currentlySidebar: {
    title: string;
    items: HeroCurrentlyItem[];
  };
}

export interface AboutContent {
  eyebrow: string;
  title: string;
  lead: string;
  paragraphs: string[];
  pullQuote: string;
  quickFacts: { k: string; v: string }[];
  timeline: { period: string; title: string; description: string }[];
  skills: { category: string; items: string[] }[];
  music: { instrument: string; period: string; detail: string }[];
}

export interface NowSection {
  label: string;
  items: { title: string; body: string; href?: string }[];
}

export interface NowContent {
  eyebrow: string;
  title: string;
  intro: string;
  sections: NowSection[];
}

export type Scope = "hero" | "about" | "now" | "products" | "blog";

export interface ScopeMap {
  hero: HeroContent;
  about: AboutContent;
  now: NowContent;
  products: Product[];
  blog: BlogPost[];
}

// ── Defaults ─────────────────────────────────────────────────────────────────

export const DEFAULT_HERO: HeroContent = {
  eyebrow: "Studio time",
  headline:
    "I build *native macOS apps*, *computer-vision systems*, and the occasional *pair of AR glasses*.",
  intro: [
    "Junior at Bellarmine College Prep. Co-founder and engineering lead of Hyperform Fitness, a CV platform that watches a lifter mid-set and corrects their form before the rep is over — over a million reps analyzed across pilot installations.",
    "Under ChargerTools LLC I ship native Mac apps — Meridian, Probe, Zenith, Futz — and tinker with wearable AR, optics, and RF on the side.",
  ],
  links: [
    { label: "See the work →", href: "/products" },
    { label: "About", href: "/about" },
    { label: "Now", href: "/now" },
    { label: "Say hi", href: "/contact" },
  ],
  currentlySidebar: {
    title: "Currently",
    items: [
      { label: "Building", text: "Meridian", href: "/products/meridian" },
      { label: "Shipping", text: "Probe", href: "/products/probe" },
      { label: "Reading", text: "Antenna theory" },
    ],
  },
};

export const DEFAULT_ABOUT: AboutContent = {
  eyebrow: "About · Vol. 01",
  title: "About *me*.",
  lead: "I'm Kaden MacLean — a junior at Bellarmine College Prep building at the intersection of hardware, software, and human movement.",
  paragraphs: [
    "I co-founded Hyperform Fitness, a computer-vision startup that tracks human movement in real time and delivers corrective feedback to athletes during their actual sets — not minutes later in a video review, but right then, while the bar is still on their back. We've analyzed over a million reps across gyms, rehab centers, and sports medicine programs.",
    "I also run ChargerTools LLC, where I build native macOS applications and dive into hardware projects: ChargerAgent (a Swift AI agent with real tool use), Charger Mail (a privacy-first email client with local AI), Meridian (a calm, keyboard-first life-OS), Probe (a notch-anchored class copilot that runs entirely on-device), and a series of physics simulators that started as research tools for my AR glasses prototype.",
    "I'm on FRC Team 254 (The Cheesy Poofs), where I work in manufacturing, assembly & wiring, and serve as Human Player. I was selected to the FIRST Hall of Fame Student Advisory Council and represent Team 254 for 2025–2026. I previously captained a CyberPatriot team to National Semi-Finalist in Linux security competition, and was an invited speaker at Georgetown's NSLC on nuclear-weapons threats to homeland security.",
    "When I'm not in front of a screen or a lathe, I'm playing piano, cello, viola, or bass — principal bassist of BCP Chamber Orchestra and a classical pianist since I was four. There's a thread between practicing a Chopin etude and debugging a pose-estimation pipeline that I find hard to articulate but easy to feel.",
  ],
  pullQuote:
    "The discipline carries over into engineering — both require obsession with detail, deliberate practice, and the patience to slow down on the parts that aren't working yet.",
  quickFacts: [
    { k: "Born", v: "2008" },
    { k: "School", v: "Bellarmine '27" },
    { k: "Based", v: "Soquel, CA" },
    { k: "Company", v: "ChargerTools LLC" },
    { k: "Co-founded", v: "Hyperform Fitness" },
    { k: "Team", v: "FRC 254 — Cheesy Poofs" },
    { k: "Instruments", v: "Piano · Cello · Viola · Bass" },
    { k: "Languages", v: "Swift · Python · TypeScript" },
  ],
  timeline: [
    {
      period: "2025 — Present",
      title: "Hyperform Fitness — Co-Founder & Engineering Lead",
      description:
        "Co-founded a computer vision startup building real-time movement analysis at 30fps. Architecting an edge-first inference pipeline now deployed across gyms, rehab centers, and sports medicine programs — over 1M reps analyzed. Managing a team of interns across software, hardware, and deployment.",
    },
    {
      period: "2025 — 2026",
      title: "FIRST Hall of Fame Student Advisory Council",
      description:
        "Selected as Team 254 Student Representative. Representing one of the world's top-ranked FRC teams on the future of student robotics.",
    },
    {
      period: "Summer 2025",
      title: "Georgetown NSLC — Invited Speaker",
      description:
        "Delivered a presentation at Georgetown University's International Security Conference on foreign nuclear weapons threats and crude nuclear device proliferation.",
    },
    {
      period: "2024 — Present",
      title: "FRC Team 254 — The Cheesy Poofs",
      description:
        "Manufacturing, Assembly & Wiring, Human Player. Trained on CNC router, lathe, TIG welding, mill, shear, and brake. Contributed to fabrication and in-competition repairs at Sacramento Regional, East Bay Regional, and the Houston World Championships — where the team won the Autonomous Award.",
    },
    {
      period: "2024 — Present",
      title: "ChargerTools LLC — Founder",
      description:
        "Native macOS development and personal R&D. Built Meridian, Probe, ChargerAgent, Charger Mail, Futz, Zenith, an interactive optics simulator, and an RF radar simulator with 3D penetration physics.",
    },
    {
      period: "2023 — 2024",
      title: "CyberPatriot — Team Captain",
      description:
        "Led a four-person competitive cybersecurity team to National Semi-Finalist placement, specializing in Linux system hardening and timed security operations.",
    },
  ],
  skills: [
    {
      category: "Programming",
      items: ["Python", "Swift", "TypeScript", "JavaScript", "Linux CLI"],
    },
    {
      category: "Frameworks",
      items: [
        "SwiftUI",
        "AppKit",
        "Anthropic API",
        "OAuth2/PKCE",
        "OpenCV",
        "WhisperKit",
      ],
    },
    {
      category: "Manufacturing",
      items: [
        "CNC Router",
        "Lathe",
        "TIG Welding",
        "Mill",
        "Brake",
        "Soldering",
        "PCB Design",
        "CAD",
      ],
    },
    {
      category: "Systems",
      items: [
        "Embedded Linux",
        "Cybersecurity",
        "Networking",
        "Computer Vision",
        "3D Pose Estimation",
        "RF & Optics",
      ],
    },
  ],
  music: [
    {
      instrument: "Piano",
      period: "2012 — Present",
      detail: "Concert pianist, training toward CMTA Level 10",
    },
    {
      instrument: "Cello",
      period: "2020 — Present",
      detail: "Honors Performance Series Runner-up",
    },
    {
      instrument: "Viola",
      period: "2021 — Present",
      detail: "Chamber and orchestral performance",
    },
    {
      instrument: "Bass",
      period: "2025 — Present",
      detail: "Principal Bassist, BCP Chamber Orchestra",
    },
  ],
};

export const DEFAULT_NOW: NowContent = {
  eyebrow: "Now · Updated April 23, 2026",
  title: "What I'm doing, *right now*.",
  intro:
    "A snapshot of what's on my workbench, my desk, and my mind. Inspired by Derek Sivers' /now movement. I update this when something meaningfully changes.",
  sections: [
    {
      label: "Building",
      items: [
        {
          title: "Meridian",
          body: "Native macOS life-OS — calendar, tasks, Canvas LMS, all in one keyboard-first surface. The unified CalendarFeed architecture is finally solid; now I'm focused on the planning engine's slot-finder and getting the recurrence expander 100% deterministic.",
          href: "/products/meridian",
        },
        {
          title: "Probe",
          body: "Notch-anchored class copilot. The notch UI works; the prompt engineering for fidelity across five note styles is where the time is going. Small local LLMs love to fabricate structure, and I'm building anti-fabrication heuristics into every template.",
          href: "/products/probe",
        },
        {
          title: "Hyperform Fitness",
          body: "Edge-first computer-vision platform we co-founded. Past 1M reps. Currently focused on multi-camera sync improvements and pushing toward real-time corrective feedback at sub-100ms across more lift variations.",
          href: "/products/hyperform-fitness",
        },
      ],
    },
    {
      label: "Reading",
      items: [
        {
          title: "Antenna theory & Maxwell's equations",
          body: "For the next iteration of the RF radar simulator — finally trying to understand the math under the propagation engine I built two years ago.",
        },
        {
          title: "The Mythical Man-Month",
          body: "Re-reading after a year of managing interns at Hyperform. Lots of \"oh that's why\" moments.",
        },
        {
          title: "Designing Data-Intensive Applications",
          body: "Background reading for the Meridian sync layer.",
        },
      ],
    },
    {
      label: "Listening",
      items: [
        {
          title: "Bach — Cello Suite No. 1, Prelude",
          body: "Practicing this on cello and piano simultaneously. They make different sense in each hand.",
        },
        {
          title: "Bon Iver — SABLE,",
          body: "On heavy rotation in the workshop.",
        },
      ],
    },
    {
      label: "Tinkering",
      items: [
        {
          title: "Glove chord input",
          body: "Capacitive touch + ESP32, mapped to a stenotype-style chord set for the AR glasses.",
        },
        {
          title: "Rebuilding my workshop",
          body: "Better dust collection on the lathe, a proper soldering station, and a CNC fixture plate that doesn't wobble.",
        },
      ],
    },
  ],
};

// ── Field-length caps ────────────────────────────────────────────────────────

const LIMITS = {
  shortText: 400,
  mediumText: 2000,
  longText: 20_000,
  url: 500,
  arrayCount: 100,
} as const;

// ── Validators ───────────────────────────────────────────────────────────────

function trimStr(value: unknown, max: number): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max);
}

function safeInternalPath(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  // Only allow same-origin paths starting with / and no protocol smuggling.
  if (!trimmed.startsWith("/")) return undefined;
  if (trimmed.includes("://")) return undefined;
  if (trimmed.startsWith("//")) return undefined;
  if (trimmed.length > LIMITS.url) return undefined;
  return trimmed;
}

function validateLink(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  if (trimmed.length > LIMITS.url) return undefined;
  // Internal paths are kept as-is.
  if (trimmed.startsWith("/") && !trimmed.startsWith("//")) {
    if (trimmed.includes("://")) return undefined;
    return trimmed;
  }
  // Otherwise must be a safe absolute URL.
  return safeUrl(trimmed) ?? undefined;
}

function validateHero(input: unknown): HeroContent {
  if (!input || typeof input !== "object") return DEFAULT_HERO;
  const i = input as Partial<HeroContent>;
  return {
    eyebrow: trimStr(i.eyebrow, LIMITS.shortText) || DEFAULT_HERO.eyebrow,
    headline: trimStr(i.headline, LIMITS.mediumText) || DEFAULT_HERO.headline,
    intro: Array.isArray(i.intro)
      ? i.intro
          .slice(0, LIMITS.arrayCount)
          .map((p) => trimStr(p, LIMITS.mediumText))
          .filter(Boolean)
      : DEFAULT_HERO.intro,
    links: Array.isArray(i.links)
      ? i.links
          .slice(0, LIMITS.arrayCount)
          .map((l) => {
            if (!l || typeof l !== "object") return null;
            const link = l as { label?: unknown; href?: unknown };
            const label = trimStr(link.label, LIMITS.shortText);
            const href = validateLink(link.href);
            if (!label || !href) return null;
            return { label, href };
          })
          .filter((l): l is { label: string; href: string } => l !== null)
      : DEFAULT_HERO.links,
    currentlySidebar: (() => {
      const sb = i.currentlySidebar as
        | { title?: unknown; items?: unknown }
        | undefined;
      if (!sb || typeof sb !== "object") return DEFAULT_HERO.currentlySidebar;
      const items = Array.isArray(sb.items)
        ? sb.items
            .slice(0, LIMITS.arrayCount)
            .map((it) => {
              if (!it || typeof it !== "object") return null;
              const item = it as {
                label?: unknown;
                text?: unknown;
                href?: unknown;
              };
              const label = trimStr(item.label, LIMITS.shortText);
              const text = trimStr(item.text, LIMITS.shortText);
              if (!label || !text) return null;
              const href = safeInternalPath(item.href);
              const out: HeroCurrentlyItem = { label, text };
              if (href) out.href = href;
              return out;
            })
            .filter((x): x is HeroCurrentlyItem => x !== null)
        : DEFAULT_HERO.currentlySidebar.items;
      return {
        title:
          trimStr(sb.title, LIMITS.shortText) ||
          DEFAULT_HERO.currentlySidebar.title,
        items,
      };
    })(),
  };
}

function validateAbout(input: unknown): AboutContent {
  if (!input || typeof input !== "object") return DEFAULT_ABOUT;
  const i = input as Partial<AboutContent>;
  const arrOrFallback = <T>(
    arr: unknown,
    fallback: T[],
    map: (v: unknown) => T | null
  ): T[] => {
    if (!Array.isArray(arr)) return fallback;
    return arr
      .slice(0, LIMITS.arrayCount)
      .map(map)
      .filter((x): x is T => x !== null);
  };

  return {
    eyebrow: trimStr(i.eyebrow, LIMITS.shortText) || DEFAULT_ABOUT.eyebrow,
    title: trimStr(i.title, LIMITS.shortText) || DEFAULT_ABOUT.title,
    lead: trimStr(i.lead, LIMITS.mediumText) || DEFAULT_ABOUT.lead,
    paragraphs: arrOrFallback(i.paragraphs, DEFAULT_ABOUT.paragraphs, (v) => {
      const t = trimStr(v, LIMITS.longText);
      return t || null;
    }),
    pullQuote:
      trimStr(i.pullQuote, LIMITS.mediumText) || DEFAULT_ABOUT.pullQuote,
    quickFacts: arrOrFallback(
      i.quickFacts,
      DEFAULT_ABOUT.quickFacts,
      (v) => {
        if (!v || typeof v !== "object") return null;
        const f = v as { k?: unknown; v?: unknown };
        const k = trimStr(f.k, LIMITS.shortText);
        const val = trimStr(f.v, LIMITS.shortText);
        if (!k || !val) return null;
        return { k, v: val };
      }
    ),
    timeline: arrOrFallback(i.timeline, DEFAULT_ABOUT.timeline, (v) => {
      if (!v || typeof v !== "object") return null;
      const t = v as { period?: unknown; title?: unknown; description?: unknown };
      const period = trimStr(t.period, LIMITS.shortText);
      const title = trimStr(t.title, LIMITS.shortText);
      const description = trimStr(t.description, LIMITS.longText);
      if (!period || !title || !description) return null;
      return { period, title, description };
    }),
    skills: arrOrFallback(i.skills, DEFAULT_ABOUT.skills, (v) => {
      if (!v || typeof v !== "object") return null;
      const s = v as { category?: unknown; items?: unknown };
      const category = trimStr(s.category, LIMITS.shortText);
      const items = Array.isArray(s.items)
        ? s.items
            .slice(0, LIMITS.arrayCount)
            .map((it) => trimStr(it, LIMITS.shortText))
            .filter(Boolean)
        : [];
      if (!category) return null;
      return { category, items };
    }),
    music: arrOrFallback(i.music, DEFAULT_ABOUT.music, (v) => {
      if (!v || typeof v !== "object") return null;
      const m = v as {
        instrument?: unknown;
        period?: unknown;
        detail?: unknown;
      };
      const instrument = trimStr(m.instrument, LIMITS.shortText);
      const period = trimStr(m.period, LIMITS.shortText);
      const detail = trimStr(m.detail, LIMITS.mediumText);
      if (!instrument || !period) return null;
      return { instrument, period, detail };
    }),
  };
}

function validateNow(input: unknown): NowContent {
  if (!input || typeof input !== "object") return DEFAULT_NOW;
  const i = input as Partial<NowContent>;
  return {
    eyebrow: trimStr(i.eyebrow, LIMITS.shortText) || DEFAULT_NOW.eyebrow,
    title: trimStr(i.title, LIMITS.shortText) || DEFAULT_NOW.title,
    intro: trimStr(i.intro, LIMITS.longText) || DEFAULT_NOW.intro,
    sections: Array.isArray(i.sections)
      ? i.sections
          .slice(0, LIMITS.arrayCount)
          .map((s) => {
            if (!s || typeof s !== "object") return null;
            const sec = s as { label?: unknown; items?: unknown };
            const label = trimStr(sec.label, LIMITS.shortText);
            if (!label) return null;
            const items = Array.isArray(sec.items)
              ? sec.items
                  .slice(0, LIMITS.arrayCount)
                  .map((it) => {
                    if (!it || typeof it !== "object") return null;
                    const item = it as {
                      title?: unknown;
                      body?: unknown;
                      href?: unknown;
                    };
                    const title = trimStr(item.title, LIMITS.shortText);
                    const body = trimStr(item.body, LIMITS.longText);
                    if (!title) return null;
                    const out: { title: string; body: string; href?: string } =
                      { title, body };
                    const href = safeInternalPath(item.href);
                    if (href) out.href = href;
                    return out;
                  })
                  .filter(
                    (x): x is { title: string; body: string; href?: string } =>
                      x !== null
                  )
              : [];
            return { label, items };
          })
          .filter((s): s is NowSection => s !== null)
      : DEFAULT_NOW.sections,
  };
}

const VALID_STATUSES: ProductStatus[] = [
  "prototype",
  "in-development",
  "released",
  "concept",
];

const SLUG_RE = /^[a-z0-9](?:[a-z0-9-]{0,78}[a-z0-9])?$/;

function validateProductSnapshot(input: unknown, fallback: Product[]): Product[] {
  if (!Array.isArray(input)) return fallback;
  return input
    .slice(0, LIMITS.arrayCount)
    .map((p, idx): Product | null => {
      if (!p || typeof p !== "object") return null;
      const r = p as Partial<Product> & { links?: unknown };
      const slug = trimStr(r.slug, 80);
      if (!slug || !SLUG_RE.test(slug)) return null;
      const id = trimStr(r.id, 80) || slug;
      const status = (typeof r.status === "string" &&
      VALID_STATUSES.includes(r.status as ProductStatus)
        ? r.status
        : "concept") as ProductStatus;
      const linksObj =
        r.links && typeof r.links === "object"
          ? (r.links as Record<string, unknown>)
          : {};
      const links: Product["links"] = {};
      for (const key of ["github", "website", "demo", "download"] as const) {
        const v = linksObj[key];
        if (typeof v === "string" && v.trim()) {
          const valid = safeUrl(v);
          if (valid) links[key] = valid;
        }
      }
      const techStack = Array.isArray(r.techStack)
        ? r.techStack
            .slice(0, LIMITS.arrayCount)
            .map((t) => trimStr(t, 80))
            .filter(Boolean)
        : [];
      const features = Array.isArray(r.features)
        ? r.features
            .slice(0, LIMITS.arrayCount)
            .map((f) => trimStr(f, 300))
            .filter(Boolean)
        : [];
      const dateCreated =
        typeof r.dateCreated === "string" &&
        /^\d{4}-\d{2}-\d{2}$/.test(r.dateCreated)
          ? r.dateCreated
          : new Date().toISOString().slice(0, 10);
      const orderRaw = typeof r.order === "number" ? r.order : idx + 1;
      const order =
        Number.isFinite(orderRaw) && orderRaw >= 0 && orderRaw <= 10_000
          ? orderRaw
          : idx + 1;
      const gradient =
        typeof r.gradient === "string" && r.gradient.length < 200
          ? r.gradient
          : "from-emerald-600/20 via-teal-600/20 to-cyan-500/20";
      return {
        id,
        slug,
        name: trimStr(r.name, 120) || slug,
        shortDescription: trimStr(r.shortDescription, 400),
        description: trimStr(r.description, 8000),
        images: Array.isArray(r.images)
          ? r.images
              .slice(0, 20)
              .map((u) => safeUrl(u))
              .filter((u): u is string => Boolean(u))
          : [],
        techStack,
        status,
        links,
        features,
        dateCreated,
        order,
        gradient,
      };
    })
    .filter((p): p is Product => p !== null)
    .sort((a, b) => a.order - b.order);
}

function validateBlogSnapshot(input: unknown, fallback: BlogPost[]): BlogPost[] {
  if (!Array.isArray(input)) return fallback;
  return input
    .slice(0, LIMITS.arrayCount)
    .map((p): BlogPost | null => {
      if (!p || typeof p !== "object") return null;
      const r = p as Partial<BlogPost>;
      const slug = trimStr(r.slug, 80);
      if (!slug || !SLUG_RE.test(slug)) return null;
      const date =
        typeof r.date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(r.date)
          ? r.date
          : new Date().toISOString().slice(0, 10);
      const content = trimStr(r.content, 200_000);
      return {
        slug,
        title: trimStr(r.title, 200) || slug,
        date,
        category: trimStr(r.category, 80) || "General",
        excerpt: trimStr(r.excerpt, 500),
        content,
        readingTime: Math.max(
          1,
          Math.ceil(content.trim().split(/\s+/).length / 200)
        ),
      };
    })
    .filter((p): p is BlogPost => p !== null)
    .sort((a, b) => (b.date || "").localeCompare(a.date || ""));
}

// ── Read API ─────────────────────────────────────────────────────────────────

const KEY_PREFIX = "ct:content:";
const keyFor = (scope: Scope) => `${KEY_PREFIX}${scope}`;

async function readScopeRaw(scope: Scope): Promise<unknown> {
  try {
    const raw = await kvGet(keyFor(scope));
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export async function getHero(): Promise<HeroContent> {
  return validateHero(await readScopeRaw("hero"));
}

export async function getAbout(): Promise<AboutContent> {
  return validateAbout(await readScopeRaw("about"));
}

export async function getNow(): Promise<NowContent> {
  return validateNow(await readScopeRaw("now"));
}

export async function getProducts(): Promise<Product[]> {
  const stored = await readScopeRaw("products");
  if (stored) {
    return validateProductSnapshot(stored, []);
  }
  return readProductsFromDisk();
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const products = await getProducts();
  return products.find((p) => p.slug === slug) ?? null;
}

export async function getPosts(): Promise<BlogPost[]> {
  const stored = await readScopeRaw("blog");
  if (stored) {
    return validateBlogSnapshot(stored, []);
  }
  return readPostsFromDisk();
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const posts = await getPosts();
  return posts.find((p) => p.slug === slug) ?? null;
}

// ── Write API ────────────────────────────────────────────────────────────────

export interface WriteResult {
  scope: Scope;
}

/**
 * Validate + persist a single scope. Throws if storage isn't writable.
 * Callers should map storage errors to a 503 response.
 */
export async function setScope(scope: Scope, value: unknown): Promise<WriteResult> {
  switch (scope) {
    case "hero": {
      const cleaned = validateHero(value);
      await kvSet(keyFor("hero"), JSON.stringify(cleaned));
      return { scope };
    }
    case "about": {
      const cleaned = validateAbout(value);
      await kvSet(keyFor("about"), JSON.stringify(cleaned));
      return { scope };
    }
    case "now": {
      const cleaned = validateNow(value);
      await kvSet(keyFor("now"), JSON.stringify(cleaned));
      return { scope };
    }
    case "products": {
      // For products we accept either a full snapshot or a partial list of
      // updates keyed by slug. The full-snapshot path is what inline editing
      // uses (it sends the whole new array).
      const existing = await getProducts();
      const cleaned = validateProductSnapshot(value, existing);
      // Ensure orders stay contiguous + unique.
      cleaned.sort((a, b) => a.order - b.order);
      cleaned.forEach((p, i) => (p.order = i + 1));
      await kvSet(keyFor("products"), JSON.stringify(cleaned));
      return { scope };
    }
    case "blog": {
      const existing = await getPosts();
      const cleaned = validateBlogSnapshot(value, existing);
      await kvSet(keyFor("blog"), JSON.stringify(cleaned));
      return { scope };
    }
  }
}
