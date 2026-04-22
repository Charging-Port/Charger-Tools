"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const KONAMI = [
  "ArrowUp", "ArrowUp",
  "ArrowDown", "ArrowDown",
  "ArrowLeft", "ArrowRight",
  "ArrowLeft", "ArrowRight",
  "b", "a",
];

const ASCII = `
   ▄████▄   ██░ ██  ▄▄▄       ██▀███    ▄████ ▓█████  ██▀███
  ▒██▀ ▀█  ▓██░ ██▒▒████▄    ▓██ ▒ ██▒ ██▒ ▀█▒▓█   ▀ ▓██ ▒ ██▒
  ▒▓█    ▄ ▒██▀▀██░▒██  ▀█▄  ▓██ ░▄█ ▒▒██░▄▄▄░▒███   ▓██ ░▄█ ▒
  ▒▓▓▄ ▄██▒░▓█ ░██ ░██▄▄▄▄██ ▒██▀▀█▄  ░▓█  ██▓▒▓█  ▄ ▒██▀▀█▄
  ▒ ▓███▀ ░░▓█▒░██▓ ▓█   ▓██▒░██▓ ▒██▒░▒▓███▀▒░▒████▒░██▓ ▒██▒
  ░ ░▒ ▒  ░ ▒ ░░▒░▒ ▒▒   ▓▒█░░ ▒▓ ░▒▓░ ░▒   ▒ ░░ ▒░ ░░ ▒▓ ░▒▓░
    ░  ▒    ▒ ░▒░ ░  ▒   ▒▒ ░  ░▒ ░ ▒░  ░   ░  ░ ░  ░  ░▒ ░ ▒░
  ░         ░  ░░ ░  ░   ▒     ░░   ░ ░ ░   ░    ░     ░░   ░
  ░ ░       ░  ░  ░      ░  ░   ░           ░    ░  ░   ░
`;

const LINES = [
  "$ chargertools --secret",
  "[ booting up workshop ... ok ]",
  "[ verifying soldering iron temp ... 415°C ok ]",
  "[ syncing FRC build manifest ... 254 ok ]",
  "[ loading vision model ... 30fps ok ]",
  "",
  "  > you found the easter egg.",
  "  > thanks for poking around. <3",
  "  > —kaden",
  "",
  "$ exit",
];

export function TerminalKonami() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [shownLines, setShownLines] = useState<string[]>([]);

  // Konami code listener
  useEffect(() => {
    let buffer: string[] = [];
    const onKey = (e: KeyboardEvent) => {
      buffer.push(e.key);
      if (buffer.length > KONAMI.length) buffer = buffer.slice(-KONAMI.length);
      if (buffer.length === KONAMI.length && buffer.every((k, i) => k === KONAMI[i])) {
        setOpen(true);
        buffer = [];
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Type out lines
  useEffect(() => {
    if (!open) return;
    setShownLines([]);
    setStep(0);
    let i = 0;
    const id = setInterval(() => {
      if (i >= LINES.length) {
        clearInterval(id);
        return;
      }
      setShownLines((prev) => [...prev, LINES[i]]);
      i++;
      setStep(i);
    }, 280);
    return () => clearInterval(id);
  }, [open]);

  // Close on Esc
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100001] flex items-center justify-center px-4 py-10"
          onClick={() => setOpen(false)}
        >
          <div className="absolute inset-0 bg-background/85 backdrop-blur-md" />
          <motion.div
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="scanlines relative w-full max-w-2xl rounded-2xl border border-accent/40 bg-black/95 p-6 md:p-8 shadow-[0_0_60px_-12px_hsl(var(--accent)/0.4)] font-mono text-sm text-accent"
          >
            <pre className="text-accent/80 text-[8px] sm:text-[10px] leading-tight whitespace-pre overflow-x-auto mb-4">
{ASCII}
            </pre>
            <div className="space-y-1 min-h-[180px]">
              {shownLines.map((line, i) => (
                <div key={i} className="text-accent/90">
                  {line}
                  {i === shownLines.length - 1 && step < LINES.length && (
                    <span className="inline-block w-2 h-4 bg-accent ml-1 align-middle animate-blink" />
                  )}
                </div>
              ))}
            </div>
            <div className="mt-6 text-[10px] text-accent/50 text-right">
              press [esc] or click outside to close
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
