import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getProductBySlug, getProductSlugs } from "@/lib/products";
import { formatDate } from "@/lib/utils";

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "https://chargertools.com";

interface Props {
  params: { slug: string };
}

// Per-product accent colors for detail pages
const productAccents: Record<string, { glow: string; number: string }> = {
  "ar-glasses": {
    glow: "from-violet-600/10 via-blue-600/6 to-transparent",
    number: "text-violet-500/15",
  },
  "charger-agent": {
    glow: "from-amber-500/10 via-orange-600/6 to-transparent",
    number: "text-amber-500/15",
  },
  "charger-mail": {
    glow: "from-teal-500/10 via-cyan-600/6 to-transparent",
    number: "text-teal-500/15",
  },
};

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

  const hasLinks = Object.values(product.links).some(Boolean);
  const accent = productAccents[product.slug] ?? {
    glow: "from-accent/6 to-transparent",
    number: "text-foreground/8",
  };

  return (
    <div className="py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        {/* Back */}
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-sm font-mono text-muted-foreground hover:text-foreground transition-colors mb-12 group"
        >
          <ArrowLeft
            size={14}
            className="transition-transform group-hover:-translate-x-0.5"
          />
          All work
        </Link>

        {/* Hero */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 mb-20">
          <div className="lg:col-span-7">
            <div className="flex items-center gap-3 mb-6">
              <Badge status={product.status} />
              <span className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground/60">
                <Calendar size={12} />
                {formatDate(product.dateCreated)}
              </span>
            </div>

            <h1 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl tracking-tight text-foreground leading-tight mb-5">
              {product.name}
            </h1>

            <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
              {product.shortDescription}
            </p>

            {hasLinks && (
              <div className="mt-8 flex flex-wrap gap-3">
                {product.links.github && (
                  <a
                    href={product.links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-medium text-foreground border border-border/60 px-5 py-2.5 rounded-xl hover:bg-muted/30 hover:border-border transition-colors"
                  >
                    GitHub <ArrowUpRight size={13} />
                  </a>
                )}
                {product.links.demo && (
                  <a
                    href={product.links.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-semibold bg-accent text-accent-foreground px-5 py-2.5 rounded-xl hover:bg-accent/90 transition-colors"
                  >
                    Live Demo <ArrowUpRight size={13} />
                  </a>
                )}
                {product.links.website && (
                  <a
                    href={product.links.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-medium text-foreground border border-border/60 px-5 py-2.5 rounded-xl hover:bg-muted/30 transition-colors"
                  >
                    Website <ArrowUpRight size={13} />
                  </a>
                )}
                {product.links.download && (
                  <a
                    href={product.links.download}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-medium text-foreground border border-border/60 px-5 py-2.5 rounded-xl hover:bg-muted/30 transition-colors"
                  >
                    Download <ArrowUpRight size={13} />
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Visual card */}
          <div className="lg:col-span-5">
            <div
              className={`aspect-square rounded-2xl bg-gradient-to-br ${accent.glow} border border-border/40 relative overflow-hidden flex items-center justify-center`}
            >
              <span
                className={`font-display font-bold select-none leading-none ${accent.number}`}
                style={{ fontSize: "clamp(6rem, 16vw, 12rem)" }}
                aria-hidden="true"
              >
                {product.name.charAt(0)}
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 border-t border-border/30 pt-16">
          {/* Description */}
          <div className="lg:col-span-7">
            <h2 className="font-mono text-xs text-muted-foreground/60 uppercase tracking-widest mb-6">
              Overview
            </h2>
            <div className="space-y-5 text-muted-foreground leading-relaxed">
              {product.description.split("\n\n").map((paragraph, i) => (
                <p key={i} className="text-base">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 space-y-10">
            {/* Features */}
            <div>
              <h2 className="font-mono text-xs text-muted-foreground/60 uppercase tracking-widest mb-5">
                Key Features
              </h2>
              <ul className="space-y-3">
                {product.features.map((feature) => (
                  <li
                    key={feature}
                    className="text-sm text-muted-foreground flex items-start gap-3"
                  >
                    <span className="text-accent mt-1 shrink-0">→</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Tech stack */}
            <div>
              <h2 className="font-mono text-xs text-muted-foreground/60 uppercase tracking-widest mb-5">
                Tech Stack
              </h2>
              <div className="flex flex-wrap gap-2">
                {product.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="text-xs font-mono text-muted-foreground bg-muted/30 border border-border/40 px-3 py-1.5 rounded-lg"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
