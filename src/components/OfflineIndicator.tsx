import React from 'react';
import { WifiOff, Wifi, CheckCircle2, CloudLightning } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const { isOnline, wasOffline } = useOnlineStatus();

  if (isOnline && !wasOffline) {
    return null;
  }

  return (
    <aside
      aria-label="Network status banner"
      className="w-full z-40 transition-all duration-300"
    >
      {!isOnline ? (
        <div className="bg-[#141622] border-b border-amber-500/30 px-4 py-2.5 text-xs text-amber-200 shadow-lg">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
              <div className="flex items-center gap-1.5 font-medium">
                <WifiOff className="w-3.5 h-3.5 text-amber-400" />
                <span>Offline Mode</span>
              </div>
              <span className="text-amber-300/80 hidden sm:inline">•</span>
              <span className="text-amber-200/90 hidden sm:inline">
                Viewing local watchlist & Service Worker cached anime covers. Full progress tracking enabled.
              </span>
            </div>

            <div className="flex items-center gap-2 text-[11px] font-mono text-amber-300/70 ml-auto">
              <CloudLightning className="w-3 h-3 text-amber-400" />
              <span>Offline Cache Active</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-[#121A20] border-b border-emerald-500/30 px-4 py-2 text-xs text-emerald-200 shadow-md animate-in fade-in slide-in-from-top-1 duration-300">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Wifi className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-medium">Connection Restored</span>
              <span className="text-emerald-300/70 hidden sm:inline">• Synced local changes with Firestore</span>
            </div>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          </div>
        </div>
      )}
    </aside>
  );
};
