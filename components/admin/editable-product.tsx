"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { useAdmin } from "./admin-context";
import { EditableText } from "./editable-text";
import { EditableMarkdown } from "./editable-markdown";
import { EditableList } from "./editable-list";
import { ProductMockup } from "@/components/product-mockup";
import { formatDate, safeUrl } from "@/lib/utils";
import type { Product, ProductStatus } from "@/types";

const STATUS_LABEL: Record<ProductStatus, string> = {
  released: "Released",
  "in-development": "In development",
  prototype: "Prototype",
  concept: "Concept",
};

const STATUS_OPTIONS: ProductStatus[] = [
  "concept",
  "prototype",
  "in-development",
  "released",
];

/**
 * In-place editor for a single product detail page. Edits write a saved
 * snapshot of the full products array to KV; the public page reads from
 * that snapshot.
 */
export function EditableProduct({
  initial,
  allProductsForSnapshot,
}: {
  initial: Product;
  /** All products at render-time, used to construct the saved snapshot. */
  allProductsForSnapshot: Product[];
}) {
  const { save, authed, editMode } = useAdmin();
  const [product, setProduct] = useState<Product>(initial);
  const editable = authed && editMode;

  const commit = async (next: Product) => {
    setProduct(next);
    const updatedAll = allProductsForSnapshot.map((p) =>
      p.slug === next.slug ? next : p
    );
    const ok = await save("products", updatedAll);
    if (!ok) setProduct(initial);
  };

  // Render only the safe subset of links — even authed admins must observe
  // the same allowlist that visitors see, so a malformed value can't slip in
  // through edit mode.
  const safeLinks = {
    demo: safeUrl(product.links.demo),
    website: safeUrl(product.links.website),
    github: safeUrl(product.links.github),
    download: safeUrl(product.links.download),
  };
  const hasLinks = Object.values(safeLinks).some(Boolean);

  return (
    <>
      <Link
        href="/products"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-10"
      >
        <ArrowLeft size={14} />
        All work
      </Link>

      <header className="mb-10">
        <p className="font-mono text-xs text-muted-foreground mb-3">
          {editable ? (
            <select
              value={product.status}
              onChange={(e) =>
                void commit({
                  ...product,
                  status: e.target.value as ProductStatus,
                })
              }
              className="bg-transparent border border-border/40 rounded px-2 py-0.5 text-xs font-mono"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {STATUS_LABEL[s]}
                </option>
              ))}
            </select>
          ) : (
            STATUS_LABEL[product.status]
          )}{" "}
          <span className="text-border">·</span>{" "}
          {formatDate(product.dateCreated)}
        </p>
        <EditableText
          as="h1"
          value={product.name}
          onCommit={(name) => commit({ ...product, name })}
          className="font-serif text-4xl md:text-[3.5rem] tracking-tightest text-foreground leading-[1.02]"
          placeholder="Product name"
        />
        <EditableText
          as="p"
          multiline
          value={product.shortDescription}
          onCommit={(shortDescription) =>
            commit({ ...product, shortDescription })
          }
          className="mt-5 font-serif italic text-xl md:text-2xl text-foreground/75 leading-snug max-w-2xl"
          placeholder="Short description"
        />
        {(hasLinks || editable) && (
          <div className="mt-7 flex flex-wrap gap-x-5 gap-y-3 text-sm">
            {(["demo", "website", "github", "download"] as const).map((key) => {
              const href = safeLinks[key];
              const label =
                key === "demo"
                  ? "Live demo"
                  : key.charAt(0).toUpperCase() + key.slice(1);
              if (editable) {
                return (
                  <span
                    key={key}
                    className="inline-flex items-center gap-1.5 text-xs"
                  >
                    <span className="text-muted-foreground/60 font-mono uppercase tracking-[0.16em]">
                      {label}:
                    </span>
                    <EditableText
                      as="span"
                      value={product.links[key] || ""}
                      onCommit={(v) =>
                        commit({
                          ...product,
                          links: { ...product.links, [key]: v || undefined },
                        })
                      }
                      className="text-foreground/85"
                      placeholder="https://"
                    />
                  </span>
                );
              }
              if (!href) return null;
              return (
                <a
                  key={key}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className={
                    key === "demo"
                      ? "inline-flex items-center gap-1.5 font-medium text-foreground link-underline"
                      : "inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors link-underline"
                  }
                >
                  {label} <ArrowUpRight size={13} />
                </a>
              );
            })}
          </div>
        )}
      </header>

      <div className="mb-12 max-w-3xl mx-auto">
        <ProductMockup slug={product.slug} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-14 border-t border-border pt-10">
        <div className="md:col-span-8 space-y-6 text-foreground/80 leading-[1.75] text-[17px]">
          <EditableMarkdown
            value={product.description}
            onCommit={(description) => commit({ ...product, description })}
            renderRead={(value) => (
              <>
                {value.split("\n\n").map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </>
            )}
            placeholder="Description (paragraphs separated by blank lines)"
            rows={10}
          />
        </div>

        <aside className="md:col-span-4 md:border-l md:border-border md:pl-8 space-y-10">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground mb-4">
              Stack
            </p>
            <EditableList
              items={product.techStack}
              onCommit={(techStack) => commit({ ...product, techStack })}
              listClassName="space-y-1.5 text-sm font-mono text-foreground/80"
              placeholder="Tech item"
            />
          </div>

          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground mb-4">
              Features
            </p>
            <EditableList
              items={product.features}
              onCommit={(features) => commit({ ...product, features })}
              listClassName="space-y-2 text-[14px] text-foreground/75 leading-relaxed"
              renderItem={(text) => (
                <span className="flex gap-2">
                  <span className="text-accent shrink-0">–</span>
                  <span>{text}</span>
                </span>
              )}
              placeholder="Feature"
            />
          </div>
        </aside>
      </div>
    </>
  );
}

/**
 * In-place edit for a single product card on the products list page. Just
 * the visible name + short description are inline-editable from the list
 * (deeper edits live on the detail page).
 */
export function EditableProductCardField({
  product,
  allProductsForSnapshot,
  field,
  className,
  multiline = false,
}: {
  product: Product;
  allProductsForSnapshot: Product[];
  field: "name" | "shortDescription";
  className?: string;
  multiline?: boolean;
}) {
  const { save } = useAdmin();
  const [value, setValue] = useState<string>(product[field]);

  const commit = async (next: string) => {
    setValue(next);
    const updated = { ...product, [field]: next };
    const updatedAll = allProductsForSnapshot.map((p) =>
      p.slug === updated.slug ? updated : p
    );
    const ok = await save("products", updatedAll);
    if (!ok) setValue(product[field]);
  };

  return (
    <EditableText
      as={multiline ? "div" : "span"}
      value={value}
      onCommit={commit}
      multiline={multiline}
      className={className}
      placeholder={field === "name" ? "Name" : "Short description"}
    />
  );
}
