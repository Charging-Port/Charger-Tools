import fs from "fs";
import path from "path";
import { Product } from "@/types";

const productsFile = path.join(process.cwd(), "content/products.json");

/**
 * Read products fresh from disk on every call. This makes admin edits show
 * up immediately without a rebuild — the file IS the canonical source.
 *
 * In production (Vercel), the filesystem is read-only, so the file is fixed
 * at build time and reads are essentially free (OS-level cached).
 */
function readProducts(): Product[] {
  const raw = fs.readFileSync(productsFile, "utf8");
  return JSON.parse(raw) as Product[];
}

export function getAllProducts(): Product[] {
  return readProducts().sort((a, b) => a.order - b.order);
}

export function getProductBySlug(slug: string): Product | undefined {
  return readProducts().find((p) => p.slug === slug);
}

export function getProductSlugs(): string[] {
  return readProducts().map((p) => p.slug);
}

/**
 * Write products back to disk (admin only).
 */
export function writeProducts(products: Product[]): void {
  const json = JSON.stringify(products, null, 2);
  fs.writeFileSync(productsFile, json + "\n", "utf8");
}
