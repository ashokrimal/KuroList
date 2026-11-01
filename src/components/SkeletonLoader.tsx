/**
 * Skeleton Loader Component
 * Polished dark-mode shimmer skeletons for Home, Discover, and MyList views
 */

import React from 'react';

export const ShimmerBox: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`animate-pulse bg-[#1F2335]/70 rounded-xl ${className}`} />
);

export const AnimeCardSkeleton: React.FC = () => (
  <div className="bg-[#181A26] rounded-xl border border-[#2A2F45]/60 overflow-hidden flex flex-col p-3.5 space-y-3">
    {/* Poster placeholder */}
    <div className="aspect-[3/4] w-full rounded-lg bg-[#1F2335]/80 animate-pulse relative overflow-hidden">
      <div className="absolute top-2 left-2 w-12 h-5 rounded-md bg-[#2A2F45]/60" />
      <div className="absolute top-2 right-2 w-6 h-6 rounded-md bg-[#2A2F45]/60" />
    </div>

    {/* Metadata and Title lines */}
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
 * Home View Skeleton Screen
 */
export const HomeSkeleton: React.FC = () => {
  return (
    <div className="space-y-12 pb-16 animate-in fade-in duration-200">
      {/* 1. Hero Spotlight Banner Skeleton */}
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

      {/* 2. Continue Watching Shelf Skeleton */}
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

      {/* 3. Trending & Social Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between">
            <div className="w-40 h-5 rounded bg-[#1F2335] animate-pulse" />
            <div className="w-20 h-4 rounded bg-[#1F2335]/60 animate-pulse" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <AnimeCardSkeleton key={i} />
            ))}
          </div>
        </div>

        {/* Live Social Feed Column Skeleton */}
        <div className="space-y-4">
          <div className="w-32 h-5 rounded bg-[#1F2335] animate-pulse" />
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-[#181A26] border border-[#2A2F45] rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#1F2335] animate-pulse shrink-0" />
                <div className="space-y-1.5 flex-1">
                  <div className="w-24 h-3 rounded bg-[#1F2335] animate-pulse" />
                  <div className="w-32 h-2.5 rounded bg-[#1F2335]/50 animate-pulse" />
                </div>
              </div>
              <div className="h-16 rounded-lg bg-[#131520] animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/**
 * Discover View Skeleton Screen
 */
export const DiscoverSkeleton: React.FC = () => {
  return (
    <div className="space-y-8 pb-16 animate-in fade-in duration-200">
      {/* Title */}
      <div className="space-y-1.5">
        <div className="w-48 h-6 rounded-lg bg-[#1F2335] animate-pulse" />
        <div className="w-72 h-3.5 rounded bg-[#1F2335]/50 animate-pulse" />
      </div>

      {/* Search & Filter Control Panel Skeleton */}
      <div className="bg-[#181A26] border border-[#2A2F45] rounded-2xl p-4 space-y-4 shadow-lg">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 h-10 rounded-xl bg-[#131520] animate-pulse" />
          <div className="w-36 h-10 rounded-xl bg-[#1F2335] animate-pulse shrink-0" />
        </div>

        <div className="flex gap-2 pt-2 border-t border-[#2A2F45]/60">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="w-20 h-7 rounded-lg bg-[#131520] animate-pulse" />
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-9 rounded-lg bg-[#131520] animate-pulse" />
          ))}
        </div>
      </div>

      {/* Results Count bar */}
      <div className="flex justify-between">
        <div className="w-32 h-4 rounded bg-[#1F2335]/60 animate-pulse" />
      </div>

      {/* Grid of Card Skeletons */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => (
          <AnimeCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
};

/**
 * MyList View Skeleton Screen
 */
export const MyListSkeleton: React.FC = () => {
  return (
    <div className="space-y-8 pb-16 animate-in fade-in duration-200">
      {/* Top Banner & KPI Strip Skeleton */}
      <div className="bg-[#181A26] border border-[#2A2F45] rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="space-y-1.5">
            <div className="w-48 h-6 rounded bg-[#1F2335] animate-pulse" />
            <div className="w-64 h-3.5 rounded bg-[#1F2335]/50 animate-pulse" />
          </div>
          <div className="w-48 h-10 rounded-xl bg-[#131520] animate-pulse" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-[#2A2F45]/60 text-center">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="space-y-1.5 flex flex-col items-center">
              <div className="w-20 h-3 rounded bg-[#1F2335]/50 animate-pulse" />
              <div className="w-12 h-5 rounded bg-[#1F2335] animate-pulse" />
            </div>
          ))}
        </div>
      </div>

      {/* Filter Tabs & Search Controls Skeleton */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="w-20 h-8 rounded-lg bg-[#181A26] animate-pulse" />
          ))}
        </div>
        <div className="flex gap-2">
          <div className="w-36 h-8 rounded-lg bg-[#181A26] animate-pulse" />
          <div className="w-28 h-8 rounded-lg bg-[#181A26] animate-pulse" />
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="bg-[#181A26] border border-[#2A2F45] rounded-2xl overflow-hidden p-4 space-y-3">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="flex items-center justify-between py-2 border-b border-[#2A2F45]/40 gap-4">
            <div className="w-4 h-4 rounded bg-[#1F2335] animate-pulse shrink-0" />
            <div className="w-10 h-14 rounded bg-[#1F2335] animate-pulse shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="w-48 h-3.5 rounded bg-[#1F2335] animate-pulse" />
              <div className="w-28 h-2.5 rounded bg-[#1F2335]/50 animate-pulse" />
            </div>
            <div className="w-16 h-4 rounded bg-[#1F2335] animate-pulse hidden sm:block" />
            <div className="w-20 h-4 rounded bg-[#1F2335] animate-pulse" />
            <div className="w-16 h-6 rounded bg-[#1F2335] animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
};
