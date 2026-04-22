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
  Cpu,
  Glasses,
  BotMessageSquare,
  Inbox,
  Sparkles,
  Radar,
  Command as CommandIcon,
  CornerDownLeft,
  type LucideIcon,
} from "lucide-react";
import { useTheme } from "next-themes";

type Item = {
  id: string;
  label: string;
  hint?: string;
  group: "navigate" | "projects" | "actions" | "external";
  icon: LucideIcon;
  action: () => void;
  keywords?: string[];
};

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const router = useRouter();
  const { setTheme, resolvedTheme } = useTheme();
  const inputRef = useRef<HTMLInputElement>(null);

  const items: Item[] = useMemo(
    () => [
      // Navigate
      { id: "home", label: "Home", group: "navigate", icon: Sparkles, action: () => router.push("/"), keywords: ["start", "index"] },
      { id: "work", label: "Work", group: "navigate", icon: Briefcase, action: () => router.push("/products"), keywords: ["projects", "portfolio"] },
      { id: "about", label: "About", group: "navigate", icon: User, action: () => router.push("/about"), keywords: ["bio", "kaden"] },
      { id: "writing", label: "Writing", group: "navigate", icon: PenTool, action: () => router.push("/blog"), keywords: ["blog", "posts"] },
      { id: "contact", label: "Contact", group: "navigate", icon: Mail, action: () => router.push("/contact"), keywords: ["email", "get in touch"] },
      // Projects
      { id: "p-hyperform", label: "Hyperform Fitness", hint: "Computer vision", group: "projects", icon: Cpu, action: () => router.push("/products/hyperform-fitness") },
      { id: "p-ar", label: "AR / Computer Glasses", hint: "Wearable HUD", group: "projects", icon: Glasses, action: () => router.push("/products/ar-glasses") },
      { id: "p-agent", label: "ChargerAgent", hint: "macOS AI", group: "projects", icon: BotMessageSquare, action: () => router.push("/products/charger-agent") },
      { id: "p-mail", label: "Charger Mail", hint: "Local-AI email", group: "projects", icon: Inbox, action: () => router.push("/products/charger-mail") },
      { id: "p-optics", label: "Optics Simulator", hint: "Ray tracing", group: "projects", icon: Sparkles, action: () => router.push("/products/optics-simulator") },
      { id: "p-radar", label: "RF Radar Simulator", hint: "Volumetric RF", group: "projects", icon: Radar, action: () => router.push("/products/rf-radar-simulator") },
      // Actions
      {
        id: "theme",
        label: resolvedTheme === "dark" ? "Switch to light mode" : "Switch to dark mode",
        group: "actions",
        icon: resolvedTheme === "dark" ? Sun : Moon,
        action: () => setTheme(resolvedTheme === "dark" ? "light" : "dark"),
        keywords: ["theme", "color", "appearance"],
      },
      { id: "github", label: "Open GitHub", group: "external", icon: Github, action: () => window.open("https://github.com/chargertools", "_blank", "noopener") },
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

  // Group filtered items
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

  // Cmd+K to open
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

  // Reset on open
  useEffect(() => {
    if (open) {
      setQuery("");
      setActive(0);
      // Focus input on next frame
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  // Keep active index in range
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
          className="fixed inset-0 z-[100000] flex items-start justify-center px-4 pt-[12vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onClick={() => setOpen(false)}
        >
          <div className="absolute inset-0 bg-background/70 backdrop-blur-md" />
          <motion.div
            initial={{ y: -12, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -8, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-xl rounded-2xl border border-border/80 bg-card/90 backdrop-blur-2xl shadow-2xl shadow-black/40 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={onPaletteKey}
          >
            {/* Search input */}
            <div className="flex items-center gap-3 px-4 border-b border-border/50">
              <Search size={16} className="text-muted-foreground/70 shrink-0" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActive(0);
                }}
                placeholder="Type a command or search…"
                className="flex-1 bg-transparent py-4 outline-none text-sm placeholder:text-muted-foreground/50"
                autoComplete="off"
                spellCheck={false}
              />
              <kbd className="hidden sm:flex items-center gap-1 text-[10px] font-mono text-muted-foreground/60 border border-border/60 bg-muted/40 rounded px-1.5 py-0.5">
                ESC
              </kbd>
            </div>

            {/* Results */}
            <div className="max-h-[50vh] overflow-y-auto py-2">
              {flatList.length === 0 ? (
                <div className="px-5 py-10 text-center text-sm text-muted-foreground/60">
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
                    <div key={group} className="mb-1">
                      <div className="px-4 py-1.5 text-[10px] font-mono text-muted-foreground/50 uppercase tracking-[0.2em]">
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
                            className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                              isActive
                                ? "bg-accent/10 text-foreground"
                                : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                            }`}
                          >
                            <Icon size={15} className={isActive ? "text-accent" : ""} />
                            <span className="text-sm flex-1">{item.label}</span>
                            {item.hint && (
                              <span className="text-[11px] font-mono text-muted-foreground/50">
                                {item.hint}
                              </span>
                            )}
                            {isActive && <CornerDownLeft size={12} className="text-accent" />}
                          </button>
                        );
                      })}
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer hint */}
            <div className="flex items-center justify-between px-4 py-2.5 border-t border-border/50 bg-background/40 text-[11px] font-mono text-muted-foreground/50">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <CommandIcon size={10} /> K
                </span>
                <span>·</span>
                <span>↑↓ to navigate</span>
                <span>·</span>
                <span>↵ to select</span>
              </div>
              <span className="hidden sm:inline">ChargerTools / cmd-bar</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
