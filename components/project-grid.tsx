"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Product, ProductStatus } from "@/types";
import { ProductCard } from "./product-card";
import { LayoutGrid, List as ListIcon } from "lucide-react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

interface ProjectGridProps {
  products: Product[];
}

const STATUS_LABELS: Record<ProductStatus | "all", string> = {
  all: "All",
  released: "Released",
  "in-development": "In Dev",
  prototype: "Prototype",
  concept: "Concept",
};

const FILTERS: Array<ProductStatus | "all"> = [
  "all",
  "released",
  "in-development",
  "prototype",
];

export function ProjectGrid({ products }: ProjectGridProps) {
  const [filter, setFilter] = useState<ProductStatus | "all">("all");
  const [view, setView] = useState<"grid" | "list">("grid");

  const filtered = useMemo(
    () =>
      filter === "all" ? products : products.filter((p) => p.status === filter),
    [filter, products]
  );

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: products.length };
    products.forEach((p) => {
      c[p.status] = (c[p.status] ?? 0) + 1;
    });
    return c;
  }, [products]);

  return (
    <div>
      {/* Toolbar */}
      <div className="flex items-center justify-between flex-wrap gap-4 mb-8 pb-4 border-b border-border/40">
        <div className="flex items-center gap-1 flex-wrap">
          {FILTERS.map((f) => {
            const active = f === filter;
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                data-cursor-hover
                className={`relative inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-widest px-3 py-1.5 rounded-full border transition-all ${
                  active
                    ? "border-accent text-accent bg-accent/10"
                    : "border-border/50 text-muted-foreground hover:text-foreground hover:border-border"
                }`}
              >
                {STATUS_LABELS[f]}
                <span
                  className={`text-[9px] ${
                    active ? "text-accent/80" : "text-muted-foreground/60"
                  }`}
                >
                  ({counts[f] ?? 0})
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-1 border border-border/50 rounded-full p-0.5">
          <button
            onClick={() => setView("grid")}
            aria-label="Grid view"
            className={`p-1.5 rounded-full transition-colors ${
              view === "grid"
                ? "bg-muted/60 text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <LayoutGrid size={13} />
          </button>
          <button
            onClick={() => setView("list")}
            aria-label="List view"
            className={`p-1.5 rounded-full transition-colors ${
              view === "list"
                ? "bg-muted/60 text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <ListIcon size={13} />
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {view === "grid" ? (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {filtered.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                index={index}
                featured={index === 0 && filtered.length > 1}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-border/40"
          >
            {filtered.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <Link
                  href={`/products/${p.slug}`}
                  className="group grid grid-cols-12 gap-4 md:gap-8 py-7 md:py-9 border-b border-border/40 hover:border-border transition-colors"
                >
                  <div className="col-span-2 md:col-span-1 font-mono text-[10px] text-accent/70 tracking-[0.2em] pt-1">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div className="col-span-10 md:col-span-7">
                    <h3 className="font-display text-2xl md:text-3xl font-semibold text-foreground/90 group-hover:text-accent transition-colors">
                      {p.name}
                    </h3>
                    <p className="mt-2 text-sm text-foreground/60 leading-relaxed max-w-xl">
                      {p.shortDescription}
                    </p>
                  </div>
                  <div className="col-span-12 md:col-span-3 flex md:flex-col gap-2 md:items-end pt-1">
                    <span className="text-[10px] font-mono text-muted-foreground/70 uppercase tracking-widest">
                      {p.status.replace("-", " ")}
                    </span>
                    <span className="text-[10px] font-mono text-muted-foreground/40">
                      {new Date(p.dateCreated).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                      })}
                    </span>
                  </div>
                  <div className="hidden md:flex md:col-span-1 items-start justify-end pt-1">
                    <div className="w-8 h-8 rounded-full border border-border/40 grid place-items-center group-hover:border-accent group-hover:bg-accent transition-all">
                      <ArrowUpRight
                        size={13}
                        className="text-muted-foreground/60 group-hover:text-accent-foreground transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
