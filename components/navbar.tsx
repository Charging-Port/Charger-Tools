"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { X, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

const links = [
  { href: "/products", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Writing" },
  { href: "/contact", label: "Contact" },
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
      className="w-7 h-7 grid place-items-center rounded text-muted-foreground hover:text-foreground transition-colors"
    >
      {resolvedTheme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
    </button>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 12);
    handler();
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
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-colors duration-300",
          scrolled
            ? "bg-background/85 backdrop-blur border-b border-border/60"
            : "bg-transparent border-b border-transparent"
        )}
      >
        <nav className="mx-auto max-w-6xl px-6 h-14 flex items-center justify-between">
          <Link
            href="/"
            onClick={() => setMobileOpen(false)}
            className="text-sm font-medium text-foreground tracking-tight"
          >
            Kaden MacLean
          </Link>

          <div className="hidden sm:flex items-center gap-7">
            {links.map((link) => {
              const active =
                pathname === link.href || pathname.startsWith(link.href + "/");
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-sm transition-colors",
                    active
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="w-px h-4 bg-border" />
            <ThemeToggle />
          </div>

          {/* Mobile hamburger */}
          <button
            className="sm:hidden flex flex-col justify-center items-center w-8 h-8 gap-1.5 text-foreground"
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
        </nav>
      </header>

      {/* Mobile overlay */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-background flex flex-col transition-opacity duration-200",
          mobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      >
        <div className="h-14 flex items-center justify-between px-6 border-b border-border">
          <Link
            href="/"
            onClick={() => setMobileOpen(false)}
            className="text-sm font-medium text-foreground"
          >
            Kaden MacLean
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
            className="text-foreground"
          >
            <X size={18} />
          </button>
        </div>
        <div className="flex-1 flex flex-col justify-center px-8 gap-2">
          {links.map((link) => {
            const active =
              pathname === link.href || pathname.startsWith(link.href + "/");
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "py-3 text-3xl font-serif tracking-tight",
                  active ? "text-accent" : "text-foreground"
                )}
              >
                {link.label}
              </Link>
            );
          })}
          <div className="mt-8">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </>
  );
}
