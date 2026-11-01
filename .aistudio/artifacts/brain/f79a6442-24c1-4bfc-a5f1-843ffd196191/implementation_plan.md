# KuroList — Platform Tour & Verification Plan

A complete, production-ready anime and manga tracking social platform combining the best of MyAnimeList, AniList, and Letterboxd with a premium dark interface, gamified leveling, and ColorOS/iOS-inspired Aqua Dynamics floating shortcuts.

## User Review & Critical Decisions

> [!IMPORTANT]
> Both user preferences have been confirmed and are locked in:
> 1. **Tour & Test Direction**: Focus on guided interactive verification and testing across all primary flows (Tracking, Gamification, Streaming Links, Social Feed, Discovery, and Identity Card).
> 2. **Profile & Demo State**: Retain the complete pre-seeded identity for Ashok Rimal (`@ashokrimal`, Otaku Sovereign Level 8, 4,890 XP, curated anime/manga lists, custom collections, and earned badges) alongside real-time search and Jikan API fallbacks.

---

## 1. Overview & Core Concept

- **What It Does**: KuroList is a dark-first social tracking hub where users discover, log, score, and share their anime and manga journeys. It features real-time XP calculation, 15 unlockable badges, a floating frosted Aqua Dynamics pill dock, direct links to 6 major streaming portals, 2-way MAL/AniList synchronizer, and zero-pill typographic metadata styling.
- **Target Persona**: Dedicated anime watchers, manga readers, and community curators who want a fast, tactile platform that celebrates their viewing identity.
- **Key Value**: Replaces clunky, retro tracking tables with an ultra-responsive web application that feels like a native mobile app on handhelds and a cinematic dashboard on wide displays.

---

## 2. User Experience & Visual Design

### Key User Flows
1. **Interactive Guided Tour & Quick Logging**:
   - Access the floating pill dock at the bottom of the screen.
   - Tap **⚡ Quick +1 Ep** on the floating pill dock to log an episode of an active series directly, triggering instant +15 XP gain, toast feedback, and level progress bar updates.
2. **Library Management & Skeleton Loading**:
   - Navigate to **My List** to test Anime/Manga switching, status filters (*Watching, Completed, On Hold, Dropped, Plan to Watch*), and Grid vs. Table views.
   - Experience the zero-flicker shimmer skeleton transition while data organizes.
3. **Stream Launcher & 2-Way Sync**:
   - Open any anime detail modal or click **Stream & Sync** in the floating pill dock.
   - Test one-click external search & launch for **Crunchyroll**, **Netflix**, **Aniwave**, **HiAnime**, **Hanime**, and **Anikoto**.
   - Test MAL / AniList export or 2-way simulated sync.
4. **Gamification & Identity Card**:
   - Visit the **Profile** view to inspect Ashok Rimal's Level 8 milestone banner, XP progression bar, and 15 tiered achievement badges.
   - Open the **Anime Identity Card** to preview and copy the celestial share card showing rank, personality archetype, and top 3 spotlight posters.

### Visual Identity & Theme
- **Color Tokens**:
  - Background: `#0F1016` (deep obsidian canvas)
  - Cards & Containers: `#181A26` with subtle single-elevation `#2A2F45` borders
  - Accents: `#6366F1` (Indigo), `#8B5CF6` (Violet), `#EC4899` (Pink/Rose)
- **Typography & Anti-Slop Discipline**:
  - Headers & Display: Plus Jakarta Sans with bold weights
  - Technical Counters: JetBrains Mono for episode numbers, scores, and XP chips
  - Metadata: Zero static pill badges; unboxed text separated with subtle `·` glyphs
- **Responsive Adaptability**:
  - Desktop: 3-column dashboard with cinematic hero banner and live social feed
  - Mobile: Aqua Dynamics floating pill dock with safe-area spacing and touch-optimized action sheets

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Client-Side Reactive Storage with Jikan API Fallback**
  - *Chosen Approach*: Persist all user library edits, comments, likes, and XP gains in reactive `localStorage`, supplemented by live live Jikan API queries for real-time external title discovery.
  - *Why*: Instantaneous sub-10ms UI updates without server latency or broken keys, while allowing users to search titles outside the initial database.
- **Decision 2: Floating Pill Dock (ColorOS 17 & iOS Native Feel)**
  - *Chosen Approach*: Persistent frosted pill navbar anchored at the bottom center with an expandable shortcuts sheet and quick-logger stepper.
  - *Why*: Maximizes thumb-reach accessibility on mobile screens while preserving clean viewport space on desktop.
- **Decision 3: Tiered Gamification Curve**
  - *Chosen Approach*: Weighted XP formula with milestone thresholds every level and distinct badge tiers (Bronze, Silver, Gold, Platinum).
  - *Why*: Rewards varied engagement (reading, bingeing, reviewing, and curating) rather than just passive watching.

---

## 4. Technical Architecture & Component Flow

```
┌────────────────────────────────────────────────────────────────────────┐
│                          App Shell (App.tsx)                           │
├──────────────────┬─────────────────────────────────┬───────────────────┤
│ Top Navbar       │ Main View Router                │ Floating Pill Dock│
│ - Brand Logo     │ - HomeView (Hero + Feed)        │ - Quick View Nav  │
│ - XP/Level Chip  │ - DiscoverView (Search + Filter)│ - Quick +1 Logger │
│ - Search Bar     │ - MyListView (Table / Grid)     │ - Identity Card   │
│ - Stream/Sync    │ - ProfileView (Gamification)    │ - Stream Sync Hub │
│ - User Switcher  │ - Calendar & Community Views    │ - Surprise Me     │
└────────┬─────────┴────────────────┬────────────────┴─────────┬─────────┘
         │                          │                          │
         ▼                          ▼                          ▼
┌──────────────────┐      ┌──────────────────┐       ┌──────────────────┐
│  Modal Overlays  │      │ Skeleton Loaders │       │ State Engine     │
│ - AnimeDetail    │      │ - HomeSkeleton   │       │ - AppContext     │
│ - AddToList      │      │ - DiscoverSkel   │       │ - Gamification   │
│ - StreamingSync  │      │ - MyListSkel     │       │ - LocalStorage   │
│ - LevelUpModal   │      │ - CardSkeleton   │       │ - Live Toasts    │
└──────────────────┘      └──────────────────┘       └──────────────────┘
```

### Verification & Testing Checklist
- [x] Compilation & TypeScript typing verification (`tsc --noEmit` and Vite build).
- [x] Initial demo profile configured with Ashok Rimal, Level 8, 4,890 XP, badges, and watchlist.
- [x] Floating Pill Dock shortcuts operational (+1 episode increment, streaming sync, randomizer).
- [x] Shimmer skeleton screens display on Home, Discover, and MyList views.
- [x] External streaming links generate correct search queries for Crunchyroll, Netflix, Aniwave, HiAnime, Hanime, and Anikoto.
- [x] 2-way sync simulation and JSON backup exports working.
