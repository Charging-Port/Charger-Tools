"use client";

import { useState, useEffect, FormEvent } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Plus,
  Pencil,
  Trash2,
  Save,
  X,
  FileText,
  Eye,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

function readCsrfCookie(): string {
  if (typeof document === "undefined") return "";
  const m = document.cookie.match(/(?:^|;\s*)ct_admin_csrf=([^;]+)/);
  return m ? decodeURIComponent(m[1]) : "";
}

function csrfHeaders(): Record<string, string> {
  const t = readCsrfCookie();
  return t ? { "Content-Type": "application/json", "x-csrf-token": t } : { "Content-Type": "application/json" };
}

interface Post {
  slug: string;
  title: string;
  date: string;
  category: string;
  excerpt: string;
  body: string;
}

const CATEGORIES = ["Hardware", "Software", "Personal", "General"];

const EMPTY_POST: Post = {
  slug: "",
  title: "",
  date: "",
  category: "General",
  excerpt: "",
  body: "",
};

export function BlogAdmin() {
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [editing, setEditing] = useState<Post | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState<"write" | "preview">("write");
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    loadPosts();
  }, []);

  async function loadPosts() {
    try {
      const res = await fetch("/api/admin/posts");
      if (!res.ok) throw new Error("Failed to load posts");
      setPosts(await res.json());
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to load posts",
      });
      setPosts([]);
    }
  }

  function startNew() {
    setEditing({
      ...EMPTY_POST,
      date: new Date().toISOString().slice(0, 10),
    });
    setIsNew(true);
    setTab("write");
    setMessage(null);
  }

  function startEdit(post: Post) {
    setEditing({ ...post });
    setIsNew(false);
    setTab("write");
    setMessage(null);
  }

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/admin/posts", {
        method: "POST",
        headers: csrfHeaders(),
        body: JSON.stringify({
          ...editing,
          slug: isNew ? "" : editing.slug,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Save failed");
      }
      setMessage({
        type: "success",
        text: isNew ? "Post created" : "Post saved",
      });
      setEditing(null);
      await loadPosts();
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Save failed",
      });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(slug: string) {
    if (!confirm("Delete this post? This can't be undone.")) return;
    try {
      const res = await fetch("/api/admin/posts", {
        method: "DELETE",
        headers: csrfHeaders(),
        body: JSON.stringify({ slug }),
      });
      if (!res.ok) throw new Error("Delete failed");
      setMessage({ type: "success", text: "Post deleted" });
      await loadPosts();
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Delete failed",
      });
    }
  }

  /** Minimal markdown → HTML preview. Not a full parser, just enough to see how it'll look. */
  function renderPreview(md: string): string {
    return md
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/^### (.*)$/gm, '<h3 class="text-lg font-semibold mt-6 mb-2 text-foreground">$1</h3>')
      .replace(/^## (.*)$/gm, '<h2 class="text-xl font-semibold mt-8 mb-3 text-foreground">$1</h2>')
      .replace(/^# (.*)$/gm, '<h1 class="text-2xl font-bold mt-8 mb-4 text-foreground">$1</h1>')
      .replace(/\*\*(.+?)\*\*/g, '<strong class="text-foreground">$1</strong>')
      .replace(/\*(.+?)\*/g, "<em>$1</em>")
      .replace(/`(.+?)`/g, '<code class="bg-muted px-1.5 py-0.5 rounded text-[13px] font-mono">$1</code>')
      .replace(/\n\n/g, '</p><p class="mb-4 text-muted-foreground/80 leading-relaxed">')
      .replace(/^/, '<p class="mb-4 text-muted-foreground/80 leading-relaxed">')
      .replace(/$/, "</p>");
  }

  /* ── Editor view ──────────────────────────────────────────── */
  if (editing) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-4xl px-6 py-12">
          <button
            onClick={() => setEditing(null)}
            className="inline-flex items-center gap-2 text-xs font-mono text-muted-foreground/50 hover:text-foreground transition-colors uppercase tracking-widest mb-8"
          >
            <ArrowLeft size={12} />
            All posts
          </button>

          <p className="font-mono text-[10px] text-muted-foreground/40 uppercase tracking-[0.2em] mb-3">
            {isNew ? "New post" : `Editing — ${editing.slug || "unsaved"}`}
          </p>

          <form onSubmit={handleSave} className="space-y-6">
            {/* Title */}
            <input
              value={editing.title}
              onChange={(e) =>
                setEditing({ ...editing, title: e.target.value })
              }
              placeholder="Post title"
              required
              className="w-full bg-transparent text-3xl font-display font-bold text-foreground placeholder:text-muted-foreground/20 focus:outline-none border-b border-border/30 pb-3"
            />

            {/* Meta row */}
            <div className="flex flex-wrap gap-4">
              <div>
                <label className="block text-[10px] font-mono text-muted-foreground/40 uppercase tracking-[0.18em] mb-1.5">
                  Date
                </label>
                <input
                  type="date"
                  value={editing.date}
                  onChange={(e) =>
                    setEditing({ ...editing, date: e.target.value })
                  }
                  className="rounded-lg border border-border/40 bg-muted/15 px-3 py-2 text-sm font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-accent/40"
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono text-muted-foreground/40 uppercase tracking-[0.18em] mb-1.5">
                  Category
                </label>
                <select
                  value={editing.category}
                  onChange={(e) =>
                    setEditing({ ...editing, category: e.target.value })
                  }
                  className="rounded-lg border border-border/40 bg-muted/15 px-3 py-2 text-sm font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-accent/40"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-[10px] font-mono text-muted-foreground/40 uppercase tracking-[0.18em] mb-1.5">
                Excerpt
              </label>
              <input
                value={editing.excerpt}
                onChange={(e) =>
                  setEditing({ ...editing, excerpt: e.target.value })
                }
                placeholder="One-line description for the card"
                className="w-full rounded-lg border border-border/40 bg-muted/15 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:ring-1 focus:ring-accent/40"
              />
            </div>

            {/* Write / Preview tabs */}
            <div>
              <div className="flex gap-1 mb-3">
                <button
                  type="button"
                  onClick={() => setTab("write")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                    tab === "write"
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground/50 hover:text-foreground"
                  }`}
                >
                  <Pencil size={11} className="inline mr-1.5" />
                  Write
                </button>
                <button
                  type="button"
                  onClick={() => setTab("preview")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                    tab === "preview"
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground/50 hover:text-foreground"
                  }`}
                >
                  <Eye size={11} className="inline mr-1.5" />
                  Preview
                </button>
              </div>

              {tab === "write" ? (
                <textarea
                  value={editing.body}
                  onChange={(e) =>
                    setEditing({ ...editing, body: e.target.value })
                  }
                  placeholder="Write your post in Markdown..."
                  rows={22}
                  required
                  className="w-full rounded-lg border border-border/40 bg-muted/15 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:ring-1 focus:ring-accent/40 font-mono leading-relaxed resize-y"
                />
              ) : (
                <div
                  className="rounded-lg border border-border/40 bg-muted/15 px-6 py-4 min-h-[400px]"
                  dangerouslySetInnerHTML={{
                    __html: renderPreview(editing.body),
                  }}
                />
              )}
            </div>

            {message && (
              <div
                className={`flex items-center gap-2 text-sm ${
                  message.type === "success"
                    ? "text-emerald-400"
                    : "text-red-400"
                }`}
              >
                {message.type === "success" ? (
                  <CheckCircle size={14} />
                ) : (
                  <AlertCircle size={14} />
                )}
                {message.text}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-3 pt-4 border-t border-border/20">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 bg-accent text-accent-foreground text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-accent/90 active:scale-[0.98] transition-all disabled:opacity-50"
              >
                <Save size={14} />
                {saving ? "Saving..." : isNew ? "Create post" : "Save changes"}
              </button>
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="inline-flex items-center gap-2 text-sm text-muted-foreground/60 hover:text-foreground transition-colors px-4 py-2.5"
              >
                <X size={14} /> Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  /* ── List view ─────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-xs font-mono text-muted-foreground/50 hover:text-foreground transition-colors uppercase tracking-widest mb-8"
        >
          <ArrowLeft size={12} />
          Dashboard
        </Link>

        <div className="flex items-start justify-between mb-10">
          <div>
            <p className="font-mono text-[10px] text-muted-foreground/40 uppercase tracking-[0.2em] mb-3">
              Manage
            </p>
            <h1 className="text-3xl font-display font-bold text-foreground">
              Blog Posts
            </h1>
            <p className="mt-2 text-sm text-muted-foreground/60">
              Create, edit, or delete posts. Saved as Markdown in
              content/blog/.
            </p>
          </div>

          <button
            onClick={startNew}
            className="inline-flex items-center gap-2 bg-accent text-accent-foreground text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-accent/90 active:scale-[0.98] transition-all"
          >
            <Plus size={14} />
            New post
          </button>
        </div>

        {message && (
          <div
            className={`mb-6 rounded-lg border px-4 py-3 text-sm flex items-center gap-2 ${
              message.type === "success"
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                : "bg-red-500/10 border-red-500/20 text-red-400"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle size={14} />
            ) : (
              <AlertCircle size={14} />
            )}
            {message.text}
          </div>
        )}

        {posts === null ? (
          <p className="text-sm font-mono text-muted-foreground/40">
            Loading...
          </p>
        ) : posts.length === 0 ? (
          <div className="text-center py-20">
            <FileText size={28} className="mx-auto mb-4 text-muted-foreground/30" />
            <p className="text-muted-foreground/60">No posts yet.</p>
            <button
              onClick={startNew}
              className="mt-4 text-sm text-accent hover:underline"
            >
              Write your first post
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {posts.map((post) => (
              <div
                key={post.slug}
                className="group flex items-center justify-between rounded-xl border border-border/30 bg-card/50 px-5 py-4 hover:border-border/60 transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2.5 mb-1">
                    <span className="text-[10px] font-mono text-accent/60 uppercase tracking-[0.15em] border border-accent/20 bg-accent/5 px-2 py-0.5 rounded">
                      {post.category}
                    </span>
                    <span className="text-[11px] font-mono text-muted-foreground/40">
                      {post.date}
                    </span>
                  </div>
                  <h3 className="text-foreground font-medium truncate">
                    {post.title}
                  </h3>
                  <p className="text-sm text-muted-foreground/55 truncate">
                    {post.excerpt}
                  </p>
                </div>

                <div className="flex items-center gap-1 ml-4 shrink-0">
                  <Link
                    href={`/blog/${post.slug}`}
                    target="_blank"
                    className="p-2 text-muted-foreground/40 hover:text-foreground transition-colors rounded-lg hover:bg-muted/30"
                    title="View"
                  >
                    <Eye size={14} />
                  </Link>
                  <button
                    onClick={() => startEdit(post)}
                    className="p-2 text-muted-foreground/40 hover:text-foreground transition-colors rounded-lg hover:bg-muted/30"
                    title="Edit"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(post.slug)}
                    className="p-2 text-muted-foreground/40 hover:text-red-400 transition-colors rounded-lg hover:bg-red-500/5"
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
