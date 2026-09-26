import { ArrowRight } from "lucide-react";
import GlobeVisualization from "./GlobeVisualization";

export default function AboutSection() {
  const inquiries = [
    { question: "Who decides?", num: "01" },
    { question: "Who benefits?", num: "02" },
    { question: "Who pays?", num: "03" },
    { question: "What are we missing?", num: "04" },
  ];

  return (
    <section
      id="about"
      className="py-10 lg:py-14 bg-[#06080C] border-t border-white/5 relative overflow-hidden flex flex-col justify-center"
    >
      {/* Background atmospheric radial aura */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] bg-[radial-gradient(ellipse_at_center,rgba(163,110,60,0.06),transparent_70%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full my-auto">
        
        {/* Side-by-Side: "Connecting Perspectives" Section + 3D WebGL Globe Visualisation */}
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* LEFT: Elegantly Styled "Connecting Perspectives" Section (lg:col-span-5) */}
          <div className="lg:col-span-5 flex flex-col space-y-6 text-left">
            
            {/* Editorial Eyebrow & Brand Badging */}
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <span className="flex items-center space-x-1">
                  <span className="w-1 h-3.5 bg-[#C92A35] rounded-xs" />
                  <span className="w-1 h-3.5 bg-[#A36E3C] rounded-xs" />
                  <span className="w-1 h-3.5 bg-[#A1A5AB] rounded-xs" />
                </span>
                <span className="text-[10px] font-mono text-[#A36E3C] uppercase tracking-[0.25em] font-bold">
                  EDITORIAL MESH & GLOBAL SOVEREIGNTY
                </span>
              </div>

              <h2 className="font-brand text-3xl sm:text-4xl font-bold text-white uppercase tracking-tight leading-[1.1]">
                CONNECTING PERSPECTIVES. <br />
                <span className="silver-beveled-text">CHALLENGING POWER.</span>
              </h2>
            </div>

            {/* User Requested Narrative Content */}
            <div className="space-y-5">
              {/* Lead Mission Statement */}
              <p className="text-[#D4D7DC] text-sm sm:text-base leading-relaxed font-sans font-normal border-l-2 border-[#A36E3C]/60 pl-3.5">
                Novus Exchange connects media, technology and education to examine the systems shaping our lives — questioning power, connecting evidence and putting events into context.
              </p>

              {/* Four Incisive Inquiries */}
              <div className="grid grid-cols-2 gap-2.5 pt-1">
                {inquiries.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-[#07090D] border border-white/10 hover:border-[#A36E3C]/40 transition-colors flex items-center justify-between group"
                  >
                    <span className="font-editorial text-base sm:text-lg text-white group-hover:text-[#DEAE78] transition-colors italic font-medium">
                      {item.question}
                    </span>
                    <span className="text-[9px] font-mono text-[#A36E3C] font-bold">
                      {item.num}
                    </span>
                  </div>
                ))}
              </div>

              {/* Concluding Credo */}
              <div className="border-t border-white/10 pt-4 space-y-1">
                <p className="font-editorial text-lg sm:text-xl text-[#A1A5AB] italic">
                  We don't tell you what to think.
                </p>
                <p className="font-brand text-xl sm:text-2xl font-bold text-white tracking-wide uppercase">
                  We give you more to think about.
                </p>
              </div>
            </div>

            {/* Editorial Action Button */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <a
                href="#articles"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-white border border-white/15 hover:border-[#A36E3C]/50 text-xs font-mono font-bold uppercase tracking-wider transition-all group cursor-pointer"
              >
                <span>EXPLORE INVESTIGATIONS</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#C92A35] group-hover:translate-x-1 transition-transform" />
              </a>
            </div>

          </div>

          {/* RIGHT: High-Spec WebGL 3D Globe Visualisation (lg:col-span-7) */}
          <div className="lg:col-span-7 w-full lg:translate-y-[0.5cm]">
            <GlobeVisualization compact={false} />
          </div>

        </div>

      </div>
    </section>
  );
}
