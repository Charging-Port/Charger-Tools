import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { isValidSession, ADMIN_COOKIE_NAME } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

const blogDir = path.join(process.cwd(), "content/blog");

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

function checkAuth(req: NextRequest): boolean {
  const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  return isValidSession(token);
}

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
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

/** GET — list all posts */
export async function GET(req: NextRequest) {
  if (!checkAuth(req)) return unauthorized();

  if (!fs.existsSync(blogDir)) {
    return NextResponse.json([]);
  }

  const files = fs
    .readdirSync(blogDir)
    .filter((f) => f.endsWith(".md"));

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

  let body: {
    title?: string;
    date?: string;
    category?: string;
    excerpt?: string;
    body?: string;
    slug?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const title = (body.title || "").trim();
  const postBody = (body.body || "").trim();

  if (!title || !postBody) {
    return NextResponse.json(
      { error: "Title and body are required" },
      { status: 400 }
    );
  }

  const slug = body.slug || slugify(title);
  if (!slug) {
    return NextResponse.json(
      { error: "Could not generate slug from title" },
      { status: 400 }
    );
  }

  const date = body.date || new Date().toISOString().slice(0, 10);
  const category = (body.category || "General").trim();
  const excerpt = (body.excerpt || "").trim();

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

  fs.writeFileSync(path.join(blogDir, `${slug}.md`), content, "utf8");

  return NextResponse.json({ success: true, slug });
}

/** DELETE — delete a post by slug */
export async function DELETE(req: NextRequest) {
  if (!checkAuth(req)) return unauthorized();

  let body: { slug?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.slug) {
    return NextResponse.json({ error: "Slug required" }, { status: 400 });
  }

  // Prevent path traversal — slug must be a simple filename
  if (!/^[a-z0-9-]+$/i.test(body.slug)) {
    return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
  }

  const filepath = path.join(blogDir, `${body.slug}.md`);
  if (!fs.existsSync(filepath)) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  fs.unlinkSync(filepath);
  return NextResponse.json({ success: true });
}
