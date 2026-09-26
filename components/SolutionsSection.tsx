import { useState } from "react";
import { Terminal, CheckCircle2, Sparkles } from "lucide-react";
import PromoVideoBox from "./PromoVideoBox";

interface Product {
  id: string;
  name: string;
  tagline: string;
  badge?: string;
  description: string;
  defaultVideoPath: string;
  highlights: string[];
  specs: Record<string, string>;
}

export default function SolutionsSection() {
  const [activeProduct, setActiveProduct] = useState<string>("contentflow-pro");

  const products: Product[] = [
    {
      id: "contentflow-pro",
      name: "ContentFlow PRO",
      tagline: "Decentralized Newsroom Syndicate & Editorial Command",
      description: "An advanced, high-velocity editorial command-center engine. Coordinates journalists, field correspondents, and editors securely, distributing certified reports across global publishing channels with zero friction.",
      defaultVideoPath: "/videos/contentflow-pro.mp4",
      highlights: [
        "Cryptographic Content Orchestration & Real-time Synthesis",
        "Encrypted Multisig Editorial Verification Workflows",
        "Omni-channel Zero-Trust Distribution Pipelines"
      ],
      specs: {
        "WORKFLOW ARCHITECTURE": "PGP-encrypted Multisig",
        "CDN TOPOLOGY": "De-duplicated P2P IPFS Network",
        "SYNC VELOCITY": "Sub-100ms Editorial Mirror Nodes",
        "PUBLISHING PROTOCOL": "Omni-channel Headless Syndicate"
      }
    },
    {
      id: "contenthub-cms",
      name: "ContentHub CMS",
      tagline: "Secure Immutable Headless Media CMS",
      description: "A resilient headless media and assets vault. Grounded on censorship-resistant decentralized networks, ContentHub CMS guarantees that your reporting remains accessible even amidst targeted outages and infrastructure interference.",
      defaultVideoPath: "/videos/contenthub-cms.mp4",
      highlights: [
        "Censorship-Resistant Blob Media Hosting",
        "Decentralized Headless Content Delivery API",
        "Global Peer-to-Peer Storage Mirrors"
      ],
      specs: {
        "STORAGE LAYOUT": "Distributed Cryptographic Blobs",
        "INTERACTIONS": "Secure Bearer Token GraphQL/REST",
        "INTEGRITY METRIC": "SHA-256 Merkle Proof Verification",
        "AVAILABILITY SLO": "99.999% Anti-Tamper Redundancy"
      }
    },
    {
      id: "fabrik",
      name: "Fabrik",
      tagline: "Autonomous Media Synthesis & Intelligence Fabric",
      badge: "SPACE RESERVED",
      description: "Space reserved for Fabrik. A forthcoming sovereign production framework designed to interconnect disparate intelligence feeds, automated synthesis pipelines, and verified broadcast nodes into a unified operational fabric.",
      defaultVideoPath: "/videos/fabrik.mp4",
      highlights: [
        "Interconnected Neural Intelligence Mesh (In Development)",
        "Sovereign Data Pipelines & Automated Telemetry",
        "Modular Verification Architecture"
      ],
      specs: {
        "CORE ARCHITECTURE": "Sovereign Modular Fabric",
        "SYSTEM STATUS": "Reserved Space · Details Incoming",
        "PROTOCOL INTERFACE": "Fabrik IPC / WebRTC Mesh",
        "INTEGRATION HORIZON": "Novus Ecosystem Architecture"
      }
    }
  ];

  const currentProduct = products.find((p) => p.id === activeProduct) || products[0];

  return (
    <section id="solutions" className="py-10 lg:py-14 bg-[#06080C] border-t border-white/5 relative flex flex-col justify-center">
      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full my-auto">
        {/* Header Block with Title on the Left */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div className="text-left max-w-xl">
            <div className="flex items-center gap-2.5 mb-3">
              <span className="flex items-center space-x-1">
                <span className="w-1 h-3.5 bg-[#C92A35] rounded-xs" />
                <span className="w-1 h-3.5 bg-[#A36E3C] rounded-xs" />
                <span className="w-1 h-3.5 bg-[#A1A5AB] rounded-xs" />
              </span>
              <span className="text-[10px] font-mono text-[#A36E3C] uppercase tracking-[0.25em] font-bold">
                NOVUS ECOSYSTEM APPS
              </span>
            </div>
            <h2 className="font-brand text-3xl sm:text-4xl font-bold text-white uppercase tracking-tight leading-[1.1]">
              THE CHANNELS & <br className="hidden sm:inline" />
              <span className="silver-beveled-text">SYSTEMS.</span>
            </h2>
            <p className="text-[#A1A5AB] text-sm mt-3.5 leading-relaxed font-sans">
              Harness decentralized systems engineering to publish, store, and shield high-impact investigative materials globally.
            </p>
          </div>

          {/* Tab Selection for the 3 Ecosystem Apps */}
          <div className="mt-6 md:mt-0 flex flex-wrap gap-2.5">
            {products.map((p) => {
              const isActive = activeProduct === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setActiveProduct(p.id)}
                  className={`px-5 py-2.5 rounded-lg font-mono text-xs font-bold uppercase tracking-wider transition-all duration-200 border cursor-pointer flex items-center gap-2 ${
                    isActive
                      ? "border-[#A36E3C] bg-[#080A0E] text-white shadow-[0_0_20px_rgba(163,110,60,0.25)]"
                      : "border-white/10 hover:border-[#A1A5AB]/40 text-[#A1A5AB] hover:text-white bg-[#06080C]"
                  }`}
                >
                  <span>{p.name}</span>
                  {p.badge && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#A36E3C]/20 text-[#DEAE78] border border-[#A36E3C]/40">
                      {p.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Product Visual Container & Description Block */}
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Metadata & Spec Sheet */}
          <div className="lg:col-span-5 flex flex-col space-y-6 text-left">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xs text-[#A36E3C] font-mono font-bold uppercase tracking-widest">
                  {currentProduct.tagline}
                </span>
                {currentProduct.badge && (
                  <span className="inline-flex items-center gap-1 text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-[#C92A35]/15 text-[#C92A35] border border-[#C92A35]/30 uppercase">
                    <Sparkles className="w-2.5 h-2.5" />
                    {currentProduct.badge}
                  </span>
                )}
              </div>
              <h3 className="font-brand text-3xl font-bold text-white uppercase tracking-tight">
                {currentProduct.name}
              </h3>
            </div>

            <p className="text-[#A1A5AB] text-sm leading-relaxed font-sans">
              {currentProduct.description}
            </p>

            {/* List highlights */}
            <div className="space-y-3 pt-1">
              {currentProduct.highlights.map((highlight, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-[#C92A35] shrink-0 mt-0.5" />
                  <span className="text-[#D4D7DC] leading-relaxed font-sans">{highlight}</span>
                </div>
              ))}
            </div>

            {/* Micro spec sheet console */}
            <div className="border border-[#A36E3C]/20 bg-[#080A0E] p-4 rounded-xl font-mono text-[11px] space-y-2.5">
              <div className="text-[#A36E3C] font-bold border-b border-white/5 pb-2 uppercase tracking-wider flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-[#C92A35]" />
                SYSTEM DESIGN SPECIFICATIONS
              </div>
              {Object.entries(currentProduct.specs).map(([key, val]) => (
                <div key={key} className="flex justify-between items-center text-gray-400 py-0.5">
                  <span className="text-[#A1A5AB] uppercase text-[10px]">{key}:</span>
                  <span className="text-white font-semibold font-mono text-[10px]">{val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Promo Video Display Box */}
          <div className="lg:col-span-7 relative">
            <PromoVideoBox
              appId={currentProduct.id}
              appName={currentProduct.name}
              defaultVideoPath={currentProduct.defaultVideoPath}
              tagline={currentProduct.tagline}
            />
          </div>

        </div>
      </div>
    </section>
  );
}
