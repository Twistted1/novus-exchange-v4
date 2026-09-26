export interface SocialItem {
  id: "yt" | "x" | "ig" | "fb";
  name: string;
  handle: string;
  url: string;
  brandColor: string;
  bgColor: string;
  hoverBorder: string;
  textColor: string;
}

export const OFFICIAL_SOCIALS: SocialItem[] = [
  {
    id: "yt",
    name: "YouTube",
    handle: "@novusexchange",
    url: "https://www.youtube.com/@novusexchange",
    brandColor: "#FF0000",
    bgColor: "bg-[#FF0000]/10",
    hoverBorder: "hover:border-[#FF0000]/60",
    textColor: "group-hover:text-[#FF4D4D]",
  },
  {
    id: "x",
    name: "X",
    handle: "@novusexchange",
    url: "https://x.com/novusexchange",
    brandColor: "#FFFFFF",
    bgColor: "bg-white/10",
    hoverBorder: "hover:border-white/50",
    textColor: "group-hover:text-white",
  },
  {
    id: "ig",
    name: "Instagram",
    handle: "@novusexchange",
    url: "https://www.instagram.com/novusexchange",
    brandColor: "#E1306C",
    bgColor: "bg-[#E1306C]/10",
    hoverBorder: "hover:border-[#E1306C]/60",
    textColor: "group-hover:text-[#FD1D1D]",
  },
  {
    id: "fb",
    name: "Facebook",
    handle: "@novusexchange",
    url: "https://www.facebook.com/novusexchange",
    brandColor: "#1877F2",
    bgColor: "bg-[#1877F2]/10",
    hoverBorder: "hover:border-[#1877F2]/60",
    textColor: "group-hover:text-[#4B9BFF]",
  },
];

// Official YouTube Red Logo with White Triangle
export function YouTubeLogo({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-label="YouTube">
      <path
        fill="#FF0000"
        d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z"
      />
      <path fill="#FFFFFF" d="M9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

// Official X (formerly Twitter) Glyph
export function XLogo({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="#FFFFFF" aria-label="X">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

// Official Instagram Multi-Color Gradient Camera Logo
export function InstagramLogo({ className = "w-5 h-5" }: { className?: string }) {
  const gradientId = "ig-gradient-official";
  return (
    <svg className={className} viewBox="0 0 24 24" aria-label="Instagram">
      <defs>
        <radialGradient id={gradientId} cx="30%" cy="107%" r="150%">
          <stop offset="0%" stopColor="#fdf497" />
          <stop offset="5%" stopColor="#fdf497" />
          <stop offset="45%" stopColor="#fd5949" />
          <stop offset="60%" stopColor="#d6249f" />
          <stop offset="90%" stopColor="#285AEB" />
        </radialGradient>
      </defs>
      <path
        fill={`url(#${gradientId})`}
        d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
      />
    </svg>
  );
}

// Official Facebook Blue Logo with White 'f'
export function FacebookLogo({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-label="Facebook">
      <path
        fill="#1877F2"
        d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
      />
      <path
        fill="#FFFFFF"
        d="M16.671 15.463l.532-3.47h-3.328v-2.25c0-.949.465-1.874 1.956-1.874h1.491V4.916s-1.374-.235-2.686-.235c-2.741 0-4.533 1.662-4.533 4.669v2.643H7.078v3.47h3.047v8.385a12.09 12.09 0 0 0 3.75 0v-8.385h2.796z"
      />
    </svg>
  );
}

export function SocialIcon({ id, className = "w-4 h-4" }: { id: string; className?: string }) {
  switch (id) {
    case "yt":
      return <YouTubeLogo className={className} />;
    case "x":
      return <XLogo className={className} />;
    case "ig":
      return <InstagramLogo className={className} />;
    case "fb":
      return <FacebookLogo className={className} />;
    default:
      return null;
  }
}

interface SocialLinksProps {
  variant?: "buttons" | "icons-only" | "cards";
  showHandle?: boolean;
  className?: string;
}

export default function SocialLinks({
  variant = "buttons",
  showHandle = true,
  className = "",
}: SocialLinksProps) {
  if (variant === "icons-only") {
    return (
      <div className={`flex items-center gap-2.5 ${className}`}>
        {OFFICIAL_SOCIALS.map((social) => (
          <a
            key={social.id}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            title={`${social.name} - ${social.handle}`}
            className={`w-8 h-8 rounded-lg bg-[#07090D] border border-white/10 ${social.hoverBorder} flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-sm`}
          >
            <SocialIcon id={social.id} className="w-4 h-4" />
          </a>
        ))}
      </div>
    );
  }

  if (variant === "cards") {
    return (
      <div className={`grid grid-cols-2 sm:grid-cols-4 gap-3 ${className}`}>
        {OFFICIAL_SOCIALS.map((social) => (
          <a
            key={social.id}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`group p-3 rounded-xl bg-[#07090D] border border-white/10 ${social.hoverBorder} transition-all duration-200 hover:scale-[1.02] flex items-center gap-3`}
          >
            <div className={`w-9 h-9 rounded-lg ${social.bgColor} flex items-center justify-center shrink-0 border border-white/5`}>
              <SocialIcon id={social.id} className="w-5 h-5" />
            </div>
            <div className="flex flex-col text-left overflow-hidden">
              <span className={`text-xs font-bold text-white ${social.textColor} font-sans transition-colors`}>
                {social.name}
              </span>
              <span className="text-[10px] font-mono text-[#A1A5AB] truncate">
                {social.handle}
              </span>
            </div>
          </a>
        ))}
      </div>
    );
  }

  // Default: interactive styled badges with official logos
  return (
    <div className={`flex flex-wrap items-center gap-2.5 ${className}`}>
      {OFFICIAL_SOCIALS.map((social) => (
        <a
          key={social.id}
          href={social.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`group inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#07090D] border border-white/10 ${social.hoverBorder} transition-all duration-200 hover:bg-[#0C0F17] hover:scale-[1.02]`}
        >
          <div className="flex items-center justify-center shrink-0">
            <SocialIcon id={social.id} className="w-4 h-4" />
          </div>
          <span className={`text-xs font-semibold text-white ${social.textColor} font-sans transition-colors`}>
            {social.name}
          </span>
          {showHandle && (
            <span className="text-[10px] font-mono text-[#A1A5AB] font-normal hidden sm:inline">
              {social.handle}
            </span>
          )}
        </a>
      ))}
    </div>
  );
}
