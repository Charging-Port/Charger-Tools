"use client";

import { useState, FormEvent } from "react";
import { ArrowRight, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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

  return (
    <div>
      <AnimatePresence mode="wait">
        {status === "sent" ? (
          <motion.div
            key="sent"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-3 py-4 px-5 rounded-full border border-accent/40 bg-accent/8 w-fit"
          >
            <Check size={14} className="text-accent" />
            <p className="text-sm text-accent font-mono">
              You&apos;re in. Welcome to the signal.
            </p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={handleSubmit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative group"
          >
            <div className="relative flex gap-2 rounded-full border border-border/60 bg-muted/15 p-1.5 backdrop-blur-sm transition-colors focus-within:border-accent/60">
              <input
                name="email"
                type="email"
                required
                placeholder="your@email.com"
                className="flex-1 bg-transparent px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none font-mono"
              />
              <button
                type="submit"
                disabled={status === "sending"}
                data-cursor-magnet
                aria-label="Subscribe"
                className="shrink-0 bg-accent text-accent-foreground px-5 py-2.5 rounded-full hover:bg-accent/90 active:scale-[0.97] transition-all disabled:opacity-50 flex items-center gap-2 text-sm font-semibold"
              >
                {status === "sending" ? (
                  <span className="w-4 h-4 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin" />
                ) : (
                  <>
                    Subscribe
                    <ArrowRight size={13} />
                  </>
                )}
              </button>
            </div>
            <AnimatePresence>
              {status === "error" && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-2.5 px-3 text-xs text-red-400/85 font-mono"
                >
                  Something went wrong. Try again.
                </motion.p>
              )}
            </AnimatePresence>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
