"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  Briefcase,
  Mail,
  PenTool,
  Search,
  User,
  Sun,
  Moon,
  Github,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import type { Product } from "@/types";
// Import JSON directly so the client bundle doesn't pull in fs via lib/products.
import productsJson from "@/content/products.json";

type Item = {
  id: string;
  label: string;
  hint?: string;
  group: "navigate" | "projects" | "actions" | "external";
  icon: LucideIcon;
  action: () => void;
  keywords?: string[];
};

const PRODUCTS = (productsJson as Product[])
  .slice()
  .sort((a, b) => a.order - b.order);

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const router = useRouter();
  const { setTheme, resolvedTheme } = useTheme();
  const inputRef = useRef<HTMLInputElement>(null);

  const items: Item[] = useMemo(
    () => [
      { id: "home", label: "Home", group: "navigate", icon: Sparkles, action: () => router.push("/"), keywords: ["start"] },
      { id: "work", label: "Work", group: "navigate", icon: Briefcase, action: () => router.push("/products"), keywords: ["projects", "portfolio"] },
      { id: "about", label: "About", group: "navigate", icon: User, action: () => router.push("/about"), keywords: ["bio", "kaden"] },
      { id: "writing", label: "Writing", group: "navigate", icon: PenTool, action: () => router.push("/blog"), keywords: ["blog", "posts"] },
      { id: "contact", label: "Contact", group: "navigate", icon: Mail, action: () => router.push("/contact"), keywords: ["email"] },

      ...PRODUCTS.map((p): Item => ({
        id: `p-${p.slug}`,
        label: p.name,
        hint: p.shortDescription.slice(0, 48) + (p.shortDescription.length > 48 ? "…" : ""),
        group: "projects",
        icon: Briefcase,
        action: () => router.push(`/products/${p.slug}`),
        keywords: p.techStack,
      })),

      {
        id: "theme",
        label: resolvedTheme === "dark" ? "Switch to light mode" : "Switch to dark mode",
        group: "actions",
        icon: resolvedTheme === "dark" ? Sun : Moon,
        action: () => setTheme(resolvedTheme === "dark" ? "light" : "dark"),
        keywords: ["theme", "appearance"],
      },
      {
        id: "github",
        label: "Open GitHub",
        group: "external",
        icon: Github,
        action: () => window.open("https://github.com/chargertools", "_blank", "noopener"),
      },
    ],
    [router, setTheme, resolvedTheme]
  );

  const filtered = useMemo(() => {
    if (!query.trim()) return items;
    const q = query.toLowerCase();
    return items.filter((item) => {
      const hay = `${item.label} ${item.hint ?? ""} ${(item.keywords ?? []).join(" ")}`.toLowerCase();
      return hay.includes(q);
    });
  }, [items, query]);

  const grouped = useMemo(() => {
    const groups: Record<Item["group"], Item[]> = {
      navigate: [],
      projects: [],
      actions: [],
      external: [],
    };
    filtered.forEach((i) => groups[i.group].push(i));
    return groups;
  }, [filtered]);

  const flatList = useMemo(
    () => [...grouped.navigate, ...grouped.projects, ...grouped.actions, ...grouped.external],
    [grouped]
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
        return;
      }
      if (e.key === "Escape" && open) {
        e.preventDefault();
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActive(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  useEffect(() => {
    if (active >= flatList.length) setActive(Math.max(0, flatList.length - 1));
  }, [flatList, active]);

  const onPaletteKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, flatList.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(0, i - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const item = flatList[active];
      if (item) {
        item.action();
        setOpen(false);
      }
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100000] flex items-start justify-center px-4 pt-[14vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onClick={() => setOpen(false)}
        >
          <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" />
          <motion.div
            initial={{ y: -8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -6, opacity: 0 }}
            transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-lg rounded-lg border border-border bg-card shadow-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={onPaletteKey}
          >
            <div className="flex items-center gap-3 px-4 border-b border-border">
              <Search size={15} className="text-muted-foreground shrink-0" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActive(0);
                }}
                placeholder="Search or type a command…"
                className="flex-1 bg-transparent py-3.5 outline-none text-sm placeholder:text-muted-foreground"
                autoComplete="off"
                spellCheck={false}
              />
              <kbd className="hidden sm:inline-flex text-[10px] font-mono text-muted-foreground border border-border bg-muted/40 rounded px-1.5 py-0.5">
                ESC
              </kbd>
            </div>

            <div className="max-h-[50vh] overflow-y-auto py-1">
              {flatList.length === 0 ? (
                <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                  No results for &ldquo;{query}&rdquo;
                </div>
              ) : (
                (Object.keys(grouped) as Array<keyof typeof grouped>).map((group) => {
                  const list = grouped[group];
                  if (list.length === 0) return null;
                  const labels: Record<typeof group, string> = {
                    navigate: "Navigate",
                    projects: "Projects",
                    actions: "Actions",
                    external: "External",
                  };
                  return (
                    <div key={group} className="py-1">
                      <div className="px-4 py-1 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                        {labels[group]}
                      </div>
                      {list.map((item) => {
                        const idx = flatList.indexOf(item);
                        const isActive = idx === active;
                        const Icon = item.icon;
                        return (
                          <button
                            key={item.id}
                            onMouseEnter={() => setActive(idx)}
                            onClick={() => {
                              item.action();
                              setOpen(false);
                            }}
                            className={`w-full flex items-center gap-3 px-4 py-2 text-left transition-colors ${
                              isActive
                                ? "bg-muted/60 text-foreground"
                                : "text-foreground/75 hover:bg-muted/30"
                            }`}
                          >
                            <Icon size={14} className="shrink-0 text-muted-foreground" />
                            <span className="text-sm flex-1 truncate">{item.label}</span>
                            {item.hint && (
                              <span className="text-xs text-muted-foreground truncate max-w-[40%]">
                                {item.hint}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  );
                })
              )}
            </div>

            <div className="flex items-center justify-between px-4 py-2 border-t border-border text-[11px] text-muted-foreground">
              <span>↑↓ to navigate · ↵ to select</span>
              <span>⌘K</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
