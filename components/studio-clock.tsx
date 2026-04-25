"use client";

import { useEffect, useState } from "react";

const TIMEZONE = "America/Los_Angeles";

function getStudioState() {
  const now = new Date();
  const timeStr = new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: TIMEZONE,
  }).format(now);

  const localHour = Number(
    new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      hour12: false,
      timeZone: TIMEZONE,
    }).format(now)
  );

  // Status by time of day (local California time)
  let status: "building" | "off" | "quiet" = "off";
  if (localHour >= 7 && localHour < 12) status = "building";
  else if (localHour >= 12 && localHour < 23) status = "building";
  else if (localHour >= 23 || localHour < 3) status = "quiet";
  else status = "off";

  return { timeStr, status };
}

export function StudioClock() {
  const [state, setState] = useState<{ timeStr: string; status: "building" | "off" | "quiet" } | null>(null);

  useEffect(() => {
    setState(getStudioState());
    const id = setInterval(() => setState(getStudioState()), 30_000);
    return () => clearInterval(id);
  }, []);

  if (!state) {
    // SSR/initial — render static fallback
    return (
      <span className="font-mono text-xs text-muted-foreground flex items-center gap-2">
        <span className="inline-block w-6 h-px bg-accent" />
        Kaden MacLean — Soquel, CA
      </span>
    );
  }

  const { timeStr, status } = state;
  const label =
    status === "building"
      ? "At the bench"
      : status === "quiet"
      ? "Winding down"
      : "Off the clock";
  const dotClass =
    status === "building"
      ? "bg-accent animate-pulse-soft shadow-[0_0_10px_hsl(var(--accent)/0.7)]"
      : status === "quiet"
      ? "bg-accent/50"
      : "bg-muted-foreground/50";

  return (
    <span className="font-mono text-xs text-muted-foreground flex items-center gap-2.5 flex-wrap">
      <span className="inline-block w-6 h-px bg-accent" />
      <span>Soquel, CA</span>
      <span className="text-border">·</span>
      <span className="tabular-nums text-foreground/70">{timeStr} PT</span>
      <span className="text-border">·</span>
      <span className="inline-flex items-center gap-1.5">
        <span className={`inline-block w-1.5 h-1.5 rounded-full ${dotClass}`} />
        <span>{label}</span>
      </span>
    </span>
  );
}
