import React from 'react';
import { Plus, ChevronRight } from 'lucide-react';
import { LibraryEntry, MediaItem } from '../types';

interface ContinueTrackingShelfProps {
  items: Array<{ entry: LibraryEntry; media: MediaItem }>;
  onOpenDetails: (media: MediaItem) => void;
  onEditDetails: (media: MediaItem) => void;
  onIncrementProgress: (mediaId: string) => void;
  onViewAll: () => void;
}

export const ContinueTrackingShelf: React.FC<ContinueTrackingShelfProps> = ({
  items,
  onOpenDetails,
  onEditDetails,
  onIncrementProgress,
  onViewAll
}) => {
  if (items.length === 0) return null;

  return (
    <section aria-label="Continue Tracking Shelf">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight">Continue Tracking</h2>
          <p className="text-xs text-slate-400">Quickly log your latest episodes and chapters</p>
        </div>
        <button
          type="button"
          onClick={onViewAll}
          className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 cursor-pointer"
        >
          Full Library <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map(({ entry, media }) => {
          if (!media) return null;
          const isAnime = media.type === 'anime';
          const progressUnit = isAnime ? 'Ep' : 'Ch';

          return (
            <div
              key={entry.id}
              className="bg-[#181A26] border border-[#2A2F45] rounded-xl p-3.5 flex items-center gap-3.5 hover:border-indigo-500/50 transition-all shadow-md group"
            >
              <img
                src={media.coverImage}
                alt={media.title}
                onError={e => {
                  (e.currentTarget as HTMLImageElement).src = '/src/assets/images/anime_card_nebula_1793517807647.jpg';
                }}
                onClick={() => onOpenDetails(media)}
                className="w-14 h-20 object-cover rounded-lg shrink-0 cursor-pointer group-hover:scale-105 transition-transform bg-slate-900"
              />

              <div className="flex-1 min-w-0">
                <h4
                  onClick={() => onOpenDetails(media)}
                  className="text-xs font-bold text-white truncate cursor-pointer hover:text-indigo-400 transition-colors"
                >
                  {media.title}
                </h4>
                <div className="text-[11px] text-slate-400 mt-0.5 font-mono">
                  {progressUnit} {entry.progress} of {entry.totalProgress || '?'}
                </div>

                {/* Progress Bar & Percentage */}
                {(() => {
                  const total = (entry.totalProgress || 0) > 0 ? entry.totalProgress : 0;
                  const pct = total > 0 ? Math.min(100, Math.max(0, Math.round((entry.progress / total) * 100))) : Math.min(90, entry.progress * 8);
                  return (
                    <div className="mt-2 space-y-1">
                      <div className="w-full bg-[#131520] h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-indigo-500 to-violet-500 h-full rounded-full transition-all duration-300"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono">
                        <span>{pct}% completed</span>
                        {total > 0 && <span>{Math.max(0, total - entry.progress)} remaining</span>}
                      </div>
                    </div>
                  );
                })()}

                {/* Actions */}
                <div className="mt-2.5 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => onEditDetails(media)}
                    className="text-[10px] text-slate-400 hover:text-white cursor-pointer"
                  >
                    Edit Details
                  </button>
                  <button
                    type="button"
                    onClick={() => onIncrementProgress(media.id)}
                    className="px-2.5 py-1 bg-indigo-600/20 hover:bg-indigo-600 border border-indigo-500/30 text-indigo-300 hover:text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                    title={`Log +1 ${isAnime ? 'Episode' : 'Chapter'}`}
                  >
                    <Plus className="w-3 h-3" />
                    +1 {progressUnit}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
