import { Metadata } from "next";
import { ProjectGrid } from "@/components/project-grid";
import { getAllProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Work",
  description: "Hardware and software projects built by Kaden MacLean.",
};

export default function ProductsPage() {
  const products = getAllProducts();

  return (
    <div className="pt-32 md:pt-40 pb-24">
      <div className="mx-auto max-w-3xl px-6">
        <header className="mb-12 md:mb-16">
          <h1 className="font-serif text-4xl md:text-5xl tracking-tight text-foreground leading-[1.05]">
            Work
          </h1>
          <p className="mt-5 text-foreground/70 leading-relaxed max-w-xl">
            Hardware and software built from scratch — wearable AR systems,
            native macOS tools, AI agents, and the physics simulators that
            helped me design them.
          </p>
        </header>
        <ProjectGrid products={products} />
      </div>
    </div>
  );
}
