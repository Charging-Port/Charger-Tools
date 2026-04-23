import { Hero } from "@/components/hero";
import { NewsletterSignup } from "@/components/newsletter-signup";
import { getAllProducts } from "@/lib/products";
import { getAllPosts } from "@/lib/blog";
import { BlogCard } from "@/components/blog-card";
import { ProjectGrid } from "@/components/project-grid";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Home() {
  const products = getAllProducts();
  const posts = getAllPosts().slice(0, 3);

  return (
    <>
      <Hero />

      {/* Selected work — all projects */}
      <section className="py-20 md:py-28 border-t border-border">
        <div className="mx-auto max-w-3xl px-6">
          <div className="flex items-baseline justify-between mb-10">
            <h2 className="font-serif text-2xl md:text-3xl tracking-tight text-foreground">
              Selected work
            </h2>
            <Link
              href="/products"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors link-underline"
            >
              All projects
            </Link>
          </div>
          <ProjectGrid products={products} />
        </div>
      </section>

      {/* Writing */}
      {posts.length > 0 && (
        <section className="py-20 md:py-28 border-t border-border">
          <div className="mx-auto max-w-3xl px-6">
            <div className="flex items-baseline justify-between mb-10">
              <h2 className="font-serif text-2xl md:text-3xl tracking-tight text-foreground">
                Recent writing
              </h2>
              <Link
                href="/blog"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors link-underline"
              >
                All posts
              </Link>
            </div>
            <div className="border-t border-border">
              {posts.map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter + contact */}
      <section className="py-20 md:py-28 border-t border-border">
        <div className="mx-auto max-w-3xl px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
            <div>
              <h2 className="font-serif text-2xl md:text-3xl tracking-tight text-foreground mb-3">
                Stay in touch
              </h2>
              <p className="text-sm text-foreground/65 leading-relaxed mb-5">
                Occasional updates on new projects and writing. No noise.
              </p>
              <NewsletterSignup />
            </div>
            <div>
              <h2 className="font-serif text-2xl md:text-3xl tracking-tight text-foreground mb-3">
                Say hi
              </h2>
              <p className="text-sm text-foreground/65 leading-relaxed mb-5">
                Have an idea, question, or just want to chat about hardware,
                software, or computer vision? I read everything.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 text-sm font-medium text-foreground link-underline"
              >
                Get in touch
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
