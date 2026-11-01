/**
 * DynamicPillBar Component
 * iOS Dynamic Island & ColorOS 17 Aqua Dynamics inspired interactive action pill bar
 * Located above/with navbar: morphing pills, smart auto-fill search, quick +Add media, and real-time watching ticker
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Plus,
  Search,
  Sparkles,
  Play,
  Tv,
  Check,
  Star,
  X,
  RefreshCw,
  Flame,
  ArrowRight,
  TrendingUp,
  Bookmark
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MediaItem } from '../types';

interface DynamicPillBarProps {
  onOpenSyncModal: () => void;
}

export const DynamicPillBar: React.FC<DynamicPillBarProps> = ({ onOpenSyncModal }) => {
  const {
    mediaItems,
    library,
    currentUser,
    gamification,
    searchMedia,
    setSelectedMedia,
    openAddToListModal,
    incrementProgress,
    showToast,
    addOrUpdateLibraryEntry
  } = useApp();

  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<MediaItem[]>([]);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [quickAddQuery, setQuickAddQuery] = useState('');
  const [quickAddSelectedType, setQuickAddSelectedType] = useState<'anime' | 'manga'>('anime');
  const [justEarnedXp, setJustEarnedXp] = useState(false);

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const quickAddModalRef = useRef<HTMLDivElement>(null);

  // Find user's currently active watching series
  const activeWatchingEntry = library.find(
    entry => entry.userId === currentUser.id && (entry.status === 'watching' || entry.status === 'reading')
  );
  const activeMedia = activeWatchingEntry ? mediaItems.find(m => m.id === activeWatchingEntry.mediaId) : null;

  // Auto-fill suggestion presets
  const SUGGESTION_CHIPS = [
    { label: 'Frieren', icon: '✨' },
    { label: 'Solo Leveling', icon: '⚔️' },
    { label: 'Dandadan', icon: '⚡' },
    { label: 'Berserk', icon: '📖' },
    { label: 'Jujutsu Kaisen', icon: '💥' },
    { label: 'Steins;Gate', icon: '⏳' },
    { label: 'One Piece', icon: '🏴‍☠️' }
  ];

  // Outside click listener
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchExpanded(false);
      }
      if (quickAddModalRef.current && !quickAddModalRef.current.contains(event.target as Node)) {
        setIsQuickAddOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle instant live search with debouncing
  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      searchMedia(searchQuery).then(results => {
        setSearchResults(results.slice(0, 5));
      });
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const handleChipClick = (chipName: string) => {
    setSearchQuery(chipName);
    setIsSearchExpanded(true);
  };

  const handleQuickIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeWatchingEntry) {
      incrementProgress(activeWatchingEntry.mediaId);
      setJustEarnedXp(true);
      setTimeout(() => setJustEarnedXp(false), 2400);
    }
  };

  return (
    <aside aria-label="Quick Actions &amp; Smart Search" className="relative z-30 w-full bg-[#0A0B10]/95 border-b border-[#2A2F45]/50 backdrop-blur-xl transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          {/* 1. Quick +Add Media Pill Button */}
          <div className="relative">
            <button
              onClick={() => setIsQuickAddOpen(!isQuickAddOpen)}
              className="group flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-indigo-600/90 to-violet-600/90 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/25 border border-indigo-400/30 transition-all hover:scale-[1.02] active:scale-95"
            >
              <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center transition-transform group-hover:rotate-90">
                <Plus className="w-3 h-3 text-white" />
              </div>
              <span className="tracking-tight whitespace-nowrap">Add Title</span>
              <span className="hidden sm:inline-block text-[10px] bg-black/25 px-1.5 py-0.5 rounded-full font-mono text-indigo-100">
                +1-Click
              </span>
            </button>

            {/* Quick Add Popover Drawer */}
            {isQuickAddOpen && (
              <div
                ref={quickAddModalRef}
                className="absolute left-0 mt-2.5 w-80 sm:w-96 bg-[#181A26] border border-[#2A2F45] rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150"
              >
                <div className="flex items-center justify-between pb-3 border-b border-[#2A2F45]">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-indigo-600/30 text-indigo-400 flex items-center justify-center">
                      <Plus className="w-3.5 h-3.5" />
                    </div>
                    <h4 className="text-xs font-bold text-white tracking-tight">Quick Add to Library</h4>
                  </div>
                  <button
                    onClick={() => setIsQuickAddOpen(false)}
                    className="text-slate-400 hover:text-white p-1 rounded-lg"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Media Type Toggle */}
                <div className="flex gap-1.5 p-1 bg-[#131520] rounded-xl my-3 border border-[#2A2F45]">
                  <button
                    onClick={() => setQuickAddSelectedType('anime')}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      quickAddSelectedType === 'anime'
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Anime
                  </button>
                  <button
                    onClick={() => setQuickAddSelectedType('manga')}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      quickAddSelectedType === 'manga'
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Manga / Manhwa
                  </button>
                </div>

                {/* Quick Search Input */}
                <div className="relative mb-3">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={quickAddQuery}
                    onChange={e => setQuickAddQuery(e.target.value)}
                    placeholder="Type title (e.g. Frieren, Solo Leveling)..."
                    className="w-full bg-[#131520] border border-[#2A2F45] focus:border-indigo-500 rounded-xl pl-8 pr-3 py-2 text-xs text-white outline-none placeholder:text-slate-500"
                    autoFocus
                  />
                </div>

                {/* Quick Add Suggestions List */}
                <div className="max-h-56 overflow-y-auto space-y-1.5 pr-1 divide-y divide-[#2A2F45]/30">
                  {mediaItems
                    .filter(m => m.type === quickAddSelectedType)
                    .filter(m => !quickAddQuery.trim() || m.title.toLowerCase().includes(quickAddQuery.toLowerCase()))
                    .slice(0, 4)
                    .map(item => {
                      const isAlreadyInLib = library.some(l => l.mediaId === item.id && l.userId === currentUser.id);
                      return (
                        <div key={item.id} className="pt-1.5 first:pt-0 flex items-center justify-between gap-2.5">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <img
                              src={item.coverImage}
                              alt={item.title}
                              onError={e => {
                                (e.currentTarget as HTMLImageElement).src = '/src/assets/images/anime_card_nebula_1793517807647.jpg';
                              }}
                              className="w-9 h-12 object-cover rounded-lg shrink-0 bg-slate-900 border border-white/5"
                            />
                            <div className="min-w-0">
                              <div className="text-xs font-semibold text-white truncate">{item.title}</div>
                              <div className="text-[10px] text-slate-400">
                                {item.format} · ★ {item.score} · {item.episodes || item.chapters} eps
                              </div>
                            </div>
                          </div>

                          <button
                            onClick={() => {
                              openAddToListModal(item);
                              setIsQuickAddOpen(false);
                            }}
                            className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all shrink-0 flex items-center gap-1 ${
                              isAlreadyInLib
                                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25'
                                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm'
                            }`}
                          >
                            {isAlreadyInLib ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                            <span>{isAlreadyInLib ? 'Edit' : 'Add'}</span>
                          </button>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}
          </div>

          {/* 2. Center: Smart Auto-Fill Search Pill & Interactive Suggestion Chips */}
          <div ref={searchContainerRef} className="flex-1 max-w-xl mx-auto relative">
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#181A26]/90 border transition-all duration-200 ${
                isSearchExpanded
                  ? 'border-indigo-500 ring-2 ring-indigo-500/20 shadow-lg bg-[#181A26]'
                  : 'border-[#2A2F45] hover:border-slate-600'
              }`}
            >
              <Search className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchExpanded(true)}
                placeholder="Smart Search & Auto-Fill (Tap quick pills below)..."
                className="w-full bg-transparent text-xs text-white placeholder:text-slate-400 outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="p-0.5 text-slate-400 hover:text-white rounded-full"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Auto-Fill Suggestion Chips Bar */}
            <div className="flex items-center gap-1.5 mt-1.5 overflow-x-auto no-scrollbar py-0.5">
              <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap pl-1">
                Auto-fill:
              </span>
              {SUGGESTION_CHIPS.map(chip => (
                <button
                  key={chip.label}
                  onClick={() => handleChipClick(chip.label)}
                  className={`text-[11px] px-2.5 py-0.5 rounded-full border transition-all whitespace-nowrap flex items-center gap-1 font-medium ${
                    searchQuery === chip.label
                      ? 'bg-indigo-600 text-white border-indigo-400 shadow-sm'
                      : 'bg-[#181A26] hover:bg-[#222538] text-slate-300 hover:text-white border-[#2A2F45]'
                  }`}
                >
                  <span>{chip.icon}</span>
                  <span>{chip.label}</span>
                </button>
              ))}
            </div>

            {/* Live Search Instant Results Popover */}
            {isSearchExpanded && searchResults.length > 0 && (
              <div className="absolute left-0 right-0 mt-2 bg-[#181A26] border border-[#2A2F45] rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="p-2 divide-y divide-[#2A2F45]/50">
                  {searchResults.map(item => (
                    <div
                      key={item.id}
                      className="p-2 flex items-center justify-between gap-3 hover:bg-[#1F2335] rounded-xl transition-colors cursor-pointer group"
                      onClick={() => {
                        setSelectedMedia(item);
                        setIsSearchExpanded(false);
                      }}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={item.coverImage}
                          alt={item.title}
                          onError={e => {
                            (e.currentTarget as HTMLImageElement).src = '/src/assets/images/anime_card_nebula_1793517807647.jpg';
                          }}
                          className="w-10 h-14 object-cover rounded-lg shrink-0 bg-slate-900 border border-white/5"
                        />
                        <div className="min-w-0">
                          <div className="text-xs font-semibold text-white group-hover:text-indigo-400 transition-colors truncate">
                            {item.title}
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5">
                            {item.type.toUpperCase()} · {item.format} · ★ {item.score}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={e => {
                          e.stopPropagation();
                          openAddToListModal(item);
                          setIsSearchExpanded(false);
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-indigo-600/80 hover:bg-indigo-600 text-white text-[11px] font-semibold transition-all shrink-0 flex items-center gap-1 shadow-sm"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 3. Right: Morphing "Now Watching" / Level XP Pill & Sync Status Pill */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Active Watching Ticker Pill with direct +1 Ep */}
            {activeMedia && activeWatchingEntry ? (
              <div
                className={`flex items-center gap-2 pl-3 pr-1.5 py-1 rounded-full border transition-all duration-300 ${
                  justEarnedXp
                    ? 'bg-amber-500/20 border-amber-400 text-amber-300 ring-2 ring-amber-400/30 scale-105'
                    : 'bg-[#181A26] border-[#2A2F45] text-slate-300 hover:border-indigo-500/50'
                }`}
              >
                <div className="flex items-center gap-1.5 min-w-0 max-w-[140px] sm:max-w-[200px]">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>

                  <span className="text-[11px] font-medium truncate">
                    {justEarnedXp ? '⚡ +15 XP Logged!' : `${activeMedia.title}`}
                  </span>

                  <span className="text-[10px] text-indigo-400 font-mono font-bold shrink-0">
                    Ep {activeWatchingEntry.progress}/{activeWatchingEntry.totalProgress}
                  </span>
                </div>

                <button
                  onClick={handleQuickIncrement}
                  className="px-2 py-0.5 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white text-[10px] font-bold rounded-full transition-all shadow-sm flex items-center gap-0.5"
                  title="Quick Log +1 Episode (+15 XP)"
                >
                  <Plus className="w-2.5 h-2.5" />
                  <span>+1</span>
                </button>
              </div>
            ) : (
              /* If nothing active, show Level & XP */
              <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-[#181A26] border border-[#2A2F45] text-slate-300 text-xs">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span className="font-semibold text-amber-300">Level {gamification.level}</span>
                <span className="text-slate-500">·</span>
                <span className="font-mono text-[11px] text-slate-400">{gamification.totalXp} XP</span>
              </div>
            )}

            {/* Sync Pill with live pulse */}
            <button
              onClick={onOpenSyncModal}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#181A26] border border-[#2A2F45] hover:border-emerald-500/50 text-slate-300 hover:text-white text-xs font-medium transition-all group shadow-sm"
              title="MAL & AniList Cloud Sync Status"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 group-hover:animate-pulse" />
              <span className="hidden sm:inline">Sync</span>
              <RefreshCw className="w-3 h-3 text-emerald-400 group-hover:rotate-180 transition-transform duration-500" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};
