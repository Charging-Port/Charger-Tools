"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { BlogPost } from "@/types";
import { formatDate } from "@/lib/utils";

interface BlogCardProps {
  post: BlogPost;
  index: number;
}

export function BlogCard({ post, index }: BlogCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link href={`/blog/${post.slug}`} className="group block">
        <article className="relative grid grid-cols-12 gap-4 md:gap-8 py-7 md:py-9 border-b border-border/50 transition-colors hover:border-border">
          {/* Index */}
          <div className="col-span-2 md:col-span-1 flex items-start pt-1">
            <span className="font-mono text-[10px] text-accent/70 tracking-[0.2em]">
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>

          {/* Meta */}
          <div className="col-span-10 md:col-span-3 flex flex-col gap-1.5">
            <span className="text-[10px] font-mono text-muted-foreground/60 uppercase tracking-[0.18em] inline-flex items-center gap-1.5 w-fit border border-border/60 px-2 py-0.5 rounded">
              <span className="w-1 h-1 bg-accent rounded-full" />
              {post.category}
            </span>
            <span className="text-[11px] font-mono text-muted-foreground/55">
              {formatDate(post.date)} · {post.readingTime} min
            </span>
          </div>

          {/* Title */}
          <div className="col-span-12 md:col-span-7 lg:col-span-7">
            <h3 className="font-editorial text-2xl md:text-3xl lg:text-4xl leading-[1.1] text-foreground/90 group-hover:text-accent transition-colors">
              {post.title}
            </h3>
            <p className="mt-3 text-sm text-foreground/55 leading-relaxed line-clamp-2 max-w-prose">
              {post.excerpt}
            </p>
          </div>

          {/* Arrow */}
          <div className="hidden md:flex md:col-span-1 items-start justify-end pt-1">
            <div className="w-9 h-9 rounded-full border border-border/40 grid place-items-center transition-all group-hover:bg-accent group-hover:border-accent">
              <ArrowUpRight
                size={14}
                className="text-muted-foreground/60 group-hover:text-accent-foreground transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </div>
          </div>
        </article>
      </Link>
    </motion.div>
  );
}
