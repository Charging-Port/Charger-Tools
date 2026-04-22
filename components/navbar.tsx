"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { X, Command as CommandIcon, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const links = [
  { href: "/products", label: "Work", k: "01" },
  { href: "/about", label: "About", k: "02" },
  { href: "/blog", label: "Writing", k: "03" },
  { href: "/contact", label: "Contact", k: "04" },
];

function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) {
    return <div className="w-7 h-7" aria-hidden="true" />;
  }
  return (
    <button
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      aria-label="Toggle theme"
      className="w-7 h-7 grid place-items-center rounded-lg text-muted-foreground hover:text-accent hover:bg-muted/40 transition-colors"
    >
      {resolvedTheme === "dark" ? <Sun size={13} /> : <Moon size={13} />}
    </button>
  );
}

function openCommandPalette() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }));
}

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const lastYRef = useRef(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const handler = () => {
      const y = window.scrollY;
      setScrolled(y > 12);
      setVisible(y < 60 || y < lastYRef.current);
      lastYRef.current = y;
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <div
        className={cn(
          "fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
          visible ? "translate-y-0 opacity-100" : "-translate-y-20 opacity-0 pointer-events-none"
        )}
      >
        <nav
          className={cn(
            "flex items-center gap-1 rounded-full px-2 py-1.5 w-full max-w-2xl transition-all duration-500",
            scrolled
              ? "bg-card/85 backdrop-blur-2xl border border-border/70 shadow-2xl shadow-black/30"
              : "bg-card/40 backdrop-blur-xl border border-border/35"
          )}
        >
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-1.5 group"
            onClick={() => setMobileOpen(false)}
          >
            <div className="relative w-5 h-5">
              <div className="absolute inset-0 rounded-md bg-accent/15 group-hover:bg-accent/25 transition-colors" />
              <div className="absolute inset-0 grid place-items-center font-display font-bold text-accent text-[12px]">
                K
              </div>
            </div>
            <span className="text-xs font-medium text-foreground/80 tracking-tight hidden sm:inline group-hover:text-foreground transition-colors">
              ChargerTools
            </span>
          </Link>

          <div className="w-px h-4 bg-border/60 mx-1" />

          {/* Desktop links with hover indicator */}
          <div
            className="hidden sm:flex items-center gap-0.5 flex-1 relative"
            onMouseLeave={() => setHoveredIdx(null)}
          >
            {links.map((link, i) => {
              const active = pathname === link.href || pathname.startsWith(link.href + "/");
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onMouseEnter={() => setHoveredIdx(i)}
                  className={cn(
                    "relative px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors duration-200 z-10",
                    active
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {hoveredIdx === i && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 bg-muted/60 rounded-full -z-10"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                    />
                  )}
                  {active && (
                    <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-accent" />
                  )}
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="ml-auto flex items-center gap-1">
            {/* Cmd K trigger */}
            <button
              onClick={openCommandPalette}
              data-cursor-hover
              aria-label="Open command palette"
              className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[10px] font-mono text-muted-foreground/70 hover:text-foreground border border-border/50 hover:border-border transition-colors"
            >
              <CommandIcon size={9} />K
            </button>

            <ThemeToggle />

            {/* Status dot — desktop */}
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-accent/25 bg-accent/8">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-60" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-accent" />
              </span>
              <span className="text-[10px] font-mono text-accent/80 tracking-wide">
                live
              </span>
            </div>

            {/* Mobile hamburger */}
            <button
              className="sm:hidden flex flex-col justify-center items-center w-8 h-8 gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              <span
                className={cn(
                  "block w-4 h-px bg-current origin-center transition-all duration-300",
                  mobileOpen ? "rotate-45 translate-y-[4px]" : ""
                )}
              />
              <span
                className={cn(
                  "block w-4 h-px bg-current origin-center transition-all duration-300",
                  mobileOpen ? "-rotate-45 -translate-y-[4px]" : ""
                )}
              />
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 bg-background flex flex-col"
          >
            <div className="flex h-16 items-center justify-between px-6 border-b border-border/30">
              <Link
                href="/"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2"
              >
                <span className="font-display font-bold text-accent text-lg">K</span>
                <span className="text-sm font-medium text-foreground">ChargerTools</span>
              </Link>
              <button
                onClick={() => setMobileOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors p-2"
                aria-label="Close menu"
              >
                <X size={18} />
              </button>
            </div>
            <div className="flex-1 flex flex-col justify-center px-8">
              {links.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "group flex items-center justify-between py-5 border-b border-border/20",
                      pathname === link.href || pathname.startsWith(link.href + "/")
                        ? "text-foreground"
                        : "text-muted-foreground"
                    )}
                  >
                    <span className="font-display text-4xl font-bold group-hover:text-accent transition-colors">
                      {link.label}
                    </span>
                    <span className="text-[10px] font-mono text-muted-foreground/40">
                      {link.k}
                    </span>
                  </Link>
                </motion.div>
              ))}
            </div>
            <div className="px-8 pb-10">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                <span className="text-xs text-muted-foreground/60 font-mono">
                  open to collaboration · Soquel, CA
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
