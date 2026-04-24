import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Product } from "@/types";
import { ProductMockup } from "./product-mockup";

interface Props {
  products: Product[];
}

const STATUS_LABEL: Record<Product["status"], string> = {
  released: "Released",
  "in-development": "In development",
  prototype: "Prototype",
  concept: "Concept",
};

function formatMonth(date: string) {
  const [y, m] = date.split("-").map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
  });
}

function Tile({ product }: { product: Product }) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block"
    >
      <ProductMockup slug={product.slug} className="mb-5" />
      <div className="flex items-baseline justify-between gap-3 mb-1">
        <h3 className="font-serif text-2xl tracking-tight text-foreground group-hover:text-accent transition-colors leading-tight">
          {product.name}
        </h3>
        <ArrowUpRight
          size={14}
          className="shrink-0 text-muted-foreground/60 transition-all group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />
      </div>
      <p className="font-mono text-[11px] text-muted-foreground mb-2.5">
        {STATUS_LABEL[product.status]}{" "}
        <span className="text-border">·</span>{" "}
        {formatMonth(product.dateCreated)}
      </p>
      <p className="text-sm text-foreground/75 leading-relaxed">
        {product.shortDescription}
      </p>
    </Link>
  );
}

export function FeaturedWork({ products }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-16">
      {products.map((p) => (
        <Tile key={p.id} product={p} />
      ))}
    </div>
  );
}
