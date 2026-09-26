import React, { useState, useRef, useEffect } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  RotateCcw,
  Upload,
  Check,
  Film,
  Sparkles,
  Info,
  X,
} from "lucide-react";

interface PromoVideoBoxProps {
  appId: string;
  appName: string;
  defaultVideoPath: string;
  tagline: string;
}

export default function PromoVideoBox({
  appId,
  appName,
  defaultVideoPath,
  tagline,
}: PromoVideoBoxProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Custom user-loaded video map (keyed by appId so each app can have its own video)
  const [customVideoUrls, setCustomVideoUrls] = useState<Record<string, string>>({});
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(45); // default fallback to 45s
  const [hasVideoLoaded, setHasVideoLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [activeTab, setActiveTab] = useState<"file" | "url" | "guide">("file");
  const [copiedFile, setCopiedFile] = useState<string | null>(null);

  // Active video source for the currently selected app
  const activeVideoSrc = customVideoUrls[appId] || defaultVideoPath;

  // Reset state when app changes
  useEffect(() => {
    setHasError(false);
    setHasVideoLoaded(false);
    setProgress(0);
    setCurrentTime(0);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  }, [appId, activeVideoSrc]);

  // Handle Play/Pause
  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.error("Video play error:", err));
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  // Handle Mute/Unmute
  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  // Handle Seek/Scrub
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current) return;
    const newTime = (parseFloat(e.target.value) / 100) * (videoRef.current.duration || 45);
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
    setProgress(parseFloat(e.target.value));
  };

  // Fullscreen
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => {
        console.error("Fullscreen error:", err);
      });
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  // Format time MM:SS
  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return "00:00";
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Local File Upload Handler (Instant browser preview)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setCustomVideoUrls((prev) => ({ ...prev, [appId]: objectUrl }));
      setHasError(false);
      setHasVideoLoaded(true);
      setShowConfigModal(false);
    }
  };

  // URL Input Handler
  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (urlInput.trim()) {
      setCustomVideoUrls((prev) => ({ ...prev, [appId]: urlInput.trim() }));
      setHasError(false);
      setShowConfigModal(false);
      setUrlInput("");
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFile(text);
    setTimeout(() => setCopiedFile(null), 2500);
  };

  return (
    <div
      ref={containerRef}
      className="relative rounded-2xl border border-[#A36E3C]/30 bg-[#080A0E] p-2.5 overflow-hidden shadow-2xl group text-left"
    >
      {/* Video Box Main Display */}
      <div className="relative aspect-video rounded-xl bg-[#06080C] overflow-hidden flex items-center justify-center border border-white/5 select-none">
        
        {/* HTML5 Video Element */}
        <video
          ref={videoRef}
          key={`${appId}-${activeVideoSrc}`}
          src={activeVideoSrc}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
            hasVideoLoaded && !hasError ? "opacity-100" : "opacity-0"
          }`}
          autoPlay
          muted={isMuted}
          loop
          playsInline
          onLoadedData={() => {
            setHasVideoLoaded(true);
            setHasError(false);
            if (videoRef.current) {
              setDuration(videoRef.current.duration || 45);
            }
          }}
          onTimeUpdate={() => {
            if (videoRef.current) {
              const current = videoRef.current.currentTime;
              const dur = videoRef.current.duration || 45;
              setCurrentTime(current);
              setProgress((current / dur) * 100);
            }
          }}
          onError={() => {
            setHasError(true);
            setHasVideoLoaded(false);
          }}
        />

        {/* Ambient Darkened Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#06080C]/90 via-[#06080C]/30 to-transparent pointer-events-none z-10" />

        {/* High-Tech Fallback / Promo Reel Placeholder (Displayed if local file is missing or until user loads 45s reel) */}
        {(!hasVideoLoaded || hasError) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-15 bg-[#06080C] overflow-hidden">
            {/* Ambient cyber grid scanlines */}
            <div className="absolute inset-0 bg-[radial-gradient(#A36E3C_1px,transparent_1px)] [background-size:18px_18px] opacity-20 pointer-events-none" />
            
            {/* Animated Beacon */}
            <div className="relative w-16 h-16 mb-3 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border border-[#C92A35]/40 animate-ping" />
              <div className="absolute inset-2 rounded-full border border-[#A36E3C]/50 animate-pulse" />
              <div className="w-12 h-12 rounded-xl bg-[#080A0E] border border-[#A36E3C] flex items-center justify-center shadow-[0_0_25px_rgba(163,110,60,0.35)]">
                <Film className="w-6 h-6 text-[#C92A35]" />
              </div>
            </div>

            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#A36E3C]/15 border border-[#A36E3C]/30 text-[9px] font-mono text-[#DEAE78] font-bold uppercase tracking-widest mb-2">
              <Sparkles className="w-3 h-3 text-[#A36E3C]" />
              <span>45-SECOND PROMO REEL READY</span>
            </div>

            <h4 className="font-brand text-xl sm:text-2xl font-bold text-white uppercase tracking-tight mb-1">
              {appName} PROMO
            </h4>
            
            <p className="text-xs text-[#A1A5AB] max-w-sm mb-4 font-sans line-clamp-2">
              {tagline}
            </p>

            {/* Quick Action to Load / Connect Video */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 z-20">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-[#C92A35] hover:bg-[#D93440] text-white rounded-lg text-xs font-mono font-bold uppercase tracking-wider transition-all duration-200 shadow-[0_0_15px_rgba(201,42,53,0.3)] flex items-center gap-2 cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Select 45s Video</span>
              </button>

              <button
                onClick={() => setShowConfigModal(true)}
                className="px-3.5 py-2 bg-[#080A0E] border border-[#A36E3C]/40 hover:border-[#A36E3C] text-[#D4D7DC] hover:text-white rounded-lg text-xs font-mono font-bold uppercase tracking-wider transition-all duration-200 flex items-center gap-1.5 cursor-pointer"
              >
                <Info className="w-3.5 h-3.5 text-[#A36E3C]" />
                <span>How to Add Video</span>
              </button>
            </div>
          </div>
        )}

        {/* Top Badges / Info Overlay */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-25 pointer-events-none">
          <div className="flex items-center gap-2 pointer-events-auto">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#06080C]/85 border border-[#A36E3C]/30 text-[10px] font-mono text-[#D4D7DC] backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C92A35] animate-pulse" />
              <span className="font-bold text-[#A36E3C]">{appName}</span>
              <span className="text-[#A1A5AB]">PROMO</span>
            </span>
          </div>

          <div className="flex items-center gap-2 pointer-events-auto">
            <button
              onClick={() => setShowConfigModal(true)}
              className="px-2.5 py-1 rounded bg-[#06080C]/85 hover:bg-[#080A0E] border border-white/10 hover:border-[#A36E3C]/60 text-[10px] font-mono text-[#A1A5AB] hover:text-white backdrop-blur-sm transition-all flex items-center gap-1.5 cursor-pointer"
              title="Configure 45-second promo video"
            >
              <Upload className="w-3 h-3 text-[#A36E3C]" />
              <span className="hidden sm:inline">Swap Video</span>
            </button>
          </div>
        </div>

        {/* Centered Large Play Overlay Button when paused */}
        {!isPlaying && hasVideoLoaded && !hasError && (
          <button
            onClick={togglePlay}
            className="absolute inset-0 flex items-center justify-center z-25 bg-black/40 cursor-pointer group/play transition-colors"
            aria-label="Play Video"
          >
            <div className="w-14 h-14 rounded-full bg-[#C92A35] group-hover/play:scale-110 group-hover/play:bg-[#D93440] flex items-center justify-center text-white shadow-[0_0_30px_rgba(201,42,53,0.5)] transition-all">
              <Play className="w-6 h-6 fill-current ml-0.5" />
            </div>
          </button>
        )}

        {/* Bottom Control Bar */}
        <div className="absolute bottom-0 left-0 right-0 p-3 z-25 bg-gradient-to-t from-[#06080C] via-[#06080C]/80 to-transparent flex flex-col gap-2">
          
          {/* Progress / Scrub Bar */}
          <div className="relative w-full flex items-center group/scrub">
            <input
              type="range"
              min={0}
              max={100}
              step={0.1}
              value={progress}
              onChange={handleSeek}
              className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#C92A35] hover:h-1.5 transition-all"
              style={{
                background: `linear-gradient(to right, #C92A35 0%, #A36E3C ${progress}%, rgba(255,255,255,0.15) ${progress}%, rgba(255,255,255,0.15) 100%)`,
              }}
            />
          </div>

          {/* Control Buttons Row */}
          <div className="flex items-center justify-between text-xs font-mono text-white/90">
            <div className="flex items-center gap-3">
              <button
                onClick={togglePlay}
                className="hover:text-[#A36E3C] transition-colors cursor-pointer"
                title={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
              </button>

              <button
                onClick={toggleMute}
                className="hover:text-[#A36E3C] transition-colors cursor-pointer flex items-center gap-1"
                title={isMuted ? "Unmute audio" : "Mute audio"}
              >
                {isMuted ? (
                  <VolumeX className="w-4 h-4 text-[#C92A35]" />
                ) : (
                  <Volume2 className="w-4 h-4 text-emerald-400" />
                )}
                <span className="text-[10px] text-[#A1A5AB] hidden sm:inline">
                  {isMuted ? "MUTED" : "AUDIO ON"}
                </span>
              </button>

              {/* Time Elapsed / Duration */}
              <span className="text-[10px] font-mono text-[#A1A5AB]">
                <span className="text-white font-semibold">{formatTime(currentTime)}</span> / {formatTime(duration)}
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={() => {
                  if (videoRef.current) {
                    videoRef.current.currentTime = 0;
                    videoRef.current.play();
                    setIsPlaying(true);
                  }
                }}
                className="hover:text-[#A36E3C] text-[#A1A5AB] transition-colors cursor-pointer"
                title="Restart promo loop"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={toggleFullscreen}
                className="hover:text-[#A36E3C] text-[#A1A5AB] transition-colors cursor-pointer"
                title="Toggle Fullscreen"
              >
                <Maximize className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* Hidden File Input for instant local video loading */}
      <input
        ref={fileInputRef}
        type="file"
        accept="video/mp4,video/webm,video/quicktime"
        className="hidden"
        onChange={handleFileUpload}
      />

      {/* Video Setup & Upload Guidance Modal */}
      {showConfigModal && (
        <div className="absolute inset-0 bg-[#06080C]/96 backdrop-blur-md p-5 flex flex-col justify-between border border-[#A36E3C]/40 text-left z-35 animate-fadeIn rounded-xl">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-3">
              <div className="flex items-center gap-2">
                <Film className="w-4 h-4 text-[#C92A35]" />
                <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                  Display Your 45-Sec Promo Video
                </span>
              </div>
              <button
                onClick={() => setShowConfigModal(false)}
                className="text-[#A1A5AB] hover:text-white p-1 rounded hover:bg-white/5 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex gap-2 mb-3 border-b border-white/5 pb-2">
              <button
                onClick={() => setActiveTab("file")}
                className={`px-3 py-1 rounded text-xs font-mono font-bold uppercase cursor-pointer transition-colors ${
                  activeTab === "file"
                    ? "bg-[#C92A35] text-white"
                    : "bg-[#080A0E] text-[#A1A5AB] hover:text-white border border-white/10"
                }`}
              >
                Option 1: Choose File
              </button>
              <button
                onClick={() => setActiveTab("guide")}
                className={`px-3 py-1 rounded text-xs font-mono font-bold uppercase cursor-pointer transition-colors ${
                  activeTab === "guide"
                    ? "bg-[#A36E3C] text-white"
                    : "bg-[#080A0E] text-[#A1A5AB] hover:text-white border border-white/10"
                }`}
              >
                Option 2: Place in Code
              </button>
              <button
                onClick={() => setActiveTab("url")}
                className={`px-3 py-1 rounded text-xs font-mono font-bold uppercase cursor-pointer transition-colors ${
                  activeTab === "url"
                    ? "bg-[#A36E3C] text-white"
                    : "bg-[#080A0E] text-[#A1A5AB] hover:text-white border border-white/10"
                }`}
              >
                Option 3: Web URL
              </button>
            </div>

            {/* Tab 1: Instant Local File Select */}
            {activeTab === "file" && (
              <div className="space-y-3">
                <p className="text-xs text-[#D4D7DC] leading-relaxed">
                  Select your 45-second promo video directly from your computer. It will load and play immediately inside this box without needing any deploy step:
                </p>

                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="p-5 border-2 border-dashed border-[#A36E3C]/40 hover:border-[#A36E3C] bg-[#080A0E] rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors group"
                >
                  <Upload className="w-6 h-6 text-[#A36E3C] group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-mono font-bold text-white">
                    Click to select 45-sec .mp4 video
                  </span>
                  <span className="text-[10px] font-mono text-[#A1A5AB]">
                    Supports MP4, WebM, MOV files
                  </span>
                </div>
              </div>
            )}

            {/* Tab 2: Permanent Code Placement Guide */}
            {activeTab === "guide" && (
              <div className="space-y-2.5">
                <p className="text-xs text-[#D4D7DC] leading-relaxed">
                  To permanently embed your videos so they appear automatically for all visitors, save your files into the project's public folder with these names:
                </p>

                <div className="space-y-2 text-xs font-mono">
                  {[
                    { app: "ContentFlow PRO", file: "/videos/contentflow-pro.mp4" },
                    { app: "ContentHub CMS", file: "/videos/contenthub-cms.mp4" },
                    { app: "Fabrik", file: "/videos/fabrik.mp4" },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg bg-[#080A0E] border border-white/10 flex items-center justify-between"
                    >
                      <div className="flex flex-col">
                        <span className="text-[#DEAE78] font-bold text-[11px]">{item.app}:</span>
                        <code className="text-white text-[11px]">{item.file}</code>
                      </div>
                      <button
                        onClick={() => copyToClipboard(item.file)}
                        className="px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-[10px] text-[#A1A5AB] hover:text-white flex items-center gap-1 cursor-pointer"
                      >
                        {copiedFile === item.file ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400">Copied</span>
                          </>
                        ) : (
                          <span>Copy Path</span>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 3: Web URL */}
            {activeTab === "url" && (
              <form onSubmit={handleUrlSubmit} className="space-y-3">
                <p className="text-xs text-[#D4D7DC]">
                  Have a hosted video URL (AWS S3, Cloudinary, Vimeo/Direct CDN)? Paste the direct video link here:
                </p>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="https://domain.com/video-45s.mp4"
                    className="flex-1 bg-[#080A0E] border border-white/15 focus:border-[#A36E3C] rounded-lg px-3 py-2 text-xs text-white font-mono placeholder:text-[#A1A5AB]/50 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#A36E3C] hover:bg-[#DEAE78] hover:text-black text-white text-xs font-mono font-bold rounded-lg transition-colors cursor-pointer shrink-0"
                  >
                    Load URL
                  </button>
                </div>
              </form>
            )}

          </div>

          <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-[#A1A5AB]">
            <span>Active Target: <span className="text-white font-bold">{appName}</span></span>
            <button
              onClick={() => setShowConfigModal(false)}
              className="text-[#A36E3C] hover:text-white underline cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
