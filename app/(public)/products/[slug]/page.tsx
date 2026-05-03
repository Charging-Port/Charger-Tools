import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProducts, getProductBySlug } from "@/lib/content";
import { EditableProduct } from "@/components/admin/editable-product";
import { ProductMockup } from "@/components/product-mockup";

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "https://chargertools.com";

interface Props {
  params: { slug: string };
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);
  if (!product) return {};
  const url = `${BASE_URL}/products/${product.slug}`;
  return {
    title: product.name,
    description: product.shortDescription,
    openGraph: {
      title: product.name,
      description: product.shortDescription,
      url,
      type: "website",
      images: [
        { url: "/og-image.png", width: 1200, height: 630, alt: product.name },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: product.shortDescription,
      images: ["/og-image.png"],
    },
    alternates: { canonical: url },
  };
}

export default async function ProductPage({ params }: Props) {
  const [product, allProducts] = await Promise.all([
    getProductBySlug(params.slug),
    getProducts(),
  ]);
  if (!product) notFound();

  const idx = allProducts.findIndex((p) => p.slug === product.slug);
  const prev = idx > 0 ? allProducts[idx - 1] : null;
  const next = idx < allProducts.length - 1 ? allProducts[idx + 1] : null;

  return (
    <div className="pt-28 md:pt-36 pb-24">
      <article className="mx-auto max-w-5xl px-6">
        <EditableProduct
          initial={product}
          allProductsForSnapshot={allProducts}
        />

        {(prev || next) && (
          <nav className="mt-20 pt-10 border-t border-border grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              {prev && (
                <Link
                  href={`/products/${prev.slug}`}
                  className="group block rounded-lg border border-border p-4 hover:border-accent/40 hover:bg-card/40 transition-colors"
                >
                  <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground block mb-3">
                    ← Previous
                  </span>
                  <div className="grid grid-cols-[1fr_90px] gap-3 items-start">
                    <div>
                      <span className="font-serif text-xl text-foreground group-hover:text-accent transition-colors leading-tight block">
                        {prev.name}
                      </span>
                      <p className="mt-1 font-mono text-[10px] text-muted-foreground">
                        {prev.status === "released"
                          ? "Released"
                          : prev.status === "in-development"
                          ? "In development"
                          : prev.status === "prototype"
                          ? "Prototype"
                          : "Concept"}
                      </p>
                    </div>
                    <div className="scale-[0.55] origin-top-right">
                      <ProductMockup slug={prev.slug} />
                    </div>
                  </div>
                </Link>
              )}
            </div>
            <div>
              {next && (
                <Link
                  href={`/products/${next.slug}`}
                  className="group block rounded-lg border border-border p-4 hover:border-accent/40 hover:bg-card/40 transition-colors md:text-right"
                >
                  <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground block mb-3">
                    Next →
                  </span>
                  <div className="grid grid-cols-[90px_1fr] gap-3 items-start">
                    <div className="scale-[0.55] origin-top-left">
                      <ProductMockup slug={next.slug} />
                    </div>
                    <div>
                      <span className="font-serif text-xl text-foreground group-hover:text-accent transition-colors leading-tight block">
                        {next.name}
                      </span>
                      <p className="mt-1 font-mono text-[10px] text-muted-foreground">
                        {next.status === "released"
                          ? "Released"
                          : next.status === "in-development"
                          ? "In development"
                          : next.status === "prototype"
                          ? "Prototype"
                          : "Concept"}
                      </p>
                    </div>
                  </div>
                </Link>
              )}
            </div>
          </nav>
        )}
      </article>
    </div>
  );
}
