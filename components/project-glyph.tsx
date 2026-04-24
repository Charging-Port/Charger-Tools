/**
 * Hand-drawn-style line illustrations for each project, rendered as SVG.
 * Single stroke weight, current-color, monochrome — they read like
 * scientific-notebook sketches and tile across light + dark themes.
 */

interface GlyphProps {
  slug: string;
  size?: number;
  className?: string;
}

export function ProjectGlyph({ slug, size = 64, className = "" }: GlyphProps) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 64 64",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.25,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
  };

  switch (slug) {
    case "meridian":
      // Calendar grid + sun arc above
      return (
        <svg {...common}>
          <path d="M16 14 A 16 16 0 0 1 48 14" />
          <circle cx="32" cy="14" r="2.5" fill="currentColor" />
          <rect x="14" y="22" width="36" height="28" rx="2" />
          <line x1="14" y1="30" x2="50" y2="30" />
          <line x1="23" y1="22" x2="23" y2="50" />
          <line x1="32" y1="22" x2="32" y2="50" />
          <line x1="41" y1="22" x2="41" y2="50" />
          <line x1="14" y1="38" x2="50" y2="38" />
          <line x1="14" y1="46" x2="50" y2="46" />
          <rect x="33" y="31" width="8" height="6" fill="currentColor" opacity="0.25" />
        </svg>
      );

    case "probe":
      // Notch silhouette + a soundwave
      return (
        <svg {...common}>
          <path d="M6 12 L22 12 Q24 12 24 14 L24 18 Q24 22 28 22 L36 22 Q40 22 40 18 L40 14 Q40 12 42 12 L58 12" />
          <path d="M6 12 L6 22" />
          <path d="M58 12 L58 22" />
          {/* Notch indicator dot */}
          <circle cx="32" cy="22" r="1.5" fill="currentColor" />
          {/* Waveform below */}
          <path d="M10 42 L14 42 L16 36 L20 48 L24 32 L28 50 L32 30 L36 52 L40 34 L44 46 L48 40 L52 42 L58 42" />
        </svg>
      );

    case "zenith":
      // Barbell with weight plates
      return (
        <svg {...common}>
          <line x1="6" y1="32" x2="58" y2="32" />
          <rect x="10" y="22" width="6" height="20" />
          <rect x="48" y="22" width="6" height="20" />
          <rect x="16" y="26" width="3" height="12" />
          <rect x="45" y="26" width="3" height="12" />
          {/* Knurling marks on bar */}
          <line x1="22" y1="30" x2="22" y2="34" />
          <line x1="26" y1="30" x2="26" y2="34" />
          <line x1="30" y1="30" x2="30" y2="34" />
          <line x1="34" y1="30" x2="34" y2="34" />
          <line x1="38" y1="30" x2="38" y2="34" />
          <line x1="42" y1="30" x2="42" y2="34" />
        </svg>
      );

    case "futz":
      // Browser window with sidebar
      return (
        <svg {...common}>
          <rect x="6" y="10" width="52" height="44" rx="3" />
          <line x1="22" y1="10" x2="22" y2="54" />
          {/* Traffic-light dots */}
          <circle cx="11" cy="15" r="1.2" fill="currentColor" />
          <circle cx="15" cy="15" r="1.2" fill="currentColor" />
          <circle cx="19" cy="15" r="1.2" fill="currentColor" />
          {/* Sidebar tabs */}
          <line x1="10" y1="22" x2="18" y2="22" />
          <line x1="10" y1="26" x2="18" y2="26" />
          <line x1="10" y1="30" x2="18" y2="30" />
          <line x1="10" y1="34" x2="18" y2="34" />
          {/* Content area lines */}
          <line x1="28" y1="22" x2="50" y2="22" />
          <line x1="28" y1="28" x2="44" y2="28" />
          <line x1="28" y1="34" x2="48" y2="34" />
          <line x1="28" y1="40" x2="42" y2="40" />
        </svg>
      );

    case "hyperform-fitness":
      // Stick figure squat pose
      return (
        <svg {...common}>
          <circle cx="32" cy="12" r="3.5" />
          {/* Bar across shoulders */}
          <line x1="14" y1="22" x2="50" y2="22" />
          <circle cx="14" cy="22" r="2" fill="currentColor" />
          <circle cx="50" cy="22" r="2" fill="currentColor" />
          {/* Body */}
          <line x1="32" y1="16" x2="32" y2="32" />
          {/* Arms gripping bar */}
          <line x1="32" y1="20" x2="22" y2="22" />
          <line x1="32" y1="20" x2="42" y2="22" />
          {/* Squat legs */}
          <line x1="32" y1="32" x2="22" y2="40" />
          <line x1="22" y1="40" x2="22" y2="50" />
          <line x1="32" y1="32" x2="42" y2="40" />
          <line x1="42" y1="40" x2="42" y2="50" />
          {/* Tracking dot above head */}
          <circle cx="32" cy="6" r="1.5" fill="currentColor" />
        </svg>
      );

    case "ar-glasses":
      // Glasses frame with HUD overlay
      return (
        <svg {...common}>
          <rect x="8" y="22" width="20" height="14" rx="3" />
          <rect x="36" y="22" width="20" height="14" rx="3" />
          <line x1="28" y1="29" x2="36" y2="29" />
          <line x1="6" y1="22" x2="2" y2="20" />
          <line x1="58" y1="22" x2="62" y2="20" />
          {/* HUD content lines */}
          <line x1="12" y1="27" x2="22" y2="27" opacity="0.6" />
          <line x1="12" y1="31" x2="20" y2="31" opacity="0.6" />
          <line x1="40" y1="27" x2="50" y2="27" opacity="0.6" />
          <line x1="40" y1="31" x2="48" y2="31" opacity="0.6" />
          {/* Crosshair-like reticle in center */}
          <circle cx="32" cy="48" r="6" />
          <line x1="32" y1="42" x2="32" y2="54" opacity="0.5" />
          <line x1="26" y1="48" x2="38" y2="48" opacity="0.5" />
        </svg>
      );

    case "charger-agent":
      // Terminal prompt + cursor
      return (
        <svg {...common}>
          <rect x="6" y="14" width="52" height="36" rx="3" />
          {/* Title bar */}
          <line x1="6" y1="22" x2="58" y2="22" />
          <circle cx="11" cy="18" r="1.2" fill="currentColor" />
          <circle cx="15" cy="18" r="1.2" fill="currentColor" />
          <circle cx="19" cy="18" r="1.2" fill="currentColor" />
          {/* Prompt */}
          <text x="11" y="33" fontFamily="monospace" fontSize="6" fill="currentColor" stroke="none">{"$"}</text>
          <line x1="17" y1="32" x2="36" y2="32" />
          <line x1="11" y1="40" x2="48" y2="40" opacity="0.5" />
          {/* Cursor */}
          <rect x="11" y="44" width="3" height="4" fill="currentColor" />
        </svg>
      );

    case "charger-mail":
      // Envelope + AI sparkle
      return (
        <svg {...common}>
          <rect x="6" y="18" width="52" height="32" rx="2" />
          <path d="M6 20 L32 38 L58 20" />
          {/* Local AI sparkle */}
          <path d="M44 12 L46 16 L50 18 L46 20 L44 24 L42 20 L38 18 L42 16 Z" fill="currentColor" opacity="0.4" />
          <circle cx="44" cy="18" r="1" fill="currentColor" />
        </svg>
      );

    case "optics-simulator":
      // Lens with rays converging
      return (
        <svg {...common}>
          <ellipse cx="32" cy="32" rx="6" ry="22" />
          {/* Incoming parallel rays */}
          <line x1="2" y1="20" x2="26" y2="20" />
          <line x1="2" y1="32" x2="26" y2="32" />
          <line x1="2" y1="44" x2="26" y2="44" />
          {/* Refracted rays converging to focal point */}
          <line x1="38" y1="20" x2="56" y2="32" />
          <line x1="38" y1="32" x2="56" y2="32" />
          <line x1="38" y1="44" x2="56" y2="32" />
          {/* Focal point */}
          <circle cx="56" cy="32" r="1.8" fill="currentColor" />
          {/* Optical axis */}
          <line x1="2" y1="32" x2="62" y2="32" opacity="0.25" strokeDasharray="2 2" />
        </svg>
      );

    case "rf-radar-simulator":
      // Concentric radar pings
      return (
        <svg {...common}>
          <circle cx="32" cy="40" r="6" />
          <circle cx="32" cy="40" r="14" opacity="0.7" />
          <circle cx="32" cy="40" r="22" opacity="0.4" />
          <circle cx="32" cy="40" r="30" opacity="0.18" />
          <circle cx="32" cy="40" r="2.5" fill="currentColor" />
          {/* Sweep line */}
          <line x1="32" y1="40" x2="50" y2="22" />
          {/* Detected blip */}
          <circle cx="50" cy="22" r="1.8" fill="currentColor" />
        </svg>
      );

    default:
      // Generic sketch mark
      return (
        <svg {...common}>
          <circle cx="32" cy="32" r="20" />
          <line x1="22" y1="32" x2="42" y2="32" />
          <line x1="32" y1="22" x2="32" y2="42" />
        </svg>
      );
  }
}
