"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const links = [
  { href: "/products", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Writing" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  // Use a ref so the scroll handler never needs to be re-registered;
  // reading/writing a ref is synchronous and doesn't cause re-renders.
  const lastYRef = useRef(0);

  // Hide on scroll down, show on scroll up.
  // The handler is registered once (empty dep array) and uses the ref
  // to avoid the stale-closure issue that plagued the previous useState
  // approach (which re-added/removed the listener on every scroll event).
  useEffect(() => {
    const handler = () => {
      const y = window.scrollY;
      setVisible(y < 60 || y < lastYRef.current);
      lastYRef.current = y;
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      {/* ── Floating pill navbar ── */}
      <motion.div
        className="fixed top-0 left-0 right-0 z-50 flex justify-center px-6 pt-4"
        animate={{ y: visible ? 0 : -80, opacity: visible ? 1 : 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      >
        <nav className="flex items-center gap-1 bg-card/75 backdrop-blur-2xl border border-border/60 rounded-2xl px-3 py-2 shadow-xl shadow-black/20 w-full max-w-xl">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-1.5 px-2 py-1 mr-2 group"
            onClick={() => setMobileOpen(false)}
          >
            <span className="font-display font-bold text-accent text-base leading-none group-hover:text-accent/80 transition-colors">
              K
            </span>
            <span className="text-muted-foreground/30 font-light select-none text-sm">/</span>
            <span className="text-xs font-medium text-muted-foreground/70 tracking-tight group-hover:text-foreground transition-colors hidden sm:block">
              ChargerTools
            </span>
          </Link>

          {/* Separator */}
          <div className="w-px h-4 bg-border/60 mr-2" />

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-0.5 flex-1">
            {links.map((link) => {
              const active =
                pathname === link.href || pathname.startsWith(link.href + "/");
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all duration-200",
                    active
                      ? "text-foreground bg-muted/60"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                  )}
                >
                  {link.label}
                  {active && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 bg-muted/60 rounded-xl -z-10"
                      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right side */}
          <div className="ml-auto flex items-center gap-2">
            {/* Status dot — desktop */}
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-xl border border-emerald-500/20 bg-emerald-500/5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-mono text-emerald-400/70 tracking-wide">
                open
              </span>
            </div>

            {/* Mobile hamburger */}
            <button
              className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              <motion.span
                animate={mobileOpen ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
                className="block w-4 h-px bg-current origin-center"
              />
              <motion.span
                animate={mobileOpen ? { rotate: -45, y: -3 } : { rotate: 0, y: 0 }}
                className="block w-4 h-px bg-current origin-center"
              />
            </button>
          </div>
        </nav>
      </motion.div>

      {/* ── Mobile full-screen overlay ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-background flex flex-col"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Header row */}
            <div className="flex h-16 items-center justify-between px-6 border-b border-border/30">
              <Link
                href="/"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2"
              >
                <span className="font-display font-bold text-accent text-lg">K</span>
                <span className="text-muted-foreground/30">/</span>
                <span className="text-sm font-medium text-foreground">ChargerTools</span>
              </Link>
              <button
                onClick={() => setMobileOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors p-2"
              >
                <X size={18} />
              </button>
            </div>

            {/* Links */}
            <div className="flex-1 flex flex-col justify-center px-8">
              {links.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "group flex items-center justify-between py-5 border-b border-border/20 transition-colors",
                      pathname === link.href || pathname.startsWith(link.href + "/") ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <span className="font-display text-4xl font-bold group-hover:text-accent transition-colors">
                      {link.label}
                    </span>
                    <span className="text-[10px] font-mono text-muted-foreground/40">
                      0{i + 1}
                    </span>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Footer status */}
            <div className="px-8 pb-10">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs text-muted-foreground/50 font-mono">
                  open to collaboration · San Jose, CA
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
