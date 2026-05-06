import { NextRequest, NextResponse } from "next/server";
import { isValidSession, ADMIN_COOKIE_NAME } from "@/lib/admin-auth";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { getSiteText, writeSiteText } from "@/lib/site-text";
import type { SiteText } from "@/types/site-text";

export const dynamic = "force-dynamic";

/* ── Field caps. Reject obvious DoS payloads early. ───────────── */
const SHORT = 300;
const LINE = 500;
const PARA = 4000;
const LIST_MAX = 50;

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

function checkAuth(req: NextRequest): boolean {
  const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  return isValidSession(token);
}

/** Reject cross-origin write requests (CSRF defence). */
function isSameOriginWrite(req: NextRequest): boolean {
  const host = req.headers.get("host");
  if (!host) return false;
  const origin = req.headers.get("origin");
  if (origin) {
    try {
      return new URL(origin).host === host;
    } catch {
      return false;
    }
  }
  const referer = req.headers.get("referer");
  if (referer) {
    try {
      return new URL(referer).host === host;
    } catch {
      return false;
    }
  }
  return false;
}

function applyAdminRateLimit(req: NextRequest): NextResponse | null {
  const ip = getClientIp(req);
  const rl = checkRateLimit(`admin:${ip}`, {
    limit: 60,
    windowMs: 60 * 1000,
  });
  if (rl.allowed) return null;
  return NextResponse.json(
    { error: "Too many requests" },
    {
      status: 429,
      headers: {
        "Retry-After": String(Math.ceil((rl.resetAt - Date.now()) / 1000)),
      },
    }
  );
}

/* ── Validation primitives. ───────────────────────────────────── */
class ValidationError extends Error {}

function isString(v: unknown): v is string {
  return typeof v === "string";
}

function clampString(v: unknown, max: number, field: string): string {
  if (!isString(v)) {
    throw new ValidationError(`${field} must be a string`);
  }
  if (v.length > max) {
    throw new ValidationError(`${field} too long (max ${max} chars)`);
  }
  return v;
}

function clampOptionalString(
  v: unknown,
  max: number,
  field: string
): string | undefined {
  if (v === undefined || v === null || v === "") return undefined;
  return clampString(v, max, field);
}

function ensureArray<T>(v: unknown, field: string): T[] {
  if (!Array.isArray(v)) {
    throw new ValidationError(`${field} must be an array`);
  }
  if (v.length > LIST_MAX) {
    throw new ValidationError(`${field} too long (max ${LIST_MAX} items)`);
  }
  return v as T[];
}

function ensureObject(v: unknown, field: string): Record<string, unknown> {
  if (!v || typeof v !== "object" || Array.isArray(v)) {
    throw new ValidationError(`${field} must be an object`);
  }
  return v as Record<string, unknown>;
}

/* ── SiteText sanitiser. Re-builds a clean, typed object so a
       hostile payload can never inject extra keys or wrong types
       into the on-disk file. ─────────────────────────────────── */
function sanitizeSiteText(raw: unknown): SiteText {
  const r = ensureObject(raw, "body");

  const hero = ensureObject(r.hero, "hero");
  const heroCurrently = ensureArray<unknown>(hero.currently, "hero.currently").map(
    (item, idx) => {
      const o = ensureObject(item, `hero.currently[${idx}]`);
      return {
        label: clampString(o.label, SHORT, `hero.currently[${idx}].label`),
        text: clampString(o.text, SHORT, `hero.currently[${idx}].text`),
        href: clampOptionalString(o.href, SHORT, `hero.currently[${idx}].href`),
      };
    }
  );

  const about = ensureObject(r.about, "about");
  const aboutBio = ensureArray<unknown>(about.bio, "about.bio").map((p, i) =>
    clampString(p, PARA, `about.bio[${i}]`)
  );
  const aboutQuickFacts = ensureArray<unknown>(
    about.quickFacts,
    "about.quickFacts"
  ).map((qf, idx) => {
    const o = ensureObject(qf, `about.quickFacts[${idx}]`);
    return {
      k: clampString(o.k, SHORT, `about.quickFacts[${idx}].k`),
      v: clampString(o.v, SHORT, `about.quickFacts[${idx}].v`),
    };
  });
  const aboutSkills = ensureArray<unknown>(about.skills, "about.skills").map(
    (sg, gi) => {
      const o = ensureObject(sg, `about.skills[${gi}]`);
      const items = ensureArray<unknown>(o.items, `about.skills[${gi}].items`).map(
        (sk, si) => {
          const s = ensureObject(sk, `about.skills[${gi}].items[${si}]`);
          return {
            name: clampString(s.name, SHORT, `about.skills[${gi}].items[${si}].name`),
            description: clampString(
              s.description,
              LINE,
              `about.skills[${gi}].items[${si}].description`
            ),
            whereLearned: clampString(
              s.whereLearned,
              LINE,
              `about.skills[${gi}].items[${si}].whereLearned`
            ),
          };
        }
      );
      return {
        category: clampString(o.category, SHORT, `about.skills[${gi}].category`),
        items,
      };
    }
  );

  const now = ensureObject(r.now, "now");
  const nowSections = ensureArray<unknown>(now.sections, "now.sections").map(
    (sec, si) => {
      const o = ensureObject(sec, `now.sections[${si}]`);
      const items = ensureArray<unknown>(o.items, `now.sections[${si}].items`).map(
        (it, ii) => {
          const x = ensureObject(it, `now.sections[${si}].items[${ii}]`);
          return {
            title: clampString(
              x.title,
              SHORT,
              `now.sections[${si}].items[${ii}].title`
            ),
            body: clampString(
              x.body,
              PARA,
              `now.sections[${si}].items[${ii}].body`
            ),
            href: clampOptionalString(
              x.href,
              SHORT,
              `now.sections[${si}].items[${ii}].href`
            ),
          };
        }
      );
      return {
        label: clampString(o.label, SHORT, `now.sections[${si}].label`),
        items,
      };
    }
  );

  const contact = ensureObject(r.contact, "contact");
  const contactOpenTo = ensureArray<unknown>(contact.openTo, "contact.openTo").map(
    (s, i) => clampString(s, LINE, `contact.openTo[${i}]`)
  );

  const homepage = ensureObject(r.homepage, "homepage");
  const footer = ensureObject(r.footer, "footer");

  return {
    hero: {
      headline: clampString(hero.headline, PARA, "hero.headline"),
      intro1: clampString(hero.intro1, PARA, "hero.intro1"),
      intro2: clampString(hero.intro2, PARA, "hero.intro2"),
      currently: heroCurrently,
    },
    about: {
      quote: clampString(about.quote, PARA, "about.quote"),
      bio: aboutBio,
      quickFacts: aboutQuickFacts,
      pullQuote: clampString(about.pullQuote, PARA, "about.pullQuote"),
      skills: aboutSkills,
      cta: clampString(about.cta, PARA, "about.cta"),
    },
    now: {
      updatedLabel: clampString(now.updatedLabel, SHORT, "now.updatedLabel"),
      intro: clampString(now.intro, PARA, "now.intro"),
      sections: nowSections,
    },
    contact: {
      intro: clampString(contact.intro, PARA, "contact.intro"),
      openTo: contactOpenTo,
    },
    homepage: {
      closerHeadline: clampString(
        homepage.closerHeadline,
        PARA,
        "homepage.closerHeadline"
      ),
      closerBody: clampString(homepage.closerBody, PARA, "homepage.closerBody"),
      newsletterBody: clampString(
        homepage.newsletterBody,
        PARA,
        "homepage.newsletterBody"
      ),
    },
    footer: {
      tagline: clampString(footer.tagline, PARA, "footer.tagline"),
    },
  };
}

/* ── Handlers. ───────────────────────────────────────────────── */

export async function GET(req: NextRequest) {
  if (!checkAuth(req)) return unauthorized();
  const limited = applyAdminRateLimit(req);
  if (limited) return limited;

  return NextResponse.json(getSiteText());
}

export async function POST(req: NextRequest) {
  if (!checkAuth(req)) return unauthorized();
  const limited = applyAdminRateLimit(req);
  if (limited) return limited;
  if (!isSameOriginWrite(req)) {
    return NextResponse.json({ error: "Bad origin" }, { status: 403 });
  }
  if (!(req.headers.get("content-type") || "").includes("application/json")) {
    return NextResponse.json({ error: "Expected JSON" }, { status: 415 });
  }

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  let cleaned: SiteText;
  try {
    cleaned = sanitizeSiteText(raw);
  } catch (err) {
    const msg =
      err instanceof ValidationError
        ? err.message
        : "Invalid body";
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  try {
    writeSiteText(cleaned);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("[admin/content] write failed", err);
    return NextResponse.json({ error: "Save failed" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
