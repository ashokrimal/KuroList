/**
 * HomeView - Rich Dashboard & Content Discovery
 * Composed of modular components with high-fidelity skeleton loading:
 * - HeroFeaturedAnime: Cinematic spotlight banner
 * - ContinueTrackingShelf: 1-tap progress steppers
 * - MediaGridSection: Full-width responsive anime & manga grids
 */

import React, { useState } from 'react';
import { Flame } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { HeroFeaturedAnime } from '../components/HeroFeaturedAnime';
import { ContinueTrackingShelf } from '../components/ContinueTrackingShelf';
import { RecommendedAnimeSection } from '../components/RecommendedAnimeSection';
import { MediaGridSection } from '../components/MediaGridSection';
import { HomeSkeleton } from '../components/SkeletonLoader';
import { useRecommendations } from '../hooks/useRecommendations';

export const HomeView: React.FC = () => {
  const {
    mediaItems,
    library,
    currentUser,
    setSelectedMedia,
    openAddToListModal,
    incrementProgress,
    setActiveView
  } = useApp();

  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 240);
    return () => clearTimeout(timer);
  }, []);

  // Recommendations based on current user watchlist (Called unconditionally to respect Rules of Hooks)
  const { recommendations, topGenres, hasWatchlist } = useRecommendations(
    library,
    mediaItems,
    currentUser.id
  );

  if (isLoading) {
    return <HomeSkeleton />;
  }

  // Hero featured spotlight anime
  const heroAnime = mediaItems.find(m => m.id === 'frieren-beyond-journey') || mediaItems[0];

  // Currently watching / reading items in user library
  const continueWatchingItems = library
    .filter(item => item.userId === currentUser.id && (item.status === 'watching' || item.status === 'reading'))
    .map(entry => {
      const media = mediaItems.find(m => m.id === entry.mediaId);
      return { entry, media: media! };
    })
    .filter(pair => Boolean(pair.media));

  // Trending & top picks
  const trendingAnime = mediaItems.filter(m => m.type === 'anime').slice(0, 6);
  const trendingManga = mediaItems.filter(m => m.type === 'manga' || m.type === 'manhwa').slice(0, 6);

  return (
    <div className="space-y-12 pb-16">
      {/* 1. Cinematic Hero Spotlight Component */}
      <HeroFeaturedAnime
        media={heroAnime}
        onOpenDetails={setSelectedMedia}
        onTrackProgress={openAddToListModal}
      />

      {/* 2. Continue Tracking Shelf Component */}
      <ContinueTrackingShelf
        items={continueWatchingItems}
        onOpenDetails={setSelectedMedia}
        onEditDetails={openAddToListModal}
        onIncrementProgress={incrementProgress}
        onViewAll={() => setActiveView('mylist')}
      />

      {/* 3. Recommended for You Component (Watchlist-Based Filtering) */}
      <RecommendedAnimeSection
        recommendations={recommendations}
        topGenres={topGenres}
        hasWatchlist={hasWatchlist}
        onExploreDiscover={() => setActiveView('discover')}
      />

      {/* 4. Full-Width Media Grid Showcase Components */}
      <div className="space-y-10">
        <MediaGridSection
          title="Trending Anime"
          subtitle="Most active series being watched across the community this week"
          icon={<Flame className="w-4 h-4 text-indigo-400" />}
          actionLabel="Browse All"
          onAction={() => setActiveView('discover')}
          items={trendingAnime}
        />

        <MediaGridSection
          title="Popular Manga & Manhwa"
          subtitle="Acclaimed reads and top-ranked serialized chapters"
          actionLabel="View More"
          onAction={() => setActiveView('discover')}
          items={trendingManga}
        />
      </div>
    </div>
  );
};
