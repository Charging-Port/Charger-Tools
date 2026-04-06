"use client";

import { useState, FormEvent } from "react";
import { ArrowRight } from "lucide-react";

type Status = "idle" | "sending" | "sent" | "error";

export function NewsletterSignup() {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) throw new Error();
      setStatus("sent");
      (e.target as HTMLFormElement).reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="flex items-center gap-3 py-4">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
        </span>
        <p className="text-sm text-emerald-400/80 font-mono">
          You&apos;re in. Thanks.
        </p>
      </div>
    );
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          name="email"
          type="email"
          required
          placeholder="your@email.com"
          className="flex-1 rounded-xl border border-border/50 bg-muted/20 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:ring-1 focus:ring-accent/40 focus:border-accent/40 transition-all font-mono"
        />
        <button
          type="submit"
          disabled={status === "sending"}
          className="shrink-0 btn-accent-glow bg-accent text-accent-foreground text-sm font-semibold px-5 py-3 rounded-xl hover:bg-accent/90 active:scale-[0.97] transition-all disabled:opacity-50 flex items-center gap-2"
        >
          {status === "sending" ? (
            <span className="w-4 h-4 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin" />
          ) : (
            <ArrowRight size={14} />
          )}
        </button>
      </form>
      {status === "error" && (
        <p className="mt-2.5 text-xs text-red-400/80 font-mono">
          Something went wrong. Try again.
        </p>
      )}
    </div>
  );
}
