"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { useState } from "react";

export function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function logout() {
    setLoading(true);
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button
      onClick={logout}
      disabled={loading}
      className="inline-flex items-center gap-1.5 text-xs font-mono text-muted-foreground/50 hover:text-foreground transition-colors uppercase tracking-widest border border-border/40 hover:border-border/70 px-3 py-1.5 rounded-lg disabled:opacity-50"
    >
      <LogOut size={11} />
      {loading ? "..." : "Sign out"}
    </button>
  );
}
