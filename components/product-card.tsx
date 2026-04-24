import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Product } from "@/types";
import { ProjectGlyph } from "./project-glyph";

interface ProductCardProps {
  product: Product;
  index: number;
  featured?: boolean;
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

export function ProductCard({ product, index, featured = false }: ProductCardProps) {
  if (featured) {
    return (
      <Link
        href={`/products/${product.slug}`}
        className="group block border-y border-border py-10 md:py-14 -mx-2 px-2 hover:bg-accent/[0.025] transition-colors"
      >
        <div className="grid grid-cols-12 gap-4 md:gap-8">
          <div className="col-span-12 md:col-span-3">
            <div className="text-accent/80 group-hover:text-accent transition-colors mb-4">
              <ProjectGlyph slug={product.slug} size={88} />
            </div>
            <span
              aria-hidden="true"
              className="font-serif italic text-5xl text-accent/70 group-hover:text-accent transition-colors leading-none block"
            >
              {product.name.charAt(0)}
            </span>
            <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              Featured · 01
            </p>
          </div>
          <div className="col-span-12 md:col-span-8">
            <h3 className="font-serif text-3xl md:text-5xl tracking-tightest text-foreground group-hover:text-accent transition-colors leading-[1.02]">
              {product.name}
            </h3>
            <p className="mt-2 font-mono text-xs text-muted-foreground">
              {STATUS_LABEL[product.status]}{" "}
              <span className="text-border">·</span>{" "}
              {formatMonth(product.dateCreated)}
            </p>
            <p className="mt-5 text-base md:text-lg text-foreground/80 leading-relaxed max-w-xl">
              {product.shortDescription}
            </p>
            <div className="mt-6 flex flex-wrap gap-x-3 gap-y-1 text-xs font-mono text-muted-foreground">
              {product.techStack.slice(0, 6).map((t) => (
                <span key={t}>{t}</span>
              ))}
              {product.techStack.length > 6 && (
                <span className="text-muted-foreground/60">
                  +{product.techStack.length - 6}
                </span>
              )}
            </div>
          </div>
          <div className="hidden md:flex md:col-span-1 justify-end pt-2">
            <ArrowUpRight
              size={18}
              className="text-muted-foreground/60 transition-all duration-300 group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block border-b border-border py-7"
    >
      <div className="grid grid-cols-12 gap-4 md:gap-6 items-center">
        <div className="hidden md:flex md:col-span-1 text-accent/70 group-hover:text-accent transition-colors items-center justify-center">
          <ProjectGlyph slug={product.slug} size={36} />
        </div>
        <div className="col-span-12 md:col-span-4">
          <h3 className="font-serif text-2xl md:text-[1.6rem] tracking-tight text-foreground group-hover:text-accent transition-colors leading-tight">
            {product.name}
          </h3>
          <p className="mt-1 font-mono text-[11px] text-muted-foreground">
            {STATUS_LABEL[product.status]}{" "}
            <span className="text-border">·</span>{" "}
            {formatMonth(product.dateCreated)}
          </p>
        </div>
        <div className="col-span-12 md:col-span-6">
          <p className="text-sm text-foreground/75 leading-relaxed">
            {product.shortDescription}
          </p>
          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-0.5 text-[11px] font-mono text-muted-foreground/85">
            {product.techStack.slice(0, 4).map((t) => (
              <span key={t}>{t}</span>
            ))}
            {product.techStack.length > 4 && (
              <span className="text-muted-foreground/55">
                +{product.techStack.length - 4}
              </span>
            )}
          </div>
        </div>
        <div className="hidden md:flex md:col-span-1 justify-end pt-1">
          <ArrowUpRight
            size={16}
            className="text-muted-foreground/60 transition-all duration-300 group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </div>
      </div>
    </Link>
  );
}
