import { Article } from "../types";

export interface SpeechPlayerState {
  isPlaying: boolean;
  isPaused: boolean;
  isLoading: boolean;
  currentArticle: Article | null;
  currentText: string;
  progress: number; // 0 to 100
  elapsedSeconds: number;
  totalDurationSeconds: number;
  playbackRate: number;
  voiceId: string;
  voiceName: string;
  errorMessage: string | null;
}

export interface NarratorVoice {
  id: string;
  name: string;
  description: string;
  accent: string;
}

export const AVAILABLE_VOICES: NarratorVoice[] = [
  {
    id: "Christopher",
    name: "Christopher · Literary Baritone",
    description: "Deep, authoritative, measured literary narrator (Gatsby timbre)",
    accent: "US English"
  },
  {
    id: "Brian",
    name: "Brian · Documentary Authority",
    description: "Deep investigative broadcast timbre, deliberate pacing",
    accent: "US English"
  },
  {
    id: "Guy",
    name: "Guy · Warm Storyteller",
    description: "Rich, engaging, broadcast journalistic cadence",
    accent: "US English"
  },
  {
    id: "Andrew",
    name: "Andrew · Classical Scholar",
    description: "Refined, articulate cadence for long-form dossiers",
    accent: "US Multilingual"
  }
];

type StateListener = (state: SpeechPlayerState) => void;

class SpeechServiceManager {
  private state: SpeechPlayerState = {
    isPlaying: false,
    isPaused: false,
    isLoading: false,
    currentArticle: null,
    currentText: "",
    progress: 0,
    elapsedSeconds: 0,
    totalDurationSeconds: 0,
    playbackRate: 1.0,
    voiceId: "Christopher",
    voiceName: "Christopher · Literary Baritone",
    errorMessage: null
  };

  private listeners: Set<StateListener> = new Set();
  private audioElement: HTMLAudioElement | null = null;
  private currentAudioUrl: string | null = null;
  private currentSessionId: number = 0;

  // Browser (speechSynthesis) fallback state: free, works on any static host
  private mode: "audio" | "browser" = "audio";
  private synthChunks: string[] = [];
  private synthIndex = 0;
  private synthToken = 0;
  private synthTotalChars = 0;
  private static readonly CHARS_PER_SECOND = 15;

  public subscribe(listener: StateListener): () => void {
    this.listeners.add(listener);
    listener(this.state);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((listener) => listener({ ...this.state }));
  }

  public getState(): SpeechPlayerState {
    return { ...this.state };
  }

  /**
   * Prepares clean spoken text from article markdown (stripping formatting symbols & sources)
   */
  public cleanArticleText(article: Article): string {
    const title = article.title;
    const author = article.author?.name || "Novus Exchange Editorial";
    const date = article.date;
    const intro = `Investigation Dossier. ${title}. Authored by ${author}. Published on ${date}.`;

    let content = (article.content || article.excerpt || "")
      .split(/###\s*Sources/i)[0] // exclude bibliography/citations
      .replace(/^#{1,6}\s+/gm, "") // remove heading hashes
      .replace(/!\[[^\]]*\]\([^)]*\)/g, "") // drop illustrated-feature figures (not read aloud)
      .replace(/\(https?:\/\/[^)\s]+\)/g, "") // drop bare source URLs in parentheses
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // replace markdown links with text
      .replace(/[*_~`]/g, "") // remove formatting symbols
      .replace(/---\s*/g, " ") // remove horizontal rules
      .replace(/\n{2,}/g, ". ") // replace multiple newlines with period pause
      .replace(/\s+/g, " ") // normalize spacing
      .trim();

    return `${intro} ${article.excerpt}. ${content}`;
  }

  /**
   * Detaches all media listeners and stops the audio element safely
   * without triggering spurious error events.
   */
  private cleanupAudio(): void {
    if (this.audioElement) {
      const audio = this.audioElement;
      audio.oncanplay = null;
      audio.onloadedmetadata = null;
      audio.ontimeupdate = null;
      audio.onended = null;
      audio.onerror = null;
      audio.onplay = null;
      audio.onpause = null;

      try {
        audio.pause();
        audio.removeAttribute("src");
        audio.load();
      } catch {}
      this.audioElement = null;
    }

    if (this.currentAudioUrl) {
      if (this.currentAudioUrl.startsWith("blob:")) {
        try {
          URL.revokeObjectURL(this.currentAudioUrl);
        } catch {}
      }
      this.currentAudioUrl = null;
    }
  }

  /**
   * Reads an article aloud using studio-grade neural voice.
   * Can resume from a specified time when changing voices.
   */
  public async playArticle(
    article: Article,
    voiceId?: string,
    startTimeSeconds: number = 0,
    autoPlay: boolean = true
  ): Promise<void> {
    const sessionId = ++this.currentSessionId;
    this.cleanupAudio();
    this.stopBrowserVoice();

    const selectedVoiceId = voiceId || this.state.voiceId || "Christopher";
    const voiceObj = AVAILABLE_VOICES.find((v) => v.id === selectedVoiceId) || AVAILABLE_VOICES[0];
    const fullText = this.cleanArticleText(article);

    this.state = {
      ...this.state,
      isPlaying: true,
      isPaused: !autoPlay,
      isLoading: true,
      currentArticle: article,
      currentText: fullText,
      progress: this.state.totalDurationSeconds > 0 ? Math.round((startTimeSeconds / this.state.totalDurationSeconds) * 100) : 0,
      elapsedSeconds: startTimeSeconds,
      voiceId: voiceObj.id,
      voiceName: voiceObj.name,
      errorMessage: null
    };
    this.notify();

    try {
      const response = await fetch("/api/speech", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          articleId: article.id,
          text: fullText,
          voice: selectedVoiceId
        })
      });

      if (sessionId !== this.currentSessionId) return;

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const data = await response.json();
      if (sessionId !== this.currentSessionId) return;

      if (!data.success || (!data.audioUrl && !data.audio)) {
        throw new Error(data.message || "Failed to generate neural narration audio");
      }

      if (data.audioUrl) {
        this.playAudioStreamUrl(data.audioUrl, sessionId, startTimeSeconds, autoPlay);
      } else if (data.audio) {
        this.playAudioBlob(data.audio, sessionId, startTimeSeconds, autoPlay);
      }
    } catch (err: any) {
      if (sessionId !== this.currentSessionId) return;
      console.error("[SpeechService] Neural playback error:", err);
      if (this.startBrowserVoice(fullText, sessionId, startTimeSeconds, autoPlay)) return;
      this.state = {
        ...this.state,
        isLoading: false,
        isPlaying: false,
        errorMessage: "Listen is unavailable: no neural voice server and this browser has no built-in voice."
      };
      this.notify();
    }
  }

  /**
   * Switches voice on the active article seamlessly,
   * retaining current playback position and state.
   */
  public async setVoice(voiceId: string): Promise<void> {
    const voiceObj = AVAILABLE_VOICES.find((v) => v.id === voiceId) || AVAILABLE_VOICES[0];
    this.state = {
      ...this.state,
      voiceId: voiceObj.id,
      voiceName: voiceObj.name,
      errorMessage: null
    };
    this.notify();

    // If an article is currently loaded in the player, switch voice seamlessly
    if (this.state.currentArticle) {
      const activeArticle = this.state.currentArticle;
      const currentSeconds = this.state.elapsedSeconds;
      const shouldPlay = !this.state.isPaused;
      await this.playArticle(activeArticle, voiceObj.id, currentSeconds, shouldPlay);
    }
  }

  private playAudioStreamUrl(
    streamUrl: string,
    sessionId: number,
    startSeconds: number = 0,
    autoPlay: boolean = true
  ) {
    try {
      this.cleanupAudio();
      this.currentAudioUrl = streamUrl;

      const audio = new Audio(streamUrl);
      this.audioElement = audio;
      audio.playbackRate = this.state.playbackRate;

      let hasRestoredTime = false;
      const restoreTime = () => {
        if (!hasRestoredTime && startSeconds > 0 && audio.duration && !isNaN(audio.duration)) {
          if (startSeconds < audio.duration) {
            audio.currentTime = startSeconds;
          }
          hasRestoredTime = true;
        }
      };

      audio.onloadedmetadata = () => {
        if (sessionId !== this.currentSessionId || this.audioElement !== audio) return;
        const dur = Math.round(audio.duration) || 0;
        restoreTime();
        this.state = {
          ...this.state,
          isLoading: false,
          totalDurationSeconds: dur
        };
        this.notify();

        if (autoPlay) {
          audio.play().catch((err) => {
            console.warn("[SpeechService] Play attempt interrupted or blocked:", err);
          });
        }
      };

      audio.oncanplay = () => {
        if (sessionId !== this.currentSessionId || this.audioElement !== audio) return;
        restoreTime();
        if (this.state.isLoading) {
          const dur = Math.round(audio.duration) || 0;
          this.state = {
            ...this.state,
            isLoading: false,
            totalDurationSeconds: dur
          };
          this.notify();
        }
      };

      audio.ontimeupdate = () => {
        if (sessionId !== this.currentSessionId || this.audioElement !== audio || !audio.duration) return;
        const elapsed = Math.round(audio.currentTime);
        const progress = Math.min(100, Math.round((audio.currentTime / audio.duration) * 100));
        this.state = {
          ...this.state,
          elapsedSeconds: elapsed,
          progress
        };
        this.notify();
      };

      audio.onended = () => {
        if (sessionId !== this.currentSessionId || this.audioElement !== audio) return;
        this.stop();
      };

      audio.onerror = () => {
        if (sessionId !== this.currentSessionId || this.audioElement !== audio) return;
        console.error("[SpeechService] Audio stream error on element");
        this.state = {
          ...this.state,
          isLoading: false,
          isPlaying: false,
          errorMessage: "Audio playback stream encountered an error."
        };
        this.notify();
      };

      // Trigger initial load
      audio.load();
    } catch (e: any) {
      if (sessionId !== this.currentSessionId) return;
      console.error("[SpeechService] Stream setup failed:", e);
      this.state = {
        ...this.state,
        isLoading: false,
        isPlaying: false,
        errorMessage: "Failed to initialize audio stream."
      };
      this.notify();
    }
  }

  private playAudioBlob(
    base64Audio: string,
    sessionId: number,
    startSeconds: number = 0,
    autoPlay: boolean = true
  ) {
    try {
      this.cleanupAudio();

      const byteCharacters = atob(base64Audio);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "audio/mpeg" });
      const blobUrl = URL.createObjectURL(blob);
      this.currentAudioUrl = blobUrl;

      const audio = new Audio(blobUrl);
      this.audioElement = audio;
      audio.playbackRate = this.state.playbackRate;

      let hasRestoredTime = false;
      const restoreTime = () => {
        if (!hasRestoredTime && startSeconds > 0 && audio.duration && !isNaN(audio.duration)) {
          if (startSeconds < audio.duration) {
            audio.currentTime = startSeconds;
          }
          hasRestoredTime = true;
        }
      };

      audio.onloadedmetadata = () => {
        if (sessionId !== this.currentSessionId || this.audioElement !== audio) return;
        const dur = Math.round(audio.duration) || 0;
        restoreTime();
        this.state = {
          ...this.state,
          isLoading: false,
          totalDurationSeconds: dur
        };
        this.notify();

        if (autoPlay) {
          audio.play().catch((err) => {
            console.warn("[SpeechService] Autoplay blocked or interrupted:", err);
          });
        }
      };

      audio.oncanplay = () => {
        if (sessionId !== this.currentSessionId || this.audioElement !== audio) return;
        restoreTime();
        if (this.state.isLoading) {
          this.state = { ...this.state, isLoading: false };
          this.notify();
        }
      };

      audio.ontimeupdate = () => {
        if (sessionId !== this.currentSessionId || this.audioElement !== audio || !audio.duration) return;
        const elapsed = Math.round(audio.currentTime);
        const progress = Math.min(100, Math.round((audio.currentTime / audio.duration) * 100));
        this.state = {
          ...this.state,
          elapsedSeconds: elapsed,
          progress
        };
        this.notify();
      };

      audio.onended = () => {
        if (sessionId !== this.currentSessionId || this.audioElement !== audio) return;
        this.stop();
      };

      audio.onerror = () => {
        if (sessionId !== this.currentSessionId || this.audioElement !== audio) return;
        this.state = {
          ...this.state,
          isLoading: false,
          isPlaying: false,
          errorMessage: "Audio playback encountered an error."
        };
        this.notify();
      };

      audio.load();
    } catch (e: any) {
      if (sessionId !== this.currentSessionId) return;
      console.error("[SpeechService] Audio decoding failed:", e);
      this.state = {
        ...this.state,
        isLoading: false,
        isPlaying: false,
        errorMessage: "Failed to decode neural audio."
      };
      this.notify();
    }
  }

  // ---------- Browser voice fallback (speechSynthesis) ----------
  private chunkText(text: string): string[] {
    const sentences = text.split(/(?<=[.!?])\s+/);
    const chunks: string[] = [];
    let cur = "";
    for (const s of sentences) {
      if ((cur + " " + s).length > 220 && cur) {
        chunks.push(cur.trim());
        cur = s;
      } else {
        cur = cur ? cur + " " + s : s;
      }
    }
    if (cur.trim()) chunks.push(cur.trim());
    return chunks;
  }

  private pickBrowserVoice(): SpeechSynthesisVoice | null {
    try {
      const voices = window.speechSynthesis.getVoices().filter((v) => v.lang.toLowerCase().startsWith("en"));
      if (!voices.length) return null;
      const rank = (v: SpeechSynthesisVoice) =>
        (/natural|neural|online/i.test(v.name) ? 3 : 0) + (/google|microsoft|samantha|daniel|alex/i.test(v.name) ? 1 : 0);
      return voices.sort((a, b) => rank(b) - rank(a))[0];
    } catch {
      return null;
    }
  }

  private startBrowserVoice(fullText: string, sessionId: number, startSeconds: number, autoPlay: boolean): boolean {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return false;
    this.mode = "browser";
    this.synthChunks = this.chunkText(fullText);
    if (!this.synthChunks.length) return false;
    this.synthTotalChars = this.synthChunks.reduce((n, c) => n + c.length, 0);
    const startChars = Math.max(0, startSeconds) * SpeechServiceManager.CHARS_PER_SECOND * this.state.playbackRate;
    let idx = 0;
    let acc = 0;
    while (idx < this.synthChunks.length - 1 && acc + this.synthChunks[idx].length < startChars) {
      acc += this.synthChunks[idx].length;
      idx++;
    }
    this.state = {
      ...this.state,
      isLoading: false,
      isPlaying: true,
      isPaused: !autoPlay,
      voiceName: "Browser voice (this device)",
      totalDurationSeconds: Math.round(this.synthTotalChars / (SpeechServiceManager.CHARS_PER_SECOND * this.state.playbackRate)),
      errorMessage: null
    };
    this.notify();
    if (sessionId !== this.currentSessionId) return true;
    this.speakFrom(idx, autoPlay);
    return true;
  }

  private speakFrom(index: number, autoPlay: boolean = true): void {
    const token = ++this.synthToken;
    try {
      window.speechSynthesis.cancel();
    } catch {}
    this.synthIndex = index;
    if (index >= this.synthChunks.length) {
      this.stop();
      return;
    }
    const done = this.synthChunks.slice(0, index).reduce((n, c) => n + c.length, 0);
    const rate = this.state.playbackRate;
    this.state = {
      ...this.state,
      elapsedSeconds: Math.round(done / (SpeechServiceManager.CHARS_PER_SECOND * rate)),
      progress: Math.min(100, Math.round((done / Math.max(1, this.synthTotalChars)) * 100))
    };
    this.notify();
    const u = new SpeechSynthesisUtterance(this.synthChunks[index]);
    const voice = this.pickBrowserVoice();
    if (voice) u.voice = voice;
    u.lang = voice?.lang || "en-GB";
    u.rate = rate;
    u.onend = () => {
      if (token !== this.synthToken || this.mode !== "browser") return;
      this.speakFrom(index + 1);
    };
    u.onerror = (e: SpeechSynthesisErrorEvent) => {
      if (token !== this.synthToken || this.mode !== "browser") return;
      if (e.error === "canceled" || e.error === "interrupted") return;
      this.state = { ...this.state, isPlaying: false, isPaused: false, errorMessage: "The browser voice stopped: " + e.error };
      this.notify();
    };
    window.speechSynthesis.speak(u);
    if (!autoPlay) window.speechSynthesis.pause();
  }

  private stopBrowserVoice(): void {
    this.synthToken++;
    if (this.mode === "browser") {
      try {
        window.speechSynthesis.cancel();
      } catch {}
    }
    this.mode = "audio";
    this.synthChunks = [];
    this.synthIndex = 0;
  }

  public pause(): void {
    if (!this.state.isPlaying) return;
    if (this.mode === "browser") {
      try { window.speechSynthesis.pause(); } catch {}
    } else if (this.audioElement) {
      this.audioElement.pause();
    }
    this.state = { ...this.state, isPaused: true };
    this.notify();
  }

  public resume(): void {
    if (!this.state.isPlaying || !this.state.isPaused) return;
    if (this.mode === "browser") {
      try { window.speechSynthesis.resume(); } catch {}
    } else if (this.audioElement) {
      this.audioElement.play().catch(() => {});
    }
    this.state = { ...this.state, isPaused: false };
    this.notify();
  }

  public togglePlayPause(): void {
    if (this.state.isPaused) {
      this.resume();
    } else if (this.state.isPlaying) {
      this.pause();
    }
  }

  public seek(progressPercent: number): void {
    if (this.mode === "browser") {
      const target = Math.floor((progressPercent / 100) * this.synthChunks.length);
      this.speakFrom(Math.max(0, Math.min(this.synthChunks.length - 1, target)), !this.state.isPaused);
      return;
    }
    if (this.audioElement && this.audioElement.duration) {
      const targetTime = (progressPercent / 100) * this.audioElement.duration;
      this.audioElement.currentTime = targetTime;
      this.state = {
        ...this.state,
        elapsedSeconds: Math.round(targetTime),
        progress: progressPercent
      };
      this.notify();
    }
  }

  public setPlaybackRate(rate: number): void {
    this.state = { ...this.state, playbackRate: rate };
    if (this.mode === "browser") {
      this.notify();
      this.speakFrom(this.synthIndex, !this.state.isPaused);
      return;
    }
    if (this.audioElement) {
      this.audioElement.playbackRate = rate;
    }
    this.notify();
  }

  public skipSeconds(seconds: number): void {
    if (this.mode === "browser") {
      let idx = this.synthIndex;
      let remaining = Math.abs(seconds) * SpeechServiceManager.CHARS_PER_SECOND * this.state.playbackRate;
      while (remaining > 0 && idx >= 0 && idx < this.synthChunks.length) {
        remaining -= this.synthChunks[Math.max(0, Math.min(idx, this.synthChunks.length - 1))].length;
        idx += seconds > 0 ? 1 : -1;
      }
      this.speakFrom(Math.max(0, Math.min(this.synthChunks.length - 1, idx)), !this.state.isPaused);
      return;
    }
    if (this.audioElement) {
      const cur = this.audioElement.currentTime;
      const dur = this.audioElement.duration || 0;
      this.audioElement.currentTime = Math.max(0, Math.min(dur, cur + seconds));
    }
  }

  public stop(): void {
    this.currentSessionId++;
    this.cleanupAudio();
    this.stopBrowserVoice();

    this.state = {
      ...this.state,
      isPlaying: false,
      isPaused: false,
      isLoading: false,
      currentArticle: null,
      currentText: "",
      progress: 0,
      elapsedSeconds: 0,
      totalDurationSeconds: 0,
      errorMessage: null
    };
    this.notify();
  }
}

export const SpeechService = new SpeechServiceManager();
