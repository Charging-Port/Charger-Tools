"use client";

import { useState, FormEvent } from "react";
import { Send, AlertCircle, Loader2 } from "lucide-react";
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

  if (status === "sent") {
    return (
      <div className="border border-border rounded-lg p-8">
        <h3 className="font-serif text-2xl text-foreground mb-2">
          Message received.
        </h3>
        <p className="text-sm text-foreground/70 leading-relaxed">
          Thanks for reaching out. I&apos;ll respond within 24–48 hours.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-5 text-sm text-muted-foreground hover:text-foreground transition-colors link-underline"
        >
          Send another →
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Input id="name" name="name" label="Name" placeholder="Your name" required />
        <Input id="email" name="email" type="email" label="Email" placeholder="you@example.com" required />
      </div>
      <Input id="company" name="company" label="Company (optional)" placeholder="Your company" />
      <Textarea
        id="message"
        name="message"
        label="Message"
        placeholder="Tell me about your project, idea, or just say hi…"
        rows={6}
        required
      />

      {status === "error" && (
        <div className="flex items-center gap-2 text-sm text-red-500 border border-red-500/30 bg-red-500/5 rounded-lg px-4 py-3">
          <AlertCircle size={14} />
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="inline-flex items-center gap-2 bg-foreground text-background text-sm font-medium px-5 py-2.5 rounded hover:bg-foreground/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === "sending" ? (
          <>
            <Loader2 size={14} className="animate-spin" />
            Sending…
          </>
        ) : (
          <>
            Send message
            <Send size={13} />
          </>
        )}
      </button>
    </form>
  );
}
