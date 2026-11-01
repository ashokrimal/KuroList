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
  Tv
} from 'lucide-react';
import { useApp } from '../context/AppContext';

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
    gamification
  } = useApp();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle instant search
  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      searchMedia(searchQuery).then(results => {
        setSearchResults(results.slice(0, 5));
        setIsSearchOpen(true);
      });
    } else {
      setSearchResults([]);
      setIsSearchOpen(false);
    }
  }, [searchQuery]);

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
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white flex items-center gap-1.5 ${
              activeView === 'community' ? 'text-indigo-400 font-semibold' : ''
            }`}
          >
            <Users className="w-4 h-4" />
            Community
          </button>
        </nav>

        {/* Zone 3: Search, Notification, Identity Card & User Profile */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Quick Search Bar */}
          <div ref={searchRef} className="relative hidden sm:block w-48 md:w-64">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search anime, manga..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.length > 1 && setIsSearchOpen(true)}
                className="w-full bg-[#181A26] border border-[#2A2F45] focus:border-indigo-500 text-xs text-white rounded-lg pl-9 pr-3 py-2 outline-none transition-colors placeholder:text-slate-500"
              />
            </div>

            {/* Instant Search Dropdown */}
            {isSearchOpen && searchResults.length > 0 && (
              <div className="absolute left-0 right-0 mt-2 bg-[#181A26] border border-[#2A2F45] rounded-xl shadow-2xl overflow-hidden z-50">
                <div className="p-2 divide-y divide-[#2A2F45]/50">
                  {searchResults.map(item => (
                    <div
                      key={item.id}
                      onClick={() => {
                        setSelectedMedia(item);
                        setIsSearchOpen(false);
                        setSearchQuery('');
                      }}
                      className="p-2 flex items-center gap-3 hover:bg-[#1F2335] rounded-lg cursor-pointer transition-colors"
                    >
                      <img
                        src={item.coverImage}
                        alt={item.title}
                        onError={e => {
                          (e.currentTarget as HTMLImageElement).src = '/src/assets/images/anime_card_nebula_1793517807647.jpg';
                        }}
                        className="w-10 h-14 object-cover rounded shrink-0 bg-slate-800"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-semibold text-white truncate">{item.title}</div>
                        <div className="text-[11px] text-slate-400">
                          {item.format} · {item.genres?.slice(0, 2).join(', ')} · ★ {item.score}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-2 border-t border-[#2A2F45] bg-[#131520] text-center">
                  <button
                    onClick={() => {
                      setActiveView('discover');
                      setIsSearchOpen(false);
                    }}
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
                  >
                    View all discovery results
                  </button>
                </div>
              </div>
            )}
          </div>

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
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-[#1F2335] rounded-lg transition-colors text-left"
                  >
                    <Bookmark className="w-4 h-4 text-slate-400" />
                    Manage Watchlist & Manga
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
