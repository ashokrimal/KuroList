/**
 * Anime Identity Card Modal
 * Shareable holographic anime profile card displaying identity, personality archetype,
 * total watch time, top genres, favorite series, and rank tier
 */

import React, { useRef } from 'react';
import { X, Sparkles, Share2, Copy, Download, Star, Shield, Award, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AnimeIdentityCardModal: React.FC = () => {
  const {
    isIdentityCardOpen,
    setIsIdentityCardOpen,
    currentUser,
    stats,
    gamification,
    mediaItems,
    showToast
  } = useApp();

  const cardRef = useRef<HTMLDivElement>(null);

  if (!isIdentityCardOpen) return null;

  // Retrieve top 3 favorite anime from user's favorites
  const favoriteMedia = currentUser.favoriteMediaIds
    .map(id => mediaItems.find(m => m.id === id))
    .filter(Boolean)
    .slice(0, 3);

  const topGenres = Object.entries(stats.genreCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([genre]) => genre);

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(`https://kurolist.app/user/${currentUser.username}?card=true`);
    showToast('Shareable Anime Card link copied to clipboard!');
  };

  const handleSimulateDownload = () => {
    showToast('Generating high-res Anime Identity Card PNG...', 'info');
    setTimeout(() => {
      showToast('Anime Identity Card exported successfully!');
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#181A26] border border-[#2A2F45] rounded-3xl shadow-2xl p-6 overflow-hidden flex flex-col items-center">
        {/* Close Button */}
        <button
          onClick={() => setIsIdentityCardOpen(false)}
          className="absolute top-4 right-4 z-20 p-2 text-slate-400 hover:text-white rounded-full hover:bg-[#1F2335] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Shareable Anime Passport
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">Your Anime Identity Card</h2>
          <p className="text-xs text-slate-400 mt-1">
            Display your watching milestones, anime personality archetype, and top titles
          </p>
        </div>

        {/* The Card Viewport */}
        <div
          ref={cardRef}
          className="w-full relative aspect-[1.6/1] sm:aspect-[1.7/1] rounded-2xl overflow-hidden border-2 border-indigo-500/40 shadow-2xl shadow-indigo-950/50 p-5 flex flex-col justify-between group transition-transform hover:scale-[1.01]"
        >
          {/* Card Cosmic Background */}
          <img
            src="/src/assets/images/anime_card_nebula_1793517807647.jpg"
            alt="Cosmic background"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-[#0F1016]/95 via-[#0F1016]/75 to-indigo-950/40" />

          {/* Holographic Border Shimmer effect */}
          <div className="absolute inset-0 border border-white/10 rounded-2xl pointer-events-none" />

          {/* Top Row: User Avatar, Identity & KuroList Brand */}
          <div className="relative z-10 flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.displayName}
                  className="w-14 h-14 rounded-xl object-cover ring-2 ring-indigo-400 shadow-md"
                />
                <span className="absolute -bottom-1 -right-1 bg-indigo-600 text-[10px] font-bold text-white px-1.5 py-0.2 rounded-md ring-1 ring-[#0F1016]">
                  Lv.{gamification.level}
                </span>
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-base font-bold text-white tracking-tight">{currentUser.displayName}</h3>
                  <Award className="w-4 h-4 text-amber-400 shrink-0" />
                </div>
                <div className="text-xs text-indigo-400 font-mono">@{currentUser.username} · {gamification.title}</div>
                <div className="text-[11px] text-slate-300 font-medium mt-0.5">
                  {currentUser.personality.title}
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-xs font-bold tracking-wider text-white">
                KURO<span className="text-indigo-400">ID</span>
              </div>
              <div className="text-[9px] font-mono text-slate-400">VERIFIED OTAKU</div>
            </div>
          </div>

          {/* Middle Row: Metrics Strip */}
          <div className="relative z-10 grid grid-cols-4 gap-2 py-2 px-3 bg-[#181A26]/80 backdrop-blur-md rounded-xl border border-white/10 text-center my-auto">
            <div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">Days Watched</div>
              <div className="text-sm font-bold font-mono text-white tabular-nums">{stats.daysWatched}d</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">Episodes</div>
              <div className="text-sm font-bold font-mono text-white tabular-nums">{stats.episodesWatched}</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">Mean Score</div>
              <div className="text-sm font-bold font-mono text-amber-400 tabular-nums">
                ★ {stats.averageScore || '9.2'}
              </div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">Completed</div>
              <div className="text-sm font-bold font-mono text-emerald-400 tabular-nums">
                {stats.completionRate}%
              </div>
            </div>
          </div>

          {/* Bottom Row: Top Masterpieces & Top Genres */}
          <div className="relative z-10 flex items-end justify-between gap-3 pt-1">
            {/* Top 3 Posters */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mr-1 hidden sm:inline">
                Top Picks:
              </span>
              <div className="flex -space-x-2">
                {favoriteMedia.map(media => (
                  <img
                    key={media?.id}
                    src={media?.coverImage}
                    alt={media?.title}
                    onError={e => {
                      (e.currentTarget as HTMLImageElement).src = '/src/assets/images/anime_card_nebula_1793517807647.jpg';
                    }}
                    className="w-8 h-11 object-cover rounded-md ring-2 ring-[#0F1016] shadow-lg"
                    title={media?.title}
                  />
                ))}
              </div>
            </div>

            {/* Top Genres Unboxed */}
            <div className="text-right">
              <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Dominant Genres</div>
              <div className="text-xs text-indigo-300 font-medium">
                {topGenres.length > 0 ? topGenres.join(' · ') : 'Fantasy · Action · Sci-Fi'}
              </div>
            </div>
          </div>
        </div>

        {/* Share Action Controls */}
        <div className="w-full mt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleCopyLink}
              className="flex-1 sm:flex-initial px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-indigo-600/25"
            >
              <Copy className="w-4 h-4" />
              Copy Share Link
            </button>
            <button
              onClick={handleSimulateDownload}
              className="flex-1 sm:flex-initial px-4 py-2.5 bg-[#1F2335] hover:bg-[#2A2F45] text-slate-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export Image
            </button>
          </div>

          <div className="text-[11px] text-slate-500">
            Perfect for Discord, Reddit & Instagram Stories
          </div>
        </div>
      </div>
    </div>
  );
};
