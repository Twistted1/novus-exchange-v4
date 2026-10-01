import { useState, useEffect, useRef } from "react";
import { SpeechService, SpeechPlayerState, AVAILABLE_VOICES } from "../services/speechService";
import { 
  Play, 
  Pause, 
  Square, 
  RotateCcw, 
  RotateCw, 
  Sparkles, 
  X,
  Volume2,
  ChevronDown,
  Activity,
  AlertCircle
} from "lucide-react";

export default function ArticleAudioPlayer() {
  const [state, setState] = useState<SpeechPlayerState>(SpeechService.getState());
  const [isSpeedOpen, setIsSpeedOpen] = useState(false);
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribe = SpeechService.subscribe((updated) => {
      setState(updated);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (playerRef.current && !playerRef.current.contains(e.target as Node)) {
        setIsVoiceOpen(false);
        setIsSpeedOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  if (!state.isPlaying && !state.isPaused && !state.isLoading && !state.errorMessage) {
    return null;
  }

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins}:${remaining < 10 ? "0" : ""}${remaining}`;
  };

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const percent = Math.max(0, Math.min(100, (clickX / width) * 100));
    SpeechService.seek(percent);
  };

  const speeds = [0.8, 1.0, 1.25, 1.5];

  return (
    <div ref={playerRef} className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-[480px] z-50 animate-slideUp">
      <div className="rounded-2xl border border-[#A36E3C]/50 bg-[#07090D]/95 backdrop-blur-xl p-3.5 sm:p-4 shadow-[0_12px_40px_rgba(0,0,0,0.85),0_0_24px_rgba(163,110,60,0.25)] text-left flex flex-col gap-2.5">
        
        {/* Top Info Row */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-[#A36E3C]/20 border border-[#A36E3C]/40 flex items-center justify-center text-[#DEAE78] shrink-0">
              {state.isPlaying && !state.isPaused ? (
                <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
              ) : (
                <Volume2 className="w-4 h-4 text-[#DEAE78]" />
              )}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#A36E3C]/20 text-[#DEAE78] uppercase font-bold">
                  {state.currentArticle?.category || "Investigation"}
                </span>
                
                {/* Voice Badge / Selector Trigger */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setIsVoiceOpen(!isVoiceOpen);
                      setIsSpeedOpen(false);
                    }}
                    className="text-[9px] font-mono text-emerald-400 hover:text-emerald-300 flex items-center gap-1 bg-emerald-500/10 hover:bg-emerald-500/20 px-1.5 py-0.5 rounded border border-emerald-500/25 transition-colors cursor-pointer"
                  >
                    <Sparkles className="w-2.5 h-2.5" />
                    <span className="truncate max-w-[130px] font-semibold">{state.voiceName}</span>
                    <ChevronDown className="w-2.5 h-2.5 opacity-70" />
                  </button>

                  {/* Voice Selector Popover */}
                  {isVoiceOpen && (
                    <div className="absolute left-0 bottom-full mb-2 w-64 bg-[#0a0d14] border border-[#A36E3C]/40 rounded-xl shadow-2xl p-1.5 flex flex-col gap-1 z-50">
                      <div className="text-[10px] font-mono uppercase tracking-wider text-[#A1A5AB] px-2 py-1 border-b border-white/10 font-bold">
                        Select Neural Narrator
                      </div>
                      {AVAILABLE_VOICES.map((v) => (
                        <button
                          key={v.id}
                          onClick={() => {
                            SpeechService.setVoice(v.id);
                            setIsVoiceOpen(false);
                          }}
                          className={`text-left p-2 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                            state.voiceId === v.id
                              ? "bg-[#A36E3C]/30 text-white border border-[#A36E3C]/50"
                              : "text-[#A1A5AB] hover:text-white hover:bg-white/5"
                          }`}
                        >
                          <div className="font-bold text-white flex items-center justify-between">
                            <span>{v.name}</span>
                            <span className="text-[9px] text-[#DEAE78] font-normal">{v.accent}</span>
                          </div>
                          <div className="text-[10px] text-[#A1A5AB] mt-0.5 leading-snug">
                            {v.description}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <h5 className="text-xs font-brand font-bold text-white truncate max-w-[260px] sm:max-w-[320px] mt-0.5">
                {state.currentArticle?.title || "Investigation Audio Dossier"}
              </h5>
            </div>
          </div>

          <button
            onClick={() => SpeechService.stop()}
            className="p-1.5 rounded-lg text-[#A1A5AB] hover:text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0"
            title="Close Audio Narration"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Error notification if any */}
        {state.errorMessage && (
          <div className="px-2.5 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-[11px] font-mono flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 truncate">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{state.errorMessage}</span>
            </div>
            <button
              onClick={() => {
                if (state.currentArticle) {
                  SpeechService.playArticle(state.currentArticle, state.voiceId);
                }
              }}
              className="text-[10px] font-bold underline hover:text-white shrink-0 cursor-pointer"
            >
              Retry
            </button>
          </div>
        )}

        {/* Scrub / Progress Bar */}
        <div className="space-y-1">
          <div 
            ref={progressBarRef}
            onClick={handleProgressBarClick}
            className="w-full bg-white/10 h-2 rounded-full overflow-hidden relative cursor-pointer group"
          >
            <div 
              className="h-full bg-gradient-to-r from-[#A36E3C] to-[#DEAE78] transition-all duration-150 rounded-full group-hover:brightness-125"
              style={{ width: `${state.progress}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] font-mono text-[#A1A5AB]">
            <span>{formatTime(state.elapsedSeconds)}</span>
            <span>{state.isLoading ? "Synthesizing studio audio..." : formatTime(state.totalDurationSeconds)}</span>
          </div>
        </div>

        {/* Controls Row */}
        <div className="flex items-center justify-between pt-1">
          {/* Skip Back */}
          <button
            onClick={() => SpeechService.skipSeconds(-15)}
            className="p-1.5 rounded-md hover:bg-white/5 text-[#A1A5AB] hover:text-white transition-colors cursor-pointer text-xs font-mono flex items-center gap-0.5"
            title="Rewind 15 seconds"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="text-[9px]">15s</span>
          </button>

          {/* Center Play/Pause & Stop */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => SpeechService.togglePlayPause()}
              disabled={state.isLoading}
              className="w-10 h-10 rounded-full bg-gradient-to-br from-[#A36E3C] to-[#82542A] hover:brightness-110 text-white flex items-center justify-center transition-transform active:scale-95 shadow-[0_0_15px_rgba(163,110,60,0.4)] cursor-pointer"
              title={state.isPaused ? "Play" : "Pause"}
            >
              {state.isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : state.isPaused ? (
                <Play className="w-4 h-4 ml-0.5 fill-current" />
              ) : (
                <Pause className="w-4 h-4 fill-current" />
              )}
            </button>

            <button
              onClick={() => SpeechService.stop()}
              className="p-1.5 rounded-md text-[#A1A5AB] hover:text-rose-400 hover:bg-white/5 transition-colors cursor-pointer"
              title="Stop Narration"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
            </button>
          </div>

          {/* Skip Forward */}
          <button
            onClick={() => SpeechService.skipSeconds(15)}
            className="p-1.5 rounded-md hover:bg-white/5 text-[#A1A5AB] hover:text-white transition-colors cursor-pointer text-xs font-mono flex items-center gap-0.5"
            title="Forward 15 seconds"
          >
            <span className="text-[9px]">15s</span>
            <RotateCw className="w-3.5 h-3.5" />
          </button>

          {/* Speed Selector */}
          <div className="relative">
            <button
              onClick={() => {
                setIsSpeedOpen(!isSpeedOpen);
                setIsVoiceOpen(false);
              }}
              className="px-2 py-1 rounded border border-white/10 bg-white/5 hover:bg-white/10 text-[10px] font-mono font-bold text-[#DEAE78] transition-colors cursor-pointer flex items-center gap-1"
            >
              <span>{state.playbackRate}x</span>
              <ChevronDown className="w-2.5 h-2.5 opacity-60" />
            </button>
            {isSpeedOpen && (
              <div className="absolute right-0 bottom-full mb-1.5 bg-[#0a0d14] border border-white/15 rounded-lg shadow-xl p-1 flex flex-col gap-0.5 z-50">
                {speeds.map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      SpeechService.setPlaybackRate(s);
                      setIsSpeedOpen(false);
                    }}
                    className={`px-3 py-1 text-[10px] font-mono text-left rounded cursor-pointer ${
                      state.playbackRate === s
                        ? "bg-[#A36E3C] text-white"
                        : "text-[#A1A5AB] hover:text-white hover:bg-white/10"
                    }`}
                  >
                    {s}x
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
