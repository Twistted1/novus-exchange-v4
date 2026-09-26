import { useState } from "react";
import { Search, ArrowUpRight, ExternalLink, Volume2, VolumeX, Play, SkipBack, SkipForward, ListVideo } from "lucide-react";

interface PlaylistItem {
  id: string;
  type: "latest" | "daily" | "episode";
  trackNum: number;
  label: string;
  episodeNumber: string;
  categoryTag: string;
  title: string;
  description: string;
  date: string;
  youtubeId: string;
  tags: string[];
}

const PLAYLIST_ITEMS: PlaylistItem[] = [
  {
    id: "ep-042",
    type: "latest",
    trackNum: 1,
    label: "LATEST EPISODE",
    episodeNumber: "EPISODE #042",
    categoryTag: "GEOPOLITICAL TELEMETRY BRIEF",
    title: "An Unreliable Ally: The New Global Landscape",
    description:
      "An investigative briefing on the shifting power balance between the United States and China, and the strategic dilemma facing middle-power allies across defense and high-tech supply chains.",
    date: "TUE APR 28, 2026 · 7:22 MIN BRIEFING",
    youtubeId: "w_fQ_Qn_j-0", // Real investigative geopolitical analysis
    tags: ["#Geopolitics", "#US-China", "#Intelligence"],
  },
  {
    id: "ep-041",
    type: "episode",
    trackNum: 2,
    label: "EPISODE #041",
    episodeNumber: "EPISODE #041",
    categoryTag: "TECH SOVEREIGNTY BRIEF",
    title: "The Silicon Chokepoint: Sovereign Chip Foundries & ASML",
    description:
      "Investigating critical semiconductor choke points, lithography restrictions, and the sovereign defense implications for advanced microchip manufacturing.",
    date: "SAT APR 25, 2026 · 9:45 MIN BRIEFING",
    youtubeId: "4T7HwL54_WA", // Technology & geopolitical chokepoints
    tags: ["#Semiconductors", "#Defense", "#SupplyChain"],
  },
  {
    id: "ep-040",
    type: "episode",
    trackNum: 3,
    label: "EPISODE #040",
    episodeNumber: "EPISODE #040",
    categoryTag: "FINANCIAL WARFARE",
    title: "De-Dollarization: Autonomous Bilateral Settlements & The BRICS Wire",
    description:
      "Tracking the fragmentation of international reserve currencies and the emergence of bilateral non-SWIFT financial clearance channels.",
    date: "WED APR 22, 2026 · 8:12 MIN BRIEFING",
    youtubeId: "OskxQ6X16pU", // Macroeconomics & financial realignment
    tags: ["#Economics", "#Currency", "#BRICS"],
  },
  {
    id: "daily-dispatch",
    type: "daily",
    trackNum: 4,
    label: "DAILY UPDATE",
    episodeNumber: "DAILY DISPATCH",
    categoryTag: "DAILY NEWS & WIRE INTEL",
    title: "Daily Intelligence Dispatch: Global Supply Chains & Sovereign Debt",
    description:
      "Daily situational briefing tracking sovereign debt realignments, microchip foundry choke points, and emergency bilateral currency swaps across the Southern Asia corridor.",
    date: "DAILY UPDATE · 4:15 MIN BRIEFING",
    youtubeId: "U1yMh3_EwLg", // Daily intelligence dispatch
    tags: ["#DailyUpdate", "#Economics", "#Surveillance"],
  },
];

export default function HeroSection() {
  const [activeTrackIndex, setActiveTrackIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [customPlaylistId, setCustomPlaylistId] = useState<string>(() => {
    try {
      return localStorage.getItem("novus_youtube_playlist_id") || "";
    } catch {
      return "";
    }
  });
  const [showPlaylistDrawer, setShowPlaylistDrawer] = useState(false);

  const handleUpdatePlaylistId = (newId: string) => {
    setCustomPlaylistId(newId);
    try {
      if (newId) {
        localStorage.setItem("novus_youtube_playlist_id", newId);
      } else {
        localStorage.removeItem("novus_youtube_playlist_id");
      }
    } catch {
      // ignore storage errors
    }
  };

  const currentContent = PLAYLIST_ITEMS[activeTrackIndex];

  // Jump straight to the newest video
  const handleSelectLatest = () => {
    setActiveTrackIndex(0);
  };

  // Jump directly to daily news updates
  const handleSelectDaily = () => {
    const dailyIndex = PLAYLIST_ITEMS.findIndex((item) => item.type === "daily");
    if (dailyIndex !== -1) {
      setActiveTrackIndex(dailyIndex);
    }
    const trendingEl = document.getElementById("trending");
    if (trendingEl) {
      trendingEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  };

  const handleNextTrack = () => {
    setActiveTrackIndex((prev) => (prev + 1) % PLAYLIST_ITEMS.length);
  };

  const handlePrevTrack = () => {
    setActiveTrackIndex((prev) => (prev - 1 + PLAYLIST_ITEMS.length) % PLAYLIST_ITEMS.length);
  };

  // Embed URL for continuous loop playlist: defaults to channel's full uploads playlist
  const embedUrl = `https://www.youtube-nocookie.com/embed/videoseries?list=UUQvwr9Ah8Jc1f0i7HitoURA&autoplay=1&mute=${
    isMuted ? 1 : 0
  }&loop=1&controls=1&modestbranding=1&rel=0&playsinline=1`;

  return (
    <section
      id="home"
      className="relative pt-20 pb-6 flex flex-col justify-between overflow-hidden bg-[#06080C]"
    >
      {/* Consistent, Deep Minimalist Near-Black Background Canvas */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(1px_1px_at_16px_16px,rgba(255,255,255,0.4)_1px,transparent_0)] bg-[size:32px_32px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,rgba(6,8,12,0.85)_85%,#06080C_100%)]" />
      </div>

      {/* Main Grid Content - Headline column (lg:col-span-5) & Shortened display screen (lg:col-span-7) */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full grid lg:grid-cols-12 gap-8 lg:gap-10 items-center my-auto pt-2">
        
        {/* Left Editorial Stream */}
        <div className="lg:col-span-5 flex flex-col space-y-5 text-left">
          
          {/* Active Platform & Brand Tagline kicker */}
          <div className="flex items-center gap-2.5">
            <span className="flex items-center space-x-1">
              <span className="w-1 h-3.5 bg-[#C92A35] rounded-xs" />
              <span className="w-1 h-3.5 bg-[#A36E3C] rounded-xs" />
              <span className="w-1 h-3.5 bg-[#A1A5AB] rounded-xs" />
            </span>
            <span className="text-[10px] font-mono tracking-[0.25em] font-bold text-[#A36E3C] uppercase">
              EDITORIAL MESH & GLOBAL SOVEREIGNTY
            </span>
          </div>

          {/* Unified Brand Headline with silver beveled text */}
          <div className="space-y-2">
            <h1 className="font-brand text-3xl sm:text-4xl font-bold text-white uppercase tracking-tight leading-[1.1] select-none">
              CUT THROUGH<br />
              <span className="silver-beveled-text">THE NOISE.</span>
            </h1>
            <p className="text-xs sm:text-sm font-mono text-[#A1A5AB] uppercase tracking-wider font-semibold">
              STAY INFORMED · CONNECTING PERSPECTIVES
            </p>
          </div>

          {/* Core Copy Paragraph */}
          <p className="text-[#A1A5AB] text-sm leading-relaxed max-w-md font-sans">
            Critical, clear-eyed investigations into the power networks and technological architectures shaping global sovereignty.{" "}
            <span className="text-white font-medium">Connecting divergent perspectives to challenge official orthodoxy.</span>
          </p>

          {/* Core Action Triggers */}
          <div className="flex flex-wrap items-center gap-3.5 pt-1">
            {/* Outline Button: EXPLORE ANALYSIS - Pure deep near-black tone matching minimalist dark aesthetic (no off-brand blue) */}
            <a
              href="#articles"
              className="px-5 py-3 bg-[#07090D] hover:bg-[#11141C] border border-white/15 hover:border-[#A36E3C] transition-all duration-200 text-xs font-bold font-mono tracking-widest text-white uppercase inline-flex items-center space-x-2 rounded-lg shadow-sm cursor-pointer"
            >
              <Search className="w-3.5 h-3.5 text-[#A36E3C]" />
              <span>EXPLORE ANALYSIS</span>
            </a>

            {/* Solid Pulse Red Button of Novus Exchange: Clickable to YouTube @NovusExchange */}
            <a
              href="https://www.youtube.com/@NovusExchange"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 bg-[#C92A35] hover:bg-[#b0232c] active:scale-[0.98] transition-all duration-200 text-xs font-bold font-mono tracking-widest text-white uppercase inline-flex items-center space-x-2.5 rounded-lg shadow-[0_0_25px_rgba(201,42,53,0.45)] group cursor-pointer"
              title="Visit @NovusExchange on YouTube"
            >
              <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              <span>@NOVUSEXCHANGE</span>
              <ExternalLink className="w-3 h-3 text-white/80 group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>
        </div>

        {/* Right Broadcast Display Screen - Shortened in height & Deep Near-Black Tone (no off-brand blue) */}
        <div className="lg:col-span-7 relative w-full">
          
          <div className="relative rounded-2xl border border-white/10 bg-[#07090D] p-4 sm:p-5 shadow-[0_15px_45px_rgba(0,0,0,0.95)] transition-all duration-300 hover:border-[#A36E3C]/40 group">
            
            {/* Card Content - Compact & refined */}
            <div className="relative z-10 flex flex-col space-y-3">
              
              {/* Top Row: III THE BRIEFING | MON · WED · SAT (matching reference image) */}
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    <span className="w-1 h-3.5 bg-[#C92A35] rounded-xs" />
                    <span className="w-1 h-3.5 bg-[#C92A35] rounded-xs" />
                    <span className="w-1 h-3.5 bg-[#C92A35] rounded-xs" />
                  </div>
                  <span className="text-[11px] font-mono tracking-[0.2em] font-extrabold text-[#C92A35] uppercase">
                    THE BRIEFING
                  </span>
                </div>
                <span className="text-[10px] font-mono font-bold text-[#A1A5AB] tracking-widest uppercase">
                  MON · WED · SAT
                </span>
              </div>

              {/* Sub-Header Row: Top Left 2 Buttons ("Latest Episode" & "Daily Update") + Broadcasting Status (see image) */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                {/* 2 Buttons on Top Left */}
                <div className="flex items-center gap-2">
                  {/* Button 1: Latest Episode - jumps straight to newest video on click */}
                  <button
                    onClick={handleSelectLatest}
                    className={`px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider rounded transition-all duration-200 cursor-pointer ${
                      activeTrackIndex === 0
                        ? "bg-[#C92A35] text-white shadow-[0_0_15px_rgba(201,42,53,0.55)] ring-1 ring-[#C92A35]"
                        : "bg-[#040507] text-[#A1A5AB] hover:text-white border border-white/10 hover:border-white/20"
                    }`}
                    title="Jump straight to the newest video on click"
                  >
                    LATEST EPISODE
                  </button>

                  {/* Button 2: Daily Update - takes users directly to daily news updates */}
                  <button
                    onClick={handleSelectDaily}
                    className={`px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider rounded transition-all duration-200 cursor-pointer ${
                      currentContent.type === "daily"
                        ? "bg-[#C92A35] text-white shadow-[0_0_15px_rgba(201,42,53,0.55)] ring-1 ring-[#C92A35]"
                        : "bg-[#040507] text-[#A1A5AB] hover:text-white border border-white/10 hover:border-white/20"
                    }`}
                    title="Take users directly to daily news updates"
                  >
                    DAILY UPDATE
                  </button>
                </div>

                {/* Right Status Indicator & Playlist Toggle: ● BROADCASTING */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowPlaylistDrawer(!showPlaylistDrawer)}
                    className="flex items-center gap-1.5 px-2 py-1 rounded bg-[#040507] border border-white/10 text-[9px] font-mono text-[#A1A5AB] hover:text-white hover:border-[#A36E3C] transition-colors cursor-pointer"
                    title="Toggle playlist queue"
                  >
                    <ListVideo className="w-3 h-3 text-[#A36E3C]" />
                    <span>PLAYLIST ({activeTrackIndex + 1}/{PLAYLIST_ITEMS.length})</span>
                  </button>

                  <div className="flex items-center space-x-1.5 bg-[#040507] border border-white/10 px-2.5 py-1 rounded">
                    <span className="w-2 h-2 bg-[#C92A35] rounded-full animate-ping" />
                    <span className="text-[9px] font-mono font-bold text-white tracking-widest uppercase">
                      BROADCASTING
                    </span>
                  </div>
                </div>
              </div>

              {/* Main Display Screen: Shortened in Height with Continuous Loop YouTube Playlist */}
              <div className="relative aspect-[2/1] w-full rounded-xl bg-[#040507] overflow-hidden border border-white/10 flex items-center justify-center group/player shadow-inner">
                
                {/* Embedded YouTube Playlist on Continuous Loop (Replaced fireplace with video playlist) */}
                <iframe
                  key={embedUrl}
                  className="absolute inset-0 w-full h-full object-cover z-10"
                  src={embedUrl}
                  title={currentContent.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />

                {/* Quick overlay controls: Audio Toggle & Skip Controls */}
                <div className="absolute z-20 top-2.5 right-2.5 flex items-center gap-1.5">
                  {/* Prev Track */}
                  <button
                    onClick={handlePrevTrack}
                    className="p-1.5 bg-[#040507]/90 hover:bg-[#07090D] border border-white/15 rounded text-white text-[10px] font-mono flex items-center transition-colors cursor-pointer"
                    title="Previous video in playlist"
                  >
                    <SkipBack className="w-3 h-3 text-[#A1A5AB] hover:text-white" />
                  </button>

                  {/* Next Track */}
                  <button
                    onClick={handleNextTrack}
                    className="p-1.5 bg-[#040507]/90 hover:bg-[#07090D] border border-white/15 rounded text-white text-[10px] font-mono flex items-center transition-colors cursor-pointer"
                    title="Next video in playlist"
                  >
                    <SkipForward className="w-3 h-3 text-[#A1A5AB] hover:text-white" />
                  </button>

                  {/* Mute/Unmute audio toggle */}
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="px-2 py-1 bg-[#040507]/90 hover:bg-[#07090D] border border-white/15 rounded text-white text-[10px] font-mono flex items-center gap-1 transition-colors cursor-pointer"
                    title={isMuted ? "Unmute Sound" : "Mute Sound"}
                  >
                    {isMuted ? <VolumeX className="w-3 h-3 text-[#C92A35]" /> : <Volume2 className="w-3 h-3 text-emerald-400" />}
                    <span className="text-[9px] uppercase tracking-wider">{isMuted ? "Unmute" : "Sound"}</span>
                  </button>

                  {/* Direct YouTube channel link */}
                  <a
                    href="https://www.youtube.com/@NovusExchange"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2 py-1 bg-[#C92A35] hover:bg-[#b0232c] text-white rounded text-[10px] font-mono flex items-center gap-1 transition-colors cursor-pointer shadow-sm"
                    title="Open on YouTube"
                  >
                    <Play className="w-3 h-3 fill-white" />
                    <span className="text-[9px] font-bold uppercase tracking-wider">YouTube</span>
                  </a>
                </div>

              </div>

              {/* Playlist Drawer (When toggled) */}
              {showPlaylistDrawer && (
                <div className="bg-[#040507] border border-white/10 rounded-lg p-2.5 animate-fadeIn space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-mono text-[#A1A5AB] pb-1 border-b border-white/5">
                    <span className="text-white font-bold flex items-center gap-1">
                      <ListVideo className="w-3 h-3 text-[#C92A35]" />
                      VIDEO PLAYLIST QUEUE ({PLAYLIST_ITEMS.length} VIDEOS)
                    </span>
                    <button
                      onClick={() => setShowPlaylistDrawer(false)}
                      className="text-[#A1A5AB] hover:text-white cursor-pointer"
                    >
                      [Close]
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {PLAYLIST_ITEMS.map((item, idx) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveTrackIndex(idx);
                          setShowPlaylistDrawer(false);
                        }}
                        className={`text-left p-2 rounded text-[11px] font-mono transition-all flex items-start justify-between cursor-pointer border ${
                          activeTrackIndex === idx
                            ? "border-[#C92A35] bg-[#C92A35]/15 text-white"
                            : "border-white/5 bg-[#07090D] text-[#A1A5AB] hover:text-white hover:border-white/20"
                        }`}
                      >
                        <div className="truncate pr-2">
                          <span className="text-[9px] text-[#A36E3C] block font-bold">{item.episodeNumber}</span>
                          <span className="truncate block font-sans font-medium text-xs text-white">{item.title}</span>
                        </div>
                        <span className="text-[9px] text-[#A1A5AB] shrink-0 pt-0.5">{item.date.split("·")[1]?.trim()}</span>
                      </button>
                    ))}
                  </div>

                  {/* Custom YouTube Playlist ID input for seamless custom channel playlists */}
                  <div className="pt-1 flex items-center gap-2 border-t border-white/5">
                    <span className="text-[9px] font-mono text-[#A1A5AB] shrink-0">Custom Playlist ID:</span>
                    <input
                      type="text"
                      placeholder="e.g. PL... (optional YouTube playlist ID)"
                      value={customPlaylistId}
                      onChange={(e) => handleUpdatePlaylistId(e.target.value.trim())}
                      className="w-full bg-[#07090D] text-white text-[10px] font-mono px-2 py-1 rounded border border-white/10 focus:border-[#A36E3C] outline-none placeholder:text-white/20"
                    />
                    {customPlaylistId && (
                      <button
                        onClick={() => handleUpdatePlaylistId("")}
                        className="text-[9px] font-mono text-[#C92A35] hover:text-white shrink-0 cursor-pointer"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Headline Title & Metadata (Clean, compact typography matching reference image) */}
              <div className="flex flex-col space-y-1.5 text-left pt-0.5">
                <span className="text-[10px] text-[#C92A35] font-mono tracking-wider font-semibold uppercase">
                  {currentContent.date}
                </span>

                <h3 className="font-editorial text-xl sm:text-2xl font-bold text-white leading-tight">
                  {currentContent.title}
                </h3>

                <p className="text-[#A1A5AB] text-xs leading-relaxed font-sans line-clamp-2">
                  {currentContent.description}
                </p>
              </div>

              {/* Clean Tag Metadata & Action Footer */}
              <div className="flex items-center justify-between border-t border-white/5 pt-2.5 mt-0.5">
                {/* Hashtag metadata */}
                <div className="flex flex-wrap items-center gap-2">
                  {currentContent.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] font-mono text-[#A1A5AB] bg-[#040507] px-2 py-0.5 rounded border border-white/10"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* VIEW ANALYSIS action */}
                <a
                  href="#articles"
                  className="flex items-center text-[10px] font-mono font-bold text-[#C92A35] hover:text-white uppercase tracking-widest gap-1 transition-colors"
                >
                  <span>VIEW ANALYSIS</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>

            </div>
          </div>
        </div>

      </div>

      {/* Mouse scroll status */}
      <div className="mx-auto text-center flex flex-col items-center select-none pt-2">
        <span className="text-[10px] font-mono tracking-[0.25em] text-[#A1A5AB]/70 uppercase">
          SCROLL TO EXPLORE
        </span>
        <div className="w-[14px] h-[24px] border border-[#A1A5AB]/30 rounded-full flex justify-center py-1 mt-1">
          <div className="w-[2px] h-[6px] bg-[#C92A35] rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
}
