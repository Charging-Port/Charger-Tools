"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";
import { Badge } from "./ui/badge";
import { Product } from "@/types";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  index: number;
  featured?: boolean;
}

const THEMES: Record<
  string,
  { glow: string; ring: string; text: string; tag: string }
> = {
  "hyperform-fitness": {
    glow: "from-emerald-500/30 via-teal-500/15 to-transparent",
    ring: "group-hover:border-emerald-400/40",
    text: "group-hover:text-emerald-300",
    tag: "bg-emerald-500/10 text-emerald-300/80 border-emerald-500/30",
  },
  "ar-glasses": {
    glow: "from-violet-500/30 via-blue-500/15 to-transparent",
    ring: "group-hover:border-violet-400/40",
    text: "group-hover:text-violet-300",
    tag: "bg-violet-500/10 text-violet-300/80 border-violet-500/30",
  },
  "charger-agent": {
    glow: "from-amber-400/30 via-orange-500/15 to-transparent",
    ring: "group-hover:border-amber-400/40",
    text: "group-hover:text-amber-300",
    tag: "bg-amber-500/10 text-amber-300/80 border-amber-500/30",
  },
  "charger-mail": {
    glow: "from-cyan-500/30 via-blue-500/15 to-transparent",
    ring: "group-hover:border-cyan-400/40",
    text: "group-hover:text-cyan-300",
    tag: "bg-cyan-500/10 text-cyan-300/80 border-cyan-500/30",
  },
  "optics-simulator": {
    glow: "from-sky-500/30 via-cyan-500/15 to-transparent",
    ring: "group-hover:border-sky-400/40",
    text: "group-hover:text-sky-300",
    tag: "bg-sky-500/10 text-sky-300/80 border-sky-500/30",
  },
  "rf-radar-simulator": {
    glow: "from-rose-500/30 via-pink-500/15 to-transparent",
    ring: "group-hover:border-rose-400/40",
    text: "group-hover:text-rose-300",
    tag: "bg-rose-500/10 text-rose-300/80 border-rose-500/30",
  },
};

const DEFAULT_THEME = {
  glow: "from-accent/25 to-transparent",
  ring: "group-hover:border-accent/50",
  text: "group-hover:text-accent",
  tag: "bg-accent/10 text-accent/80 border-accent/30",
};

export function ProductCard({ product, index, featured = false }: ProductCardProps) {
  const theme = THEMES[product.slug] ?? DEFAULT_THEME;
  const ref = useRef<HTMLDivElement>(null);

  // Mouse position for tilt
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rx = useSpring(useTransform(my, [0, 1], [6, -6]), { stiffness: 200, damping: 22 });
  const ry = useSpring(useTransform(mx, [0, 1], [-6, 6]), { stiffness: 200, damping: 22 });
  const glowX = useTransform(mx, [0, 1], ["0%", "100%"]);
  const glowY = useTransform(my, [0, 1], ["0%", "100%"]);

  const onMove = (e: React.MouseEvent) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  };
  const onLeave = () => {
    mx.set(0.5);
    my.set(0.5);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
      className={cn(featured && "lg:col-span-2")}
    >
      <Link
        href={`/products/${product.slug}`}
        className="group block h-full"
        onMouseMove={onMove}
        onMouseLeave={onLeave}
      >
        <motion.article
          ref={ref}
          style={{ rotateX: rx, rotateY: ry, transformPerspective: 1000 }}
          className={cn(
            "relative rounded-2xl border border-border/60 bg-card/50 overflow-hidden h-full flex flex-col",
            "transition-[border-color,background] duration-500 backdrop-blur-sm",
            "hover:bg-card/70",
            theme.ring
          )}
        >
          {/* Cursor-following glow */}
          <motion.div
            aria-hidden
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{
              background: `radial-gradient(400px circle at ${glowX.get()} ${glowY.get()}, hsl(var(--accent) / 0.12), transparent 60%)`,
            }}
          />

          {/* Themed gradient sweep */}
          <div
            aria-hidden
            className={cn(
              "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none",
              theme.glow
            )}
          />

          {/* Index marker (top-left) */}
          <div className="absolute top-5 left-6 font-mono text-[10px] text-muted-foreground/50 tracking-[0.2em]">
            <span className="text-accent">●</span> #{String(index + 1).padStart(3, "0")}
          </div>

          {/* Arrow (top-right) */}
          <div className="absolute top-4 right-4 w-9 h-9 rounded-full border border-border/40 grid place-items-center group-hover:border-accent/40 group-hover:bg-accent/10 transition-all">
            <ArrowUpRight
              size={14}
              className="text-muted-foreground/60 transition-all duration-300 group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </div>

          {/* Body */}
          <div className="relative px-6 pt-20 pb-6 md:px-8 md:pt-24 md:pb-8 flex-1 flex flex-col">
            <h3
              className={cn(
                "font-display font-bold text-foreground transition-colors duration-300 leading-[1.05] tracking-tight",
                featured ? "text-3xl md:text-4xl lg:text-5xl" : "text-2xl md:text-[1.7rem]",
                theme.text
              )}
            >
              {product.name}
            </h3>

            <p
              className={cn(
                "mt-4 text-sm leading-relaxed text-foreground/65",
                featured && "md:text-base max-w-2xl"
              )}
            >
              {product.shortDescription}
            </p>

            <div className="mt-auto pt-6 flex flex-wrap gap-1.5">
              {product.techStack.slice(0, featured ? 6 : 3).map((tech) => (
                <span
                  key={tech}
                  className={cn(
                    "text-[10px] font-mono tracking-wider px-2 py-1 rounded border transition-colors",
                    theme.tag
                  )}
                >
                  {tech}
                </span>
              ))}
              {product.techStack.length > (featured ? 6 : 3) && (
                <span className="text-[10px] font-mono text-muted-foreground/50 px-2 py-1">
                  +{product.techStack.length - (featured ? 6 : 3)}
                </span>
              )}
            </div>
          </div>

          {/* Footer status */}
          <div className="relative px-6 md:px-8 py-4 border-t border-border/30 flex items-center justify-between bg-background/30">
            <Badge status={product.status} />
            <div className="text-[10px] font-mono text-muted-foreground/50 tracking-widest uppercase">
              {new Date(product.dateCreated).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
              })}
            </div>
          </div>
        </motion.article>
      </Link>
    </motion.div>
  );
}
