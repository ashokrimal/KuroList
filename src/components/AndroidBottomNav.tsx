/**
 * AndroidBottomNav Component
 * Authentic Android / Material 3 Edge-to-Edge Bottom Navigation Bar
 * Replaces floating pill dock with full-width docked navigation,
 * Material 3 active pill containers, touch targets >= 48px, and safe-area padding.
 */

import React from 'react';
import {
  Home,
  Compass,
  Bookmark,
  Users,
  Calendar
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { triggerHaptic } from '../utils/haptics';

interface AndroidBottomNavProps {
  onOpenSyncModal?: () => void;
}

export const AndroidBottomNav: React.FC<AndroidBottomNavProps> = ({ onOpenSyncModal }) => {
  const {
    activeView,
    setActiveView,
    currentUser,
    library
  } = useApp();

  // Calculate count for My List badge
  const watchingCount = library.filter(
    l => l.userId === currentUser.id && (l.status === 'watching' || l.status === 'reading')
  ).length;

  const totalListCount = library.filter(l => l.userId === currentUser.id).length;

  const navItems = [
    {
      id: 'home' as const,
      label: 'Home',
      icon: Home
    },
    {
      id: 'discover' as const,
      label: 'Discover',
      icon: Compass
    },
    {
      id: 'mylist' as const,
      label: 'My List',
      icon: Bookmark,
      badge: watchingCount > 0 ? watchingCount : totalListCount > 0 ? totalListCount : undefined
    },
    {
      id: 'community' as const,
      label: 'Community',
      icon: Users
    },
    {
      id: 'seasonal' as const,
      label: 'Schedule',
      icon: Calendar
    }
  ];

  const handleTabSelect = (tabId: typeof navItems[number]['id']) => {
    const isAlreadyActive = activeView === tabId;
    triggerHaptic(isAlreadyActive ? 'double' : 'tab');
    setActiveView(tabId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav
      aria-label="Android Bottom Navigation"
      className="md:hidden fixed bottom-0 inset-x-0 w-full z-40 bg-[#0F111A]/95 backdrop-blur-2xl border-t border-[#222538] select-none transition-all safe-area-bottom shadow-[0_-8px_30px_rgba(0,0,0,0.6)]"
    >
      <div className="max-w-md md:max-w-xl mx-auto w-full px-2 pt-1.5 pb-1">
        <div className="grid grid-cols-5 items-center justify-around h-14">
          {navItems.map(item => {
            const isActive = activeView === item.id;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                type="button"
                onPointerDown={() => triggerHaptic(isActive ? 'double' : 'tab')}
                onClick={() => handleTabSelect(item.id)}
                className="group relative flex flex-col items-center justify-center h-full min-h-[48px] py-1 cursor-pointer transition-transform active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-xl"
              >
                {/* Material 3 Active Pill Container around Icon */}
                <div
                  className={`relative flex items-center justify-center px-4 py-1 rounded-full transition-all duration-200 ${
                    isActive
                      ? 'bg-indigo-500/20 text-indigo-400 font-semibold shadow-sm'
                      : 'text-slate-400 group-hover:text-slate-200 group-hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-105 stroke-[2.2]' : 'stroke-[1.8]'}`} />

                  {/* Badge Counter (for My List) */}
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-indigo-600 text-[10px] font-bold text-white flex items-center justify-center ring-2 ring-[#0F111A] tabular-nums">
                      {item.badge > 99 ? '99+' : item.badge}
                    </span>
                  )}
                </div>

                {/* Text Label */}
                <span
                  className={`text-[11px] mt-0.5 tracking-tight transition-colors truncate max-w-[64px] ${
                    isActive
                      ? 'font-semibold text-indigo-400'
                      : 'font-medium text-slate-400 group-hover:text-slate-300'
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Subtle Android System Gesture Navigation Handle Bar */}
        <div className="w-28 h-1 bg-white/20 rounded-full mx-auto mt-1 mb-0.5" aria-hidden="true" />
      </div>
    </nav>
  );
};
