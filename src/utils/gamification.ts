/**
 * Gamification Engine - Levels, XP, Badges, and Real-time Progression Tracking
 */

import { LibraryEntry, MediaReview, MediaItem, UserBadge, GamificationState, BadgeTier, BadgeCategory } from '../types';

export interface LevelMilestone {
  level: number;
  minXp: number;
  title: string;
  perk: string;
}

// Level brackets with prestige titles and unlockable perks
export const LEVEL_MILESTONES: LevelMilestone[] = [
  { level: 1, minXp: 0, title: 'Novice Watcher', perk: 'Custom profile setup & watchlist creation' },
  { level: 2, minXp: 200, title: 'Apprentice Otaku', perk: 'Unlock review ratings & pros/cons' },
  { level: 3, minXp: 500, title: 'Active Streamer', perk: 'Community poll creation unlocked' },
  { level: 5, minXp: 1200, title: 'Seasoned Binge-Watcher', perk: 'Custom collection curations & reordering' },
  { level: 8, minXp: 2400, title: 'Sakuga Veteran', perk: 'Holographic Anime Identity Card export' },
  { level: 12, minXp: 4200, title: 'Cinematic Purist', perk: 'Verified reviewer priority sorting' },
  { level: 15, minXp: 6000, title: 'Otaku Scholar', perk: 'Golden profile border & animated avatar ring' },
  { level: 18, minXp: 8000, title: 'Anime Sage', perk: 'Platinum star badge & early preview access' },
  { level: 22, minXp: 11000, title: 'Mythic Lorekeeper', perk: 'Diamond crest & community spotlight' },
  { level: 30, minXp: 16000, title: 'Otaku Sovereign', perk: 'Cosmic holographic card frame & mythic status' }
];

export const BADGE_DEFINITIONS: Omit<UserBadge, 'unlocked' | 'unlockedAt' | 'currentProgress'>[] = [
  // Episode Tracking Badges
  {
    id: 'ep_initiate',
    name: 'Binge Initiate',
    description: 'Log at least 10 anime episodes in your library',
    icon: 'Play',
    category: 'episodes',
    tier: 'bronze',
    xpReward: 50,
    requiredProgress: 10,
    unit: 'episodes'
  },
  {
    id: 'ep_centurion',
    name: 'Centurion Watcher',
    description: 'Log 100 anime episodes across all series',
    icon: 'Flame',
    category: 'episodes',
    tier: 'silver',
    xpReward: 150,
    requiredProgress: 100,
    unit: 'episodes'
  },
  {
    id: 'ep_veteran',
    name: '500 Club',
    description: 'Watch 500 episodes of world-class animation',
    icon: 'Zap',
    category: 'episodes',
    tier: 'gold',
    xpReward: 350,
    requiredProgress: 500,
    unit: 'episodes'
  },
  {
    id: 'ep_thousand',
    name: 'Thousand Leagues',
    description: 'Log 1,000 anime episodes of epic journeys',
    icon: 'Crown',
    category: 'episodes',
    tier: 'platinum',
    xpReward: 750,
    requiredProgress: 1000,
    unit: 'episodes'
  },

  // Manga Tracking Badges
  {
    id: 'manga_first',
    name: 'First Page Turned',
    description: 'Read your first manga or manhwa chapter',
    icon: 'BookOpen',
    category: 'manga',
    tier: 'bronze',
    xpReward: 40,
    requiredProgress: 1,
    unit: 'chapters'
  },
  {
    id: 'manga_devotee',
    name: 'Manga Devotee',
    description: 'Read 250 chapters across serialized manga or manhwa',
    icon: 'Bookmark',
    category: 'manga',
    tier: 'silver',
    xpReward: 200,
    requiredProgress: 250,
    unit: 'chapters'
  },
  {
    id: 'manga_scholar',
    name: 'Scroll Scholar',
    description: 'Read 500 chapters of illustrated masterpieces',
    icon: 'Scroll',
    category: 'manga',
    tier: 'gold',
    xpReward: 400,
    requiredProgress: 500,
    unit: 'chapters'
  },

  // Review & Criticism Badges
  {
    id: 'rev_critic',
    name: "Aspiring Critic",
    description: 'Publish your first in-depth review with ratings & pros/cons',
    icon: 'PenTool',
    category: 'reviews',
    tier: 'bronze',
    xpReward: 100,
    requiredProgress: 1,
    unit: 'reviews'
  },
  {
    id: 'rev_quill',
    name: "Critic's Quill",
    description: 'Author 3 community-rated reviews',
    icon: 'Feather',
    category: 'reviews',
    tier: 'silver',
    xpReward: 250,
    requiredProgress: 3,
    unit: 'reviews'
  },
  {
    id: 'rev_scholar',
    name: 'Grand Essayist',
    description: 'Write 5 comprehensive analytical reviews',
    icon: 'Sparkles',
    category: 'reviews',
    tier: 'gold',
    xpReward: 500,
    requiredProgress: 5,
    unit: 'reviews'
  },

  // Series Completion Badges
  {
    id: 'comp_first',
    name: 'Curtain Call',
    description: 'Complete your first entire anime or manga series',
    icon: 'CheckCircle',
    category: 'completion',
    tier: 'bronze',
    xpReward: 75,
    requiredProgress: 1,
    unit: 'series'
  },
  {
    id: 'comp_five',
    name: 'Marathon Runner',
    description: 'Finish 5 full anime or manga series from start to finish',
    icon: 'Trophy',
    category: 'completion',
    tier: 'silver',
    xpReward: 250,
    requiredProgress: 5,
    unit: 'series'
  },
  {
    id: 'comp_fifteen',
    name: 'Master of Conclusions',
    description: 'Finish 15 full series in your personal archive',
    icon: 'Shield',
    category: 'completion',
    tier: 'gold',
    xpReward: 600,
    requiredProgress: 15,
    unit: 'series'
  },

  // Special Badges
  {
    id: 'spec_legends',
    name: 'Tier of Legends',
    description: 'Award a perfect 10/10 rating to at least 3 masterworks',
    icon: 'Star',
    category: 'special',
    tier: 'diamond',
    xpReward: 500,
    requiredProgress: 3,
    unit: '10/10 scores'
  },
  {
    id: 'spec_polymath',
    name: 'Genre Connoisseur',
    description: 'Track titles across at least 5 different anime/manga genres',
    icon: 'Compass',
    category: 'special',
    tier: 'gold',
    xpReward: 350,
    requiredProgress: 5,
    unit: 'genres'
  },
  {
    id: 'spec_founder',
    name: 'Founding Member',
    description: 'KuroList early access explorer badge',
    icon: 'Award',
    category: 'special',
    tier: 'mythic',
    xpReward: 500,
    requiredProgress: 1,
    unit: 'founder'
  }
];

/**
 * Calculate user gamification state from their actual library entries and reviews
 */
export function calculateGamification(
  userId: string,
  library: LibraryEntry[],
  reviews: MediaReview[],
  mediaItems: MediaItem[],
  baseBonusXp: number = 850
): GamificationState {
  const userLibrary = library.filter(e => e.userId === userId);
  const userReviews = reviews.filter(r => r.userId === userId);

  // 1. Calculate raw progress metrics
  let episodesWatched = 0;
  let chaptersRead = 0;
  let seriesCompleted = 0;
  let perfectScores = 0;
  const loggedGenres = new Set<string>();

  userLibrary.forEach(entry => {
    if (entry.mediaType === 'anime') {
      episodesWatched += entry.progress || 0;
    } else {
      chaptersRead += entry.progress || 0;
    }

    if (entry.status === 'completed') {
      seriesCompleted += 1;
    }

    if (entry.score >= 10) {
      perfectScores += 1;
    }

    const media = mediaItems.find(m => m.id === entry.mediaId);
    if (media && media.genres) {
      media.genres.forEach(g => loggedGenres.add(g));
    }
  });

  const reviewsWritten = userReviews.length;

  // 2. Compute dynamic badges with real progress tracking
  const computedBadges: UserBadge[] = BADGE_DEFINITIONS.map(def => {
    let currentProgress = 0;

    switch (def.id) {
      case 'ep_initiate':
      case 'ep_centurion':
      case 'ep_veteran':
      case 'ep_thousand':
        currentProgress = episodesWatched;
        break;
      case 'manga_first':
      case 'manga_devotee':
      case 'manga_scholar':
        currentProgress = chaptersRead;
        break;
      case 'rev_critic':
      case 'rev_quill':
      case 'rev_scholar':
        currentProgress = reviewsWritten;
        break;
      case 'comp_first':
      case 'comp_five':
      case 'comp_fifteen':
        currentProgress = seriesCompleted;
        break;
      case 'spec_legends':
        currentProgress = perfectScores;
        break;
      case 'spec_polymath':
        currentProgress = loggedGenres.size;
        break;
      case 'spec_founder':
        currentProgress = 1;
        break;
      default:
        currentProgress = 0;
    }

    const req = def.requiredProgress || 1;
    const unlocked = currentProgress >= req;

    return {
      ...def,
      currentProgress: Math.min(req, currentProgress),
      unlocked,
      unlockedAt: unlocked ? 'Verified' : undefined
    };
  });

  // 3. Compute Total XP
  // - 15 XP per episode watched
  // - 10 XP per chapter read
  // - 150 XP per series completed
  // - 200 XP per review written
  // - Badge XP bonuses
  const xpFromEpisodes = episodesWatched * 15;
  const xpFromChapters = chaptersRead * 10;
  const xpFromCompletions = seriesCompleted * 150;
  const xpFromReviews = reviewsWritten * 200;
  const xpFromBadges = computedBadges.filter(b => b.unlocked).reduce((sum, b) => sum + (b.xpReward || 0), 0);

  const totalXp = baseBonusXp + xpFromEpisodes + xpFromChapters + xpFromCompletions + xpFromReviews + xpFromBadges;

  // 4. Derive Level and Milestone
  let currentLevel = 1;
  let currentMilestone = LEVEL_MILESTONES[0];
  let nextMilestone = LEVEL_MILESTONES[1];

  for (let i = LEVEL_MILESTONES.length - 1; i >= 0; i--) {
    if (totalXp >= LEVEL_MILESTONES[i].minXp) {
      currentMilestone = LEVEL_MILESTONES[i];
      currentLevel = currentMilestone.level;
      nextMilestone = LEVEL_MILESTONES[i + 1] || {
        level: currentLevel + 1,
        minXp: currentMilestone.minXp + 2500,
        title: 'Mythic Legend',
        perk: 'Ultimate Prestige'
      };
      break;
    }
  }

  // Calculate percentage within the current level tier
  const tierXpRange = nextMilestone.minXp - currentMilestone.minXp;
  const xpIntoCurrentTier = Math.max(0, totalXp - currentMilestone.minXp);
  const levelProgressPercent = Math.min(100, Math.max(0, Math.round((xpIntoCurrentTier / tierXpRange) * 100)));

  return {
    level: currentLevel,
    title: currentMilestone.title,
    totalXp,
    currentLevelXp: totalXp,
    nextLevelThresholdXp: nextMilestone.minXp,
    levelProgressPercent,
    episodesWatched,
    chaptersRead,
    reviewsWritten,
    seriesCompleted,
    badges: computedBadges,
    unlockedBadgesCount: computedBadges.filter(b => b.unlocked).length,
    totalBadgesCount: computedBadges.length
  };
}

/**
 * Returns badge styling colors and border glows by tier
 */
export function getTierColors(tier: BadgeTier) {
  switch (tier) {
    case 'bronze':
      return {
        bg: 'bg-amber-950/20',
        border: 'border-amber-700/40',
        text: 'text-amber-500',
        glow: 'shadow-amber-900/20'
      };
    case 'silver':
      return {
        bg: 'bg-slate-800/30',
        border: 'border-slate-400/40',
        text: 'text-slate-200',
        glow: 'shadow-slate-500/20'
      };
    case 'gold':
      return {
        bg: 'bg-amber-500/15',
        border: 'border-amber-400/50',
        text: 'text-amber-300',
        glow: 'shadow-amber-500/30'
      };
    case 'platinum':
      return {
        bg: 'bg-cyan-500/15',
        border: 'border-cyan-400/50',
        text: 'text-cyan-300',
        glow: 'shadow-cyan-500/30'
      };
    case 'diamond':
      return {
        bg: 'bg-indigo-500/20',
        border: 'border-indigo-400/60',
        text: 'text-indigo-300',
        glow: 'shadow-indigo-500/40'
      };
    case 'mythic':
      return {
        bg: 'bg-gradient-to-br from-violet-600/20 to-rose-600/20',
        border: 'border-violet-400/60',
        text: 'text-violet-200',
        glow: 'shadow-violet-600/40'
      };
  }
}
