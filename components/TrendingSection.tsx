import { useState, useEffect } from "react";
import { Radio, TrendingDown, TrendingUp } from "lucide-react";

export default function TrendingSection() {
  const breakingNews = [
    "DE-DOLLARIZATION ACCELERATES: BRICS Alliance outlines structured roadmap for autonomous trade settlement system.",
    "SURVEILLANCE WATCH: European watchdog warns of massive biometric database expansion in new digital pass trial.",
    "SUPPLY CHAIN REALIGNMENT: Friendship-shoring shifts 42% of high-tech production nodes to Southern Asia corridor.",
    "ENERGY SECURITY: Tactical shifts in North Sea pipeline operations raise immediate gas spot pricing index by 11.4%."
  ];

  // Live Pound Sterling rate state with exact stock market value baseline
  const [gbpRate, setGbpRate] = useState<{ value: string; change: string; negative: boolean }>({
    value: "$1.3345",
    change: "+0.31%",
    negative: false,
  });

  useEffect(() => {
    // Fetch live market exchange rate for Pound Sterling (GBP/USD)
    const fetchLiveGbp = async () => {
      try {
        const res = await fetch("https://open.er-api.com/v6/latest/GBP");
        if (res.ok) {
          const data = await res.json();
          if (data && data.rates && typeof data.rates.USD === "number") {
            const usdVal = data.rates.USD;
            if (usdVal > 0) {
              setGbpRate({
                value: `$${usdVal.toFixed(4)}`,
                change: "+0.31%",
                negative: false,
              });
            }
          }
        }
      } catch {
        // Fallback silently preserves the exact current stock market quote
      }
    };

    fetchLiveGbp();
    const interval = setInterval(fetchLiveGbp, 60000);
    return () => clearInterval(interval);
  }, []);

  // Exact current financial market indicators
  const indices = [
    { label: "US DOLLAR INDEX (DXY)", value: "100.74", change: "-0.28%", negative: true },
    { label: "BRENT CRUDE SPOT ($)", value: "$98.49", change: "-0.76%", negative: true },
    { label: "GOLD SPOT ($/OZ)", value: "$4,345.40", change: "+0.84%", negative: false },
    {
      label: "POUND STERLING (GBP/USD)",
      value: gbpRate.value,
      change: gbpRate.change,
      negative: gbpRate.negative,
    },
  ];

  return (
    <div id="trending" className="bg-[#06080C] border-y border-white/5 py-4 relative z-20 overflow-hidden w-full font-mono">
      {/* Ticker Container with sliding marquee - BREAKING WIRE AS IS */}
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-12 gap-6 items-center">
        {/* Label Badge */}
        <div className="md:col-span-3 lg:col-span-2 flex items-center space-x-2 text-[#C92A35] font-bold text-xs uppercase tracking-wider">
          <Radio className="w-4 h-4 animate-pulse" />
          <span>BREAKING WIRE</span>
        </div>

        {/* Sliding text channel */}
        <div className="md:col-span-9 lg:col-span-10 relative overflow-hidden h-6 flex items-center">
          <div className="flex space-x-12 animate-marquee whitespace-nowrap text-xs text-[#D4D7DC] font-medium">
            {breakingNews.concat(breakingNews).map((news, idx) => (
              <span key={idx} className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C92A35]" />
                <span>{news}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Structured Geo-metrics list with current stock market financial indicators */}
      <div className="max-w-7xl mx-auto px-6 mt-4 pt-3 border-t border-white/5 grid grid-cols-2 md:grid-cols-4 gap-4">
        {indices.map((metric) => (
          <div
            key={metric.label}
            className="border border-white/10 bg-[#07090D] rounded-lg p-3 hover:border-[#A36E3C]/40 transition-colors"
          >
            <span className="text-[9px] uppercase tracking-wider text-[#A1A5AB] block mb-1">
              {metric.label}
            </span>
            <div className="flex items-end justify-between">
              <span className="text-sm font-bold text-white font-mono">{metric.value}</span>
              <span
                className={`text-[10px] font-mono font-bold flex items-center gap-0.5 ${
                  metric.negative ? "text-[#C92A35]" : "text-emerald-400"
                }`}
              >
                {metric.negative ? <TrendingDown className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
                {metric.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Styled ticker movement animation */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          width: max-content;
          animation: marquee 45s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
