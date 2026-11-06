/**
 * Skeleton Loader Components
 * Production-grade dark mode shimmer skeletons for all components and views
 * Zero Cumulative Layout Shift (CLS = 0) with matching spatial dimensions
 */

import React from 'react';

export const ShimmerBox: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`animate-pulse bg-[#1F2335]/70 rounded-xl ${className}`} />
);

/**
 * Single Anime Card Skeleton
 */
export const AnimeCardSkeleton: React.FC = () => (
  <div className="bg-[#181A26] rounded-2xl border border-[#2A2F45]/60 overflow-hidden flex flex-col p-3.5 space-y-3">
    {/* Poster placeholder */}
    <div className="aspect-[3/4] w-full rounded-xl bg-[#1F2335]/80 animate-pulse relative overflow-hidden">
      <div className="absolute top-2 left-2 w-12 h-5 rounded-md bg-[#2A2F45]/60" />
      <div className="absolute top-2 right-2 w-7 h-7 rounded-lg bg-[#2A2F45]/60" />
    </div>

    {/* Metadata & Title lines */}
    <div className="space-y-2 pt-1">
      <div className="w-1/2 h-3 rounded bg-[#1F2335]/70 animate-pulse" />
      <div className="w-4/5 h-4 rounded bg-[#1F2335] animate-pulse" />
      <div className="w-2/3 h-3 rounded bg-[#1F2335]/50 animate-pulse" />
    </div>

    {/* Progress bar placeholder */}
    <div className="pt-2 border-t border-[#2A2F45]/40 space-y-1.5">
      <div className="flex justify-between">
        <div className="w-12 h-2.5 rounded bg-[#1F2335]/60 animate-pulse" />
        <div className="w-10 h-2.5 rounded bg-[#1F2335]/60 animate-pulse" />
      </div>
      <div className="w-full h-1.5 rounded-full bg-[#1F2335]/50 animate-pulse" />
    </div>
  </div>
);

/**
 * Hero Banner Skeleton
 */
export const HeroBannerSkeleton: React.FC = () => (
  <div className="relative -mx-4 sm:-mx-6 lg:-mx-8 -mt-6 h-[440px] sm:h-[500px] bg-[#181A26] border-b border-[#2A2F45] overflow-hidden flex flex-col justify-end p-6 sm:p-12 space-y-4">
    <div className="w-40 h-4 rounded bg-[#1F2335] animate-pulse" />
    <div className="w-3/4 sm:w-1/2 h-10 rounded-xl bg-[#1F2335] animate-pulse" />
    <div className="w-full sm:w-2/3 h-14 rounded-lg bg-[#1F2335]/60 animate-pulse" />
    <div className="flex gap-3 pt-2">
      <div className="w-32 h-10 rounded-xl bg-[#1F2335] animate-pulse" />
      <div className="w-32 h-10 rounded-xl bg-[#1F2335]/70 animate-pulse" />
      <div className="w-40 h-10 rounded-xl bg-[#1F2335]/50 animate-pulse hidden sm:block" />
    </div>
  </div>
);

/**
 * Continue Tracking Shelf Skeleton
 */
export const ContinueTrackingSkeleton: React.FC = () => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <div className="w-36 h-5 rounded bg-[#1F2335] animate-pulse" />
      <div className="w-20 h-4 rounded bg-[#1F2335]/60 animate-pulse" />
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {[1, 2, 3].map(i => (
        <div key={i} className="bg-[#181A26] border border-[#2A2F45] rounded-xl p-3.5 flex gap-3.5">
          <div className="w-14 h-20 rounded-lg bg-[#1F2335] animate-pulse shrink-0" />
          <div className="flex-1 space-y-2 py-1">
            <div className="w-3/4 h-3.5 rounded bg-[#1F2335] animate-pulse" />
            <div className="w-1/2 h-2.5 rounded bg-[#1F2335]/60 animate-pulse" />
            <div className="w-full h-1.5 rounded-full bg-[#1F2335]/40 animate-pulse mt-2" />
            <div className="flex justify-between pt-1">
              <div className="w-12 h-3 rounded bg-[#1F2335]/50 animate-pulse" />
              <div className="w-14 h-5 rounded bg-[#1F2335] animate-pulse" />
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

/**
 * Media Grid Section Skeleton
 */
export const MediaGridSkeleton: React.FC<{ count?: number; columns?: string }> = ({
  count = 6,
  columns = 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6'
}) => (
  <div className="space-y-4">
    <div className="flex justify-between">
      <div className="w-40 h-5 rounded bg-[#1F2335] animate-pulse" />
      <div className="w-20 h-4 rounded bg-[#1F2335]/60 animate-pulse" />
    </div>
    <div className={`grid ${columns} gap-4`}>
      {Array.from({ length: count }).map((_, i) => (
        <AnimeCardSkeleton key={i} />
      ))}
    </div>
  </div>
);

/**
 * Streak Card Skeleton
 */
export const StreakCardSkeleton: React.FC = () => (
  <div className="bg-[#181A26] border border-[#2A2F45] rounded-2xl p-5 space-y-4">
    <div className="flex items-center gap-3">
      <div className="w-11 h-11 rounded-2xl bg-[#1F2335] animate-pulse" />
      <div className="space-y-1.5 flex-1">
        <div className="w-32 h-5 rounded bg-[#1F2335] animate-pulse" />
        <div className="w-48 h-3.5 rounded bg-[#1F2335]/50 animate-pulse" />
      </div>
    </div>
    <div className="w-full h-2.5 rounded-full bg-[#131520] animate-pulse" />
    <div className="grid grid-cols-7 gap-2 pt-2 border-t border-[#2A2F45]/60">
      {[1, 2, 3, 4, 5, 6, 7].map(i => (
        <div key={i} className="h-10 rounded-xl bg-[#131520] animate-pulse" />
      ))}
    </div>
  </div>
);

/**
 * Gamification Banner Skeleton
 */
export const GamificationBannerSkeleton: React.FC = () => (
  <div className="mt-6 p-4 bg-[#131520] border border-[#2A2F45] rounded-2xl space-y-4">
    <div className="flex justify-between">
      <div className="w-48 h-4 rounded bg-[#1F2335] animate-pulse" />
      <div className="w-28 h-4 rounded bg-[#1F2335]/60 animate-pulse" />
    </div>
    <div className="w-full h-2.5 rounded-full bg-[#181A26] animate-pulse" />
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-[#2A2F45]/60">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="h-12 rounded-lg bg-[#181A26] animate-pulse" />
      ))}
    </div>
  </div>
);

/**
 * Activity Stream Skeleton
 */
export const ActivityStreamSkeleton: React.FC = () => (
  <div className="max-w-3xl mx-auto space-y-4">
    <div className="h-12 rounded-xl bg-[#161824] animate-pulse" />
    {[1, 2, 3].map(i => (
      <div key={i} className="bg-[#181A26] border border-[#2A2F45] rounded-2xl p-5 space-y-3.5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#1F2335] animate-pulse" />
          <div className="space-y-1.5 flex-1">
            <div className="w-32 h-3.5 rounded bg-[#1F2335] animate-pulse" />
            <div className="w-24 h-2.5 rounded bg-[#1F2335]/50 animate-pulse" />
          </div>
        </div>
        <div className="h-20 rounded-xl bg-[#12141F] animate-pulse" />
      </div>
    ))}
  </div>
);

/**
 * Discussion Thread Skeleton
 */
export const DiscussionThreadSkeleton: React.FC = () => (
  <div className="bg-[#181A26] border border-[#2A2F45] rounded-2xl p-6 space-y-6">
    <div className="space-y-2 border-b border-[#2A2F45] pb-4">
      <div className="w-32 h-3.5 rounded bg-[#1F2335]/60 animate-pulse" />
      <div className="w-3/4 h-6 rounded bg-[#1F2335] animate-pulse" />
    </div>
    <div className="space-y-2">
      <div className="w-full h-4 rounded bg-[#1F2335]/50 animate-pulse" />
      <div className="w-5/6 h-4 rounded bg-[#1F2335]/50 animate-pulse" />
      <div className="w-2/3 h-4 rounded bg-[#1F2335]/50 animate-pulse" />
    </div>
    <div className="h-24 rounded-xl bg-[#131520] animate-pulse" />
  </div>
);

/**
 * Composite View Skeletons
 */
export const HomeSkeleton: React.FC = () => (
  <div className="space-y-12 pb-16 animate-in fade-in duration-200">
    <HeroBannerSkeleton />
    <ContinueTrackingSkeleton />
    <MediaGridSkeleton count={6} />
    <MediaGridSkeleton count={6} />
    <MediaGridSkeleton count={6} />
  </div>
);

/**
 * Search History Skeleton
 */
export const SearchHistorySkeleton: React.FC = () => (
  <div className="pt-2.5 border-t border-[#2A2F45]/60 space-y-2">
    <div className="flex items-center justify-between">
      <div className="w-36 h-3 rounded bg-[#1F2335] animate-pulse" />
      <div className="w-16 h-2.5 rounded bg-[#1F2335]/50 animate-pulse" />
    </div>
    <div className="flex flex-wrap gap-2">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="w-24 h-7 rounded-lg bg-[#12141F] animate-pulse" />
      ))}
    </div>
  </div>
);

export const DiscoverSkeleton: React.FC = () => (
  <div className="space-y-8 pb-16 animate-in fade-in duration-200">
    <div className="space-y-1.5">
      <div className="w-48 h-6 rounded-lg bg-[#1F2335] animate-pulse" />
      <div className="w-72 h-3.5 rounded bg-[#1F2335]/50 animate-pulse" />
    </div>
    <div className="bg-[#181A26] border border-[#2A2F45] rounded-2xl p-4 space-y-4">
      <div className="h-10 rounded-xl bg-[#12141F] animate-pulse" />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-9 rounded-lg bg-[#12141F] animate-pulse" />
        ))}
      </div>
      <SearchHistorySkeleton />
    </div>
    <MediaGridSkeleton count={12} columns="grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6" />
  </div>
);

export const MyListSkeleton: React.FC = () => (
  <div className="space-y-8 pb-16 animate-in fade-in duration-200">
    <div className="bg-[#181A26] border border-[#2A2F45] rounded-2xl p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="space-y-1.5">
          <div className="w-48 h-6 rounded bg-[#1F2335] animate-pulse" />
          <div className="w-64 h-3.5 rounded bg-[#1F2335]/50 animate-pulse" />
        </div>
        <div className="w-48 h-10 rounded-xl bg-[#131520] animate-pulse" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-[#2A2F45]/60">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-10 rounded-lg bg-[#131520] animate-pulse" />
        ))}
      </div>
    </div>
    <div className="bg-[#181A26] border border-[#2A2F45] rounded-2xl p-4 space-y-3">
      {[1, 2, 3, 4, 5, 6].map(i => (
        <div key={i} className="h-14 rounded-xl bg-[#131520] animate-pulse" />
      ))}
    </div>
  </div>
);

export const ProfileSkeleton: React.FC = () => (
  <div className="space-y-8 pb-16 animate-in fade-in duration-200">
    {/* Profile Hero Banner & Avatar */}
    <div className="relative bg-[#161824] border border-[#262A3E] rounded-3xl overflow-hidden shadow-2xl">
      <div className="h-48 sm:h-64 bg-[#1F2335] animate-pulse" />
      <div className="px-6 pb-6 -mt-16 sm:-mt-20 relative z-10">
        <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5">
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-[#12141F] animate-pulse ring-4 ring-[#161824]" />
            <div className="space-y-2 text-center sm:text-left">
              <div className="w-48 h-6 rounded-lg bg-[#1F2335] animate-pulse" />
              <div className="w-32 h-3.5 rounded bg-[#1F2335]/60 animate-pulse" />
              <div className="w-40 h-3 rounded bg-[#1F2335]/40 animate-pulse" />
            </div>
          </div>
          <div className="flex gap-2.5">
            <div className="w-36 h-10 rounded-xl bg-[#1F2335] animate-pulse" />
            <div className="w-28 h-10 rounded-xl bg-[#1F2335]/70 animate-pulse" />
          </div>
        </div>
        <div className="w-full sm:w-2/3 h-8 rounded-lg bg-[#1F2335]/40 animate-pulse mt-5" />
        <div className="mt-5 h-20 rounded-2xl bg-[#12141F] animate-pulse" />
      </div>
      <div className="flex gap-4 px-6 py-3.5 border-t border-[#262A3E] bg-[#12141F]">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="w-20 h-5 rounded bg-[#1F2335]/60 animate-pulse" />
        ))}
      </div>
    </div>

    {/* Streak Card & Stats Bento Split */}
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
      <div className="lg:col-span-5 h-72 rounded-2xl bg-[#161824] border border-[#262A3E] animate-pulse" />
      <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-3.5">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="h-28 rounded-2xl bg-[#161824] border border-[#262A3E] animate-pulse" />
        ))}
      </div>
    </div>

    {/* Shelf Skeleton */}
    <MediaGridSkeleton count={6} columns="grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6" />
  </div>
);

export const CommunitySkeleton: React.FC = () => (
  <div className="space-y-8 pb-16 animate-in fade-in duration-200">
    <div className="w-48 h-7 rounded-lg bg-[#1F2335] animate-pulse" />
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="space-y-3">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-20 rounded-xl bg-[#181A26] animate-pulse" />
        ))}
      </div>
      <div className="lg:col-span-2">
        <DiscussionThreadSkeleton />
      </div>
    </div>
  </div>
);

/**
 * Global Activity Feed Skeleton
 */
export const GlobalActivitySkeleton: React.FC = () => (
  <div className="max-w-4xl mx-auto space-y-4 animate-in fade-in duration-200">
    {/* Activity Filter / Search Header Skeleton */}
    <div className="bg-[#181A26] border border-[#2A2F45] rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <div className="h-9 w-24 rounded-xl bg-[#1F2335] animate-pulse" />
        <div className="h-9 w-24 rounded-xl bg-[#1F2335]/70 animate-pulse" />
        <div className="h-9 w-28 rounded-xl bg-[#1F2335]/70 animate-pulse" />
      </div>
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <div className="h-9 w-full sm:w-56 rounded-xl bg-[#131520] animate-pulse" />
        <div className="h-9 w-9 rounded-xl bg-[#131520] animate-pulse shrink-0" />
      </div>
    </div>

    {/* Activity Feed Items Skeleton */}
    {[1, 2, 3, 4].map(i => (
      <div
        key={i}
        className="bg-[#181A26] border border-[#2A2F45] rounded-2xl p-5 space-y-4 shadow-lg"
      >
        {/* User header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#1F2335] animate-pulse ring-2 ring-indigo-500/20" />
            <div className="space-y-1.5">
              <div className="w-32 h-4 rounded bg-[#1F2335] animate-pulse" />
              <div className="w-24 h-2.5 rounded bg-[#1F2335]/50 animate-pulse" />
            </div>
          </div>
          <div className="w-24 h-6 rounded-lg bg-[#1F2335]/60 animate-pulse" />
        </div>

        {/* Media info card */}
        <div className="flex items-start gap-4 p-3.5 bg-[#12141F] rounded-xl border border-[#2A2F45]/60">
          <div className="w-14 h-20 rounded-lg bg-[#1F2335] animate-pulse shrink-0" />
          <div className="flex-1 space-y-2 py-1">
            <div className="w-3/4 h-4 rounded bg-[#1F2335] animate-pulse" />
            <div className="w-1/2 h-3 rounded bg-[#1F2335]/60 animate-pulse" />
            <div className="w-full h-3 rounded bg-[#1F2335]/40 animate-pulse" />
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-between pt-2 border-t border-[#2A2F45]/40">
          <div className="flex gap-4">
            <div className="w-16 h-4 rounded bg-[#1F2335]/60 animate-pulse" />
            <div className="w-20 h-4 rounded bg-[#1F2335]/60 animate-pulse" />
          </div>
          <div className="w-24 h-4 rounded bg-[#1F2335]/40 animate-pulse" />
        </div>
      </div>
    ))}
  </div>
);

/**
 * Seasonal Airing Calendar Skeleton
 */
export const SeasonalSkeleton: React.FC = () => (
  <div className="space-y-8 pb-16 animate-in fade-in duration-200">
    <div className="flex flex-col sm:flex-row justify-between gap-4">
      <div className="space-y-2">
        <div className="w-56 h-7 rounded-lg bg-[#1F2335] animate-pulse" />
        <div className="w-72 h-3.5 rounded bg-[#1F2335]/50 animate-pulse" />
      </div>
      <div className="w-36 h-8 rounded-xl bg-[#181A26] animate-pulse" />
    </div>

    {/* Day pills bar skeleton */}
    <div className="flex gap-2 p-1.5 bg-[#181A26] border border-[#2A2F45] rounded-2xl overflow-x-hidden">
      {[1, 2, 3, 4, 5, 6, 7].map(i => (
        <div key={i} className="flex-1 min-w-[90px] h-12 rounded-xl bg-[#131520] animate-pulse" />
      ))}
    </div>

    {/* Schedule Cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {[1, 2, 3, 4, 5, 6].map(i => (
        <div key={i} className="bg-[#181A26] border border-[#2A2F45] rounded-2xl p-4 flex gap-4">
          <div className="w-20 h-28 rounded-xl bg-[#1F2335] animate-pulse shrink-0" />
          <div className="flex-1 space-y-2.5 py-1">
            <div className="w-3/4 h-4 rounded bg-[#1F2335] animate-pulse" />
            <div className="w-1/2 h-3 rounded bg-[#1F2335]/60 animate-pulse" />
            <div className="w-full h-8 rounded-lg bg-[#131520] animate-pulse mt-2" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

/**
 * Custom Collections Skeleton
 */
export const CollectionsSkeleton: React.FC = () => (
  <div className="space-y-8 pb-16 animate-in fade-in duration-200">
    <div className="flex flex-col sm:flex-row justify-between gap-4">
      <div className="space-y-2">
        <div className="w-64 h-7 rounded-lg bg-[#1F2335] animate-pulse" />
        <div className="w-80 h-3.5 rounded bg-[#1F2335]/50 animate-pulse" />
      </div>
      <div className="w-36 h-9 rounded-xl bg-[#181A26] animate-pulse" />
    </div>

    {/* Filter header */}
    <div className="bg-[#181A26] border border-[#2A2F45] rounded-2xl p-4 flex justify-between">
      <div className="flex gap-2">
        <div className="w-28 h-8 rounded-xl bg-[#1F2335] animate-pulse" />
        <div className="w-28 h-8 rounded-xl bg-[#1F2335]/60 animate-pulse" />
      </div>
      <div className="w-48 h-8 rounded-xl bg-[#131520] animate-pulse" />
    </div>

    {/* Collection grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map(i => (
        <div key={i} className="bg-[#181A26] border border-[#2A2F45] rounded-2xl p-5 space-y-4">
          <div className="h-40 rounded-xl bg-[#1F2335] animate-pulse" />
          <div className="w-3/4 h-5 rounded bg-[#1F2335] animate-pulse" />
          <div className="w-full h-3 rounded bg-[#1F2335]/50 animate-pulse" />
          <div className="flex justify-between pt-2 border-t border-[#2A2F45]/60">
            <div className="w-20 h-4 rounded bg-[#1F2335]/60 animate-pulse" />
            <div className="w-16 h-4 rounded bg-[#1F2335]/60 animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  </div>
);


