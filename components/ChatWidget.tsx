import { useState, useEffect, useRef } from "react";
import { MessageSquare, X, Send, Cpu, Terminal } from "lucide-react";

interface Message {
  id: string;
  sender: "user" | "system";
  text: string;
  timestamp: string;
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "init",
      sender: "system",
      text: "ACCESS GRANTED. Novus Intel Core v2.8 initialized. Ask our autonomous system for secure analysis on global developments, solutions architecture, or editorial briefs.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const presetQuestions = [
    "Brief on US-China shifting balance of power.",
    "Evaluate BRICS de-dollarization roadmap.",
    "Classified biometric surveillance trials?",
    "Explain Content Hub censorship-resistance."
  ];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    const query = text.toLowerCase();

    // High fidelity geopolitical response algorithm matching Novus Exchange's brand
    setTimeout(() => {
      let reply = "";
      if (query.includes("us-china") || query.includes("balance") || query.includes("ally") || query.includes("influence")) {
        reply = "► DECRYPTED CORE BRIEF: The balance of power between the US and China is undergoing aggressive polarization. Middle-power security allies (such as the Indo-Pacific network and select European nodes) are experiencing extreme tactical friction, stuck between mandatory high-tech supply containment and crucial regional trade. System telemetry indicates a 'silently containment regime' with immediate zero-retraction milestones expected.";
      } else if (query.includes("brics") || query.includes("dollar") || query.includes("de-dollarization") || query.includes("currency")) {
        reply = "► FINANCIAL INTELLIGENCE SUMMARY: BRICS members are accelerating an autonomous multi-polar clearing unit to bypass SWIFT protocols. This moves high-liquidity commodity swaps to decentralized algorithmic systems. While the USD remains the dominant global bearer standard, the systemic drift towards multi-currency swap vaults reduces unilateral economic sanctions' efficiency to under 60%.";
      } else if (query.includes("biometric") || query.includes("surveillance") || query.includes("tracking") || query.includes("digital identity")) {
        reply = "► ZERO-TRUST WARNING: European, American, and Western security hubs are implementing distributed biometric pass databases under the banner of 'frictionless airport custom lines'. Telemetry traces reveal these nodes are integrated with legacy banking networks to form structured financial control layers. Novus Exchange continues auditing these schemas securely via Content Hub.";
      } else if (query.includes("contentflow") || query.includes("contenthub") || query.includes("fabrik") || query.includes("ecosystem") || query.includes("solutions") || query.includes("product")) {
        reply = "► ECOSYSTEM APPS TELEMETRY: (1) ContentFlow PRO coordinates newsrooms with cryptographically-signed multisig handshakes to prevent systemic editorial tampering. (2) ContentHub CMS distributes immutable file blobs across censorship-resistant P2P networks (99.999% SLA under tier-1 state routing blocks). (3) Fabrik is in active build as a sovereign modular media synthesis fabric.";
      } else {
        reply = "► INQUIRY DECRYPTED: The request matches active indicators. Deep satellite imagery, ground telemetry, and financial ledger data are currently being compiled. While we complete the full dossier, explore active geopolitical widgets and security articles outlined in our index below.";
      }

      const systemMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "system",
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, systemMsg]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <>
      {/* Floating Action Button with Pulse Red & Bronze-Gold accents */}
      <button
        id="novus-chat-floating-button"
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-[#C92A35] hover:bg-[#b0232c] active:scale-95 text-white rounded-full flex items-center justify-center shadow-[0_4px_25px_rgba(201,42,53,0.4)] z-50 cursor-pointer transition-transform duration-200 border border-[#A36E3C]/30"
        title="Ask Novus Intelligent Core"
      >
        <MessageSquare className="w-6 h-6 text-white" />
      </button>

      {/* Slide-out Interactive Chat Drawer styled with Novus brand system */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-[360px] sm:w-[420px] max-h-[580px] h-[80vh] bg-[#07090D] border border-[#A36E3C]/35 rounded-2xl shadow-2xl flex flex-col z-50 animate-fadeIn overflow-hidden">
          {/* Glowing accent border */}
          <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-[#C92A35] via-[#A36E3C] to-transparent" />
          
          {/* Header */}
          <div className="p-4 bg-[#040507] border-b border-white/10 flex items-center justify-between z-10">
            <div className="flex items-center space-x-2.5">
              <div className="relative">
                <Cpu className="w-5 h-5 text-[#C92A35]" />
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              </div>
              <div className="text-left">
                <h4 className="text-xs font-mono font-bold text-white tracking-widest uppercase">
                  NOVUS INTEL v2.8
                </h4>
                <p className="text-[9px] font-mono text-[#A1A5AB] tracking-wider">
                  AUTONOMOUS CORE // CONNECTING PERSPECTIVES
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-[#A1A5AB] hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Stream */}
          <div
            ref={scrollRef}
            className="flex-1 p-4 overflow-y-auto space-y-4 bg-[#06080C] scrollbar-thin scrollbar-thumb-white/5"
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col max-w-[85%] ${
                  msg.sender === "user" ? "ml-auto text-right" : "mr-auto text-left"
                }`}
              >
                <div
                  className={`p-3 rounded-xl text-xs leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-[#C92A35] text-white rounded-br-none font-sans"
                      : "bg-[#07090D] text-[#D4D7DC] border border-white/10 rounded-bl-none font-mono text-[11px]"
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[8px] font-mono text-[#A1A5AB] mt-1 uppercase">
                  {msg.timestamp}
                </span>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center space-x-2 text-[#C92A35] font-mono text-[10px] animate-pulse">
                <Terminal className="w-3.5 h-3.5 animate-spin" />
                <span>SECURE BROADCAST DECRYPTING...</span>
              </div>
            )}
          </div>

          {/* Quick preset suggestions */}
          <div className="p-3 bg-[#07090D] border-t border-white/5 text-left">
            <span className="text-[8px] font-mono text-[#A36E3C] uppercase tracking-widest block mb-2 font-bold">
              ◄ CHOOSE INTEL DOSSIER SPEC:
            </span>
            <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto">
              {presetQuestions.map((q) => (
                <button
                  key={q}
                  onClick={() => handleSendMessage(q)}
                  className="px-2 py-1 border border-white/10 hover:border-[#A36E3C] bg-[#040507] text-[9px] font-mono text-[#A1A5AB] hover:text-white rounded transition-colors text-left line-clamp-1 truncate block max-w-full cursor-pointer"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* User Input controls */}
          <div className="p-3 bg-[#040507] border-t border-white/5 flex items-center space-x-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSendMessage(inputText);
                  setInputText("");
                }
              }}
              placeholder="Query global dossier logs..."
              className="flex-1 bg-[#07090D] text-white text-xs pl-3.5 pr-2 py-2.5 rounded-lg border border-white/10 focus:outline-none focus:border-[#A36E3C] font-mono placeholder:text-[#A1A5AB]/50"
            />
            <button
              onClick={() => {
                handleSendMessage(inputText);
                setInputText("");
              }}
              className="p-2.5 bg-[#C92A35] hover:bg-[#b0232c] active:scale-95 text-white rounded-lg transition-transform duration-100 flex items-center justify-center cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

