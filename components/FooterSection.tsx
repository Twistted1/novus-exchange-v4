import { useState, MouseEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import LogoIcon from "./LogoIcon";
import SocialLinks from "./SocialMediaIcons";
import { Check, ArrowRight, ShieldCheck } from "lucide-react";

function SectionLink({ sectionId, children }: { sectionId: string; children: string }) {
  const navigate = useNavigate();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 76;
      const top = element.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
      return;
    }
    navigate("/", { state: { scrollTo: sectionId } });
  };

  return (
    <a href={`#${sectionId}`} onClick={handleClick} className="text-[#A1A5AB] hover:text-white transition-colors">
      {children}
    </a>
  );
}

export default function FooterSection() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && email.includes("@")) {
      setSubscribed(true);
      setTimeout(() => {
        setEmail("");
        setSubscribed(false);
      }, 4000);
    }
  };

  return (
    <footer className="bg-[#06080C] border-t border-white/5 pt-8 pb-5 relative overflow-hidden w-full">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Top Grid */}
        <div className="grid lg:grid-cols-12 gap-8 pb-7 border-b border-white/5">
          
          {/* Brand Column (Footer-Left) */}
          <div className="lg:col-span-4 text-left space-y-3.5">
            <div className="flex items-center gap-3">
              <LogoIcon size="md" />
              <div className="flex flex-col text-left">
                <div className="flex items-center gap-1.5 leading-none">
                  <span className="font-brand font-bold text-xl tracking-[0.1em] silver-beveled-text">
                    NOVUS
                  </span>
                  <span className="font-sans font-semibold text-[11px] tracking-[0.32em] text-[#A1A5AB]">
                    EXCHANGE
                  </span>
                </div>
                <span className="text-[10px] font-mono text-[#A36E3C] tracking-wide mt-1">
                  @NovusExchange
                </span>
              </div>
            </div>
            
            <p className="text-[#A1A5AB] text-xs leading-relaxed max-w-sm font-sans">
              Investigative media platform for the curious and the courageous. Connecting divergent perspectives, exposing asymmetric power, and defending independent truth.
            </p>
            
            {/* Footer-Left: Correct official logos only */}
            <div className="pt-2">
              <SocialLinks variant="icons-only" />
            </div>
          </div>

          {/* Platform Links */}
          <div className="lg:col-span-2 text-left">
            <h4 className="text-[#A36E3C] font-bold text-[11px] tracking-[0.25em] uppercase mb-4 font-mono">
              Platform
            </h4>
            <ul className="space-y-2.5 font-mono text-xs">
              <li><SectionLink sectionId="home">Home Wire</SectionLink></li>
              <li><SectionLink sectionId="about">About Us</SectionLink></li>
              <li><SectionLink sectionId="solutions">Infrastructure</SectionLink></li>
              <li><SectionLink sectionId="trending">Trending Indices</SectionLink></li>
              <li><SectionLink sectionId="articles">Intelligence Archive</SectionLink></li>
              <li>
                <Link to="/cost-of-living-uk-budget-2026" className="text-[#A1A5AB] hover:text-white transition-colors">
                  UK Budget 2026
                </Link>
              </li>
            </ul>
          </div>

          {/* Topics Links */}
          <div className="lg:col-span-2 text-left">
            <h4 className="text-[#A36E3C] font-bold text-[11px] tracking-[0.25em] uppercase mb-4 font-mono">
              Topics
            </h4>
            <ul className="space-y-2 font-mono text-xs">
              <li><SectionLink sectionId="articles">Geopolitics</SectionLink></li>
              <li><SectionLink sectionId="articles">Economics</SectionLink></li>
              <li><SectionLink sectionId="articles">Tech-AI</SectionLink></li>
              <li><SectionLink sectionId="articles">Green-Tech</SectionLink></li>
              <li><SectionLink sectionId="articles">CSR</SectionLink></li>
              <li><SectionLink sectionId="articles">Brazil</SectionLink></li>
            </ul>
          </div>

          {/* Newsletter Dispatch Column */}
          <div className="lg:col-span-4 text-left space-y-3">
            <h4 className="text-white font-brand font-bold text-sm uppercase tracking-wide">
              Confidential Wire Subscription
            </h4>
            <p className="text-xs text-[#A1A5AB] leading-relaxed font-sans">
              Receive unredacted weekly intelligence dossiers directly to your secure inbox.
            </p>

            <form onSubmit={handleSubscribe} className="relative mt-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="journalist@domain.org"
                className="w-full bg-[#080A0E] border border-white/10 focus:border-[#A36E3C] text-xs text-white px-3.5 py-2.5 rounded-lg outline-none pr-28 transition-colors placeholder:text-[#A1A5AB]/50 font-mono"
              />
              <button
                type="submit"
                className="absolute right-1 top-1 bottom-1 px-3 bg-[#C92A35] hover:bg-[#a8222b] text-white text-[11px] font-mono font-bold uppercase rounded-md transition-colors flex items-center gap-1 cursor-pointer"
              >
                {subscribed ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-white" />
                    <span>Joined</span>
                  </>
                ) : (
                  <>
                    <span>Join Wire</span>
                    <ArrowRight className="w-3 h-3" />
                  </>
                )}
              </button>
            </form>
            {subscribed && (
              <p className="text-[10px] font-mono text-emerald-400">
                ✓ PGP Key exchange confirmed. You are enrolled in the wire.
              </p>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono text-[#A1A5AB]">
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} Novus Exchange. Connecting Perspectives.</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span className="hover:text-white cursor-pointer">Privacy Policy</span>
            <span>·</span>
            <span className="hover:text-white cursor-pointer">Terms of Service</span>
            <span>·</span>
            <span className="text-[#C92A35] flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              END-TO-END VERIFIED
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}
