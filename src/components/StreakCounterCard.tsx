import React from 'react';
import { Flame, Check, Sparkles, TrendingUp, Calendar, Zap } from 'lucide-react';
import { StreakState } from '../utils/streak';
import { triggerHaptic } from '../utils/haptics';

interface StreakCounterCardProps {
  streak: StreakState;
  onQuickTrack?: () => void;
  className?: string;
  compact?: boolean;
}

export const StreakCounterCard: React.FC<StreakCounterCardProps> = ({
  streak,
  onQuickTrack,
  className = '',
  compact = false
}) => {
  const goalProgressPercent = Math.min(100, Math.round((streak.todayLogsCount / streak.dailyGoal) * 100));
  const isGoalReached = streak.todayLogsCount >= streak.dailyGoal;

  if (compact) {
    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/15 via-orange-500/15 to-red-500/10 border border-amber-500/30 text-amber-300 shadow-sm ${className}`}>
        <div className="relative flex items-center justify-center">
          <Flame className="w-4 h-4 text-amber-400 fill-amber-400 animate-pulse" />
        </div>
        <div className="flex items-baseline gap-1">
          <span className="font-extrabold font-mono text-sm text-white tracking-tight">
            {streak.currentStreak}
          </span>
          <span className="text-[11px] font-semibold text-amber-300">
            {streak.currentStreak === 1 ? 'day' : 'days'}
          </span>
        </div>
        <div className="h-3 w-px bg-amber-500/30 mx-0.5" />
        <span className="text-[10px] text-amber-200/80 font-mono">
          {streak.todayLogsCount}/{streak.dailyGoal} today
        </span>
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden bg-gradient-to-br from-[#1A1826] via-[#161824] to-[#12141F] border border-[#2B2E45] rounded-2xl p-5 shadow-xl transition-all duration-300 hover:border-amber-500/40 group ${className}`}
    >
      {/* Background Subtle Fire Glow Orbs */}
      <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-br from-amber-500/10 to-orange-600/5 blur-3xl pointer-events-none rounded-full" />
      <div className="absolute -bottom-10 -left-10 w-28 h-28 bg-indigo-500/10 blur-2xl pointer-events-none rounded-full" />

      {/* Top Header Row */}
      <div className="relative flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          {/* Animated Flame Badge */}
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500/20 via-orange-500/25 to-red-500/20 border border-amber-500/40 flex items-center justify-center shadow-lg shadow-amber-950/40 shrink-0 group-hover:scale-105 transition-transform">
            <Flame className="w-6 h-6 text-amber-400 fill-amber-400 drop-shadow-[0_2px_8px_rgba(251,191,36,0.6)] animate-pulse" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-black text-white tracking-tight flex items-baseline gap-1.5 font-mono">
                <span>{streak.currentStreak}</span>
                <span className="text-sm font-sans font-bold text-amber-400">
                  {streak.currentStreak === 1 ? 'Day Streak' : 'Days Streak'}
                </span>
              </h3>
              {streak.currentStreak >= 5 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono flex items-center gap-1">
                  <Zap className="w-2.5 h-2.5 fill-amber-400" />
                  On Fire
                </span>
              )}
            </div>

            <p className="text-xs text-slate-400 mt-0.5">
              {isGoalReached
                ? 'Daily tracking goal complete! Streak defended.'
                : `${streak.todayLogsCount} of ${streak.dailyGoal} episodes or chapters logged today`}
            </p>
          </div>
        </div>

        {/* Longest streak pill badge */}
        <div className="hidden sm:flex flex-col items-end text-right">
          <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-400">Personal Best</span>
          <span className="text-xs font-bold font-mono text-slate-200 mt-0.5 flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-indigo-400" />
            {streak.longestStreak} days
          </span>
        </div>
      </div>

      {/* Daily Progress Indicator Bar */}
      <div className="relative mt-4 space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-[11px] font-semibold text-slate-300 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            Daily Goal Progress
          </span>
          <span className="font-mono text-xs font-bold text-amber-300">
            {goalProgressPercent}% ({streak.todayLogsCount}/{streak.dailyGoal})
          </span>
        </div>

        <div className="w-full bg-[#10121C] h-2.5 rounded-full overflow-hidden p-0.5 border border-white/5">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isGoalReached
                ? 'bg-gradient-to-r from-amber-400 via-orange-500 to-emerald-400 shadow-[0_0_12px_rgba(245,158,11,0.5)]'
                : 'bg-gradient-to-r from-amber-500 to-orange-500'
            }`}
            style={{ width: `${goalProgressPercent}%` }}
          />
        </div>
      </div>

      {/* 7-Day Weekly Streak Track */}
      <div className="relative mt-4 pt-3.5 border-t border-[#25283C]/80">
        <div className="flex items-center justify-between gap-1.5">
          {streak.weeklyDays.map((d) => (
            <div
              key={d.date}
              className={`flex-1 flex flex-col items-center py-2 px-1 rounded-xl transition-all ${
                d.isToday
                  ? 'bg-amber-500/10 border border-amber-500/40 shadow-sm'
                  : 'bg-[#12141F]/60 border border-transparent'
              }`}
            >
              <span className={`text-[10px] font-medium tracking-tight mb-1 ${
                d.isToday ? 'text-amber-300 font-bold' : 'text-slate-400'
              }`}>
                {d.dayName}
              </span>

              {d.active ? (
                <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-sm shadow-amber-900/50">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
              ) : (
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                  d.isToday
                    ? 'border-dashed border-amber-400/60 text-amber-400'
                    : 'border-slate-700 bg-slate-800/40'
                }`}>
                  {d.isToday ? (
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                  ) : (
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
