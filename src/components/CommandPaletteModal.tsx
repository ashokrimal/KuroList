/**
 * CommandPaletteModal Component
 * Universal Spotlight Search, Quick Navigation & Catalog Command Center
 * Responsive: Desktop Spotlight (Cmd+K / /) & Mobile Native Full-screen Drawer
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  X,
  Compass,
  Bookmark,
  Calendar,
  Users,
  Layers,
  User,
  Tv,
  Sparkles,
  ArrowRight,
  Plus,
  Check,
  Star,
  ExternalLink,
  Flame,
  Clock,
  Loader2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MediaItem, MediaType } from '../types';
import { triggerHaptic } from '../utils/haptics';

export const CommandPaletteModal: React.FC = () => {
  const {
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    mediaItems,
    searchMedia,
    setSelectedMedia,
    openAddToListModal,
    setActiveView,
    library,
    currentUser,
    stats,
    streak
  } = useApp();

  const [query, setQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'anime' | 'manga' | 'library'>('all');
  const [results, setResults] = useState<MediaItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Auto-focus when opened
  useEffect(() => {
    if (isCommandPaletteOpen) {
      setQuery('');
      setSelectedIndex(0);
      setFilterType('all');
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isCommandPaletteOpen]);

  // Handle Search Query & Filtering
  useEffect(() => {
    if (!isCommandPaletteOpen) return;

    if (!query.trim()) {
      setResults([]);
      setIsSearching(false);
      setSelectedIndex(0);
      return;
    }

    let isCancelled = false;
    setIsSearching(true);

    const timer = setTimeout(async () => {
      try {
        const typeFilter = filterType === 'anime' ? 'anime' : filterType === 'manga' ? 'manga' : undefined;
        let searchResults = await searchMedia(query, typeFilter);

        if (filterType === 'library') {
          const userMediaIds = new Set(library.filter(l => l.userId === currentUser.id).map(l => l.mediaId));
          searchResults = searchResults.filter(item => userMediaIds.has(item.id));
        }

        if (!isCancelled) {
          setResults(searchResults);
          setSelectedIndex(0);
        }
      } catch {
        if (!isCancelled) {
          setResults([]);
        }
      } finally {
        if (!isCancelled) {
          setIsSearching(false);
        }
      }
    }, 180);

    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [query, filterType, isCommandPaletteOpen]);

  // Keyboard navigation inside command palette
  useEffect(() => {
    if (!isCommandPaletteOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % Math.max(1, (results.length || navigationShortcuts.length)));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + Math.max(1, (results.length || navigationShortcuts.length))) % Math.max(1, (results.length || navigationShortcuts.length)));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (results.length > 0 && results[selectedIndex]) {
          handleSelectMedia(results[selectedIndex]);
        } else if (!query.trim() && navigationShortcuts[selectedIndex]) {
          navigationShortcuts[selectedIndex].action();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandPaletteOpen, results, selectedIndex, query]);

  if (!isCommandPaletteOpen) return null;

  const handleClose = () => {
    triggerHaptic('light');
    setIsCommandPaletteOpen(false);
  };

  const handleSelectMedia = (item: MediaItem) => {
    triggerHaptic('medium');
    setSelectedMedia(item);
    setIsCommandPaletteOpen(false);
  };

  const handleOpenAddModal = (e: React.MouseEvent, item: MediaItem) => {
    e.stopPropagation();
    triggerHaptic('selection');
    openAddToListModal(item);
    setIsCommandPaletteOpen(false);
  };

  const navigationShortcuts = [
    {
      id: 'discover',
      title: 'Discover & Search Catalog',
      desc: 'Explore seasonal anime, manga rankings, and genre filters',
      icon: Compass,
      color: 'text-indigo-400 bg-indigo-500/10',
      action: () => {
        triggerHaptic('tab');
        setActiveView('discover');
        setIsCommandPaletteOpen(false);
      }
    },
    {
      id: 'mylist',
      title: 'My Library & Watchlist',
      desc: `Track your ${stats.animeCount} anime and ${stats.mangaCount} manga titles`,
      icon: Bookmark,
      color: 'text-emerald-400 bg-emerald-500/10',
      action: () => {
        triggerHaptic('tab');
        setActiveView('mylist');
        setIsCommandPaletteOpen(false);
      }
    },
    {
      id: 'seasonal',
      title: 'Seasonal Airing Schedule',
      desc: 'Browse weekly countdowns and release times',
      icon: Calendar,
      color: 'text-amber-400 bg-amber-500/10',
      action: () => {
        triggerHaptic('tab');
        setActiveView('seasonal');
        setIsCommandPaletteOpen(false);
      }
    },
    {
      id: 'community',
      title: 'Community & Discussions',
      desc: 'Join anime discussion threads, polls, and live activity',
      icon: Users,
      color: 'text-cyan-400 bg-cyan-500/10',
      action: () => {
        triggerHaptic('tab');
        setActiveView('community');
        setIsCommandPaletteOpen(false);
      }
    },
    {
      id: 'collections',
      title: 'Curated Collections',
      desc: 'User created anime lists, thematic journeys, and tier lists',
      icon: Layers,
      color: 'text-violet-400 bg-violet-500/10',
      action: () => {
        triggerHaptic('tab');
        setActiveView('collections');
        setIsCommandPaletteOpen(false);
      }
    },
    {
      id: 'profile',
      title: 'My Profile & Habit Streak',
      desc: `${currentUser.displayName} • Level ${currentUser.level} • ${streak.currentStreak} Day Streak`,
      icon: User,
      color: 'text-pink-400 bg-pink-500/10',
      action: () => {
        triggerHaptic('tab');
        setActiveView('profile');
        setIsCommandPaletteOpen(false);
      }
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-150">
      <div
        className="w-full sm:max-w-2xl h-full sm:h-auto sm:max-h-[85vh] bg-[#12141F] sm:border border-[#25283C] sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
        aria-label="Command Palette and Search"
      >
        {/* Search Input Bar */}
        <div className="p-3 sm:p-4 border-b border-[#25283C] bg-[#161824] flex items-center gap-3">
          <div className="text-indigo-400 shrink-0">
            {isSearching ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Search className="w-5 h-5" />
            )}
          </div>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search anime, manga, studios, or jump to views..."
            className="flex-1 bg-transparent text-sm sm:text-base text-white placeholder:text-slate-500 outline-none font-medium"
          />

          {query && (
            <button
              onClick={() => {
                setQuery('');
                inputRef.current?.focus();
              }}
              className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors"
              title="Clear input"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={handleClose}
            className="px-2.5 py-1 text-xs font-semibold text-slate-300 hover:text-white bg-[#10121C] hover:bg-[#1E2235] border border-[#25283C] rounded-lg transition-colors flex items-center gap-1.5"
          >
            <span className="sm:hidden">Close</span>
            <span className="hidden sm:inline font-mono text-[10px] text-slate-400">ESC</span>
          </button>
        </div>

        {/* Filter Tabs Strip */}
        <div className="px-3 sm:px-4 py-2 border-b border-[#25283C]/70 bg-[#10121C]/80 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {(['all', 'anime', 'manga', 'library'] as const).map(type => (
            <button
              key={type}
              onClick={() => {
                triggerHaptic('light');
                setFilterType(type);
              }}
              className={`min-h-[32px] px-3 py-1 rounded-lg text-xs font-medium capitalize transition-all whitespace-nowrap active:scale-95 ${
                filterType === type
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-[#1A1D2D]'
              }`}
            >
              {type === 'all'
                ? 'All Results'
                : type === 'library'
                ? `In My Library (${library.filter(l => l.userId === currentUser.id).length})`
                : type}
            </button>
          ))}
        </div>

        {/* Results & Quick Navigation Body */}
        <div
          ref={listRef}
          className="flex-1 overflow-y-auto p-2 sm:p-3 divide-y divide-[#25283C]/40 space-y-1"
        >
          {query.trim().length > 0 ? (
            /* Search Results */
            results.length > 0 ? (
              <div className="space-y-1 pt-1">
                <div className="px-3 py-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                  <span>Found {results.length} Titles</span>
                  <span className="font-mono text-[10px] text-indigo-400">Live Global Search</span>
                </div>
                {results.map((item, idx) => {
                  const entry = library.find(l => l.userId === currentUser.id && l.mediaId === item.id);
                  const isSelected = selectedIndex === idx;

                  return (
                    <div
                      key={item.id}
                      onClick={() => handleSelectMedia(item)}
                      className={`group p-2.5 rounded-xl cursor-pointer transition-all flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'bg-indigo-600/15 border border-indigo-500/40 text-white'
                          : 'hover:bg-[#1A1D2D] text-slate-200 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <img
                          src={item.coverImage}
                          alt={item.title}
                          onError={e => {
                            (e.currentTarget as HTMLImageElement).src = '/src/assets/images/anime_card_nebula_1793517807647.jpg';
                          }}
                          className="w-10 h-14 object-cover rounded-lg bg-slate-900 border border-[#25283C] shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="font-semibold text-xs sm:text-sm text-white truncate group-hover:text-indigo-400 transition-colors">
                            {item.title}
                          </div>
                          <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5 truncate">
                            <span className="capitalize">{item.type}</span>
                            <span aria-hidden="true">·</span>
                            <span>{item.format}</span>
                            {item.year && (
                              <>
                                <span aria-hidden="true">·</span>
                                <span>{item.year}</span>
                              </>
                            )}
                            <span aria-hidden="true">·</span>
                            <span className="text-amber-400 flex items-center gap-0.5 font-mono">
                              <Star className="w-3 h-3 fill-amber-400" />
                              {item.score}
                            </span>
                          </div>

                          {/* Library status chip if present */}
                          {entry && (
                            <div className="mt-1 flex items-center gap-1.5 text-[10px] text-emerald-400 font-mono">
                              <Check className="w-3 h-3 stroke-[3]" />
                              <span className="capitalize">{entry.status.replace('_', ' ')}</span>
                              <span>•</span>
                              <span>
                                {entry.progress}/{entry.totalProgress || '?'}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Quick Add or Manage button */}
                      <button
                        type="button"
                        onClick={e => handleOpenAddModal(e, item)}
                        className={`min-h-[32px] px-2.5 py-1 text-xs font-semibold rounded-lg transition-all flex items-center gap-1 shrink-0 ${
                          entry
                            ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/25'
                            : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm active:scale-95'
                        }`}
                        title={entry ? 'Update status & progress' : 'Add to personal library'}
                      >
                        {entry ? (
                          <>
                            <Check className="w-3 h-3" />
                            <span className="hidden sm:inline">Tracked</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3 h-3" />
                            <span>Add</span>
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : !isSearching ? (
              <div className="p-8 text-center text-slate-400 space-y-2">
                <Search className="w-8 h-8 mx-auto text-slate-600" />
                <p className="text-sm font-semibold text-slate-300">No titles found for "{query}"</p>
                <p className="text-xs text-slate-500">Try searching by romaji, alternate English title, or studio name.</p>
              </div>
            ) : (
              <div className="p-8 text-center text-slate-400 space-y-2">
                <Loader2 className="w-6 h-6 mx-auto text-indigo-400 animate-spin" />
                <p className="text-xs">Searching global anime & manga database...</p>
              </div>
            )
          ) : (
            /* Quick Navigation Shortcuts */
            <div className="space-y-1 pt-1">
              <div className="px-3 py-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                <span>Quick View Jump & Actions</span>
                <span className="hidden sm:inline font-mono text-[10px] text-slate-400">↑↓ to navigate</span>
              </div>
              {navigationShortcuts.map((item, idx) => {
                const Icon = item.icon;
                const isSelected = selectedIndex === idx;

                return (
                  <div
                    key={item.id}
                    onClick={item.action}
                    className={`p-3 rounded-xl cursor-pointer transition-all flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-indigo-600/15 border border-indigo-500/40 text-white'
                        : 'hover:bg-[#1A1D2D] text-slate-300 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${item.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs sm:text-sm font-semibold text-white">{item.title}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">{item.desc}</div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white" />
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Shortcut Hints (Desktop) */}
        <div className="p-3 bg-[#10121C] border-t border-[#25283C] text-[11px] text-slate-400 hidden sm:flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 bg-[#181A26] border border-[#25283C] rounded font-mono text-[10px] text-slate-300">↑</kbd>
              <kbd className="px-1.5 py-0.5 bg-[#181A26] border border-[#25283C] rounded font-mono text-[10px] text-slate-300">↓</kbd>
              <span>to navigate</span>
            </span>
            <span className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 bg-[#181A26] border border-[#25283C] rounded font-mono text-[10px] text-slate-300">↵</kbd>
              <span>to select</span>
            </span>
            <span className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 bg-[#181A26] border border-[#25283C] rounded font-mono text-[10px] text-slate-300">ESC</kbd>
              <span>to close</span>
            </span>
          </div>
          <div className="text-indigo-400 font-mono text-[10px]">KuroList Search Engine v2.4</div>
        </div>
      </div>
    </div>
  );
};
