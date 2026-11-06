import React from 'react';
import { ArrowRight } from 'lucide-react';
import { MediaItem } from '../types';
import { AnimeCard } from './AnimeCard';

interface MediaGridSectionProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  items: MediaItem[];
  columns?: string;
}

export const MediaGridSection: React.FC<MediaGridSectionProps> = ({
  title,
  subtitle,
  icon,
  actionLabel,
  onAction,
  items,
  columns = 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6'
}) => {
  if (items.length === 0) return null;

  return (
    <section aria-label={title}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            {icon}
            <span>{title}</span>
          </h2>
          {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
        </div>

        {actionLabel && onAction && (
          <button
            type="button"
            onClick={onAction}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 cursor-pointer"
          >
            <span>{actionLabel}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <div className={`grid ${columns} gap-4`}>
        {items.map(media => (
          <AnimeCard key={media.id} media={media} />
        ))}
      </div>
    </section>
  );
};
