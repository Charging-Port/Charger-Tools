"use client";

import { useState } from "react";
import { useAdmin } from "./admin-context";
import { EditableText } from "./editable-text";
import { EditableMarkdown } from "./editable-markdown";
import { formatDate } from "@/lib/utils";
import type { BlogPost } from "@/types";

/**
 * In-place editor for a single blog post detail page. The visitor render
 * uses the server-rendered HTML (sanitized markdown) passed in via
 * `renderedHtml`. In edit mode the body becomes a textarea — saves
 * persist the *raw markdown*, and after save the page refreshes so the
 * server can re-sanitize and re-render.
 */
export function EditablePost({
  initial,
  renderedHtml,
  allPostsForSnapshot,
}: {
  initial: BlogPost;
  renderedHtml: string;
  /** All posts at render-time, used to construct the saved snapshot. */
  allPostsForSnapshot: BlogPost[];
}) {
  const { save, authed, editMode } = useAdmin();
  const [post, setPost] = useState<BlogPost>(initial);
  const editable = authed && editMode;

  const commit = async (next: BlogPost) => {
    setPost(next);
    const updatedAll = allPostsForSnapshot.map((p) =>
      p.slug === next.slug ? next : p
    );
    const ok = await save("blog", updatedAll);
    if (!ok) setPost(initial);
  };

  return (
    <>
      <header className="mb-10">
        <p className="font-mono text-xs text-muted-foreground mb-4">
          <EditableText
            as="span"
            value={post.date}
            onCommit={(date) => commit({ ...post, date })}
            placeholder="YYYY-MM-DD"
          >
            {editable ? post.date : formatDate(post.date)}
          </EditableText>{" "}
          <span className="text-border">·</span>{" "}
          <EditableText
            as="span"
            value={post.category}
            onCommit={(category) => commit({ ...post, category })}
            placeholder="Category"
          />{" "}
          <span className="text-border">·</span>{" "}
          {post.readingTime} min read
        </p>
        <EditableText
          as="h1"
          value={post.title}
          onCommit={(title) => commit({ ...post, title })}
          className="font-serif text-4xl md:text-5xl tracking-tight text-foreground leading-[1.1]"
          placeholder="Post title"
        />
        <EditableText
          as="p"
          multiline
          value={post.excerpt}
          onCommit={(excerpt) => commit({ ...post, excerpt })}
          className="mt-5 text-lg text-foreground/70 leading-relaxed"
          placeholder="One-line excerpt"
        />
      </header>

      <EditableMarkdown
        value={post.content}
        onCommit={(content) => commit({ ...post, content })}
        renderRead={() => (
          <div
            className="prose"
            dangerouslySetInnerHTML={{ __html: renderedHtml }}
          />
        )}
        className="border-t border-border pt-10"
        placeholder="Markdown body…"
        rows={20}
      />
    </>
  );
}
