interface LogoIconProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export default function LogoIcon({ size = "md", className = "" }: LogoIconProps) {
  const dimensions = {
    sm: "w-5 h-5",
    md: "w-8 h-8",
    lg: "w-11 h-11",
    xl: "w-16 h-16"
  };

  return (
    <svg
      id="novus-logo-svg"
      className={`${dimensions[size]} ${className} shrink-0`}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Sculpted Silver Metallic Gradient */}
        <linearGradient id="silver-chisel" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="35%" stopColor="#DDE1E6" />
          <stop offset="65%" stopColor="#A1A5AB" />
          <stop offset="100%" stopColor="#6C727D" />
        </linearGradient>

        {/* Bronze-Gold Accent Gradient */}
        <linearGradient id="bronze-gold-accent" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#DEAE78" />
          <stop offset="50%" stopColor="#A36E3C" />
          <stop offset="100%" stopColor="#75471D" />
        </linearGradient>

        {/* Subtle drop shadow */}
        <filter id="chisel-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#000000" floodOpacity="0.8" />
        </filter>
      </defs>

      {/* Minimalist Obsidian Shield/Base */}
      <rect x="6" y="6" width="88" height="88" rx="18" fill="#07090D" stroke="rgba(163, 110, 60, 0.3)" strokeWidth="1.5" />

      {/* Sculpted Geometric 'N' Monogram */}
      <g filter="url(#chisel-shadow)">
        {/* Left vertical pillar */}
        <polygon points="26,76 26,24 38,24 38,76" fill="url(#silver-chisel)" />
        {/* Right vertical pillar */}
        <polygon points="62,76 62,24 74,24 74,76" fill="url(#silver-chisel)" />
        {/* Dynamic diagonal connector */}
        <polygon points="36,24 48,24 74,76 62,76" fill="url(#silver-chisel)" opacity="0.92" />
        <polygon points="26,24 38,24 50,48 38,48" fill="#FFFFFF" opacity="0.4" />
      </g>

      {/* Pulse Red focus beacon */}
      <circle cx="74" cy="24" r="4.5" fill="#C92A35" />
      <circle cx="74" cy="24" r="7.5" stroke="#C92A35" strokeWidth="1" opacity="0.4" className="animate-ping" />

      {/* Bronze-Gold anchor coordinate */}
      <circle cx="26" cy="76" r="3.5" fill="url(#bronze-gold-accent)" />
    </svg>
  );
}

interface BrandLockupProps {
  showTagline?: boolean;
  align?: "left" | "center";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function NovusBrandLockup({
  showTagline = true,
  align = "left",
  size = "md",
  className = ""
}: BrandLockupProps) {
  const alignClass = align === "center" ? "items-center text-center" : "items-start text-left";

  const sizeClasses = {
    sm: {
      novus: "text-lg tracking-[0.08em]",
      exchange: "text-[9px] tracking-[0.34em]",
      tagline: "text-[10px] tracking-normal"
    },
    md: {
      novus: "text-2xl tracking-[0.1em]",
      exchange: "text-[11px] tracking-[0.38em]",
      tagline: "text-xs tracking-normal"
    },
    lg: {
      novus: "text-4xl md:text-5xl tracking-[0.12em]",
      exchange: "text-sm md:text-base tracking-[0.42em]",
      tagline: "text-sm md:text-base tracking-normal"
    }
  };

  return (
    <div className={`flex flex-col ${alignClass} ${className} select-none group`}>
      {/* NOVUS Wordmark */}
      <span
        className={`font-brand font-bold silver-beveled-text uppercase leading-none transition-all duration-300 ${sizeClasses[size].novus}`}
      >
        NOVUS
      </span>

      {/* EXCHANGE Subtitle */}
      <span
        className={`font-sans font-semibold silver-sub-text uppercase mt-1 leading-none ${sizeClasses[size].exchange}`}
      >
        EXCHANGE
      </span>

      {/* Connecting Perspectives Tagline */}
      {showTagline && (
        <span
          className={`font-sans font-normal text-[#D4D7DC] mt-1.5 opacity-90 ${sizeClasses[size].tagline}`}
        >
          Connecting Perspectives
        </span>
      )}
    </div>
  );
}

