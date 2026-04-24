"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const GROUPS = [
  {
    label: "Navigate",
    items: [
      { keys: ["G", "H"], body: "Home" },
      { keys: ["G", "W"], body: "Work" },
      { keys: ["G", "A"], body: "About" },
      { keys: ["G", "N"], body: "Now" },
      { keys: ["G", "B"], body: "Blog" },
      { keys: ["G", "C"], body: "Contact" },
    ],
  },
  {
    label: "Find",
    items: [
      { keys: ["⌘", "K"], body: "Command palette" },
      { keys: ["?"], body: "This cheatsheet" },
      { keys: ["Esc"], body: "Close any overlay" },
    ],
  },
];

const SEQUENCE_MAP: Record<string, string> = {
  gh: "/",
  gw: "/products",
  ga: "/about",
  gn: "/now",
  gb: "/blog",
  gc: "/contact",
};

export function KeyboardHints() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let buffer = "";
    let timer: ReturnType<typeof setTimeout> | null = null;

    const inEditable = () => {
      const el = document.activeElement as HTMLElement | null;
      if (!el) return false;
      const tag = el.tagName;
      return (
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        el.isContentEditable ||
        el.getAttribute("role") === "textbox"
      );
    };

    const onKey = (e: KeyboardEvent) => {
      // Don't steal keys from editable surfaces
      if (inEditable()) return;

      // ? → toggle overlay
      if (e.key === "?") {
        e.preventDefault();
        setOpen((v) => !v);
        buffer = "";
        return;
      }

      if (e.key === "Escape" && open) {
        setOpen(false);
        return;
      }

      // Skip modifier combos (⌘K etc. belong to other handlers)
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      const k = e.key.toLowerCase();

      // Build a short rolling buffer of alpha keystrokes
      if (/^[a-z]$/.test(k)) {
        buffer += k;
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => (buffer = ""), 900);

        // Check for a matching 2-key sequence from the end of the buffer
        const last2 = buffer.slice(-2);
        if (SEQUENCE_MAP[last2]) {
          e.preventDefault();
          buffer = "";
          window.location.href = SEQUENCE_MAP[last2];
        }
      }
    };

    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      if (timer) clearTimeout(timer);
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100000] flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onClick={() => setOpen(false)}
        >
          <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" />
          <motion.div
            initial={{ y: 10, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 4, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md rounded-lg border border-border bg-card p-6 shadow-2xl"
          >
            <div className="flex items-baseline justify-between mb-5">
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground">
                Keyboard
              </p>
              <button
                onClick={() => setOpen(false)}
                className="text-xs font-mono text-muted-foreground hover:text-foreground"
                aria-label="Close"
              >
                ESC
              </button>
            </div>
            <div className="space-y-6">
              {GROUPS.map((group) => (
                <div key={group.label}>
                  <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent mb-3">
                    {group.label}
                  </p>
                  <ul className="space-y-2">
                    {group.items.map((item, i) => (
                      <li
                        key={i}
                        className="flex items-center justify-between gap-4 text-sm"
                      >
                        <span className="text-foreground/80">{item.body}</span>
                        <span className="flex gap-1 shrink-0">
                          {item.keys.map((k, j) => (
                            <kbd
                              key={j}
                              className="font-mono text-[10px] border border-border bg-muted/40 rounded px-1.5 py-0.5 min-w-[22px] text-center text-muted-foreground"
                            >
                              {k}
                            </kbd>
                          ))}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <p className="mt-6 pt-4 border-t border-border text-[11px] text-muted-foreground/80">
              Tip: press{" "}
              <kbd className="font-mono text-[10px] border border-border bg-muted/40 rounded px-1 py-0.5">
                G
              </kbd>{" "}
              then a letter to jump around, just like in linear.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
