import fs from "fs";
import path from "path";

/**
 * KV-backed storage with a local-development file fallback.
 *
 * In production:
 *  - If KV_REST_API_URL and KV_REST_API_TOKEN are set (Vercel KV / Upstash
 *    auto-populates these), reads/writes use Upstash's REST API.
 *  - If unset, reads return null and writes throw — callers should treat
 *    a write failure as a 503.
 *
 * In development:
 *  - The same KV path is used if env vars are present.
 *  - Otherwise, a JSON file at .dev-kv.json at the repo root is used so the
 *    admin panel is functional out-of-the-box without provisioning a KV.
 *
 * Values are JSON-serialized strings under string keys. We keep this layer
 * deliberately small — content.ts adds typing on top.
 */

const DEV_FILE = path.join(process.cwd(), ".dev-kv.json");

function getKVConfig(): { url: string; token: string } | null {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (url && token) return { url, token };
  return null;
}

export type StorageMode = "kv" | "dev-file" | "none";

/**
 * Describe the active storage backend for the admin dashboard. This is
 * called from server components so it must be sync.
 */
export function getStorageMode(): StorageMode {
  if (getKVConfig()) return "kv";
  if (process.env.NODE_ENV !== "production") return "dev-file";
  return "none";
}

export function isStorageWritable(): boolean {
  return getStorageMode() !== "none";
}

// ── Dev file backend ─────────────────────────────────────────────────────────

function readDevFile(): Record<string, string> {
  try {
    if (!fs.existsSync(DEV_FILE)) return {};
    const raw = fs.readFileSync(DEV_FILE, "utf8");
    if (!raw.trim()) return {};
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object") {
      return parsed as Record<string, string>;
    }
    return {};
  } catch {
    return {};
  }
}

function writeDevFile(data: Record<string, string>): void {
  fs.writeFileSync(DEV_FILE, JSON.stringify(data, null, 2) + "\n", "utf8");
}

// ── Upstash REST backend ─────────────────────────────────────────────────────

async function upstashCommand<T>(
  config: { url: string; token: string },
  command: string[]
): Promise<T> {
  const res = await fetch(config.url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`KV request failed: ${res.status}`);
  }
  const json = (await res.json()) as { result: T };
  return json.result;
}

// ── Public API ───────────────────────────────────────────────────────────────

export async function kvGet(key: string): Promise<string | null> {
  const config = getKVConfig();
  if (config) {
    const result = await upstashCommand<string | null>(config, ["GET", key]);
    return result ?? null;
  }
  if (process.env.NODE_ENV !== "production") {
    const data = readDevFile();
    return key in data ? data[key] : null;
  }
  return null;
}

export async function kvSet(key: string, value: string): Promise<void> {
  const config = getKVConfig();
  if (config) {
    await upstashCommand<string>(config, ["SET", key, value]);
    return;
  }
  if (process.env.NODE_ENV !== "production") {
    const data = readDevFile();
    data[key] = value;
    writeDevFile(data);
    return;
  }
  // Production with no KV — caller should map this to a 503.
  throw new Error(
    "Persistent storage is not configured. Provision Vercel KV or set KV_REST_API_URL and KV_REST_API_TOKEN."
  );
}

export async function kvDelete(key: string): Promise<void> {
  const config = getKVConfig();
  if (config) {
    await upstashCommand<number>(config, ["DEL", key]);
    return;
  }
  if (process.env.NODE_ENV !== "production") {
    const data = readDevFile();
    delete data[key];
    writeDevFile(data);
    return;
  }
  throw new Error("Persistent storage is not configured.");
}

/**
 * Push to a capped list (used by the audit log). Trims to keep at most
 * `max` entries, oldest first.
 */
export async function kvCappedListPush(
  key: string,
  value: string,
  max: number
): Promise<void> {
  const config = getKVConfig();
  if (config) {
    await upstashCommand<number>(config, ["LPUSH", key, value]);
    await upstashCommand<string>(config, ["LTRIM", key, "0", String(max - 1)]);
    return;
  }
  if (process.env.NODE_ENV !== "production") {
    const data = readDevFile();
    const listKey = `__list__${key}`;
    const existing = data[listKey] ? JSON.parse(data[listKey]) : [];
    const arr: string[] = Array.isArray(existing) ? existing : [];
    arr.unshift(value);
    arr.splice(max);
    data[listKey] = JSON.stringify(arr);
    writeDevFile(data);
    return;
  }
  throw new Error("Persistent storage is not configured.");
}

export async function kvList(key: string, count: number): Promise<string[]> {
  const config = getKVConfig();
  if (config) {
    const result = await upstashCommand<string[] | null>(config, [
      "LRANGE",
      key,
      "0",
      String(count - 1),
    ]);
    return result || [];
  }
  if (process.env.NODE_ENV !== "production") {
    const data = readDevFile();
    const listKey = `__list__${key}`;
    const existing = data[listKey] ? JSON.parse(data[listKey]) : [];
    const arr: string[] = Array.isArray(existing) ? existing : [];
    return arr.slice(0, count);
  }
  return [];
}
