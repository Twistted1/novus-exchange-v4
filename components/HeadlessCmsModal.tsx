import { useState, useEffect } from "react";
import { Article, ArticleCategory, SigningAuthorType } from "../types";
import { ArticleService, SupabaseCmsConfig } from "../services/articleService";
import { AUTHORS } from "../data/articlesData";
import { 
  Database, 
  RefreshCw, 
  Plus, 
  Trash2, 
  X, 
  Layers, 
  Upload, 
  FileText,
  AlertCircle
} from "lucide-react";

interface CmsModalProps {
  isOpen: boolean;
  onClose: () => void;
  articles: Article[];
  onArticlesChange: (updated: Article[]) => void;
}

export default function HeadlessCmsModal({
  isOpen,
  onClose,
  articles,
  onArticlesChange
}: CmsModalProps) {
  const [activeTab, setActiveTab] = useState<"articles" | "supabase" | "architecture">("articles");
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [cmsConfig, setCmsConfig] = useState<SupabaseCmsConfig>(ArticleService.getCmsConfig());
  const [statusMsg, setStatusMsg] = useState<{ text: string; type: "success" | "error" | "info" } | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    setCmsConfig(ArticleService.getCmsConfig());
  }, [isOpen]);

  if (!isOpen) return null;

  const showStatus = (text: string, type: "success" | "error" | "info" = "info") => {
    setStatusMsg({ text, type });
    setTimeout(() => setStatusMsg(null), 4500);
  };

  const handleSaveConfig = () => {
    ArticleService.saveCmsConfig(cmsConfig);
    showStatus("Supabase CMS configuration saved successfully.", "success");
  };

  const handleTestSupabase = async () => {
    if (!cmsConfig.supabaseUrl || !cmsConfig.supabaseAnonKey) {
      showStatus("Please supply both Supabase URL and Anon Key.", "error");
      return;
    }
    setIsSyncing(true);
    try {
      const cleanUrl = cmsConfig.supabaseUrl.replace(/\/+$/, "");
      const res = await fetch(`${cleanUrl}/rest/v1/${cmsConfig.tableName}?select=count`, {
        headers: {
          apikey: cmsConfig.supabaseAnonKey,
          Authorization: `Bearer ${cmsConfig.supabaseAnonKey}`
        }
      });
      if (res.ok) {
        showStatus(`Connected to Supabase table '${cmsConfig.tableName}' successfully!`, "success");
      } else {
        const text = await res.text();
        showStatus(`Supabase responded with HTTP ${res.status}: ${text}`, "error");
      }
    } catch (e: any) {
      showStatus(`Connection failed: ${e.message}`, "error");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSyncToSupabase = async (article: Article) => {
    setIsSyncing(true);
    const res = await ArticleService.pushArticleToSupabase(article);
    if (res.success) {
      showStatus(res.message, "success");
    } else {
      showStatus(res.message, "error");
    }
    setIsSyncing(false);
  };

  const handleSaveArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingArticle) return;

    // Recalculate word count
    const words = editingArticle.content.trim().split(/\s+/).filter(Boolean).length;
    const updatedArticle = { ...editingArticle, wordCount: words };

    const index = articles.findIndex((a) => a.id === updatedArticle.id);
    let updatedList: Article[];
    if (index >= 0) {
      updatedList = [...articles];
      updatedList[index] = updatedArticle;
    } else {
      updatedList = [updatedArticle, ...articles];
    }

    onArticlesChange(updatedList);
    ArticleService.saveLocalArticles(updatedList);
    setEditingArticle(null);
    showStatus(`Article #${updatedArticle.id} saved locally. (${words} words)`, "success");
  };

  const handleDeleteArticle = (id: number) => {
    const updated = articles.filter((a) => a.id !== id);
    onArticlesChange(updated);
    ArticleService.saveLocalArticles(updated);
    showStatus(`Article #${id} removed from feed.`, "info");
  };

  const handleResetToFactoryArticles = () => {
    const fresh = ArticleService.resetToDefaultArticles();
    onArticlesChange(fresh);
    showStatus("All 6 canonical dossiers restored to factory specifications.", "success");
  };

  const handleNewArticle = () => {
    const nextId = articles.length > 0 ? Math.max(...articles.map((a) => a.id)) + 1 : 1;
    const newArt: Article = {
      id: nextId,
      category: "Tech-AI",
      title: "New Investigation Dossier",
      excerpt: "Executive overview of the freshly conducted investigative reporting.",
      content: "### SECTION I: INVESTIGATIVE SYNOPSIS\n\nProvide the complete investigative dispatch here...",
      wordCount: 15,
      imageUrl: "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=1200&q=80",
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      readTime: 6,
      tags: ["Investigation", "Telemetry"],
      author: AUTHORS["Novus AI"]
    };
    setEditingArticle(newArt);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/90 backdrop-blur-md animate-fadeIn text-left">
      <div className="w-full max-w-5xl max-h-[92vh] bg-[#07090D] border border-[#A36E3C]/40 rounded-2xl flex flex-col shadow-2xl overflow-hidden">
        
        {/* Top Header */}
        <div className="px-6 py-4 bg-[#05070A] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#A36E3C]/20 border border-[#A36E3C]/40 flex items-center justify-center text-[#DEAE78]">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-brand font-bold text-white text-base tracking-wide">
                  CONTENTHUB CMS & SUPABASE HEADLESS ARCHITECTURE
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  LIVE FEED ENGINE
                </span>
              </div>
              <p className="text-[11px] text-[#A1A5AB] font-mono">
                Manage, publish, and feed weekly 2,000–3,000 word articles, photographs, and signing authors.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#A1A5AB] hover:text-white rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 border-b border-white/10 bg-[#06080C] text-xs font-mono">
          <button
            onClick={() => setActiveTab("articles")}
            className={`py-3 px-4 border-b-2 font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === "articles"
                ? "border-[#A36E3C] text-white"
                : "border-transparent text-[#A1A5AB] hover:text-white"
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-[#A36E3C]" />
            <span>Feed Manager ({articles.length} Articles)</span>
          </button>

          <button
            onClick={() => setActiveTab("supabase")}
            className={`py-3 px-4 border-b-2 font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === "supabase"
                ? "border-[#A36E3C] text-white"
                : "border-transparent text-[#A1A5AB] hover:text-white"
            }`}
          >
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            <span>Supabase Connection</span>
          </button>

          <button
            onClick={() => setActiveTab("architecture")}
            className={`py-3 px-4 border-b-2 font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === "architecture"
                ? "border-[#A36E3C] text-white"
                : "border-transparent text-[#A1A5AB] hover:text-white"
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-[#DEAE78]" />
            <span>How Headless CMS Feeds This Site</span>
          </button>
        </div>

        {/* Status Alert Banner */}
        {statusMsg && (
          <div
            className={`px-6 py-2.5 text-xs font-mono flex items-center gap-2 border-b ${
              statusMsg.type === "success"
                ? "bg-emerald-950/50 text-emerald-300 border-emerald-800"
                : statusMsg.type === "error"
                ? "bg-rose-950/50 text-rose-300 border-rose-800"
                : "bg-amber-950/50 text-amber-300 border-amber-800"
            }`}
          >
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{statusMsg.text}</span>
          </div>
        )}

        {/* Modal Scroll Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* TAB 1: ARTICLES FEED MANAGER */}
          {activeTab === "articles" && !editingArticle && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/5">
                <div>
                  <h4 className="text-sm font-bold text-white uppercase font-brand tracking-wide">
                    Live Article Index & Telemetry
                  </h4>
                  <p className="text-xs text-[#A1A5AB]">
                    Edit articles right here or connect Supabase below. Changes update the live UI immediately.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleResetToFactoryArticles}
                    className="px-3 py-1.5 rounded-lg border border-white/10 hover:border-white/20 text-xs font-mono text-[#A1A5AB] hover:text-white transition-all cursor-pointer"
                  >
                    Reset Defaults
                  </button>
                  <button
                    onClick={handleNewArticle}
                    className="px-3.5 py-1.5 rounded-lg bg-[#A36E3C] hover:bg-[#DEAE78] text-white text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create Article</span>
                  </button>
                </div>
              </div>

              {/* Table of Articles */}
              <div className="grid gap-3">
                {articles.map((art) => (
                  <div
                    key={art.id}
                    className="p-4 rounded-xl bg-[#05070A] border border-white/10 hover:border-[#A36E3C]/40 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all"
                  >
                    <div className="flex items-start sm:items-center gap-3">
                      <img
                        src={art.imageUrl}
                        alt={art.title}
                        className="w-16 h-12 object-cover rounded-lg border border-white/10 shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#A36E3C]/20 text-[#DEAE78] font-bold uppercase">
                            {art.category}
                          </span>
                          <span className="text-xs font-bold text-white font-editorial line-clamp-1">
                            #{art.id} {art.title}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-[10px] font-mono text-[#A1A5AB] mt-1">
                          <span>{art.author.name} ({art.author.role})</span>
                          <span>•</span>
                          <span className="text-[#DEAE78] font-bold">{(art.wordCount ?? 2000).toLocaleString()} words</span>
                          <span>•</span>
                          <span>{art.date}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end md:self-center">
                      {cmsConfig.supabaseUrl && (
                        <button
                          onClick={() => handleSyncToSupabase(art)}
                          disabled={isSyncing}
                          title="Push to Supabase table"
                          className="px-2.5 py-1.5 rounded-lg border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 text-[11px] font-mono flex items-center gap-1 transition-all cursor-pointer"
                        >
                          <Upload className="w-3 h-3" />
                          <span>Push DB</span>
                        </button>
                      )}
                      <button
                        onClick={() => setEditingArticle(art)}
                        className="px-3 py-1.5 rounded-lg border border-white/15 hover:border-[#A36E3C] text-white hover:text-[#DEAE78] text-xs font-mono transition-all cursor-pointer"
                      >
                        Edit / Replace
                      </button>
                      <button
                        onClick={() => handleDeleteArticle(art.id)}
                        className="p-1.5 rounded-lg border border-white/10 hover:border-rose-500/50 text-[#A1A5AB] hover:text-rose-400 transition-all cursor-pointer"
                        title="Delete article"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* EDIT ARTICLE FORM */}
          {editingArticle && (
            <form onSubmit={handleSaveArticle} className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <h4 className="text-sm font-bold text-white uppercase font-brand tracking-wide">
                  Edit Article #{editingArticle.id}
                </h4>
                <button
                  type="button"
                  onClick={() => setEditingArticle(null)}
                  className="text-xs font-mono text-[#A1A5AB] hover:text-white"
                >
                  Cancel
                </button>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-mono text-[#A1A5AB] block mb-1">Headline Title</label>
                  <input
                    type="text"
                    required
                    value={editingArticle.title}
                    onChange={(e) => setEditingArticle({ ...editingArticle, title: e.target.value })}
                    className="w-full bg-[#05070A] border border-white/15 rounded-lg px-3 py-2 text-white text-xs focus:border-[#A36E3C] outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-[#A1A5AB] block mb-1">Category</label>
                  <select
                    value={editingArticle.category}
                    onChange={(e) => setEditingArticle({ ...editingArticle, category: e.target.value as ArticleCategory })}
                    className="w-full bg-[#05070A] border border-white/15 rounded-lg px-3 py-2 text-white text-xs focus:border-[#A36E3C] outline-none font-mono"
                  >
                    <option value="Geopolitics">Geopolitics</option>
                    <option value="Economics">Economics</option>
                    <option value="Tech-AI">Tech-AI</option>
                    <option value="Green-Tech">Green-Tech</option>
                    <option value="CSR">CSR</option>
                    <option value="Brazil">Brazil</option>
                  </select>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-mono text-[#A1A5AB] block mb-1">Photo / Image URL</label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      required
                      value={editingArticle.imageUrl}
                      onChange={(e) => setEditingArticle({ ...editingArticle, imageUrl: e.target.value })}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full bg-[#05070A] border border-white/15 rounded-lg px-3 py-2 text-white text-xs focus:border-[#A36E3C] outline-none"
                    />
                    {editingArticle.imageUrl && (
                      <img
                        src={editingArticle.imageUrl}
                        alt="Preview"
                        className="w-10 h-9 rounded object-cover border border-white/10 shrink-0"
                      />
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-mono text-[#A1A5AB] block mb-1">Signing Author</label>
                  <select
                    value={editingArticle.author.role}
                    onChange={(e) => {
                      const role = e.target.value as SigningAuthorType;
                      setEditingArticle({ ...editingArticle, author: AUTHORS[role] });
                    }}
                    className="w-full bg-[#05070A] border border-white/15 rounded-lg px-3 py-2 text-white text-xs focus:border-[#A36E3C] outline-none font-mono"
                  >
                    <option value="Novus AI">Novus AI (Novus Intelligence AI)</option>
                    <option value="Marcio">Marcio (Marcio Novus - Chief Investigative Editor)</option>
                    <option value="Guest">Guest (Decentralized Correspondent)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-mono text-[#A1A5AB] block mb-1">Lead Excerpt</label>
                <textarea
                  rows={2}
                  required
                  value={editingArticle.excerpt}
                  onChange={(e) => setEditingArticle({ ...editingArticle, excerpt: e.target.value })}
                  className="w-full bg-[#05070A] border border-white/15 rounded-lg p-3 text-white text-xs focus:border-[#A36E3C] outline-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-mono text-[#A1A5AB]">
                    Full Dossier Body (Markdown format)
                  </label>
                  <span className="text-[11px] font-mono text-[#DEAE78]">
                    Current Word Count: {editingArticle.content.trim().split(/\s+/).filter(Boolean).length} words
                  </span>
                </div>
                <textarea
                  rows={10}
                  required
                  value={editingArticle.content}
                  onChange={(e) => setEditingArticle({ ...editingArticle, content: e.target.value })}
                  className="w-full bg-[#05070A] border border-white/15 rounded-lg p-3 text-[#D4D7DC] text-xs font-mono focus:border-[#A36E3C] outline-none leading-relaxed"
                />
                <p className="text-[10px] text-[#A1A5AB] mt-1 font-mono">
                  Separate chapters with "---" and markdown headers ("### CHAPTER I: ...") to maintain the editorial presentation.
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setEditingArticle(null)}
                  className="px-4 py-2 rounded-lg border border-white/10 text-xs font-mono text-[#A1A5AB] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#A36E3C] hover:bg-[#DEAE78] text-white font-bold text-xs font-mono transition-all shadow"
                >
                  Save Article & Update Feed
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: SUPABASE CONFIGURATION */}
          {activeTab === "supabase" && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-[#040507] border border-emerald-500/30">
                <div className="flex items-center gap-2 mb-2">
                  <Database className="w-4 h-4 text-emerald-400" />
                  <span className="font-bold text-sm text-white font-brand">SUPABASE POSTGRESQL / REST INTEGRATION</span>
                </div>
                <p className="text-xs text-[#A1A5AB] font-sans leading-relaxed">
                  Supabase provides an instant PostgreSQL database and REST API. When you paste your project URL and Anon key below, Novus Exchange will automatically query your Supabase <code className="text-emerald-400">articles</code> table on page load.
                </p>
              </div>

              <div className="grid gap-4">
                <div>
                  <label className="text-xs font-mono text-[#A1A5AB] block mb-1">
                    Supabase Project URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://your-project.supabase.co"
                    value={cmsConfig.supabaseUrl}
                    onChange={(e) => setCmsConfig({ ...cmsConfig, supabaseUrl: e.target.value })}
                    className="w-full bg-[#05070A] border border-white/15 rounded-lg px-3 py-2 text-white text-xs focus:border-[#A36E3C] outline-none font-mono"
                  />
                  <span className="text-[10px] text-[#A1A5AB] mt-1 block">
                    Found in Supabase Dashboard → Project Settings → API → Project URL
                  </span>
                </div>

                <div>
                  <label className="text-xs font-mono text-[#A1A5AB] block mb-1">
                    Supabase Anon Public Key (Publishable)
                  </label>
                  <input
                    type="password"
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    value={cmsConfig.supabaseAnonKey}
                    onChange={(e) => setCmsConfig({ ...cmsConfig, supabaseAnonKey: e.target.value })}
                    className="w-full bg-[#05070A] border border-white/15 rounded-lg px-3 py-2 text-white text-xs focus:border-[#A36E3C] outline-none font-mono"
                  />
                  <span className="text-[10px] text-[#A1A5AB] mt-1 block">
                    Found in Supabase Dashboard → Project Settings → API → "anon public"
                  </span>
                </div>

                <div>
                  <label className="text-xs font-mono text-[#A1A5AB] block mb-1">
                    Table Name
                  </label>
                  <input
                    type="text"
                    value={cmsConfig.tableName}
                    onChange={(e) => setCmsConfig({ ...cmsConfig, tableName: e.target.value })}
                    className="w-full sm:w-64 bg-[#05070A] border border-white/15 rounded-lg px-3 py-2 text-white text-xs focus:border-[#A36E3C] outline-none font-mono"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={handleSaveConfig}
                  className="px-4 py-2 rounded-lg bg-[#A36E3C] hover:bg-[#DEAE78] text-white font-bold text-xs font-mono transition-all cursor-pointer"
                >
                  Save Configuration
                </button>
                <button
                  onClick={handleTestSupabase}
                  disabled={isSyncing}
                  className="px-4 py-2 rounded-lg border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10 text-xs font-mono transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin" : ""}`} />
                  <span>Test Supabase Connection</span>
                </button>
              </div>

              {/* SQL Schema helper */}
              <div className="p-4 rounded-xl bg-[#05070A] border border-white/10 space-y-2 text-left">
                <span className="text-xs font-mono font-bold text-[#DEAE78] block">
                  Quick Supabase SQL Table Setup (Copy & paste into Supabase SQL Editor):
                </span>
                <pre className="p-3 bg-[#020305] text-[#D4D7DC] text-[11px] font-mono rounded overflow-x-auto border border-white/5">
{`CREATE TABLE articles (
  id BIGINT PRIMARY KEY,
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  word_count INT,
  image_url TEXT,
  date TEXT,
  read_time INT,
  tags TEXT[],
  author JSONB,
  featured BOOLEAN DEFAULT false
);

-- Enable public read access for your website:
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public articles read" ON articles FOR SELECT USING (true);`}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 3: HOW HEADLESS CMS & WEEKLY REFRESH WORKS */}
          {activeTab === "architecture" && (
            <div className="space-y-6 text-sm text-[#D4D7DC] leading-relaxed">
              <div className="p-4 rounded-xl bg-[#080A0E] border border-[#A36E3C]/30">
                <h4 className="font-brand font-bold text-white text-base mb-1">
                  THE ARCHITECTURAL RELATIONSHIP: NOVUS EXCHANGE & HEADLESS CMS
                </h4>
                <p className="text-xs text-[#A1A5AB]">
                  How Novus Exchange, ContentHub CMS, and Supabase work together seamlessly.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-[#05070A] border border-white/10 space-y-2">
                  <div className="w-8 h-8 rounded-md bg-[#A36E3C]/20 border border-[#A36E3C]/40 flex items-center justify-center text-[#DEAE78] font-bold font-mono text-xs">
                    01
                  </div>
                  <h5 className="font-bold text-white text-xs font-mono uppercase">
                    Headless CMS / ContentHub CMS
                  </h5>
                  <p className="text-xs text-[#A1A5AB]">
                    You or your team write or generate weekly 2,000–3,000 word dossiers, upload pictures, and select signing authors (Marcio, Novus AI, Guest) inside the CMS dashboard.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#05070A] border border-white/10 space-y-2">
                  <div className="w-8 h-8 rounded-md bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold font-mono text-xs">
                    02
                  </div>
                  <h5 className="font-bold text-white text-xs font-mono uppercase">
                    Supabase PostgreSQL Database
                  </h5>
                  <p className="text-xs text-[#A1A5AB]">
                    The CMS saves the structured article records (chapters, images, authors, word count) to your Supabase tables and stores photos in Supabase Storage Buckets.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#05070A] border border-white/10 space-y-2">
                  <div className="w-8 h-8 rounded-md bg-[#C92A35]/20 border border-[#C92A35]/40 flex items-center justify-center text-[#C92A35] font-bold font-mono text-xs">
                    03
                  </div>
                  <h5 className="font-bold text-white text-xs font-mono uppercase">
                    Novus Exchange Frontend
                  </h5>
                  <p className="text-xs text-[#A1A5AB]">
                    This website requests the latest articles via Supabase REST API on load. The reader immediately displays the new weekly articles, photos, and word count telemetry.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#05070A] border border-white/10 space-y-3">
                <h5 className="font-bold text-white text-xs font-mono uppercase text-[#DEAE78]">
                  HOW DO YOU CHANGE ARTICLES & IMAGES EVERY WEEK?
                </h5>
                <ul className="text-xs space-y-2 text-[#A1A5AB] list-disc pl-5">
                  <li>
                    <strong className="text-white">Method 1 (Instant in-browser):</strong> Click the <strong>"ContentHub CMS"</strong> button right above the Articles section. You can paste your weekly 2,000+ word article text, change the image URL, or change the signing author. It updates immediately without touching code.
                  </li>
                  <li>
                    <strong className="text-white">Method 2 (Automated weekly feed via Supabase):</strong> Connect your Supabase project in the "Supabase Connection" tab. Whenever your editorial workflow or scheduled script inserts new rows into your Supabase database, this website displays them automatically.
                  </li>
                  <li>
                    <strong className="text-white">Method 3 (Code script generator):</strong> You can also run the built-in <code className="text-white bg-white/10 px-1 py-0.5 rounded">node scripts/buildArticles.cjs</code> script which verifies word count parity between 2,000 and 3,000 words before publishing.
                  </li>
                </ul>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-[#05070A] border-t border-white/10 flex items-center justify-between">
          <span className="text-[10px] font-mono text-[#A1A5AB]">
            Novus ContentHub CMS Engine • Supabase Headless Ready
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-mono cursor-pointer transition-all"
          >
            Close CMS
          </button>
        </div>

      </div>
    </div>
  );
}
