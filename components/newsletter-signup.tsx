"use client";

import { useState, FormEvent } from "react";
import { ArrowRight, Check } from "lucide-react";

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
      <div className="inline-flex items-center gap-2 text-sm text-foreground">
        <Check size={14} className="text-accent" />
        You&apos;re in. Thanks.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 max-w-sm">
      <input
        name="email"
        type="email"
        required
        placeholder="your@email.com"
        className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-accent transition-colors"
      />
      <button
        type="submit"
        disabled={status === "sending"}
        className="shrink-0 bg-foreground text-background px-4 py-2 rounded-md hover:bg-foreground/90 transition-colors disabled:opacity-50 flex items-center gap-1.5 text-sm font-medium"
      >
        {status === "sending" ? (
          <span className="w-3.5 h-3.5 border-2 border-background/40 border-t-background rounded-full animate-spin" />
        ) : (
          <>
            Subscribe
            <ArrowRight size={13} />
          </>
        )}
      </button>
      {status === "error" && (
        <p className="sr-only">Something went wrong. Try again.</p>
      )}
    </form>
  );
}
