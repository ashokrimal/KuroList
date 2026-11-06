/**
 * Top Navigation Bar conforming to Frontend Design Top Bar Contract (§2)
 * Zone 1: Wordmark
 * Zone 2: Single-line nav links
 * Zone 3: Primary actions & profile
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Compass,
  Calendar,
  Bookmark,
  Users,
  Search,
  Bell,
  Sparkles,
  Shield,
  LogOut,
  UserCheck,
  ChevronDown,
  Tv,
  Layers
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PWAInstallButton } from './PWAInstallButton';

interface NavbarProps {
  onOpenSyncModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSyncModal }) => {
  const {
    currentUser,
    otherUsers,
    switchUser,
    activeView,
    setActiveView,
    unreadNotificationsCount,
    setIsNotificationsOpen,
    setIsIdentityCardOpen,
    setIsAuthModalOpen,
    setIsAdminModalOpen,
    setSelectedMedia,
    searchMedia,
    openAddToListModal,
    gamification,
    setIsCommandPaletteOpen
  } = useApp();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0F1016]/85 backdrop-blur-md border-b border-[#2A2F45]/60 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => {
            setActiveView('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-2.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg group"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <span className="font-bold text-white text-base tracking-wider">K</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-white whitespace-nowrap shrink-0">
            Kuro<span className="text-indigo-400">List</span>
          </span>
        </button>

        {/* Zone 2: Concise single-line navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300">
          <button
            onClick={() => setActiveView('discover')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white flex items-center gap-1.5 ${
              activeView === 'discover' ? 'text-indigo-400 font-semibold' : ''
            }`}
          >
            <Compass className="w-4 h-4" />
            Discover
          </button>
          <button
            onClick={() => setActiveView('seasonal')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white flex items-center gap-1.5 ${
              activeView === 'seasonal' ? 'text-indigo-400 font-semibold' : ''
            }`}
          >
            <Calendar className="w-4 h-4" />
            Schedule
          </button>
          <button
            onClick={() => setActiveView('mylist')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white flex items-center gap-1.5 ${
              activeView === 'mylist' ? 'text-indigo-400 font-semibold' : ''
            }`}
          >
            <Bookmark className="w-4 h-4" />
            My Library
          </button>
          <button
            onClick={() => setActiveView('community')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white flex items-center gap-1.5 cursor-pointer ${
              activeView === 'community' ? 'text-indigo-400 font-semibold' : ''
            }`}
          >
            <Users className="w-4 h-4" />
            Community
          </button>
          <button
            onClick={() => setActiveView('collections')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white flex items-center gap-1.5 cursor-pointer ${
              activeView === 'collections' ? 'text-indigo-400 font-semibold' : ''
            }`}
          >
            <Layers className="w-4 h-4" />
            Collections
          </button>
        </nav>

        {/* Zone 3: Search, Notification, Identity Card & User Profile */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Mobile Search Button (< sm) */}
          <button
            type="button"
            onClick={() => setIsCommandPaletteOpen(true)}
            className="sm:hidden p-2 text-slate-400 hover:text-white hover:bg-[#181A26] rounded-lg transition-colors cursor-pointer"
            aria-label="Open Search and Command Palette"
            title="Search anime and manga"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Desktop Spotlight Search Launcher Bar */}
          <button
            type="button"
            onClick={() => setIsCommandPaletteOpen(true)}
            className="relative hidden sm:flex items-center gap-2.5 w-48 md:w-64 bg-[#181A26] hover:bg-[#1F2335] border border-[#2A2F45] hover:border-indigo-500/50 text-xs text-slate-400 hover:text-slate-200 rounded-lg pl-3 pr-2.5 py-2 transition-all group text-left cursor-pointer"
            title="Search anime, manga, and quick commands (Press Cmd+K or /)"
          >
            <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-400 transition-colors shrink-0" />
            <span className="truncate flex-1">Search anime, manga...</span>
            <kbd className="hidden md:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-[#10121C] border border-[#2A2F45] text-[10px] font-mono text-slate-400 group-hover:text-indigo-300">
              ⌘K
            </kbd>
          </button>

          {/* Stream & MAL Sync Hub Trigger */}
          {onOpenSyncModal && (
            <button
              onClick={onOpenSyncModal}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-[#181A26] border border-[#2A2F45] hover:border-orange-500/50 text-slate-300 hover:text-white rounded-lg text-xs font-medium transition-all shadow-sm whitespace-nowrap shrink-0"
              title="Sync with Crunchyroll, MAL, AniList, HiAnime"
            >
              <Tv className="w-3.5 h-3.5 text-orange-400" />
              <span>Stream & Sync</span>
            </button>
          )}

          {/* PWA Install Button */}
          <PWAInstallButton />

          {/* Anime Identity Card Trigger */}
          <button
            onClick={() => setIsIdentityCardOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-indigo-500/15 to-violet-500/15 border border-indigo-500/30 hover:border-indigo-400 text-indigo-300 hover:text-white rounded-lg text-xs font-medium transition-all shadow-sm whitespace-nowrap shrink-0"
            title="Generate your shareable Anime Identity Card"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Identity Card</span>
          </button>

          {/* Notifications Trigger */}
          <button
            onClick={() => setIsNotificationsOpen(true)}
            className="relative p-2 text-slate-400 hover:text-white hover:bg-[#181A26] rounded-lg transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-500 ring-2 ring-[#0F1016]" />
            )}
          </button>

          {/* User Profile Dropdown Menu */}
          <div ref={userMenuRef} className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-lg hover:bg-[#181A26] border border-transparent hover:border-[#2A2F45] transition-colors focus-visible:outline-none"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.displayName}
                className="w-7 h-7 rounded-full object-cover ring-1 ring-indigo-500/50"
              />
              <span className="hidden lg:inline text-xs font-medium text-slate-200 truncate max-w-[100px]">
                {currentUser.displayName}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Menu Popover */}
            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-[#181A26] border border-[#2A2F45] rounded-xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                {/* User quick info */}
                <div className="p-2 border-b border-[#2A2F45]/60 mb-1">
                  <div className="font-semibold text-sm text-white truncate">{currentUser.displayName}</div>
                  <div className="text-xs text-indigo-400 font-mono">@{currentUser.username} · {gamification.title}</div>
                  <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="font-semibold text-amber-300">Level {gamification.level}</span>
                    <span className="font-mono">{gamification.totalXp.toLocaleString()} XP</span>
                  </div>
                  <div className="w-full bg-[#131520] h-1.5 rounded-full overflow-hidden mt-1">
                    <div
                      className="bg-gradient-to-r from-indigo-500 to-amber-400 h-full rounded-full transition-all"
                      style={{ width: `${gamification.levelProgressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Nav actions */}
                <div className="space-y-0.5">
                  <button
                    onClick={() => {
                      setActiveView('profile');
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-[#1F2335] rounded-lg transition-colors text-left"
                  >
                    <UserCheck className="w-4 h-4 text-slate-400" />
                    View My Public Profile
                  </button>
                  <button
                    onClick={() => {
                      setActiveView('mylist');
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-[#1F2335] rounded-lg transition-colors text-left cursor-pointer"
                  >
                    <Bookmark className="w-4 h-4 text-slate-400" />
                    Manage Watchlist & Manga
                  </button>
                  <button
                    onClick={() => {
                      setActiveView('collections');
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-[#1F2335] rounded-lg transition-colors text-left cursor-pointer"
                  >
                    <Layers className="w-4 h-4 text-slate-400" />
                    Curated Collections
                  </button>

                  {/* Switch to other demo users */}
                  <div className="pt-2 pb-1 px-3 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    Switch Active Account
                  </div>
                  {otherUsers.map(user => (
                    <button
                      key={user.id}
                      onClick={() => {
                        switchUser(user);
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-1.5 text-xs text-slate-300 hover:text-white hover:bg-[#1F2335] rounded-lg transition-colors text-left"
                    >
                      <img src={user.avatar} alt={user.displayName} className="w-5 h-5 rounded-full object-cover" />
                      <span className="truncate">@{user.username}</span>
                    </button>
                  ))}

                  {/* Admin dashboard if user is admin */}
                  {currentUser.role === 'admin' && (
                    <button
                      onClick={() => {
                        setIsAdminModalOpen(true);
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-amber-400 hover:bg-amber-500/10 rounded-lg transition-colors text-left mt-1"
                    >
                      <Shield className="w-4 h-4" />
                      Admin & Moderation Panel
                    </button>
                  )}

                  <div className="border-t border-[#2A2F45]/60 my-1 pt-1">
                    <button
                      onClick={() => {
                        setIsAuthModalOpen(true);
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      Switch Account / Sign In
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
