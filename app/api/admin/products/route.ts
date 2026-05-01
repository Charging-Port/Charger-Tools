import { NextRequest, NextResponse } from "next/server";
import { isValidSession, ADMIN_COOKIE_NAME } from "@/lib/admin-auth";
import { getAllProducts, writeProducts } from "@/lib/products";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import type { Product, ProductStatus } from "@/types";

export const dynamic = "force-dynamic";

const VALID_STATUSES: ProductStatus[] = [
  "prototype",
  "in-development",
  "released",
  "concept",
];

const GRADIENTS = [
  "from-emerald-600/20 via-teal-600/20 to-cyan-500/20",
  "from-violet-600/20 via-blue-600/20 to-cyan-500/20",
  "from-amber-600/20 via-orange-600/20 to-red-500/20",
  "from-blue-600/20 via-indigo-600/20 to-purple-500/20",
  "from-sky-600/20 via-cyan-600/20 to-teal-500/20",
  "from-rose-600/20 via-pink-600/20 to-fuchsia-500/20",
  "from-lime-600/20 via-green-600/20 to-emerald-500/20",
  "from-orange-600/20 via-red-600/20 to-pink-500/20",
];

const LIMITS = {
  name: 120,
  shortDescription: 280,
  description: 5000,
  techItem: 60,
  feature: 200,
  techStackCount: 30,
  featuresCount: 30,
  url: 500,
} as const;

const SLUG_RE = /^[a-z0-9](?:[a-z0-9-]{0,78}[a-z0-9])?$/;

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

function checkAuth(req: NextRequest): boolean {
  const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  return isValidSession(token);
}

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

/**
 * Validate a user-supplied URL. Only http(s) and mailto: are allowed —
 * never javascript: or data: which would let a logged-in admin (or any
 * attacker who hijacks the session) plant XSS payloads on public pages.
 * Returns the canonical string form, or null on rejection.
 */
function validateUrl(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  if (trimmed.length > LIMITS.url) return null;

  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    return null;
  }
  const proto = parsed.protocol.toLowerCase();
  if (proto !== "http:" && proto !== "https:" && proto !== "mailto:") {
    return null;
  }
  return parsed.toString();
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function clampStr(value: unknown, max: number): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max);
}

/** GET — list all products */
export async function GET(req: NextRequest) {
  if (!checkAuth(req)) return unauthorized();
  const limited = applyAdminRateLimit(req);
  if (limited) return limited;
  return NextResponse.json(getAllProducts());
}

/** POST — create a new product */
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
    name?: unknown;
    shortDescription?: unknown;
    description?: unknown;
    status?: unknown;
    techStack?: unknown;
    features?: unknown;
    links?: unknown;
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const name = clampStr(body.name, LIMITS.name);
  if (!name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const slug = slugify(name);
  if (!slug || !SLUG_RE.test(slug)) {
    return NextResponse.json(
      { error: "Could not generate slug from name" },
      { status: 400 }
    );
  }

  const status = (typeof body.status === "string" ? body.status : "concept") as ProductStatus;
  if (!VALID_STATUSES.includes(status)) {
    return NextResponse.json(
      { error: "Invalid status" },
      { status: 400 }
    );
  }

  const products = getAllProducts();

  // Ensure slug is unique
  if (products.some((p) => p.slug === slug)) {
    return NextResponse.json(
      { error: "A product with this name already exists" },
      { status: 409 }
    );
  }

  // Build links — validate every URL.
  const rawLinks = (body.links && typeof body.links === "object")
    ? (body.links as Record<string, unknown>)
    : {};
  const links: Product["links"] = {};
  for (const key of ["github", "website", "demo", "download"] as const) {
    const value = rawLinks[key];
    if (typeof value === "string" && value.trim()) {
      const valid = validateUrl(value);
      if (!valid) {
        return NextResponse.json(
          { error: `Invalid ${key} URL` },
          { status: 400 }
        );
      }
      links[key] = valid;
    }
  }

  const techStack = Array.isArray(body.techStack)
    ? body.techStack
        .slice(0, LIMITS.techStackCount)
        .map((t) => clampStr(t, LIMITS.techItem))
        .filter(Boolean)
    : [];
  const features = Array.isArray(body.features)
    ? body.features
        .slice(0, LIMITS.featuresCount)
        .map((f) => clampStr(f, LIMITS.feature))
        .filter(Boolean)
    : [];

  const newProduct: Product = {
    id: slug,
    name,
    slug,
    shortDescription: clampStr(body.shortDescription, LIMITS.shortDescription),
    description: clampStr(body.description, LIMITS.description),
    images: [],
    techStack,
    status,
    links,
    features,
    dateCreated: new Date().toISOString().slice(0, 10),
    order: products.length + 1,
    gradient: GRADIENTS[products.length % GRADIENTS.length],
  };

  products.push(newProduct);
  writeProducts(products);

  return NextResponse.json({ success: true, product: newProduct });
}

/**
 * PATCH — update one or more products by id.
 * Body: { updates: Array<{ id, status?, order? }> }
 */
export async function PATCH(req: NextRequest) {
  if (!checkAuth(req)) return unauthorized();
  const limited = applyAdminRateLimit(req);
  if (limited) return limited;
  if (!isSameOriginWrite(req)) {
    return NextResponse.json({ error: "Bad origin" }, { status: 403 });
  }
  if (!(req.headers.get("content-type") || "").includes("application/json")) {
    return NextResponse.json({ error: "Expected JSON" }, { status: 415 });
  }

  let body: { updates?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!Array.isArray(body.updates)) {
    return NextResponse.json(
      { error: "updates array required" },
      { status: 400 }
    );
  }
  if (body.updates.length > 200) {
    return NextResponse.json(
      { error: "Too many updates" },
      { status: 400 }
    );
  }

  const products = getAllProducts();
  const byId = new Map(products.map((p) => [p.id, p]));

  for (const u of body.updates) {
    if (!u || typeof u !== "object") continue;
    const update = u as { id?: unknown; status?: unknown; order?: unknown };
    if (typeof update.id !== "string") continue;
    const product = byId.get(update.id);
    if (!product) continue;

    if (update.status !== undefined) {
      if (
        typeof update.status !== "string" ||
        !VALID_STATUSES.includes(update.status as ProductStatus)
      ) {
        return NextResponse.json(
          { error: "Invalid status" },
          { status: 400 }
        );
      }
      product.status = update.status as ProductStatus;
    }

    if (update.order !== undefined) {
      if (
        typeof update.order !== "number" ||
        !Number.isFinite(update.order) ||
        update.order < 0 ||
        update.order > 10_000
      ) {
        return NextResponse.json(
          { error: "Invalid order" },
          { status: 400 }
        );
      }
      product.order = update.order;
    }
  }

  // Save sorted by current order so JSON file stays readable
  const sorted = Array.from(byId.values()).sort((a, b) => a.order - b.order);
  writeProducts(sorted);

  return NextResponse.json({ success: true, products: sorted });
}

/** DELETE — remove a product by id */
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

  let body: { id?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (typeof body.id !== "string") {
    return NextResponse.json({ error: "ID required" }, { status: 400 });
  }

  const products = getAllProducts();
  const filtered = products.filter((p) => p.id !== body.id);

  if (filtered.length === products.length) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  // Re-sequence orders to stay contiguous
  filtered.forEach((p, i) => {
    p.order = i + 1;
  });
  writeProducts(filtered);

  return NextResponse.json({ success: true });
}
