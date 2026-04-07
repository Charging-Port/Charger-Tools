"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ChevronUp,
  ChevronDown,
  Save,
  CheckCircle,
  AlertCircle,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import type { Product, ProductStatus } from "@/types";

const STATUS_OPTIONS: { value: ProductStatus; label: string }[] = [
  { value: "concept", label: "Concept" },
  { value: "prototype", label: "Prototype" },
  { value: "in-development", label: "In Development" },
  { value: "released", label: "Released" },
];

interface NewProduct {
  name: string;
  shortDescription: string;
  description: string;
  status: ProductStatus;
  techStack: string; // one per line
  features: string; // one per line
  links: {
    github: string;
    website: string;
    demo: string;
    download: string;
  };
}

const EMPTY_NEW_PRODUCT: NewProduct = {
  name: "",
  shortDescription: "",
  description: "",
  status: "concept",
  techStack: "",
  features: "",
  links: { github: "", website: "", demo: "", download: "" },
};

export function ProductsAdmin({
  initialProducts,
}: {
  initialProducts: Product[];
}) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [view, setView] = useState<"list" | "new">("list");
  const [creating, setCreating] = useState<NewProduct>(EMPTY_NEW_PRODUCT);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= products.length) return;
    const next = [...products];
    [next[index], next[target]] = [next[target], next[index]];
    next.forEach((p, i) => (p.order = i + 1));
    setProducts(next);
    setDirty(true);
    setMessage(null);
  }

  function changeStatus(id: string, status: ProductStatus) {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status } : p))
    );
    setDirty(true);
    setMessage(null);
  }

  async function save() {
    setSaving(true);
    setMessage(null);

    const updates = products.map((p) => ({
      id: p.id,
      status: p.status,
      order: p.order,
    }));

    try {
      const res = await fetch("/api/admin/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ updates }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Save failed");
      }
      setMessage({ type: "success", text: "Changes saved" });
      setDirty(false);
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Save failed",
      });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      const res = await fetch("/api/admin/products", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Delete failed");
      }
      setProducts((prev) => {
        const next = prev.filter((p) => p.id !== id);
        next.forEach((p, i) => (p.order = i + 1));
        return next;
      });
      setMessage({ type: "success", text: `"${name}" deleted` });
      setDirty(false);
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Delete failed",
      });
    }
  }

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const techStack = creating.techStack
      .split("\n")
      .map((t) => t.trim())
      .filter(Boolean);
    const features = creating.features
      .split("\n")
      .map((f) => f.trim())
      .filter(Boolean);

    const links: { github?: string; website?: string; demo?: string; download?: string } = {};
    if (creating.links.github.trim()) links.github = creating.links.github.trim();
    if (creating.links.website.trim()) links.website = creating.links.website.trim();
    if (creating.links.demo.trim()) links.demo = creating.links.demo.trim();
    if (creating.links.download.trim()) links.download = creating.links.download.trim();

    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: creating.name.trim(),
          shortDescription: creating.shortDescription.trim(),
          description: creating.description.trim(),
          status: creating.status,
          techStack,
          features,
          links,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Create failed");
      }
      const { product } = await res.json();
      setProducts((prev) => [...prev, product]);
      setMessage({ type: "success", text: `"${product.name}" created` });
      setView("list");
      setCreating(EMPTY_NEW_PRODUCT);
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Create failed",
      });
    } finally {
      setSaving(false);
    }
  }

  /* ── New Product Form ──────────────────────────────────────── */
  if (view === "new") {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-4xl px-6 py-12">
          <button
            onClick={() => {
              setView("list");
              setMessage(null);
            }}
            className="inline-flex items-center gap-2 text-xs font-mono text-muted-foreground/50 hover:text-foreground transition-colors uppercase tracking-widest mb-8"
          >
            <ArrowLeft size={12} />
            All products
          </button>

          <p className="font-mono text-[10px] text-muted-foreground/40 uppercase tracking-[0.2em] mb-3">
            New product
          </p>

          <form onSubmit={handleCreate} className="space-y-6">
            {/* Name */}
            <input
              value={creating.name}
              onChange={(e) =>
                setCreating({ ...creating, name: e.target.value })
              }
              placeholder="Product name"
              required
              className="w-full bg-transparent text-3xl font-display font-bold text-foreground placeholder:text-muted-foreground/20 focus:outline-none border-b border-border/30 pb-3"
            />

            {/* Status */}
            <div>
              <label className="block text-[10px] font-mono text-muted-foreground/40 uppercase tracking-[0.18em] mb-1.5">
                Status
              </label>
              <select
                value={creating.status}
                onChange={(e) =>
                  setCreating({
                    ...creating,
                    status: e.target.value as ProductStatus,
                  })
                }
                className="rounded-lg border border-border/40 bg-muted/15 px-3 py-2 text-sm font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-accent/40"
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Short description */}
            <div>
              <label className="block text-[10px] font-mono text-muted-foreground/40 uppercase tracking-[0.18em] mb-1.5">
                Short description
              </label>
              <input
                value={creating.shortDescription}
                onChange={(e) =>
                  setCreating({ ...creating, shortDescription: e.target.value })
                }
                placeholder="One or two sentences shown on the project card"
                required
                className="w-full rounded-lg border border-border/40 bg-muted/15 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:ring-1 focus:ring-accent/40"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-[10px] font-mono text-muted-foreground/40 uppercase tracking-[0.18em] mb-1.5">
                Description
              </label>
              <textarea
                value={creating.description}
                onChange={(e) =>
                  setCreating({ ...creating, description: e.target.value })
                }
                placeholder="Full description for the project detail page..."
                rows={6}
                required
                className="w-full rounded-lg border border-border/40 bg-muted/15 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:ring-1 focus:ring-accent/40 resize-y"
              />
            </div>

            {/* Tech stack + Features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-mono text-muted-foreground/40 uppercase tracking-[0.18em] mb-1.5">
                  Tech stack — one per line
                </label>
                <textarea
                  value={creating.techStack}
                  onChange={(e) =>
                    setCreating({ ...creating, techStack: e.target.value })
                  }
                  placeholder={"Python\nOpenCV\nTensorFlow"}
                  rows={5}
                  className="w-full rounded-lg border border-border/40 bg-muted/15 px-4 py-3 text-sm font-mono text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:ring-1 focus:ring-accent/40 resize-y"
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono text-muted-foreground/40 uppercase tracking-[0.18em] mb-1.5">
                  Key features — one per line
                </label>
                <textarea
                  value={creating.features}
                  onChange={(e) =>
                    setCreating({ ...creating, features: e.target.value })
                  }
                  placeholder={"Real-time tracking\nEdge inference\n30fps analysis"}
                  rows={5}
                  className="w-full rounded-lg border border-border/40 bg-muted/15 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:ring-1 focus:ring-accent/40 resize-y"
                />
              </div>
            </div>

            {/* Links */}
            <div>
              <label className="block text-[10px] font-mono text-muted-foreground/40 uppercase tracking-[0.18em] mb-3">
                Links — all optional
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(
                  [
                    { key: "github", label: "GitHub", placeholder: "https://github.com/you/repo" },
                    { key: "website", label: "Website", placeholder: "https://yourproject.com" },
                    { key: "demo", label: "Demo", placeholder: "https://demo.yourproject.com" },
                    { key: "download", label: "Download", placeholder: "https://..." },
                  ] as const
                ).map(({ key, label, placeholder }) => (
                  <div key={key}>
                    <label className="block text-[10px] font-mono text-muted-foreground/30 uppercase tracking-[0.15em] mb-1">
                      {label}
                    </label>
                    <input
                      type="text"
                      value={creating.links[key]}
                      onChange={(e) =>
                        setCreating({
                          ...creating,
                          links: { ...creating.links, [key]: e.target.value },
                        })
                      }
                      placeholder={placeholder}
                      className="w-full rounded-lg border border-border/40 bg-muted/15 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:ring-1 focus:ring-accent/40"
                    />
                  </div>
                ))}
              </div>
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

            <div className="flex items-center gap-3 pt-4 border-t border-border/20">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 bg-accent text-accent-foreground text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-accent/90 active:scale-[0.98] transition-all disabled:opacity-50"
              >
                <Save size={14} />
                {saving ? "Creating..." : "Create product"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setView("list");
                  setMessage(null);
                }}
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

  /* ── List View ─────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-6 py-12">
        {/* Header */}
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
              Products
            </h1>
            <p className="mt-2 text-sm text-muted-foreground/60">
              Reorder with arrows. Change status with the dropdown. Save when
              done.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                setView("new");
                setMessage(null);
              }}
              className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-xl border border-border/60 hover:bg-muted/30 active:scale-[0.98] transition-all"
            >
              <Plus size={14} />
              New
            </button>
            <button
              onClick={save}
              disabled={saving}
              className="inline-flex items-center gap-2 bg-accent text-accent-foreground text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-accent/90 active:scale-[0.98] transition-all disabled:opacity-60"
            >
              <Save size={14} />
              {saving ? "Saving..." : dirty ? "Save changes" : "Saved"}
            </button>
          </div>
        </div>

        {/* Messages */}
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

        {/* Product list */}
        {products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground/60">No products yet.</p>
            <button
              onClick={() => setView("new")}
              className="mt-4 text-sm text-accent hover:underline"
            >
              Add your first product
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {products.map((product, index) => (
              <div
                key={product.id}
                className="flex items-center gap-4 rounded-xl border border-border/30 bg-card/50 px-5 py-4 hover:border-border/60 transition-colors"
              >
                {/* Order index */}
                <span className="font-mono text-[10px] text-accent/40 w-6 shrink-0">
                  {String(index + 1).padStart(2, "0")}
                </span>

                {/* Reorder buttons */}
                <div className="flex flex-col gap-0.5 shrink-0">
                  <button
                    onClick={() => move(index, -1)}
                    disabled={index === 0}
                    className="text-muted-foreground/40 hover:text-foreground disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                    aria-label="Move up"
                  >
                    <ChevronUp size={14} />
                  </button>
                  <button
                    onClick={() => move(index, 1)}
                    disabled={index === products.length - 1}
                    className="text-muted-foreground/40 hover:text-foreground disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                    aria-label="Move down"
                  >
                    <ChevronDown size={14} />
                  </button>
                </div>

                {/* Name + slug */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-foreground font-medium truncate">
                    {product.name}
                  </h3>
                  <p className="text-[11px] font-mono text-muted-foreground/40 truncate">
                    /products/{product.slug}
                  </p>
                </div>

                {/* Status dropdown */}
                <select
                  value={product.status}
                  onChange={(e) =>
                    changeStatus(product.id, e.target.value as ProductStatus)
                  }
                  className="rounded-lg border border-border/40 bg-muted/20 px-3 py-1.5 text-xs font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-accent/40 shrink-0"
                >
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>

                {/* Delete button */}
                <button
                  onClick={() => handleDelete(product.id, product.name)}
                  className="p-2 text-muted-foreground/40 hover:text-red-400 transition-colors rounded-lg hover:bg-red-500/5 shrink-0"
                  aria-label={`Delete ${product.name}`}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}

        {dirty && (
          <p className="mt-6 text-[11px] font-mono text-amber-400/60">
            ● Unsaved changes
          </p>
        )}
      </div>
    </div>
  );
}
