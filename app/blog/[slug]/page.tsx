import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, Calendar } from "lucide-react";
import { getPostBySlug, getPostSlugs, renderMarkdown } from "@/lib/blog";
import { formatDate } from "@/lib/utils";

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const post = getPostBySlug(params.slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const post = getPostBySlug(params.slug);
  if (!post) notFound();

  const htmlContent = await renderMarkdown(post.content);

  return (
    <div className="py-24 md:py-32">
      <div className="mx-auto max-w-3xl px-6">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-10"
        >
          <ArrowLeft size={14} /> All posts
        </Link>

        <header className="mb-12">
          <div className="flex items-center gap-3 text-sm text-muted-foreground mb-4">
            <span className="bg-muted/50 px-2 py-0.5 rounded">
              {post.category}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar size={14} />
              {formatDate(post.date)}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={14} />
              {post.readingTime} min read
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground">
            {post.title}
          </h1>
        </header>

        <article
          className="prose"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </div>
    </div>
  );
}
