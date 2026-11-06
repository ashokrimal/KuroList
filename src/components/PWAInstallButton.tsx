import React from 'react';
import { Download, Check } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  className?: string;
  showIconOnly?: boolean;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  className = '',
  showIconOnly = false
}) => {
  const { isInstallable, isInstalled, installApp } = usePWAInstall();

  if (isInstalled) {
    return null;
  }

  if (!isInstallable) {
    return null;
  }

  return (
    <button
      onClick={() => installApp()}
      title="Install KuroList App for offline access"
      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white shadow-md shadow-indigo-600/20 active:scale-95 transition-all border border-indigo-400/30 ${className}`}
    >
      <Download className="w-3.5 h-3.5" />
      {!showIconOnly && <span>Install App</span>}
    </button>
  );
};
