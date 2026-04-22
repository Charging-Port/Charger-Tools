"use client";

import { useState, FormEvent } from "react";
import { Send, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Input, Textarea } from "./ui/input";

type FormStatus = "idle" | "sending" | "sent" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      company: formData.get("company") as string,
      message: formData.get("message") as string,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error || "Failed to send message");
      }
      setStatus("sent");
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  return (
    <AnimatePresence mode="wait">
      {status === "sent" ? (
        <motion.div
          key="sent"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="relative rounded-2xl border border-accent/40 bg-accent/5 p-10 text-center overflow-hidden"
        >
          <div className="absolute -top-20 -right-20 w-56 h-56 bg-accent/15 rounded-full blur-3xl pointer-events-none" />
          <CheckCircle className="mx-auto mb-4 text-accent" size={36} />
          <h3 className="font-editorial text-3xl text-foreground">
            Message <span className="italic text-accent">received.</span>
          </h3>
          <p className="mt-3 text-sm text-foreground/70 max-w-xs mx-auto">
            Thanks for reaching out. I&apos;ll respond within 24–48h.
          </p>
          <button
            onClick={() => setStatus("idle")}
            className="mt-6 inline-flex text-xs font-mono text-accent border border-accent/40 px-4 py-2 rounded-full hover:bg-accent/10 transition-colors"
          >
            ← Send another
          </button>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Input
              id="name"
              name="name"
              label="◆ Name"
              placeholder="Your name"
              required
            />
            <Input
              id="email"
              name="email"
              type="email"
              label="◆ Email"
              placeholder="you@example.com"
              required
            />
          </div>
          <Input
            id="company"
            name="company"
            label="○ Company (optional)"
            placeholder="Your company"
          />
          <Textarea
            id="message"
            name="message"
            label="◆ Message"
            placeholder="Tell me about your project, idea, or just say hi…"
            rows={6}
            required
          />

          <AnimatePresence>
            {status === "error" && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2 text-sm text-red-400 border border-red-500/30 bg-red-500/5 rounded-xl px-4 py-3"
              >
                <AlertCircle size={15} />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center justify-between gap-4 pt-2">
            <p className="text-[10px] font-mono text-muted-foreground/55 hidden sm:block">
              Encrypted in transit. Goes directly to my inbox.
            </p>
            <button
              type="submit"
              disabled={status === "sending"}
              data-cursor-magnet
              className="magnet-zone inline-flex items-center gap-3 bg-accent text-accent-foreground text-sm font-semibold px-7 py-3.5 rounded-full hover:bg-accent/90 transition-colors shadow-[0_0_24px_-4px_hsl(var(--accent)/0.5)] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {status === "sending" ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Transmitting…
                </>
              ) : (
                <>
                  Send message
                  <Send size={14} />
                </>
              )}
            </button>
          </div>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
