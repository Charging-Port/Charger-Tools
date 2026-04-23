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

  const activeProducts = products.filter((p) => p.status !== "released");
  const shippedProducts = products.filter((p) => p.status === "released");

  return (
    <div className="pt-32 md:pt-40 pb-24">
      <div className="mx-auto max-w-3xl px-6">
        <header className="mb-12 md:mb-16">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4">
            Work · {products.length} projects
          </p>
          <h1 className="font-serif text-4xl md:text-5xl tracking-tight text-foreground leading-[1.05]">
            Everything I&apos;ve built, <em className="text-accent">so far</em>.
          </h1>
          <p className="mt-6 text-foreground/75 leading-relaxed max-w-xl">
            Hardware, software, and systems I&apos;ve built from scratch —
            native Mac apps, a computer-vision startup, wearable AR
            prototypes, and the physics simulators that helped me design them.
            Some are shipping, most are still in development.
          </p>
        </header>

        {activeProducts.length > 0 && (
          <section className="mb-20">
            <div className="mb-6 flex items-baseline gap-3">
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                In flight
              </span>
              <span className="h-px flex-1 bg-border" />
              <span className="font-mono text-[11px] text-muted-foreground/70">
                {activeProducts.length}
              </span>
            </div>
            <ProjectGrid products={activeProducts} featureFirst />
          </section>
        )}

        {shippedProducts.length > 0 && (
          <section>
            <div className="mb-6 flex items-baseline gap-3">
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Shipped
              </span>
              <span className="h-px flex-1 bg-border" />
              <span className="font-mono text-[11px] text-muted-foreground/70">
                {shippedProducts.length}
              </span>
            </div>
            <ProjectGrid products={shippedProducts} />
          </section>
        )}
      </div>
    </div>
  );
}
