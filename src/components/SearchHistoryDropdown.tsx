import React, { useRef, useEffect } from 'react';
import { Clock, X, Flame, Search, Star, Sparkles, ArrowRight } from 'lucide-react';
import { MediaItem } from '../types';
import { POPULAR_SEARCH_SUGGESTIONS } from '../hooks/useSearchHistory';
import { triggerHaptic } from '../utils/haptics';

interface SearchHistoryDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  recentSearches: string[];
  currentQuery: string;
  onSelectQuery: (query: string) => void;
  onRemoveQuery: (query: string) => void;
  onClearAll: () => void;
  mediaItems?: MediaItem[];
  onSelectMedia?: (media: MediaItem) => void;
}

export const SearchHistoryDropdown: React.FC<SearchHistoryDropdownProps> = ({
  isOpen,
  onClose,
  recentSearches,
  currentQuery,
  onSelectQuery,
  onRemoveQuery,
  onClearAll,
  mediaItems = [],
  onSelectMedia
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on Escape or click outside
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const trimmedQuery = currentQuery.trim().toLowerCase();

  // Filter recent searches if user is already typing
  const filteredRecent = trimmedQuery
    ? recentSearches.filter(q => q.toLowerCase().includes(trimmedQuery))
    : recentSearches;

  // Filter quick media suggestions from catalog (up to 3)
  const mediaSuggestions = trimmedQuery && trimmedQuery.length >= 2
    ? mediaItems.filter(item => 
        item.title.toLowerCase().includes(trimmedQuery) ||
        (item.titleRomaji && item.titleRomaji.toLowerCase().includes(trimmedQuery))
      ).slice(0, 3)
    : [];

  // Filter popular suggestions not already matching current query exactly
  const popularSuggestions = POPULAR_SEARCH_SUGGESTIONS.filter(
    item => item.toLowerCase() !== trimmedQuery
  ).slice(0, 5);

  return (
    <div
      ref={containerRef}
      className="absolute top-full left-0 right-0 mt-2 z-40 bg-[#161826] border border-[#2B3048] rounded-2xl shadow-2xl shadow-black/80 overflow-hidden backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-150"
    >
      {/* 1. Quick Live Title Matches (if user has typed at least 2 characters) */}
      {mediaSuggestions.length > 0 && (
        <div className="p-2 border-b border-[#25283C]">
          <div className="px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-indigo-400" />
            <span>Title Matches</span>
          </div>
          <div className="space-y-1 mt-1">
            {mediaSuggestions.map(media => (
              <button
                key={media.id}
                type="button"
                onClick={() => {
                  triggerHaptic('selection');
                  if (onSelectMedia) {
                    onSelectMedia(media);
                  } else {
                    onSelectQuery(media.title);
                  }
                  onClose();
                }}
                className="w-full flex items-center gap-3 px-2.5 py-1.5 rounded-xl hover:bg-[#202538] text-left transition-colors group cursor-pointer"
              >
                <img
                  src={media.coverImage}
                  alt={media.title}
                  className="w-8 h-10 object-cover rounded-md shrink-0 bg-slate-900 border border-white/10"
                />
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-semibold text-white group-hover:text-indigo-300 truncate">
                    {media.title}
                  </div>
                  <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                    <span className="capitalize">{media.format || media.type}</span>
                    <span>•</span>
                    <span className="flex items-center gap-0.5 text-amber-300 font-mono">
                      <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                      {media.score}
                    </span>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-400 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 2. Recent Searches Section */}
      {filteredRecent.length > 0 ? (
        <div className="p-2.5 border-b border-[#25283C]">
          <div className="flex items-center justify-between px-2 pb-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            <span className="flex items-center gap-1.5 text-slate-300">
              <Clock className="w-3 h-3 text-indigo-400" />
              Recent Searches
            </span>
            <button
              type="button"
              onClick={e => {
                e.stopPropagation();
                triggerHaptic('light');
                onClearAll();
              }}
              className="text-[11px] text-slate-500 hover:text-rose-400 lowercase font-medium transition-colors cursor-pointer"
            >
              Clear all
            </button>
          </div>

          <div className="space-y-0.5 mt-1">
            {filteredRecent.map(query => (
              <div
                key={query}
                className="group flex items-center justify-between px-2.5 py-2 rounded-xl hover:bg-[#202538] transition-colors"
              >
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic('selection');
                    onSelectQuery(query);
                    onClose();
                  }}
                  className="flex items-center gap-2.5 min-w-0 flex-1 text-left cursor-pointer"
                >
                  <Search className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-400 shrink-0" />
                  <span className="text-xs text-slate-200 group-hover:text-white truncate font-medium">
                    {query}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={e => {
                    e.stopPropagation();
                    triggerHaptic('light');
                    onRemoveQuery(query);
                  }}
                  className="p-1 rounded-md text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors opacity-70 group-hover:opacity-100 cursor-pointer ml-2"
                  title={`Remove "${query}" from search history`}
                  aria-label={`Remove ${query}`}
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="p-3 text-center text-xs text-slate-400 border-b border-[#25283C]/60">
          <Clock className="w-4 h-4 text-slate-500 mx-auto mb-1 opacity-60" />
          <span>No recent searches yet</span>
        </div>
      )}

      {/* 3. Popular / Trending Suggestions */}
      <div className="p-3 bg-[#131520]/80">
        <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2 px-1">
          <Flame className="w-3 h-3 text-amber-400" />
          <span>Popular Searches</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {popularSuggestions.map(term => (
            <button
              key={term}
              type="button"
              onClick={() => {
                triggerHaptic('selection');
                onSelectQuery(term);
                onClose();
              }}
              className="px-2.5 py-1 rounded-lg bg-[#1D2132] hover:bg-indigo-600 border border-[#2E344E] hover:border-indigo-500 text-xs text-slate-300 hover:text-white transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
            >
              <Search className="w-2.5 h-2.5 text-slate-500 group-hover:text-white" />
              <span>{term}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
