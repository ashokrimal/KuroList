/**
 * AnimeCard Component adhering to Zero-Pill & Metadata Discipline (§1.A)
 * Redesigned for effortless UX:
 * - Direct 1-tap +1 progress logging with tactile feedback
 * - Prominent touch targets (>= 44px)
 * - Clear visual hierarchy and unboxed metadata
 */

import React, { useState } from 'react';
import { Plus, Star, Heart } from 'lucide-react';
import { MediaItem } from '../types';
import { useApp } from '../context/AppContext';
import { triggerHaptic } from '../utils/haptics';

interface AnimeCardProps {
  media: MediaItem;
  showProgress?: boolean;
}

export const AnimeCard: React.FC<AnimeCardProps> = ({ media, showProgress = true }) => {
  const {
    setSelectedMedia,
    getLibraryEntry,
    openAddToListModal,
    incrementProgress,
    toggleFavorite
  } = useApp();

  const [isIncrementing, setIsIncrementing] = useState(false);
  const entry = getLibraryEntry(media.id);
  const isInLibrary = !!entry;
  const isWatchingOrReading = entry?.status === 'watching' || entry?.status === 'reading';
  const isCompleted = entry?.status === 'completed';

  const handleQuickIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    triggerHaptic('light');
    setIsIncrementing(true);
    incrementProgress(media.id);
    setTimeout(() => setIsIncrementing(false), 300);
  };

  return (
    <div className="group relative flex flex-col bg-[#161824] rounded-2xl border border-[#262A3E]/70 hover:border-indigo-500/50 transition-all duration-200 overflow-hidden hover:shadow-2xl hover:shadow-indigo-950/30">
      {/* Poster Image Container */}
      <div
        onClick={() => setSelectedMedia(media)}
        className="relative aspect-[3/4] w-full overflow-hidden bg-slate-900 cursor-pointer"
      >
        <img
          src={media.coverImage}
          alt={media.title}
          referrerPolicy="no-referrer"
          loading="lazy"
          onError={e => {
            (e.currentTarget as HTMLImageElement).src = '/src/assets/images/anime_card_nebula_1793517807647.jpg';
          }}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Dark Gradient Scrim for Contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#161824] via-transparent to-black/30 pointer-events-none" />

        {/* Top-Right Heart Button to Add Status / Manage Watchlist */}
        <div className="absolute top-1.5 right-1.5 z-10">
          <button
            onClick={e => {
              e.stopPropagation();
              triggerHaptic('selection');
              openAddToListModal(media);
            }}
            className={`min-w-[40px] min-h-[40px] flex items-center justify-center rounded-xl backdrop-blur-md transition-all active:scale-95 ${
              entry?.isFavorite
                ? 'bg-rose-500/25 text-rose-400 border border-rose-500/40 shadow-sm'
                : isInLibrary
                ? 'bg-indigo-600/40 text-indigo-300 border border-indigo-400/50 shadow-sm'
                : 'bg-black/60 text-slate-300 hover:text-white border border-white/10 hover:bg-black/80'
            }`}
            title={isInLibrary ? `Status: ${entry.status.replace('_', ' ')} (Click to edit)` : 'Set Status / Add to Watchlist'}
            aria-label={isInLibrary ? `Status: ${entry.status}` : 'Add to watchlist'}
          >
            <Heart className={`w-4 h-4 ${entry?.isFavorite ? 'fill-rose-500 text-rose-400' : isInLibrary ? 'fill-indigo-400 text-indigo-400' : ''}`} />
          </button>
        </div>

        {/* Top-Left Score Display */}
        <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-lg text-[11px] font-semibold text-amber-300 border border-white/10 tabular-nums shadow-sm">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>{media.score}</span>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-3.5 flex flex-col flex-1 justify-between gap-2">
        <div>
          {/* Unboxed Metadata Line with typographic separators */}
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mb-1 whitespace-nowrap overflow-hidden text-ellipsis">
            <span>{media.format}</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span>{media.genres?.[0] || 'Anime'}</span>
            {media.year && (
              <>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span className="tabular-nums">{media.year}</span>
              </>
            )}
          </div>

          {/* Title */}
          <h3
            onClick={() => setSelectedMedia(media)}
            className="text-sm font-semibold text-white leading-snug line-clamp-2 hover:text-indigo-400 cursor-pointer transition-colors"
            title={media.title}
          >
            {media.title}
          </h3>
        </div>

        {/* 1-Tap Quick Progress Stepper for Watching/Reading Items */}
        {showProgress && isInLibrary && (() => {
          const hasTotal = (entry.totalProgress || 0) > 0;
          const pct = hasTotal
            ? Math.min(100, Math.max(0, Math.round((entry.progress / entry.totalProgress) * 100)))
            : isCompleted ? 100 : Math.min(90, entry.progress * 8);

          return (
            <div className="mt-1 pt-2.5 border-t border-[#262A3E]/70 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[11px] capitalize text-slate-400 font-medium flex items-center gap-1">
                  {entry.status.replace('_', ' ')}
                  <span className="text-[10px] text-slate-500 font-mono">({pct}%)</span>
                </span>

                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-xs tabular-nums text-indigo-300 font-semibold">
                    {entry.progress}/{entry.totalProgress || '?'}
                  </span>

                  {/* Direct 1-Tap +1 Progress Button */}
                  {!isCompleted && isWatchingOrReading && (
                    <button
                      onClick={handleQuickIncrement}
                      className={`min-h-[30px] px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 active:scale-90 text-white font-semibold text-[11px] flex items-center gap-1 shadow-md shadow-indigo-900/40 transition-all ${
                        isIncrementing ? 'scale-105 bg-indigo-400 ring-2 ring-indigo-400' : ''
                      }`}
                      title={`Log +1 ${media.type === 'anime' ? 'Episode' : 'Chapter'} (+15 XP)`}
                    >
                      <Plus className="w-3 h-3 stroke-[3]" />
                      <span>+1 {media.type === 'anime' ? 'Ep' : 'Ch'}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Progress Bar Container */}
              <div className="w-full bg-[#10121C] h-1.5 rounded-full overflow-hidden relative">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    isCompleted
                      ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]'
                      : 'bg-gradient-to-r from-indigo-500 via-indigo-400 to-violet-500'
                  }`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
};
