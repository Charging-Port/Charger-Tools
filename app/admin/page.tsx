import Link from "next/link";
import {
  ArrowUpRight,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Pencil,
  Home,
  User,
  Clock,
  Package,
  FileText,
  Sparkles,
} from "lucide-react";
import { requireAuth } from "@/lib/admin-auth";
import { getStorageMode } from "@/lib/storage";
import { getProducts, getPosts } from "@/lib/content";
import { getRecentAuditEntries } from "@/lib/audit";
import { LogoutButton } from "./_components/logout-button";

export const metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

const PAGE_LINKS: {
  href: string;
  label: string;
  description: string;
  icon: typeof Home;
}[] = [
  {
    href: "/",
    label: "Home",
    description: "Hero, Currently sidebar, intro",
    icon: Home,
  },
  {
    href: "/about",
    label: "About",
    description: "Bio, timeline, skills, music",
    icon: User,
  },
  {
    href: "/now",
    label: "Now",
    description: "What you're up to right now",
    icon: Clock,
  },
  {
    href: "/products",
    label: "Work",
    description: "Project list (per-card edit)",
    icon: Package,
  },
  {
    href: "/blog",
    label: "Writing",
    description: "Post list",
    icon: FileText,
  },
];

export default async function AdminDashboardPage() {
  requireAuth();

  const [products, posts, audit] = await Promise.all([
    getProducts(),
    getPosts(),
    getRecentAuditEntries(8),
  ]);

  const storageMode = getStorageMode();

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-6 py-12">
        {/* Header */}
        <div className="flex items-start justify-between mb-12">
          <div>
            <p className="font-mono text-[10px] text-muted-foreground/40 uppercase tracking-[0.2em] mb-3">
              Admin · Console
            </p>
            <h1 className="text-4xl font-display font-bold text-foreground">
              You&apos;re signed in.
            </h1>
            <p className="mt-3 text-sm text-muted-foreground/70 max-w-lg leading-relaxed">
              Open any public page below and click on text to edit it
              in-place. The floating toolbar at the bottom toggles edit mode.
            </p>
          </div>
          <LogoutButton />
        </div>

        {/* Storage status — always visible so the user knows whether saves persist */}
        <StorageBanner mode={storageMode} />

        {/* Direct-edit page links */}
        <section className="mb-10">
          <div className="mb-4 flex items-baseline gap-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              Edit on the page
            </span>
            <span className="h-px flex-1 bg-border/40" />
            <span className="font-mono text-[10px] text-muted-foreground/50 inline-flex items-center gap-1">
              <Sparkles size={11} className="text-accent/70" />
              Recommended
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {PAGE_LINKS.map(({ href, label, description, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="group rounded-xl border border-border/40 bg-card/40 hover:bg-card/70 hover:border-border/70 transition-colors p-4"
              >
                <div className="flex items-start justify-between mb-2">
                  <Icon size={16} className="text-accent/70" />
                  <Pencil
                    size={11}
                    className="text-muted-foreground/40 group-hover:text-accent transition-colors"
                  />
                </div>
                <p className="font-display font-semibold text-foreground text-sm">
                  {label}
                </p>
                <p className="text-[11px] text-muted-foreground/55 leading-relaxed mt-0.5">
                  {description}
                </p>
                <p className="font-mono text-[10px] text-muted-foreground/40 mt-2">
                  {href}
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* Bulk admin pages */}
        <section className="mb-10">
          <div className="mb-4 flex items-baseline gap-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              Bulk operations
            </span>
            <span className="h-px flex-1 bg-border/40" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Link
              href="/admin/products"
              className="group rounded-xl border border-border/40 bg-card/40 hover:bg-card/70 hover:border-border/70 transition-colors p-5"
            >
              <div className="flex items-start justify-between mb-3">
                <Package size={18} className="text-accent/70" />
                <ArrowUpRight
                  size={13}
                  className="text-muted-foreground/40 group-hover:text-foreground transition-colors"
                />
              </div>
              <h2 className="font-display font-bold text-foreground">
                Products
              </h2>
              <p className="text-xs text-muted-foreground/55 mt-1 leading-relaxed">
                Reorder, change status, create or delete projects.
              </p>
              <p className="font-mono text-[10px] text-accent/50 mt-3">
                {products.length}{" "}
                {products.length === 1 ? "product" : "products"}
              </p>
            </Link>

            <Link
              href="/admin/blog"
              className="group rounded-xl border border-border/40 bg-card/40 hover:bg-card/70 hover:border-border/70 transition-colors p-5"
            >
              <div className="flex items-start justify-between mb-3">
                <FileText size={18} className="text-accent/70" />
                <ArrowUpRight
                  size={13}
                  className="text-muted-foreground/40 group-hover:text-foreground transition-colors"
                />
              </div>
              <h2 className="font-display font-bold text-foreground">
                Blog Posts
              </h2>
              <p className="text-xs text-muted-foreground/55 mt-1 leading-relaxed">
                Create, full-page edit, or delete posts. Markdown editor.
              </p>
              <p className="font-mono text-[10px] text-accent/50 mt-3">
                {posts.length} {posts.length === 1 ? "post" : "posts"}
              </p>
            </Link>
          </div>
        </section>

        {/* Recent activity */}
        {audit.length > 0 && (
          <section className="mb-10">
            <div className="mb-4 flex items-baseline gap-3">
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                Recent activity
              </span>
              <span className="h-px flex-1 bg-border/40" />
            </div>
            <ul className="space-y-1.5">
              {audit.map((e, i) => (
                <li
                  key={i}
                  className="flex items-center gap-3 text-xs font-mono"
                >
                  {e.ok ? (
                    <CheckCircle2
                      size={12}
                      className="text-emerald-400/80 shrink-0"
                    />
                  ) : (
                    <XCircle size={12} className="text-red-400/80 shrink-0" />
                  )}
                  <span className="text-muted-foreground/50 w-44 shrink-0 truncate">
                    {new Date(e.ts).toLocaleString()}
                  </span>
                  <span className="text-foreground/80 w-32 truncate">
                    {e.action}
                    {e.scope ? `:${e.scope}` : ""}
                  </span>
                  <span className="text-muted-foreground/40 truncate">
                    {e.ip ?? ""}
                    {e.meta?.reason ? ` · ${String(e.meta.reason)}` : ""}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Footer */}
        <div className="mt-10 pt-6 border-t border-border/20 text-[11px] font-mono text-muted-foreground/40 leading-relaxed space-y-1">
          <p>
            Inline edits write to{" "}
            <span className="text-foreground/55">
              {storageMode === "kv"
                ? "Vercel KV / Upstash Redis"
                : storageMode === "dev-file"
                ? ".dev-kv.json (local development)"
                : "no backing store"}
            </span>
            .
          </p>
          <p>
            Sessions, CSRF, audit log, schema validation — all enforced on
            /api/admin/content. See lib/csrf.ts and lib/content.ts.
          </p>
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-2 mt-8 text-xs font-mono text-muted-foreground/50 hover:text-foreground transition-colors uppercase tracking-widest"
        >
          ← Back to public site
        </Link>
      </div>
    </div>
  );
}

function StorageBanner({ mode }: { mode: "kv" | "dev-file" | "none" }) {
  if (mode === "kv") {
    return (
      <div className="mb-8 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.04] px-4 py-3 flex items-start gap-3">
        <CheckCircle2 size={16} className="text-emerald-400 mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-medium text-foreground/90">
            Storage: Vercel KV
          </p>
          <p className="text-[12px] text-muted-foreground/65 mt-0.5">
            Inline edits persist across deployments and instances.
          </p>
        </div>
      </div>
    );
  }
  if (mode === "dev-file") {
    return (
      <div className="mb-8 rounded-xl border border-accent/20 bg-accent/[0.04] px-4 py-3 flex items-start gap-3">
        <CheckCircle2 size={16} className="text-accent mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-medium text-foreground/90">
            Storage: local <code>.dev-kv.json</code>
          </p>
          <p className="text-[12px] text-muted-foreground/65 mt-0.5">
            Inline edits persist to this dev file. To deploy, provision Vercel
            KV / Upstash and set <code>KV_REST_API_URL</code> +{" "}
            <code>KV_REST_API_TOKEN</code>.
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="mb-8 rounded-xl border border-amber-500/30 bg-amber-500/[0.06] px-4 py-3 flex items-start gap-3">
      <AlertTriangle size={16} className="text-amber-400 mt-0.5 shrink-0" />
      <div>
        <p className="text-sm font-medium text-foreground/90">
          Storage: not configured
        </p>
        <p className="text-[12px] text-muted-foreground/70 mt-0.5">
          Inline edit saves will return 503 in production. Provision Vercel
          KV / Upstash and set <code>KV_REST_API_URL</code> +{" "}
          <code>KV_REST_API_TOKEN</code> to enable persistence.
        </p>
      </div>
    </div>
  );
}
