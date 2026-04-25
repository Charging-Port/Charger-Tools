import { Hero } from "@/components/hero";
import { FeaturedWork } from "@/components/featured-work";
import { ShippingLog } from "@/components/shipping-log";
import { NewsletterSignup } from "@/components/newsletter-signup";
import { getAllProducts } from "@/lib/products";
import { getAllPosts } from "@/lib/blog";
import { BlogCard } from "@/components/blog-card";
import { ProjectGrid } from "@/components/project-grid";
import { SectionMarker } from "@/components/section-marker";
import Link from "next/link";

export default function Home() {
  const products = getAllProducts();
  const featured = products.slice(0, 4);
  const rest = products.slice(4);
  const posts = getAllPosts().slice(0, 3);

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
                The fastest way to make me smile is an{" "}
                <em className="text-accent">interesting email</em>.
              </h2>
              <p className="text-foreground/75 leading-relaxed mb-6 max-w-prose">
                I read every message. Hardware, computer vision, native macOS,
                what it&apos;s like to run a startup in high school — let&apos;s
                talk.
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
                Occasional notes when I ship something new. No noise, no
                schedule.
              </p>
              <NewsletterSignup />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
