import express, { Request, Response } from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { ARTICLES_DATA } from "./data/articlesData.ts";
import { Article } from "./types.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = Number(process.env.PORT) || 3000;
const DATA_FILE = path.resolve(__dirname, "data", "persisted_articles.json");

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
