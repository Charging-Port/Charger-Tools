/**
 * Re-exports products from products.json so the admin panel can edit a single
 * source of truth at runtime. The JSON file is the canonical store; this
 * module exists only for type-safe imports from React components and the lib.
 *
 * Note: this is a static import — Next.js bundles the JSON at build time.
 * The lib/products.ts module reads the JSON file directly from disk so admin
 * edits show up without a rebuild in dev.
 */
import productsData from "./products.json";
import type { Product } from "@/types";

export const products: Product[] = productsData as Product[];
