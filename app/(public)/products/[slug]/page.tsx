import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getProductBySlug, getProductSlugs, getAllProducts } from "@/lib/products";
import { formatDate } from "@/lib/utils";
import { ProductGlyph } from "@/components/product-glyph";

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "https://chargertools.com";

interface Props {
  params: { slug: string };
}

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
  const currentIdx = allProducts.findIndex((p) => p.slug === product.slug);
  const prev = allProducts[(currentIdx - 1 + allProducts.length) % allProducts.length];
  const next = allProducts[(currentIdx + 1) % allProducts.length];

  const hasLinks = Object.values(product.links).some(Boolean);

  return (
    <div className="pt-32 md:pt-40 pb-24 md:pb-32">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        {/* Back */}
        <Link
          href="/products"
          data-cursor-hover
          className="inline-flex items-center gap-2 text-sm font-mono text-muted-foreground hover:text-accent transition-colors mb-12 group"
        >
          <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" />
          All work
        </Link>

        {/* Hero */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 mb-20">
          <div className="lg:col-span-7">
            <div className="flex items-center gap-3 mb-6">
              <span className="font-mono text-[11px] text-accent tracking-[0.22em]">
                ◆ #{String(currentIdx + 1).padStart(3, "0")}
              </span>
              <Badge status={product.status} />
              <span className="flex items-center gap-1.5 text-[11px] font-mono text-muted-foreground/60">
                <Calendar size={11} />
                {formatDate(product.dateCreated)}
              </span>
            </div>

            <h1
              className="font-display font-bold tracking-tighter leading-[0.92] mb-6"
              style={{ fontSize: "clamp(2.75rem, 7vw, 5.5rem)" }}
            >
              {product.name}
            </h1>

            <p className="font-editorial text-xl md:text-2xl text-foreground/75 leading-snug max-w-xl">
              {product.shortDescription}
            </p>

            {hasLinks && (
              <div className="mt-10 flex flex-wrap gap-3">
                {product.links.demo && (
                  <a
                    href={product.links.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor-magnet
                    className="magnet-zone inline-flex items-center gap-2 text-sm font-semibold bg-accent text-accent-foreground px-6 py-3 rounded-full hover:bg-accent/90 transition-colors shadow-[0_0_20px_-4px_hsl(var(--accent)/0.5)]"
                  >
                    Live Demo <ArrowUpRight size={13} />
                  </a>
                )}
                {product.links.website && (
                  <a
                    href={product.links.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-medium text-foreground border border-border/70 px-6 py-3 rounded-full hover:bg-muted/30 hover:border-accent/40 transition-colors"
                  >
                    Website <ArrowUpRight size={13} />
                  </a>
                )}
                {product.links.github && (
                  <a
                    href={product.links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-medium text-foreground border border-border/70 px-6 py-3 rounded-full hover:bg-muted/30 hover:border-accent/40 transition-colors"
                  >
                    GitHub <ArrowUpRight size={13} />
                  </a>
                )}
                {product.links.download && (
                  <a
                    href={product.links.download}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-medium text-foreground border border-border/70 px-6 py-3 rounded-full hover:bg-muted/30 hover:border-accent/40 transition-colors"
                  >
                    Download <ArrowUpRight size={13} />
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Visual glyph */}
          <div className="lg:col-span-5">
            <ProductGlyph slug={product.slug} name={product.name} />
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 border-t border-border/40 pt-16">
          <div className="lg:col-span-7">
            <h2 className="font-mono text-[11px] text-accent uppercase tracking-[0.2em] mb-6">
              [ 01 ] Overview
            </h2>
            <div className="space-y-6 text-foreground/75 leading-[1.75]">
              {product.description.split("\n\n").map((paragraph, i) => (
                <p key={i} className="text-base md:text-[17px]">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 space-y-10">
            <div>
              <h2 className="font-mono text-[11px] text-accent uppercase tracking-[0.2em] mb-5">
                [ 02 ] Features
              </h2>
              <ul className="space-y-3">
                {product.features.map((feature) => (
                  <li
                    key={feature}
                    className="text-sm text-foreground/75 flex items-start gap-3 leading-relaxed"
                  >
                    <span className="text-accent mt-0.5 shrink-0">▸</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="font-mono text-[11px] text-accent uppercase tracking-[0.2em] mb-5">
                [ 03 ] Stack
              </h2>
              <div className="flex flex-wrap gap-2">
                {product.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="text-[11px] font-mono text-foreground/75 bg-muted/30 border border-border/50 px-3 py-1.5 rounded-lg hover:border-accent/40 hover:text-accent transition-colors"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Prev / Next */}
        <div className="mt-24 grid grid-cols-2 gap-4 border-t border-border/40 pt-8">
          <Link
            href={`/products/${prev.slug}`}
            className="group flex flex-col gap-1 p-4 rounded-xl hover:bg-muted/30 transition-colors"
          >
            <span className="text-[10px] font-mono text-muted-foreground/60 uppercase tracking-widest inline-flex items-center gap-1.5">
              <ArrowLeft size={11} className="transition-transform group-hover:-translate-x-0.5" />
              Previous
            </span>
            <span className="font-display text-lg text-foreground/90 group-hover:text-accent transition-colors">
              {prev.name}
            </span>
          </Link>
          <Link
            href={`/products/${next.slug}`}
            className="group flex flex-col gap-1 p-4 rounded-xl hover:bg-muted/30 transition-colors text-right"
          >
            <span className="text-[10px] font-mono text-muted-foreground/60 uppercase tracking-widest inline-flex items-center gap-1.5 justify-end">
              Next
              <ArrowUpRight
                size={11}
                className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </span>
            <span className="font-display text-lg text-foreground/90 group-hover:text-accent transition-colors">
              {next.name}
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
