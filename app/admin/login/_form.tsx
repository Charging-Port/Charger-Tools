"use client";

import { useState, FormEvent, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, ArrowRight, AlertCircle } from "lucide-react";

/**
 * Login form. Uses an uncontrolled <input> (read via ref on submit) instead
 * of a controlled component because browser autofill doesn't fire React
 * onChange events — a controlled input would stay empty in state even after
 * the browser fills it, and any "disabled if empty" UI would lock the user
 * out. Reading from the DOM at submit time works regardless of how the
 * field got populated (typed, autofill, password manager).
 */
export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Pick up any error returned via the native form fallback (?error=...)
  useEffect(() => {
    const urlError = searchParams.get("error");
    if (urlError) setError(urlError);
  }, [searchParams]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const password = inputRef.current?.value ?? "";
    if (!password) {
      setError("Password is required");
      return;
    }

    setError("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Login failed");
      }

      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        {/* Brand mark */}
        <div className="flex items-center gap-2 mb-12 justify-center">
          <span className="font-display font-bold text-accent text-2xl">K</span>
          <span className="text-muted-foreground/30 font-light">/</span>
          <span className="text-sm font-medium text-foreground/80">
            ChargerTools Admin
          </span>
        </div>

        <div className="rounded-2xl border border-border/40 bg-card/50 p-8">
          <div className="flex items-center gap-2 mb-2">
            <Lock size={14} className="text-accent/70" />
            <p className="font-mono text-[10px] text-muted-foreground/50 uppercase tracking-[0.2em]">
              Restricted area
            </p>
          </div>
          <h1 className="text-2xl font-display font-bold text-foreground mb-1">
            Sign in
          </h1>
          <p className="text-sm text-muted-foreground/60 mb-6">
            Enter the admin password to manage products and posts.
          </p>

          {/*
            Both `action` and `method` are set so the form ALSO works as a
            native HTML POST if JS fails to load or React hydration breaks.
            React's onSubmit handler intercepts and uses fetch when working.
          */}
          <form
            onSubmit={handleSubmit}
            action="/api/admin/login"
            method="POST"
            className="space-y-4"
          >
            <div>
              <label
                htmlFor="password"
                className="block text-[10px] font-mono text-muted-foreground/40 uppercase tracking-[0.18em] mb-2"
              >
                Password
              </label>
              <input
                ref={inputRef}
                id="password"
                name="password"
                type="password"
                required
                autoFocus
                autoComplete="current-password"
                className="w-full rounded-xl border border-border/45 bg-muted/15 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:ring-1 focus:ring-accent/40 focus:border-accent/40 transition-all font-mono"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-xs text-red-400/90">
                <AlertCircle size={13} />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              aria-disabled={submitting}
              className="w-full inline-flex items-center justify-center gap-2 bg-accent text-accent-foreground text-sm font-semibold px-5 py-3 rounded-xl hover:bg-accent/90 active:scale-[0.98] transition-all disabled:opacity-60"
            >
              {submitting ? "Signing in..." : "Sign in"}
              {!submitting && <ArrowRight size={14} />}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-[10px] font-mono text-muted-foreground/30">
          Set ADMIN_PASSWORD in .env.local
        </p>
      </div>
    </div>
  );
}
