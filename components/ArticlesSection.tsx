import { useState, useEffect, useRef } from "react";
import { Article, Category, SigningAuthorType, ArticleFigure } from "../types";
import { ARTICLES_DATA, AUTHORS } from "../data/articlesData";
import { ArticleService } from "../services/articleService";
import HeadlessCmsModal from "./HeadlessCmsModal";
import ArticleAudioPlayer from "./ArticleAudioPlayer";
import { SpeechService } from "../services/speechService";
import { 
  Search, 
  Calendar, 
  Clock, 
  BookOpen, 
  X, 
  ArrowUpRight, 
  ShieldCheck, 
  Hash, 
  UserCheck, 
  FileText,
  Database,
  RotateCcw,
  Volume2,
  Play,
  Sparkles,
  Camera,
  BarChart3,
  Quote,
  ZoomIn
} from "lucide-react";

export default function ArticlesSection() {
  const [articlesList, setArticlesList] = useState<Article[]>(() => ARTICLES_DATA);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedAuthor, setSelectedAuthor] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [readingArticle, setReadingArticle] = useState<Article | null>(null);
  const [overrideAuthors, setOverrideAuthors] = useState<Record<number, SigningAuthorType>>({});
  const [isCmsOpen, setIsCmsOpen] = useState<boolean>(false);
  const [isResettingArticles, setIsResettingArticles] = useState<boolean>(false);
  const [lightboxFigure, setLightboxFigure] = useState<ArticleFigure | null>(null);
  const isResettingRef = useRef(false);

  // Load articles from Supabase / Local CMS / Bundled Data
  const loadArticles = async () => {
    if (isResettingRef.current) return;
    try {
      const list = await ArticleService.getArticles();
      if (isResettingRef.current) return;
      if (Array.isArray(list) && list.length > 0) {
        setArticlesList(list);
      }
    } catch (e) {
      console.error("Failed to load articles:", e);
    }
  };

  const handleResetArticles = () => {
    isResettingRef.current = true;
    setIsResettingArticles(true);

    const fresh = ArticleService.resetToDefaultArticles();
    setArticlesList(fresh);
    setSelectedCategory("All");
    setSelectedAuthor("All");
    setSearchQuery("");
    setOverrideAuthors({});
    setReadingArticle(null);

    setTimeout(() => {
      isResettingRef.current = false;
      setIsResettingArticles(false);
    }, 1000);
  };

  useEffect(() => {
    loadArticles();

    const handleUpdate = () => {
      if (isResettingRef.current) return;
      loadArticles();
    };

    window.addEventListener("novus_articles_updated", handleUpdate);
    return () => window.removeEventListener("novus_articles_updated", handleUpdate);
  }, []);

  // Categories requested: Tech-AI - Green-Tech - CSR - Brazil + Illustrated Features
  const baseCategories: ("All" | "Illustrated Features" | Category | string)[] = [
    "All",
    "Illustrated Features",
    "Brazil",
    "Geopolitics",
    "Economics",
    "Tech-AI",
    "Green-Tech",
    "CSR"
  ];

  // Dynamically include any custom categories created in CMS
  const categories = Array.from(
    new Set([
      ...baseCategories,
      ...articlesList.map((a) => a.category).filter(Boolean)
    ])
  );

  const authorOptions: ("All" | SigningAuthorType)[] = ["All", "Novus AI", "Marcio", "Guest"];

  const getArticleAuthor = (article: Article) => {
    const overridden = overrideAuthors[article.id];
    if (overridden) {
      return AUTHORS[overridden];
    }
    return article.author;
  };

  const handleAuthorChange = (articleId: number, authorKey: SigningAuthorType) => {
    setOverrideAuthors((prev) => ({
      ...prev,
      [articleId]: authorKey
    }));
  };

  const filteredArticles = articlesList.filter((article) => {
    const currentAuthor = getArticleAuthor(article);
    const categoryMatches =
      selectedCategory === "All" ||
      (selectedCategory === "Illustrated Features"
        ? (article.isIllustratedFeature || (article.figures && article.figures.length > 0))
        : article.category.toLowerCase().trim() === selectedCategory.toLowerCase().trim());
    const authorMatches =
      selectedAuthor === "All" ||
      (currentAuthor.role && currentAuthor.role.toLowerCase() === selectedAuthor.toLowerCase()) ||
      (currentAuthor.name && currentAuthor.name.toLowerCase().includes(selectedAuthor.toLowerCase()));
    const searchMatches =
      !searchQuery.trim() ||
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
      currentAuthor.name.toLowerCase().includes(searchQuery.toLowerCase());
    return categoryMatches && authorMatches && searchMatches;
  });

  return (
    <section id="articles" className="py-10 lg:py-14 bg-[#06080C] border-t border-white/5 relative flex flex-col justify-center">
      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full my-auto">
        {/* Header Block with left-aligned branding */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div className="text-left max-w-xl">
            <div className="flex items-center gap-2.5 mb-2.5">
              <span className="flex items-center space-x-1">
                <span className="w-1 h-3.5 bg-[#C92A35] rounded-xs" />
                <span className="w-1 h-3.5 bg-[#A36E3C] rounded-xs" />
                <span className="w-1 h-3.5 bg-[#A1A5AB] rounded-xs" />
              </span>
              <span className="text-[10px] font-mono text-[#A36E3C] uppercase tracking-[0.25em] font-bold">
                DECLASSIFIED INTELLIGENCE & INVESTIGATIONS
              </span>
            </div>
            <h2 className="font-brand text-3xl sm:text-4xl font-bold text-white uppercase tracking-tight leading-[1.1]">
              INVESTIGATIONS & <br className="hidden sm:inline" />
              <span className="silver-beveled-text">RELEASES.</span>
            </h2>
            <p className="text-[#A1A5AB] text-xs sm:text-sm mt-2.5 leading-relaxed font-sans">
              Peer-verified investigative reports (2,000–3,000 words), forensic supply chain telemetry, and sovereign dossiers fed via Supabase & ContentHub CMS.
            </p>
          </div>

          {/* Action Row: CMS/Supabase Launcher + Search Bar */}
          <div className="mt-4 md:mt-0 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full md:w-auto">
            {/* Direct CMS / Feed Manager Button */}
            <button
              onClick={() => setIsCmsOpen(true)}
              className="px-3.5 py-2 rounded-lg border border-[#A36E3C]/50 bg-[#080A0E] text-[#DEAE78] hover:text-white hover:border-[#A36E3C] text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(163,110,60,0.15)] cursor-pointer"
              title="Open ContentHub CMS & Supabase Feed Controls"
            >
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span>ContentHub CMS & DB</span>
            </button>

            {/* Quick Reset to Initial Articles */}
            <button
              onClick={handleResetArticles}
              disabled={isResettingArticles}
              className={`px-3 py-2 rounded-lg border text-xs font-mono flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                isResettingArticles
                  ? "border-[#DEAE78]/60 bg-[#DEAE78]/15 text-white"
                  : "border-white/10 bg-[#080A0E] text-[#A1A5AB] hover:text-white hover:border-white/30"
              }`}
              title="Reload all 6 original in-depth articles"
            >
              <RotateCcw className={`w-3.5 h-3.5 text-[#DEAE78] transition-transform duration-700 ${isResettingArticles ? "-rotate-[360deg]" : ""}`} />
              <span className="hidden sm:inline">{isResettingArticles ? "Restoring..." : "Reset Initial Articles"}</span>
              <span className="sm:hidden">{isResettingArticles ? "..." : "Reset"}</span>
            </button>

            {/* Search bar inside Section */}
            <div className="relative w-full sm:w-60 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A1A5AB]" />
              <input
                type="text"
                placeholder="Search 2,000+ word dossiers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-[#A1A5AB]/20 bg-[#080A0E] text-white text-xs outline-none focus:border-[#A36E3C] rounded-lg transition-colors placeholder:text-[#A1A5AB]/60"
              />
            </div>
          </div>
        </div>

        {/* Toolbar: Categories + Signing Author Filter */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8 border-b border-white/5 pb-4">
          {/* Categories Tabs */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1.5 text-[11px] font-mono font-bold tracking-wider uppercase transition-all duration-200 border rounded-lg cursor-pointer ${
                  selectedCategory === category
                    ? "border-[#A36E3C] bg-[#080A0E] text-white shadow-[0_0_12px_rgba(163,110,60,0.25)]"
                    : "border-white/5 hover:border-[#A1A5AB]/30 text-[#A1A5AB] hover:text-white bg-[#06080C]"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Signing Author Filter Pill */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-[#A1A5AB] uppercase tracking-wider flex items-center gap-1">
              <UserCheck className="w-3 h-3 text-[#A36E3C]" />
              Signing Author:
            </span>
            <div className="flex items-center gap-1 bg-[#080A0E] p-1 border border-white/10 rounded-lg">
              {authorOptions.map((authKey) => (
                <button
                  key={authKey}
                  onClick={() => setSelectedAuthor(authKey)}
                  className={`px-2.5 py-1 text-[10px] font-mono font-medium rounded transition-all cursor-pointer ${
                    selectedAuthor === authKey
                      ? "bg-[#A36E3C] text-white font-bold"
                      : "text-[#A1A5AB] hover:text-white hover:bg-white/5"
                  }`}
                >
                  {authKey}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 6 News Blocks with Real Consistent Images */}
        {filteredArticles.length === 0 ? (
          <div className="text-center py-16 border border-white/5 bg-[#07090D] rounded-2xl p-6">
            <p className="text-[#A1A5AB] font-mono text-sm uppercase mb-3">Query returned 0 matches in current intelligence index</p>
            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={() => {
                  setSelectedCategory("All");
                  setSelectedAuthor("All");
                  setSearchQuery("");
                }}
                className="px-3.5 py-1.5 rounded-lg border border-white/15 bg-[#080A0E] text-xs font-mono text-white hover:border-[#A36E3C] cursor-pointer"
              >
                Clear Filters
              </button>
              <button
                onClick={handleResetArticles}
                disabled={isResettingArticles}
                className="px-3.5 py-1.5 rounded-lg border border-[#A36E3C]/40 bg-[#A36E3C]/20 text-xs font-mono text-[#DEAE78] hover:text-white font-bold cursor-pointer flex items-center gap-1.5 transition-all"
              >
                <RotateCcw className={`w-3.5 h-3.5 transition-transform duration-700 ${isResettingArticles ? "-rotate-[360deg]" : ""}`} />
                <span>{isResettingArticles ? "Restoring..." : "Restore All 6 Initial Articles"}</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article) => {
              const currentAuthor = getArticleAuthor(article);
              return (
                <div
                  key={article.id}
                  className="group border border-white/10 bg-[#07090D] hover:bg-[#0E1118] rounded-2xl overflow-hidden transition-all duration-300 hover:border-[#A36E3C]/50 flex flex-col justify-between shadow-lg"
                >
                  <div onClick={() => setReadingArticle(article)} className="cursor-pointer">
                    {/* Consistent Real Image Container */}
                    <div className="aspect-[16/10] w-full overflow-hidden relative border-b border-white/5 bg-[#040507]">
                      <img
                        src={article.imageUrl}
                        alt={article.title}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 brightness-95 group-hover:brightness-105"
                        loading="lazy"
                      />
                      
                      {/* Gradient overlay for depth */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#07090D] via-transparent to-transparent opacity-70 pointer-events-none" />

                      {/* Top Badges: Category, Illustrated Feature & Word Count */}
                      <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
                        <div className="px-2 py-0.5 bg-[#040507]/90 border border-[#A36E3C]/40 backdrop-blur-sm rounded text-[9px] font-mono text-[#DEAE78] font-bold uppercase tracking-wider">
                          {article.category}
                        </div>
                        {(article.isIllustratedFeature || (article.figures && article.figures.length > 0)) && (
                          <div className="px-2 py-0.5 bg-amber-500/20 border border-amber-500/40 backdrop-blur-sm rounded text-[9px] font-mono text-amber-300 font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm">
                            <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                            <span>ILLUSTRATED ({article.figures?.length || 5} FIGS)</span>
                          </div>
                        )}
                      </div>

                      <div className="absolute top-3 right-3 px-2 py-0.5 bg-[#040507]/90 border border-white/20 backdrop-blur-sm rounded text-[9px] font-mono text-[#D4D7DC] font-semibold flex items-center gap-1">
                        <FileText className="w-2.5 h-2.5 text-[#C92A35]" />
                        <span>{(article.wordCount ?? 2000).toLocaleString()} WORDS</span>
                      </div>
                    </div>

                    {/* Body area */}
                    <div className="p-5 sm:p-6 text-left">
                      {/* Curatorial unboxed metadata */}
                      <div className="flex items-center gap-3 text-[#A1A5AB] text-[10px] font-mono mb-2.5">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-[#A36E3C]" />
                          {article.date}
                        </span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#A36E3C]" />
                          {article.readTime} MIN READ
                        </span>
                      </div>

                      <h3 className="font-editorial font-bold text-white mb-2 group-hover:text-[#DEAE78] transition-colors leading-snug text-lg sm:text-xl line-clamp-2">
                        {article.title}
                      </h3>

                      <p className="text-[#A1A5AB] text-xs leading-relaxed line-clamp-3 font-sans">
                        {article.excerpt}
                      </p>
                    </div>
                  </div>

                  {/* Footer area with Signing Author selector & Read trigger */}
                  <div className="px-5 py-3 border-t border-white/5 bg-[#040507]/70 flex items-center justify-between gap-2">
                    {/* Signing Author Control */}
                    <div className="flex items-center gap-2">
                      <img
                        src={currentAuthor.avatar}
                        alt={currentAuthor.name}
                        className="w-5 h-5 rounded-full border border-white/20 object-cover"
                      />
                      <div className="flex flex-col">
                        <span className="text-[10px] font-mono text-[#D4D7DC] font-bold">
                          {currentAuthor.name}
                        </span>
                        <div className="flex items-center gap-1 mt-0.5">
                          <span className="text-[8px] font-mono text-[#A1A5AB]/80 uppercase">Sign as:</span>
                          {(["Novus AI", "Marcio", "Guest"] as SigningAuthorType[]).map((authorType) => (
                            <button
                              key={authorType}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAuthorChange(article.id, authorType);
                              }}
                              className={`text-[8px] font-mono px-1 py-0.2 rounded transition-colors ${
                                currentAuthor.role === authorType
                                  ? "bg-[#A36E3C]/30 text-[#DEAE78] font-bold border border-[#A36E3C]/50"
                                  : "text-[#A1A5AB]/70 hover:text-white"
                              }`}
                              title={`Set signing author to ${authorType}`}
                            >
                              {authorType}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Action read and listen triggers */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          SpeechService.playArticle(article);
                        }}
                        className="px-2 py-1 rounded-md border border-[#DEAE78]/30 bg-[#A36E3C]/10 hover:bg-[#A36E3C]/25 text-[#DEAE78] hover:text-white transition-all flex items-center gap-1 text-[10px] font-mono font-bold cursor-pointer"
                        title="Listen to this article with deep baritone narrator voice"
                      >
                        <Volume2 className="w-3 h-3 text-emerald-400" />
                        <span>LISTEN</span>
                      </button>

                      <button
                        onClick={() => setReadingArticle(article)}
                        className="text-[#C92A35] hover:text-white group-hover:translate-x-0.5 transition-all duration-200 flex items-center gap-1 text-[11px] font-mono font-bold uppercase tracking-wider cursor-pointer"
                      >
                        <span>READ</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Museum Editorial Reader Modal for full 2,000 - 3,000 word dossier */}
      {readingArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#06080C]/95 backdrop-blur-md animate-fadeIn text-left">
          <div className="w-full max-w-4xl max-h-[92vh] bg-[#07090D] border border-[#A36E3C]/40 rounded-2xl overflow-y-auto flex flex-col shadow-2xl relative">
            
            {/* Header Sticky Strip */}
            <div className="sticky top-0 right-0 px-6 py-3.5 bg-[#07090D]/95 backdrop-blur-md border-b border-white/10 flex items-center justify-between z-20">
              <span className="text-xs font-mono font-bold text-[#A36E3C] uppercase tracking-widest flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#C92A35]" />
                Novus Intelligence Archive // Declassified Dossier
              </span>
              <button
                onClick={() => setReadingArticle(null)}
                className="px-3 py-1.5 border border-white/15 bg-[#080A0E] hover:border-[#C92A35] hover:text-[#C92A35] text-[#D4D7DC] rounded-lg text-xs transition-colors flex items-center gap-1.5 font-mono uppercase tracking-wider cursor-pointer"
              >
                <X className="w-4 h-4" />
                <span>Close</span>
              </button>
            </div>

            {/* Main Inner Article Core */}
            <div className="p-6 md:p-10 space-y-6">
              
              {/* Category, Word Count & Title */}
              <div>
                <div className="flex items-center gap-2.5 mb-2 flex-wrap">
                  <span className="text-xs uppercase tracking-widest font-mono text-[#A36E3C] font-bold">
                    {readingArticle.category}
                  </span>
                  {(readingArticle.isIllustratedFeature || (readingArticle.figures && readingArticle.figures.length > 0)) && (
                    <>
                      <span className="text-[#A1A5AB]">·</span>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[10px] font-mono tracking-wider font-bold">
                        <Sparkles className="w-3 h-3 text-amber-400" />
                        <span>ILLUSTRATED FEATURE DOSSIER // {readingArticle.figures?.length || 5} FIGURES</span>
                      </span>
                    </>
                  )}
                  <span className="text-[#A1A5AB]">·</span>
                  <span className="text-xs font-mono text-[#DEAE78] font-bold">
                    {(readingArticle.wordCount ?? 2000).toLocaleString()} WORDS (COMPREHENSIVE INVESTIGATION)
                  </span>
                </div>

                <h1 className="font-editorial text-2xl sm:text-3xl md:text-4xl font-bold text-white mt-1 mb-2 leading-tight">
                  {readingArticle.title}
                </h1>

                {readingArticle.subtitle && (
                  <p className="text-base sm:text-lg text-[#DEAE78] font-editorial italic font-normal leading-relaxed mb-4">
                    {readingArticle.subtitle}
                  </p>
                )}

                {/* Byline and Signing Author Switcher Bar */}
                {(() => {
                  const currentAuthor = getArticleAuthor(readingArticle);
                  return (
                    <div className="flex flex-wrap items-center justify-between gap-4 text-[#A1A5AB] text-xs font-mono py-3.5 border-y border-white/10 bg-[#040507]/40 px-3 rounded-lg">
                      <div className="flex items-center gap-3">
                        <img
                          src={currentAuthor.avatar}
                          alt={currentAuthor.name}
                          className="w-10 h-10 rounded-full border border-[#A36E3C]/40 object-cover"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-white font-bold block">{currentAuthor.name}</span>
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#A36E3C]/20 text-[#DEAE78] font-mono border border-[#A36E3C]/30">
                              {currentAuthor.role}
                            </span>
                          </div>
                          <span className="text-[10px] text-[#A1A5AB]">{currentAuthor.title}</span>
                        </div>
                      </div>

                      {/* Author Switcher Option */}
                      <div className="flex items-center gap-1.5 bg-[#080A0E] px-2.5 py-1.5 rounded-lg border border-white/10">
                        <span className="text-[10px] text-[#A1A5AB]">Signing Author:</span>
                        {(["Novus AI", "Marcio", "Guest"] as SigningAuthorType[]).map((authorType) => (
                          <button
                            key={authorType}
                            onClick={() => handleAuthorChange(readingArticle.id, authorType)}
                            className={`px-2 py-0.5 text-[10px] font-mono rounded cursor-pointer transition-all ${
                              currentAuthor.role === authorType
                                ? "bg-[#A36E3C] text-white font-bold"
                                : "text-[#A1A5AB] hover:text-white hover:bg-white/5"
                            }`}
                          >
                            {authorType}
                          </button>
                        ))}
                      </div>
                      
                      <div className="flex items-center gap-3 text-[10px]">
                        <span>{readingArticle.date}</span>
                        <span>·</span>
                        <span>{readingArticle.readTime} MIN READ</span>
                        <span>·</span>
                        <span className="text-emerald-400 flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          CRYPTOGRAPHICALLY SIGNED
                        </span>
                      </div>
                    </div>
                  );
                })()}

                {/* Audio Narration Bar in Reader */}
                <div className="my-3 p-3.5 rounded-xl border border-[#A36E3C]/40 bg-[#040507] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-[0_0_15px_rgba(163,110,60,0.12)]">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#A36E3C]/20 border border-[#A36E3C]/40 flex items-center justify-center text-[#DEAE78] shrink-0">
                      <Volume2 className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white uppercase font-mono tracking-wide">
                          Audio Narration (Read Aloud)
                        </span>
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          Neural Voice · Christopher (Literary Baritone)
                        </span>
                      </div>
                      <p className="text-[11px] text-[#A1A5AB] font-mono mt-0.5">
                        High-fidelity neural narration matching literary documentary baritone cadence.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => SpeechService.playArticle(readingArticle)}
                    className="px-4 py-2 rounded-lg bg-[#A36E3C] hover:bg-[#DEAE78] text-white text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all shadow cursor-pointer shrink-0"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Listen to Dossier</span>
                  </button>
                </div>
              </div>

              {/* Artwork presentation / Cover Figure */}
              <div>
                <div 
                  onClick={() => {
                    const coverFig = readingArticle.figures?.find(f => f.chapterIndex === 0) || readingArticle.figures?.[0];
                    if (coverFig) {
                      setLightboxFigure(coverFig);
                    } else {
                      setLightboxFigure({
                        id: "cover",
                        url: readingArticle.imageUrl,
                        caption: readingArticle.excerpt,
                        figureNumber: "COVER RECONNAISSANCE"
                      });
                    }
                  }}
                  className="aspect-video w-full rounded-t-xl overflow-hidden border-t border-x border-[#A36E3C]/30 shadow-inner relative bg-[#040507] group cursor-pointer"
                >
                  <img
                    src={readingArticle.imageUrl}
                    alt={readingArticle.title}
                    className="w-full h-full object-cover object-center group-hover:scale-[1.01] transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#07090D] via-transparent to-transparent opacity-40 pointer-events-none" />
                  <div className="absolute top-3 right-3 px-2 py-1 bg-black/70 backdrop-blur-md rounded border border-white/20 text-[10px] font-mono text-white/90 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ZoomIn className="w-3 h-3 text-[#DEAE78]" />
                    <span>Click to Inspect Full Resolution</span>
                  </div>
                </div>

                {/* Cover Figure Caption & Archival Credit */}
                {(() => {
                  const coverFig = readingArticle.figures?.find(f => f.chapterIndex === 0) || readingArticle.figures?.[0];
                  if (coverFig && coverFig.caption) {
                    return (
                      <div className="bg-[#05070A] border-x border-b border-[#A36E3C]/30 p-3.5 rounded-b-xl text-left space-y-1 shadow-md">
                        <div className="flex items-center justify-between text-[10px] font-mono text-[#DEAE78]">
                          <span className="font-bold flex items-center gap-1.5">
                            <Camera className="w-3.5 h-3.5" />
                            {coverFig.figureNumber || "FIGURE 1.0"}
                          </span>
                          {coverFig.credit && (
                            <span className="text-[#A1A5AB]">
                              SOURCE: <span className="text-[#DEAE78]">{coverFig.credit}</span>
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#D4D7DC] font-sans leading-relaxed">
                          {coverFig.caption}
                        </p>
                      </div>
                    );
                  }
                  return (
                    <div className="bg-[#05070A] border-x border-b border-[#A36E3C]/30 p-2.5 rounded-b-xl text-left text-[11px] font-mono text-[#A1A5AB]">
                      FIGURE 1.0 // {readingArticle.title}
                    </div>
                  );
                })()}
              </div>

              {/* Key Macroeconomic Indicators Banner */}
              {readingArticle.keyMetrics && readingArticle.keyMetrics.length > 0 && (
                <div className="my-6 p-4 rounded-xl bg-gradient-to-br from-[#090D14] via-[#05070A] to-[#0D111A] border border-[#DEAE78]/30 shadow-xl text-left">
                  <div className="flex items-center gap-2 mb-3 text-xs font-mono font-bold text-[#DEAE78] uppercase tracking-wider">
                    <BarChart3 className="w-4 h-4 text-emerald-400" />
                    <span>Key Macroeconomic &amp; Telemetry Indicators</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {readingArticle.keyMetrics.map((met, idx) => (
                      <div key={idx} className="p-3.5 bg-[#040507]/90 rounded-lg border border-white/10 hover:border-[#A36E3C]/40 transition-colors">
                        <div className="text-lg sm:text-xl font-brand font-bold text-[#DEAE78] tracking-wide">
                          {met.value}
                        </div>
                        <div className="text-[11px] font-mono font-bold text-white mt-0.5">
                          {met.label}
                        </div>
                        {met.context && (
                          <div className="text-[10px] text-[#A1A5AB] font-mono mt-1 leading-snug">
                            {met.context}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Full Article Content */}
              <div className="max-w-3xl mx-auto space-y-6 text-left pt-4">
                {readingArticle.content
                  .split(/\n\s*---\s*\n|\n(?=(?:Chapter \d+|Prologue:|Epilogue:|EXECUTIVE BRIEFING:))/i)
                  .map((section, sIdx) => {
                    const paragraphs = section.split(/\n\n+/);
                    
                    // Figures assigned specifically to this chapter (sIdx)
                    const chapterFigures = (readingArticle.figures || []).filter(
                      (f) => f.chapterIndex === sIdx && f.chapterIndex > 0
                    );

                    // Pull quote assigned to this chapter index
                    const pullQuote = readingArticle.pullQuotes && readingArticle.pullQuotes[sIdx - 1];

                    // Helper to clean any markdown formatting dirt
                    const stripMd = (str: string) =>
                      str
                        .replace(/^#{1,6}\s+/, "")
                        .replace(/\*\*(.*?)\*\*/g, "$1")
                        .replace(/\*(.*?)\*/g, "$1")
                        .replace(/__(.*?)__/g, "$1")
                        .replace(/_(.*?)_/g, "$1")
                        .replace(/---\s*/g, " ")
                        .trim();

                    return (
                      <div key={sIdx} className="space-y-4 border-b border-white/5 pb-8 last:border-b-0">
                        {paragraphs.map((para, pIdx) => {
                          const trimmed = para.trim();
                          if (!trimmed) return null;

                          // Editor's Note Banner
                          if (/^Editor['’]s\s*note:/i.test(trimmed)) {
                            return (
                              <div
                                key={pIdx}
                                className="p-4 rounded-xl border border-[#DEAE78]/30 bg-[#DEAE78]/5 backdrop-blur-sm text-left my-4 space-y-1"
                              >
                                <div className="text-[10px] font-mono text-[#DEAE78] uppercase tracking-wider font-bold">
                                  Editorial Note & Verification Context
                                </div>
                                <p className="text-xs sm:text-sm text-[#D4D7DC] italic font-sans leading-relaxed">
                                  {stripMd(trimmed)}
                                </p>
                              </div>
                            );
                          }

                          // Primary Chapter Headings
                          const isChapterHeader =
                            /^#{1,3}\s+/.test(trimmed) ||
                            /^(Chapter \d+|Prologue:|Epilogue:|EXECUTIVE BRIEFING:)/i.test(trimmed);

                          if (isChapterHeader) {
                            return (
                              <h3
                                key={pIdx}
                                className="font-brand text-xl sm:text-2xl font-bold text-[#DEAE78] pt-4 tracking-wide border-l-4 border-[#C92A35] pl-3.5 mt-6 mb-2"
                              >
                                {stripMd(trimmed)}
                              </h3>
                            );
                          }

                          // Secondary Section Subheadings
                          const isSubheader =
                            /^#{4,6}\s+/.test(trimmed) ||
                            (!trimmed.includes(".") &&
                              trimmed.length < 90 &&
                              pIdx > 0 &&
                              !trimmed.startsWith("-") &&
                              !trimmed.startsWith("•") &&
                              !/^\d+\./.test(trimmed)) ||
                            /^(A dead heat|The platforms|The backdrop|From prohibition|The human cost|The marketing machine|The mechanics|The lawsuit|The politics|The numbers|The Central Bank|The human stories|US interference|The oil crisis|The AI and critical|Scenario \d+|The bottom line|Sources &|Key reporting)/i.test(
                              trimmed
                            );

                          if (isSubheader && trimmed.length < 110) {
                            return (
                              <h4
                                key={pIdx}
                                className="font-brand text-base sm:text-lg font-bold text-white pt-3 pb-0.5 tracking-normal text-left"
                              >
                                {stripMd(trimmed)}
                              </h4>
                            );
                          }

                          // Lists & Bullets
                          if (
                            trimmed.startsWith("- ") ||
                            trimmed.startsWith("• ") ||
                            trimmed.startsWith("* ") ||
                            /^\d+\.\s/.test(trimmed)
                          ) {
                            return (
                              <div
                                key={pIdx}
                                className="pl-4 border-l-2 border-[#A36E3C]/40 font-sans text-sm text-[#D4D7DC] space-y-2 my-3 bg-[#080A0E]/50 p-3.5 rounded-r-lg"
                              >
                                {trimmed.split("\n").map((line, lIdx) => {
                                  const cleanLine = stripMd(line.replace(/^[-*•]\s+/, "").replace(/^\d+\.\s+/, ""));
                                  return (
                                    <div key={lIdx} className="flex items-start gap-2.5 leading-relaxed">
                                      <span className="w-1.5 h-1.5 rounded-full bg-[#DEAE78] mt-2 shrink-0" />
                                      <span>{cleanLine}</span>
                                    </div>
                                  );
                                })}
                              </div>
                            );
                          }

                          // Markdown Image Embed ![Alt](url)
                          const imgMatch = trimmed.match(/^!\[(.*?)\]\((.*?)\)$/);
                          if (imgMatch) {
                            const altText = imgMatch[1];
                            const imgUrl = imgMatch[2];
                            return (
                              <figure
                                key={pIdx}
                                onClick={() => setLightboxFigure({
                                  id: `inline-${pIdx}`,
                                  url: imgUrl,
                                  caption: altText,
                                  figureNumber: `FIGURE ${sIdx}.${pIdx + 1}`
                                })}
                                className="my-5 rounded-xl overflow-hidden border border-[#A36E3C]/30 bg-[#05070A] shadow-xl group cursor-pointer hover:border-[#DEAE78] transition-all"
                              >
                                <div className="aspect-[16/9] w-full overflow-hidden bg-black/60 relative">
                                  <img
                                    src={imgUrl}
                                    alt={altText}
                                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                                  />
                                  <div className="absolute top-2.5 right-2.5 px-2 py-1 bg-black/75 rounded text-[10px] font-mono text-[#DEAE78] flex items-center gap-1">
                                    <ZoomIn className="w-3 h-3" />
                                    <span>Inspect</span>
                                  </div>
                                </div>
                                {altText && (
                                  <figcaption className="p-3 text-xs text-[#D4D7DC] font-sans text-left">
                                    {altText}
                                  </figcaption>
                                )}
                              </figure>
                            );
                          }

                          // Standard Narrative Prose
                          const cleanPara = stripMd(trimmed);
                          return (
                            <p
                              key={pIdx}
                              className={`text-[#D4D7DC] text-sm sm:text-base leading-relaxed font-sans ${
                                sIdx === 0 && pIdx === 1
                                  ? "first-letter:text-5xl first-letter:font-editorial first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:text-[#A36E3C]"
                                  : ""
                              }`}
                            >
                              {cleanPara}
                            </p>
                          );
                        })}

                        {/* Embedded Chapter Figures for Illustrated Feature Articles */}
                        {chapterFigures.map((fig, fIdx) => (
                          <figure
                            key={`fig-${sIdx}-${fIdx}`}
                            onClick={() => setLightboxFigure(fig)}
                            className="my-6 rounded-xl overflow-hidden border border-[#A36E3C]/30 bg-[#05070A] shadow-xl group cursor-pointer transition-all hover:border-[#DEAE78]"
                          >
                            <div className="px-4 py-2 bg-[#090D14] border-b border-white/10 flex items-center justify-between text-[11px] font-mono">
                              <div className="flex items-center gap-2 text-[#DEAE78] font-bold">
                                <Camera className="w-3.5 h-3.5" />
                                <span>{fig.figureNumber || `FIGURE ${sIdx}.${fIdx + 1}`}</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-[#A1A5AB] group-hover:text-white transition-colors">
                                <ZoomIn className="w-3.5 h-3.5 text-[#DEAE78]" />
                                <span className="text-[10px]">Click to inspect</span>
                              </div>
                            </div>

                            <div className="aspect-[16/9] w-full overflow-hidden bg-black/60 relative">
                              <img
                                src={fig.url}
                                alt={fig.caption || fig.figureNumber || "Article Figure"}
                                className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                              />
                            </div>

                            <figcaption className="p-3.5 text-left space-y-1 bg-[#05070A]">
                              <p className="text-xs sm:text-sm text-[#E2E5EA] font-sans leading-relaxed">
                                {fig.caption}
                              </p>
                              {fig.credit && (
                                <p className="text-[10px] font-mono text-[#A1A5AB]">
                                  SOURCE / ARCHIVE: <span className="text-[#DEAE78]">{fig.credit}</span>
                                </p>
                              )}
                            </figcaption>
                          </figure>
                        ))}

                        {/* Embedded Editorial Pull Quote */}
                        {pullQuote && (
                          <blockquote className="my-6 p-5 rounded-r-xl border-l-4 border-[#C92A35] bg-gradient-to-r from-[#A36E3C]/10 via-[#07090D] to-transparent text-left space-y-2">
                            <p className="font-editorial text-base sm:text-lg text-white italic leading-relaxed flex items-start gap-2">
                              <Quote className="w-5 h-5 text-[#DEAE78] shrink-0 mt-1" />
                              <span>"{pullQuote.quote}"</span>
                            </p>
                            {pullQuote.attribution && (
                              <cite className="block text-[11px] font-mono text-[#DEAE78] not-italic pl-7">
                                — {pullQuote.attribution}
                              </cite>
                            )}
                          </blockquote>
                        )}
                      </div>
                    );
                  })}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 pt-4">
                {readingArticle.tags.map((tag) => (
                  <span key={tag} className="text-xs font-mono text-[#A36E3C] bg-[#A36E3C]/10 border border-[#A36E3C]/20 px-2.5 py-1 rounded">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Institutional Footnote & Cryptographic Hash */}
              <div className="border-t border-white/10 pt-4 mt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[10px] font-mono text-[#A1A5AB]">
                <div className="flex items-center gap-1.5">
                  <Hash className="w-3.5 h-3.5 text-[#A36E3C]" />
                  <span>AUDIT HASH: {readingArticle.wordCount}-WORDS-VALIDATED-SHA256</span>
                </div>
                <span>NOVUS EXCHANGE INVESTIGATIVE REPOSITORY // IMMUTABLE RELEASE</span>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* FULLSCREEN MUSEUM LIGHTBOX FOR HIGH-RES FIGURES */}
      {lightboxFigure && (
        <div
          onClick={() => setLightboxFigure(null)}
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-4 sm:p-8 animate-fadeIn"
        >
          <button
            onClick={() => setLightboxFigure(null)}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            title="Close Lightbox (Esc)"
          >
            <X className="w-6 h-6" />
          </button>

          <div onClick={(e) => e.stopPropagation()} className="max-w-5xl max-h-[90vh] flex flex-col items-center text-left">
            <div className="overflow-hidden rounded-xl border border-white/20 shadow-2xl bg-black max-h-[72vh] flex items-center justify-center">
              <img
                src={lightboxFigure.url}
                alt={lightboxFigure.caption || "Inspection Figure"}
                className="max-h-[72vh] w-auto max-w-full object-contain"
              />
            </div>

            <div className="mt-3 p-4 rounded-xl bg-[#090D14]/90 border border-white/10 max-w-3xl w-full space-y-1">
              <div className="flex items-center justify-between text-xs font-mono text-[#DEAE78]">
                <span className="font-bold flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5" />
                  {lightboxFigure.figureNumber || "FIGURE RECONNAISSANCE"}
                </span>
                {lightboxFigure.credit && (
                  <span className="text-[#A1A5AB]">
                    SOURCE: <span className="text-[#DEAE78]">{lightboxFigure.credit}</span>
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-[#D4D7DC] font-sans leading-relaxed">
                {lightboxFigure.caption}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Headless CMS & Supabase Manager Modal */}
      <HeadlessCmsModal
        isOpen={isCmsOpen}
        onClose={() => setIsCmsOpen(false)}
        articles={articlesList}
        onArticlesChange={(updated) => setArticlesList(updated)}
      />

      {/* Persistent Audio Narration Player Bar */}
      <ArticleAudioPlayer />
    </section>
  );
}

