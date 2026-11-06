import React from 'react';
import { Sparkles } from 'lucide-react';
import { AnimePersonality } from '../types';

interface PersonalityCardProps {
  personality: AnimePersonality;
}

export const PersonalityCard: React.FC<PersonalityCardProps> = ({ personality }) => {
  return (
    <div className="bg-gradient-to-r from-indigo-950/40 via-[#181A26] to-[#181A26] border border-indigo-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs text-indigo-400 font-semibold uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            Anime Personality Archetype
          </div>
          <h3 className="text-lg font-bold text-white tracking-tight">{personality.title}</h3>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">{personality.tagline}</p>
        </div>

        <div className="px-4 py-2 bg-[#131520] border border-[#2A2F45] rounded-xl text-center shrink-0">
          <div className="text-[10px] text-slate-400 uppercase tracking-wider">Watching Pace</div>
          <div className="text-xs font-bold text-indigo-300 mt-0.5">{personality.watchingPace}</div>
        </div>
      </div>

      <p className="text-xs text-slate-400 mt-4 leading-relaxed border-t border-[#2A2F45]/60 pt-3">
        {personality.vibeDescription}
      </p>
    </div>
  );
};
