/**
 * HomeView - Rich Dashboard & Social Activity Feed
 * Features cinematic hero spotlight, live continue-watching bar, friend social updates, and trending releases
 */

import React, { useState } from 'react';
import {
  Play,
  Bookmark,
  Star,
  Plus,
  Heart,
  MessageSquare,
  ThumbsUp,
  Flame,
  Clock,
  Compass,
  ArrowRight,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AnimeCard } from '../components/AnimeCard';
import { HomeSkeleton } from '../components/SkeletonLoader';

export const HomeView: React.FC = () => {
  const {
    mediaItems,
    library,
    activities,
    likeActivity,
    commentActivity,
    currentUser,
    setSelectedMedia,
    openAddToListModal,
    incrementProgress,
    setActiveView,
    setIsIdentityCardOpen
  } = useApp();

  const [isLoading, setIsLoading] = useState(true);
  const [commentInputs, setCommentInputs] = useState<{ [activityId: string]: string }>({});

  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 280);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <HomeSkeleton />;
  }

  // Hero anime
  const heroAnime = mediaItems.find(m => m.id === 'frieren-beyond-journey') || mediaItems[0];

  // Currently watching / reading items in user library
  const continueWatchingItems = library
    .filter(item => item.userId === currentUser.id && (item.status === 'watching' || item.status === 'reading'))
    .map(entry => {
      const media = mediaItems.find(m => m.id === entry.mediaId);
      return { entry, media };
    })
    .filter(pair => Boolean(pair.media));

  // Trending & top picks
  const trendingAnime = mediaItems.filter(m => m.type === 'anime').slice(0, 6);
  const trendingManga = mediaItems.filter(m => m.type === 'manga' || m.type === 'manhwa').slice(0, 4);

  const handleSendComment = (activityId: string) => {
    const text = commentInputs[activityId] || '';
    if (text.trim()) {
      commentActivity(activityId, text);
      setCommentInputs(prev => ({ ...prev, [activityId]: '' }));
    }
  };

  return (
    <div className="space-y-12 pb-16">
      {/* 1. Cinematic Hero Spotlight */}
      <section className="relative -mx-4 sm:-mx-6 lg:-mx-8 -mt-6">
        <div className="relative h-[440px] sm:h-[500px] w-full overflow-hidden bg-slate-950">
          <img
            src={heroAnime.bannerImage || '/src/assets/images/frieren_fantasy_banner_1793517808620.jpg'}
            alt={heroAnime.title}
            className="w-full h-full object-cover object-center brightness-75 scale-100 hover:scale-105 transition-transform duration-1000"
          />
          {/* Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F1016] via-[#0F1016]/40 to-black/40" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0F1016] via-[#0F1016]/60 to-transparent" />

          {/* Hero Content */}
          <div className="absolute bottom-10 left-4 sm:left-8 lg:left-12 max-w-2xl z-10">
            {/* Unboxed Metadata Header */}
            <div className="flex items-center gap-2 text-xs text-indigo-300 font-semibold mb-2">
              <span className="flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                #1 Rated Series of the Decade
              </span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>Madhouse</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-amber-300 font-mono">★ {heroAnime.score} / 10</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight text-balance">
              {heroAnime.title}
            </h1>

            <p className="mt-3 text-xs sm:text-sm text-slate-300 line-clamp-3 leading-relaxed max-w-xl">
              {heroAnime.synopsis}
            </p>

            {/* CTAs */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                onClick={() => setSelectedMedia(heroAnime)}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all hover:-translate-y-0.5"
              >
                <Play className="w-4 h-4 fill-white text-white" />
                View Details
              </button>

              <button
                onClick={() => openAddToListModal(heroAnime)}
                className="px-4 py-2.5 bg-[#181A26]/90 hover:bg-[#1F2335] border border-[#2A2F45] text-white rounded-xl text-xs font-medium flex items-center gap-2 transition-colors backdrop-blur-md"
              >
                <Bookmark className="w-4 h-4 text-indigo-400" />
                Track Progress
              </button>

              <button
                onClick={() => setIsIdentityCardOpen(true)}
                className="px-4 py-2.5 bg-gradient-to-r from-violet-600/20 to-indigo-600/20 hover:from-violet-600/30 hover:to-indigo-600/30 border border-indigo-500/30 text-indigo-300 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                My Anime Passport
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Continue Watching / Reading Shelf (if user has active items) */}
      {continueWatchingItems.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">Continue Tracking</h2>
              <p className="text-xs text-slate-400">Quickly log your latest episodes and chapters</p>
            </div>
            <button
              onClick={() => setActiveView('mylist')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
            >
              Full Library <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {continueWatchingItems.map(({ entry, media }) => {
              if (!media) return null;
              const isAnime = media.type === 'anime';
              const progressUnit = isAnime ? 'Ep' : 'Ch';

              return (
                <div
                  key={entry.id}
                  className="bg-[#181A26] border border-[#2A2F45] rounded-xl p-3.5 flex items-center gap-3.5 hover:border-indigo-500/50 transition-all shadow-md group"
                >
                  <img
                    src={media.coverImage}
                    alt={media.title}
                    onError={e => {
                      (e.currentTarget as HTMLImageElement).src = '/src/assets/images/anime_card_nebula_1793517807647.jpg';
                    }}
                    onClick={() => setSelectedMedia(media)}
                    className="w-14 h-20 object-cover rounded-lg shrink-0 cursor-pointer group-hover:scale-105 transition-transform bg-slate-900"
                  />

                  <div className="flex-1 min-w-0">
                    <h4
                      onClick={() => setSelectedMedia(media)}
                      className="text-xs font-bold text-white truncate cursor-pointer hover:text-indigo-400 transition-colors"
                    >
                      {media.title}
                    </h4>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {progressUnit} {entry.progress} of {entry.totalProgress || '?'}
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-[#131520] h-1.5 rounded-full overflow-hidden mt-2">
                      <div
                        className="bg-indigo-500 h-full rounded-full transition-all"
                        style={{
                          width: `${Math.min(100, (entry.progress / (entry.totalProgress || 1)) * 100)}%`
                        }}
                      />
                    </div>

                    {/* Actions */}
                    <div className="mt-2.5 flex items-center justify-between">
                      <button
                        onClick={() => openAddToListModal(media)}
                        className="text-[10px] text-slate-400 hover:text-white"
                      >
                        Edit Details
                      </button>
                      <button
                        onClick={() => incrementProgress(media.id)}
                        className="px-2.5 py-1 bg-indigo-600/20 hover:bg-indigo-600 border border-indigo-500/30 text-indigo-300 hover:text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                        title={`Log +1 ${isAnime ? 'Episode' : 'Chapter'}`}
                      >
                        <Plus className="w-3 h-3" />
                        +1 {progressUnit}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 3. Main Dashboard 2-Column: Trending Releases + Live Social Activity */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns: Trending Anime & Manga */}
        <div className="lg:col-span-2 space-y-8">
          {/* Trending Anime Carousel Grid */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                  <Flame className="w-4 h-4 text-indigo-400" />
                  Trending Anime
                </h2>
                <p className="text-xs text-slate-400">Most active series being watched this week</p>
              </div>
              <button
                onClick={() => setActiveView('discover')}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
              >
                Browse All <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {trendingAnime.map(media => (
                <AnimeCard key={media.id} media={media} />
              ))}
            </div>
          </div>

          {/* Trending Manga & Manhwa */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-white tracking-tight">Popular Manga & Manhwa</h2>
                <p className="text-xs text-slate-400">Acclaimed reads with active chapters</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {trendingManga.map(media => (
                <AnimeCard key={media.id} media={media} />
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Column: Live Friend & Community Activity Feed */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-400" />
              Live Activity
            </h2>
            <span className="text-[11px] font-mono text-slate-400">Community Real-Time</span>
          </div>

          <div className="space-y-4">
            {activities.map(act => {
              const hasLiked = act.likes.includes(currentUser.id);

              return (
                <div
                  key={act.id}
                  className="bg-[#181A26] border border-[#2A2F45] rounded-xl p-4 space-y-3 shadow-md"
                >
                  {/* User Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={act.avatar}
                        alt={act.displayName}
                        className="w-8 h-8 rounded-full object-cover ring-1 ring-[#2A2F45]"
                      />
                      <div>
                        <span className="text-xs font-semibold text-white">{act.displayName}</span>
                        <div className="text-[10px] text-slate-400 font-mono">@{act.username} · {act.timestamp}</div>
                      </div>
                    </div>
                  </div>

                  {/* Activity Body */}
                  <div className="flex items-start gap-3 bg-[#131520] p-2.5 rounded-lg border border-[#2A2F45]/50">
                    <img
                      src={act.mediaCover}
                      alt={act.mediaTitle}
                      onError={e => {
                        (e.currentTarget as HTMLImageElement).src = '/src/assets/images/anime_card_nebula_1793517807647.jpg';
                      }}
                      className="w-10 h-14 object-cover rounded shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="text-[11px] text-indigo-400 font-medium capitalize">
                        {act.type.replace('_', ' ')}
                      </div>
                      <div className="text-xs font-semibold text-white truncate">{act.mediaTitle}</div>
                      {act.progress && (
                        <div className="text-[11px] text-slate-400 mt-0.5 font-mono">
                          Reached episode {act.progress} of {act.totalProgress || '?'}
                        </div>
                      )}
                      {act.score && (
                        <div className="text-[11px] text-amber-300 font-mono mt-0.5">
                          Rated ★ {act.score}/10
                        </div>
                      )}
                      {act.reviewSnippet && (
                        <p className="text-[11px] text-slate-300 italic mt-1 line-clamp-2">
                          "{act.reviewSnippet}"
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Likes & Comments Interactive Bar */}
                  <div className="flex items-center justify-between pt-1 text-xs text-slate-400 border-t border-[#2A2F45]/40">
                    <button
                      onClick={() => likeActivity(act.id)}
                      className={`flex items-center gap-1.5 transition-colors ${
                        hasLiked ? 'text-rose-400 font-medium' : 'hover:text-white'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${hasLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                      <span>{act.likes.length}</span>
                    </button>

                    <div className="flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>{act.comments.length}</span>
                    </div>
                  </div>

                  {/* Comment List */}
                  {act.comments.length > 0 && (
                    <div className="space-y-1.5 pt-1">
                      {act.comments.map(c => (
                        <div key={c.id} className="text-[11px] bg-[#131520] p-2 rounded-lg text-slate-300">
                          <span className="font-semibold text-white mr-1.5">{c.displayName}:</span>
                          {c.text}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Comment Input */}
                  <div className="flex gap-1.5 pt-1">
                    <input
                      type="text"
                      placeholder="Write a comment..."
                      value={commentInputs[act.id] || ''}
                      onChange={e => setCommentInputs({ ...commentInputs, [act.id]: e.target.value })}
                      onKeyDown={e => {
                        if (e.key === 'Enter') handleSendComment(act.id);
                      }}
                      className="flex-1 bg-[#131520] border border-[#2A2F45] text-xs text-white rounded-lg px-2.5 py-1.5 outline-none placeholder:text-slate-500"
                    />
                    <button
                      onClick={() => handleSendComment(act.id)}
                      className="px-2.5 py-1.5 bg-indigo-600/30 hover:bg-indigo-600 text-indigo-300 hover:text-white rounded-lg text-xs font-medium transition-colors"
                    >
                      Post
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};
