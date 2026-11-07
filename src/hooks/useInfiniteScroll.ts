/**
 * useInfiniteScroll Hook
 * Uses IntersectionObserver to trigger automated data fetching / DOM slicing
 * when the user scrolls near the bottom of a container.
 */

import { useEffect, useRef, useCallback } from 'react';

interface UseInfiniteScrollOptions {
  hasMore: boolean;
  isLoading: boolean;
  onLoadMore: () => void | Promise<void>;
  rootMargin?: string;
  threshold?: number | number[];
  disabled?: boolean;
}

export function useInfiniteScroll({
  hasMore,
  isLoading,
  onLoadMore,
  rootMargin = '350px',
  threshold = 0.1,
  disabled = false
}: UseInfiniteScrollOptions) {
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const handleIntersect = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target?.isIntersecting && hasMore && !isLoading && !disabled) {
        onLoadMore();
      }
    },
    [hasMore, isLoading, disabled, onLoadMore]
  );

  useEffect(() => {
    const element = sentinelRef.current;
    if (!element || disabled || !hasMore) return;

    const observer = new IntersectionObserver(handleIntersect, {
      root: null,
      rootMargin,
      threshold
    });

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [handleIntersect, disabled, hasMore, rootMargin, threshold]);

  return { sentinelRef };
}
