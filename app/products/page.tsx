import { Metadata } from "next";
import { SectionHeader } from "@/components/ui/section-header";
import { ProjectGrid } from "@/components/project-grid";
import { getAllProducts } from "@/lib/products";

export const metadata: Metadata = {
  title: "Work",
  description: "Hardware and software projects built by ChargerTools.",
};

export default function ProductsPage() {
  const products = getAllProducts();

  return (
    <div className="py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeader
          number="01"
          title="Work"
          description="Hardware and software built from scratch — wearable AR to native macOS tools."
        />
        <ProjectGrid products={products} />
      </div>
    </div>
  );
}
