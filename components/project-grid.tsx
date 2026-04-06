import { Product } from "@/types";
import { ProductCard } from "./product-card";

interface ProjectGridProps {
  products: Product[];
}

export function ProjectGrid({ products }: ProjectGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          index={index}
          featured={index === 0}
        />
      ))}
    </div>
  );
}
