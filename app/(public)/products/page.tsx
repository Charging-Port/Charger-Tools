import { Metadata } from "next";
import { SectionHeader } from "@/components/ui/section-header";
import { ProjectGrid } from "@/components/project-grid";
import { getAllProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Work",
  description: "Hardware and software projects built by ChargerTools.",
};

export default function ProductsPage() {
  const products = getAllProducts();

  return (
    <div className="pt-32 md:pt-40 pb-24 md:pb-32">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <SectionHeader
          number="00"
          title="Work"
          italic="every thread"
          description="Hardware and software built from scratch — wearable AR systems, native macOS tools, AI agents, and the simulators that helped me design them."
        />
        <ProjectGrid products={products} />
      </div>
    </div>
  );
}
