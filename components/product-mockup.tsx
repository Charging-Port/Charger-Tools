/**
 * Stylized Mac-window preview for each project.
 *
 * Each project gets a hand-crafted UI sketch that hints at what the actual
 * product looks like — calendar grid for Meridian, notch overlay for Probe,
 * workout list for Zenith, browser chrome for Futz, etc.
 *
 * Pure CSS + SVG — no images required, render-time-cheap, and they scale
 * cleanly because they're vector all the way down.
 */

interface MockupProps {
  slug: string;
  className?: string;
  /** When true, renders a tighter aspect ratio for grid usage */
  compact?: boolean;
}

const ACCENT = "hsl(var(--accent))";
const BORDER = "hsl(var(--border))";
const MUTED = "hsl(var(--muted-foreground) / 0.4)";
const FOREGROUND = "hsl(var(--foreground) / 0.7)";

function WindowChrome({ children, label }: { children: React.ReactNode; label?: string }) {
  return (
    <div className="relative w-full aspect-[4/3] rounded-lg border border-border bg-card/80 overflow-hidden shadow-[0_4px_24px_-12px_hsl(var(--accent)/0.15)] group-hover:shadow-[0_8px_40px_-12px_hsl(var(--accent)/0.3)] transition-all duration-500">
      {/* Title bar */}
      <div className="absolute top-0 left-0 right-0 h-7 bg-muted/40 border-b border-border flex items-center px-3 gap-1.5">
        <span className="w-2.5 h-2.5 rounded-full bg-rose-500/60" />
        <span className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
        {label && (
          <span className="ml-3 text-[10px] font-mono text-muted-foreground/70">
            {label}
          </span>
        )}
      </div>
      <div className="absolute top-7 left-0 right-0 bottom-0">{children}</div>
    </div>
  );
}

export function ProductMockup({ slug, className = "" }: MockupProps) {
  return (
    <div className={`group ${className}`}>
      {renderForSlug(slug)}
    </div>
  );
}

function renderForSlug(slug: string) {
  switch (slug) {
    case "meridian":
      return (
        <WindowChrome label="meridian.app — Week 17">
          <div className="grid grid-cols-[80px_1fr] h-full">
            {/* Sidebar */}
            <div className="border-r border-border bg-muted/20 p-2 space-y-1.5">
              <div className="h-2 rounded bg-accent/70 w-3/4" />
              <div className="h-1.5 rounded bg-foreground/15 w-2/3" />
              <div className="h-1.5 rounded bg-foreground/15 w-3/4" />
              <div className="h-1.5 rounded bg-foreground/15 w-2/4" />
              <div className="pt-2 mt-2 border-t border-border space-y-1.5">
                <div className="h-1.5 rounded bg-foreground/10 w-2/3" />
                <div className="h-1.5 rounded bg-foreground/10 w-3/4" />
              </div>
            </div>
            {/* Calendar grid */}
            <div className="p-2.5">
              <div className="grid grid-cols-7 gap-px text-[6px] font-mono text-muted-foreground/70 mb-1">
                {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                  <div key={i} className="text-center">{d}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 grid-rows-5 gap-px h-[calc(100%-12px)] bg-border/50">
                {Array.from({ length: 35 }).map((_, i) => {
                  const isWeekend = i % 7 >= 5;
                  const hasEvent = [3, 9, 12, 18, 22, 26].includes(i);
                  const hasAccent = [12, 18].includes(i);
                  return (
                    <div
                      key={i}
                      className="bg-card/80 relative p-0.5"
                      style={{ background: isWeekend ? "hsl(var(--muted) / 0.3)" : undefined }}
                    >
                      <span className="text-[5px] font-mono text-muted-foreground/50">
                        {i + 1}
                      </span>
                      {hasEvent && (
                        <div
                          className="absolute bottom-0.5 left-0.5 right-0.5 h-1 rounded-sm"
                          style={{ background: hasAccent ? ACCENT : "hsl(var(--foreground) / 0.3)" }}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </WindowChrome>
      );

    case "probe":
      return (
        <WindowChrome label="probe — recording">
          <div className="relative h-full bg-gradient-to-b from-card/40 to-card/80">
            {/* Notch sketch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-5 bg-foreground/85 rounded-b-xl flex items-end justify-center pb-1">
              <span className="w-1 h-1 rounded-full bg-accent animate-pulse" />
            </div>
            {/* Glass card dropdown */}
            <div className="absolute top-7 left-1/2 -translate-x-1/2 w-44 rounded-md border border-border bg-card/90 p-2 backdrop-blur shadow-lg">
              <div className="flex items-center gap-1.5 mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                <span className="text-[7px] font-mono text-foreground/70">REC · 14:22</span>
                <span className="ml-auto text-[7px] font-mono text-muted-foreground/60">CALC 101</span>
              </div>
              {/* Audio waveform */}
              <svg viewBox="0 0 100 16" className="w-full h-3 text-accent/80" fill="currentColor">
                {Array.from({ length: 30 }).map((_, i) => {
                  const h = 3 + Math.abs(Math.sin(i * 0.7)) * 10;
                  return <rect key={i} x={i * 3.3} y={(16 - h) / 2} width="2" height={h} rx="0.5" />;
                })}
              </svg>
              <div className="mt-2 pt-2 border-t border-border space-y-1">
                <div className="h-1 rounded bg-foreground/15 w-full" />
                <div className="h-1 rounded bg-foreground/15 w-3/4" />
              </div>
            </div>
            {/* Background notes */}
            <div className="absolute bottom-3 left-3 right-3 space-y-1 opacity-60">
              <div className="h-1 rounded bg-foreground/10 w-full" />
              <div className="h-1 rounded bg-foreground/10 w-5/6" />
              <div className="h-1 rounded bg-foreground/10 w-2/3" />
            </div>
          </div>
        </WindowChrome>
      );

    case "zenith":
      return (
        <WindowChrome label="zenith — Upper Day · Week 4">
          <div className="grid grid-cols-[60px_1fr] h-full">
            <div className="border-r border-border bg-muted/20 p-2 space-y-1.5">
              <div className="h-1.5 rounded bg-accent w-3/4" />
              <div className="h-1.5 rounded bg-foreground/15 w-2/3" />
              <div className="h-1.5 rounded bg-foreground/15 w-3/4" />
            </div>
            <div className="p-2.5 space-y-1.5">
              {[
                { name: "Bench Press", sets: ["100×8", "100×8", "105×7"], pr: true },
                { name: "Incline DB", sets: ["35×10", "35×10", "35×9"] },
                { name: "Pull-up", sets: ["BW×10", "BW×10", "BW×9"] },
                { name: "Cable Fly", sets: ["20×12", "20×12"] },
              ].map((ex, i) => (
                <div key={i} className="rounded border border-border/60 bg-card/40 p-1.5">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[7px] font-medium text-foreground">{ex.name}</span>
                    {ex.pr && (
                      <span className="text-[6px] font-mono text-accent uppercase tracking-wider">PR</span>
                    )}
                  </div>
                  <div className="flex gap-1">
                    {ex.sets.map((s, j) => (
                      <span
                        key={j}
                        className="text-[6px] font-mono px-1 py-px rounded bg-muted/60 text-foreground/70"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </WindowChrome>
      );

    case "futz":
      return (
        <WindowChrome label="futz — chargertools.com">
          <div className="grid grid-cols-[80px_1fr] h-full">
            {/* Sidebar with tabs */}
            <div className="border-r border-border bg-muted/20 p-2 space-y-1">
              <div className="text-[6px] font-mono text-muted-foreground/60 mb-1">PINNED</div>
              {["github.com", "linear.app", "notion.so"].map((t, i) => (
                <div key={i} className="flex items-center gap-1 py-0.5 px-1 rounded">
                  <div className="w-1 h-1 rounded-full bg-foreground/40" />
                  <div className="h-1 rounded bg-foreground/15 flex-1" />
                </div>
              ))}
              <div className="text-[6px] font-mono text-muted-foreground/60 mb-1 mt-2">TABS</div>
              {[true, false, false].map((active, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-1 py-0.5 px-1 rounded ${active ? "bg-accent/15" : ""}`}
                >
                  <div
                    className="w-1 h-1 rounded-full"
                    style={{ background: active ? ACCENT : MUTED }}
                  />
                  <div className="h-1 rounded bg-foreground/15 flex-1" />
                </div>
              ))}
            </div>
            {/* Content area */}
            <div className="p-3 space-y-1.5">
              <div className="h-2 rounded bg-foreground/30 w-1/2" />
              <div className="h-1 rounded bg-foreground/15 w-full" />
              <div className="h-1 rounded bg-foreground/15 w-5/6" />
              <div className="h-1 rounded bg-foreground/15 w-3/4" />
              <div className="h-12 rounded border border-border/60 bg-muted/30 mt-2" />
              <div className="h-1 rounded bg-foreground/15 w-4/5" />
              <div className="h-1 rounded bg-foreground/15 w-3/5" />
            </div>
          </div>
        </WindowChrome>
      );

    case "hyperform-fitness":
      return (
        <WindowChrome label="hyperform — Bay 03 · Live">
          <div className="relative h-full bg-gradient-to-br from-card/30 to-card/70">
            {/* Pose skeleton overlay */}
            <svg viewBox="0 0 200 150" className="absolute inset-0 w-full h-full" stroke={ACCENT} strokeWidth="1" fill="none" strokeLinecap="round">
              {/* Bar */}
              <line x1="50" y1="40" x2="150" y2="40" strokeWidth="2.5" />
              <circle cx="50" cy="40" r="6" fill={ACCENT} />
              <circle cx="150" cy="40" r="6" fill={ACCENT} />
              {/* Body */}
              <circle cx="100" cy="30" r="8" />
              <line x1="100" y1="38" x2="100" y2="80" />
              <line x1="100" y1="50" x2="80" y2="42" />
              <line x1="100" y1="50" x2="120" y2="42" />
              {/* Squat legs */}
              <line x1="100" y1="80" x2="80" y2="105" />
              <line x1="80" y1="105" x2="80" y2="135" />
              <line x1="100" y1="80" x2="120" y2="105" />
              <line x1="120" y1="105" x2="120" y2="135" />
              {/* Joint dots */}
              {[[100, 80], [80, 105], [120, 105], [80, 42], [120, 42]].map(([x, y], i) => (
                <circle key={i} cx={x} cy={y} r="2.5" fill={ACCENT} stroke="none" />
              ))}
            </svg>
            {/* HUD readouts */}
            <div className="absolute top-2 right-2 text-right space-y-0.5 font-mono text-[7px] text-foreground/80">
              <div>DEPTH <span className="text-accent">98°</span></div>
              <div>BAR PATH <span className="text-accent">±2cm</span></div>
              <div>TEMPO <span className="text-accent">2-1-2</span></div>
            </div>
            <div className="absolute bottom-2 left-2 font-mono text-[7px] text-foreground/70">
              <div>REP 04 / 08</div>
              <div className="text-emerald-400/80">FORM OK</div>
            </div>
          </div>
        </WindowChrome>
      );

    case "ar-glasses":
      return (
        <WindowChrome label="HUD overlay — passthrough">
          <div className="relative h-full bg-gradient-to-b from-foreground/5 to-card/80">
            {/* Lens viewport */}
            <div className="absolute inset-3 border border-accent/40 rounded-lg overflow-hidden">
              {/* HUD elements */}
              <div className="absolute top-2 left-2 right-2 flex items-center justify-between font-mono text-[7px] text-accent/80">
                <span>14:22 PT</span>
                <span>BLE OK</span>
                <span>92%</span>
              </div>
              {/* Reticle */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="relative w-12 h-12">
                  <div className="absolute inset-0 border border-accent/60 rounded-full" />
                  <div className="absolute top-1/2 left-0 right-0 h-px bg-accent/40 -translate-y-1/2" />
                  <div className="absolute top-0 bottom-0 left-1/2 w-px bg-accent/40 -translate-x-1/2" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-accent" />
                </div>
              </div>
              {/* Subtitle / AI response */}
              <div className="absolute bottom-2 left-2 right-2 rounded border border-accent/20 bg-card/70 backdrop-blur p-1.5">
                <p className="text-[7px] font-mono text-foreground/85 leading-tight">
                  &gt; recipe scaled for 4 servings
                </p>
              </div>
            </div>
          </div>
        </WindowChrome>
      );

    case "charger-agent":
      return (
        <WindowChrome label="chargeragent">
          <div className="h-full bg-card/80 p-2.5 font-mono text-[7px] leading-relaxed">
            <div className="space-y-1">
              <div>
                <span style={{ color: ACCENT }}>$</span>{" "}
                <span className="text-foreground/85">summarize my git log this week</span>
              </div>
              <div className="text-foreground/55 pl-2.5">
                ▸ tool: terminal (git log --since=&apos;7 days&apos;)
              </div>
              <div className="text-foreground/55 pl-2.5">▸ 14 commits across 3 repos</div>
              <div className="text-foreground/85 pl-2 pt-1">
                You shipped Probe v0.3, fixed the
                <br />
                CalendarFeed merge bug in Meridian,
                <br />
                and started the AR glove firmware.
              </div>
              <div className="pt-2">
                <span style={{ color: ACCENT }}>$</span>{" "}
                <span className="text-foreground/85">find todos in /probe</span>
                <span className="inline-block w-1 h-2 ml-0.5 align-middle bg-accent animate-pulse" />
              </div>
            </div>
          </div>
        </WindowChrome>
      );

    case "charger-mail":
      return (
        <WindowChrome label="charger mail — inbox · 4">
          <div className="grid grid-cols-[70px_1fr] h-full">
            <div className="border-r border-border bg-muted/20 p-2 space-y-1">
              {["Inbox", "Starred", "Sent", "All"].map((label, i) => (
                <div
                  key={label}
                  className={`flex items-center gap-1 py-0.5 px-1 rounded text-[7px] ${
                    i === 0 ? "bg-accent/15 text-accent" : "text-foreground/60"
                  }`}
                >
                  <span>{label}</span>
                  {i === 0 && <span className="ml-auto">4</span>}
                </div>
              ))}
            </div>
            <div className="divide-y divide-border">
              {[
                { from: "Linear", subject: "MER-142 ready for review", unread: true },
                { from: "Bellarmine Bookstore", subject: "Calc PS6 reminder", unread: true },
                { from: "Resend", subject: "Daily digest" },
                { from: "GitHub", subject: "PR #88 merged ✓" },
              ].map((m, i) => (
                <div key={i} className="px-2 py-1.5">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[8px] ${m.unread ? "text-foreground font-medium" : "text-foreground/60"}`}
                    >
                      {m.from}
                    </span>
                    {m.unread && (
                      <span className="w-1 h-1 rounded-full bg-accent" />
                    )}
                  </div>
                  <p className="text-[7px] text-foreground/55 truncate">
                    {m.subject}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </WindowChrome>
      );

    case "optics-simulator":
      return (
        <WindowChrome label="optics — biconvex lens">
          <div className="relative h-full bg-card/60">
            <svg viewBox="0 0 200 130" className="absolute inset-0 w-full h-full">
              {/* Optical axis */}
              <line x1="0" y1="65" x2="200" y2="65" stroke={MUTED} strokeWidth="0.5" strokeDasharray="3 3" />
              {/* Lens */}
              <ellipse cx="100" cy="65" rx="14" ry="50" fill={`${ACCENT}`} fillOpacity="0.1" stroke={ACCENT} strokeWidth="1.2" />
              {/* Incoming parallel rays */}
              {[35, 50, 65, 80, 95].map((y) => (
                <line key={`in-${y}`} x1="0" y1={y} x2="86" y2={y} stroke={ACCENT} strokeWidth="0.8" />
              ))}
              {/* Refracted converging rays */}
              {[35, 50, 65, 80, 95].map((y) => (
                <line key={`out-${y}`} x1="114" y1={y} x2="180" y2="65" stroke={ACCENT} strokeWidth="0.8" />
              ))}
              {/* Focal point */}
              <circle cx="180" cy="65" r="3" fill={ACCENT} />
              <text x="183" y="75" fontSize="6" fontFamily="monospace" fill={FOREGROUND}>F</text>
            </svg>
            {/* HUD readouts */}
            <div className="absolute top-2 left-2 font-mono text-[7px] text-muted-foreground/80 space-y-0.5">
              <div>n = 1.50</div>
              <div>R = 30 mm</div>
              <div>f = 60 mm</div>
            </div>
          </div>
        </WindowChrome>
      );

    case "rf-radar-simulator":
      return (
        <WindowChrome label="rf radar — 2.4 GHz · drywall">
          <div className="relative h-full bg-card/60">
            <svg viewBox="0 0 200 150" className="absolute inset-0 w-full h-full">
              {/* Walls */}
              <line x1="0" y1="60" x2="200" y2="60" stroke={MUTED} strokeWidth="2" />
              <line x1="100" y1="0" x2="100" y2="150" stroke={MUTED} strokeWidth="2" />
              {/* Concentric pings from emitter */}
              <circle cx="50" cy="100" r="20" stroke={ACCENT} strokeWidth="1" fill="none" opacity="0.9" />
              <circle cx="50" cy="100" r="35" stroke={ACCENT} strokeWidth="1" fill="none" opacity="0.6" />
              <circle cx="50" cy="100" r="50" stroke={ACCENT} strokeWidth="1" fill="none" opacity="0.35" />
              <circle cx="50" cy="100" r="65" stroke={ACCENT} strokeWidth="1" fill="none" opacity="0.18" />
              <circle cx="50" cy="100" r="4" fill={ACCENT} />
              {/* Sweep line */}
              <line x1="50" y1="100" x2="105" y2="60" stroke={ACCENT} strokeWidth="0.8" />
              {/* Detected blip */}
              <circle cx="105" cy="60" r="3" fill={ACCENT} />
            </svg>
            <div className="absolute top-2 right-2 font-mono text-[7px] text-muted-foreground/80 text-right space-y-0.5">
              <div>SIG -54 dB</div>
              <div>RANGE 2.4m</div>
              <div>BLIP +1</div>
            </div>
          </div>
        </WindowChrome>
      );

    default:
      return (
        <WindowChrome>
          <div className="h-full grid place-items-center text-muted-foreground/40 text-xs font-mono">
            ─────
          </div>
        </WindowChrome>
      );
  }
}
