/**
 * KuroList - Types and Data Models
 */

export type MediaType = 'anime' | 'manga' | 'manhwa' | 'light_novel';

export type MediaFormat = 'TV' | 'Movie' | 'OVA' | 'ONA' | 'Special' | 'Manga' | 'Manhwa' | 'Light Novel';

export type MediaStatus = 'airing' | 'finished' | 'upcoming' | 'publishing' | 'on_hiatus';

export type WatchStatus = 'watching' | 'completed' | 'on_hold' | 'dropped' | 'plan_to_watch';
export type ReadStatus = 'reading' | 'completed' | 'on_hold' | 'dropped' | 'plan_to_read';
export type LibraryStatus = WatchStatus | ReadStatus;

export interface CharacterRole {
  id: string;
  name: string;
  role: 'Main' | 'Supporting';
  image: string;
  voiceActor?: {
    name: string;
    language: string;
    image: string;
  };
}

export interface RelatedMedia {
  id: string;
  title: string;
  relation: string;
  type: MediaType;
  coverImage: string;
}

export interface RecommendationItem {
  id: string;
  title: string;
  coverImage: string;
  score: number;
  format: string;
}

export interface MediaItem {
  id: string;
  malId?: number;
  title: string;
  titleRomaji?: string;
  titleJapanese?: string;
  type: MediaType;
  format: MediaFormat;
  status: MediaStatus;
  episodes?: number;
  chapters?: number;
  volumes?: number;
  duration?: string;
  season?: string;
  year?: number;
  score: number;
  rank: number;
  popularity: number;
  members: number;
  synopsis: string;
  genres: string[];
  studios: string[];
  authors?: string[];
  coverImage: string;
  bannerImage: string;
  trailerUrl?: string;
  airingDay?: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  airingTime?: string;
  nextEpisode?: number;
  characters?: CharacterRole[];
  related?: RelatedMedia[];
  recommendations?: RecommendationItem[];
}

export interface LibraryEntry {
  id: string;
  userId: string;
  mediaId: string;
  mediaType: MediaType;
  status: LibraryStatus;
  progress: number; // episodes or chapters
  totalProgress: number; // total episodes or chapters
  volumesRead?: number;
  score: number; // 0 to 10
  notes?: string;
  isFavorite: boolean;
  startDate?: string;
  finishDate?: string;
  customTags?: string[];
  createdAt: string;
  updatedAt: string;
}

export type BadgeCategory = 'episodes' | 'manga' | 'reviews' | 'completion' | 'special';
export type BadgeTier = 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond' | 'mythic';

export interface UserBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category?: BadgeCategory;
  tier: BadgeTier;
  xpReward?: number;
  unlocked?: boolean;
  unlockedAt?: string;
  currentProgress?: number;
  requiredProgress?: number;
  unit?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  tier: 'bronze' | 'silver' | 'gold' | 'diamond';
  xp: number;
  unlocked: boolean;
  unlockedAt?: string;
  progress: number;
  maxProgress: number;
}

export interface GamificationState {
  level: number;
  title: string;
  totalXp: number;
  currentLevelXp: number;
  nextLevelThresholdXp: number;
  levelProgressPercent: number;
  episodesWatched: number;
  chaptersRead: number;
  reviewsWritten: number;
  seriesCompleted: number;
  badges: UserBadge[];
  unlockedBadgesCount: number;
  totalBadgesCount: number;
}

export interface AnimePersonality {
  title: string;
  tagline: string;
  dominantGenre: string;
  watchingPace: 'Binge Master' | 'Seasonal Follower' | 'Selective Critic' | 'Deep Thinker';
  vibeDescription: string;
  compatibleArchetypes: string[];
}

export interface UserProfile {
  id: string;
  username: string;
  displayName: string;
  email: string;
  avatar: string;
  banner: string;
  bio: string;
  country: string;
  joinDate: string;
  isOnline: boolean;
  role: 'user' | 'moderator' | 'admin';
  level: number;
  xp: number;
  nextLevelXp: number;
  badges: UserBadge[];
  achievements: Achievement[];
  followersCount: number;
  followingCount: number;
  personality: AnimePersonality;
  favoriteMediaIds: string[];
  favoriteCharacterNames: string[];
  favoriteStudios: string[];
  privacy: {
    publicLibrary: boolean;
    publicFavorites: boolean;
    publicActivity: boolean;
  };
}

export interface ActivityComment {
  id: string;
  userId: string;
  username: string;
  displayName: string;
  avatar: string;
  text: string;
  timestamp: string;
}

export interface SocialActivity {
  id: string;
  userId: string;
  username: string;
  displayName: string;
  avatar: string;
  type: 'status_update' | 'progress_update' | 'completed' | 'rated' | 'reviewed' | 'favorite';
  mediaId: string;
  mediaTitle: string;
  mediaCover: string;
  mediaType: MediaType;
  progress?: number;
  totalProgress?: number;
  score?: number;
  reviewSnippet?: string;
  timestamp: string;
  likes: string[]; // userIds who liked
  comments: ActivityComment[];
}

export interface ReviewComment {
  id: string;
  userId: string;
  username: string;
  displayName: string;
  avatar: string;
  content: string;
  createdAt: string;
}

export interface MediaReview {
  id: string;
  mediaId: string;
  mediaTitle: string;
  mediaCover: string;
  mediaType: MediaType;
  userId: string;
  username: string;
  displayName: string;
  avatar: string;
  rating: number; // 1-10
  title: string;
  content: string;
  pros: string[];
  cons: string[];
  hasSpoilers: boolean;
  helpfulCount: number;
  likedBy: string[]; // userIds
  comments: ReviewComment[];
  createdAt: string;
}

export interface CustomCollection {
  id: string;
  userId: string;
  username: string;
  title: string;
  description: string;
  isPublic: boolean;
  itemIds: string[];
  coverImage?: string;
  createdAt: string;
}

export interface TopicReply {
  id: string;
  authorId: string;
  username: string;
  displayName: string;
  avatar: string;
  content: string;
  createdAt: string;
  likes: string[];
  hasSpoiler?: boolean;
}

export interface CommunityTopic {
  id: string;
  title: string;
  category: 'General' | 'Episode Reaction' | 'Theories' | 'Manga Discussion' | 'Recommendations';
  authorId: string;
  username: string;
  displayName: string;
  avatar: string;
  content: string;
  mediaTag?: {
    id: string;
    title: string;
  };
  replies: TopicReply[];
  viewsCount: number;
  isPinned?: boolean;
  createdAt: string;
  poll?: {
    question: string;
    options: {
      id: string;
      text: string;
      votes: number;
    }[];
    userVotedOptionId?: string;
  };
}

export interface AppNotification {
  id: string;
  type: 'follow' | 'like' | 'comment' | 'achievement' | 'airing_reminder';
  actor: {
    username: string;
    displayName: string;
    avatar: string;
  };
  title: string;
  description: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}
