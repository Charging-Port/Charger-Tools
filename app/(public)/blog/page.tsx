import { Metadata } from "next";
import { BlogCard } from "@/components/blog-card";
import { getAllPosts } from "@/lib/blog";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Writing",
  description: "Notes on building, learning, and shipping from Kaden MacLean.",
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="pt-32 md:pt-40 pb-24">
      <div className="mx-auto max-w-3xl px-6">
        <header className="mb-12 md:mb-16">
          <h1 className="font-serif text-4xl md:text-5xl tracking-tight text-foreground leading-[1.05]">
            Writing
          </h1>
          <p className="mt-5 text-foreground/70 leading-relaxed max-w-xl">
            Notes on building, learning, and shipping. No SEO bait — just
            things I wanted to write down.
          </p>
        </header>

        {posts.length === 0 ? (
          <p className="text-foreground/60">Nothing here yet. Check back soon.</p>
        ) : (
          <div className="border-t border-border">
            {posts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
