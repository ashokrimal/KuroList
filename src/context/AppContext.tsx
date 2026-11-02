/**
 * KuroList - Main Application Context and State Management
 */

import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
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
import { INITIAL_MEDIA_ITEMS } from '../data/animeData';
import { CURRENT_USER, INITIAL_USER_LIBRARY, OTHER_USERS } from '../data/mockUsers';
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
  signOutUser,
  saveUserProfile,
  saveLibraryEntryToFirestore,
  removeLibraryEntryFromFirestore,
  fetchUserLibraryFromFirestore,
  saveReviewToFirestore,
  saveTopicToFirestore
} from '../services/firebaseService';

interface AppContextType {
  // Current user & profiles
  currentUser: UserProfile;
  otherUsers: UserProfile[];
  activeProfileViewUser: UserProfile;
  setActiveProfileViewUser: (user: UserProfile) => void;
  switchUser: (user: UserProfile) => void;
  updateCurrentUser: (updates: Partial<UserProfile>) => void;
  following: string[];
  toggleFollow: (userId: string) => void;

  // Firebase Auth
  firebaseUser: FirebaseUser | null;
  signInWithGoogleAction: () => Promise<void>;
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
  removeLibraryEntry: (mediaId: string) => void;
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

  // Toast alert
  toast: { message: string; type: 'success' | 'info' | 'error' } | null;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Current user state
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('kuro_current_user');
    return saved ? JSON.parse(saved) : CURRENT_USER;
  });

  const [otherUsers] = useState<UserProfile[]>(OTHER_USERS);
  const [activeProfileViewUser, setActiveProfileViewUser] = useState<UserProfile>(currentUser);

  const [following, setFollowing] = useState<string[]>(() => {
    const saved = localStorage.getItem('kuro_following');
    return saved ? JSON.parse(saved) : ['user_kenji', 'user_sakura'];
  });

  // Media catalog
  const [mediaItems, setMediaItems] = useState<MediaItem[]>(() => {
    const saved = localStorage.getItem('kuro_media_catalog');
    return saved ? JSON.parse(saved) : INITIAL_MEDIA_ITEMS;
  });

  // User library
  const [library, setLibrary] = useState<LibraryEntry[]>(() => {
    const saved = localStorage.getItem('kuro_library');
    return saved ? JSON.parse(saved) : INITIAL_USER_LIBRARY;
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

  // Navigation & Modals
  const [activeView, setActiveView] = useState<'home' | 'discover' | 'seasonal' | 'mylist' | 'profile' | 'community' | 'collections'>('home');
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [isAddToListOpen, setIsAddToListOpen] = useState(false);
  const [listModalMedia, setListModalMedia] = useState<MediaItem | null>(null);
  const [isIdentityCardOpen, setIsIdentityCardOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewModalMedia, setReviewModalMedia] = useState<MediaItem | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSearchingOnline, setIsSearchingOnline] = useState(false);

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
          if (cloudLibrary && cloudLibrary.length > 0) {
            setLibrary(cloudLibrary as LibraryEntry[]);
          }
        } catch (e) {
          console.warn('Could not load user library from Firestore:', e);
        }
      }
    });

    return () => unsubscribe();
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

  const signOutAction = async () => {
    try {
      await signOutUser();
      setFirebaseUser(null);
      setCurrentUser(CURRENT_USER);
      setActiveProfileViewUser(CURRENT_USER);
      showToast('Signed out. Restored demo profile.', 'info');
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
      setLibrary(prev => prev.map(item => item.id === entry.id ? { ...item, isFavorite: updated } : item));
      showToast(updated ? 'Added to favorites' : 'Removed from favorites');
    }
  };

  const importBulkLibraryEntries = (entries: LibraryEntry[]) => {
    setLibrary(prev => {
      const existingOther = prev.filter(e => e.userId !== currentUser.id || !entries.some(ne => ne.mediaId === e.mediaId));
      return [...entries, ...existingOther];
    });
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

    // 2. Fallback to Jikan API
    try {
      setIsSearchingOnline(true);
      const endpoint = type === 'manga' ? 'manga' : 'anime';
      const res = await fetch(`https://api.jikan.moe/v4/${endpoint}?q=${encodeURIComponent(query)}&limit=6&sfw`);
      if (!res.ok) throw new Error('Jikan error');
      const data = await res.json();

      if (data && Array.isArray(data.data)) {
        const onlineItems: MediaItem[] = data.data.map((item: any) => ({
          id: `mal_${item.mal_id}`,
          malId: item.mal_id,
          title: item.title || item.title_english || 'Untitled',
          titleRomaji: item.title,
          titleJapanese: item.title_japanese,
          type: type === 'manga' ? 'manga' : 'anime',
          format: item.type === 'TV' ? 'TV' : (item.type || 'TV'),
          status: item.airing ? 'airing' : (item.status === 'Finished Airing' ? 'finished' : 'upcoming'),
          episodes: item.episodes || 12,
          chapters: item.chapters,
          duration: item.duration,
          season: item.season ? item.season.charAt(0).toUpperCase() + item.season.slice(1) : undefined,
          year: item.year || (item.aired?.prop?.from?.year),
          score: item.score || 7.5,
          rank: item.rank || 500,
          popularity: item.popularity || 200,
          members: item.members || 50000,
          synopsis: item.synopsis || 'No synopsis provided.',
          genres: item.genres?.map((g: any) => g.name) || ['Action'],
          studios: item.studios?.map((s: any) => s.name) || ['Animation Studio'],
          coverImage: item.images?.webp?.large_image_url || item.images?.jpg?.large_image_url || 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80',
          bannerImage: '/src/assets/images/hero_cinematic_anime_1793517807898.jpg',
          trailerUrl: item.trailer?.url
        }));

        // Merge into global media catalog avoiding duplicates
        setMediaItems(prev => {
          const newMap = new Map(prev.map(i => [i.id, i]));
          onlineItems.forEach(item => newMap.set(item.id, item));
          return Array.from(newMap.values());
        });

        return onlineItems;
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
        removeLibraryEntry,
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
        gamification,
        celebrationData,
        isCelebrationOpen,
        setIsCelebrationOpen,
        triggerCelebration,
        stats,
        toast,
        showToast,
        firebaseUser,
        signInWithGoogleAction,
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
