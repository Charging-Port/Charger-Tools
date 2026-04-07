import Link from "next/link";
import { FileText, Package, ArrowUpRight, LogOut } from "lucide-react";
import { requireAuth } from "@/lib/admin-auth";
import { getAllProducts } from "@/lib/products";
import { getAllPosts } from "@/lib/blog";
import { LogoutButton } from "./_components/logout-button";

export const metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

export default function AdminDashboardPage() {
  requireAuth();

  const products = getAllProducts();
  const posts = getAllPosts();

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-6 py-12">
        {/* Header */}
        <div className="flex items-start justify-between mb-12">
          <div>
            <p className="font-mono text-[10px] text-muted-foreground/40 uppercase tracking-[0.2em] mb-3">
              Admin Panel
            </p>
            <h1 className="text-4xl font-display font-bold text-foreground">
              Dashboard
            </h1>
            <p className="mt-2 text-sm text-muted-foreground/60">
              Manage your products and blog posts.
            </p>
          </div>
          <LogoutButton />
        </div>

        {/* Section cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Link
            href="/admin/products"
            className="group rounded-2xl border border-border/40 bg-card/50 p-6 hover:border-border/70 hover:bg-card/70 transition-all card-lift"
          >
            <div className="flex items-start justify-between mb-4">
              <Package size={20} className="text-accent/70" />
              <ArrowUpRight
                size={14}
                className="text-muted-foreground/40 group-hover:text-foreground transition-colors"
              />
            </div>
            <h2 className="font-display font-bold text-foreground text-lg mb-1">
              Products
            </h2>
            <p className="text-xs text-muted-foreground/55 mb-4">
              Reorder projects and change their status (prototype, in
              development, released, concept).
            </p>
            <p className="font-mono text-[10px] text-accent/50">
              {products.length} {products.length === 1 ? "product" : "products"}
            </p>
          </Link>

          <Link
            href="/admin/blog"
            className="group rounded-2xl border border-border/40 bg-card/50 p-6 hover:border-border/70 hover:bg-card/70 transition-all card-lift"
          >
            <div className="flex items-start justify-between mb-4">
              <FileText size={20} className="text-accent/70" />
              <ArrowUpRight
                size={14}
                className="text-muted-foreground/40 group-hover:text-foreground transition-colors"
              />
            </div>
            <h2 className="font-display font-bold text-foreground text-lg mb-1">
              Blog Posts
            </h2>
            <p className="text-xs text-muted-foreground/55 mb-4">
              Create, edit, and delete blog posts. Markdown with live preview.
            </p>
            <p className="font-mono text-[10px] text-accent/50">
              {posts.length} {posts.length === 1 ? "post" : "posts"}
            </p>
          </Link>
        </div>

        {/* Back to site */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-mono text-muted-foreground/50 hover:text-foreground transition-colors uppercase tracking-widest"
        >
          ← Back to public site
        </Link>

        {/* Footer note */}
        <div className="mt-16 pt-6 border-t border-border/20">
          <p className="text-[11px] font-mono text-muted-foreground/35 leading-relaxed">
            Edits are saved to local files (content/products.json and
            content/blog/*.md). To deploy changes to production, commit the
            files and push to your hosting provider.
          </p>
        </div>
      </div>
    </div>
  );
}
