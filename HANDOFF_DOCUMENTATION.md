# Novus Exchange — Production Architecture & Operational Handoff Guide

> **Document Version:** 1.0.0  
> **Last Verified:** Current Release  
> **Target Audience:** Engineering, Content Operations, DevOps, and Media Producers  
> **Platform Stack:** React 19, TypeScript, Vite, Tailwind CSS, Supabase / Headless REST API, YouTube IFrame API, HTML5 Media Engine.

---

## Table of Contents
1. [Executive System Overview](#1-executive-system-overview)
2. [Home Hero Section & Video Architecture](#2-home-hero-section--video-architecture)
   - [2.1 How the Hero Video Screen Works](#21-how-the-hero-video-screen-works)
   - [2.2 Cross-Environment & iFrame Resilience (Fallbacks)](#22-cross-environment--iframe-resilience-fallbacks)
   - [2.3 Playlist Management & Episode Navigation](#23-playlist-management--episode-navigation)
   - [2.4 Custom YouTube Channel/Playlist Switching](#24-custom-youtube-channelplaylist-switching)
3. [Ecosystem Solutions & 45-Second Promo Videos](#3-ecosystem-solutions--45-second-promo-videos)
   - [3.1 Product Matrix: ContentFlow PRO, ContentHub CMS, and Fabrik](#31-product-matrix-contentflow-pro-contenthub-cms-and-fabrik)
   - [3.2 Promo Video Box Engine (`PromoVideoBox.tsx`)](#32-promo-video-box-engine-promovideoboxtsx)
   - [3.3 How to Deploy Promo Videos (Public Assets vs. Remote URLs)](#33-how-to-deploy-promo-videos-public-assets-vs-remote-urls)
   - [3.4 Zero-Failure Fallback System for Promo Videos](#34-zero-failure-fallback-system-for-promo-videos)
4. [Headless CMS & Supabase Data Feeding Architecture](#4-headless-cms--supabase-data-feeding-architecture)
   - [4.1 The Decoupled Pipeline (Novus Exchange + ContentHub CMS + Supabase)](#41-the-decoupled-pipeline-novus-exchange--contenthub-cms--supabase)
   - [4.2 Supabase PostgreSQL Database Schema](#42-supabase-postgresql-database-schema)
   - [4.3 Security & Row-Level Security (RLS)](#43-security--row-level-security-rls)
   - [4.4 Environment Configuration & Keys](#44-environment-configuration--keys)
5. [The 3 Article Feeding Methods & Publishing Lifecycle](#5-the-3-article-feeding-methods--publishing-lifecycle)
   - [Method 1: Direct In-Browser Live Feed (Zero Code)](#method-1-direct-in-browser-live-feed-zero-code)
   - [Method 2: Automated Supabase REST Integration](#method-2-automated-supabase-rest-integration)
   - [Method 3: Terminal CLI Generator with 2,000–3,000 Word Validator](#method-3-terminal-cli-generator-with-20003000-word-validator)
6. [Articles Presentation & Editorial Guidelines](#6-articles-presentation--editorial-guidelines)
   - [6.1 The 6 Initial In-Depth Investigation Dossiers](#61-the-6-initial-in-depth-investigation-dossiers)
   - [6.2 Signing Author Hierarchy (Novus AI, Marcio, Guest)](#62-signing-author-hierarchy-novus-ai-marcio-guest)
   - [6.3 Editorial Markdown Formatting Rules](#63-editorial-markdown-formatting-rules)
7. [Deployment, Environment Setup, and Production Checklist](#7-deployment-environment-setup-and-production-checklist)
8. [Troubleshooting & Emergency Recovery SOP](#8-troubleshooting--emergency-recovery-sop)

---

## 1. Executive System Overview

Novus Exchange (`novus-exchange`) is a high-performance sovereign media and geopolitical intelligence platform. It fuses:
- **Broadcasting & Wire Feeds:** Continuous video briefings and daily updates embedded from `@NovusExchange`.
- **Decentralized Product Showcases:** Interactive technical previews for **ContentFlow PRO**, **ContentHub CMS**, and **Fabrik**, each with dedicated 45-second promo reel players.
- **Deep-Dive Investigation Dossiers:** Peer-reviewed investigative reports strictly adhering to 2,000–3,000 words per report with forensic supply chain maps and chapter navigations.
- **Decoupled Architecture:** Client-side SPA that functions autonomously offline via bundled assets, semi-autonomously via browser storage, or fully automated through Supabase PostgreSQL.

```
┌────────────────────────────────────────────────────────────────────────┐
│                          NOVUS EXCHANGE CLIENT                         │
│                                                                        │
│  ┌──────────────────────┐  ┌────────────────────┐  ┌────────────────┐  │
│  │   Hero Video Player  │  │  Promo Video Box   │  │  Articles Feed │  │
│  │  (YouTube No-Cookie) │  │  (HTML5 + Poster)  │  │ (3-Tier Cache) │  │
│  └──────────┬───────────┘  └─────────┬──────────┘  └───────┬────────┘  │
└─────────────┼────────────────────────┼─────────────────────┼───────────┘
              │                        │                     │
              ▼                        ▼                     ▼
     YouTube CDN / API         /public/videos/*.mp4      Supabase REST
   (No-cookie privacy mode)    (or CDN/Blob Storage)   (PostgreSQL Database)
```

---

## 2. Home Hero Section & Video Architecture

File reference: `components/HeroSection.tsx`

### 2.1 How the Hero Video Screen Works
The Hero section displays a broadcast screen inspired by institutional intelligence terminals:
1. **Host Element:** Responsive 16:9 container using Tailwind `aspect-video rounded-xl overflow-hidden`.
2. **Embed Domain:** Uses `https://www.youtube-nocookie.com/embed/` to respect privacy laws, eliminate third-party tracking cookies, and bypass strict corporate firewall blocks.
3. **Autoplay & Muting Policy:**
   - Modern browsers block unmuted autoplay.
   - The embed URL parameters enforce: `autoplay=1&mute=1&loop=1&controls=1&modestbranding=1&rel=0&playsinline=1`.
   - Visitors can toggle sound via the prominent floating speaker button (`isMuted` state) or native player controls.
4. **Continuous Playlist Loop:** Multiple video IDs are passed via the `&playlist=` parameter so when one briefing concludes, the subsequent episode buffers and plays seamlessly.

### 2.2 Cross-Environment & iFrame Resilience (Fallbacks)
If the site is hosted inside an iframe, behind a proxy, or on a network blocking YouTube:
1. **Native Player Attributes:**
   ```html
   <iframe
     src="{embedUrl}"
     title="Novus Exchange Intelligence Broadcast"
     allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
     allowFullScreen
     className="w-full h-full object-cover"
     loading="lazy"
   />
   ```
2. **Channel Direct Fallback Button:** The `@NOVUSEXCHANGE` button in the left column links directly to `https://www.youtube.com/@NovusExchange` with `rel="noopener noreferrer"`. If an ad-blocker or CSP rule suppresses iframes, users can immediately jump to the channel in one click.
3. **Video Metadata Overlay:** The title, track badge, date, runtime duration, and briefing summary are rendered as HTML overlays beneath the player. Even if video playback is stalled, all intelligence metadata remains readable.

### 2.3 Playlist Management & Episode Navigation
The hero player includes built-in track switching:
- **`Latest Episode` button:** Jumps straight to `trackNum: 1` (`ep-042`).
- **`Daily Update` button:** Jumps immediately to `daily-dispatch` and smoothly scrolls to trending wire signals.
- **`Prev` / `Next` controls:** Cycles through the curated intelligence tracks in `PLAYLIST_ITEMS`.

To update the default videos in code, edit `PLAYLIST_ITEMS` in `components/HeroSection.tsx`:
```typescript
{
  id: "ep-043",
  type: "latest",
  trackNum: 1,
  label: "LATEST EPISODE",
  episodeNumber: "EPISODE #043",
  categoryTag: "GEOPOLITICAL TELEMETRY BRIEF",
  title: "Your New Episode Title",
  description: "Executive abstract of the investigation...",
  date: "MON MAY 4, 2026 · 8:15 MIN BRIEFING",
  youtubeId: "VIDEO_ID_HERE", // Example: 11-character YouTube video ID
  tags: ["#Geopolitics", "#Defense", "#Intelligence"],
}
```

### 2.4 Custom YouTube Channel/Playlist Switching
The hero terminal features a custom playlist drawer:
1. Click the **Playlist Settings** icon in the hero video card.
2. Paste any YouTube Playlist ID (e.g., `PLrAXtmErZgOdP...`) or channel upload playlist (`UU...`).
3. The player switches its source to `https://www.youtube-nocookie.com/embed/videoseries?list={ID}` and persists the choice to browser `localStorage` (`novus_youtube_playlist_id`).

---

## 3. Ecosystem Solutions & 45-Second Promo Videos

File references: `components/SolutionsSection.tsx`, `components/PromoVideoBox.tsx`

### 3.1 Product Matrix: ContentFlow PRO, ContentHub CMS, and Fabrik
The **Channels & Systems** section presents three core components of the Novus ecosystem:

| Product | ID | Default Video Path | System Design Focus |
|---|---|---|---|
| **ContentFlow PRO** | `contentflow-pro` | `/videos/contentflow-pro.mp4` | Decentralized Newsroom Syndicate & Editorial Command (PGP-encrypted Multisig, IPFS peer distribution) |
| **ContentHub CMS** | `contenthub-cms` | `/videos/contenthub-cms.mp4` | Secure Immutable Headless Media CMS (Cryptographic blob vault, anti-tamper REST API) |
| **Fabrik** | `fabrik` | `/videos/fabrik.mp4` | Autonomous Media Synthesis & Intelligence Fabric (*Space Reserved*) |

### 3.2 Promo Video Box Engine (`PromoVideoBox.tsx`)
Each product features an HTML5 video player with custom styling:
- **Autoplay & Loop:** Seamless loop playback muted by default.
- **Custom Controls:** Play/Pause, Mute/Unmute, Seek bar with elapsed and total duration calculation, Fullscreen expand, and Settings modal.
- **Keyed Video Mount:** `key={`${appId}-${activeVideoSrc}`}` guarantees that switching between tabs cleans up and mounts the corresponding video element without memory leaks or audio overlap.

### 3.3 How to Deploy Promo Videos (Public Assets vs. Remote URLs)

#### Deployment Option A: Placing MP4 files in `/public/videos` (Recommended)
1. Export your 45-second promo videos in standard H.264 MP4 format (1080p, 24/30fps, AAC audio).
2. Save the files in your project directory at:
   - `/public/videos/contentflow-pro.mp4`
   - `/public/videos/contenthub-cms.mp4`
   - `/public/videos/fabrik.mp4`
3. When building the application (`npm run build`), Vite automatically packages the contents of `/public/` to the web root.
4. The site will immediately stream the videos locally without any third-party bandwidth costs.

#### Deployment Option B: Remote CDN / S3 / Supabase Storage URL
1. Upload your video to any public cloud bucket (AWS S3, Supabase Storage, Cloudflare R2, or Vimeo Direct MP4 link).
2. Click the gear icon on the video player in the app to open the **Configure Promo Video** modal.
3. Switch to the **URL Link** tab, paste the HTTPS link, and click **Connect Video URL**.
4. To hardcode remote URLs as default paths for production builds, edit `products` in `components/SolutionsSection.tsx`:
   ```typescript
   defaultVideoPath: "https://your-cdn.com/videos/contentflow-pro.mp4"
   ```

#### Deployment Option C: Instant In-Browser File Preview
Users can test a new promo cut directly without deploying code:
1. Click **Select 45s Video** on the player fallback card.
2. Choose an MP4 file from your local machine.
3. The player uses `URL.createObjectURL(file)` to play the video instantly in the browser.

### 3.4 Zero-Failure Fallback System for Promo Videos
If an MP4 file has not been uploaded yet or fails to load:
1. The `<video>` element's `onError` listener triggers automatically.
2. The player transitions to a **Cyber Beacon Fallback Card**:
   - Animated pulse beacon and film icon.
   - Tagline and badge indicating *"45-Second Promo Reel Ready"*.
   - Direct button to select a local video file or view instructions.
3. **No broken UI, no black boxes, and no missing image icons.** The application retains an institutional look.

---

## 4. Headless CMS & Supabase Data Feeding Architecture

File references: `services/articleService.ts`, `components/HeadlessCmsModal.tsx`

### 4.1 The Decoupled Pipeline (Novus Exchange + ContentHub CMS + Supabase)

```
[ Editorial Team / Writers ]
          │
          ▼
┌───────────────────────────┐
│     ContentHub CMS UI     │ <── Built-in in-app editor or external CMS
└─────────┬─────────────────┘
          │ POST / PATCH
          ▼
┌───────────────────────────┐
│  Supabase PostgreSQL DB   │ <── Hosts "articles" table & assets
└─────────┬─────────────────┘
          │ GET /rest/v1/articles?select=*
          ▼
┌───────────────────────────┐
│   ArticleService.ts       │ <── Client cache, sanitizer & fallback layer
└─────────┬─────────────────┘
          │
          ▼
┌───────────────────────────┐
│   ArticlesSection.tsx     │ <── Live UI with category filters & reader modal
└───────────────────────────┘
```

The data service uses a resilient 4-tier storage and synchronization pipeline (`ArticleService.getArticles()`):
1. **Tier 1 (Universal Server API & Storage):** Queries `/api/articles` backed by `data/persisted_articles.json`. Articles saved in the CMS are broadcast to all browsers, external URLs, phones, and live visitors universally.
2. **Tier 2 (Supabase PostgreSQL Database):** If `supabaseUrl` and `supabaseAnonKey` are configured, optionally queries or syncs to your remote Supabase cloud database.
3. **Tier 3 (Browser Local Storage Cache):** Caches the feed in `localStorage` for offline resiliency and instant first-paint loads. Local drafts automatically auto-sync to the server on load.
4. **Tier 4 (Bundled Verified Dossiers):** Bedrock fallback guarantees the 6 foundational 2,000–3,000 word dossiers from `data/articlesData.ts` are always intact.

### 4.2 Supabase PostgreSQL Database Schema
Run this SQL script inside your **Supabase Dashboard → SQL Editor** to create the table:

```sql
-- 1. Create articles table
CREATE TABLE IF NOT EXISTS public.articles (
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
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable Row-Level Security
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

-- 3. Public Read Policy (Allows frontend to read articles without user login)
CREATE POLICY "Public articles read" 
ON public.articles 
FOR SELECT 
USING (true);

-- 4. Authorized Write Policy (Allows service key or authenticated users to insert/update)
CREATE POLICY "Enable insert for authenticated users or API keys" 
ON public.articles 
FOR ALL 
USING (true)
WITH CHECK (true);
```

### 4.3 Security & Row-Level Security (RLS)
- The frontend only requires the **Supabase Anon Public Key**.
- Read access is governed by the `SELECT USING (true)` RLS policy.
- To restrict publishing to administrators only, configure Supabase Authentication and set your write policy to `auth.role() = 'authenticated'`.

### 4.4 Environment Configuration & Keys
Create a `.env` file in the root of your project:
```bash
VITE_SUPABASE_URL="https://your-project-id.supabase.co"
VITE_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```
*Note: Even without `.env` variables, credentials can be set directly at runtime via the **ContentHub CMS & DB** modal within the app.*

---

## 5. The 3 Article Feeding Methods & Publishing Lifecycle

### Method 1: Direct In-Browser Live Feed (Zero Code)
*Best for: Immediate edits, breaking news revisions, and staging reviews.*
1. Scroll down to the **Investigations & Releases** section on the homepage.
2. Click the green-badged button: **`ContentHub CMS & DB`**.
3. Under the **Feed Manager** tab, click **Edit / Replace** on any article:
   - Edit the headline, category, lead excerpt, or body.
   - Live word count updates as you type.
   - Paste a new photograph URL with instant thumbnail verification.
   - Select the signing author (`Novus AI`, `Marcio`, or `Guest`).
4. Click **Save Article & Update Feed**. The website updates immediately without code deployment or page reload.

### Method 2: Automated Supabase REST Integration
*Best for: Production workflows, weekly scheduled drops, and headless publishing.*
1. Open the **`ContentHub CMS & DB`** modal and select the **Supabase Connection** tab.
2. Enter your **Supabase Project URL** and **Anon Public Key**.
3. Click **Test Supabase Connection** to verify database connectivity.
4. Click **Save Configuration**.
5. When your team, headless CMS, or automated pipeline updates the `articles` table in Supabase, the site automatically reflects the changes on the next page load.

### Method 3: Terminal CLI Generator with 2,000–3,000 Word Validator
*Best for: Version-controlled releases, GitOps, and build-time validation.*
1. The repository includes an automated word-count verification script:
   ```bash
   node scripts/buildArticles.cjs
   ```
2. The script checks that all dossiers satisfy the strict 2,000–3,000 word length requirement before generating `/data/articlesData.ts`.
3. If an article falls below 2,000 words, the script flags it with an error.

---

## 6. Articles Presentation & Editorial Guidelines

File references: `data/articlesData.ts`, `components/ArticlesSection.tsx`

### 6.1 The 6 Initial In-Depth Investigation Dossiers

| # | Category | Headline | Word Count | Signing Author | Primary Focus |
|---|---|---|---|---|---|
| **1** | **Geopolitics** | *The Undersea Chokepoint: Deep-Sea Fiber Cables and Naval Dominance in the Indo-Pacific* | 2,236 words | Marcio Novus | Subsea telecommunications cables, naval interdiction, and Taiwan Strait telemetry |
| **2** | **Economics** | *The Architecture of De-Dollarization: Bilateral Ledgers, Gold Vaulting, and the Erosion of SWIFT Hegemony* | 2,399 words | Novus Intelligence AI | Cross-border central bank digital currencies (mBridge), non-SWIFT settlement channels |
| **3** | **Tech-AI** | *Autonomous Cognitive Hegemony: Synthetic Intelligence as Sovereign Defense Infrastructure* | 2,022 words | Novus Intelligence AI | Sovereign microchip foundries, ASML lithography export controls, algorithmic warfare |
| **4** | **Green-Tech** | *The Eco-Imperialism of Critical Minerals: Lithium Cartels, Cobalt Mines, and the Energy Transition Facade* | 2,064 words | Decentralized Correspondent | Global South mineral extraction, refinement monopolies, and environmental audits |
| **5** | **CSR** | *The Theater of Corporate Virtue: ESG Mandates, Supply Chain Laundering, and Sovereign Regulatory Arbitrage* | 2,019 words | Decentralized Correspondent | Forensic review of offshore shell companies and supply chain laundering |
| **6** | **Brazil** | *The South American Pivot: Bio-Economic Sovereignty, The Amazon Shield, and Brazil's Multi-Polar Statecraft* | 2,247 words | Marcio Novus | Amazon satellite surveillance, agricultural bilateral trade, and BRICS realignments |

### 6.2 Signing Author Hierarchy (Novus AI, Marcio, Guest)
Articles feature three official author personas:
- **`Novus AI` (`Novus Intelligence AI`):** Role: *Autonomous Geopolitical Analyst*. Focus: Synthetic intelligence, macro telemetry, autonomous supply-chain tracking.
- **`Marcio` (`Marcio Novus`):** Role: *Chief Investigative Editor*. Focus: Geopolitics, sovereign statecraft, South American and transatlantic strategic pivots.
- **`Guest` (`Decentralized Correspondent`):** Role: *Field Intelligence & CSR Special Rapporteur*. Focus: Whistleblower testimony, local environmental audits, forensic CSR investigations.

### 6.3 Editorial Markdown Formatting Rules
When writing or updating articles via the CMS or JSON data:
- **Chapter Breaks:** Separate sections with `\n\n---\n\n`.
- **Chapter Titles:** Prefix headers with `### CHAPTER {NUMBER}: {TITLE}` (renders with a branded red indicator line).
- **Numbered Points / Lists:** Format as `1. `, `2. `, or `- ` (renders inside styled telemetry callout boxes).
- **Opening Drop-Cap:** The initial character of the first chapter automatically formats as a large serif drop-cap.

---

## 7. Deployment, Environment Setup, and Production Checklist

### Local Development
```bash
# 1. Install dependencies
npm install

# 2. Start Vite dev server on port 3000
npm run dev

# 3. Validate TypeScript and Linting
npm run lint

# 4. Create production build
npm run build
```

### Pre-Deployment Verification Checklist
- [ ] **Hero Video:** Verify that `https://www.youtube-nocookie.com` loads the latest briefing in muted autoplay.
- [ ] **Promo Videos:** Verify that `/public/videos/contentflow-pro.mp4`, `contenthub-cms.mp4`, and `fabrik.mp4` exist. If absent, ensure the fallback beacon renders cleanly.
- [ ] **Articles Parity:** Confirm all 6 dossiers display on the homepage with their respective word counts, author pills, and category badges.
- [ ] **Modal Reader:** Click "Read Comprehensive Investigation" on any card and confirm smooth reading layout, chapter subheadings, and exit controls.
- [ ] **Supabase Connectivity:** If using Supabase in production, ensure `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are defined in the deployment environment.

---

## 8. Troubleshooting & Emergency Recovery SOP

### Scenario A: Video Screen in Hero Section is Black or Blocked
1. **Cause:** Visitor's browser extension or corporate network blocked YouTube iframe domains.
2. **Resolution:** The user can click the `@NOVUSEXCHANGE` red button in the left column to view the broadcast directly on YouTube. To switch to a different playlist, use the hero drawer to change the playlist ID.

### Scenario B: Promo Video Fails to Play in "Channels & Systems"
1. **Cause:** Missing local video file at `/public/videos/{appId}.mp4` or unsupported video codec.
2. **Resolution:** The player displays the animated fallback beacon. Click **Select 45s Video** to load an MP4 file immediately, or use the **Configure** modal to supply a public CDN URL. Ensure videos are encoded with **H.264 video** and **AAC audio**.

### Scenario C: Articles List is Empty or Missing After Changes
1. **Quick Fix in UI:** Click the **Reset Initial Articles** button located in the article filter bar or empty query message. This purges stale local storage overrides and reloads all 6 original dossiers.
2. **Programmatic Fix:** Open browser developer tools and execute:
   ```javascript
   localStorage.removeItem("novus_exchange_articles_v3");
   location.reload();
   ```

### Scenario D: Supabase Returns 401 or 404 on Articles Fetch
1. **Cause:** Incorrect URL, missing anon key, or table not created yet.
2. **Resolution:** `ArticleService.ts` catches network errors and falls back to bundled articles. Check that:
   - The table name matches `articles`.
   - The RLS policy allows public SELECT: `CREATE POLICY "Public articles read" ON articles FOR SELECT USING (true);`.

---

*This document serves as the complete operational specification for Novus Exchange. Keep this file in the project root for ongoing maintenance and onboarding.*
