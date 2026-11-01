/**
 * MyListView - Personal Anime & Manga Tracking Library
 * Supports Anime/Manga switching, status tabs, Grid vs Compact Table views,
 * quick progress increment, personal rating, search, and sorting
 */

import React, { useState, useMemo } from 'react';
import {
  Bookmark,
  LayoutGrid,
  List,
  Search,
  Star,
  Plus,
  Heart,
  Trash2,
  Edit2,
  ArrowUpDown,
  Filter
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AnimeCard } from '../components/AnimeCard';
import { MyListSkeleton } from '../components/SkeletonLoader';
import { MediaType, LibraryStatus } from '../types';

export const MyListView: React.FC = () => {
  const {
    library,
    mediaItems,
    currentUser,
    stats,
    setSelectedMedia,
    openAddToListModal,
    incrementProgress,
    removeLibraryEntry,
    toggleFavorite
  } = useApp();

  const [isLoading, setIsLoading] = useState(true);
  const [mediaType, setMediaType] = useState<MediaType>('anime');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
  const [searchFilter, setSearchFilter] = useState('');
  const [sortBy, setSortBy] = useState<'updated' | 'title' | 'score' | 'progress'>('updated');

  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 240);
    return () => clearTimeout(timer);
  }, []);

  // Filter entries for current user and media type
  const userEntries = useMemo(() => {
    return library.filter(entry => entry.userId === currentUser.id && entry.mediaType === mediaType);
  }, [library, currentUser.id, mediaType]);

  const animeStatusOptions = [
    { id: 'all', label: 'All Titles' },
    { id: 'watching', label: 'Watching' },
    { id: 'completed', label: 'Completed' },
    { id: 'on_hold', label: 'On Hold' },
    { id: 'dropped', label: 'Dropped' },
    { id: 'plan_to_watch', label: 'Plan to Watch' }
  ];

  const mangaStatusOptions = [
    { id: 'all', label: 'All Titles' },
    { id: 'reading', label: 'Reading' },
    { id: 'completed', label: 'Completed' },
    { id: 'on_hold', label: 'On Hold' },
    { id: 'dropped', label: 'Dropped' },
    { id: 'plan_to_read', label: 'Plan to Read' }
  ];

  const statusOptions = mediaType === 'anime' ? animeStatusOptions : mangaStatusOptions;

  // Process filtered and sorted entries
  const displayedEntries = useMemo(() => {
    return userEntries
      .filter(entry => {
        if (selectedStatus !== 'all' && entry.status !== selectedStatus) return false;
        if (searchFilter.trim()) {
          const media = mediaItems.find(m => m.id === entry.mediaId);
          return media?.title.toLowerCase().includes(searchFilter.toLowerCase());
        }
        return true;
      })
      .sort((a, b) => {
        const mediaA = mediaItems.find(m => m.id === a.mediaId);
        const mediaB = mediaItems.find(m => m.id === b.mediaId);

        if (sortBy === 'score') return b.score - a.score;
        if (sortBy === 'progress') return (b.progress / (b.totalProgress || 1)) - (a.progress / (a.totalProgress || 1));
        if (sortBy === 'title') return (mediaA?.title || '').localeCompare(mediaB?.title || '');
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      });
  }, [userEntries, selectedStatus, searchFilter, sortBy, mediaItems]);

  if (isLoading) {
    return <MyListSkeleton />;
  }

  return (
    <div className="space-y-8 pb-16">
      {/* Top Banner & KPI Strip */}
      <div className="bg-[#181A26] border border-[#2A2F45] rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
              <Bookmark className="w-6 h-6 text-indigo-400" />
              {currentUser.displayName}’s Library
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Personal archive of watched anime, reading lists, and ranked masterworks
            </p>
          </div>

          {/* Anime vs Manga Category Toggle */}
          <div className="flex items-center gap-1 p-1 bg-[#131520] border border-[#2A2F45] rounded-xl self-stretch sm:self-auto">
            <button
              onClick={() => {
                setMediaType('anime');
                setSelectedStatus('all');
              }}
              className={`flex-1 sm:flex-initial px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                mediaType === 'anime'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Anime ({stats.animeCount})
            </button>
            <button
              onClick={() => {
                setMediaType('manga');
                setSelectedStatus('all');
              }}
              className={`flex-1 sm:flex-initial px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                mediaType === 'manga'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Manga & Manhwa ({stats.mangaCount})
            </button>
          </div>
        </div>

        {/* Aggregate Stats Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-[#2A2F45]/60 text-center">
          <div>
            <div className="text-[11px] text-slate-400 uppercase tracking-wider">Total Entries</div>
            <div className="text-base font-bold font-mono text-white mt-0.5">{userEntries.length}</div>
          </div>
          <div>
            <div className="text-[11px] text-slate-400 uppercase tracking-wider">
              {mediaType === 'anime' ? 'Episodes Watched' : 'Chapters Read'}
            </div>
            <div className="text-base font-bold font-mono text-indigo-400 mt-0.5">
              {mediaType === 'anime' ? stats.episodesWatched : stats.chaptersRead}
            </div>
          </div>
          <div>
            <div className="text-[11px] text-slate-400 uppercase tracking-wider">Average Score</div>
            <div className="text-base font-bold font-mono text-amber-400 mt-0.5">
              ★ {stats.averageScore || 'N/A'}
            </div>
          </div>
          <div>
            <div className="text-[11px] text-slate-400 uppercase tracking-wider">Completion Rate</div>
            <div className="text-base font-bold font-mono text-emerald-400 mt-0.5">
              {stats.completionRate}%
            </div>
          </div>
        </div>
      </div>

      {/* Library Controls Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar p-1 bg-[#181A26] border border-[#2A2F45] rounded-xl">
          {statusOptions.map(opt => {
            const isSelected = selectedStatus === opt.id;
            const count = opt.id === 'all'
              ? userEntries.length
              : userEntries.filter(e => e.status === opt.id).length;

            return (
              <button
                key={opt.id}
                onClick={() => setSelectedStatus(opt.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap shrink-0 ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {opt.label} ({count})
              </button>
            );
          })}
        </div>

        {/* Search, Sort & View Mode Switcher */}
        <div className="flex items-center gap-2">
          {/* In-Library Search */}
          <div className="relative flex-1 sm:w-44">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search library..."
              value={searchFilter}
              onChange={e => setSearchFilter(e.target.value)}
              className="w-full bg-[#181A26] border border-[#2A2F45] text-xs text-white rounded-lg pl-8 pr-2.5 py-1.5 outline-none placeholder:text-slate-500"
            />
          </div>

          {/* Sort Selector */}
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as any)}
            className="bg-[#181A26] border border-[#2A2F45] text-xs text-slate-300 rounded-lg px-2.5 py-1.5 outline-none"
          >
            <option value="updated">Recently Updated</option>
            <option value="score">Highest Rated</option>
            <option value="progress">Most Progress</option>
            <option value="title">Title (A-Z)</option>
          </select>

          {/* Grid vs Table View Mode */}
          <div className="flex items-center p-0.5 bg-[#181A26] border border-[#2A2F45] rounded-lg">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded transition-colors ${
                viewMode === 'table' ? 'bg-[#1F2335] text-indigo-400' : 'text-slate-400 hover:text-white'
              }`}
              title="Table / List View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded transition-colors ${
                viewMode === 'grid' ? 'bg-[#1F2335] text-indigo-400' : 'text-slate-400 hover:text-white'
              }`}
              title="Poster Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {displayedEntries.length === 0 ? (
        <div className="bg-[#181A26] border border-[#2A2F45] rounded-2xl p-12 text-center text-slate-400 text-xs">
          No titles found in this list category.
        </div>
      ) : viewMode === 'table' ? (
        /* Detailed List / Table View */
        <div className="bg-[#181A26] border border-[#2A2F45] rounded-2xl overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#131520] text-slate-400 uppercase tracking-wider text-[11px] border-b border-[#2A2F45]">
                <tr>
                  <th className="py-3 px-4 w-12 text-center">#</th>
                  <th className="py-3 px-4">Title</th>
                  <th className="py-3 px-4">Score</th>
                  <th className="py-3 px-4">Progress</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2A2F45]/50">
                {displayedEntries.map((entry, index) => {
                  const media = mediaItems.find(m => m.id === entry.mediaId);
                  if (!media) return null;
                  const isCompleted = entry.status === 'completed';

                  return (
                    <tr key={entry.id} className="hover:bg-[#1F2335]/50 transition-colors group">
                      {/* Index & Favorite */}
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => toggleFavorite(media.id)}
                          className="text-slate-500 hover:text-rose-400 transition-colors"
                        >
                          <Heart
                            className={`w-3.5 h-3.5 ${
                              entry.isFavorite ? 'fill-rose-500 text-rose-500' : ''
                            }`}
                          />
                        </button>
                      </td>

                      {/* Poster and Title */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={media.coverImage}
                            alt={media.title}
                            onError={e => {
                              (e.currentTarget as HTMLImageElement).src = '/src/assets/images/anime_card_nebula_1793517807647.jpg';
                            }}
                            onClick={() => setSelectedMedia(media)}
                            className="w-9 h-12 object-cover rounded shrink-0 cursor-pointer hover:opacity-80 transition-opacity bg-slate-900"
                          />
                          <div className="min-w-0">
                            <span
                              onClick={() => setSelectedMedia(media)}
                              className="font-semibold text-white truncate block hover:text-indigo-400 cursor-pointer max-w-xs sm:max-w-md"
                            >
                              {media.title}
                            </span>
                            <span className="text-[11px] text-slate-400">
                              {media.format} · {media.genres?.slice(0, 2).join(', ')}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Score */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1 font-mono font-bold text-amber-300">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>{entry.score > 0 ? entry.score : '-'}</span>
                        </div>
                      </td>

                      {/* Progress Stepper */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-slate-200">
                            {entry.progress} / {entry.totalProgress || '?'}
                          </span>
                          {!isCompleted && (
                            <button
                              onClick={() => incrementProgress(media.id)}
                              className="p-1 bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white rounded transition-colors"
                              title="Add +1 Progress"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        <span className="capitalize text-slate-300 bg-[#131520] px-2.5 py-1 rounded-md border border-[#2A2F45]">
                          {entry.status.replace('_', ' ')}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openAddToListModal(media)}
                            className="p-1.5 text-slate-400 hover:text-white hover:bg-[#131520] rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => removeLibraryEntry(media.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Poster Grid View */
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {displayedEntries.map(entry => {
            const media = mediaItems.find(m => m.id === entry.mediaId);
            if (!media) return null;
            return <AnimeCard key={media.id} media={media} />;
          })}
        </div>
      )}
    </div>
  );
};
