/**
 * DiscoverView - Comprehensive Content Discovery
 * Redesigned for effortless usability:
 * - 1-tap quick filter chips (Airing Now, Top Rated, Most Popular, Manga, Genres)
 * - Sticky search bar with instant clear button
 * - Clean responsive grid with touch ergonomics
 */

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
  Search,
  Filter,
  SlidersHorizontal,
  Compass,
  Star,
  Globe,
  RotateCcw,
  Sparkles,
  X,
  Flame,
  Tv,
  BookOpen,
  Calendar,
  Loader2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AnimeCard } from '../components/AnimeCard';
import { SearchHistoryDropdown } from '../components/SearchHistoryDropdown';
import { SearchHistory } from '../components/SearchHistory';
import { DiscoverSkeleton, AnimeCardSkeleton } from '../components/SkeletonLoader';
import { MediaItem, MediaType, MediaStatus } from '../types';
import { GENRE_LIST } from '../data/animeData';
import { useSearchHistory } from '../hooks/useSearchHistory';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import {
  fetchTrendingAnime,
  fetchUpcomingAnime,
  fetchTopManga
} from '../services/animeCatalogService';

export const DiscoverView: React.FC = () => {
  const { mediaItems, searchMedia, isSearchingOnline, setSelectedMedia, setMediaItems } = useApp() as any;
  const { recentSearches, addSearch, removeSearch, clearAllSearches } = useSearchHistory();

  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<MediaType | 'all'>('all');
  const [selectedGenre, setSelectedGenre] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<MediaStatus | 'all'>('all');
  const [sortBy, setSortBy] = useState<'popularity' | 'score' | 'rank' | 'title'>('score');
  const [minScore, setMinScore] = useState<number>(0);
  const [quickFilter, setQuickFilter] = useState<'all' | 'airing' | 'upcoming' | 'top_rated' | 'popular' | 'manga'>('all');

  // Virtualized rendering window: renders in batches of 24 to keep the DOM light
  const DISCOVER_BATCH_SIZE = 24;
  const [visibleDiscoverCount, setVisibleDiscoverCount] = useState(DISCOVER_BATCH_SIZE);

  // Infinite Pagination from Live Catalog
  const [catalogPage, setCatalogPage] = useState(2);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 200);
    return () => clearTimeout(timer);
  }, []);

  // Reset visible display count when filters change
  useEffect(() => {
    setVisibleDiscoverCount(DISCOVER_BATCH_SIZE);
  }, [searchQuery, selectedType, selectedGenre, selectedStatus, sortBy, minScore, quickFilter]);

  // Quick filter presets
  const handleQuickFilter = (preset: 'all' | 'airing' | 'upcoming' | 'top_rated' | 'popular' | 'manga') => {
    setQuickFilter(preset);
    if (preset === 'all') {
      setSelectedStatus('all');
      setSelectedType('all');
      setSortBy('score');
    } else if (preset === 'airing') {
      setSelectedStatus('airing');
      setSelectedType('anime');
      setSortBy('popularity');
    } else if (preset === 'upcoming') {
      setSelectedStatus('upcoming');
      setSelectedType('anime');
      setSortBy('popularity');
    } else if (preset === 'top_rated') {
      setSelectedStatus('all');
      setSortBy('score');
    } else if (preset === 'popular') {
      setSelectedStatus('all');
      setSortBy('popularity');
    } else if (preset === 'manga') {
      setSelectedType('manga');
      setSelectedStatus('all');
      setSortBy('score');
    }
  };

  const handleLoadMore = useCallback(async () => {
    if (isLoadingMore) return;
    setIsLoadingMore(true);
    try {
      let res;
      if (quickFilter === 'upcoming') {
        res = await fetchUpcomingAnime(catalogPage, 24);
      } else if (quickFilter === 'manga' || selectedType === 'manga') {
        res = await fetchTopManga(catalogPage, 24);
      } else {
        res = await fetchTrendingAnime(catalogPage, 24);
      }

      if (res.items && res.items.length > 0) {
        if (setMediaItems) {
          setMediaItems((prev: any[]) => {
            const map = new Map(prev.map(i => [i.id, i]));
            res.items.forEach(item => map.set(item.id, item));
            return Array.from(map.values());
          });
        }
        setCatalogPage(prev => prev + 1);
        setHasMore(res.hasNextPage);
      } else {
        setHasMore(false);
      }
    } catch (e) {
      console.warn('Load more failed:', e);
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore, quickFilter, catalogPage, selectedType, setMediaItems]);

  // Perform multi-dimensional filtering
  const filteredItems = useMemo(() => {
    return (mediaItems as MediaItem[]).filter((item: MediaItem) => {
      // 1. Query match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle =
          item.title.toLowerCase().includes(q) ||
          (item.titleRomaji && item.titleRomaji.toLowerCase().includes(q)) ||
          (item.titleJapanese && item.titleJapanese.includes(q)) ||
          item.studios?.some((s: string) => s.toLowerCase().includes(q)) ||
          item.authors?.some((a: string) => a.toLowerCase().includes(q));
        if (!matchesTitle) return false;
      }

      // 2. Type match
      if (selectedType !== 'all' && item.type !== selectedType) {
        return false;
      }

      // 3. Genre match
      if (selectedGenre !== 'All' && !item.genres.includes(selectedGenre)) {
        return false;
      }

      // 4. Status match
      if (selectedStatus !== 'all' && item.status !== selectedStatus) {
        return false;
      }

      // 5. Min Score match
      if (item.score < minScore) {
        return false;
      }

      return true;
    }).sort((a: MediaItem, b: MediaItem) => {
      if (sortBy === 'score') return b.score - a.score;
      if (sortBy === 'popularity') return a.popularity - b.popularity;
      if (sortBy === 'rank') return a.rank - b.rank;
      return a.title.localeCompare(b.title);
    });
  }, [mediaItems, searchQuery, selectedType, selectedGenre, selectedStatus, sortBy, minScore]);

  // Windowed items rendered in DOM to eliminate DOM thrashing
  const renderedItems = useMemo(() => {
    return filteredItems.slice(0, visibleDiscoverCount);
  }, [filteredItems, visibleDiscoverCount]);

  const hasMoreLocalItems = visibleDiscoverCount < filteredItems.length;

  const handleInfiniteTrigger = useCallback(async () => {
    if (isLoadingMore) return;

    // If there are more filtered items already in memory, expand DOM slice
    if (visibleDiscoverCount < filteredItems.length) {
      setVisibleDiscoverCount(prev => Math.min(filteredItems.length, prev + DISCOVER_BATCH_SIZE));
      return;
    }

    // Otherwise, if we reached the end of in-memory items and not searching with a text query, fetch next page from AniList
    if (hasMore && !searchQuery.trim()) {
      await handleLoadMore();
      setVisibleDiscoverCount(prev => prev + DISCOVER_BATCH_SIZE);
    }
  }, [isLoadingMore, visibleDiscoverCount, filteredItems.length, hasMore, searchQuery, handleLoadMore]);

  const { sentinelRef: discoverSentinelRef } = useInfiniteScroll({
    hasMore: hasMoreLocalItems || (hasMore && !searchQuery.trim()),
    isLoading: isLoadingMore,
    onLoadMore: handleInfiniteTrigger,
    rootMargin: '450px'
  });

  if (isLoading) {
    return <DiscoverSkeleton />;
  }

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedType('all');
    setSelectedGenre('All');
    setSelectedStatus('all');
    setSortBy('score');
    setMinScore(0);
    setQuickFilter('all');
  };

  const handleOnlineSearch = () => {
    if (searchQuery.trim().length >= 3) {
      addSearch(searchQuery);
      setIsHistoryOpen(false);
      searchMedia(searchQuery, selectedType !== 'all' ? selectedType : undefined);
    }
  };

  if (isLoading) {
    return <DiscoverSkeleton />;
  }

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Compass className="w-6 h-6 text-indigo-400" />
            Discover Titles
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Explore thousands of anime, seasonal releases, and acclaimed manga
          </p>
        </div>

        {/* Global DB Search CTA */}
        {searchQuery.trim().length >= 3 && (
          <button
            onClick={handleOnlineSearch}
            disabled={isSearchingOnline}
            className="self-start sm:self-auto px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors shadow-lg shadow-indigo-950/40"
          >
            <Globe className={`w-3.5 h-3.5 ${isSearchingOnline ? 'animate-spin' : ''}`} />
            <span>{isSearchingOnline ? 'Searching API...' : 'Search Online DB'}</span>
          </button>
        )}
      </div>

      {/* 1-Tap Quick Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-none no-scrollbar">
        {[
          { id: 'all', label: 'All', icon: Sparkles },
          { id: 'airing', label: 'Airing Now', icon: Tv },
          { id: 'upcoming', label: 'Announced & Upcoming', icon: Calendar },
          { id: 'top_rated', label: 'Top Rated', icon: Star },
          { id: 'popular', label: 'Most Popular', icon: Flame },
          { id: 'manga', label: 'Manga & Manhwa', icon: BookOpen }
        ].map(chip => {
          const isSelected = quickFilter === chip.id;
          const Icon = chip.icon;
          return (
            <button
              key={chip.id}
              onClick={() => handleQuickFilter(chip.id as any)}
              className={`min-h-[40px] px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-all active:scale-95 ${
                isSelected
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-950/50'
                  : 'bg-[#181A26] border border-[#2A2F45] text-slate-300 hover:text-white hover:border-slate-500'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{chip.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Search Bar & Filters Card */}
      <div className="bg-[#181A26] border border-[#2A2F45]/80 rounded-2xl p-4 shadow-lg space-y-4">
        {/* Search Input with Instant Clear & History Dropdown */}
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onFocus={() => setIsHistoryOpen(true)}
            onChange={e => {
              setSearchQuery(e.target.value);
              setIsHistoryOpen(true);
            }}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                if (searchQuery.trim()) {
                  addSearch(searchQuery);
                }
                setIsHistoryOpen(false);
                handleOnlineSearch();
              }
            }}
            placeholder="Search anime, manga, creator, or studio..."
            className="w-full bg-[#12141F] border border-[#2A2F45] focus:border-indigo-500 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white outline-none placeholder:text-slate-500 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setIsHistoryOpen(true);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Search History & Suggestions Dropdown */}
          <SearchHistoryDropdown
            isOpen={isHistoryOpen}
            onClose={() => setIsHistoryOpen(false)}
            recentSearches={recentSearches}
            currentQuery={searchQuery}
            onSelectQuery={query => {
              setSearchQuery(query);
              addSearch(query);
              setIsHistoryOpen(false);
            }}
            onRemoveQuery={removeSearch}
            onClearAll={clearAllSearches}
            mediaItems={mediaItems}
            onSelectMedia={media => {
              addSearch(media.title);
              setSelectedMedia(media);
              setIsHistoryOpen(false);
            }}
          />
        </div>

        {/* Detailed Controls: Category, Genre, Status, Sort */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          {/* Category Dropdown */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">
              Category
            </label>
            <select
              value={selectedType}
              onChange={e => setSelectedType(e.target.value as any)}
              className="w-full min-h-[40px] bg-[#12141F] border border-[#2A2F45] text-xs text-slate-200 rounded-xl px-2.5 py-2 outline-none capitalize focus:border-indigo-500"
            >
              <option value="all">All Content</option>
              <option value="anime">Anime</option>
              <option value="manga">Manga</option>
              <option value="manhwa">Manhwa</option>
            </select>
          </div>

          {/* Genre Dropdown */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">
              Genre
            </label>
            <select
              value={selectedGenre}
              onChange={e => setSelectedGenre(e.target.value)}
              className="w-full min-h-[40px] bg-[#12141F] border border-[#2A2F45] text-xs text-slate-200 rounded-xl px-2.5 py-2 outline-none focus:border-indigo-500"
            >
              {GENRE_LIST.map(g => (
                <option key={g} value={g} className="bg-[#181A26]">
                  {g}
                </option>
              ))}
            </select>
          </div>

          {/* Status Dropdown */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">
              Status
            </label>
            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value as any)}
              className="w-full min-h-[40px] bg-[#12141F] border border-[#2A2F45] text-xs text-slate-200 rounded-xl px-2.5 py-2 outline-none capitalize focus:border-indigo-500"
            >
              <option value="all">Any Status</option>
              <option value="airing">Currently Airing</option>
              <option value="finished">Finished</option>
              <option value="upcoming">Upcoming</option>
              <option value="publishing">Publishing</option>
            </select>
          </div>

          {/* Sort By Dropdown */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="w-full min-h-[40px] bg-[#12141F] border border-[#2A2F45] text-xs text-slate-200 rounded-xl px-2.5 py-2 outline-none focus:border-indigo-500"
            >
              <option value="score">Highest Rated</option>
              <option value="popularity">Most Popular</option>
              <option value="rank">Top Ranked</option>
              <option value="title">Alphabetical (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Dedicated Search History Component (Local Storage Persisted) */}
        <SearchHistory
          recentSearches={recentSearches}
          onSelectQuery={query => {
            setSearchQuery(query);
            addSearch(query);
            setIsHistoryOpen(false);
          }}
          onRemoveQuery={removeSearch}
          onClearAll={clearAllSearches}
        />

        {/* Filter Reset & Count Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-[#2A2F45]/60 text-xs">
          <div className="text-slate-400">
            Found <span className="font-semibold text-white tabular-nums">{filteredItems.length}</span> titles
          </div>

          {(searchQuery || selectedType !== 'all' || selectedGenre !== 'All' || selectedStatus !== 'all' || sortBy !== 'score' || quickFilter !== 'all') && (
            <button
              onClick={handleResetFilters}
              className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium p-1 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Grid of Results / Skeletons */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {isSearchingOnline ? (
          [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => (
            <AnimeCardSkeleton key={i} />
          ))
        ) : renderedItems.length > 0 ? (
          renderedItems.map((media: MediaItem) => (
            <AnimeCard key={media.id} media={media} />
          ))
        ) : (
          <div className="col-span-full py-16 text-center space-y-3">
            <Compass className="w-10 h-10 text-slate-600 mx-auto" />
            <h3 className="text-sm font-semibold text-slate-300">No titles match your filters</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try clearing filters or search the online global database for more titles.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>

      {/* Infinite Scroll Sentinel & Automated Fetch Indicator */}
      {(hasMoreLocalItems || (hasMore && !searchQuery.trim())) && (
        <div ref={discoverSentinelRef} className="pt-6 pb-2 text-center">
          {isLoadingMore ? (
            <div className="flex flex-col items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin text-indigo-400" />
              <span className="text-xs text-slate-400 font-medium">Fetching next batch from AniList catalog...</span>
            </div>
          ) : (
            <div className="h-6 flex items-center justify-center text-xs text-slate-500 font-mono">
              Loading more titles ({renderedItems.length} of {filteredItems.length})...
            </div>
          )}
        </div>
      )}

      {/* End of results indicator */}
      {!hasMoreLocalItems && !hasMore && filteredItems.length > 0 && !searchQuery.trim() && (
        <div className="pt-8 text-center text-xs text-slate-500 font-mono">
          All available titles loaded · End of catalog
        </div>
      )}
    </div>
  );
};
