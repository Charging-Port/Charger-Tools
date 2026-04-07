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
    <div className="py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeader
          number="01"
          title="Writing"
          description="Notes on building, learning, and shipping."
        />

        {posts.length === 0 ? (
          <p className="text-muted-foreground font-mono text-sm">
            Nothing here yet. Check back soon.
          </p>
        ) : (
          <div className="max-w-3xl">
            {posts.map((post, i) => (
              <BlogCard key={post.slug} post={post} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
