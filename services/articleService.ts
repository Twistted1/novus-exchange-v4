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
   * Guaranteed: The 6 foundational investigative dossiers are always preserved as the bedrock.
   * Remote Supabase and local editorial drafts enrich or update individual articles without dropping categories.
   */
  static async getArticles(): Promise<Article[]> {
    // 1. Always establish the 6 verified canonical dossiers as the baseline
    const baseArticles = ARTICLES_DATA.map((item, idx) => this.sanitizeArticle(item, idx));
    const articleMap = new Map<number, Article>(baseArticles.map((a) => [a.id, a]));

    const config = this.getCmsConfig();

    // 2. Query Supabase REST if configured
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
            return Array.from(articleMap.values()).sort((a, b) => a.id - b.id);
          }
        }
      } catch (err) {
        console.warn("Supabase fetch failed, retaining baseline and local articles:", err);
      }
    }

    // 3. Apply local overrides / editorial storage
    try {
      const local = localStorage.getItem(STORAGE_KEY);
      if (local) {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed) && parsed.length > 0) {
          parsed.forEach((item, idx) => {
            const sanitized = this.sanitizeArticle(item, idx);
            articleMap.set(sanitized.id, sanitized);
          });
          return Array.from(articleMap.values()).sort((a, b) => a.id - b.id);
        }
      }
    } catch (e) {
      console.warn("Could not read local articles storage:", e);
    }

    // 4. Return complete set of verified dossiers
    return Array.from(articleMap.values()).sort((a, b) => a.id - b.id);
  }

  static saveLocalArticles(articles: Article[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(articles));
      window.dispatchEvent(new Event("novus_articles_updated"));
    } catch (e) {
      console.error("Failed to save articles to local storage:", e);
    }
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

    // Also sync all 6 canonical dossiers to Supabase if connected
    this.syncAllArticlesToSupabase(fresh).catch(() => {});

    return fresh;
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
