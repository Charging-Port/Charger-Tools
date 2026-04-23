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

  return (
    <div className="pt-32 md:pt-40 pb-24">
      <article className="mx-auto max-w-3xl px-6">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-10"
        >
          <ArrowLeft size={14} />
          All work
        </Link>

        <header className="mb-10">
          <p className="font-mono text-xs text-muted-foreground mb-4">
            {STATUS_LABEL[product.status]}{" "}
            <span className="text-border">·</span>{" "}
            {formatDate(product.dateCreated)}
          </p>
          <h1 className="font-serif text-4xl md:text-5xl tracking-tight text-foreground leading-[1.05]">
            {product.name}
          </h1>
          <p className="mt-5 text-lg text-foreground/75 leading-relaxed max-w-prose">
            {product.shortDescription}
          </p>

          {hasLinks && (
            <div className="mt-8 flex flex-wrap gap-x-5 gap-y-3 text-sm">
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

        <div className="border-t border-border pt-10 space-y-6 text-foreground/80 leading-[1.7]">
          {product.description.split("\n\n").map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-8 border-t border-border pt-10">
          <div>
            <h2 className="text-sm font-medium text-foreground mb-4">
              Features
            </h2>
            <ul className="space-y-2.5 text-sm text-foreground/75">
              {product.features.map((feature) => (
                <li key={feature} className="flex gap-2">
                  <span className="text-accent">–</span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-sm font-medium text-foreground mb-4">
              Stack
            </h2>
            <div className="flex flex-wrap gap-x-3 gap-y-1.5 text-sm font-mono text-muted-foreground">
              {product.techStack.map((tech) => (
                <span key={tech}>{tech}</span>
              ))}
            </div>
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
