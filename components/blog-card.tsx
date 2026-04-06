"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { BlogPost } from "@/types";
import { formatDate } from "@/lib/utils";

interface BlogCardProps {
  post: BlogPost;
  index: number;
}

export function BlogCard({ post, index }: BlogCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link href={`/blog/${post.slug}`} className="group block">
        <article className="py-7 border-b border-border/30 transition-all duration-300 hover:border-border/60 relative">
          {/* Background hover fill */}
          <div className="absolute inset-x-0 inset-y-0 bg-muted/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none -mx-4 px-4" />

          <div className="relative flex items-start justify-between gap-6">
            <div className="flex-1 min-w-0">
              {/* Meta row */}
              <div className="flex items-center gap-2.5 mb-3">
                <span className="text-[10px] font-mono text-accent/70 uppercase tracking-[0.15em] border border-accent/20 bg-accent/5 px-2 py-0.5 rounded">
                  {post.category}
                </span>
                <span className="w-1 h-1 rounded-full bg-border" />
                <span className="text-[11px] font-mono text-muted-foreground/50">
                  {formatDate(post.date)}
                </span>
                <span className="w-1 h-1 rounded-full bg-border" />
                <span className="text-[11px] font-mono text-muted-foreground/50">
                  {post.readingTime} min read
                </span>
              </div>

              <h3 className="font-display text-lg md:text-xl font-bold text-foreground group-hover:text-accent/90 transition-colors duration-300 leading-snug mb-2">
                {post.title}
              </h3>
              <p className="text-sm text-muted-foreground/65 leading-relaxed line-clamp-2">
                {post.excerpt}
              </p>
            </div>

            {/* Arrow icon in a subtle box */}
            <div className="shrink-0 w-8 h-8 mt-0.5 rounded-xl border border-border/30 flex items-center justify-center group-hover:border-border/70 group-hover:bg-muted/30 transition-all duration-300">
              <ArrowUpRight
                size={13}
                className="text-muted-foreground/40 transition-all duration-300 group-hover:text-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </div>
          </div>
        </article>
      </Link>
    </motion.div>
  );
}
