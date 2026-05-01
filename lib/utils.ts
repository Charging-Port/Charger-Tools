import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Allowlist a URL for use in href / src. Returns the URL if it parses with a
 * safe protocol (http, https, mailto), or null otherwise. Use this anywhere
 * data-driven URLs are rendered, so a bad value in a JSON/MD file can't
 * become an XSS vector via `javascript:` or `data:text/html` schemes.
 */
export function safeUrl(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  try {
    const u = new URL(trimmed);
    const proto = u.protocol.toLowerCase();
    if (proto === "http:" || proto === "https:" || proto === "mailto:") {
      return u.toString();
    }
  } catch {
    // not a parseable absolute URL
  }
  return null;
}

export function formatDate(dateString: string): string {
  // Parse date parts manually to avoid UTC-midnight timezone shift.
  // `new Date("YYYY-MM-DD")` is treated as UTC, which displays one day
  // earlier for users west of UTC (most of the US).
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function estimateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}
