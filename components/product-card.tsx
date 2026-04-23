import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Product } from "@/types";

interface ProductCardProps {
  product: Product;
  index: number;
}

const STATUS_LABEL: Record<Product["status"], string> = {
  released: "Released",
  "in-development": "In development",
  prototype: "Prototype",
  concept: "Concept",
};

export function ProductCard({ product, index }: ProductCardProps) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block border-b border-border py-8 md:py-10"
      style={{ animationDelay: `${index * 40}ms` }}
    >
      <div className="grid grid-cols-12 gap-4 md:gap-8 items-baseline">
        <div className="col-span-12 md:col-span-5">
          <h3 className="font-serif text-3xl md:text-4xl tracking-tight text-foreground group-hover:text-accent transition-colors">
            {product.name}
          </h3>
          <p className="mt-1 font-mono text-xs text-muted-foreground">
            {STATUS_LABEL[product.status]}{" "}
            <span className="text-border">·</span>{" "}
            {new Date(product.dateCreated).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
            })}
          </p>
        </div>
        <div className="col-span-12 md:col-span-6">
          <p className="text-base text-foreground/75 leading-relaxed">
            {product.shortDescription}
          </p>
          <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-xs font-mono text-muted-foreground">
            {product.techStack.slice(0, 5).map((t) => (
              <span key={t}>{t}</span>
            ))}
            {product.techStack.length > 5 && (
              <span className="text-muted-foreground/60">
                +{product.techStack.length - 5}
              </span>
            )}
          </div>
        </div>
        <div className="hidden md:flex md:col-span-1 justify-end">
          <ArrowUpRight
            size={18}
            className="text-muted-foreground/60 transition-all duration-300 group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </div>
      </div>
    </Link>
  );
}
