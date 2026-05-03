import { kvCappedListPush, kvList, getStorageMode } from "./storage";
import { getClientIp } from "./rate-limit";

/**
 * Append-only audit log for admin actions. Used to make tampering visible:
 * if a session is stolen and content is rewritten, the actor's IP and the
 * rough sequence of changes are recoverable.
 *
 * Each entry is a JSON line. We cap the in-KV list to AUDIT_CAP entries —
 * old entries fall off the end. For a low-volume personal site this is
 * plenty of headroom.
 */

const AUDIT_KEY = "ct:audit";
const AUDIT_CAP = 500;

export interface AuditEntry {
  ts: string;
  action: string;
  scope?: string;
  ip?: string;
  ok: boolean;
  meta?: Record<string, unknown>;
}

export async function logAdminAction(
  req: Request | null,
  action: string,
  ok: boolean,
  meta?: { scope?: string; [key: string]: unknown }
): Promise<void> {
  const entry: AuditEntry = {
    ts: new Date().toISOString(),
    action,
    scope: meta?.scope,
    ip: req ? getClientIp(req) : undefined,
    ok,
    meta: meta && Object.keys(meta).length > 0 ? meta : undefined,
  };

  const line = JSON.stringify(entry);

  // Always echo to stderr so a Vercel deployment captures it in function
  // logs even if KV is misconfigured.
  // eslint-disable-next-line no-console
  console.log(`[admin-audit] ${line}`);

  // Best-effort — don't fail the request if the log push fails.
  try {
    if (getStorageMode() !== "none") {
      await kvCappedListPush(AUDIT_KEY, line, AUDIT_CAP);
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("[admin-audit] failed to persist", err);
  }
}

/** Read recent audit entries, newest first. */
export async function getRecentAuditEntries(
  count: number = 50
): Promise<AuditEntry[]> {
  try {
    const lines = await kvList(AUDIT_KEY, count);
    return lines
      .map((line) => {
        try {
          return JSON.parse(line) as AuditEntry;
        } catch {
          return null;
        }
      })
      .filter((entry): entry is AuditEntry => entry !== null);
  } catch {
    return [];
  }
}
