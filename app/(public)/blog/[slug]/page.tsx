import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getPostBySlug, getPostSlugs, renderMarkdown, getAllPosts } from "@/lib/blog";
import { formatDate } from "@/lib/utils";

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "https://chargertools.com";

interface Props {
  params: { slug: string };
}

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const post = getPostBySlug(params.slug);
  if (!post) return {};

  const url = `${BASE_URL}/blog/${post.slug}`;

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url,
      type: "article",
      publishedTime: new Date(post.date).toISOString(),
      authors: ["Kaden MacLean"],
      tags: [post.category],
      images: [
        { url: "/og-image.png", width: 1200, height: 630, alt: post.title },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: ["/og-image.png"],
    },
    alternates: { canonical: url },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const post = getPostBySlug(params.slug);
  if (!post) notFound();

  const htmlContent = await renderMarkdown(post.content);
  const allPosts = getAllPosts();
  const idx = allPosts.findIndex((p) => p.slug === post.slug);
  const next = idx >= 0 && idx < allPosts.length - 1 ? allPosts[idx + 1] : null;

  return (
    <div className="pt-32 md:pt-40 pb-24">
      <article className="mx-auto max-w-2xl px-6">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-10"
        >
          <ArrowLeft size={14} />
          All posts
        </Link>

        <header className="mb-10">
          <p className="font-mono text-xs text-muted-foreground mb-4">
            {formatDate(post.date)}{" "}
            <span className="text-border">·</span>{" "}
            {post.category}{" "}
            <span className="text-border">·</span>{" "}
            {post.readingTime} min read
          </p>
          <h1 className="font-serif text-4xl md:text-5xl tracking-tight text-foreground leading-[1.1]">
            {post.title}
          </h1>
          <p className="mt-5 text-lg text-foreground/70 leading-relaxed">
            {post.excerpt}
          </p>
        </header>

        <div
          className="prose border-t border-border pt-10"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />

        <footer className="mt-16 pt-8 border-t border-border flex items-center justify-between gap-4 text-sm">
          <Link
            href="/blog"
            className="text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-2"
          >
            <ArrowLeft size={14} />
            All posts
          </Link>
          {next && (
            <Link
              href={`/blog/${next.slug}`}
              className="group text-right"
            >
              <span className="font-mono text-xs text-muted-foreground block">
                Next →
              </span>
              <span className="font-serif text-base text-foreground group-hover:text-accent transition-colors">
                {next.title}
              </span>
            </Link>
          )}
        </footer>
      </article>
    </div>
  );
}
