import React from 'react';
import { Sparkles, ArrowRight, Compass } from 'lucide-react';
import { RecommendedAnimeResult } from '../hooks/useRecommendations';
import { AnimeCard } from './AnimeCard';

interface RecommendedAnimeSectionProps {
  recommendations: RecommendedAnimeResult[];
  topGenres: string[];
  hasWatchlist: boolean;
  onExploreDiscover?: () => void;
}

export const RecommendedAnimeSection: React.FC<RecommendedAnimeSectionProps> = ({
  recommendations,
  topGenres,
  hasWatchlist,
  onExploreDiscover
}) => {
  if (recommendations.length === 0) return null;

  const subtitle = hasWatchlist && topGenres.length > 0
    ? `Curated from your watchlist preferences in ${topGenres.join(', ')}`
    : 'Top-rated acclaimed anime picked to kickstart your watchlist';

  return (
    <section aria-label="Recommended for You" className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Sparkles className="w-4 h-4 text-indigo-400" />
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Recommended for You
            </h2>
            {topGenres.length > 0 && hasWatchlist && (
              <span className="text-[11px] font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20 hidden sm:inline-block">
                {topGenres[0]}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {subtitle}
          </p>
        </div>

        {onExploreDiscover && (
          <button
            type="button"
            onClick={onExploreDiscover}
            className="self-start sm:self-auto text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Discover more</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Grid of Recommended Anime Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {recommendations.map(rec => (
          <div key={rec.media.id} className="flex flex-col">
            <AnimeCard media={rec.media} />
            {rec.matchReason && (
              <div className="mt-1 px-1 text-[10px] text-slate-400 truncate flex items-center gap-1">
                <span className="text-indigo-400 font-semibold font-mono">{rec.matchPercent}%</span>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span className="truncate">{rec.matchReason}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};
