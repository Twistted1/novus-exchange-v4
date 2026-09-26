import { useState } from "react";
import { Copy, Check, Palette, ChevronDown, ChevronUp } from "lucide-react";

export interface ColorSwatch {
  name: string;
  hex: string;
  role: string;
  textDark: boolean;
  accentClass: string;
  description: string;
}

export const brandSwatches: ColorSwatch[] = [
  {
    name: "PITCH BLACK",
    hex: "#06080C",
    role: "Dominant Canvas (60%)",
    textDark: false,
    accentClass: "border-white/10",
    description: "Deep obsidian backdrop absorbing light, grounding confidential dossiers and high-contrast typography."
  },
  {
    name: "DEEP OBSIDIAN",
    hex: "#07090D",
    role: "Structural Surfaces (30%)",
    textDark: false,
    accentClass: "border-white/10",
    description: "Architectural card surfaces, modal containers, and elevated navigation framing."
  },
  {
    name: "BRONZE-GOLD",
    hex: "#A36E3C",
    role: "Curatorial Accent (10%)",
    textDark: false,
    accentClass: "border-[#A36E3C]/40",
    description: "Refined curatorial highlights, hairlines, editorial badges, and executive insignia accents."
  },
  {
    name: "BRILLIANT WHITE",
    hex: "#FFFFFF",
    role: "Primary Typographic Anchor",
    textDark: true,
    accentClass: "border-white",
    description: "Razor-sharp headlines, high-contrast reading text, and crisp interface focus points."
  },
  {
    name: "PULSE RED",
    hex: "#C92A35",
    role: "Active Telemetry & Primary CTAs",
    textDark: false,
    accentClass: "border-[#C92A35]/50",
    description: "Dynamic signal beacon, breaking intelligence badges, live indicators, and primary action buttons."
  },
  {
    name: "SILVER",
    hex: "#A1A5AB",
    role: "Metallic Sculpted Identity",
    textDark: true,
    accentClass: "border-[#A1A5AB]/40",
    description: "Chiseled wordmark bevels, secondary metadata, hairline borders, and subtle icon strokes."
  }
];

interface BrandPaletteShowcaseProps {
  embedded?: boolean;
}

export default function BrandPaletteShowcase({ embedded = false }: BrandPaletteShowcaseProps) {
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState<boolean>(!embedded);

  const copyToClipboard = (hex: string) => {
    navigator.clipboard?.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 1800);
  };

  if (!embedded) {
    return (
      <div className="w-full bg-[#06080C] border-y border-[#A36E3C]/20 py-8 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#C92A35] animate-pulse" />
                <span className="text-[10px] font-mono tracking-[0.28em] text-[#A36E3C] uppercase font-bold">
                  OFFICIAL BRAND IDENTITY
                </span>
              </div>
              <h3 className="font-brand text-2xl md:text-3xl text-white tracking-wide mt-1">
                COLOR SYSTEM SPECIFICATION
              </h3>
              <p className="text-xs text-[#A1A5AB] mt-1 max-w-xl font-sans">
                Novus Exchange operates on a strict 6-tone color grammar engineered for intellectual rigor, high-contrast legibility, and editorial prestige.
              </p>
            </div>

            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="inline-flex items-center gap-2 self-start md:self-auto px-3.5 py-1.5 rounded-lg border border-white/15 bg-[#07090D] text-xs font-mono text-[#D4D7DC] hover:border-[#A36E3C] transition-colors"
            >
              <Palette className="w-3.5 h-3.5 text-[#A36E3C]" />
              <span>{isExpanded ? "Collapse Palette" : "Inspect Swatches"}</span>
              {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

          {isExpanded && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 pt-2 animate-fadeIn">
              {brandSwatches.map((swatch) => {
                const isCopied = copiedHex === swatch.hex;
                return (
                  <div
                    key={swatch.name}
                    className="flex flex-col bg-[#07090D] border border-white/10 hover:border-[#A36E3C]/50 rounded-xl overflow-hidden p-3 transition-all duration-200 group"
                  >
                    {/* Swatch color tile */}
                    <div
                      style={{ backgroundColor: swatch.hex }}
                      className={`w-full h-16 rounded-lg mb-3 flex items-center justify-center border shadow-inner ${swatch.accentClass} relative transition-transform group-hover:scale-[1.02]`}
                    >
                      <button
                        onClick={() => copyToClipboard(swatch.hex)}
                        title={`Copy ${swatch.hex}`}
                        className={`px-2 py-1 rounded text-[10px] font-mono font-bold tracking-wider flex items-center gap-1 transition-all shadow-md ${
                          swatch.textDark ? "bg-black/80 text-white" : "bg-white/90 text-black"
                        }`}
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-500" />
                            <span>COPIED</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3 opacity-70" />
                            <span>{swatch.hex}</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Color Name */}
                    <span className="font-brand font-bold text-xs tracking-wider text-white uppercase">
                      {swatch.name}
                    </span>

                    {/* Role */}
                    <span className="text-[10px] font-mono text-[#A36E3C] mt-0.5 font-medium">
                      {swatch.role}
                    </span>

                    {/* Description */}
                    <p className="text-[10px] text-[#A1A5AB] leading-relaxed mt-1.5 opacity-80">
                      {swatch.description}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Embedded compact version
  return (
    <div className="flex flex-wrap gap-2 items-center">
      {brandSwatches.map((swatch) => (
        <button
          key={swatch.name}
          onClick={() => copyToClipboard(swatch.hex)}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#07090D] border border-white/10 hover:border-[#A36E3C]/40 text-[10px] font-mono transition-all group"
          title={`${swatch.name} (${swatch.hex}) - Click to copy`}
        >
          <span
            className="w-2.5 h-2.5 rounded-full border border-white/20 shrink-0"
            style={{ backgroundColor: swatch.hex }}
          />
          <span className="text-[#A1A5AB] group-hover:text-white transition-colors">{swatch.name}</span>
          <span className="text-[#A36E3C] opacity-70 group-hover:opacity-100">{swatch.hex}</span>
          {copiedHex === swatch.hex && <Check className="w-3 h-3 text-emerald-400 ml-0.5" />}
        </button>
      ))}
    </div>
  );
}
