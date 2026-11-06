/**
 * KuroList - Main Application Entry
 * Full-stack NextGen Anime & Manga Social Tracking Platform
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { AnimeDetailModal } from './components/AnimeDetailModal';
import { AddToListModal } from './components/AddToListModal';
import { AnimeIdentityCardModal } from './components/AnimeIdentityCardModal';
import { ReviewModal } from './components/ReviewModal';
import { AuthModal } from './components/AuthModal';
import { AdminModal } from './components/AdminModal';
import { NotificationDrawer } from './components/NotificationDrawer';
import { LevelUpCelebrationModal } from './components/LevelUpCelebrationModal';
import { AndroidBottomNav } from './components/AndroidBottomNav';
import { StreamingSyncModal } from './components/StreamingSyncModal';
import { OfflineIndicator } from './components/OfflineIndicator';
import { CommandPaletteModal } from './components/CommandPaletteModal';

// Views
import { HomeView } from './views/HomeView';
import { DiscoverView } from './views/DiscoverView';
import { SeasonalCalendarView } from './views/SeasonalCalendarView';
import { MyListView } from './views/MyListView';
import { ProfileView } from './views/ProfileView';
import { CommunityView } from './views/CommunityView';
import { CollectionsView } from './views/CollectionsView';

const MainLayout: React.FC = () => {
  const {
    activeView,
    setActiveView,
    toast,
    isCelebrationOpen,
    setIsCelebrationOpen,
    celebrationData
  } = useApp();

  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0F1016] text-[#E2E8F0] flex flex-col font-sans selection:bg-indigo-600 selection:text-white">
      {/* Toast Notification Container */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 animate-in fade-in slide-in-from-top-3 duration-200">
          <div
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold shadow-2xl flex items-center gap-2 border ${
              toast.type === 'error'
                ? 'bg-rose-950/90 border-rose-500/50 text-rose-200'
                : toast.type === 'info'
                ? 'bg-[#181A26]/95 border-[#2A2F45] text-slate-200'
                : 'bg-indigo-950/90 border-indigo-500/60 text-indigo-100 shadow-indigo-950/50'
            }`}
          >
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar onOpenSyncModal={() => setIsSyncModalOpen(true)} />

      {/* Offline Status & Cache Notice Banner */}
      <OfflineIndicator />

      {/* Main View Area with Dynamic Fluid Flow */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-24 md:pb-12">
        <div key={activeView} className="animate-in fade-in zoom-in-[0.99] duration-150">
          {activeView === 'home' && <HomeView />}
          {activeView === 'discover' && <DiscoverView />}
          {activeView === 'seasonal' && <SeasonalCalendarView />}
          {activeView === 'mylist' && <MyListView />}
          {activeView === 'profile' && <ProfileView />}
          {activeView === 'community' && <CommunityView />}
          {activeView === 'collections' && <CollectionsView />}
        </div>
      </main>

      {/* Quiet, Anti-Slop Footer (§1.B) */}
      <footer className="border-t border-[#2A2F45]/60 bg-[#0F1016] py-8 text-xs text-slate-400 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white tracking-tight">KuroList</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span>Next-Generation Anime & Manga Social Tracking Platform</span>
          </div>

          <div className="flex items-center gap-6 text-slate-400">
            <button onClick={() => setActiveView('discover')} className="hover:text-white transition-colors cursor-pointer">
              Discover
            </button>
            <button onClick={() => setActiveView('seasonal')} className="hover:text-white transition-colors cursor-pointer">
              Schedule
            </button>
            <button onClick={() => setActiveView('mylist')} className="hover:text-white transition-colors cursor-pointer">
              My Library
            </button>
            <button onClick={() => setActiveView('community')} className="hover:text-white transition-colors cursor-pointer">
              Community
            </button>
            <button onClick={() => setActiveView('collections')} className="hover:text-white transition-colors cursor-pointer">
              Collections
            </button>
          </div>
        </div>
      </footer>

      {/* Android Edge-to-Edge Bottom Navigation Bar */}
      <AndroidBottomNav onOpenSyncModal={() => setIsSyncModalOpen(true)} />

      {/* Global Modals & Drawers */}
      <AnimeDetailModal />
      <AddToListModal />
      <AnimeIdentityCardModal />
      <ReviewModal />
      <AuthModal />
      <AdminModal />
      <NotificationDrawer />
      <CommandPaletteModal />
      <StreamingSyncModal
        isOpen={isSyncModalOpen}
        onClose={() => setIsSyncModalOpen(false)}
      />
      <LevelUpCelebrationModal
        isOpen={isCelebrationOpen}
        onClose={() => setIsCelebrationOpen(false)}
        celebrationData={celebrationData}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
