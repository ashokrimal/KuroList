import React from 'react';
import { Trophy, Play, BookOpen, Feather, Award } from 'lucide-react';

interface GamificationBannerProps {
  level: number;
  title: string;
  totalXp: number;
  nextLevelXp: number;
  progressPercent: number;
  episodesWatched: number;
  chaptersRead: number;
  reviewsWritten: number;
  unlockedBadgesCount: number;
  totalBadgesCount: number;
}

export const GamificationBanner: React.FC<GamificationBannerProps> = ({
  level,
  title,
  totalXp,
  nextLevelXp,
  progressPercent,
  episodesWatched,
  chaptersRead,
  reviewsWritten,
  unlockedBadgesCount,
  totalBadgesCount
}) => {
  return (
    <div className="mt-6 p-4 bg-[#131520] border border-[#2A2F45] rounded-2xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-2">
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-bold text-white">Level {level} · {title}</span>
          <span className="text-[11px] font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">
            {totalXp.toLocaleString()} Total XP
          </span>
        </div>
        <div className="text-xs text-slate-400 font-mono">
          {totalXp.toLocaleString()} / {nextLevelXp.toLocaleString()} XP ({progressPercent}%)
        </div>
      </div>

      {/* XP Progress Bar */}
      <div className="w-full bg-[#181A26] h-2.5 rounded-full overflow-hidden border border-white/5">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 via-violet-500 to-amber-400 rounded-full transition-all duration-500"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Dynamic Milestone Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-3 border-t border-[#2A2F45]/60 text-center">
        <div>
          <div className="text-[10px] text-slate-400 uppercase tracking-wider flex items-center justify-center gap-1">
            <Play className="w-3 h-3 text-indigo-400" />
            Episodes Watched
          </div>
          <div className="text-sm font-bold font-mono text-white mt-0.5">
            {episodesWatched}
            <span className="text-[10px] text-slate-500 font-normal ml-1">
              (+{(episodesWatched * 15).toLocaleString()} XP)
            </span>
          </div>
        </div>

        <div>
          <div className="text-[10px] text-slate-400 uppercase tracking-wider flex items-center justify-center gap-1">
            <BookOpen className="w-3 h-3 text-indigo-400" />
            Chapters Read
          </div>
          <div className="text-sm font-bold font-mono text-white mt-0.5">
            {chaptersRead}
            <span className="text-[10px] text-slate-500 font-normal ml-1">
              (+{(chaptersRead * 10).toLocaleString()} XP)
            </span>
          </div>
        </div>

        <div>
          <div className="text-[10px] text-slate-400 uppercase tracking-wider flex items-center justify-center gap-1">
            <Feather className="w-3 h-3 text-indigo-400" />
            Reviews Written
          </div>
          <div className="text-sm font-bold font-mono text-white mt-0.5">
            {reviewsWritten}
            <span className="text-[10px] text-slate-500 font-normal ml-1">
              (+{(reviewsWritten * 200).toLocaleString()} XP)
            </span>
          </div>
        </div>

        <div>
          <div className="text-[10px] text-slate-400 uppercase tracking-wider flex items-center justify-center gap-1">
            <Award className="w-3 h-3 text-amber-400" />
            Badges Unlocked
          </div>
          <div className="text-sm font-bold font-mono text-amber-300 mt-0.5">
            {unlockedBadgesCount} / {totalBadgesCount}
          </div>
        </div>
      </div>
    </div>
  );
};
