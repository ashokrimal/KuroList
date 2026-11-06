/**
 * MyListView - Personal Anime & Manga Tracking Library
 * Redesigned for effortless tracking:
 * - 1-tap progress steppers on table and grid items
 * - Clean status filter tabs with real-time entry counts
 * - Touch-optimized mobile card rows & desktop table view
 * - Quick search and sorting
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
  Filter,
  CheckCircle2,
  Tv,
  BookOpen,
  WifiOff,
  HardDrive,
  UploadCloud,
  CheckSquare,
  Square,
  Check,
  X,
  AlertTriangle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AnimeCard } from '../components/AnimeCard';
import { MyListSkeleton } from '../components/SkeletonLoader';
import { ImportExportModal } from '../components/ImportExportModal';
import { MediaType, LibraryStatus } from '../types';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { triggerHaptic } from '../utils/haptics';

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
    bulkUpdateLibraryEntries,
    bulkRemoveLibraryEntries,
    toggleFavorite
  } = useApp();

  const { isOnline } = useOnlineStatus();
  const [isLoading, setIsLoading] = useState(true);
  const [mediaType, setMediaType] = useState<MediaType>('anime');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
  const [searchFilter, setSearchFilter] = useState('');
  const [sortBy, setSortBy] = useState<'updated' | 'title' | 'score' | 'progress'>('updated');
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);

  // Bulk selection states
  const [selectedMediaIds, setSelectedMediaIds] = useState<string[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState<boolean>(false);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState<boolean>(false);

  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 200);
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
    { id: 'plan_to_watch', label: 'Plan to Watch' },
    { id: 'on_hold', label: 'On Hold' },
    { id: 'dropped', label: 'Dropped' }
  ];

  const mangaStatusOptions = [
    { id: 'all', label: 'All Titles' },
    { id: 'reading', label: 'Reading' },
    { id: 'completed', label: 'Completed' },
    { id: 'plan_to_read', label: 'Plan to Read' },
    { id: 'on_hold', label: 'On Hold' },
    { id: 'dropped', label: 'Dropped' }
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

  // Handle toggling single item selection
  const handleToggleSelect = (mediaId: string) => {
    triggerHaptic('selection');
    setSelectedMediaIds(prev => {
      const next = prev.includes(mediaId) ? prev.filter(id => id !== mediaId) : [...prev, mediaId];
      if (next.length > 0 && !isSelectionMode) {
        setIsSelectionMode(true);
      }
      return next;
    });
  };

  // Check if all visible entries are selected
  const allVisibleSelected =
    displayedEntries.length > 0 && displayedEntries.every(e => selectedMediaIds.includes(e.mediaId));

  // Toggle select all visible items
  const handleToggleSelectAll = () => {
    triggerHaptic('medium');
    if (allVisibleSelected) {
      const visibleIds = new Set(displayedEntries.map(e => e.mediaId));
      setSelectedMediaIds(prev => prev.filter(id => !visibleIds.has(id)));
    } else {
      const visibleIds = displayedEntries.map(e => e.mediaId);
      setSelectedMediaIds(prev => Array.from(new Set([...prev, ...visibleIds])));
      setIsSelectionMode(true);
    }
  };

  // Clear selection
  const handleClearSelection = () => {
    triggerHaptic('light');
    setSelectedMediaIds([]);
    setIsSelectionMode(false);
  };

  // Bulk: Mark as completed with full progress
  const handleBulkMarkCompleted = () => {
    if (selectedMediaIds.length === 0) return;
    triggerHaptic('success');
    bulkUpdateLibraryEntries(selectedMediaIds, entry => {
      const total = entry.totalProgress > 0 ? entry.totalProgress : (entry.progress > 0 ? entry.progress : 12);
      return {
        status: 'completed',
        progress: total,
        finishDate: new Date().toISOString().split('T')[0]
      };
    });
    handleClearSelection();
  };

  // Bulk: Change status for all selected
  const handleBulkSetStatus = (status: LibraryStatus) => {
    if (selectedMediaIds.length === 0) return;
    triggerHaptic('medium');
    bulkUpdateLibraryEntries(selectedMediaIds, { status });
    handleClearSelection();
  };

  // Bulk: Remove all selected from library
  const handleBulkRemove = () => {
    if (selectedMediaIds.length === 0) return;
    triggerHaptic('warning');
    bulkRemoveLibraryEntries(selectedMediaIds);
    setIsBulkDeleteModalOpen(false);
    handleClearSelection();
  };

  if (isLoading) {
    return <MyListSkeleton />;
  }

  return (
    <div className="space-y-6 pb-16">
      {/* Top Banner & Library Summary */}
      <div className="bg-[#161824] border border-[#25283C] rounded-2xl p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-5">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
              <Bookmark className="w-6 h-6 text-indigo-400" />
              {currentUser.displayName}’s Library
            </h1>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <p className="text-xs text-slate-400">
                Personal tracking archive for anime episodes, manga chapters, and ratings
              </p>
              {!isOnline && (
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[11px] font-medium font-mono">
                  <WifiOff className="w-3 h-3 text-amber-400" />
                  Offline Mode Active • Saved locally
                </span>
              )}
            </div>
          </div>

          {/* Controls: Segmented Switcher & MAL Sync Button */}
          <div className="flex flex-wrap items-center gap-2 self-stretch sm:self-auto">
            <div className="flex items-center gap-1 p-1 bg-[#10121C] border border-[#25283C] rounded-xl flex-1 sm:flex-initial">
              <button
                onClick={() => {
                  setMediaType('anime');
                  setSelectedStatus('all');
                }}
                className={`flex-1 sm:flex-initial min-h-[40px] px-4 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-all active:scale-95 ${
                  mediaType === 'anime'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-950/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Tv className="w-3.5 h-3.5" />
                <span>Anime ({stats.animeCount})</span>
              </button>
              <button
                onClick={() => {
                  setMediaType('manga');
                  setSelectedStatus('all');
                }}
                className={`flex-1 sm:flex-initial min-h-[40px] px-4 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-all active:scale-95 ${
                  mediaType === 'manga'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-950/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Manga ({stats.mangaCount})</span>
              </button>
            </div>

            {/* MAL Sync & Backup Modal Trigger */}
            <button
              onClick={() => setIsSyncModalOpen(true)}
              className="min-h-[40px] px-3.5 py-2 text-xs font-semibold rounded-xl bg-[#10121C] hover:bg-[#1f2233] border border-[#25283C] hover:border-indigo-500/50 text-indigo-300 hover:text-white flex items-center justify-center gap-2 transition-all active:scale-95 shrink-0"
              title="Import or Export MyAnimeList XML and JSON"
            >
              <UploadCloud className="w-3.5 h-3.5 text-indigo-400" />
              <span>MAL Sync</span>
            </button>
          </div>
        </div>

        {/* Aggregate Quick Stats Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-[#25283C]/70 text-center">
          <div className="p-2 rounded-xl bg-[#12141F]/60">
            <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Total Titles</div>
            <div className="text-lg font-bold font-mono text-white mt-0.5 tabular-nums">{userEntries.length}</div>
          </div>
          <div className="p-2 rounded-xl bg-[#12141F]/60">
            <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
              {mediaType === 'anime' ? 'Episodes Logged' : 'Chapters Read'}
            </div>
            <div className="text-lg font-bold font-mono text-indigo-400 mt-0.5 tabular-nums">
              {mediaType === 'anime' ? stats.episodesWatched : stats.chaptersRead}
            </div>
          </div>
          <div className="p-2 rounded-xl bg-[#12141F]/60">
            <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Average Rating</div>
            <div className="text-lg font-bold font-mono text-amber-400 mt-0.5 tabular-nums">
              ★ {stats.averageScore || 'N/A'}
            </div>
          </div>
          <div className="p-2 rounded-xl bg-[#12141F]/60">
            <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Completion Rate</div>
            <div className="text-lg font-bold font-mono text-emerald-400 mt-0.5 tabular-nums">
              {stats.completionRate}%
            </div>
          </div>
        </div>
      </div>

      {/* Library Filter Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Status Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {statusOptions.map(opt => {
            const isSelected = selectedStatus === opt.id;
            const count = opt.id === 'all'
              ? userEntries.length
              : userEntries.filter(e => e.status === opt.id).length;

            return (
              <button
                key={opt.id}
                onClick={() => setSelectedStatus(opt.id)}
                className={`min-h-[40px] px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 active:scale-95 ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-950/40'
                    : 'bg-[#161824] border border-[#25283C] text-slate-300 hover:text-white hover:border-slate-500'
                }`}
              >
                <span>{opt.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full tabular-nums ${isSelected ? 'bg-white/20' : 'bg-[#10121C] text-slate-400'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search, Sort & View Mode Switcher */}
        <div className="flex items-center gap-2">
          {/* In-Library Search */}
          <div className="relative flex-1 sm:w-48">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search library..."
              value={searchFilter}
              onChange={e => setSearchFilter(e.target.value)}
              className="w-full min-h-[40px] bg-[#161824] border border-[#25283C] text-xs text-white rounded-xl pl-9 pr-3 py-2 outline-none placeholder:text-slate-500 focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* Sort Selector */}
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as any)}
            className="min-h-[40px] bg-[#161824] border border-[#25283C] text-xs text-slate-300 rounded-xl px-3 py-2 outline-none focus:border-indigo-500"
          >
            <option value="updated">Recently Updated</option>
            <option value="score">Highest Rated</option>
            <option value="progress">Most Progress</option>
            <option value="title">Title (A-Z)</option>
          </select>

          {/* Grid vs Table View Mode */}
          <div className="flex items-center p-1 bg-[#161824] border border-[#25283C] rounded-xl shrink-0">
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'table' ? 'bg-[#22273D] text-indigo-400' : 'text-slate-400 hover:text-white'
              }`}
              title="Table / List View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-[#22273D] text-indigo-400' : 'text-slate-400 hover:text-white'
              }`}
              title="Poster Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>

          {/* Bulk Selection Mode Toggle */}
          <button
            type="button"
            onClick={() => {
              if (isSelectionMode && selectedMediaIds.length > 0) {
                handleClearSelection();
              } else {
                setIsSelectionMode(!isSelectionMode);
              }
            }}
            className={`min-h-[40px] px-3 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all shrink-0 active:scale-95 ${
              selectedMediaIds.length > 0
                ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-950/40'
                : isSelectionMode
                ? 'bg-[#1E2235] text-indigo-300 border-indigo-500/50'
                : 'bg-[#161824] border-[#25283C] text-slate-300 hover:text-white hover:border-slate-500'
            }`}
            title="Toggle multiple selection mode"
          >
            <CheckSquare className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">
              {selectedMediaIds.length > 0
                ? `${selectedMediaIds.length} Selected`
                : isSelectionMode
                ? 'Cancel Selection'
                : 'Bulk Select'}
            </span>
            {selectedMediaIds.length > 0 && (
              <span className="sm:hidden text-[10px] bg-white/20 px-1 rounded-full font-mono">
                {selectedMediaIds.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Empty State */}
      {displayedEntries.length === 0 ? (
        <div className="bg-[#161824] border border-[#25283C] rounded-2xl p-12 text-center text-slate-400 text-xs space-y-3">
          <Bookmark className="w-8 h-8 text-slate-600 mx-auto" />
          <p className="font-semibold text-slate-300">No titles found in this list category</p>
          <p className="text-slate-500">Add titles from the Discover tab or search to build your library.</p>
        </div>
      ) : viewMode === 'table' ? (
        /* Detailed List / Table View with 1-Tap Progress Buttons */
        <div className="bg-[#161824] border border-[#25283C] rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#10121C] text-slate-400 uppercase tracking-wider text-[11px] border-b border-[#25283C]">
                <tr>
                  <th className="py-3 px-3 w-10 text-center">
                    <button
                      type="button"
                      onClick={handleToggleSelectAll}
                      className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#1E2235] text-slate-400 hover:text-white transition-colors"
                      title={allVisibleSelected ? 'Deselect all visible' : 'Select all visible'}
                    >
                      {allVisibleSelected ? (
                        <CheckSquare className="w-4 h-4 text-indigo-400" />
                      ) : selectedMediaIds.length > 0 ? (
                        <div className="w-4 h-4 rounded bg-indigo-600/30 border border-indigo-500/50 flex items-center justify-center">
                          <div className="w-2 h-0.5 bg-indigo-400 rounded-full" />
                        </div>
                      ) : (
                        <Square className="w-4 h-4 text-slate-500 hover:text-slate-300" />
                      )}
                    </button>
                  </th>
                  <th className="py-3 px-3.5 w-10 text-center">Fav</th>
                  <th className="py-3 px-4">Title</th>
                  <th className="py-3 px-4">Score</th>
                  <th className="py-3 px-4">Progress</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#25283C]/60">
                {displayedEntries.map(entry => {
                  const media = mediaItems.find(m => m.id === entry.mediaId);
                  if (!media) return null;
                  const isCompleted = entry.status === 'completed';
                  const isSelected = selectedMediaIds.includes(media.id);

                  return (
                    <tr
                      key={entry.id}
                      className={`transition-colors group ${
                        isSelected
                          ? 'bg-indigo-950/40 hover:bg-indigo-950/60'
                          : 'hover:bg-[#1E2235]/60'
                      }`}
                    >
                      {/* Selection Checkbox */}
                      <td className="py-3 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleSelect(media.id)}
                          className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${
                            isSelected
                              ? 'text-indigo-400 bg-indigo-600/20'
                              : 'text-slate-500 hover:text-slate-300 hover:bg-[#10121C]'
                          }`}
                          title={isSelected ? 'Deselect title' : 'Select title'}
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-indigo-400" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>
                      </td>

                      {/* Favorite Toggle */}
                      <td className="py-3 px-3.5 text-center">
                        <button
                          onClick={() => toggleFavorite(media.id)}
                          className="min-w-[32px] min-h-[32px] flex items-center justify-center text-slate-500 hover:text-rose-400 transition-colors rounded-lg"
                        >
                          <Heart
                            className={`w-4 h-4 ${
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
                            className="w-10 h-14 object-cover rounded-lg shrink-0 cursor-pointer hover:opacity-80 transition-opacity bg-slate-900 border border-[#25283C]"
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

                      {/* 1-Tap Progress Stepper with Visual Progress Bar */}
                      <td className="py-3 px-4">
                        {(() => {
                          const total = entry.totalProgress > 0 ? entry.totalProgress : 0;
                          const pct = isCompleted
                            ? 100
                            : total > 0
                            ? Math.min(100, Math.max(0, Math.round((entry.progress / total) * 100)))
                            : Math.min(90, entry.progress * 8);

                          return (
                            <div className="space-y-1.5 min-w-[140px]">
                              <div className="flex items-center justify-between gap-2">
                                <span className="font-mono text-slate-200 tabular-nums text-xs">
                                  {entry.progress} / {entry.totalProgress || '?'}
                                  <span className="text-[10px] text-slate-400 ml-1.5 font-mono">({pct}%)</span>
                                </span>
                                {!isCompleted && (
                                  <button
                                    onClick={() => incrementProgress(media.id)}
                                    className="min-h-[26px] px-2 py-0.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-[10px] rounded-lg transition-transform active:scale-95 flex items-center gap-1 shadow-sm shrink-0"
                                    title={`Log +1 ${media.type === 'anime' ? 'Episode' : 'Chapter'} (+15 XP)`}
                                  >
                                    <Plus className="w-3 h-3 stroke-[3]" />
                                    <span>+1 {media.type === 'anime' ? 'Ep' : 'Ch'}</span>
                                  </button>
                                )}
                              </div>
                              <div className="w-full bg-[#10121C] h-1.5 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full transition-all duration-300 ${
                                    isCompleted
                                      ? 'bg-emerald-500'
                                      : 'bg-gradient-to-r from-indigo-500 to-violet-500'
                                  }`}
                                  style={{ width: `${pct}%` }}
                                />
                              </div>
                            </div>
                          );
                        })()}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        <span className="text-xs capitalize text-slate-300">
                          {entry.status.replace('_', ' ')}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => openAddToListModal(media)}
                            className="min-w-[36px] min-h-[36px] flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#10121C] rounded-lg transition-colors"
                            title="Edit Status & Rating"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => removeLibraryEntry(media.id)}
                            className="min-w-[36px] min-h-[36px] flex items-center justify-center text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                            title="Remove from Library"
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
            const isSelected = selectedMediaIds.includes(media.id);
            return (
              <div
                key={media.id}
                className={`relative group/grid rounded-2xl transition-all ${
                  isSelected
                    ? 'ring-2 ring-indigo-500 shadow-xl shadow-indigo-950/60 scale-[1.01]'
                    : ''
                }`}
              >
                {/* Select button overlay */}
                <button
                  type="button"
                  onClick={e => {
                    e.stopPropagation();
                    handleToggleSelect(media.id);
                  }}
                  className={`absolute top-2 left-2 z-20 min-w-[32px] min-h-[32px] w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-950/60 scale-105 ring-1 ring-white/30'
                      : isSelectionMode
                      ? 'bg-black/80 text-slate-300 border border-white/20 hover:bg-black/95 hover:text-white'
                      : 'opacity-0 group-hover/grid:opacity-100 bg-black/75 text-slate-300 hover:text-white border border-white/10'
                  }`}
                  title={isSelected ? 'Deselect title' : 'Select title'}
                >
                  {isSelected ? (
                    <Check className="w-4 h-4 stroke-[3]" />
                  ) : (
                    <Square className="w-4 h-4" />
                  )}
                </button>
                <AnimeCard media={media} />
              </div>
            );
          })}
        </div>
      )}

      {/* Floating Bulk Actions Bar */}
      {selectedMediaIds.length > 0 && (
        <div className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="bg-[#12141F]/95 backdrop-blur-xl border border-indigo-500/40 shadow-2xl shadow-indigo-950/80 rounded-2xl p-2.5 sm:p-3 flex flex-wrap items-center justify-between gap-2.5">
            {/* Selection info & quick select toggles */}
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 bg-indigo-600 text-white font-mono text-xs font-bold rounded-lg shadow-sm">
                {selectedMediaIds.length}
              </span>
              <span className="text-xs font-medium text-slate-200 hidden sm:inline">
                {selectedMediaIds.length === 1 ? 'item selected' : 'items selected'}
              </span>
              <button
                type="button"
                onClick={handleToggleSelectAll}
                className="text-[11px] text-slate-400 hover:text-indigo-300 underline underline-offset-2 ml-1"
              >
                {allVisibleSelected ? 'Deselect visible' : 'Select all visible'}
              </button>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-1.5 flex-wrap sm:flex-nowrap">
              {/* Mark Completed */}
              <button
                type="button"
                onClick={handleBulkMarkCompleted}
                className="min-h-[36px] px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-md shadow-emerald-950/40 transition-all active:scale-95"
                title="Mark all selected items as completed"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Completed</span>
              </button>

              {/* Status Selector Dropdown */}
              <div className="relative">
                <select
                  defaultValue=""
                  onChange={e => {
                    if (e.target.value) {
                      handleBulkSetStatus(e.target.value as LibraryStatus);
                      e.target.value = '';
                    }
                  }}
                  className="min-h-[36px] bg-[#1E2235] hover:bg-[#25283C] border border-[#2D334D] text-slate-200 text-xs font-medium rounded-xl px-2.5 py-1.5 outline-none cursor-pointer focus:border-indigo-500 transition-colors"
                >
                  <option value="" disabled>Change Status...</option>
                  <option value={mediaType === 'anime' ? 'watching' : 'reading'}>
                    {mediaType === 'anime' ? 'Watching' : 'Reading'}
                  </option>
                  <option value="completed">Completed</option>
                  <option value={mediaType === 'anime' ? 'plan_to_watch' : 'plan_to_read'}>
                    {mediaType === 'anime' ? 'Plan to Watch' : 'Plan to Read'}
                  </option>
                  <option value="on_hold">On Hold</option>
                  <option value="dropped">Dropped</option>
                </select>
              </div>

              {/* Delete Button */}
              <button
                type="button"
                onClick={() => setIsBulkDeleteModalOpen(true)}
                className="min-h-[36px] px-3 py-1.5 bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/30 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all active:scale-95"
                title="Remove selected items from library"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Remove</span>
              </button>

              {/* Dismiss / Clear Selection */}
              <button
                type="button"
                onClick={handleClearSelection}
                className="w-9 h-9 flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#1E2235] rounded-xl transition-colors shrink-0"
                title="Clear selection"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Delete Confirmation Dialog */}
      {isBulkDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-[#161824] border border-rose-500/30 rounded-2xl max-w-md w-full p-6 shadow-2xl shadow-rose-950/40 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Remove {selectedMediaIds.length} Titles?</h3>
                <p className="text-xs text-slate-400 mt-0.5">This action will remove selected items from your personal library.</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed bg-[#10121C] p-3 rounded-xl border border-[#25283C]">
              Your episode/chapter tracking progress and ratings for these <strong className="text-white font-mono">{selectedMediaIds.length}</strong> items will be deleted. You can add them back later from Discover anytime.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setIsBulkDeleteModalOpen(false)}
                className="min-h-[40px] px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-[#10121C] hover:bg-[#1E2235] border border-[#25283C] rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleBulkRemove}
                className="min-h-[40px] px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-xl shadow-lg shadow-rose-950/40 transition-all active:scale-95 flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove {selectedMediaIds.length} Titles</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MAL / AniList Import & Export Modal */}
      <ImportExportModal
        isOpen={isSyncModalOpen}
        onClose={() => setIsSyncModalOpen(false)}
      />
    </div>
  );
};
