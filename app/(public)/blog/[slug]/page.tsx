import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, Calendar } from "lucide-react";
import { getPostBySlug, getPostSlugs, renderMarkdown, getAllPosts } from "@/lib/blog";
import { formatDate } from "@/lib/utils";
import { ReadingProgress } from "@/components/reading-progress";

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
      authors: ["Kaden"],
      tags: [post.category],
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: post.title,
        },
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
    <>
      <ReadingProgress />
      <div className="pt-32 md:pt-40 pb-24">
        <div className="mx-auto max-w-3xl px-6">
          <Link
            href="/blog"
            data-cursor-hover
            className="inline-flex items-center gap-2 text-sm font-mono text-muted-foreground hover:text-accent transition-colors mb-10 group"
          >
            <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" />
            All posts
          </Link>

          <header className="mb-14">
            <div className="flex items-center gap-3 text-[11px] font-mono text-muted-foreground/65 mb-6">
              <span className="border border-accent/30 bg-accent/8 text-accent/90 uppercase tracking-[0.18em] px-2 py-0.5 rounded">
                {post.category}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar size={11} />
                <time dateTime={new Date(post.date).toISOString()}>
                  {formatDate(post.date)}
                </time>
              </span>
              <span className="flex items-center gap-1.5">
                <Clock size={11} />
                {post.readingTime} min
              </span>
            </div>

            <h1 className="font-editorial text-4xl md:text-6xl tracking-tight text-foreground leading-[1.05]">
              {post.title}
            </h1>
            <p className="mt-6 text-lg text-foreground/65 leading-relaxed max-w-prose font-editorial italic">
              {post.excerpt}
            </p>
          </header>

          <div className="h-px w-24 bg-accent mb-10" />

          <article
            className="prose"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />

          <div className="mt-20 pt-8 border-t border-border/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft size={14} /> Back to all posts
            </Link>
            {next && (
              <Link
                href={`/blog/${next.slug}`}
                className="group flex flex-col sm:items-end text-sm gap-1 hover:text-foreground transition-colors"
              >
                <span className="text-[10px] font-mono text-muted-foreground/60 uppercase tracking-widest">
                  Next post
                </span>
                <span className="font-editorial text-lg text-foreground/85 group-hover:text-accent transition-colors">
                  {next.title} →
                </span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
