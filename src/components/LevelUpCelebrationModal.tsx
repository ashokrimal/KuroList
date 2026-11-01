/**
 * Level Up & Badge Unlock Celebration Modal
 * Dynamic celebration modal shown when milestone achievements are unlocked
 */

import React from 'react';
import { Sparkles, Trophy, Award, Flame, X, ArrowRight, Star } from 'lucide-react';
import { UserBadge } from '../types';

interface LevelUpCelebrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  celebrationData: {
    type: 'level_up' | 'badge_unlocked';
    title: string;
    subtitle: string;
    xpEarned: number;
    level?: number;
    badge?: UserBadge;
  } | null;
}

export const LevelUpCelebrationModal: React.FC<LevelUpCelebrationModalProps> = ({
  isOpen,
  onClose,
  celebrationData
}) => {
  if (!isOpen || !celebrationData) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-sm sm:max-w-md bg-[#181A26] border-2 border-indigo-500/60 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-indigo-950/80 overflow-hidden text-center flex flex-col items-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-full hover:bg-[#1F2335] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Ambient Glow */}
        <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-indigo-600/30 via-violet-600/10 to-transparent pointer-events-none" />

        {/* Badge / Trophy Icon Circle with pulse */}
        <div className="relative z-10 w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-500 p-1 mb-5 shadow-xl shadow-indigo-600/40 animate-bounce duration-1000">
          <div className="w-full h-full rounded-full bg-[#131520] flex items-center justify-center border-2 border-white/20">
            {celebrationData.type === 'level_up' ? (
              <Trophy className="w-12 h-12 text-amber-400" />
            ) : (
              <Award className="w-12 h-12 text-indigo-400" />
            )}
          </div>
        </div>

        {/* Headline */}
        <div className="relative z-10 space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            {celebrationData.type === 'level_up' ? 'Level Progression' : 'Achievement Unlocked'}
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {celebrationData.title}
          </h2>

          <p className="text-xs text-slate-300 max-w-xs mx-auto leading-relaxed">
            {celebrationData.subtitle}
          </p>
        </div>

        {/* XP Reward Chip */}
        <div className="relative z-10 mt-6 px-4 py-2 bg-[#131520] border border-[#2A2F45] rounded-xl flex items-center gap-2 font-mono text-sm">
          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
          <span className="font-bold text-white">+{celebrationData.xpEarned} XP Awarded</span>
        </div>

        {/* Confirmation Button */}
        <button
          onClick={onClose}
          className="relative z-10 mt-6 w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-indigo-600/40 flex items-center justify-center gap-2 hover:scale-[1.02]"
        >
          <span>Claim & Continue</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
