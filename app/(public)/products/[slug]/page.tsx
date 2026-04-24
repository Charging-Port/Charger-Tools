import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { getProductBySlug, getProductSlugs, getAllProducts } from "@/lib/products";
import { formatDate } from "@/lib/utils";
import { ProductMockup } from "@/components/product-mockup";

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "https://chargertools.com";

interface Props {
  params: { slug: string };
}

const STATUS_LABEL: Record<string, string> = {
  released: "Released",
  "in-development": "In development",
  prototype: "Prototype",
  concept: "Concept",
};

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return getProductSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const product = getProductBySlug(params.slug);
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
      images: [{ url: "/og-image.png", width: 1200, height: 630, alt: product.name }],
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

export default function ProductPage({ params }: Props) {
  const product = getProductBySlug(params.slug);
  if (!product) notFound();

  const allProducts = getAllProducts();
  const idx = allProducts.findIndex((p) => p.slug === product.slug);
  const prev = idx > 0 ? allProducts[idx - 1] : null;
  const next = idx < allProducts.length - 1 ? allProducts[idx + 1] : null;

  const hasLinks = Object.values(product.links).some(Boolean);

  return (
    <div className="pt-28 md:pt-36 pb-24">
      <article className="mx-auto max-w-5xl px-6">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-10"
        >
          <ArrowLeft size={14} />
          All work
        </Link>

        {/* Header — name + lead, then a wide mockup */}
        <header className="mb-10">
          <p className="font-mono text-xs text-muted-foreground mb-3">
            {STATUS_LABEL[product.status]}{" "}
            <span className="text-border">·</span>{" "}
            {formatDate(product.dateCreated)}
          </p>
          <h1 className="font-serif text-4xl md:text-[3.5rem] tracking-tightest text-foreground leading-[1.02]">
            {product.name}
          </h1>
          <p className="mt-5 font-serif italic text-xl md:text-2xl text-foreground/75 leading-snug max-w-2xl">
            {product.shortDescription}
          </p>
          {hasLinks && (
            <div className="mt-7 flex flex-wrap gap-x-5 gap-y-3 text-sm">
              {product.links.demo && (
                <a
                  href={product.links.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-medium text-foreground link-underline"
                >
                  Live demo <ArrowUpRight size={13} />
                </a>
              )}
              {product.links.website && (
                <a
                  href={product.links.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors link-underline"
                >
                  Website <ArrowUpRight size={13} />
                </a>
              )}
              {product.links.github && (
                <a
                  href={product.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors link-underline"
                >
                  GitHub <ArrowUpRight size={13} />
                </a>
              )}
              {product.links.download && (
                <a
                  href={product.links.download}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors link-underline"
                >
                  Download <ArrowUpRight size={13} />
                </a>
              )}
            </div>
          )}
        </header>

        <div className="mb-12 max-w-3xl mx-auto">
          <ProductMockup slug={product.slug} />
        </div>

        {/* Body — two-column layout: prose + sidebar */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-14 border-t border-border pt-10">
          <div className="md:col-span-8 space-y-6 text-foreground/80 leading-[1.75] text-[17px]">
            {product.description.split("\n\n").map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>

          <aside className="md:col-span-4 md:border-l md:border-border md:pl-8 space-y-10">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground mb-4">
                Stack
              </p>
              <ul className="space-y-1.5 text-sm font-mono text-foreground/80">
                {product.techStack.map((tech) => (
                  <li key={tech}>{tech}</li>
                ))}
              </ul>
            </div>

            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground mb-4">
                Features
              </p>
              <ul className="space-y-2 text-[14px] text-foreground/75 leading-relaxed">
                {product.features.map((feature) => (
                  <li key={feature} className="flex gap-2">
                    <span className="text-accent shrink-0">–</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>

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
                        {prev.status === "released" ? "Released" : prev.status === "in-development" ? "In development" : prev.status === "prototype" ? "Prototype" : "Concept"}
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
                        {next.status === "released" ? "Released" : next.status === "in-development" ? "In development" : next.status === "prototype" ? "Prototype" : "Concept"}
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
