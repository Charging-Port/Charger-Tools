import { Metadata } from "next";
import { SectionHeader } from "@/components/ui/section-header";
import { BlogCard } from "@/components/blog-card";
import { getAllPosts } from "@/lib/blog";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Writing",
  description: "Notes on building, learning, and shipping from ChargerTools.",
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="pt-32 md:pt-40 pb-24 md:pb-32">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <SectionHeader
          number="00"
          title="Writing"
          italic="& thinking"
          description="Notes on building, learning, and shipping. No SEO bait — just things I actually wanted to write down."
        />

        {posts.length === 0 ? (
          <p className="text-muted-foreground font-mono text-sm">
            Nothing here yet. Check back soon.
          </p>
        ) : (
          <div className="border-t border-border/40">
            {posts.map((post, i) => (
              <BlogCard key={post.slug} post={post} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
