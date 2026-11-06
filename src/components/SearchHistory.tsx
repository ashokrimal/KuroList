/**
 * SearchHistory - Dedicated Component for Discover View
 * Displays user's recent anime queries persisted via localStorage.
 * Features:
 * - 1-tap query chips with instant search trigger
 * - Individual query deletion with haptic feedback
 * - Clear all history action
 * - Persisted in browser localStorage ('kuro_discover_recent_searches')
 * - Responsive horizontal wrap layout with obsidian aesthetics
 */
import React from 'react';
import { Clock, X, Trash2, ArrowUpRight } from 'lucide-react';
import { triggerHaptic } from '../utils/haptics';

interface SearchHistoryProps {
  recentSearches: string[];
  onSelectQuery: (query: string) => void;
  onRemoveQuery: (query: string) => void;
  onClearAll: () => void;
  className?: string;
}

export const SearchHistory: React.FC<SearchHistoryProps> = ({
  recentSearches,
  onSelectQuery,
  onRemoveQuery,
  onClearAll,
  className = ''
}) => {
  if (!recentSearches || recentSearches.length === 0) {
    return null;
  }

  return (
    <div className={`pt-2.5 border-t border-[#2A2F45]/60 ${className}`}>
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5 text-xs text-slate-300 font-medium">
          <Clock className="w-3.5 h-3.5 text-indigo-400" />
          <span>Recent Anime Searches</span>
          <span className="text-[10px] font-mono text-indigo-300/80 bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-500/20">
            {recentSearches.length}
          </span>
        </div>

        <button
          type="button"
          onClick={() => {
            triggerHaptic('light');
            onClearAll();
          }}
          className="text-[11px] text-slate-400 hover:text-rose-400 flex items-center gap-1 transition-colors cursor-pointer"
          title="Clear all search history"
        >
          <Trash2 className="w-3 h-3" />
          <span>Clear History</span>
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {recentSearches.map(query => (
          <div
            key={query}
            className="group flex items-center bg-[#12141F] hover:bg-[#1C2032] border border-[#2A2F45] hover:border-indigo-500/50 rounded-lg pl-2.5 pr-1.5 py-1 text-xs text-slate-200 transition-all shadow-sm"
          >
            <button
              type="button"
              onClick={() => {
                triggerHaptic('selection');
                onSelectQuery(query);
              }}
              className="flex items-center gap-1.5 text-left font-medium hover:text-indigo-300 transition-colors cursor-pointer"
              title={`Search for "${query}"`}
            >
              <span>{query}</span>
              <ArrowUpRight className="w-3 h-3 text-slate-500 group-hover:text-indigo-400 transition-colors" />
            </button>

            <button
              type="button"
              onClick={e => {
                e.stopPropagation();
                triggerHaptic('light');
                onRemoveQuery(query);
              }}
              className="ml-1.5 p-0.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/15 rounded transition-colors cursor-pointer"
              title={`Remove "${query}"`}
              aria-label={`Remove ${query} from search history`}
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
