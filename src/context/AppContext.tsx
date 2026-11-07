/**
 * KuroList - Main Application Context and State Management
 */

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback, ReactNode } from 'react';
import {
  UserProfile,
  LibraryEntry,
  MediaItem,
  SocialActivity,
  MediaReview,
  CustomCollection,
  CommunityTopic,
  AppNotification,
  MediaType,
  LibraryStatus,
  Achievement,
  GamificationState,
  UserBadge
} from '../types';
import { calculateGamification } from '../utils/gamification';
import { StreakState, getInitialStreakState, logStreakActivity } from '../utils/streak';
import { INITIAL_MEDIA_ITEMS } from '../data/animeData';
import { CURRENT_USER, INITIAL_USER_LIBRARY, OTHER_USERS } from '../data/mockUsers';
import {
  fetchTrendingAnime,
  fetchUpcomingAnime,
  fetchTopManga,
  searchGlobalCatalog
} from '../services/animeCatalogService';
import {
  INITIAL_ACTIVITIES,
  INITIAL_REVIEWS,
  INITIAL_COLLECTIONS,
  INITIAL_TOPICS,
  INITIAL_NOTIFICATIONS
} from '../data/initialFeed';
import { User as FirebaseUser } from 'firebase/auth';
import {
  subscribeToAuth,
  signInWithGoogle,
  loginWithEmail,
  signUpWithEmail,
  resetUserPassword,
  updateUserPassword,
  updateUserAuthProfile,
  signOutUser,
  saveUserProfile,
  saveLibraryEntryToFirestore,
  removeLibraryEntryFromFirestore,
  fetchUserLibraryFromFirestore,
  saveReviewToFirestore,
  saveTopicToFirestore
} from '../services/firebaseService';
import { SyncUpdateItem, SyncAddItem } from '../utils/malSync';

interface AppContextType {
  // Current user & profiles
  currentUser: UserProfile;
  otherUsers: UserProfile[];
  activeProfileViewUser: UserProfile;
  setActiveProfileViewUser: (user: UserProfile) => void;
  switchUser: (user: UserProfile) => void;
  updateCurrentUser: (updates: Partial<UserProfile>) => void;
  updateUserProfileDataAction: (data: { displayName?: string; username?: string; bio?: string; avatar?: string; banner?: string }) => Promise<void>;
  updateUserPasswordAction: (newPassword: string) => Promise<void>;
  following: string[];
  toggleFollow: (userId: string) => void;

  // Firebase Auth
  firebaseUser: FirebaseUser | null;
  signInWithGoogleAction: () => Promise<void>;
  signInWithEmailAction: (email: string, pass: string) => Promise<void>;
  signUpWithEmailAction: (email: string, pass: string, username: string, displayName: string) => Promise<void>;
  resetPasswordAction: (email: string) => Promise<void>;
  signOutAction: () => Promise<void>;
  isFirebaseLoading: boolean;


  // Media catalog & live search
  mediaItems: MediaItem[];
  getMediaById: (id: string) => MediaItem | undefined;
  searchMedia: (query: string, type?: MediaType) => Promise<MediaItem[]>;
  isSearchingOnline: boolean;

  // Library
  library: LibraryEntry[];
  getLibraryEntry: (mediaId: string) => LibraryEntry | undefined;
  addOrUpdateLibraryEntry: (entry: Partial<LibraryEntry> & { mediaId: string; mediaType: MediaType }) => void;
  importBulkLibraryEntries: (entries: LibraryEntry[]) => void;
  applySyncDiffAction: (toUpdate: SyncUpdateItem[], toAdd: SyncAddItem[]) => void;
  removeLibraryEntry: (mediaId: string) => void;
  bulkUpdateLibraryEntries: (
    mediaIds: string[],
    updates: Partial<LibraryEntry> | ((entry: LibraryEntry) => Partial<LibraryEntry>)
  ) => void;
  bulkRemoveLibraryEntries: (mediaIds: string[]) => void;
  incrementProgress: (mediaId: string) => void;
  toggleFavorite: (mediaId: string) => void;

  // Social & Community
  activities: SocialActivity[];
  likeActivity: (activityId: string) => void;
  commentActivity: (activityId: string, text: string) => void;
  reviews: MediaReview[];
  addReview: (reviewData: { mediaId: string; rating: number; title: string; content: string; pros: string[]; cons: string[]; hasSpoilers: boolean }) => void;
  likeReview: (reviewId: string) => void;
  commentReview: (reviewId: string, content: string) => void;
  collections: CustomCollection[];
  createCollection: (title: string, description: string, itemIds: string[], isPublic?: boolean) => void;
  topics: CommunityTopic[];
  createTopic: (title: string, category: CommunityTopic['category'], content: string, mediaTagId?: string, pollData?: { question: string; options: string[] }) => void;
  replyTopic: (topicId: string, content: string, hasSpoiler?: boolean) => void;
  votePoll: (topicId: string, optionId: string) => void;

  // Notifications
  notifications: AppNotification[];
  unreadNotificationsCount: number;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;

  // Modals & Active View
  activeView: 'home' | 'discover' | 'seasonal' | 'mylist' | 'profile' | 'community' | 'collections';
  setActiveView: (view: 'home' | 'discover' | 'seasonal' | 'mylist' | 'profile' | 'community' | 'collections') => void;
  selectedMedia: MediaItem | null;
  setSelectedMedia: (media: MediaItem | null) => void;
  isAddToListOpen: boolean;
  setIsAddToListOpen: (open: boolean) => void;
  listModalMedia: MediaItem | null;
  openAddToListModal: (media: MediaItem) => void;
  isIdentityCardOpen: boolean;
  setIsIdentityCardOpen: (open: boolean) => void;
  isReviewModalOpen: boolean;
  setIsReviewModalOpen: (open: boolean) => void;
  reviewModalMedia: MediaItem | null;
  openReviewModal: (media: MediaItem) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  isAdminModalOpen: boolean;
  setIsAdminModalOpen: (open: boolean) => void;
  isNotificationsOpen: boolean;
  setIsNotificationsOpen: (open: boolean) => void;
  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (open: boolean | ((prev: boolean) => boolean)) => void;

  // Gamification & Progression System
  gamification: GamificationState;
  celebrationData: {
    type: 'level_up' | 'badge_unlocked';
    title: string;
    subtitle: string;
    xpEarned: number;
    level?: number;
    badge?: UserBadge;
  } | null;
  isCelebrationOpen: boolean;
  setIsCelebrationOpen: (open: boolean) => void;
  triggerCelebration: (data: {
    type: 'level_up' | 'badge_unlocked';
    title: string;
    subtitle: string;
    xpEarned: number;
    level?: number;
    badge?: UserBadge;
  }) => void;

  // Computed statistics
  stats: {
    animeCount: number;
    mangaCount: number;
    episodesWatched: number;
    chaptersRead: number;
    daysWatched: number;
    averageScore: number;
    completionRate: number;
    genreCounts: { [genre: string]: number };
    scoreDistribution: { [score: number]: number };
  };

  // Streak & Daily Tracking State
  streak: StreakState;
  recordDailyActivity: () => void;

  // Toast alert
  toast: { message: string; type: 'success' | 'info' | 'error' } | null;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
}

const GUEST_USER: UserProfile = {
  id: 'guest_user',
  username: 'guest',
  displayName: 'Anime Explorer',
  email: '',
  avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=guest',
  banner: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=1600&auto=format&fit=crop&q=80',
  bio: 'Sign in with Google or Email to track your personal anime & manga library, sync watchlists, and earn XP!',
  country: 'Global',
  joinDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
  isOnline: true,
  role: 'user',
  level: 1,
  xp: 0,
  nextLevelXp: 100,
  badges: [],
  achievements: [],
  followingCount: 0,
  followersCount: 0,
  personality: {
    title: 'Anime Explorer',
    tagline: 'Embarking on the anime discovery journey',
    dominantGenre: 'Action',
    watchingPace: 'Seasonal Follower',
    vibeDescription: 'Starting fresh. Discover real titles and log episodes.',
    compatibleArchetypes: ['Explorer']
  },
  favoriteMediaIds: [],
  favoriteCharacterNames: [],
  favoriteStudios: [],
  privacy: {
    publicLibrary: true,
    publicFavorites: true,
    publicActivity: true
  }
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Current user state (defaults to real guest user, not hardcoded mock with fake 14 levels)
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('kuro_current_user');
    return saved ? JSON.parse(saved) : GUEST_USER;
  });

  const [otherUsers] = useState<UserProfile[]>(OTHER_USERS);
  const [activeProfileViewUser, setActiveProfileViewUser] = useState<UserProfile>(currentUser);

  const [following, setFollowing] = useState<string[]>(() => {
    const saved = localStorage.getItem('kuro_following');
    return saved ? JSON.parse(saved) : [];
  });

  // Media catalog
  const [mediaItems, setMediaItems] = useState<MediaItem[]>(() => {
    const saved = localStorage.getItem('kuro_media_catalog');
    return saved ? JSON.parse(saved) : INITIAL_MEDIA_ITEMS;
  });

  // User library (defaults to empty array: zero fake placeholder titles)
  const [library, setLibrary] = useState<LibraryEntry[]>(() => {
    const saved = localStorage.getItem('kuro_library');
    return saved ? JSON.parse(saved) : [];
  });

  // Social feeds
  const [activities, setActivities] = useState<SocialActivity[]>(() => {
    const saved = localStorage.getItem('kuro_activities');
    return saved ? JSON.parse(saved) : INITIAL_ACTIVITIES;
  });

  const [reviews, setReviews] = useState<MediaReview[]>(() => {
    const saved = localStorage.getItem('kuro_reviews');
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  const [collections, setCollections] = useState<CustomCollection[]>(() => {
    const saved = localStorage.getItem('kuro_collections');
    return saved ? JSON.parse(saved) : INITIAL_COLLECTIONS;
  });

  const [topics, setTopics] = useState<CommunityTopic[]>(() => {
    const saved = localStorage.getItem('kuro_topics');
    return saved ? JSON.parse(saved) : INITIAL_TOPICS;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('kuro_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  // Navigation & Modals with URL Hash & Browser History Integration
  const validViews = ['home', 'discover', 'seasonal', 'mylist', 'profile', 'community', 'collections'] as const;
  type ValidViewType = typeof validViews[number];

  const getInitialView = (): ValidViewType => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '') as ValidViewType;
      if (validViews.includes(hash)) {
        return hash;
      }
    }
    return 'home';
  };

  const [activeView, setActiveViewState] = useState<ValidViewType>(getInitialView);

  const setActiveView = useCallback((view: ValidViewType) => {
    setActiveViewState(view);
    if (typeof window !== 'undefined' && window.location.hash !== `#${view}`) {
      window.history.pushState({ view }, '', `#${view}`);
    }
  }, []);

  // Listen for back/forward browser navigation & hash changes
  useEffect(() => {
    const handlePopState = () => {
      const hash = window.location.hash.replace('#', '') as ValidViewType;
      if (validViews.includes(hash)) {
        setActiveViewState(hash);
      } else {
        setActiveViewState('home');
      }
    };
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [isAddToListOpen, setIsAddToListOpen] = useState(false);
  const [listModalMedia, setListModalMedia] = useState<MediaItem | null>(null);
  const [isIdentityCardOpen, setIsIdentityCardOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewModalMedia, setReviewModalMedia] = useState<MediaItem | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isSearchingOnline, setIsSearchingOnline] = useState(false);

  // Global Keyboard Shortcuts (Cmd+K / Ctrl+K, '/', Esc)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K or Ctrl+K opens command palette
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
        return;
      }

      // '/' opens search if not currently typing in an input or textarea
      if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        e.preventDefault();
        setIsCommandPaletteOpen(true);
        return;
      }

      // Esc closes command palette
      if (e.key === 'Escape' && isCommandPaletteOpen) {
        setIsCommandPaletteOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandPaletteOpen]);

  // Gamification celebration state
  const [isCelebrationOpen, setIsCelebrationOpen] = useState(false);
  const [celebrationData, setCelebrationData] = useState<{
    type: 'level_up' | 'badge_unlocked';
    title: string;
    subtitle: string;
    xpEarned: number;
    level?: number;
    badge?: UserBadge;
  } | null>(null);

  const triggerCelebration = (data: {
    type: 'level_up' | 'badge_unlocked';
    title: string;
    subtitle: string;
    xpEarned: number;
    level?: number;
    badge?: UserBadge;
  }) => {
    setCelebrationData(data);
    setIsCelebrationOpen(true);
  };

  // Streak tracking state
  const [streak, setStreak] = useState<StreakState>(() => getInitialStreakState());

  const recordDailyActivity = () => {
    setStreak(prev => logStreakActivity(prev));
  };

  // Toast state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3200);
  };

  // Firebase Auth state & live synchronization
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isFirebaseLoading, setIsFirebaseLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToAuth(async (fUser) => {
      setFirebaseUser(fUser);
      if (fUser) {
        // Construct or load profile for the Firebase user
        const fProfile: UserProfile = {
          id: fUser.uid,
          username: (fUser.displayName || 'user').toLowerCase().replace(/\s+/g, '_').slice(0, 20),
          displayName: fUser.displayName || 'Anime Enthusiast',
          email: fUser.email || '',
          avatar: fUser.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${fUser.uid}`,
          banner: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=1600&auto=format&fit=crop&q=80',
          bio: 'Otaku and active member of the KuroList anime community.',
          country: 'Global',
          joinDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
          isOnline: true,
          role: 'user',
          level: 1,
          xp: 120,
          nextLevelXp: 500,
          badges: [],
          achievements: [],
          followingCount: 2,
          followersCount: 0,
          personality: {
            title: 'Anime Explorer',
            tagline: 'Embarking on the anime discovery journey',
            dominantGenre: 'Action',
            watchingPace: 'Binge Master',
            vibeDescription: 'Exploring worlds, tracking seasons, and sharing experiences.',
            compatibleArchetypes: ['Action Hero', 'Shonen Protagonist']
          },
          favoriteMediaIds: ['anime_1', 'anime_2'],
          favoriteCharacterNames: ['Gojo Satoru'],
          favoriteStudios: ['MAPPA', 'Ufotable'],
          privacy: {
            publicLibrary: true,
            publicFavorites: true,
            publicActivity: true
          }
        };

        setCurrentUser(fProfile);
        setActiveProfileViewUser(fProfile);
        saveUserProfile(fProfile).catch(() => {});

        // Load personal library from Firestore
        try {
          const cloudLibrary = await fetchUserLibraryFromFirestore(fUser.uid);
          setLibrary((cloudLibrary || []) as LibraryEntry[]);
        } catch (e) {
          console.warn('Could not load user library from Firestore:', e);
        }
      } else {
        // User is not signed into Firebase: enforce clean guest state
        const saved = localStorage.getItem('kuro_current_user');
        if (!saved || JSON.parse(saved).id === 'guest_user') {
          setCurrentUser(GUEST_USER);
          setActiveProfileViewUser(GUEST_USER);
          const savedLib = localStorage.getItem('kuro_library');
          if (!savedLib) {
            setLibrary([]);
          }
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Hydrate live anime, upcoming announced releases, and manga from AniList daily engine
  useEffect(() => {
    let isCancelled = false;
    const hydrateLiveCatalog = async () => {
      try {
        const [trending, upcoming, manga] = await Promise.all([
          fetchTrendingAnime(1, 24),
          fetchUpcomingAnime(1, 24),
          fetchTopManga(1, 24)
        ]);

        if (isCancelled) return;

        const combined = [...trending.items, ...upcoming.items, ...manga.items];
        if (combined.length > 0) {
          setMediaItems(prev => {
            const map = new Map(prev.map(i => [i.id, i]));
            combined.forEach(item => map.set(item.id, item));
            return Array.from(map.values());
          });
        }
      } catch (err) {
        console.warn('Live AniList catalog hydration notice:', err);
      }
    };

    hydrateLiveCatalog();
    return () => {
      isCancelled = true;
    };
  }, []);

  const signInWithGoogleAction = async () => {
    try {
      setIsFirebaseLoading(true);
      const user = await signInWithGoogle();
      if (user) {
        showToast(`Signed in with Google as ${user.displayName || user.email}!`);
        setIsAuthModalOpen(false);
      }
    } catch (err: any) {
      console.error(err);
      showToast('Google sign-in was canceled or encountered an issue.', 'error');
    } finally {
      setIsFirebaseLoading(false);
    }
  };

  const signInWithEmailAction = async (email: string, pass: string) => {
    try {
      setIsFirebaseLoading(true);
      const user = await loginWithEmail(email, pass);
      if (user) {
        showToast(`Welcome back, ${user.displayName || user.email}!`);
        setIsAuthModalOpen(false);
      }
    } catch (err: any) {
      console.error(err);
      let msg = 'Failed to sign in. Please verify your credentials.';
      if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        msg = 'Invalid email or password.';
      } else if (err.code === 'auth/user-not-found') {
        msg = 'No account found with this email. Please sign up.';
      } else if (err.code === 'auth/too-many-requests') {
        msg = 'Access temporarily restricted due to many failed attempts. Try again later.';
      }
      showToast(msg, 'error');
      throw err;
    } finally {
      setIsFirebaseLoading(false);
    }
  };

  const signUpWithEmailAction = async (email: string, pass: string, username: string, displayName: string) => {
    try {
      setIsFirebaseLoading(true);
      const user = await signUpWithEmail(email, pass, displayName);
      if (user) {
        showToast(`Account created! Welcome to KuroList, ${displayName}!`);
        setIsAuthModalOpen(false);
      }
    } catch (err: any) {
      console.error(err);
      let msg = 'Registration failed.';
      if (err.code === 'auth/email-already-in-use') {
        msg = 'An account with this email already exists. Try signing in.';
      } else if (err.code === 'auth/weak-password') {
        msg = 'Password should be at least 6 characters.';
      } else if (err.code === 'auth/invalid-email') {
        msg = 'Please enter a valid email address.';
      }
      showToast(msg, 'error');
      throw err;
    } finally {
      setIsFirebaseLoading(false);
    }
  };

  const resetPasswordAction = async (email: string) => {
    try {
      setIsFirebaseLoading(true);
      await resetUserPassword(email);
      showToast('Password reset link sent to your email!', 'info');
    } catch (err: any) {
      console.error(err);
      showToast('Could not send reset email. Verify your address.', 'error');
      throw err;
    } finally {
      setIsFirebaseLoading(false);
    }
  };

  const signOutAction = async () => {
    try {
      await signOutUser();
      setFirebaseUser(null);
      setCurrentUser(GUEST_USER);
      setActiveProfileViewUser(GUEST_USER);
      setLibrary([]);
      localStorage.removeItem('kuro_library');
      localStorage.removeItem('kuro_current_user');
      showToast('Signed out successfully. Guest session active.', 'info');
    } catch (err: any) {
      console.error(err);
      showToast('Failed to sign out', 'error');
    }
  };

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('kuro_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('kuro_library', JSON.stringify(library));
  }, [library]);

  useEffect(() => {
    localStorage.setItem('kuro_activities', JSON.stringify(activities));
  }, [activities]);

  useEffect(() => {
    localStorage.setItem('kuro_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('kuro_collections', JSON.stringify(collections));
  }, [collections]);

  useEffect(() => {
    localStorage.setItem('kuro_topics', JSON.stringify(topics));
  }, [topics]);

  useEffect(() => {
    localStorage.setItem('kuro_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('kuro_following', JSON.stringify(following));
  }, [following]);

  // Media finder helper
  const getMediaById = (id: string): MediaItem | undefined => {
    return mediaItems.find(m => m.id === id);
  };

  // Switch active user
  const switchUser = (user: UserProfile) => {
    setCurrentUser(user);
    setActiveProfileViewUser(user);
    showToast(`Switched active profile to @${user.username}`, 'info');
  };

  const updateCurrentUser = (updates: Partial<UserProfile>) => {
    setCurrentUser(prev => {
      const updated = { ...prev, ...updates };
      if (activeProfileViewUser.id === prev.id) {
        setActiveProfileViewUser(updated);
      }
      return updated;
    });
    showToast('Profile updated successfully!');
  };

  const toggleFollow = (userId: string) => {
    setFollowing(prev => {
      const isFollowing = prev.includes(userId);
      const targetUser = otherUsers.find(u => u.id === userId);
      if (isFollowing) {
        showToast(`Unfollowed @${targetUser?.username || 'user'}`, 'info');
        return prev.filter(id => id !== userId);
      } else {
        showToast(`Following @${targetUser?.username || 'user'}!`);
        // Award XP
        setCurrentUser(curr => ({
          ...curr,
          xp: curr.xp + 50,
          followingCount: curr.followingCount + 1
        }));
        return [...prev, userId];
      }
    });
  };

  // Library entry helper
  const getLibraryEntry = (mediaId: string): LibraryEntry | undefined => {
    return library.find(item => item.mediaId === mediaId && item.userId === currentUser.id);
  };

  const addOrUpdateLibraryEntry = (entryData: Partial<LibraryEntry> & { mediaId: string; mediaType: MediaType }) => {
    const media = getMediaById(entryData.mediaId);
    const existing = getLibraryEntry(entryData.mediaId);

    const now = new Date().toISOString();
    let updatedLibrary: LibraryEntry[];

    if (existing) {
      const updatedEntry: LibraryEntry = {
        ...existing,
        ...entryData,
        updatedAt: now
      };
      updatedLibrary = library.map(item => item.id === existing.id ? updatedEntry : item);
      showToast(`Updated "${media?.title || 'Title'}" in your library`);
    } else {
      const newEntry: LibraryEntry = {
        id: `lib_${Date.now()}`,
        userId: currentUser.id,
        mediaId: entryData.mediaId,
        mediaType: entryData.mediaType,
        status: entryData.status || (entryData.mediaType === 'anime' ? 'watching' : 'reading'),
        progress: entryData.progress ?? 1,
        totalProgress: media?.episodes || media?.chapters || 12,
        volumesRead: entryData.volumesRead ?? 0,
        score: entryData.score ?? 0,
        notes: entryData.notes ?? '',
        isFavorite: entryData.isFavorite ?? false,
        startDate: new Date().toISOString().split('T')[0],
        createdAt: now,
        updatedAt: now
      };
      updatedLibrary = [newEntry, ...library];
      showToast(`Added "${media?.title || 'Title'}" to your library!`);

      // Add to user XP
      setCurrentUser(curr => ({
        ...curr,
        xp: curr.xp + 40
      }));
    }

    setLibrary(updatedLibrary);
    setStreak(prev => logStreakActivity(prev));

    // Sync to Firestore
    const targetEntry = existing ? { ...existing, ...entryData, updatedAt: now } : updatedLibrary[0];
    if (targetEntry) {
      saveLibraryEntryToFirestore(currentUser.id, targetEntry).catch(() => {});
    }

    // Create Social Activity
    if (media) {
      const statusLabel = entryData.status || 'watching';
      const isCompleted = statusLabel === 'completed';
      const newActivity: SocialActivity = {
        id: `act_${Date.now()}`,
        userId: currentUser.id,
        username: currentUser.username,
        displayName: currentUser.displayName,
        avatar: currentUser.avatar,
        type: isCompleted ? 'completed' : 'progress_update',
        mediaId: media.id,
        mediaTitle: media.title,
        mediaCover: media.coverImage,
        mediaType: media.type,
        progress: entryData.progress ?? 1,
        totalProgress: media.episodes || media.chapters,
        score: entryData.score,
        timestamp: 'Just now',
        likes: [],
        comments: []
      };
      setActivities(prev => [newActivity, ...prev]);
    }
  };

  const removeLibraryEntry = (mediaId: string) => {
    const media = getMediaById(mediaId);
    setLibrary(prev => prev.filter(item => !(item.mediaId === mediaId && item.userId === currentUser.id)));
    removeLibraryEntryFromFirestore(currentUser.id, mediaId).catch(() => {});
    showToast(`Removed "${media?.title || 'Title'}" from your library`, 'info');
  };

  /**
   * Bulk updates multiple library entries simultaneously
   */
  const bulkUpdateLibraryEntries = (
    mediaIds: string[],
    updates: Partial<LibraryEntry> | ((entry: LibraryEntry) => Partial<LibraryEntry>)
  ) => {
    if (mediaIds.length === 0) return;
    const now = new Date().toISOString();
    const updatedEntries: LibraryEntry[] = [];

    setLibrary(prev => {
      return prev.map(entry => {
        if (entry.userId === currentUser.id && mediaIds.includes(entry.mediaId)) {
          const patch = typeof updates === 'function' ? updates(entry) : updates;
          const updated: LibraryEntry = {
            ...entry,
            ...patch,
            updatedAt: now
          };
          updatedEntries.push(updated);
          return updated;
        }
        return entry;
      });
    });

    // Sync each to Firestore
    updatedEntries.forEach(entry => {
      saveLibraryEntryToFirestore(currentUser.id, entry).catch(() => {});
    });

    setStreak(prev => logStreakActivity(prev));
    showToast(`Updated ${mediaIds.length} titles in your library`, 'success');
  };

  /**
   * Bulk removes multiple library entries simultaneously
   */
  const bulkRemoveLibraryEntries = (mediaIds: string[]) => {
    if (mediaIds.length === 0) return;

    setLibrary(prev => prev.filter(item => !(item.userId === currentUser.id && mediaIds.includes(item.mediaId))));

    // Delete each from Firestore
    mediaIds.forEach(mediaId => {
      removeLibraryEntryFromFirestore(currentUser.id, mediaId).catch(() => {});
    });

    showToast(`Removed ${mediaIds.length} titles from your library`, 'info');
  };

  const incrementProgress = (mediaId: string) => {
    const entry = getLibraryEntry(mediaId);
    const media = getMediaById(mediaId);
    if (!entry) {
      if (media) {
        addOrUpdateLibraryEntry({
          mediaId,
          mediaType: media.type,
          status: media.type === 'anime' ? 'watching' : 'reading',
          progress: 1
        });
      }
      return;
    }

    const nextProgress = entry.progress + 1;
    const isCompleted = entry.totalProgress > 0 && nextProgress >= entry.totalProgress;

    const updatedEntry: LibraryEntry = {
      ...entry,
      progress: nextProgress,
      status: isCompleted ? 'completed' : entry.status,
      finishDate: isCompleted ? new Date().toISOString().split('T')[0] : entry.finishDate,
      updatedAt: new Date().toISOString()
    };

    setLibrary(prev => prev.map(item => item.id === entry.id ? updatedEntry : item));
    setStreak(prev => logStreakActivity(prev));

    // Sync progress update directly to Firestore
    saveLibraryEntryToFirestore(currentUser.id, updatedEntry).catch(() => {});

    // Award XP
    setCurrentUser(curr => ({
      ...curr,
      xp: curr.xp + (isCompleted ? 150 : 20)
    }));

    showToast(
      isCompleted
        ? `Completed "${media?.title}"! +150 XP`
        : `Progress updated: ${media?.title} (${nextProgress}/${entry.totalProgress || '?'})`
    );

    // Push activity
    if (media) {
      const newAct: SocialActivity = {
        id: `act_${Date.now()}`,
        userId: currentUser.id,
        username: currentUser.username,
        displayName: currentUser.displayName,
        avatar: currentUser.avatar,
        type: isCompleted ? 'completed' : 'progress_update',
        mediaId: media.id,
        mediaTitle: media.title,
        mediaCover: media.coverImage,
        mediaType: media.type,
        progress: nextProgress,
        totalProgress: entry.totalProgress,
        timestamp: 'Just now',
        likes: [],
        comments: []
      };
      setActivities(prev => [newAct, ...prev]);
    }
  };

  const toggleFavorite = (mediaId: string) => {
    const entry = getLibraryEntry(mediaId);
    if (entry) {
      const updated = !entry.isFavorite;
      const updatedEntry: LibraryEntry = {
        ...entry,
        isFavorite: updated,
        updatedAt: new Date().toISOString()
      };
      setLibrary(prev => prev.map(item => item.id === entry.id ? updatedEntry : item));
      saveLibraryEntryToFirestore(currentUser.id, updatedEntry).catch(() => {});
      showToast(updated ? 'Added to favorites' : 'Removed from favorites');
    }
  };

  const importBulkLibraryEntries = (entries: LibraryEntry[]) => {
    setLibrary(prev => {
      const existingOther = prev.filter(e => e.userId !== currentUser.id || !entries.some(ne => ne.mediaId === e.mediaId));
      return [...entries, ...existingOther];
    });

    // Persist all imported entries to Firestore in cloud
    entries.forEach(entry => {
      saveLibraryEntryToFirestore(currentUser.id, entry).catch(() => {});
    });
    showToast(`Imported ${entries.length} titles to your cloud library!`, 'success');
  };

  /**
   * Applies smart diff updates and additions from MAL/AniList sync
   */
  const applySyncDiffAction = (toUpdate: SyncUpdateItem[], toAdd: SyncAddItem[]) => {
    const now = new Date().toISOString();

    setLibrary(prev => {
      let nextLib = [...prev];

      // 1. Apply updates to existing entries
      toUpdate.forEach(item => {
        const idx = nextLib.findIndex(e => e.id === item.existingEntryId);
        if (idx !== -1) {
          const existing = nextLib[idx];
          const updatedEntry: LibraryEntry = {
            ...existing,
            progress: item.newProgress,
            status: item.newStatus,
            score: item.newScore > 0 ? item.newScore : existing.score,
            totalProgress: item.totalProgress || existing.totalProgress,
            updatedAt: now
          };
          nextLib[idx] = updatedEntry;
          saveLibraryEntryToFirestore(currentUser.id, updatedEntry).catch(() => {});
        }
      });

      // 2. Add new entries
      toAdd.forEach((item, i) => {
        const newEntry: LibraryEntry = {
          id: `lib_sync_${Date.now()}_${i}`,
          userId: currentUser.id,
          mediaId: item.mediaId,
          mediaType: item.mediaType,
          status: item.status,
          progress: item.progress,
          totalProgress: item.totalProgress,
          volumesRead: 0,
          score: item.score,
          notes: item.notes || 'Synced from MAL/AniList',
          isFavorite: item.score >= 9,
          startDate: now.split('T')[0],
          createdAt: now,
          updatedAt: now
        };
        nextLib = [newEntry, ...nextLib];
        saveLibraryEntryToFirestore(currentUser.id, newEntry).catch(() => {});
      });

      return nextLib;
    });

    setStreak(prev => logStreakActivity(prev));

    // Calculate XP boost for syncing
    const xpBoost = (toUpdate.length * 20) + (toAdd.length * 40);
    if (xpBoost > 0) {
      setCurrentUser(curr => ({
        ...curr,
        xp: curr.xp + xpBoost
      }));
    }

    showToast(`Sync complete: ${toUpdate.length} titles updated, ${toAdd.length} new titles added! (+${xpBoost} XP)`, 'success');
  };

  /**
   * Updates current user profile details (displayName, username, bio, avatar, banner)
   */
  const updateUserProfileDataAction = async (data: {
    displayName?: string;
    username?: string;
    bio?: string;
    avatar?: string;
    banner?: string;
  }): Promise<void> => {
    const updatedUser: UserProfile = {
      ...currentUser,
      displayName: data.displayName !== undefined ? data.displayName.trim() : currentUser.displayName,
      username: data.username !== undefined ? data.username.trim().replace(/^@/, '') : currentUser.username,
      bio: data.bio !== undefined ? data.bio : currentUser.bio,
      avatar: data.avatar || currentUser.avatar,
      banner: data.banner || currentUser.banner
    };

    setCurrentUser(updatedUser);
    setActiveProfileViewUser(updatedUser);
    localStorage.setItem('kuro_current_user', JSON.stringify(updatedUser));

    // Save to Firestore and Auth if signed in
    if (firebaseUser) {
      await saveUserProfile(updatedUser).catch(err => console.warn('Could not save user profile to firestore:', err));
      await updateUserAuthProfile(updatedUser.displayName, updatedUser.avatar).catch(err => console.warn('Could not update auth profile:', err));
    }

    showToast('Profile information updated successfully!', 'success');
  };

  /**
   * Updates user password via Firebase Auth
   */
  const updateUserPasswordAction = async (newPassword: string): Promise<void> => {
    await updateUserPassword(newPassword);
    showToast('Password updated successfully! Keep your new credentials safe.', 'success');
  };

  // Social interactions
  const likeActivity = (activityId: string) => {
    setActivities(prev => prev.map(act => {
      if (act.id !== activityId) return act;
      const hasLiked = act.likes.includes(currentUser.id);
      return {
        ...act,
        likes: hasLiked ? act.likes.filter(id => id !== currentUser.id) : [...act.likes, currentUser.id]
      };
    }));
  };

  const commentActivity = (activityId: string, text: string) => {
    if (!text.trim()) return;
    const newComment = {
      id: `c_${Date.now()}`,
      userId: currentUser.id,
      username: currentUser.username,
      displayName: currentUser.displayName,
      avatar: currentUser.avatar,
      text: text.trim(),
      timestamp: 'Just now'
    };
    setActivities(prev => prev.map(act => {
      if (act.id !== activityId) return act;
      return {
        ...act,
        comments: [...act.comments, newComment]
      };
    }));
    showToast('Comment posted');
  };

  const addReview = (reviewData: {
    mediaId: string;
    rating: number;
    title: string;
    content: string;
    pros: string[];
    cons: string[];
    hasSpoilers: boolean;
  }) => {
    const media = getMediaById(reviewData.mediaId);
    if (!media) return;

    const newReview: MediaReview = {
      id: `rev_${Date.now()}`,
      mediaId: media.id,
      mediaTitle: media.title,
      mediaCover: media.coverImage,
      mediaType: media.type,
      userId: currentUser.id,
      username: currentUser.username,
      displayName: currentUser.displayName,
      avatar: currentUser.avatar,
      rating: reviewData.rating,
      title: reviewData.title,
      content: reviewData.content,
      pros: reviewData.pros,
      cons: reviewData.cons,
      hasSpoilers: reviewData.hasSpoilers,
      helpfulCount: 0,
      likedBy: [],
      comments: [],
      createdAt: new Date().toISOString().split('T')[0]
    };

    // Filter out previous review by same user for this title
    setReviews(prev => [newReview, ...prev.filter(r => !(r.mediaId === media.id && r.userId === currentUser.id))]);
    saveReviewToFirestore(newReview).catch(() => {});

    // Update library entry score if present
    const entry = getLibraryEntry(media.id);
    if (entry) {
      addOrUpdateLibraryEntry({
        mediaId: media.id,
        mediaType: media.type,
        score: reviewData.rating
      });
    }

    // Award XP
    setCurrentUser(curr => ({
      ...curr,
      xp: curr.xp + 150
    }));

    showToast('Your review was published! +150 XP');
  };

  const likeReview = (reviewId: string) => {
    setReviews(prev => prev.map(r => {
      if (r.id !== reviewId) return r;
      const hasLiked = r.likedBy.includes(currentUser.id);
      return {
        ...r,
        likedBy: hasLiked ? r.likedBy.filter(id => id !== currentUser.id) : [...r.likedBy, currentUser.id],
        helpfulCount: hasLiked ? r.helpfulCount - 1 : r.helpfulCount + 1
      };
    }));
  };

  const commentReview = (reviewId: string, content: string) => {
    if (!content.trim()) return;
    const newComment = {
      id: `rc_${Date.now()}`,
      userId: currentUser.id,
      username: currentUser.username,
      displayName: currentUser.displayName,
      avatar: currentUser.avatar,
      content: content.trim(),
      createdAt: 'Just now'
    };
    setReviews(prev => prev.map(r => {
      if (r.id !== reviewId) return r;
      return {
        ...r,
        comments: [...r.comments, newComment]
      };
    }));
    showToast('Reply added to review');
  };

  const createCollection = (title: string, description: string, itemIds: string[], isPublic = true) => {
    const firstMedia = itemIds.length > 0 ? getMediaById(itemIds[0]) : undefined;
    const newCol: CustomCollection = {
      id: `col_${Date.now()}`,
      userId: currentUser.id,
      username: currentUser.username,
      title: title.trim(),
      description: description.trim(),
      isPublic,
      itemIds,
      coverImage: firstMedia?.coverImage || '/src/assets/images/hero_cinematic_anime_1793517807898.jpg',
      createdAt: new Date().toISOString().split('T')[0]
    };
    setCollections(prev => [newCol, ...prev]);
    showToast(`Collection "${title}" created!`);
  };

  const createTopic = (
    title: string,
    category: CommunityTopic['category'],
    content: string,
    mediaTagId?: string,
    pollData?: { question: string; options: string[] }
  ) => {
    const media = mediaTagId ? getMediaById(mediaTagId) : undefined;
    const newTopic: CommunityTopic = {
      id: `top_${Date.now()}`,
      title: title.trim(),
      category,
      authorId: currentUser.id,
      username: currentUser.username,
      displayName: currentUser.displayName,
      avatar: currentUser.avatar,
      content: content.trim(),
      mediaTag: media ? { id: media.id, title: media.title } : undefined,
      viewsCount: 1,
      replies: [],
      createdAt: 'Just now',
      poll: pollData && pollData.options.length > 1 ? {
        question: pollData.question,
        options: pollData.options.map((opt, idx) => ({ id: `opt_${idx}`, text: opt, votes: 0 }))
      } : undefined
    };
    setTopics(prev => [newTopic, ...prev]);
    saveTopicToFirestore(newTopic).catch(() => {});
    showToast('Discussion thread created!');
  };

  const replyTopic = (topicId: string, content: string, hasSpoiler = false) => {
    if (!content.trim()) return;
    const newReply = {
      id: `rep_${Date.now()}`,
      authorId: currentUser.id,
      username: currentUser.username,
      displayName: currentUser.displayName,
      avatar: currentUser.avatar,
      content: content.trim(),
      createdAt: 'Just now',
      likes: [],
      hasSpoiler
    };
    setTopics(prev => prev.map(t => {
      if (t.id !== topicId) return t;
      return {
        ...t,
        replies: [...t.replies, newReply]
      };
    }));
    showToast('Reply published');
  };

  const votePoll = (topicId: string, optionId: string) => {
    setTopics(prev => prev.map(t => {
      if (t.id !== topicId || !t.poll) return t;
      if (t.poll.userVotedOptionId) {
        showToast('You have already voted in this poll', 'info');
        return t;
      }
      return {
        ...t,
        poll: {
          ...t.poll,
          userVotedOptionId: optionId,
          options: t.poll.options.map(o => o.id === optionId ? { ...o, votes: o.votes + 1 } : o)
        }
      };
    }));
    showToast('Vote recorded!');
  };

  // Notification helpers
  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    showToast('All notifications marked as read');
  };

  const unreadNotificationsCount = useMemo(() => {
    return notifications.filter(n => !n.isRead).length;
  }, [notifications]);

  // Modal Openers
  const openAddToListModal = (media: MediaItem) => {
    setListModalMedia(media);
    setIsAddToListOpen(true);
  };

  const openReviewModal = (media: MediaItem) => {
    setReviewModalMedia(media);
    setIsReviewModalOpen(true);
  };

  // Live Jikan API Search fallback for any title in the world
  const searchMedia = async (query: string, type?: MediaType): Promise<MediaItem[]> => {
    if (!query.trim()) return mediaItems;
    const lower = query.toLowerCase();

    // 1. Check local catalog first
    const localMatches = mediaItems.filter(item => {
      const matchTitle = item.title.toLowerCase().includes(lower) ||
        (item.titleRomaji && item.titleRomaji.toLowerCase().includes(lower)) ||
        (item.titleJapanese && item.titleJapanese.includes(lower));
      const matchType = !type || item.type === type;
      return matchTitle && matchType;
    });

    if (localMatches.length > 0 || query.length < 3) {
      return localMatches;
    }

    // 2. Query live AniList global database of millions of titles
    try {
      setIsSearchingOnline(true);
      const searchRes = await searchGlobalCatalog({
        search: query,
        type,
        perPage: 24
      });

      if (searchRes.items && searchRes.items.length > 0) {
        // Merge into global media catalog avoiding duplicates
        setMediaItems(prev => {
          const newMap = new Map(prev.map(i => [i.id, i]));
          searchRes.items.forEach(item => newMap.set(item.id, item));
          return Array.from(newMap.values());
        });

        return searchRes.items;
      }
    } catch {
      // Graceful fallback to local matches
      return localMatches;
    } finally {
      setIsSearchingOnline(false);
    }

    return localMatches;
  };

  // User Stats computation
  const stats = useMemo(() => {
    const userLibrary = library.filter(l => l.userId === currentUser.id);

    let animeCount = 0;
    let mangaCount = 0;
    let episodesWatched = 0;
    let chaptersRead = 0;
    let totalScore = 0;
    let scoredCount = 0;
    let completedCount = 0;
    const genreCounts: { [genre: string]: number } = {};
    const scoreDistribution: { [score: number]: number } = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0 };

    userLibrary.forEach(entry => {
      const media = mediaItems.find(m => m.id === entry.mediaId);

      if (entry.mediaType === 'anime') {
        animeCount++;
        episodesWatched += entry.progress;
      } else {
        mangaCount++;
        chaptersRead += entry.progress;
      }

      if (entry.status === 'completed') {
        completedCount++;
      }

      if (entry.score > 0) {
        totalScore += entry.score;
        scoredCount++;
        const rounded = Math.min(10, Math.max(1, Math.round(entry.score)));
        scoreDistribution[rounded] = (scoreDistribution[rounded] || 0) + 1;
      }

      if (media && media.genres) {
        media.genres.forEach(g => {
          genreCounts[g] = (genreCounts[g] || 0) + 1;
        });
      }
    });

    const averageScore = scoredCount > 0 ? Number((totalScore / scoredCount).toFixed(2)) : 0;
    const daysWatched = Number(((episodesWatched * 23.5) / (60 * 24)).toFixed(1));
    const completionRate = userLibrary.length > 0 ? Math.round((completedCount / userLibrary.length) * 100) : 0;

    return {
      animeCount,
      mangaCount,
      episodesWatched,
      chaptersRead,
      daysWatched,
      averageScore,
      completionRate,
      genreCounts,
      scoreDistribution
    };
  }, [library, currentUser.id, mediaItems]);

  // Dynamic Gamification Calculation
  const gamification = useMemo(() => {
    return calculateGamification(currentUser.id, library, reviews, mediaItems);
  }, [currentUser.id, library, reviews, mediaItems]);

  return (
    <AppContext.Provider
      value={{
        currentUser,
        otherUsers,
        activeProfileViewUser,
        setActiveProfileViewUser,
        switchUser,
        updateCurrentUser,
        updateUserProfileDataAction,
        updateUserPasswordAction,
        following,
        toggleFollow,
        mediaItems,
        getMediaById,
        searchMedia,
        isSearchingOnline,
        library,
        getLibraryEntry,
        addOrUpdateLibraryEntry,
        importBulkLibraryEntries,
        applySyncDiffAction,
        removeLibraryEntry,
        bulkUpdateLibraryEntries,
        bulkRemoveLibraryEntries,
        incrementProgress,
        toggleFavorite,
        activities,
        likeActivity,
        commentActivity,
        reviews,
        addReview,
        likeReview,
        commentReview,
        collections,
        createCollection,
        topics,
        createTopic,
        replyTopic,
        votePoll,
        notifications,
        unreadNotificationsCount,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        activeView,
        setActiveView,
        selectedMedia,
        setSelectedMedia,
        isAddToListOpen,
        setIsAddToListOpen,
        listModalMedia,
        openAddToListModal,
        isIdentityCardOpen,
        setIsIdentityCardOpen,
        isReviewModalOpen,
        setIsReviewModalOpen,
        reviewModalMedia,
        openReviewModal,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isAdminModalOpen,
        setIsAdminModalOpen,
        isNotificationsOpen,
        setIsNotificationsOpen,
        isCommandPaletteOpen,
        setIsCommandPaletteOpen,
        gamification,
        celebrationData,
        isCelebrationOpen,
        setIsCelebrationOpen,
        triggerCelebration,
        stats,
        streak,
        recordDailyActivity,
        toast,
        showToast,
        firebaseUser,
        signInWithGoogleAction,
        signInWithEmailAction,
        signUpWithEmailAction,
        resetPasswordAction,
        signOutAction,
        isFirebaseLoading
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
