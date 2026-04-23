import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { BlogPost } from "@/types";
import { formatDate } from "@/lib/utils";

interface BlogCardProps {
  post: BlogPost;
}

export function BlogCard({ post }: BlogCardProps) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block border-b border-border py-7"
    >
      <div className="grid grid-cols-12 gap-4 md:gap-8 items-baseline">
        <div className="col-span-12 md:col-span-3">
          <p className="font-mono text-xs text-muted-foreground">
            {formatDate(post.date)}
          </p>
          <p className="font-mono text-xs text-muted-foreground/70 mt-0.5">
            {post.category} · {post.readingTime} min
          </p>
        </div>
        <div className="col-span-12 md:col-span-8">
          <h3 className="font-serif text-2xl md:text-3xl tracking-tight text-foreground group-hover:text-accent transition-colors leading-[1.15]">
            {post.title}
          </h3>
          <p className="mt-2 text-sm text-foreground/65 leading-relaxed line-clamp-2 max-w-prose">
            {post.excerpt}
          </p>
        </div>
        <div className="hidden md:flex md:col-span-1 justify-end pt-1">
          <ArrowUpRight
            size={16}
            className="text-muted-foreground/60 transition-all duration-300 group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </div>
      </div>
    </Link>
  );
}
