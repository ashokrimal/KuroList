import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'kuro_discover_recent_searches';
const MAX_HISTORY_ITEMS = 10;

// Default initial suggestions for popular searches per MAL NextGen brief
export const POPULAR_SEARCH_SUGGESTIONS = [
  'Solo Leveling',
  'Frieren: Beyond Journey\'s End',
  'Attack on Titan',
  'Jujutsu Kaisen',
  'Chainsaw Man',
  'One Piece',
  'Demon Slayer',
  'Vinland Saga'
];

export function useSearchHistory() {
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed.slice(0, MAX_HISTORY_ITEMS);
      }
    } catch (e) {
      console.warn('Failed to parse search history', e);
    }
    // Provide a sensible starting history if fresh
    return ['Solo Leveling', 'Frieren', 'Jujutsu Kaisen'];
  });

  const saveToStorage = useCallback((items: string[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn('Failed to save search history', e);
    }
  }, []);

  const addSearch = useCallback((query: string) => {
    const trimmed = query.trim();
    if (!trimmed || trimmed.length < 2) return;

    setRecentSearches(prev => {
      // Remove existing case-insensitively, add to top
      const filtered = prev.filter(item => item.toLowerCase() !== trimmed.toLowerCase());
      const updated = [trimmed, ...filtered].slice(0, MAX_HISTORY_ITEMS);
      saveToStorage(updated);
      return updated;
    });
  }, [saveToStorage]);

  const removeSearch = useCallback((queryToRemove: string) => {
    setRecentSearches(prev => {
      const updated = prev.filter(item => item.toLowerCase() !== queryToRemove.toLowerCase());
      saveToStorage(updated);
      return updated;
    });
  }, [saveToStorage]);

  const clearAllSearches = useCallback(() => {
    setRecentSearches([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.warn('Failed to clear search history', e);
    }
  }, []);

  return {
    recentSearches,
    addSearch,
    removeSearch,
    clearAllSearches
  };
}
