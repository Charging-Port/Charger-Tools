import { Product } from "@/types";
import { ProductCard } from "./product-card";

interface ProjectGridProps {
  products: Product[];
}

export function ProjectGrid({ products }: ProjectGridProps) {
  return (
    <div className="border-t border-border">
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} index={index} />
      ))}
    </div>
  );
}
