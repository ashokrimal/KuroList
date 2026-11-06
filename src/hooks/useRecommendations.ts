import { useMemo } from 'react';
import { MediaItem, LibraryEntry } from '../types';

export interface RecommendedAnimeResult {
  media: MediaItem;
  score: number;
  matchPercent: number;
  matchReason: string;
  matchedGenres: string[];
}

export function useRecommendations(
  library: LibraryEntry[],
  mediaItems: MediaItem[],
  userId: string
) {
  return useMemo(() => {
    const userEntries = library.filter(e => e.userId === userId);
    const watchlistMediaIds = new Set(userEntries.map(e => e.mediaId));

    // Get all media in user's watchlist
    const watchedMedia = userEntries
      .map(entry => {
        const item = mediaItems.find(m => m.id === entry.mediaId);
        return item ? { entry, media: item } : null;
      })
      .filter(Boolean) as { entry: LibraryEntry; media: MediaItem }[];

    // Calculate genre preferences weighted by user ratings and favorites
    const genreWeights: Record<string, number> = {};
    const studioWeights: Record<string, number> = {};

    watchedMedia.forEach(({ entry, media }) => {
      const multiplier = (entry.isFavorite ? 2.0 : 1.0) * (entry.score > 0 ? entry.score / 5 : 1.0);
      
      media.genres?.forEach(genre => {
        genreWeights[genre] = (genreWeights[genre] || 0) + multiplier;
      });

      media.studios?.forEach(studio => {
        studioWeights[studio] = (studioWeights[studio] || 0) + multiplier;
      });
    });

    // Top preferred genres sorted by weight
    const topGenres = Object.entries(genreWeights)
      .sort((a, b) => b[1] - a[1])
      .map(([genre]) => genre)
      .slice(0, 3);

    // Filter candidate anime (must be anime, not in watchlist)
    const candidateAnime = mediaItems.filter(
      item => item.type === 'anime' && !watchlistMediaIds.has(item.id)
    );

    // If candidate list is empty, return empty
    if (candidateAnime.length === 0) {
      return {
        recommendations: [],
        topGenres,
        hasWatchlist: userEntries.length > 0
      };
    }

    // If user has no watchlist, provide community top-rated anime
    if (userEntries.length === 0) {
      const topPicks: RecommendedAnimeResult[] = candidateAnime
        .slice()
        .sort((a, b) => b.score - a.score || a.rank - b.rank)
        .slice(0, 6)
        .map(media => ({
          media,
          score: media.score,
          matchPercent: 95,
          matchReason: 'Acclaimed KuroList Essential',
          matchedGenres: media.genres.slice(0, 2)
        }));

      return {
        recommendations: topPicks,
        topGenres: ['Top Rated', 'Popular'],
        hasWatchlist: false
      };
    }

    // Score candidates based on genre overlap, studio match, and rating
    const scoredCandidates: RecommendedAnimeResult[] = candidateAnime.map(media => {
      let score = 0;
      const matchedGenres: string[] = [];

      // Genre overlap
      media.genres?.forEach(genre => {
        if (genreWeights[genre]) {
          score += genreWeights[genre] * 3;
          matchedGenres.push(genre);
        }
      });

      // Studio match bonus
      media.studios?.forEach(studio => {
        if (studioWeights[studio]) {
          score += studioWeights[studio] * 2.5;
        }
      });

      // Quality rating baseline bonus (MAL score)
      score += (media.score || 7.0) * 0.8;

      // Primary reason
      let matchReason = '';
      if (matchedGenres.length >= 2) {
        matchReason = `Matches your taste in ${matchedGenres[0]} & ${matchedGenres[1]}`;
      } else if (matchedGenres.length === 1) {
        matchReason = `Because you like ${matchedGenres[0]} anime`;
      } else {
        matchReason = 'Highly acclaimed in the community';
      }

      // Calculate approximate match percentage (80% - 99%)
      const matchPercent = Math.min(
        99,
        Math.max(78, Math.round(75 + Math.min(matchedGenres.length * 7, 20) + (media.score / 10) * 4))
      );

      return {
        media,
        score,
        matchPercent,
        matchReason,
        matchedGenres
      };
    });

    // Sort by recommendation score descending
    scoredCandidates.sort((a, b) => b.score - a.score);

    return {
      recommendations: scoredCandidates.slice(0, 6),
      topGenres,
      hasWatchlist: true
    };
  }, [library, mediaItems, userId]);
}
