/**
 * DiscoverView - Comprehensive Content Discovery
 * Multi-filter search (type, format, genre, status, score, sorting), Jikan online search fallback
 */

import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  SlidersHorizontal,
  Compass,
  Star,
  Globe,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AnimeCard } from '../components/AnimeCard';
import { DiscoverSkeleton, AnimeCardSkeleton } from '../components/SkeletonLoader';
import { MediaType, MediaStatus } from '../types';
import { GENRE_LIST } from '../data/animeData';

export const DiscoverView: React.FC = () => {
  const { mediaItems, searchMedia, isSearchingOnline } = useApp();

  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<MediaType | 'all'>('all');
  const [selectedGenre, setSelectedGenre] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<MediaStatus | 'all'>('all');
  const [sortBy, setSortBy] = useState<'popularity' | 'score' | 'rank' | 'title'>('score');
  const [minScore, setMinScore] = useState<number>(0);

  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 250);
    return () => clearTimeout(timer);
  }, []);

  // Perform multi-dimensional filtering
  const filteredItems = useMemo(() => {
    return mediaItems.filter(item => {
      // 1. Query match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(q) ||
          (item.titleRomaji && item.titleRomaji.toLowerCase().includes(q)) ||
          (item.titleJapanese && item.titleJapanese.includes(q)) ||
          item.studios?.some(s => s.toLowerCase().includes(q)) ||
          item.authors?.some(a => a.toLowerCase().includes(q));
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
    }).sort((a, b) => {
      if (sortBy === 'score') return b.score - a.score;
      if (sortBy === 'popularity') return a.popularity - b.popularity;
      if (sortBy === 'rank') return a.rank - b.rank;
      return a.title.localeCompare(b.title);
    });
  }, [mediaItems, searchQuery, selectedType, selectedGenre, selectedStatus, sortBy, minScore]);

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
  };

  const handleOnlineSearch = () => {
    if (searchQuery.trim().length >= 3) {
      searchMedia(searchQuery, selectedType !== 'all' ? selectedType : undefined);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
          <Compass className="w-6 h-6 text-indigo-400" />
          Discover Anime & Manga
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Explore thousands of acclaimed series, seasonal releases, and hidden masterworks
        </p>
      </div>

      {/* Main Search Bar & Online Search Fallback */}
      <div className="bg-[#181A26] border border-[#2A2F45] rounded-2xl p-4 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') handleOnlineSearch();
              }}
              placeholder="Search by title, Japanese name, creator, or studio..."
              className="w-full bg-[#131520] border border-[#2A2F45] focus:border-indigo-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white outline-none placeholder:text-slate-500"
            />
          </div>

          <button
            onClick={handleOnlineSearch}
            disabled={isSearchingOnline || searchQuery.length < 3}
            className="w-full sm:w-auto px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors shrink-0"
            title="Search the full global MyAnimeList / Jikan database"
          >
            <Globe className={`w-3.5 h-3.5 ${isSearchingOnline ? 'animate-spin' : ''}`} />
            <span>{isSearchingOnline ? 'Querying API...' : 'Search Global DB'}</span>
          </button>
        </div>

        {/* Content Type Selector Tabs (§1.A segmented control style) */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#2A2F45]/60">
          <span className="text-xs text-slate-400 font-semibold mr-2">Category:</span>
          {(['all', 'anime', 'manga', 'manhwa'] as const).map(type => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all capitalize ${
                selectedType === type
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-[#131520] text-slate-300 hover:text-white border border-[#2A2F45]'
              }`}
            >
              {type === 'all' ? 'All Content' : type}
            </button>
          ))}
        </div>

        {/* Multi-Filters Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          {/* Genre Dropdown */}
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Genre
            </label>
            <select
              value={selectedGenre}
              onChange={e => setSelectedGenre(e.target.value)}
              className="w-full bg-[#131520] border border-[#2A2F45] text-xs text-slate-200 rounded-lg p-2 outline-none"
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
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Release Status
            </label>
            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value as any)}
              className="w-full bg-[#131520] border border-[#2A2F45] text-xs text-slate-200 rounded-lg p-2 outline-none capitalize"
            >
              <option value="all">Any Status</option>
              <option value="airing">Currently Airing</option>
              <option value="finished">Finished</option>
              <option value="upcoming">Upcoming</option>
              <option value="publishing">Publishing (Manga)</option>
            </select>
          </div>

          {/* Sort By Dropdown */}
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="w-full bg-[#131520] border border-[#2A2F45] text-xs text-slate-200 rounded-lg p-2 outline-none"
            >
              <option value="score">Highest Rated (Score)</option>
              <option value="popularity">Most Popular</option>
              <option value="rank">MAL Top Rank</option>
              <option value="title">Alphabetical (A-Z)</option>
            </select>
          </div>

          {/* Reset Action */}
          <div className="flex items-end">
            <button
              onClick={handleResetFilters}
              className="w-full py-2 bg-[#131520] hover:bg-[#1F2335] border border-[#2A2F45] text-xs text-slate-400 hover:text-white rounded-lg flex items-center justify-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* Results Count & Active Filters Indicator */}
      <div className="flex items-center justify-between text-xs text-slate-400">
        <div>
          Showing <span className="font-mono font-semibold text-white">{filteredItems.length}</span> titles
        </div>
        {filteredItems.length === 0 && (
          <div className="text-amber-400">
            No matches with current filters. Try searching global DB above.
          </div>
        )}
      </div>

      {/* Grid of Results / Skeletons */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {isSearchingOnline ? (
          [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => (
            <AnimeCardSkeleton key={i} />
          ))
        ) : (
          filteredItems.map(media => (
            <AnimeCard key={media.id} media={media} />
          ))
        )}
      </div>
    </div>
  );
};
