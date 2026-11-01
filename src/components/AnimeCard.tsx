/**
 * AnimeCard Component adhering to Zero-Pill & Metadata Discipline (§1.A)
 * Unboxed metadata, quick inline progress stepper, and click-to-view
 */

import React from 'react';
import { Plus, Star, Check, Heart, Play } from 'lucide-react';
import { MediaItem } from '../types';
import { useApp } from '../context/AppContext';

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

  const entry = getLibraryEntry(media.id);
  const isInLibrary = !!entry;
  const isCompleted = entry?.status === 'completed';

  return (
    <div className="group relative flex flex-col bg-[#181A26] rounded-xl border border-[#2A2F45]/60 hover:border-indigo-500/50 transition-all duration-200 overflow-hidden hover:shadow-xl hover:shadow-indigo-950/20">
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

        {/* Subtle Dark Gradient Overlay for title readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#181A26] via-transparent to-black/30 pointer-events-none" />

        {/* Favorite Heart Toggle */}
        <button
          onClick={e => {
            e.stopPropagation();
            if (isInLibrary) {
              toggleFavorite(media.id);
            } else {
              openAddToListModal(media);
            }
          }}
          className={`absolute top-2.5 right-2.5 p-1.5 rounded-lg backdrop-blur-md transition-colors ${
            entry?.isFavorite
              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
              : 'bg-black/50 text-slate-300 hover:text-white border border-white/10'
          }`}
          title={entry?.isFavorite ? 'In Favorites' : 'Add to Favorites'}
        >
          <Heart className={`w-3.5 h-3.5 ${entry?.isFavorite ? 'fill-rose-500' : ''}`} />
        </button>

        {/* Score Badge (quiet clean style) */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-md text-[11px] font-medium text-amber-300 border border-white/10 tabular-nums">
          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
          <span>{media.score}</span>
        </div>

        {/* Quick Add / Status Toggle Button Overlay */}
        <div className="absolute bottom-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={e => {
              e.stopPropagation();
              openAddToListModal(media);
            }}
            className={`p-2 rounded-lg text-xs font-medium shadow-lg backdrop-blur-md transition-all flex items-center gap-1.5 ${
              isInLibrary
                ? 'bg-indigo-600 text-white hover:bg-indigo-500'
                : 'bg-[#181A26]/90 border border-indigo-500/50 text-indigo-300 hover:bg-indigo-600 hover:text-white'
            }`}
            title={isInLibrary ? 'Edit Status & Rating' : 'Add to Watchlist'}
          >
            {isInLibrary ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-3.5 flex flex-col flex-1 justify-between">
        <div>
          {/* Unboxed Metadata Line with typographic separators */}
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mb-1.5 whitespace-nowrap overflow-hidden text-ellipsis">
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

        {/* User Progress Bar if active in library */}
        {showProgress && isInLibrary && (
          <div className="mt-3 pt-2.5 border-t border-[#2A2F45]/60">
            <div className="flex items-center justify-between text-[11px] text-slate-300 mb-1.5">
              <span className="capitalize text-slate-400">{entry.status.replace('_', ' ')}</span>
              <div className="flex items-center gap-1">
                <span className="font-mono text-xs tabular-nums text-indigo-300 font-medium">
                  {entry.progress}/{entry.totalProgress || '?'}
                </span>
                {!isCompleted && (
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      incrementProgress(media.id);
                    }}
                    className="p-1 hover:bg-indigo-500/20 text-indigo-400 hover:text-indigo-300 rounded transition-colors"
                    title={`Add +1 ${media.type === 'anime' ? 'Episode' : 'Chapter'}`}
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-[#131520] h-1.5 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  isCompleted ? 'bg-emerald-500' : 'bg-indigo-500'
                }`}
                style={{
                  width: `${Math.min(100, Math.max(0, (entry.progress / (entry.totalProgress || 1)) * 100))}%`
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
