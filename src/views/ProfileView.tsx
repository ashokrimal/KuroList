/**
 * ProfileView - Public & Personal Anime Identity Profile
 * Comprehensive gamification system: real-time XP calculation, dynamic badges,
 * milestone trackers (episodes, chapters, reviews), and public profile display
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
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AnimeCard } from '../components/AnimeCard';
import { UserProfile, BadgeCategory, UserBadge } from '../types';
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
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'anime' | 'manga' | 'favorites' | 'reviews' | 'stats' | 'achievements'>('overview');
  const [selectedBadgeCategory, setSelectedBadgeCategory] = useState<BadgeCategory | 'all'>('all');

  const profile = activeProfileViewUser;
  const isSelf = profile.id === currentUser.id;
  const isFollowing = following.includes(profile.id);

  // User library items
  const userAnimeEntries = library.filter(e => e.userId === profile.id && e.mediaType === 'anime');
  const userMangaEntries = library.filter(e => e.userId === profile.id && (e.mediaType === 'manga' || e.mediaType === 'manhwa'));

  // Currently watching
  const currentlyWatching = userAnimeEntries
    .filter(e => e.status === 'watching')
    .map(e => mediaItems.find(m => m.id === e.mediaId))
    .filter(Boolean);

  // Favorites
  const favoriteMedia = profile.favoriteMediaIds
    .map(id => mediaItems.find(m => m.id === id))
    .filter(Boolean);

  // User reviews
  const userReviews = reviews.filter(r => r.userId === profile.id);

  // Gamification metrics: if looking at self, use live computed gamification state
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

  return (
    <div className="space-y-8 pb-16">
      {/* 1. Header Banner & Identity Card */}
      <div className="relative bg-[#181A26] border border-[#2A2F45] rounded-3xl overflow-hidden shadow-2xl">
        {/* Cover Image */}
        <div className="relative h-48 sm:h-64 w-full overflow-hidden bg-slate-900">
          <img
            src={profile.banner || '/src/assets/images/hero_cinematic_anime_1793517807898.jpg'}
            alt="Banner"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#181A26] via-[#181A26]/40 to-black/30" />
        </div>

        {/* Profile Content */}
        <div className="px-6 pb-6 -mt-16 sm:-mt-20 relative z-10">
          <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-6">
            {/* Avatar & Display Info */}
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 text-center sm:text-left">
              <div className="relative">
                <img
                  src={profile.avatar}
                  alt={profile.displayName}
                  className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl object-cover ring-4 ring-[#181A26] shadow-2xl bg-slate-800"
                />
                <span className="absolute bottom-1 right-1 bg-gradient-to-r from-indigo-600 to-violet-600 text-[10px] font-bold text-white px-2 py-0.5 rounded-md ring-2 ring-[#181A26] shadow-md">
                  Lv.{activeLevel}
                </span>
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

                <div className="flex items-center justify-center sm:justify-start gap-2 text-xs text-indigo-400 font-mono mt-0.5">
                  <span>@{profile.username}</span>
                  <span className="text-slate-600">·</span>
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
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex items-center gap-2.5">
              {!isSelf && (
                <button
                  onClick={() => toggleFollow(profile.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-md ${
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
                onClick={() => setIsIdentityCardOpen(true)}
                className="px-4 py-2 bg-gradient-to-r from-indigo-500/15 to-violet-500/15 border border-indigo-500/30 hover:border-indigo-400 text-indigo-300 hover:text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
              >
                <Sparkles className="w-4 h-4 text-indigo-400" />
                Anime Identity Card
              </button>

              <button
                onClick={handleShareProfile}
                className="p-2 bg-[#131520] hover:bg-[#1F2335] border border-[#2A2F45] text-slate-300 hover:text-white rounded-xl transition-colors"
                title="Share Profile"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Biography */}
          <div className="mt-5 max-w-3xl text-xs sm:text-sm text-slate-300 leading-relaxed text-center sm:text-left">
            {profile.bio}
          </div>

          {/* Gamification Level & XP Progress Banner */}
          <div className="mt-6 p-4 bg-[#131520] border border-[#2A2F45] rounded-2xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-2">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold text-white">Level {activeLevel} · {activeTitle}</span>
                <span className="text-[11px] font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">
                  {activeXp.toLocaleString()} Total XP
                </span>
              </div>
              <div className="text-xs text-slate-400 font-mono">
                {activeXp.toLocaleString()} / {activeNextXp.toLocaleString()} XP ({activeProgressPct}%)
              </div>
            </div>

            {/* XP Progress Bar */}
            <div className="w-full bg-[#181A26] h-2.5 rounded-full overflow-hidden border border-white/5">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 via-violet-500 to-amber-400 rounded-full transition-all duration-500"
                style={{ width: `${activeProgressPct}%` }}
              />
            </div>

            {/* Dynamic Milestone Counters */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-3 border-t border-[#2A2F45]/60 text-center">
              <div>
                <div className="text-[10px] text-slate-400 uppercase tracking-wider flex items-center justify-center gap-1">
                  <Play className="w-3 h-3 text-indigo-400" />
                  Episodes Watched
                </div>
                <div className="text-sm font-bold font-mono text-white mt-0.5">
                  {isSelf ? gamification.episodesWatched : stats.episodesWatched}
                  <span className="text-[10px] text-slate-500 font-normal ml-1">
                    (+{((isSelf ? gamification.episodesWatched : stats.episodesWatched) * 15).toLocaleString()} XP)
                  </span>
                </div>
              </div>

              <div>
                <div className="text-[10px] text-slate-400 uppercase tracking-wider flex items-center justify-center gap-1">
                  <BookOpen className="w-3 h-3 text-indigo-400" />
                  Chapters Read
                </div>
                <div className="text-sm font-bold font-mono text-white mt-0.5">
                  {isSelf ? gamification.chaptersRead : stats.chaptersRead}
                  <span className="text-[10px] text-slate-500 font-normal ml-1">
                    (+{((isSelf ? gamification.chaptersRead : stats.chaptersRead) * 10).toLocaleString()} XP)
                  </span>
                </div>
              </div>

              <div>
                <div className="text-[10px] text-slate-400 uppercase tracking-wider flex items-center justify-center gap-1">
                  <Feather className="w-3 h-3 text-indigo-400" />
                  Reviews Written
                </div>
                <div className="text-sm font-bold font-mono text-white mt-0.5">
                  {isSelf ? gamification.reviewsWritten : userReviews.length}
                  <span className="text-[10px] text-slate-500 font-normal ml-1">
                    (+{((isSelf ? gamification.reviewsWritten : userReviews.length) * 200).toLocaleString()} XP)
                  </span>
                </div>
              </div>

              <div>
                <div className="text-[10px] text-slate-400 uppercase tracking-wider flex items-center justify-center gap-1">
                  <Award className="w-3 h-3 text-amber-400" />
                  Badges Unlocked
                </div>
                <div className="text-sm font-bold font-mono text-amber-300 mt-0.5">
                  {isSelf ? `${gamification.unlockedBadgesCount} / ${gamification.totalBadgesCount}` : '4 Unlocked'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Navigation Tabs */}
      <div className="flex items-center gap-4 border-b border-[#2A2F45] overflow-x-auto no-scrollbar text-xs font-medium">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'anime', label: `Anime (${userAnimeEntries.length})` },
          { id: 'manga', label: `Manga (${userMangaEntries.length})` },
          { id: 'favorites', label: `Favorites (${favoriteMedia.length})` },
          { id: 'reviews', label: `Reviews (${userReviews.length})` },
          { id: 'stats', label: 'Analytics & Visuals' },
          { id: 'achievements', label: `Badges & XP (${isSelf ? gamification.unlockedBadgesCount : 4})` }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`pb-3 transition-colors relative whitespace-nowrap shrink-0 ${
              activeTab === tab.id ? 'text-indigo-400 font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            {tab.label}
            {activeTab === tab.id && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 rounded-full" />}
          </button>
        ))}
      </div>

      {/* 3. Tab Contents */}

      {/* Tab: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Earned Badges Showcase */}
          <div className="bg-[#181A26] border border-[#2A2F45] rounded-2xl p-5 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white">Earned Badges Showcase</h3>
              </div>
              <button
                onClick={() => setActiveTab('achievements')}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
              >
                View all ({isSelf ? gamification.totalBadgesCount : 12}) <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {(isSelf ? gamification.badges.filter(b => b.unlocked) : []).slice(0, 4).map(badge => {
                const colors = getTierColors(badge.tier);

                return (
                  <div
                    key={badge.id}
                    className={`p-3 rounded-xl border ${colors.bg} ${colors.border} flex items-center gap-3 transition-transform hover:scale-102`}
                  >
                    <div className={`p-2 rounded-lg bg-[#131520] ${colors.text} shrink-0`}>
                      {getBadgeIcon(badge.icon)}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-white truncate">{badge.name}</div>
                      <div className="text-[10px] text-slate-400 capitalize">{badge.tier} · +{badge.xpReward} XP</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Personality Archetype Card */}
          <div className="bg-gradient-to-r from-indigo-950/40 via-[#181A26] to-[#181A26] border border-indigo-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs text-indigo-400 font-semibold uppercase tracking-wider mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  Anime Personality Archetype
                </div>
                <h3 className="text-lg font-bold text-white tracking-tight">{profile.personality.title}</h3>
                <p className="text-xs text-slate-300 mt-1 max-w-xl">{profile.personality.tagline}</p>
              </div>

              <div className="px-4 py-2 bg-[#131520] border border-[#2A2F45] rounded-xl text-center shrink-0">
                <div className="text-[10px] text-slate-400 uppercase tracking-wider">Watching Pace</div>
                <div className="text-xs font-bold text-indigo-300 mt-0.5">{profile.personality.watchingPace}</div>
              </div>
            </div>

            <p className="text-xs text-slate-400 mt-4 leading-relaxed border-t border-[#2A2F45]/60 pt-3">
              {profile.personality.vibeDescription}
            </p>
          </div>

          {/* Currently Watching Row */}
          {currentlyWatching.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-white">Currently Watching</h3>
                <span className="text-xs text-slate-400 font-mono">{currentlyWatching.length} active</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {currentlyWatching.map(media => (
                  <AnimeCard key={media?.id} media={media!} />
                ))}
              </div>
            </div>
          )}

          {/* Hall of Fame Favorites */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                Favorite Series
              </h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {favoriteMedia.map(media => (
                <AnimeCard key={media?.id} media={media!} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Anime List */}
      {activeTab === 'anime' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {userAnimeEntries.map(entry => {
            const media = mediaItems.find(m => m.id === entry.mediaId);
            if (!media) return null;
            return <AnimeCard key={media.id} media={media} />;
          })}
        </div>
      )}

      {/* Tab: Manga List */}
      {activeTab === 'manga' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {userMangaEntries.map(entry => {
            const media = mediaItems.find(m => m.id === entry.mediaId);
            if (!media) return null;
            return <AnimeCard key={media.id} media={media} />;
          })}
        </div>
      )}

      {/* Tab: Favorites */}
      {activeTab === 'favorites' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {favoriteMedia.map(media => (
              <AnimeCard key={media?.id} media={media!} />
            ))}
          </div>

          {/* Favorite Studios & Characters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
            <div className="bg-[#181A26] border border-[#2A2F45] rounded-2xl p-5">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                Favorite Studios
              </h4>
              <div className="flex flex-wrap gap-2">
                {profile.favoriteStudios.map(studio => (
                  <span key={studio} className="px-3 py-1 bg-[#131520] border border-[#2A2F45] text-xs font-medium text-white rounded-lg">
                    {studio}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-[#181A26] border border-[#2A2F45] rounded-2xl p-5">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                Favorite Characters
              </h4>
              <div className="flex flex-wrap gap-2">
                {profile.favoriteCharacterNames.map(char => (
                  <span key={char} className="px-3 py-1 bg-[#131520] border border-[#2A2F45] text-xs font-medium text-indigo-300 rounded-lg">
                    {char}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Reviews */}
      {activeTab === 'reviews' && (
        <div className="space-y-4">
          {userReviews.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-400 bg-[#181A26] rounded-2xl border border-[#2A2F45]">
              No written reviews published yet.
            </div>
          ) : (
            userReviews.map(review => (
              <div key={review.id} className="bg-[#181A26] border border-[#2A2F45] rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={review.mediaCover} alt={review.mediaTitle} className="w-9 h-12 object-cover rounded-lg" />
                    <div>
                      <h4 className="text-sm font-bold text-white">{review.mediaTitle}</h4>
                      <div className="text-xs text-indigo-400 font-mono font-semibold">★ {review.rating}/10</div>
                    </div>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">{review.createdAt}</span>
                </div>

                <h5 className="text-xs font-bold text-white">{review.title}</h5>
                <p className="text-xs text-slate-300 leading-relaxed">{review.content}</p>

                <div className="flex items-center gap-1.5 text-xs text-slate-400 pt-2 border-t border-[#2A2F45]/50">
                  <ThumbsUp className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{review.helpfulCount} community members found this helpful</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab: Visual Analytics & Statistics */}
      {activeTab === 'stats' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Genre Distribution Bars */}
            <div className="bg-[#181A26] border border-[#2A2F45] rounded-2xl p-6 shadow-xl">
              <h3 className="text-sm font-bold text-white mb-1">Genre Distribution</h3>
              <p className="text-xs text-slate-400 mb-5">Breakdown of content logged across all genres</p>

              <div className="space-y-3">
                {Object.entries(stats.genreCounts).map(([genre, count]) => {
                  const maxCount = Math.max(...Object.values(stats.genreCounts), 1);
                  const pct = Math.round((count / maxCount) * 100);

                  return (
                    <div key={genre}>
                      <div className="flex items-center justify-between text-xs text-slate-300 mb-1">
                        <span className="font-medium">{genre}</span>
                        <span className="font-mono text-slate-400">{count} titles</span>
                      </div>
                      <div className="w-full bg-[#131520] h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-indigo-500 to-violet-500 h-full rounded-full"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Score Distribution (1 to 10) */}
            <div className="bg-[#181A26] border border-[#2A2F45] rounded-2xl p-6 shadow-xl">
              <h3 className="text-sm font-bold text-white mb-1">Score Distribution</h3>
              <p className="text-xs text-slate-400 mb-5">Ratings given across your entire library</p>

              <div className="flex items-end justify-between h-48 pt-6 px-2 gap-1.5">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(s => {
                  const count = stats.scoreDistribution[s] || 0;
                  const maxS = Math.max(...Object.values(stats.scoreDistribution), 1);
                  const heightPct = Math.max(8, Math.round((count / maxS) * 100));

                  return (
                    <div key={s} className="flex-1 flex flex-col items-center gap-1.5">
                      <span className="text-[10px] font-mono text-slate-400">{count > 0 ? count : ''}</span>
                      <div className="w-full bg-[#131520] rounded-t flex-1 flex items-end">
                        <div
                          className={`w-full rounded-t transition-all ${
                            s === 10 ? 'bg-amber-400' : s >= 8 ? 'bg-indigo-500' : 'bg-slate-600'
                          }`}
                          style={{ height: `${heightPct}%` }}
                        />
                      </div>
                      <span className="text-[11px] font-mono font-bold text-slate-300">{s}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Badges & Gamification Center */}
      {activeTab === 'achievements' && (
        <div className="space-y-6">
          {/* Milestone Overview Card */}
          <div className="bg-[#181A26] border border-[#2A2F45] rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
            <div className="space-y-1">
              <div className="text-xs text-indigo-400 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-amber-400" />
                Prestige Rank Progression
              </div>
              <h3 className="text-xl font-bold text-white">Level {activeLevel} · {activeTitle}</h3>
              <p className="text-xs text-slate-400 max-w-md leading-relaxed">
                Watch episodes (+15 XP), read chapters (+10 XP), write reviews (+200 XP), and complete series (+150 XP) to earn prestige ranks.
              </p>
            </div>

            <div className="w-full md:w-64 bg-[#131520] border border-[#2A2F45] rounded-xl p-4 text-center">
              <div className="text-xs text-slate-400 font-mono">
                {activeXp.toLocaleString()} / {activeNextXp.toLocaleString()} XP
              </div>
              <div className="w-full bg-[#181A26] h-2.5 rounded-full overflow-hidden mt-2">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-amber-400 h-full rounded-full"
                  style={{ width: `${activeProgressPct}%` }}
                />
              </div>
              <div className="text-[11px] text-amber-300 font-medium mt-2">
                Next Rank: Level {activeLevel + 1}
              </div>
            </div>
          </div>

          {/* Badge Category Segmented Controls */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar p-1.5 bg-[#181A26] border border-[#2A2F45] rounded-xl">
            {(['all', 'episodes', 'manga', 'reviews', 'completion', 'special'] as const).map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedBadgeCategory(cat)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition-all whitespace-nowrap shrink-0 ${
                  selectedBadgeCategory === cat
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {cat === 'all' ? 'All Badges' : cat}
              </button>
            ))}
          </div>

          {/* Badges Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredBadges.map(badge => {
              const colors = getTierColors(badge.tier);
              const cur = badge.currentProgress ?? 0;
              const req = badge.requiredProgress || 1;
              const progressPct = Math.round((cur / req) * 100);

              return (
                <div
                  key={badge.id}
                  onClick={() => {
                    if (badge.unlocked) {
                      triggerCelebration({
                        type: 'badge_unlocked',
                        title: badge.name,
                        subtitle: badge.description,
                        xpEarned: badge.xpReward || 50,
                        badge
                      });
                    }
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
                    badge.unlocked
                      ? `${colors.bg} ${colors.border} shadow-lg hover:scale-102`
                      : 'bg-[#131520] border-[#2A2F45] opacity-60 hover:opacity-80'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className={`p-2.5 rounded-xl bg-[#0F1016] ${colors.text} shrink-0 ring-1 ring-white/10`}>
                        {getBadgeIcon(badge.icon)}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-xs font-bold text-white leading-tight">{badge.name}</h4>
                          {badge.unlocked && (
                            <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400 capitalize font-medium">
                          {badge.tier} Tier · {badge.category}
                        </div>
                      </div>
                    </div>

                    <span className="text-[10px] font-mono font-bold text-indigo-400 shrink-0">
                      +{badge.xpReward} XP
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-snug min-h-[32px]">{badge.description}</p>

                  {/* Progress Tracker Bar */}
                  <div className="mt-3 pt-3 border-t border-white/5 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-slate-400">
                        {badge.currentProgress} / {badge.requiredProgress} {badge.unit}
                      </span>
                      <span className={badge.unlocked ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                        {badge.unlocked ? 'Unlocked' : `${progressPct}%`}
                      </span>
                    </div>

                    <div className="w-full bg-[#0F1016] h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          badge.unlocked ? 'bg-emerald-400' : 'bg-indigo-500'
                        }`}
                        style={{ width: `${Math.min(100, progressPct)}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
