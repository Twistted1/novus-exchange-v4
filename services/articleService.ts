import { Article } from "../types";
import { ARTICLES_DATA } from "../data/articlesData";

const STORAGE_KEY = "novus_exchange_articles_v3";
const CMS_CONFIG_KEY = "novus_exchange_cms_config_v1";

// Clean any stale or corrupted legacy keys from prior sessions
try {
  if (typeof window !== "undefined" && window.localStorage) {
    window.localStorage.removeItem("novus_exchange_articles_override_v1");
    window.localStorage.removeItem("novus_exchange_articles_override_v2");
  }
} catch {
  // Ignore storage access restrictions
}

export interface SupabaseCmsConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
  tableName: string;
  autoSync: boolean;
  webhookUrl?: string;
}

export const DEFAULT_CMS_CONFIG: SupabaseCmsConfig = {
  supabaseUrl: (import.meta as any).env?.VITE_SUPABASE_URL || "",
  supabaseAnonKey: (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || "",
  tableName: "articles",
  autoSync: false,
  webhookUrl: ""
};

export class ArticleService {
  static sanitizeArticle(raw: any, index: number = 0): Article {
    const fallback = ARTICLES_DATA[index % ARTICLES_DATA.length] || ARTICLES_DATA[0];
    const content = typeof raw.content === "string" ? raw.content : fallback.content;
    const computedWords = content.trim().split(/\s+/).filter(Boolean).length;
    const wordCount = typeof raw.wordCount === "number" ? raw.wordCount : (typeof raw.word_count === "number" ? raw.word_count : computedWords);

    const author = raw.author && typeof raw.author.name === "string" 
      ? raw.author 
      : fallback.author;

    return {
      id: typeof raw.id === "number" ? raw.id : index + 1,
      category: raw.category || fallback.category,
      title: raw.title || fallback.title,
      excerpt: raw.excerpt || fallback.excerpt,
      content,
      wordCount: wordCount || 2000,
      imageUrl: raw.imageUrl || raw.image_url || fallback.imageUrl,
      date: raw.date || fallback.date,
      readTime: typeof raw.readTime === "number" ? raw.readTime : (typeof raw.read_time === "number" ? raw.read_time : fallback.readTime),
      tags: Array.isArray(raw.tags) ? raw.tags : fallback.tags,
      author,
      featured: typeof raw.featured === "boolean" ? raw.featured : false
    };
  }

  /**
   * Retrieves active articles.
   * Priority Flow:
   * 1. Check persistent Backend Server API (/api/articles) for cross-browser synchronization.
   * 2. Reconcile with any local browser drafts (auto-syncing local drafts to the server so they become visible on all browsers).
   * 3. Check Supabase REST if configured.
   * 4. Fall back to bundled verified baseline dossiers.
   */
  static async getArticles(): Promise<Article[]> {
    // 1. Establish the 6 verified canonical dossiers as the baseline bedrock
    const baseArticles = ARTICLES_DATA.map((item, idx) => this.sanitizeArticle(item, idx));
    const articleMap = new Map<number, Article>(baseArticles.map((a) => [a.id, a]));

    let serverFetched = false;

    // 2. Fetch from persistent Server API (Universal across all browsers)
    try {
      const res = await fetch("/api/articles");
      if (res.ok) {
        const data = await res.json();
        const serverArticles: any[] = Array.isArray(data) ? data : (data.articles || []);
        if (serverArticles.length > 0) {
          serverArticles.forEach((item, idx) => {
            const sanitized = this.sanitizeArticle(item, idx);
            articleMap.set(sanitized.id, sanitized);
          });
          serverFetched = true;
        }
      }
    } catch {
      // Server API unreachable (offline or pure static preview)
    }

    // 3. Inspect browser local storage for any client-side additions/edits
    try {
      const local = localStorage.getItem(STORAGE_KEY);
      if (local) {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed) && parsed.length > 0) {
          let hasLocalNewAdditions = false;
          parsed.forEach((item, idx) => {
            const sanitized = this.sanitizeArticle(item, idx);
            if (!articleMap.has(sanitized.id)) {
              hasLocalNewAdditions = true;
            }
            articleMap.set(sanitized.id, sanitized);
          });

          // If local storage has articles not yet on the server, automatically push to server!
          if (hasLocalNewAdditions || (!serverFetched && parsed.length > 0)) {
            const allArticles = Array.from(articleMap.values()).sort((a, b) => a.id - b.id);
            this.pushArticlesToServer(allArticles).catch(() => {});
          }
        }
      }
    } catch (e) {
      console.warn("Could not read local articles storage:", e);
    }

    // 4. Query Supabase REST if configured
    const config = this.getCmsConfig();
    if (config.supabaseUrl && config.supabaseAnonKey) {
      try {
        const cleanUrl = config.supabaseUrl.replace(/\/+$/, "");
        const res = await fetch(`${cleanUrl}/rest/v1/${config.tableName}?select=*&order=id.asc`, {
          headers: {
            apikey: config.supabaseAnonKey,
            Authorization: `Bearer ${config.supabaseAnonKey}`
          }
        });

        if (res.ok) {
          const remoteArticles: any[] = await res.json();
          if (Array.isArray(remoteArticles) && remoteArticles.length > 0) {
            remoteArticles.forEach((item, idx) => {
              const sanitized = this.sanitizeArticle(item, idx);
              articleMap.set(sanitized.id, sanitized);
            });
          }
        }
      } catch (err) {
        console.warn("Supabase fetch failed, retaining baseline and local articles:", err);
      }
    }

    // 5. Final combined articles sorted by ID
    const finalArticles = Array.from(articleMap.values()).sort((a, b) => a.id - b.id);

    // Cache locally for instant loading on subsequent renders
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(finalArticles));
    } catch {}

    return finalArticles;
  }

  static async pushArticlesToServer(articles: Article[]): Promise<boolean> {
    try {
      const res = await fetch("/api/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ articles })
      });
      return res.ok;
    } catch {
      return false;
    }
  }

  static async checkServerStatus(): Promise<{ online: boolean; count: number }> {
    try {
      const res = await fetch("/api/articles");
      if (res.ok) {
        const data = await res.json();
        const list = Array.isArray(data) ? data : (data.articles || []);
        return { online: true, count: list.length };
      }
    } catch {}
    return { online: false, count: 0 };
  }

  static saveLocalArticles(articles: Article[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(articles));
      window.dispatchEvent(new Event("novus_articles_updated"));
    } catch (e) {
      console.error("Failed to save articles to local storage:", e);
    }

    // Asynchronously push to persistent server so it is visible to ALL browsers and devices
    this.pushArticlesToServer(articles).catch(() => {});

    // Asynchronously push to Supabase if configured
    this.syncAllArticlesToSupabase(articles).catch(() => {});
  }

  static resetToDefaultArticles(): Article[] {
    const fresh = ARTICLES_DATA.map((item, idx) => this.sanitizeArticle(item, idx));
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
      localStorage.removeItem("novus_exchange_articles_override_v1");
      localStorage.removeItem("novus_exchange_articles_override_v2");
    } catch (e) {
      console.error("Failed to reset articles in localStorage:", e);
    }

    // Reset on backend server API
    fetch("/api/articles/reset", { method: "POST" }).catch(() => {});

    // Also sync all 6 canonical dossiers to Supabase if connected
    this.syncAllArticlesToSupabase(fresh).catch(() => {});

    return fresh;
  }

  static exportArticlesAsJson(articles: Article[]): string {
    return JSON.stringify(articles, null, 2);
  }

  static exportArticlesAsTypeScript(articles: Article[]): string {
    return `import { Article, Author, SigningAuthorType } from "../types";\n\n` +
      `// Copy this into data/articlesData.ts to hardcode into your codebase\n` +
      `export const ARTICLES_DATA: Article[] = ${JSON.stringify(articles, null, 2)};\n`;
  }

  static importArticlesFromJson(jsonStr: string): { success: boolean; count: number; error?: string; articles?: Article[] } {
    try {
      const parsed = JSON.parse(jsonStr);
      const list = Array.isArray(parsed) ? parsed : (Array.isArray(parsed.articles) ? parsed.articles : null);
      if (!list || list.length === 0) {
        return { success: false, count: 0, error: "JSON must contain an array of articles." };
      }
      const sanitized = list.map((item: any, idx: number) => this.sanitizeArticle(item, idx));
      this.saveLocalArticles(sanitized);
      return { success: true, count: sanitized.length, articles: sanitized };
    } catch (e: any) {
      return { success: false, count: 0, error: `Invalid JSON syntax: ${e.message}` };
    }
  }

  static async syncAllArticlesToSupabase(articles: Article[]): Promise<boolean> {
    const config = this.getCmsConfig();
    if (!config.supabaseUrl || !config.supabaseAnonKey) return false;
    try {
      const cleanUrl = config.supabaseUrl.replace(/\/+$/, "");
      const res = await fetch(`${cleanUrl}/rest/v1/${config.tableName}`, {
        method: "POST",
        headers: {
          apikey: config.supabaseAnonKey,
          Authorization: `Bearer ${config.supabaseAnonKey}`,
          "Content-Type": "application/json",
          Prefer: "resolution=merge-duplicates"
        },
        body: JSON.stringify(articles)
      });
      return res.ok;
    } catch {
      return false;
    }
  }

  static getCmsConfig(): SupabaseCmsConfig {
    try {
      const stored = localStorage.getItem(CMS_CONFIG_KEY);
      if (stored) {
        return { ...DEFAULT_CMS_CONFIG, ...JSON.parse(stored) };
      }
    } catch (e) {
      console.warn("Could not read CMS config from localStorage:", e);
    }
    return DEFAULT_CMS_CONFIG;
  }

  static saveCmsConfig(config: Partial<SupabaseCmsConfig>): SupabaseCmsConfig {
    const current = this.getCmsConfig();
    const updated = { ...current, ...config };
    try {
      localStorage.setItem(CMS_CONFIG_KEY, JSON.stringify(updated));
      window.dispatchEvent(new Event("novus_cms_config_updated"));
    } catch (e) {
      console.error("Failed to save CMS config:", e);
    }
    return updated;
  }

  /**
   * Pushes an article to Supabase via standard REST endpoint
   */
  static async pushArticleToSupabase(article: Article): Promise<{ success: boolean; message: string }> {
    const config = this.getCmsConfig();
    if (!config.supabaseUrl || !config.supabaseAnonKey) {
      return { success: false, message: "Missing Supabase Project URL or Anon Key." };
    }

    try {
      const cleanUrl = config.supabaseUrl.replace(/\/+$/, "");
      const res = await fetch(`${cleanUrl}/rest/v1/${config.tableName}`, {
        method: "POST",
        headers: {
          apikey: config.supabaseAnonKey,
          Authorization: `Bearer ${config.supabaseAnonKey}`,
          "Content-Type": "application/json",
          Prefer: "resolution=merge-duplicates"
        },
        body: JSON.stringify(article)
      });

      if (!res.ok) {
        const errorText = await res.text();
        return { success: false, message: `Supabase error: ${errorText}` };
      }

      return { success: true, message: `Article #${article.id} successfully synced to Supabase table '${config.tableName}'.` };
    } catch (err: any) {
      return { success: false, message: `Network error: ${err.message}` };
    }
  }
}
