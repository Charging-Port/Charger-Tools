import { Hero } from "@/components/hero";
import { Currently } from "@/components/currently";
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

      <Currently />

      {/* Selected work — featured first, then the rest */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-3xl px-6 py-16 md:py-20">
          <header className="flex items-baseline justify-between mb-10">
            <h2 className="font-serif text-2xl md:text-3xl tracking-tight text-foreground">
              Selected work
            </h2>
            <Link
              href="/products"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors link-underline"
            >
              All {products.length} projects →
            </Link>
          </header>

          <ProjectGrid products={products.slice(0, 6)} featureFirst />
        </div>
      </section>

      {/* Writing */}
      {posts.length > 0 && (
        <section className="border-t border-border">
          <div className="mx-auto max-w-3xl px-6 py-16 md:py-20">
            <header className="flex items-baseline justify-between mb-10">
              <h2 className="font-serif text-2xl md:text-3xl tracking-tight text-foreground">
                Recent writing
              </h2>
              <Link
                href="/blog"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors link-underline"
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

      {/* Letter-format closer */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-3xl px-6 py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16">
            <div className="md:col-span-7">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4">
                Get in touch
              </p>
              <h2 className="font-serif text-3xl md:text-4xl tracking-tight text-foreground leading-[1.1] mb-5">
                The fastest way to make me smile is an{" "}
                <em className="text-accent">interesting email</em>.
              </h2>
              <p className="text-foreground/75 leading-relaxed mb-6 max-w-prose">
                I read every message — projects you&apos;re building, problems
                you&apos;re stuck on, dumb ideas that might actually work. If
                you want to chat about hardware, computer vision, native macOS,
                or what it&apos;s like to run a startup as a high schooler,
                let&apos;s talk.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 text-sm font-medium text-foreground link-underline"
              >
                Send a message →
              </Link>
              <p className="mt-8 font-serif italic text-foreground/60">
                — Kaden
              </p>
            </div>
            <div className="md:col-span-5 md:border-l md:border-border md:pl-10">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4">
                Newsletter
              </p>
              <p className="text-sm text-foreground/70 leading-relaxed mb-5 max-w-sm">
                Occasional notes when I ship something new. No noise, no schedule,
                no &ldquo;hey friends 👋&rdquo;.
              </p>
              <NewsletterSignup />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
