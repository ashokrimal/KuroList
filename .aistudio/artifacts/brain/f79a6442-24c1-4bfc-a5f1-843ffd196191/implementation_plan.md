# Relocate Streak Counter to Profile Page & UI/UX Memory Alignment

Relocate the visual active tracking streak counter from the home dashboard to the user profile overview page, ensuring the home page remains focused on discovery, continue tracking, and trending releases while the profile page serves as the centralized personal identity and habit tracking hub.

## User Review & Critical Decisions

> [!IMPORTANT]
> The following architectural and layout decisions have been confirmed through user clarification:

- **Confirmed Decision 1**: The streak counter will be placed as a prominent habit card inside the **Profile Overview tab** alongside personal statistics and dynamic milestone counters.
- **Confirmed Decision 2**: The streak counter (both full card and compact badge) will be **completely removed from the home page**, maintaining a clean, editorial homepage focused on featured titles and continue tracking.
- **Confirmed Decision 3**: UI/UX Master Prompt guidelines from the provided PDF specification will be permanently documented in an updated memory reference (`UI_UX_SPECIFICATION.md`) for architectural consistency.

---

## 1. Overview & Core Concept

- **What It Does**: Moves the interactive `StreakCounterCard` (consecutive days tracked, daily episode/chapter progress bar, and 7-day visual week history) from `HomeView.tsx` into `ProfileView.tsx`. In the Profile Overview tab, users will now see their active habit streak alongside their level XP, episodes watched, chapters read, and badges.
- **Target Audience / Persona**: Anime & manga fans who take pride in daily tracking habits, profile customization, and gamification progression.
- **Key Value**: Streamlines the home page to focus strictly on content discovery, watchlist resumption, and seasonal recommendations, while centralizing all habit, streak, XP, and milestone metrics in the user's personal profile space.

---

## 2. User Experience & Visual Design

### Key User Flows
1. **Home Experience**:
   - The user opens KuroList and lands on a focused, cinematic home dashboard.
   - The hero banner displays clean title metadata, rating, studio, and action CTAs without streak pill distractions.
   - The dashboard transitions directly into *Continue Tracking* shelf and full-width *Trending Anime & Manga* showcases.
2. **Profile Experience**:
   - Navigating to **Profile** (via top avatar dropdown or bottom navigation tab) reveals the user's banner, avatar, level, and XP progression.
   - Under the Overview tab, right alongside the milestone counters, the user sees their **Active Habit Streak Card**:
     - Animated amber/orange glowing flame badge (`Flame`)
     - Consecutive active days count (e.g. *6 Days Streak* with *On Fire* badge)
     - Real-time daily goal progress bar (`X / 3 logged today`)
     - 7-day rolling calendar track (Mon–Sun) with completion checkmarks and today's active ring
     - Personal best counter (*Longest Streak*)

### Visual Identity & Theme Tokens
- **Backgrounds**: Deep obsidian surfaces (`#181A26` and `#131520`) with subtle border lines (`#2A2F45`).
- **Accents**: Warm amber/orange glow (`#F59E0B`, `#EA580C`) for fire and streaks; indigo accents (`#6366F1`) for primary actions.
- **Typography & Hierarchy**: Clean unboxed typography conforming to the Zero-Pill discipline (§1.A).

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Relocating Streak Counter from Home to Profile**:
  - *Chosen Approach*: Completely remove `StreakCounterCard` from `HomeView.tsx` (both the hero metadata chip and the section card) and render it in `ProfileView.tsx` within the Overview tab.
  - *Why*: Aligns with the UI/UX specification where the homepage is dedicated to discovery and continue watching, while the profile page is the primary personal showcase for habits, stats, and identity.
  - *Alternatives Considered*: Keeping a compact flame pill in the hero banner was rejected per user preference to keep the homepage 100% clean.

- **Decision 2: UI/UX Guidelines Documentation**:
  - *Chosen Approach*: Create a persistent specification reference `UI_UX_SPECIFICATION.md` detailing the visual principles, color tokens, layout hierarchy, and component rules from the MAL NextGen UI/UX Master Prompt.
  - *Why*: Prevents regression on future turns and locks in design standards (no pill wrappers around metadata, no activity on home page, touch targets $\ge 44\text{px}$, haptic triggers).

---

## 4. Technical Architecture & Component Flow

```
┌─────────────────────────────────────────────────────────────┐
│                       AppContext                            │
│  - streak: StreakState (consecutive days, daily goal, days) │
│  - library: LibraryEntry[]                                   │
│  - incrementProgress() -> updates library & logs streak      │
└──────────────┬───────────────────────────────┬──────────────┘
               │                               │
               ▼                               ▼
       ┌───────────────┐              ┌────────────────┐
       │   HomeView    │              │  ProfileView   │
       │ (Cleaned Up)  │              │ (Overview Tab) │
       ├───────────────┤              ├────────────────┤
       │ - Hero Banner │              │ - Banner/Avatar│
       │ - Continue    │              │ - Level & XP   │
       │   Tracking    │              │ - Streak Card  │
       │ - Trending    │              │   (🔥 6 Days)  │
       │   Grids       │              │ - Stats Strip  │
       └───────────────┘              │ - Favorites    │
                                      └────────────────┘
```

### Component & State Changes:
1. `src/views/HomeView.tsx`:
   - Remove `StreakCounterCard` import.
   - Remove `<StreakCounterCard streak={streak} compact />` from the hero metadata line.
   - Remove the Section 2 `<StreakCounterCard streak={streak} />` block.
2. `src/views/ProfileView.tsx`:
   - Import `StreakCounterCard` from `../components/StreakCounterCard`.
   - Access `streak` from `useApp()`.
   - In the `activeTab === 'overview'` section (when viewing one's own profile `isSelf`), render `StreakCounterCard` prominently directly above or alongside the favorite media section and recent activity.
3. `UI_UX_SPECIFICATION.md`:
   - Document the core design philosophy, color system tokens, layout hierarchy, and interaction rules from the master prompt for memory persistence.
