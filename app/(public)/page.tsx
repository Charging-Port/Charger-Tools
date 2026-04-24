import { Hero } from "@/components/hero";
import { NumbersSpread } from "@/components/numbers-spread";
import { Pullquote } from "@/components/pullquote";
import { NewsletterSignup } from "@/components/newsletter-signup";
import { getAllProducts } from "@/lib/products";
import { getAllPosts } from "@/lib/blog";
import { BlogCard } from "@/components/blog-card";
import { ProjectGrid } from "@/components/project-grid";
import Link from "next/link";

export default function Home() {
  const products = getAllProducts();
  const posts = getAllPosts().slice(0, 3);

  return (
    <>
      <Hero />

      <NumbersSpread />

      {/* Selected work — featured first, then the rest */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
          <header className="flex items-baseline justify-between mb-12">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground mb-3">
                Selected work
              </p>
              <h2 className="font-serif text-4xl md:text-5xl tracking-tightest text-foreground leading-[1.05]">
                Things I&apos;ve <em className="text-accent">built</em>.
              </h2>
            </div>
            <Link
              href="/products"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors link-underline whitespace-nowrap"
            >
              All {products.length} →
            </Link>
          </header>

          <div className="mx-auto max-w-3xl">
            <ProjectGrid products={products.slice(0, 6)} featureFirst />
          </div>
        </div>
      </section>

      <Pullquote />

      {/* Writing */}
      {posts.length > 0 && (
        <section className="border-t border-border">
          <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
            <header className="flex items-baseline justify-between mb-12">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground mb-3">
                  Recent writing
                </p>
                <h2 className="font-serif text-4xl md:text-5xl tracking-tightest text-foreground leading-[1.05]">
                  Notes from the <em className="text-accent">workshop</em>.
                </h2>
              </div>
              <Link
                href="/blog"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors link-underline whitespace-nowrap"
              >
                Archive →
              </Link>
            </header>
            <div className="mx-auto max-w-3xl border-t border-border">
              {posts.map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Letter-format closer */}
      <section className="border-t border-border bg-card/30">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16">
            <div className="md:col-span-7">
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground mb-5">
                Get in touch
              </p>
              <h2 className="font-serif text-4xl md:text-5xl tracking-tight text-foreground leading-[1.05] mb-6">
                The fastest way to make me smile is an{" "}
                <em className="text-accent">interesting email</em>.
              </h2>
              <p className="text-foreground/75 leading-relaxed mb-7 max-w-prose">
                I read every message — projects you&apos;re building, problems
                you&apos;re stuck on, dumb ideas that might actually work.
                Hardware, computer vision, native macOS, what it&apos;s like to
                run a startup in high school — let&apos;s talk.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 text-sm font-medium text-foreground link-underline"
              >
                Send a message →
              </Link>
              <p className="mt-10 font-serif italic text-2xl text-accent/85">
                — Kaden
              </p>
            </div>
            <div className="md:col-span-5 md:border-l md:border-border md:pl-10">
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground mb-5">
                Newsletter
              </p>
              <p className="text-sm text-foreground/70 leading-relaxed mb-5 max-w-sm">
                Occasional notes when I ship something new. No noise, no
                schedule, no &ldquo;hey friends 👋&rdquo;.
              </p>
              <NewsletterSignup />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
