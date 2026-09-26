import { useState, useEffect, MouseEvent } from "react";
import { Search, Menu, X, Palette } from "lucide-react";
import LogoIcon from "./LogoIcon";

interface NavbarProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  onOpenPaletteModal?: () => void;
}

export default function Navbar({ activeSection, onNavigate, onOpenPaletteModal }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Home", href: "home" },
    { label: "About", href: "about" },
    { label: "Solutions", href: "solutions" },
    { label: "Trending", href: "trending" },
    { label: "Articles", href: "articles" }
  ];

  const handleNavClick = (e: MouseEvent, href: string) => {
    e.preventDefault();
    onNavigate(href);
    setMobileMenuOpen(false);

    const element = document.getElementById(href);
    if (element) {
      const offset = 76;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: "smooth"
      });
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onNavigate("articles");
      const element = document.getElementById("articles");
      if (element) {
        const offset = 76;
        const pos = element.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({ top: pos - offset, behavior: "smooth" });
      }
    }
  };

  return (
    <nav
      id="main-navigation"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
        isScrolled
          ? "bg-[#06080C]/95 backdrop-blur-md border-[#A36E3C]/20 py-3 shadow-[0_4px_30px_rgba(0,0,0,0.8)]"
          : "bg-[#06080C]/80 backdrop-blur-sm border-white/5 py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between gap-4">
        {/* Zone 1: Brand Wordmark (Single cohesive brand lockup) */}
        <a
          href="#home"
          onClick={(e) => handleNavClick(e, "home")}
          className="flex items-center gap-3 group focus:outline-none"
        >
          <LogoIcon size="md" className="group-hover:scale-105 transition-transform duration-300" />
          <div className="flex flex-col text-left">
            <div className="flex items-center gap-1.5 leading-none">
              <span className="font-brand font-bold text-lg md:text-xl tracking-[0.1em] silver-beveled-text">
                NOVUS
              </span>
              <span className="font-sans font-semibold text-[11px] tracking-[0.32em] text-[#A1A5AB]">
                EXCHANGE
              </span>
            </div>
            <span className="text-[10px] font-mono text-[#A36E3C] tracking-wide mt-0.5 opacity-90 hidden sm:block">
              @NovusExchange
            </span>
          </div>
        </a>

        {/* Zone 2: 4-6 Nav Links */}
        <div className="hidden md:flex items-center space-x-7">
          {navLinks.map((link) => {
            const isActive = activeSection === link.href;
            return (
              <a
                key={link.href}
                href={`#${link.href}`}
                onClick={(e) => handleNavClick(e, link.href)}
                className={`text-xs uppercase font-medium tracking-wider transition-all duration-200 whitespace-nowrap relative py-1 ${
                  isActive
                    ? "text-white font-bold"
                    : "text-[#A1A5AB] hover:text-white"
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#C92A35] via-[#A36E3C] to-[#C92A35] rounded-full" />
                )}
              </a>
            );
          })}
        </div>

        {/* Zone 3: Search Bar & Palette Action */}
        <div className="flex items-center gap-3">
          {/* Working Search Bar */}
          <form onSubmit={handleSearchSubmit} className="relative w-36 sm:w-44 lg:w-52 hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#A1A5AB]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search intel..."
              className="w-full bg-[#080A0E] text-white text-xs pl-8 pr-3 py-1.5 rounded-lg border border-white/10 focus:border-[#A36E3C] focus:outline-none transition-all placeholder:text-[#A1A5AB]/60"
            />
          </form>

          {/* Color Palette Button */}
          {onOpenPaletteModal && (
            <button
              onClick={onOpenPaletteModal}
              title="View Novus Exchange Color Palette"
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#A36E3C]/30 bg-[#080A0E] text-[11px] font-mono font-medium text-[#D4D7DC] hover:border-[#A36E3C] hover:text-white transition-colors cursor-pointer"
            >
              <span className="w-2 h-2 rounded-full bg-[#C92A35]" />
              <Palette className="w-3.5 h-3.5 text-[#A36E3C]" />
              <span>Palette</span>
            </button>
          )}

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 text-[#A1A5AB] hover:text-white focus:outline-none cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#06080C]/98 border-b border-[#A36E3C]/20 px-6 py-4 space-y-3 animate-fadeIn">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={`#${link.href}`}
              onClick={(e) => handleNavClick(e, link.href)}
              className={`block text-xs uppercase tracking-wider py-1.5 ${
                activeSection === link.href
                  ? "text-white font-bold border-l-2 border-[#C92A35] pl-2"
                  : "text-[#A1A5AB] hover:text-white pl-2"
              }`}
            >
              {link.label}
            </a>
          ))}
          {onOpenPaletteModal && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenPaletteModal();
              }}
              className="w-full text-left text-xs uppercase tracking-wider py-1.5 pl-2 text-[#A36E3C] flex items-center gap-2 cursor-pointer"
            >
              <Palette className="w-3.5 h-3.5" />
              <span>Inspect Brand Color System</span>
            </button>
          )}
        </div>
      )}
    </nav>
  );
}

