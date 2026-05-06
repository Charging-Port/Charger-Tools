import fs from "fs";
import path from "path";
import type { SiteText } from "@/types/site-text";

const filePath = path.resolve(process.cwd(), "content/site-text.json");

let cache: { data: SiteText; mtime: number } | null = null;

/**
 * Read the editable site text. Re-reads from disk when the file has changed
 * (so admin edits show up without rebuild). On Vercel the file is read-only at
 * runtime, so admin POSTs only persist within a single function invocation —
 * for production persistence, commit `content/site-text.json` and redeploy.
 */
export function getSiteText(): SiteText {
  try {
    const stat = fs.statSync(filePath);
    if (cache && cache.mtime === stat.mtimeMs) return cache.data;
    const raw = fs.readFileSync(filePath, "utf8");
    const data = JSON.parse(raw) as SiteText;
    cache = { data, mtime: stat.mtimeMs };
    return data;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("[site-text] Failed to read content/site-text.json", err);
    throw err;
  }
}

export function writeSiteText(data: SiteText): void {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n", "utf8");
  cache = null;
}
