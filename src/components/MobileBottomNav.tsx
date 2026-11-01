/**
 * Mobile-First Bottom Navigation Bar
 * Follows 15% Sticky Cap (§1.I) and touch-target sizing (>= 44px)
 */

import React from 'react';
import { Home, Compass, Bookmark, Users, User } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface NavItem {
  id: 'home' | 'discover' | 'mylist' | 'community' | 'profile';
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  customAvatar?: string;
}

export const MobileBottomNav: React.FC = () => {
  const { activeView, setActiveView, currentUser } = useApp();

  const navItems: NavItem[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'discover', label: 'Discover', icon: Compass },
    { id: 'mylist', label: 'My List', icon: Bookmark },
    { id: 'community', label: 'Community', icon: Users },
    { id: 'profile', label: 'Profile', icon: User, customAvatar: currentUser.avatar }
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#131520]/95 backdrop-blur-lg border-t border-[#2A2F45]/80 px-2 py-1 safe-area-bottom">
      <nav className="flex items-center justify-around h-14">
        {navItems.map(item => {
          const isActive = activeView === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveView(item.id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] rounded-lg transition-colors relative ${
                isActive ? 'text-indigo-400 font-medium' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {item.customAvatar && isActive ? (
                <img
                  src={item.customAvatar}
                  alt="Profile"
                  className="w-5 h-5 rounded-full object-cover ring-2 ring-indigo-500 mb-0.5"
                />
              ) : (
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : ''}`} />
              )}
              <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
              {isActive && (
                <span className="absolute -bottom-1 w-5 h-0.5 bg-indigo-500 rounded-full" />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};
