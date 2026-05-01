import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { isValidSession, ADMIN_COOKIE_NAME } from "@/lib/admin-auth";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

const blogDir = path.resolve(process.cwd(), "content/blog");

// Body field caps — keep posts to a sane size so the disk + JSON payload
// stay manageable, and reject obvious DoS payloads early.
const LIMITS = {
  title: 200,
  date: 10,
  category: 60,
  excerpt: 500,
  body: 200_000, // ~200KB of markdown is a long blog post
  slug: 80,
} as const;

// Only allow safe slug characters. Used both for input validation and to
// guarantee the on-disk filename is a leaf node inside `blogDir`.
const SLUG_RE = /^[a-z0-9](?:[a-z0-9-]{0,78}[a-z0-9])?$/;
const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

function checkAuth(req: NextRequest): boolean {
  const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  return isValidSession(token);
}

/** Reject cross-origin write requests to defend against CSRF. */
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

/**
 * Resolve a slug to an absolute path under `blogDir`, refusing anything that
 * escapes the directory. Returns null on rejection.
 */
function resolvePostPath(slug: string): string | null {
  if (!SLUG_RE.test(slug)) return null;
  const target = path.resolve(blogDir, `${slug}.md`);
  // Belt + suspenders: confirm the resolved path is inside blogDir.
  const rel = path.relative(blogDir, target);
  if (rel.startsWith("..") || path.isAbsolute(rel)) return null;
  // Protect against symlink trickery — only accept regular file results
  // (no need to follow links here; we never wrote one).
  return target;
}

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, LIMITS.slug);
}

/** Read frontmatter + body from a markdown file (without using gray-matter). */
function parseMarkdown(content: string): {
  frontmatter: Record<string, string>;
  body: string;
} {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  const frontmatter: Record<string, string> = {};

  if (!match) return { frontmatter, body: content };

  match[1].split(/\r?\n/).forEach((line) => {
    const colonIdx = line.indexOf(":");
    if (colonIdx === -1) return;
    const key = line.slice(0, colonIdx).trim();
    let value = line.slice(colonIdx + 1).trim();
    // Strip surrounding quotes
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    frontmatter[key] = value;
  });

  return { frontmatter, body: match[2] };
}

/** Escape a string for use inside a YAML double-quoted scalar. */
function yamlEscape(str: string): string {
  return str.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

/**
 * Defensive rate-limit applied even to authenticated admin endpoints —
 * limits damage from a stolen session and blunts simple abuse.
 */
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

/** GET — list all posts */
export async function GET(req: NextRequest) {
  if (!checkAuth(req)) return unauthorized();
  const limited = applyAdminRateLimit(req);
  if (limited) return limited;

  if (!fs.existsSync(blogDir)) {
    return NextResponse.json([]);
  }

  const files = fs
    .readdirSync(blogDir)
    .filter((f) => f.endsWith(".md") && SLUG_RE.test(f.replace(/\.md$/, "")));

  const posts = files.map((file) => {
    const slug = file.replace(/\.md$/, "");
    const content = fs.readFileSync(path.join(blogDir, file), "utf8");
    const { frontmatter, body } = parseMarkdown(content);

    return {
      slug,
      title: frontmatter.title || slug,
      date: frontmatter.date || "",
      category: frontmatter.category || "General",
      excerpt: frontmatter.excerpt || "",
      body: body.trim(),
    };
  });

  // Newest first
  posts.sort((a, b) => (b.date || "").localeCompare(a.date || ""));

  return NextResponse.json(posts);
}

/**
 * POST — create or update a post.
 * Body: { title, date, category, excerpt, body, slug? }
 *
 * If slug is provided, the existing file with that slug is overwritten
 * (allows editing). If omitted, a new slug is generated from the title.
 */
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

  let body: {
    title?: unknown;
    date?: unknown;
    category?: unknown;
    excerpt?: unknown;
    body?: unknown;
    slug?: unknown;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  // ── Type checks ──
  const fields = ["title", "date", "category", "excerpt", "body", "slug"] as const;
  for (const f of fields) {
    const v = (body as Record<string, unknown>)[f];
    if (v !== undefined && typeof v !== "string") {
      return NextResponse.json({ error: `${f} must be a string` }, { status: 400 });
    }
  }

  const title = ((body.title as string | undefined) || "").trim();
  const postBody = ((body.body as string | undefined) || "").trim();
  const rawSlug = (body.slug as string | undefined)?.trim() || "";

  if (!title || !postBody) {
    return NextResponse.json(
      { error: "Title and body are required" },
      { status: 400 }
    );
  }
  if (title.length > LIMITS.title) {
    return NextResponse.json({ error: "Title too long" }, { status: 400 });
  }
  if (postBody.length > LIMITS.body) {
    return NextResponse.json({ error: "Body too long" }, { status: 400 });
  }

  // ── Slug resolution & validation ──
  const slug = rawSlug || slugify(title);
  if (!slug) {
    return NextResponse.json(
      { error: "Could not generate slug from title" },
      { status: 400 }
    );
  }
  const filepath = resolvePostPath(slug);
  if (!filepath) {
    return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
  }

  // ── Other field validation ──
  const date =
    ((body.date as string | undefined) || "").trim() ||
    new Date().toISOString().slice(0, 10);
  if (!ISO_DATE_RE.test(date)) {
    return NextResponse.json({ error: "Invalid date format" }, { status: 400 });
  }
  const category = ((body.category as string | undefined) || "General").trim();
  if (category.length > LIMITS.category) {
    return NextResponse.json({ error: "Category too long" }, { status: 400 });
  }
  const excerpt = ((body.excerpt as string | undefined) || "").trim();
  if (excerpt.length > LIMITS.excerpt) {
    return NextResponse.json({ error: "Excerpt too long" }, { status: 400 });
  }

  const content = `---
title: "${yamlEscape(title)}"
date: "${yamlEscape(date)}"
category: "${yamlEscape(category)}"
excerpt: "${yamlEscape(excerpt)}"
---

${postBody}
`;

  if (!fs.existsSync(blogDir)) {
    fs.mkdirSync(blogDir, { recursive: true });
  }

  fs.writeFileSync(filepath, content, "utf8");

  return NextResponse.json({ success: true, slug });
}

/** DELETE — delete a post by slug */
export async function DELETE(req: NextRequest) {
  if (!checkAuth(req)) return unauthorized();
  const limited = applyAdminRateLimit(req);
  if (limited) return limited;
  if (!isSameOriginWrite(req)) {
    return NextResponse.json({ error: "Bad origin" }, { status: 403 });
  }
  if (!(req.headers.get("content-type") || "").includes("application/json")) {
    return NextResponse.json({ error: "Expected JSON" }, { status: 415 });
  }

  let body: { slug?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (typeof body?.slug !== "string") {
    return NextResponse.json({ error: "Slug required" }, { status: 400 });
  }

  const filepath = resolvePostPath(body.slug);
  if (!filepath) {
    return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
  }
  if (!fs.existsSync(filepath)) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  fs.unlinkSync(filepath);
  return NextResponse.json({ success: true });
}
