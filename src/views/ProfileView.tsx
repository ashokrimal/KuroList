/**
 * ProfileView - Public & Personal Anime Identity Profile
 * Comprehensive gamification system: real-time XP calculation, dynamic badges,
 * milestone trackers (episodes, chapters, reviews), and public profile display.
 * Includes full profile editing (Name, Username, Bio, Avatar) and Firebase Auth password management.
 */

import React, { useState } from 'react';
import {
  User,
  Star,
  Bookmark,
  Calendar,
  MapPin,
  Clock,
  Sparkles,
  Award,
  Heart,
  Share2,
  Check,
  UserPlus,
  Flame,
  ThumbsUp,
  BarChart2,
  BookOpen,
  Trophy,
  Shield,
  Play,
  Zap,
  Crown,
  PenTool,
  Feather,
  CheckCircle,
  Compass,
  Lock,
  ArrowRight,
  Settings,
  Edit3,
  KeyRound,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  Tv,
  Layers,
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AnimeCard } from '../components/AnimeCard';
import { StreakCounterCard } from '../components/StreakCounterCard';
import { GamificationBanner } from '../components/GamificationBanner';
import { PersonalityCard } from '../components/PersonalityCard';
import { ProfileSkeleton } from '../components/SkeletonLoader';
import { UserProfile, BadgeCategory, UserBadge, MediaItem } from '../types';
import { getTierColors, LEVEL_MILESTONES } from '../utils/gamification';

export const ProfileView: React.FC = () => {
  const {
    currentUser,
    activeProfileViewUser,
    library,
    mediaItems,
    reviews,
    following,
    toggleFollow,
    stats,
    gamification,
    triggerCelebration,
    setSelectedMedia,
    setIsIdentityCardOpen,
    streak,
    showToast,
    updateUserProfileDataAction,
    updateUserPasswordAction,
    resetPasswordAction,
    firebaseUser
  } = useApp();

  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'anime' | 'manga' | 'favorites' | 'reviews' | 'stats' | 'achievements'>('overview');
  const [selectedBadgeCategory, setSelectedBadgeCategory] = useState<BadgeCategory | 'all'>('all');

  // Edit Profile & Security Modal States
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editTab, setEditTab] = useState<'profile' | 'security'>('profile');
  const [editDisplayName, setEditDisplayName] = useState(currentUser.displayName);
  const [editUsername, setEditUsername] = useState(currentUser.username);
  const [editBio, setEditBio] = useState(currentUser.bio);
  const [editAvatar, setEditAvatar] = useState(currentUser.avatar);

  // Password change states
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [securityStatus, setSecurityStatus] = useState<{ type: 'error' | 'success'; message: string } | null>(null);

  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 240);
    return () => clearTimeout(timer);
  }, []);

  const profile = activeProfileViewUser;
  const isSelf = profile.id === currentUser.id;
  const isFollowing = following.includes(profile.id);

  // Sync edit form with current user on open
  const openEditModal = () => {
    setEditDisplayName(currentUser.displayName);
    setEditUsername(currentUser.username);
    setEditBio(currentUser.bio);
    setEditAvatar(currentUser.avatar);
    setNewPassword('');
    setConfirmPassword('');
    setSecurityStatus(null);
    setIsEditModalOpen(true);
  };

  // User library items
  const userAnimeEntries = library.filter(e => e.userId === profile.id && e.mediaType === 'anime');
  const userMangaEntries = library.filter(e => e.userId === profile.id && (e.mediaType === 'manga' || e.mediaType === 'manhwa'));

  // Currently watching
  const currentlyWatching: MediaItem[] = userAnimeEntries
    .filter(e => e.status === 'watching')
    .map(e => mediaItems.find(m => m.id === e.mediaId))
    .filter((m): m is MediaItem => Boolean(m));

  // Favorites
  const favoriteMedia: MediaItem[] = profile.favoriteMediaIds
    .map(id => mediaItems.find(m => m.id === id))
    .filter((m): m is MediaItem => Boolean(m));

  // User reviews
  const userReviews = reviews.filter(r => r.userId === profile.id);

  // Gamification metrics
  const activeLevel = isSelf ? gamification.level : profile.level;
  const activeTitle = isSelf ? gamification.title : 'Otaku Explorer';
  const activeXp = isSelf ? gamification.totalXp : profile.xp;
  const activeNextXp = isSelf ? gamification.nextLevelThresholdXp : profile.nextLevelXp;
  const activeProgressPct = isSelf ? gamification.levelProgressPercent : Math.round((profile.xp / profile.nextLevelXp) * 100);
  const activeBadges = isSelf ? gamification.badges : [];

  const handleShareProfile = () => {
    navigator.clipboard?.writeText(`https://kurolist.app/user/${profile.username}`);
    showToast(`Copied @${profile.username}'s profile link!`);
  };

  // Save Profile Details
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editDisplayName.trim()) {
      showToast('Display name cannot be empty', 'error');
      return;
    }
    if (!editUsername.trim()) {
      showToast('Username cannot be empty', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await updateUserProfileDataAction({
        displayName: editDisplayName.trim(),
        username: editUsername.trim().replace(/^@/, ''),
        bio: editBio.trim(),
        avatar: editAvatar.trim()
      });
      setIsEditModalOpen(false);
    } catch (err: any) {
      showToast(err.message || 'Failed to update profile details', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Password Change
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setSecurityStatus(null);

    if (newPassword.length < 6) {
      setSecurityStatus({
        type: 'error',
        message: 'New password must be at least 6 characters long.'
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setSecurityStatus({
        type: 'error',
        message: 'New passwords do not match. Please verify.'
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await updateUserPasswordAction(newPassword);
      setSecurityStatus({
        type: 'success',
        message: 'Password changed successfully! You can now use your new password.'
      });
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setSecurityStatus({
        type: 'error',
        message: err.message || 'Password update failed. Please re-authenticate and try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Send Password Reset Email fallback
  const handleSendResetEmail = async () => {
    const email = firebaseUser?.email || currentUser.email;
    if (!email) {
      setSecurityStatus({
        type: 'error',
        message: 'No email address associated with this account.'
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await resetPasswordAction(email);
      setSecurityStatus({
        type: 'success',
        message: `Password reset link sent to ${email}! Check your inbox.`
      });
    } catch (err: any) {
      setSecurityStatus({
        type: 'error',
        message: err.message || 'Failed to send password reset email.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case 'Play': return <Play className="w-4 h-4" />;
      case 'Flame': return <Flame className="w-4 h-4" />;
      case 'Zap': return <Zap className="w-4 h-4" />;
      case 'Crown': return <Crown className="w-4 h-4" />;
      case 'BookOpen': return <BookOpen className="w-4 h-4" />;
      case 'Bookmark': return <Bookmark className="w-4 h-4" />;
      case 'Scroll': return <BookOpen className="w-4 h-4" />;
      case 'PenTool': return <PenTool className="w-4 h-4" />;
      case 'Feather': return <Feather className="w-4 h-4" />;
      case 'CheckCircle': return <CheckCircle className="w-4 h-4" />;
      case 'Trophy': return <Trophy className="w-4 h-4" />;
      case 'Shield': return <Shield className="w-4 h-4" />;
      case 'Star': return <Star className="w-4 h-4" />;
      case 'Compass': return <Compass className="w-4 h-4" />;
      default: return <Award className="w-4 h-4" />;
    }
  };

  const filteredBadges = activeBadges.filter(b => selectedBadgeCategory === 'all' || b.category === selectedBadgeCategory);

  const avatarPresets = [
    '/src/assets/images/user_avatar_ashok_1793517808935.jpg',
    '/src/assets/images/anime_card_nebula_1793517807647.jpg',
    '/src/assets/images/hero_cinematic_anime_1793517807898.jpg',
    '/src/assets/images/frieren_fantasy_banner_1793517808620.jpg'
  ];

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  return (
    <div className="space-y-8 pb-16 animate-in fade-in duration-200">
      {/* 1. Header Banner & Identity Card */}
      <div className="relative bg-[#161824] border border-[#262A3E] rounded-3xl overflow-hidden shadow-2xl">
        {/* Cover Image */}
        <div className="relative h-48 sm:h-64 w-full overflow-hidden bg-slate-900">
          <img
            src={profile.banner || '/src/assets/images/hero_cinematic_anime_1793517807898.jpg'}
            alt="Banner"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#161824] via-[#161824]/40 to-black/30" />
        </div>

        {/* Profile Content */}
        <div className="px-6 pb-6 -mt-16 sm:-mt-20 relative z-10">
          <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-6">
            {/* Avatar & Display Info */}
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 text-center sm:text-left">
              <div className="relative group">
                <img
                  src={profile.avatar}
                  alt={profile.displayName}
                  className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl object-cover ring-4 ring-[#161824] shadow-2xl bg-slate-800"
                />
                <span className="absolute bottom-1 right-1 bg-gradient-to-r from-indigo-600 to-violet-600 text-[10px] font-bold text-white px-2 py-0.5 rounded-md ring-2 ring-[#161824] shadow-md font-mono">
                  Lv.{activeLevel}
                </span>
                {isSelf && (
                  <button
                    onClick={openEditModal}
                    className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 rounded-2xl flex items-center justify-center text-white transition-opacity text-xs font-semibold gap-1"
                    title="Change Avatar"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                )}
              </div>

              <div>
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    {profile.displayName}
                  </h1>
                  {profile.role === 'admin' && (
                    <span className="text-[10px] font-bold font-mono bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 px-1.5 py-0.5 rounded">
                      ADMIN
                    </span>
                  )}
                </div>

                {/* Unboxed Metadata with Typographic Separators */}
                <div className="flex items-center justify-center sm:justify-start gap-2 text-xs text-indigo-400 font-mono mt-0.5">
                  <span>@{profile.username}</span>
                  <span aria-hidden="true" className="text-slate-600">·</span>
                  <span className="text-slate-300 font-sans font-medium">{activeTitle}</span>
                </div>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-slate-400 mt-2">
                  {profile.country && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      {profile.country}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    Joined {profile.joinDate}
                  </span>
                  <span className="text-slate-500">·</span>
                  <span className="text-slate-300 font-mono">{userAnimeEntries.length} Anime</span>
                  <span className="text-slate-500">·</span>
                  <span className="text-slate-300 font-mono">{userMangaEntries.length} Manga</span>
                </div>
              </div>
            </div>

            {/* Profile Action Buttons */}
            <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2.5">
              {isSelf ? (
                <>
                  <button
                    onClick={openEditModal}
                    className="min-h-[40px] px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow-md shadow-indigo-600/30 active:scale-95"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Edit Profile & Security</span>
                  </button>
                  <button
                    onClick={() => setIsIdentityCardOpen(true)}
                    className="min-h-[40px] px-4 py-2 bg-[#12141F] hover:bg-[#1C2033] border border-[#262A3E] text-indigo-300 hover:text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
                  >
                    <Sparkles className="w-4 h-4 text-indigo-400" />
                    <span>Identity Card</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => toggleFollow(profile.id)}
                  className={`min-h-[40px] px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-md ${
                    isFollowing
                      ? 'bg-[#1F2335] text-slate-200 border border-[#2A2F45]'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
                  }`}
                >
                  {isFollowing ? <Check className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                  {isFollowing ? 'Following' : 'Follow User'}
                </button>
              )}

              <button
                onClick={handleShareProfile}
                className="min-w-[40px] min-h-[40px] flex items-center justify-center bg-[#12141F] hover:bg-[#1F2335] border border-[#262A3E] text-slate-300 hover:text-white rounded-xl transition-colors"
                title="Share Profile Link"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Biography */}
          <div className="mt-5 max-w-3xl text-xs sm:text-sm text-slate-300 leading-relaxed text-center sm:text-left">
            {profile.bio || 'Anime enthusiast, manga reader, and seasonal watcher.'}
          </div>

          {/* Gamification Level & XP Progress Banner */}
          <div className="mt-5">
            <GamificationBanner
              level={activeLevel}
              title={activeTitle}
              totalXp={activeXp}
              nextLevelXp={activeNextXp}
              progressPercent={activeProgressPct}
              episodesWatched={gamification.episodesWatched}
              chaptersRead={gamification.chaptersRead}
              reviewsWritten={gamification.reviewsWritten}
              unlockedBadgesCount={gamification.unlockedBadgesCount}
              totalBadgesCount={gamification.totalBadgesCount}
            />
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 px-6 border-t border-[#262A3E] bg-[#12141F] overflow-x-auto scrollbar-none text-xs font-semibold">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'anime', label: `Anime (${userAnimeEntries.length})` },
            { id: 'manga', label: `Manga (${userMangaEntries.length})` },
            { id: 'favorites', label: `Favorites (${favoriteMedia.length})` },
            { id: 'reviews', label: `Reviews (${userReviews.length})` },
            { id: 'achievements', label: `Badges (${activeBadges.length})` },
            { id: 'stats', label: 'Analytics' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3.5 px-4 border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? 'border-indigo-500 text-indigo-400 font-bold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 2. OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Prominent Card Split: Streak Counter Card + Quick Stats Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Prominent Streak Counter Card in Profile Overview (§User Requirement) */}
            <div className="lg:col-span-5 flex flex-col">
              <StreakCounterCard
                streak={streak}
                className="h-full flex-1"
              />
            </div>

            {/* Quick Stats Bento */}
            <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-3.5">
              <div className="bg-[#161824] border border-[#262A3E] rounded-2xl p-4 flex flex-col justify-between">
                <span className="text-[11px] font-semibold text-slate-400 uppercase">Anime Completed</span>
                <div className="mt-2 text-2xl font-bold font-mono text-white">
                  {userAnimeEntries.filter(e => e.status === 'completed').length}
                </div>
                <span className="text-[10px] text-slate-500 mt-1 font-mono">
                  of {userAnimeEntries.length} tracked
                </span>
              </div>

              <div className="bg-[#161824] border border-[#262A3E] rounded-2xl p-4 flex flex-col justify-between">
                <span className="text-[11px] font-semibold text-slate-400 uppercase">Episodes Logged</span>
                <div className="mt-2 text-2xl font-bold font-mono text-indigo-400">
                  {stats.episodesWatched}
                </div>
                <span className="text-[10px] text-slate-500 mt-1 font-mono">
                  ~{stats.daysWatched} days watched
                </span>
              </div>

              <div className="bg-[#161824] border border-[#262A3E] rounded-2xl p-4 flex flex-col justify-between">
                <span className="text-[11px] font-semibold text-slate-400 uppercase">Manga Chapters</span>
                <div className="mt-2 text-2xl font-bold font-mono text-emerald-400">
                  {stats.chaptersRead}
                </div>
                <span className="text-[10px] text-slate-500 mt-1 font-mono">
                  {userMangaEntries.length} series
                </span>
              </div>

              <div className="bg-[#161824] border border-[#262A3E] rounded-2xl p-4 flex flex-col justify-between">
                <span className="text-[11px] font-semibold text-slate-400 uppercase">Mean Rating</span>
                <div className="mt-2 text-2xl font-bold font-mono text-amber-300 flex items-center gap-1">
                  <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                  <span>{stats.averageScore}</span>
                </div>
                <span className="text-[10px] text-slate-500 mt-1 font-mono">out of 10.0</span>
              </div>

              <div className="bg-[#161824] border border-[#262A3E] rounded-2xl p-4 flex flex-col justify-between">
                <span className="text-[11px] font-semibold text-slate-400 uppercase">Reviews Published</span>
                <div className="mt-2 text-2xl font-bold font-mono text-violet-400">
                  {userReviews.length}
                </div>
                <span className="text-[10px] text-slate-500 mt-1 font-mono">Community critic</span>
              </div>

              <div className="bg-[#161824] border border-[#262A3E] rounded-2xl p-4 flex flex-col justify-between">
                <span className="text-[11px] font-semibold text-slate-400 uppercase">Badges Earned</span>
                <div className="mt-2 text-2xl font-bold font-mono text-rose-400 flex items-center gap-1">
                  <Trophy className="w-5 h-5 text-rose-400" />
                  <span>{activeBadges.length}</span>
                </div>
                <span className="text-[10px] text-slate-500 mt-1 font-mono">
                  Otaku Milestones
                </span>
              </div>
            </div>
          </div>

          {/* Personality Archetype Card */}
          <PersonalityCard personality={profile.personality} />

          {/* Currently Watching Section */}
          {currentlyWatching.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                  <Play className="w-4 h-4 text-indigo-400 fill-indigo-400" />
                  Currently Watching ({currentlyWatching.length})
                </h3>
                <button
                  onClick={() => setActiveTab('anime')}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
                >
                  View All Anime →
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {currentlyWatching.slice(0, 6).map(media => (
                  <AnimeCard key={media.id} media={media} showProgress={true} />
                ))}
              </div>
            </div>
          )}

          {/* Favorites Showcase */}
          {favoriteMedia.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                  <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
                  All-Time Favorites ({favoriteMedia.length})
                </h3>
                <button
                  onClick={() => setActiveTab('favorites')}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
                >
                  View Showcase →
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {favoriteMedia.slice(0, 6).map(media => (
                  <AnimeCard key={media.id} media={media} showProgress={false} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. ANIME LIST TAB */}
      {activeTab === 'anime' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Anime Watchlist ({userAnimeEntries.length})</h3>
            <span className="text-xs text-slate-400 font-mono">
              {userAnimeEntries.filter(e => e.status === 'completed').length} completed
            </span>
          </div>

          {userAnimeEntries.length === 0 ? (
            <div className="p-12 text-center bg-[#161824] border border-[#262A3E] rounded-2xl text-slate-400 text-xs">
              No anime titles tracked yet. Add titles from Discover or My Library.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {userAnimeEntries.map(entry => {
                const media = mediaItems.find(m => m.id === entry.mediaId);
                if (!media) return null;
                return <AnimeCard key={entry.id} media={media} showProgress={true} />;
              })}
            </div>
          )}
        </div>
      )}

      {/* 4. MANGA LIST TAB */}
      {activeTab === 'manga' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Manga & Light Novels ({userMangaEntries.length})</h3>
            <span className="text-xs text-slate-400 font-mono">
              {userMangaEntries.filter(e => e.status === 'completed').length} completed
            </span>
          </div>

          {userMangaEntries.length === 0 ? (
            <div className="p-12 text-center bg-[#161824] border border-[#262A3E] rounded-2xl text-slate-400 text-xs">
              No manga titles tracked yet.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {userMangaEntries.map(entry => {
                const media = mediaItems.find(m => m.id === entry.mediaId);
                if (!media) return null;
                return <AnimeCard key={entry.id} media={media} showProgress={true} />;
              })}
            </div>
          )}
        </div>
      )}

      {/* 5. FAVORITES TAB */}
      {activeTab === 'favorites' && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-white">Curated Favorites ({favoriteMedia.length})</h3>
          {favoriteMedia.length === 0 ? (
            <div className="p-12 text-center bg-[#161824] border border-[#262A3E] rounded-2xl text-slate-400 text-xs">
              No favorites saved yet. Click the heart icon on any anime card to add it here.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {favoriteMedia.map(media => (
                <AnimeCard key={media.id} media={media} showProgress={false} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* 6. REVIEWS TAB */}
      {activeTab === 'reviews' && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-white">User Reviews ({userReviews.length})</h3>
          {userReviews.length === 0 ? (
            <div className="p-12 text-center bg-[#161824] border border-[#262A3E] rounded-2xl text-slate-400 text-xs">
              No reviews written yet. Review an anime from its detail card to share your thoughts.
            </div>
          ) : (
            <div className="space-y-4">
              {userReviews.map(r => {
                const media = mediaItems.find(m => m.id === r.mediaId);
                return (
                  <div key={r.id} className="p-5 bg-[#161824] border border-[#262A3E] rounded-2xl space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {media && (
                          <img
                            src={media.coverImage}
                            alt={media.title}
                            className="w-10 h-14 object-cover rounded-lg bg-slate-800"
                          />
                        )}
                        <div>
                          <div className="font-bold text-white text-sm">{r.title}</div>
                          <div className="text-xs text-indigo-400">{media?.title}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 font-mono font-bold text-amber-300">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        <span>{r.rating}/10</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{r.content}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 7. BADGES & ACHIEVEMENTS TAB */}
      {activeTab === 'achievements' && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#12141F] border border-[#262A3E] rounded-xl text-xs font-semibold">
            {(['all', 'episodes', 'manga', 'reviews', 'completion', 'special'] as const).map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedBadgeCategory(cat)}
                className={`px-3 py-1.5 rounded-lg capitalize transition-colors ${
                  selectedBadgeCategory === cat
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredBadges.map(b => (
              <div
                key={b.id}
                className="p-4 bg-[#161824] border border-[#262A3E] rounded-2xl flex items-start gap-3.5 hover:border-indigo-500/50 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/40 text-indigo-400 flex items-center justify-center shrink-0">
                  {getBadgeIcon(b.icon)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-white text-xs truncate">{b.name}</h4>
                    <span className="text-[10px] text-amber-300 font-mono">+{b.xpReward} XP</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">{b.description}</p>
                  <div className="mt-2 text-[10px] text-indigo-400 font-mono uppercase">
                    Tier {b.tier} · {b.category}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 8. STATS & ANALYTICS TAB */}
      {activeTab === 'stats' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 bg-[#161824] border border-[#262A3E] rounded-2xl text-center">
              <div className="text-3xl font-extrabold text-white font-mono">{stats.daysWatched}</div>
              <div className="text-xs text-slate-400 mt-1">Days Watched (Non-Stop)</div>
            </div>
            <div className="p-5 bg-[#161824] border border-[#262A3E] rounded-2xl text-center">
              <div className="text-3xl font-extrabold text-indigo-400 font-mono">{stats.animeCount}</div>
              <div className="text-xs text-slate-400 mt-1">Total Anime Tracked</div>
            </div>
            <div className="p-5 bg-[#161824] border border-[#262A3E] rounded-2xl text-center">
              <div className="text-3xl font-extrabold text-emerald-400 font-mono">{stats.mangaCount}</div>
              <div className="text-xs text-slate-400 mt-1">Total Manga Tracked</div>
            </div>
          </div>
        </div>
      )}

      {/* -------------------- EDIT PROFILE & SECURITY MODAL -------------------- */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-[#161824] border border-[#262A3E] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-[#262A3E] bg-[#12141F]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
                  <Settings className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white tracking-tight">Account & Profile Settings</h3>
                  <p className="text-[11px] text-slate-400">Manage your profile identity, avatar, and password</p>
                </div>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-[#1E2235] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Subtabs: Profile Details vs Password & Security */}
            <div className="grid grid-cols-2 p-2 bg-[#0F1016] border-b border-[#262A3E] gap-1.5 text-xs font-semibold">
              <button
                type="button"
                onClick={() => {
                  setEditTab('profile');
                  setSecurityStatus(null);
                }}
                className={`py-2 rounded-xl transition-all flex items-center justify-center gap-2 ${
                  editTab === 'profile'
                    ? 'bg-[#1E2235] text-white font-bold border border-indigo-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Profile Information</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditTab('security');
                  setSecurityStatus(null);
                }}
                className={`py-2 rounded-xl transition-all flex items-center justify-center gap-2 ${
                  editTab === 'security'
                    ? 'bg-[#1E2235] text-white font-bold border border-indigo-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                <span>Change Password</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto space-y-4 flex-1">
              {/* TAB 1: PROFILE DETAILS FORM */}
              {editTab === 'profile' && (
                <form onSubmit={handleSaveProfile} className="space-y-4">
                  {/* Display Name */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Display Name <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={editDisplayName}
                      onChange={e => setEditDisplayName(e.target.value)}
                      placeholder="e.g. Kenji Tanaka"
                      required
                      className="w-full bg-[#10121C] border border-[#262A3E] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>

                  {/* Username */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Username <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs font-mono">@</span>
                      <input
                        type="text"
                        value={editUsername}
                        onChange={e => setEditUsername(e.target.value.replace(/[^a-zA-Z0-9_]/g, ''))}
                        placeholder="username"
                        required
                        className="w-full bg-[#10121C] border border-[#262A3E] rounded-xl pl-8 pr-3.5 py-2.5 text-xs text-white outline-none focus:border-indigo-500 transition-colors font-mono"
                      />
                    </div>
                  </div>

                  {/* Bio */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Bio / About Me
                    </label>
                    <textarea
                      value={editBio}
                      onChange={e => setEditBio(e.target.value)}
                      rows={3}
                      maxLength={240}
                      placeholder="Tell the community about your anime journey, favorite studios, or current watch goals..."
                      className="w-full bg-[#10121C] border border-[#262A3E] rounded-xl p-3 text-xs text-white outline-none focus:border-indigo-500 transition-colors resize-none"
                    />
                    <div className="text-right text-[10px] text-slate-500 font-mono">
                      {editBio.length}/240
                    </div>
                  </div>

                  {/* Avatar Picker */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Profile Avatar
                    </label>

                    {/* Preview + URL */}
                    <div className="flex items-center gap-3 mb-3">
                      <img
                        src={editAvatar}
                        alt="Preview"
                        className="w-12 h-12 rounded-xl object-cover ring-2 ring-indigo-500/50 bg-slate-900 shrink-0"
                      />
                      <input
                        type="url"
                        value={editAvatar}
                        onChange={e => setEditAvatar(e.target.value)}
                        placeholder="Paste custom image URL..."
                        className="flex-1 bg-[#10121C] border border-[#262A3E] rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-indigo-500 transition-colors"
                      />
                    </div>

                    {/* Presets */}
                    <div className="text-[11px] text-slate-400 mb-1.5">Or choose a preset:</div>
                    <div className="grid grid-cols-4 gap-2">
                      {avatarPresets.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setEditAvatar(preset)}
                          className={`aspect-square rounded-xl overflow-hidden border-2 transition-all p-0.5 ${
                            editAvatar === preset
                              ? 'border-indigo-500 ring-2 ring-indigo-500/40 scale-105'
                              : 'border-[#262A3E] hover:border-slate-500 opacity-70 hover:opacity-100'
                          }`}
                        >
                          <img src={preset} alt="preset" className="w-full h-full object-cover rounded-lg" />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-600/30 flex items-center justify-center gap-2"
                    >
                      <Check className="w-4 h-4" />
                      <span>{isSubmitting ? 'Saving Changes...' : 'Save Profile Details'}</span>
                    </button>
                  </div>
                </form>
              )}

              {/* TAB 2: PASSWORD & SECURITY */}
              {editTab === 'security' && (
                <form onSubmit={handleChangePassword} className="space-y-4">
                  {/* Status Banner */}
                  {securityStatus && (
                    <div
                      className={`p-3.5 rounded-xl border flex items-start gap-2.5 text-xs animate-in fade-in duration-150 ${
                        securityStatus.type === 'error'
                          ? 'bg-rose-950/40 border-rose-500/40 text-rose-200'
                          : 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                      }`}
                    >
                      {securityStatus.type === 'error' ? (
                        <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <p className="font-semibold">
                          {securityStatus.type === 'error' ? 'Security Notice' : 'Success'}
                        </p>
                        <p className="text-[11px] mt-0.5">{securityStatus.message}</p>
                      </div>
                    </div>
                  )}

                  <div className="p-3 bg-[#10121C] border border-[#262A3E] rounded-xl text-xs text-slate-400 space-y-1">
                    <p className="font-semibold text-slate-200">Account Security Status</p>
                    <p className="text-[11px]">
                      {firebaseUser
                        ? `Authenticated as: ${firebaseUser.email || currentUser.username}`
                        : 'Local Session Active. Password updates sync with your Firebase credentials.'}
                    </p>
                  </div>

                  {/* New Password */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      New Password (Minimum 6 characters)
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                        placeholder="Enter new strong password"
                        minLength={6}
                        required
                        className="w-full bg-[#10121C] border border-[#262A3E] rounded-xl pl-3.5 pr-10 py-2.5 text-xs text-white outline-none focus:border-indigo-500 transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Confirm New Password
                    </label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter new password"
                      minLength={6}
                      required
                      className="w-full bg-[#10121C] border border-[#262A3E] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting || !newPassword}
                      className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-600/30 flex items-center justify-center gap-2"
                    >
                      <Lock className="w-4 h-4" />
                      <span>{isSubmitting ? 'Updating Password...' : 'Update Password'}</span>
                    </button>
                  </div>

                  {/* Reset Password Email fallback */}
                  <div className="pt-2 border-t border-[#262A3E] text-center">
                    <button
                      type="button"
                      onClick={handleSendResetEmail}
                      disabled={isSubmitting}
                      className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
                    >
                      Forgot current password? Send recovery email
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
