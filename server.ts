import express, { Request, Response } from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { EdgeTTS } from "node-edge-tts";
import { ARTICLES_DATA } from "./data/articlesData.ts";
import { Article } from "./types.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = Number(process.env.PORT) || 3000;
const DATA_FILE = path.resolve(__dirname, "data", "persisted_articles.json");
const AUDIO_CACHE_DIR = path.resolve(__dirname, "data", "audio_cache");

if (!fs.existsSync(AUDIO_CACHE_DIR)) {
  fs.mkdirSync(AUDIO_CACHE_DIR, { recursive: true });
}

// Helper: Wrap raw 16-bit PCM buffer into standard playable WAV format
function pcmToWav(pcmBuffer: Buffer, sampleRate: number = 24000, numChannels: number = 1, bitDepth: number = 16): Buffer {
  const header = Buffer.alloc(44);
  const byteRate = sampleRate * numChannels * (bitDepth / 8);
  const blockAlign = numChannels * (bitDepth / 8);
  const dataSize = pcmBuffer.length;

  header.write("RIFF", 0);
  header.writeUInt32LE(36 + dataSize, 4);
  header.write("WAVE", 8);
  header.write("fmt ", 12);
  header.writeUInt32LE(16, 16); // Subchunk1Size (16 for PCM)
  header.writeUInt16LE(1, 20); // AudioFormat (1 for PCM)
  header.writeUInt16LE(numChannels, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(byteRate, 28);
  header.writeUInt16LE(blockAlign, 32);
  header.writeUInt16LE(bitDepth, 34);
  header.write("data", 36);
  header.writeUInt32LE(dataSize, 40);

  return Buffer.concat([header, pcmBuffer]);
}

// Ensure data directory exists
if (!fs.existsSync(path.dirname(DATA_FILE))) {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
}

function loadPersistedArticles(): Article[] {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, "utf-8");
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error("Error reading persisted articles:", err);
  }
  // Initialize with baseline ARTICLES_DATA
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(ARTICLES_DATA, null, 2), "utf-8");
  } catch (err) {
    console.error("Error saving initial articles:", err);
  }
  return ARTICLES_DATA;
}

function savePersistedArticles(articles: Article[]): boolean {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(articles, null, 2), "utf-8");
    return true;
  } catch (err) {
    console.error("Error persisting articles:", err);
    return false;
  }
}

async function startServer() {
  const app = express();

  app.use(cors());
  app.use(express.json({ limit: "15mb" }));

  // Ensure file is initialized on boot
  loadPersistedArticles();

  // API Endpoints
  app.get("/api/articles", (_req: Request, res: Response) => {
    const articles = loadPersistedArticles();
    res.json({ success: true, count: articles.length, articles });
  });

  app.post("/api/articles", (req: Request, res: Response) => {
    try {
      const body = req.body;
      let newArticles: Article[] = [];

      if (Array.isArray(body)) {
        newArticles = body;
      } else if (Array.isArray(body.articles)) {
        newArticles = body.articles;
      } else if (body && body.id) {
        // Single article passed - merge or update
        const current = loadPersistedArticles();
        const index = current.findIndex((a: Article) => a.id === body.id);
        if (index >= 0) {
          current[index] = body;
        } else {
          current.unshift(body);
        }
        newArticles = current;
      }

      if (newArticles.length === 0) {
        return res.status(400).json({ success: false, message: "No valid articles provided" });
      }

      // Ensure each article has valid minimal shape
      const sanitized = newArticles.map((a: Article, i: number) => ({
        ...a,
        id: typeof a.id === "number" ? a.id : i + 1,
        title: a.title || "Untitled Dossier",
        category: a.category || "Tech-AI"
      }));

      const ok = savePersistedArticles(sanitized);
      if (!ok) {
        return res.status(500).json({ success: false, message: "Failed to persist articles" });
      }

      console.log(`[API] Saved ${sanitized.length} articles to persisted_articles.json`);
      return res.json({ success: true, count: sanitized.length, articles: sanitized });
    } catch (err: any) {
      console.error("[API] Error in POST /api/articles:", err);
      return res.status(500).json({ success: false, message: err?.message || "Internal error" });
    }
  });

  app.delete("/api/articles/:id", (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const current = loadPersistedArticles();
      const updated = current.filter((a: Article) => a.id !== id);
      savePersistedArticles(updated);
      res.json({ success: true, count: updated.length, articles: updated });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err?.message });
    }
  });

  app.post("/api/articles/reset", (_req: Request, res: Response) => {
    try {
      savePersistedArticles(ARTICLES_DATA);
      res.json({ success: true, count: ARTICLES_DATA.length, articles: ARTICLES_DATA });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err?.message });
    }
  });

  // Dedicated High-Fidelity Neural Speech Synthesis Route
  app.post("/api/speech", async (req: Request, res: Response) => {
    try {
      const { text, articleId, voice = "Christopher", rate = "-3%", pitch = "-2Hz" } = req.body;
      if (!text || typeof text !== "string") {
        return res.status(400).json({ success: false, message: "Text is required" });
      }

      // Map literary narrator voices to neural models
      const NEURAL_VOICE_MAP: Record<string, string> = {
        "Christopher": "en-US-ChristopherNeural",
        "Fenrir": "en-US-ChristopherNeural", // Deep literary baritone narrator
        "Brian": "en-US-BrianNeural",       // Documentary authority
        "Guy": "en-US-GuyNeural",           // Warm broadcast narrator
        "Andrew": "en-US-AndrewMultilingualNeural", // Natural human storyteller
        "Eric": "en-US-EricNeural"
      };

      const selectedVoice = NEURAL_VOICE_MAP[voice] || (voice.includes("Neural") ? voice : "en-US-ChristopherNeural");
      
      // Check article pre-cache if articleId is provided
      if (articleId) {
        const voiceKey = (voice === "Fenrir" ? "Christopher" : voice) || "Christopher";
        const articleCacheFile = path.join(AUDIO_CACHE_DIR, `article_${articleId}_${voiceKey}.mp3`);
        if (fs.existsSync(articleCacheFile) && fs.statSync(articleCacheFile).size > 5000) {
          return res.json({
            success: true,
            audioUrl: `/api/speech/audio/article_${articleId}_${voiceKey}`,
            voice: selectedVoice,
            cached: true
          });
        }
      }

      // Clean input text
      let cleanText = text
        .split(/###\s*Sources/i)[0] // Exclude bibliography/sources section from audio
        .replace(/^#{1,6}\s+/gm, "")
        .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
        .replace(/[*_~`]/g, "")
        .replace(/---\s*/g, " ")
        .replace(/\s+/g, " ")
        .trim();

      // For spoken narration, limit each synthesis request to 1,800 characters (~2-3 mins of audio)
      if (cleanText.length > 1800) {
        const cutIndex = cleanText.lastIndexOf(".", 1800);
        if (cutIndex > 500) {
          cleanText = cleanText.slice(0, cutIndex + 1);
        } else {
          cleanText = cleanText.slice(0, 1800);
        }
      }

      const cacheKey = crypto.createHash("md5").update(`${selectedVoice}:${rate}:${pitch}:${cleanText}`).digest("hex");
      const cachedFilePath = path.join(AUDIO_CACHE_DIR, `${cacheKey}.mp3`);

      // If already cached, serve instantaneously
      if (fs.existsSync(cachedFilePath)) {
        return res.json({
          success: true,
          audioUrl: `/api/speech/audio/${cacheKey}`,
          voice: selectedVoice,
          cached: true
        });
      }

      // Synthesize directly in one smooth pass with a generous 90s timeout
      const tts = new EdgeTTS({
        voice: selectedVoice,
        lang: "en-US",
        outputFormat: "audio-24khz-96kbitrate-mono-mp3",
        timeout: 90000,
        rate,
        pitch
      });

      await tts.ttsPromise(cleanText, cachedFilePath);

      if (!fs.existsSync(cachedFilePath) || fs.statSync(cachedFilePath).size === 0) {
        return res.status(500).json({ success: false, message: "No audio generated from synthesis" });
      }

      if (articleId) {
        const voiceKey = (voice === "Fenrir" ? "Christopher" : voice) || "Christopher";
        const articleCacheFile = path.join(AUDIO_CACHE_DIR, `article_${articleId}_${voiceKey}.mp3`);
        try {
          fs.copyFileSync(cachedFilePath, articleCacheFile);
        } catch {}
      }

      return res.json({
        success: true,
        audioUrl: `/api/speech/audio/${cacheKey}`,
        voice: selectedVoice,
        cached: false
      });
    } catch (err: any) {
      console.error("[TTS API] Neural synthesis error:", err?.message || err);
      return res.status(500).json({ success: false, message: err?.message || "Failed to generate neural speech" });
    }
  });

  // Audio direct stream endpoint with native HTTP range support
  app.get("/api/speech/audio/:hash", (req: Request, res: Response) => {
    const safeHash = req.params.hash.replace(/[^a-zA-Z0-9_-]/g, "");
    const filePath = path.join(AUDIO_CACHE_DIR, `${safeHash}.mp3`);
    if (!fs.existsSync(filePath)) {
      return res.status(404).send("Audio not found");
    }
    res.setHeader("Content-Type", "audio/mpeg");
    res.sendFile(filePath);
  });

  app.get("/api/health", (_req: Request, res: Response) => {
    res.json({ status: "healthy", timestamp: new Date().toISOString() });
  });

  // Environment mode
  const isProd = process.env.NODE_ENV === "production";
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Novus Exchange] Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
