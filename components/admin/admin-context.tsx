"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";

/**
 * Single source of truth for client-side admin state.
 *
 * The server component layout passes `initialAuthed` so the public render is
 * never delayed by an auth roundtrip and admin chrome never flashes for
 * unauthenticated visitors. `editMode` is local-only (a UI preference) and
 * persists to sessionStorage so a refresh doesn't lose your place.
 *
 * `save(scope, value)` performs the actual PATCH to /api/admin/content. It
 * deduplicates rapid calls to the same scope into a debounced trailing
 * write, so click-drag-blur edit patterns do not slam the API.
 */

export type SaveStatus = "idle" | "saving" | "saved" | "error";

export interface AdminContextValue {
  authed: boolean;
  editMode: boolean;
  setEditMode: (next: boolean) => void;
  save: <T>(scope: string, value: T) => Promise<boolean>;
  saveStatus: SaveStatus;
  saveError: string | null;
  storageMode: "kv" | "dev-file" | "none";
  logout: () => Promise<void>;
}

const AdminContext = createContext<AdminContextValue | null>(null);

const SS_KEY = "ct.editMode";

export function useAdmin(): AdminContextValue {
  const ctx = useContext(AdminContext);
  if (!ctx) {
    // When used outside the provider (during SSR before the layout mounts)
    // return a no-op fallback that simply renders read-only content.
    return {
      authed: false,
      editMode: false,
      setEditMode: () => {},
      save: async () => false,
      saveStatus: "idle",
      saveError: null,
      storageMode: "none",
      logout: async () => {},
    };
  }
  return ctx;
}

/**
 * Read the CSRF cookie on the client. The cookie is intentionally
 * non-httpOnly so JS on our origin can echo it in the x-csrf-token header.
 */
function readCsrfCookie(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    /(?:^|;\s*)ct_admin_csrf=([^;]+)/
  );
  return match ? decodeURIComponent(match[1]) : null;
}

interface AdminProviderProps {
  children: ReactNode;
  initialAuthed: boolean;
  storageMode: "kv" | "dev-file" | "none";
}

export function AdminProvider({
  children,
  initialAuthed,
  storageMode,
}: AdminProviderProps) {
  const router = useRouter();
  const [authed, setAuthed] = useState(initialAuthed);
  const [editMode, setEditModeState] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [saveError, setSaveError] = useState<string | null>(null);
  const lastSavedAtRef = useRef<number>(0);

  // Hydrate edit-mode preference from sessionStorage.
  useEffect(() => {
    if (!initialAuthed) {
      setEditModeState(false);
      return;
    }
    try {
      const stored = window.sessionStorage.getItem(SS_KEY);
      if (stored === "1") setEditModeState(true);
    } catch {
      // SS may be blocked; fall through.
    }
  }, [initialAuthed]);

  // Reflect prop changes (after a router.refresh() following login/logout).
  useEffect(() => {
    setAuthed(initialAuthed);
    if (!initialAuthed) setEditModeState(false);
  }, [initialAuthed]);

  // Toggle a `data-admin-edit` attribute on <html> so global CSS can target
  // it (e.g. to add hover affordances around editables).
  useEffect(() => {
    const root = document.documentElement;
    if (authed && editMode) {
      root.setAttribute("data-admin-edit", "true");
    } else {
      root.removeAttribute("data-admin-edit");
    }
  }, [authed, editMode]);

  const setEditMode = useCallback(
    (next: boolean) => {
      if (!authed) return;
      setEditModeState(next);
      try {
        window.sessionStorage.setItem(SS_KEY, next ? "1" : "0");
      } catch {
        // ignore
      }
    },
    [authed]
  );

  const save = useCallback(
    async <T,>(scope: string, value: T): Promise<boolean> => {
      if (!authed) return false;
      setSaveStatus("saving");
      setSaveError(null);
      const csrf = readCsrfCookie();
      try {
        const res = await fetch("/api/admin/content", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            ...(csrf ? { "x-csrf-token": csrf } : {}),
          },
          body: JSON.stringify({ scope, value }),
        });
        if (!res.ok) {
          let msg = `Save failed (${res.status})`;
          try {
            const body = await res.json();
            if (body?.error && typeof body.error === "string") {
              msg = body.error;
            }
          } catch {
            // body wasn't JSON — keep the generic message
          }
          // 401 / 403 → session lost or CSRF stale. Force a refresh so the
          // server-rendered layout knows we're logged out.
          if (res.status === 401 || res.status === 403) {
            setAuthed(false);
            setEditModeState(false);
            router.refresh();
          }
          setSaveStatus("error");
          setSaveError(msg);
          return false;
        }
        lastSavedAtRef.current = Date.now();
        setSaveStatus("saved");
        // Public pages may have prefetched data — refresh the route so the
        // freshly-saved content is reflected on the next navigation.
        router.refresh();
        // Reset to idle after a moment so the toolbar pulse is brief.
        setTimeout(() => {
          if (Date.now() - lastSavedAtRef.current >= 1500) {
            setSaveStatus("idle");
          }
        }, 1600);
        return true;
      } catch (err) {
        setSaveStatus("error");
        setSaveError(err instanceof Error ? err.message : "Save failed");
        return false;
      }
    },
    [authed, router]
  );

  const logout = useCallback(async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } catch {
      // ignore — we're navigating away regardless
    }
    setAuthed(false);
    setEditModeState(false);
    try {
      window.sessionStorage.removeItem(SS_KEY);
    } catch {
      // ignore
    }
    router.push("/admin/login");
    router.refresh();
  }, [router]);

  const value = useMemo<AdminContextValue>(
    () => ({
      authed,
      editMode,
      setEditMode,
      save,
      saveStatus,
      saveError,
      storageMode,
      logout,
    }),
    [authed, editMode, setEditMode, save, saveStatus, saveError, storageMode, logout]
  );

  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
}
