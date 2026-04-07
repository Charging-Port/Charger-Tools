import { NextRequest, NextResponse } from "next/server";
import { isValidSession, ADMIN_COOKIE_NAME } from "@/lib/admin-auth";
import { getAllProducts, writeProducts } from "@/lib/products";
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

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

function checkAuth(req: NextRequest): boolean {
  const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  return isValidSession(token);
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

/** GET — list all products */
export async function GET(req: NextRequest) {
  if (!checkAuth(req)) return unauthorized();
  return NextResponse.json(getAllProducts());
}

/** POST — create a new product */
export async function POST(req: NextRequest) {
  if (!checkAuth(req)) return unauthorized();

  let body: {
    name?: string;
    shortDescription?: string;
    description?: string;
    status?: string;
    techStack?: string[];
    features?: string[];
    links?: {
      github?: string;
      website?: string;
      demo?: string;
      download?: string;
    };
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const name = (body.name || "").trim();
  if (!name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const slug = slugify(name);
  if (!slug) {
    return NextResponse.json(
      { error: "Could not generate slug from name" },
      { status: 400 }
    );
  }

  const status = (body.status || "concept") as ProductStatus;
  if (!VALID_STATUSES.includes(status)) {
    return NextResponse.json(
      { error: `Invalid status: ${status}` },
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

  // Build links object — only include non-empty values
  const links: Product["links"] = {};
  if (body.links?.github?.trim()) links.github = body.links.github.trim();
  if (body.links?.website?.trim()) links.website = body.links.website.trim();
  if (body.links?.demo?.trim()) links.demo = body.links.demo.trim();
  if (body.links?.download?.trim()) links.download = body.links.download.trim();

  const newProduct: Product = {
    id: slug,
    name,
    slug,
    shortDescription: (body.shortDescription || "").trim(),
    description: (body.description || "").trim(),
    images: [],
    techStack: Array.isArray(body.techStack)
      ? body.techStack.map((t) => t.trim()).filter(Boolean)
      : [],
    status,
    links,
    features: Array.isArray(body.features)
      ? body.features.map((f) => f.trim()).filter(Boolean)
      : [],
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

  let body: { updates?: Array<{ id: string; status?: string; order?: number }> };
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

  const products = getAllProducts();
  const byId = new Map(products.map((p) => [p.id, p]));

  for (const update of body.updates) {
    const product = byId.get(update.id);
    if (!product) continue;

    if (update.status !== undefined) {
      if (!VALID_STATUSES.includes(update.status as ProductStatus)) {
        return NextResponse.json(
          { error: `Invalid status: ${update.status}` },
          { status: 400 }
        );
      }
      product.status = update.status as ProductStatus;
    }

    if (update.order !== undefined) {
      if (typeof update.order !== "number") {
        return NextResponse.json(
          { error: "order must be a number" },
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

  let body: { id?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.id) {
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
