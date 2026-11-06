# KuroList - UI & UX Master Architecture Specification

This specification documents the product design system, interaction rules, and visual guidelines derived from the **MyAnimeList - NextGen Anime & Manga Social Platform UI/UX Master Prompt** and platform architectural decisions.

---

## 1. Core Visual Principles & Anti-Slop Discipline

### A. Zero-Pill & Metadata Discipline
- **No Static Pill Enclosures**: Never wrap metadata (genres, dates, statuses, episode counts, scores, publication years) in rounded pill badges, bordered chips, or colored candy capsules.
- **Unboxed Typographic Metadata**: All metadata must be rendered as clean text with subtle typographic separators (`·`, `•`, `/`).
- **Functional Segmented Controls**: Rounded buttons are permitted exclusively for interactive filters or tabs (e.g. Anime vs Manga toggle, All/Airing/Completed filter chips) that have working `onClick` handlers.
- **Header Discipline**: The top navigation bar sits cleanly at the top of the viewport. Nothing is rendered above the top navbar.

### B. Color Tokens (Midnight Indigo Theme)
- **Main Background**: `#0F1016` / `#0B0D14` (Deep obsidian dark)
- **Secondary Background**: `#131520` / `#10131D`
- **Elevated Surfaces**: `#181A26` / `#161824`
- **Card & Border Accents**: `#2A2F45` / `#25283C`
- **Primary Indigo**: `#6366F1` / `#7775F7` (Indigo-500/600)
- **Primary Hover**: `#4F46E5` / `#9290FF`
- **Warning / Flame**: `#F59E0B` / `#FBBF24` (Amber/Orange)
- **Danger / Love**: `#F43F5E` / `#F87171` (Rose)
- **Success / Completed**: `#10B981` / `#34D399` (Emerald)

---

## 2. Page-by-Page Layout Architecture

### A. Top Navigation Bar
- Fixed or sticky top bar (72px height on desktop).
- **Left**: Brand logo (`KuroList`), brand icon, main navigation links (Home, Discover, Schedule, My Library, Community).
- **Center**: Quick global search and command palette trigger (`Cmd+K`).
- **Right**: Offline sync status indicator, PWA install button, Notification bell with unread count, and User profile avatar dropdown.
- **Rule**: No floating banners, pill bars, or secondary ribbons are permitted above the top navbar.

### B. Home Dashboard
- **Primary Focus**: Discovery, Continue Tracking, and Trending Releases.
- **Hero Banner**: Cinematic landscape background with dark gradient overlay, poster, title, short synopsis, score, and action CTAs (*View Details*, *Track Progress*, *Anime Identity Card*).
- **Continue Tracking Shelf**: 1-tap progress steppers (`+1 Ep` / `+1 Ch`) for active series in the user's library with animated progress bars.
- **Full-Width Trending Showcases**:
  - Trending Anime (6-column responsive grid on desktop)
  - Popular Manga & Manhwa (6-column responsive grid on desktop)
- **Rule**: Social activity feeds are **NOT** displayed on the homepage. Activity feeds belong strictly within the Community view.
- **Rule**: The visual streak counter is **NOT** displayed on the homepage. It belongs strictly within the User Profile view.

### C. Discover Page
- **Search Header**: Large interactive search input with instant clear (`×`) button.
- **Search History & Autocomplete Dropdown**:
  - Opens automatically on focus.
  - Lists recent user queries from local storage (`kuro_discover_recent_searches`) with individual delete and *Clear all* options.
  - Live anime/manga title suggestions with thumbnail posters and scores while typing.
  - Popular/trending search tags (e.g. *Solo Leveling*, *Frieren*, *Jujutsu Kaisen*).
- **Filter Bar**: 1-tap quick filters (*All*, *Airing Now*, *Top Rated*, *Most Popular*, *Manga & Manhwa*) and multi-dimensional controls (genre, status, format, minimum score).

### D. Anime & Manga Cards
- **Single Status Button**:
  - The top-right **heart-shaped button** is the single dedicated control for setting or updating status and managing favorites.
  - Tapping opens the *Add / Edit Status* modal (`openAddToListModal`).
  - Highlights in indigo when in library and rose when marked as favorite.
- **Rule**: **No duplicate `+ Add` button** is rendered on the poster overlay when the heart-shaped button is present.
- **Direct 1-Tap Steppers**: Watching/reading items show `+1 Ep / +1 Ch` buttons directly beneath the title for instant logging.

### E. User Profile Page (Personal Anime Identity)
- **Banner & Avatar**: Full-width header banner with overlapping avatar, level badge (`Lv.X`), and title.
- **Level & XP Progression**: Interactive bar showing total XP, threshold to next level, and dynamic milestone counters (episodes, chapters, reviews, badges).
- **Active Habit Streak Counter (`StreakCounterCard`)**:
  - Displayed prominently in the **Profile Overview tab** alongside personal stats.
  - Features animated flame icon, consecutive active days, daily goal progress bar (`X / 3 logged today`), 7-day rolling calendar track, and personal best longest streak.
- **Profile Tabs**: Overview, Anime, Manga, Favorites, Reviews, Stats, and Badges & Achievements.

### F. Community View
- **Section Switcher Tabs**:
  1. **Discussions & Forums**: Category filters, user-created discussion threads, spoiler masking, and live community voting polls.
  2. **Live Activity Feed**: Centralized social stream showing friends' watching milestones, ratings, reviews, interactive likes, and comment threads.

---

## 3. Mobile & Tactile Interactions

### A. Android Bottom Navigation
- Full-width docked navigation with Material 3 active pill containers and touch targets $\ge 48\text{px}$.
- Respects device safe-area bottom padding.
- 5 primary tabs: *Home*, *Discover*, *My List*, *Community*, *Profile*.

### B. Tactile Haptic Feedback (Vibration API)
- Implemented via `triggerHaptic()` in `src/utils/haptics.ts`.
- **Navigation Tabs**: Subtle 10ms crisp mechanical tap on tab press (`pointerdown`).
- **Active Tab Tap**: Quick double pulse (`[8ms, 35ms, 8ms]`) when tapping the currently active tab.
- **Quick Steppers**: Subtle 8ms tick on `+1 Ep / +1 Ch` logging.

---

## 4. Offline & Progressive Web App (PWA) Capabilities

- **Service Worker & Workbox**: Configured in `vite.config.ts` with `registerType: 'autoUpdate'`.
- **Runtime Caching**:
  - Cover images from `cdn.myanimelist.net` and `images.unsplash.com` cached via `CacheFirst` (up to 500 entries, 30 days retention).
  - Jikan API anime discovery responses cached via `NetworkFirst` (3s timeout fallback).
- **Local Persistence**: User watchlists, streaks, search history, and reviews persist in `localStorage` and memory.
