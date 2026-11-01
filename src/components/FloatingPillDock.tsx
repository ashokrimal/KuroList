/**
 * Floating Pill Navbar & Shortcuts Dock
 * Inspired by iPhone Dynamic Island, iOS Native Apps & ColorOS 17 Aqua Dynamics UI
 * Features floating frosted glass pill, fluid sliding indicator, and expand-on-touch shortcuts sheet
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Home,
  Compass,
  Bookmark,
  Users,
  User,
  Plus,
  Tv,
  Sparkles,
  Dice5,
  Search,
  Calendar,
  X,
  Flame,
  Check,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface FloatingPillDockProps {
  onOpenSyncModal: () => void;
}

export const FloatingPillDock: React.FC<FloatingPillDockProps> = ({ onOpenSyncModal }) => {
  const {
    activeView,
    setActiveView,
    currentUser,
    library,
    mediaItems,
    incrementProgress,
    setSelectedMedia,
    setIsIdentityCardOpen,
    showToast
  } = useApp();

  const [isShortcutSheetOpen, setIsShortcutSheetOpen] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);

  // Close shortcuts on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (sheetRef.current && !sheetRef.current.contains(e.target as Node)) {
        setIsShortcutSheetOpen(false);
      }
    };
    if (isShortcutSheetOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isShortcutSheetOpen]);

  // Find currently watching anime for 1-touch quick increment
  const activeWatchingEntry = library.find(
    l => l.userId === currentUser.id && l.status === 'watching' && l.mediaType === 'anime'
  );
  const activeWatchingMedia = activeWatchingEntry ? mediaItems.find(m => m.id === activeWatchingEntry.mediaId) : null;

  const handleRollDice = () => {
    const randomItem = mediaItems[Math.floor(Math.random() * mediaItems.length)];
    setSelectedMedia(randomItem);
    setIsShortcutSheetOpen(false);
    showToast(`Rolled: ${randomItem.title}!`);
  };

  const handleQuickLog = () => {
    if (activeWatchingMedia) {
      incrementProgress(activeWatchingMedia.id);
      setIsShortcutSheetOpen(false);
    } else {
      showToast('No active anime currently marked as "Watching"', 'info');
    }
  };

  return (
    <>
      {/* 1. ColorOS 17 / iOS Fluid Expansion Shortcut Sheet */}
      {isShortcutSheetOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
          <div
            ref={sheetRef}
            className="w-full max-w-sm sm:max-w-md bg-[#181A26]/95 border border-white/15 rounded-3xl p-5 shadow-2xl shadow-indigo-950/80 backdrop-blur-2xl animate-in slide-in-from-bottom-5 duration-300 space-y-4"
          >
            {/* Sheet Header */}
            <div className="flex items-center justify-between pb-2 border-b border-[#2A2F45]">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 animate-pulse" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                  ColorOS Fluid Shortcuts
                </h3>
              </div>

              <button
                onClick={() => setIsShortcutSheetOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-full hover:bg-[#1F2335] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick 1-Tap Episode Logger (if watching a show) */}
            {activeWatchingMedia && activeWatchingEntry && (
              <div className="p-3 bg-[#131520] border border-indigo-500/40 rounded-2xl flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <img
                    src={activeWatchingMedia.coverImage}
                    alt={activeWatchingMedia.title}
                    className="w-9 h-12 object-cover rounded-lg shrink-0"
                  />
                  <div className="min-w-0">
                    <span className="text-[10px] text-indigo-400 font-semibold block uppercase">Quick Log</span>
                    <span className="text-xs font-bold text-white truncate block">{activeWatchingMedia.title}</span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      Ep {activeWatchingEntry.progress} / {activeWatchingEntry.totalProgress}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleQuickLog}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/30 shrink-0 transition-transform active:scale-95"
                >
                  +1 Episode
                </button>
              </div>
            )}

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-2 gap-2.5 text-left">
              {/* Sync with Crunchyroll & MAL */}
              <button
                onClick={() => {
                  setIsShortcutSheetOpen(false);
                  onOpenSyncModal();
                }}
                className="p-3 bg-[#131520] hover:bg-[#1F2335] border border-[#2A2F45] hover:border-indigo-500/50 rounded-2xl transition-all flex items-center gap-3 group"
              >
                <div className="w-9 h-9 rounded-xl bg-orange-500/15 border border-orange-500/30 text-orange-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Tv className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-white group-hover:text-indigo-400">Stream & Sync</div>
                  <div className="text-[10px] text-slate-400 truncate">Crunchyroll · MAL · HiAnime</div>
                </div>
              </button>

              {/* Identity Card */}
              <button
                onClick={() => {
                  setIsShortcutSheetOpen(false);
                  setIsIdentityCardOpen(true);
                }}
                className="p-3 bg-[#131520] hover:bg-[#1F2335] border border-[#2A2F45] hover:border-indigo-500/50 rounded-2xl transition-all flex items-center gap-3 group"
              >
                <div className="w-9 h-9 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-white group-hover:text-indigo-400">Identity Card</div>
                  <div className="text-[10px] text-slate-400 truncate">Shareable Anime Passport</div>
                </div>
              </button>

              {/* Roll Random Anime */}
              <button
                onClick={handleRollDice}
                className="p-3 bg-[#131520] hover:bg-[#1F2335] border border-[#2A2F45] hover:border-indigo-500/50 rounded-2xl transition-all flex items-center gap-3 group"
              >
                <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Dice5 className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-white group-hover:text-indigo-400">Surprise Me</div>
                  <div className="text-[10px] text-slate-400 truncate">Roll a random title</div>
                </div>
              </button>

              {/* Weekly Airing Schedule */}
              <button
                onClick={() => {
                  setIsShortcutSheetOpen(false);
                  setActiveView('seasonal');
                }}
                className="p-3 bg-[#131520] hover:bg-[#1F2335] border border-[#2A2F45] hover:border-indigo-500/50 rounded-2xl transition-all flex items-center gap-3 group"
              >
                <div className="w-9 h-9 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Calendar className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-white group-hover:text-indigo-400">Schedule</div>
                  <div className="text-[10px] text-slate-400 truncate">Weekly airings & drops</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Floating Island Pill Dock (iOS / ColorOS 17 Style) */}
      <div className="fixed bottom-4 inset-x-0 z-40 flex justify-center pointer-events-none px-4 safe-area-bottom">
        <div className="pointer-events-auto flex items-center gap-1.5 p-1.5 bg-[#131520]/85 backdrop-blur-2xl border border-white/15 rounded-full shadow-2xl shadow-black/80 hover:border-indigo-500/50 transition-all duration-300">
          {/* Nav Item: Home */}
          <button
            onClick={() => setActiveView('home')}
            className={`p-2.5 rounded-full transition-all flex items-center gap-2 ${
              activeView === 'home'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/40 px-3.5'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
            title="Home"
          >
            <Home className="w-4 h-4" />
            {activeView === 'home' && <span className="text-xs font-bold hidden sm:inline">Home</span>}
          </button>

          {/* Nav Item: Discover */}
          <button
            onClick={() => setActiveView('discover')}
            className={`p-2.5 rounded-full transition-all flex items-center gap-2 ${
              activeView === 'discover'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/40 px-3.5'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
            title="Discover"
          >
            <Compass className="w-4 h-4" />
            {activeView === 'discover' && <span className="text-xs font-bold hidden sm:inline">Discover</span>}
          </button>

          {/* Nav Item: My Library */}
          <button
            onClick={() => setActiveView('mylist')}
            className={`p-2.5 rounded-full transition-all flex items-center gap-2 ${
              activeView === 'mylist'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/40 px-3.5'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
            title="My Library"
          >
            <Bookmark className="w-4 h-4" />
            {activeView === 'mylist' && <span className="text-xs font-bold hidden sm:inline">Library</span>}
          </button>

          {/* Central ColorOS 17 Aqua Dynamic Action Launcher */}
          <button
            onClick={() => setIsShortcutSheetOpen(!isShortcutSheetOpen)}
            className={`p-2.5 rounded-full bg-gradient-to-tr from-indigo-500 via-indigo-600 to-violet-500 text-white shadow-lg shadow-indigo-600/50 hover:scale-105 active:scale-95 transition-transform ${
              isShortcutSheetOpen ? 'rotate-45' : ''
            }`}
            title="ColorOS Shortcuts"
          >
            <Plus className="w-4 h-4" />
          </button>

          {/* Nav Item: Community */}
          <button
            onClick={() => setActiveView('community')}
            className={`p-2.5 rounded-full transition-all flex items-center gap-2 ${
              activeView === 'community'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/40 px-3.5'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
            title="Community"
          >
            <Users className="w-4 h-4" />
            {activeView === 'community' && <span className="text-xs font-bold hidden sm:inline">Community</span>}
          </button>

          {/* Nav Item: Profile */}
          <button
            onClick={() => setActiveView('profile')}
            className={`p-2 rounded-full transition-all flex items-center gap-2 ${
              activeView === 'profile'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/40 pl-2 pr-3.5'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
            title="Profile"
          >
            <img
              src={currentUser.avatar}
              alt="Avatar"
              className="w-5 h-5 rounded-full object-cover ring-1 ring-white/30"
            />
            {activeView === 'profile' && <span className="text-xs font-bold hidden sm:inline">Profile</span>}
          </button>
        </div>
      </div>
    </>
  );
};
