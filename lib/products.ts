import { products } from "@/content/products";
import { Product } from "@/types";

export function getAllProducts(): Product[] {
  return [...products].sort((a, b) => a.order - b.order);
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductSlugs(): string[] {
  return products.map((p) => p.slug);
}
