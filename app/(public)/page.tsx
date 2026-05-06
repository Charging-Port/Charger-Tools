import { Hero } from "@/components/hero";
import { FeaturedWork } from "@/components/featured-work";
import { ShippingLog } from "@/components/shipping-log";
import { NewsletterSignup } from "@/components/newsletter-signup";
import { getAllProducts } from "@/lib/products";
import { getAllPosts } from "@/lib/blog";
import { getSiteText } from "@/lib/site-text";
import { BlogCard } from "@/components/blog-card";
import { ProjectGrid } from "@/components/project-grid";
import { SectionMarker } from "@/components/section-marker";
import Link from "next/link";

function renderHomepageHeadline(input: string) {
  const out: React.ReactNode[] = [];
  const regex = /\{accent:([^}]+)\}/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;
  while ((match = regex.exec(input)) !== null) {
    if (match.index > lastIndex) out.push(input.slice(lastIndex, match.index));
    out.push(
      <em key={key++} className="text-accent">
        {match[1]}
      </em>
    );
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < input.length) out.push(input.slice(lastIndex));
  return out;
}

export default function Home() {
  const products = getAllProducts();
  const featured = products.slice(0, 4);
  const rest = products.slice(4);
  const posts = getAllPosts().slice(0, 3);
  const text = getSiteText();

  return (
    <>
      <Hero />

      <SectionMarker num="01" label="The work" />

      {/* Selected work — the centerpiece */}
      <section>
        <div className="mx-auto max-w-5xl px-6 py-16 md:py-20">
          <header className="flex items-baseline justify-between mb-12">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground mb-2">
                Selected work · {products.length} total
              </p>
              <h2 className="font-serif text-3xl md:text-4xl tracking-tight text-foreground leading-[1.05]">
                Recent shipping.
              </h2>
            </div>
            <Link
              href="/products"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors link-underline whitespace-nowrap"
            >
              All projects →
            </Link>
          </header>

          <FeaturedWork products={featured} />

          {/* Older work — compact rows beneath */}
          {rest.length > 0 && (
            <div className="mt-20 pt-12 border-t border-border">
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground mb-6">
                Also building
              </p>
              <ProjectGrid products={rest} />
            </div>
          )}
        </div>
      </section>

      <ShippingLog />

      {posts.length > 0 && <SectionMarker num="02" label="Writing" />}

      {/* Writing */}
      {posts.length > 0 && (
        <section>
          <div className="mx-auto max-w-5xl px-6 py-16 md:py-20">
            <header className="flex items-baseline justify-between mb-12">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground mb-2">
                  Writing
                </p>
                <h2 className="font-serif text-3xl md:text-4xl tracking-tight text-foreground leading-[1.05]">
                  Notes from the workshop.
                </h2>
              </div>
              <Link
                href="/blog"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors link-underline whitespace-nowrap"
              >
                Archive →
              </Link>
            </header>
            <div className="border-t border-border">
              {posts.map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
          </div>
        </section>
      )}

      <SectionMarker num="03" label="Reach out" />

      {/* Closer */}
      <section>
        <div className="mx-auto max-w-5xl px-6 py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16">
            <div className="md:col-span-7">
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground mb-3">
                Get in touch
              </p>
              <h2 className="font-serif text-3xl md:text-4xl tracking-tight text-foreground leading-[1.1] mb-5">
                {renderHomepageHeadline(text.homepage.closerHeadline)}
              </h2>
              <p className="text-foreground/75 leading-relaxed mb-6 max-w-prose">
                {text.homepage.closerBody}
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 text-sm font-medium text-foreground link-underline"
              >
                Send a message →
              </Link>
            </div>
            <div className="md:col-span-5 md:border-l md:border-border md:pl-10">
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground mb-3">
                Newsletter
              </p>
              <p className="text-sm text-foreground/70 leading-relaxed mb-5 max-w-sm">
                {text.homepage.newsletterBody}
              </p>
              <NewsletterSignup />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
