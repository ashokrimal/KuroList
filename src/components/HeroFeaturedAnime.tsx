import React from 'react';
import { Play, Bookmark, Sparkles, Flame } from 'lucide-react';
import { MediaItem } from '../types';

interface HeroFeaturedAnimeProps {
  media: MediaItem;
  onOpenDetails: (media: MediaItem) => void;
  onTrackProgress: (media: MediaItem) => void;
  onOpenPassport: () => void;
}

export const HeroFeaturedAnime: React.FC<HeroFeaturedAnimeProps> = ({
  media,
  onOpenDetails,
  onTrackProgress,
  onOpenPassport
}) => {
  return (
    <section aria-label="Featured Anime Spotlight" className="relative -mx-4 sm:-mx-6 lg:-mx-8 -mt-6">
      <div className="relative h-[440px] sm:h-[500px] w-full overflow-hidden bg-slate-950">
        <img
          src={media.bannerImage || '/src/assets/images/frieren_fantasy_banner_1793517808620.jpg'}
          alt={media.title}
          className="w-full h-full object-cover object-center brightness-75 scale-100 hover:scale-105 transition-transform duration-1000"
        />
        {/* Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F1016] via-[#0F1016]/40 to-black/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0F1016] via-[#0F1016]/60 to-transparent" />

        {/* Hero Content */}
        <div className="absolute bottom-10 left-4 sm:left-8 lg:left-12 max-w-2xl z-10">
          {/* Unboxed Metadata Header */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-indigo-300 font-semibold mb-2">
            <span className="flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              #1 Rated Series of the Decade
            </span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span>{media.studios?.[0] || 'Studio'}</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-amber-300 font-mono">★ {media.score} / 10</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight text-balance">
            {media.title}
          </h1>

          <p className="mt-3 text-xs sm:text-sm text-slate-300 line-clamp-3 leading-relaxed max-w-xl">
            {media.synopsis}
          </p>

          {/* Action CTAs */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => onOpenDetails(media)}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all hover:-translate-y-0.5 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white text-white" />
              View Details
            </button>

            <button
              type="button"
              onClick={() => onTrackProgress(media)}
              className="px-4 py-2.5 bg-[#181A26]/90 hover:bg-[#1F2335] border border-[#2A2F45] text-white rounded-xl text-xs font-medium flex items-center gap-2 transition-colors backdrop-blur-md cursor-pointer"
            >
              <Bookmark className="w-4 h-4 text-indigo-400" />
              Track Progress
            </button>

            <button
              type="button"
              onClick={onOpenPassport}
              className="px-4 py-2.5 bg-gradient-to-r from-violet-600/20 to-indigo-600/20 hover:from-violet-600/30 hover:to-indigo-600/30 border border-indigo-500/30 text-indigo-300 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              My Anime Passport
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
