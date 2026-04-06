"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Badge } from "./ui/badge";
import { Product } from "@/types";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  index: number;
  featured?: boolean;
}

const THEMES: Record<string, {
  text: string;
  border: string;
  glow: string;
  numColor: string;
  accentBg: string;
}> = {
  "ar-glasses": {
    text: "group-hover:text-violet-400",
    border: "group-hover:border-violet-500/40",
    glow: "from-violet-600/10 via-blue-600/5 to-transparent",
    numColor: "text-violet-500/12",
    accentBg: "bg-violet-500/5",
  },
  "charger-agent": {
    text: "group-hover:text-amber-400",
    border: "group-hover:border-amber-500/40",
    glow: "from-amber-500/10 via-orange-600/5 to-transparent",
    numColor: "text-amber-500/12",
    accentBg: "bg-amber-500/5",
  },
  "charger-mail": {
    text: "group-hover:text-teal-400",
    border: "group-hover:border-teal-500/40",
    glow: "from-teal-500/10 via-cyan-600/5 to-transparent",
    numColor: "text-teal-500/12",
    accentBg: "bg-teal-500/5",
  },
};

const DEFAULT_THEME = {
  text: "group-hover:text-accent",
  border: "group-hover:border-accent/40",
  glow: "from-accent/8 to-transparent",
  numColor: "text-foreground/10",
  accentBg: "bg-accent/5",
};

export function ProductCard({ product, index, featured = false }: ProductCardProps) {
  const theme = THEMES[product.slug] ?? DEFAULT_THEME;

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.65, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className={cn(featured && "lg:col-span-2")}
    >
      <Link href={`/products/${product.slug}`} className="group block h-full">
        <article
          className={cn(
            "relative rounded-2xl border border-border/40 bg-card/50 overflow-hidden h-full flex flex-col",
            "transition-all duration-500",
            "hover:bg-card/80 card-lift",
            theme.border
          )}
        >
          {/* Gradient glow — revealed on hover */}
          <div
            className={cn(
              "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-600 pointer-events-none",
              theme.glow
            )}
          />

          {/* Big ghost number — decorative */}
          <div
            className={cn(
              "absolute -top-6 -right-4 font-display font-bold select-none leading-none pointer-events-none",
              "transition-opacity duration-500 opacity-100 group-hover:opacity-0",
              theme.numColor
            )}
            style={{ fontSize: "clamp(5rem, 10vw, 9rem)" }}
            aria-hidden="true"
          >
            {String(index + 1).padStart(2, "0")}
          </div>

          {/* Top section */}
          <div className="relative p-7 md:p-8 flex-1">
            {/* Arrow */}
            <div className="flex justify-end mb-6">
              <div className="w-8 h-8 rounded-xl border border-border/40 flex items-center justify-center group-hover:border-border/80 transition-colors">
                <ArrowUpRight
                  size={14}
                  className="text-muted-foreground/50 transition-all duration-300 group-hover:text-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </div>
            </div>

            {/* Title */}
            <h3
              className={cn(
                "font-display font-bold text-foreground transition-colors duration-300 leading-tight",
                featured ? "text-2xl md:text-3xl" : "text-xl md:text-2xl",
                theme.text
              )}
            >
              {product.name}
            </h3>

            {/* Description */}
            <p className="mt-3 text-sm text-muted-foreground/70 leading-relaxed">
              {product.shortDescription}
            </p>

            {/* Tech tags — featured only */}
            {featured && (
              <div className="mt-6 flex flex-wrap gap-1.5">
                {product.techStack.slice(0, 5).map((tech) => (
                  <span
                    key={tech}
                    className="text-[11px] font-mono text-muted-foreground/60 bg-muted/40 border border-border/40 px-2.5 py-1 rounded-lg hover:border-border/70 hover:text-muted-foreground transition-all"
                  >
                    {tech}
                  </span>
                ))}
                {product.techStack.length > 5 && (
                  <span className="text-[11px] font-mono text-muted-foreground/40 px-2.5 py-1">
                    +{product.techStack.length - 5}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Bottom status row */}
          <div className="relative px-7 md:px-8 pb-6 pt-4 border-t border-border/25 flex items-center justify-between">
            <Badge status={product.status} />
            {!featured && (
              <div className="flex gap-2 flex-wrap items-center">
                {product.techStack.slice(0, 2).map((tech) => (
                  <span
                    key={tech}
                    className="text-[10px] font-mono text-muted-foreground/40 tracking-wide"
                  >
                    {tech}
                  </span>
                ))}
                {product.techStack.length > 2 && (
                  <span className="text-[10px] font-mono text-muted-foreground/30">
                    +{product.techStack.length - 2}
                  </span>
                )}
              </div>
            )}
          </div>
        </article>
      </Link>
    </motion.div>
  );
}
