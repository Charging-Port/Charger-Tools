"use client";

import Link from "next/link";
import { ArrowUpRight, Pencil } from "lucide-react";
import type { Product, ProductStatus } from "@/types";
import { ProductMockup } from "@/components/product-mockup";
import { useAdmin } from "./admin-context";
import { EditableProductCardField } from "./editable-product";

const STATUS_LABEL: Record<ProductStatus, string> = {
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

/**
 * Render-only-when-needed wrapper used by /products. Replaces the static
 * FeaturedWork grid; in admin edit mode it adds inline editing of the
 * card's name and short description, plus a quick "open detail" link.
 *
 * In view mode, the markup matches FeaturedWork so visitors see the same
 * layout they always have.
 */
export function EditableProductsGrid({
  products,
  allProductsForSnapshot,
}: {
  products: Product[];
  allProductsForSnapshot: Product[];
}) {
  const { authed, editMode } = useAdmin();
  const editable = authed && editMode;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-16">
      {products.map((product) => {
        const detailHref = `/products/${product.slug}`;
        return (
          <div key={product.id} className="group block relative">
            <Link
              href={detailHref}
              className={editable ? "pointer-events-none" : ""}
              tabIndex={editable ? -1 : 0}
            >
              <ProductMockup slug={product.slug} className="mb-5" />
            </Link>
            <div className="flex items-baseline justify-between gap-3 mb-1">
              {editable ? (
                <EditableProductCardField
                  product={product}
                  allProductsForSnapshot={allProductsForSnapshot}
                  field="name"
                  className="font-serif text-2xl tracking-tight text-foreground leading-tight"
                />
              ) : (
                <Link href={detailHref}>
                  <h3 className="font-serif text-2xl tracking-tight text-foreground group-hover:text-accent transition-colors leading-tight">
                    {product.name}
                  </h3>
                </Link>
              )}
              {editable ? (
                <Link
                  href={detailHref}
                  className="shrink-0 inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-[0.18em] text-accent/80 hover:text-accent border border-accent/30 rounded-full px-2 py-1"
                >
                  <Pencil size={10} />
                  Detail
                </Link>
              ) : (
                <ArrowUpRight
                  size={14}
                  className="shrink-0 text-muted-foreground/60 transition-all group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              )}
            </div>
            <p className="font-mono text-[11px] text-muted-foreground mb-2.5">
              {STATUS_LABEL[product.status]}{" "}
              <span className="text-border">·</span>{" "}
              {formatMonth(product.dateCreated)}
            </p>
            {editable ? (
              <EditableProductCardField
                product={product}
                allProductsForSnapshot={allProductsForSnapshot}
                field="shortDescription"
                multiline
                className="text-sm text-foreground/75 leading-relaxed"
              />
            ) : (
              <p className="text-sm text-foreground/75 leading-relaxed">
                {product.shortDescription}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
