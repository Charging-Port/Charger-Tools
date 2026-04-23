import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { getProductBySlug, getProductSlugs, getAllProducts } from "@/lib/products";
import { formatDate } from "@/lib/utils";

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
  const numberLabel = String(idx + 1).padStart(2, "0");

  return (
    <div className="pt-28 md:pt-36 pb-24">
      <article className="mx-auto max-w-3xl px-6">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-10"
        >
          <ArrowLeft size={14} />
          All work
        </Link>

        {/* Chapter header */}
        <header className="mb-12 grid grid-cols-12 gap-4 md:gap-6">
          <div className="col-span-12 md:col-span-2">
            <span
              aria-hidden="true"
              className="font-serif italic text-[5rem] md:text-8xl text-accent leading-none block"
            >
              {product.name.charAt(0)}
            </span>
            <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              No. {numberLabel}
            </p>
          </div>
          <div className="col-span-12 md:col-span-10">
            <p className="font-mono text-xs text-muted-foreground mb-3">
              {STATUS_LABEL[product.status]}{" "}
              <span className="text-border">·</span>{" "}
              {formatDate(product.dateCreated)}
            </p>
            <h1 className="font-serif text-4xl md:text-[3.5rem] tracking-tight text-foreground leading-[1.02]">
              {product.name}
            </h1>
            <p className="mt-5 font-serif italic text-lg md:text-xl text-foreground/75 leading-snug max-w-xl">
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
          </div>
        </header>

        {/* Body */}
        <div className="border-t border-border pt-10 space-y-6 text-foreground/80 leading-[1.75] text-[17px]">
          {product.description.split("\n\n").map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>

        {/* Features + stack */}
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-12 gap-8 border-t border-border pt-10">
          <div className="sm:col-span-7">
            <h2 className="font-serif text-xl tracking-tight text-foreground mb-5">
              Features
            </h2>
            <ul className="space-y-2.5 text-[15px] text-foreground/80 leading-relaxed">
              {product.features.map((feature) => (
                <li key={feature} className="flex gap-3">
                  <span className="text-accent shrink-0">→</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="sm:col-span-5 sm:border-l sm:border-border sm:pl-8">
            <h2 className="font-serif text-xl tracking-tight text-foreground mb-5">
              Stack
            </h2>
            <ul className="space-y-1.5 text-sm font-mono text-muted-foreground">
              {product.techStack.map((tech) => (
                <li key={tech}>{tech}</li>
              ))}
            </ul>
          </div>
        </div>

        {(prev || next) && (
          <nav className="mt-20 pt-8 border-t border-border grid grid-cols-2 gap-4 text-sm">
            <div>
              {prev && (
                <Link href={`/products/${prev.slug}`} className="group block">
                  <span className="font-mono text-xs text-muted-foreground block mb-1">
                    ← Previous
                  </span>
                  <span className="font-serif text-lg text-foreground group-hover:text-accent transition-colors">
                    {prev.name}
                  </span>
                </Link>
              )}
            </div>
            <div className="text-right">
              {next && (
                <Link href={`/products/${next.slug}`} className="group block">
                  <span className="font-mono text-xs text-muted-foreground block mb-1">
                    Next →
                  </span>
                  <span className="font-serif text-lg text-foreground group-hover:text-accent transition-colors">
                    {next.name}
                  </span>
                </Link>
              )}
            </div>
          </nav>
        )}
      </article>
    </div>
  );
}
