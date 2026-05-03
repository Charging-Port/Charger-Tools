"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Eye, Pencil, LayoutDashboard, LogOut, AlertTriangle, Check, Loader2 } from "lucide-react";
import { useAdmin } from "./admin-context";

/**
 * Sticky toolbar shown only to authenticated admins. Lives at the bottom of
 * the viewport so it never interferes with the brand mark, hero canvas, or
 * the navbar.
 *
 * Renders nothing for:
 *  - logged-out visitors (no admin chrome ever leaks to the public site)
 *  - /admin/* and /admin/login (those pages have their own controls)
 */
export function EditBar() {
  const { authed, editMode, setEditMode, saveStatus, saveError, storageMode, logout } =
    useAdmin();
  const pathname = usePathname();

  if (!authed) return null;
  if (pathname?.startsWith("/admin")) return null;

  const storageWarning =
    storageMode === "none"
      ? "Storage disabled — saves will fail (503). Provision Vercel KV."
      : null;

  return (
    <div
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[1000] pointer-events-none"
      aria-live="polite"
    >
      <div className="pointer-events-auto inline-flex items-center gap-1 rounded-full border border-border/70 bg-background/85 backdrop-blur-md px-1.5 py-1 shadow-[0_8px_28px_-12px_rgba(0,0,0,0.45)]">
        {/* Toggle */}
        <button
          type="button"
          onClick={() => setEditMode(!editMode)}
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-mono transition-colors ${
            editMode
              ? "bg-accent text-accent-foreground"
              : "text-foreground/80 hover:bg-muted/60"
          }`}
          aria-pressed={editMode}
          title={editMode ? "Exit edit mode" : "Enter edit mode"}
        >
          {editMode ? <Pencil size={12} /> : <Eye size={12} />}
          <span className="uppercase tracking-[0.18em]">
            {editMode ? "Editing" : "View"}
          </span>
        </button>

        {/* Save status pill */}
        <SaveStatusPill status={saveStatus} error={saveError} />

        {/* Storage badge — only shown when there's a problem */}
        {storageWarning && (
          <span
            title={storageWarning}
            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-mono uppercase tracking-[0.18em] text-amber-300 bg-amber-500/10 border border-amber-500/30"
          >
            <AlertTriangle size={11} />
            No storage
          </span>
        )}

        <span className="mx-0.5 h-4 w-px bg-border/60" aria-hidden />

        {/* Dashboard link */}
        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[11px] font-mono text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors uppercase tracking-[0.18em]"
          title="Admin dashboard"
        >
          <LayoutDashboard size={11} />
          Admin
        </Link>

        {/* Logout */}
        <button
          type="button"
          onClick={logout}
          className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[11px] font-mono text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors uppercase tracking-[0.18em]"
          title="Sign out"
        >
          <LogOut size={11} />
          Out
        </button>
      </div>
    </div>
  );
}

function SaveStatusPill({
  status,
  error,
}: {
  status: "idle" | "saving" | "saved" | "error";
  error: string | null;
}) {
  if (status === "idle") return null;
  if (status === "saving") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-mono uppercase tracking-[0.18em] text-muted-foreground/85 bg-muted/40 border border-border/40">
        <Loader2 size={11} className="animate-spin" />
        Saving
      </span>
    );
  }
  if (status === "saved") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-mono uppercase tracking-[0.18em] text-emerald-300 bg-emerald-500/10 border border-emerald-500/30">
        <Check size={11} />
        Saved
      </span>
    );
  }
  return (
    <span
      title={error || undefined}
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-mono uppercase tracking-[0.18em] text-red-300 bg-red-500/10 border border-red-500/30 max-w-[18ch] truncate"
    >
      <AlertTriangle size={11} />
      {error ? error.slice(0, 28) : "Error"}
    </span>
  );
}
