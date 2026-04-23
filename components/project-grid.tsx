import { Product } from "@/types";
import { ProductCard } from "./product-card";

interface ProjectGridProps {
  products: Product[];
  featureFirst?: boolean;
}

export function ProjectGrid({ products, featureFirst = false }: ProjectGridProps) {
  return (
    <div className={featureFirst ? "" : "border-t border-border"}>
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          index={index}
          featured={featureFirst && index === 0}
        />
      ))}
    </div>
  );
}
