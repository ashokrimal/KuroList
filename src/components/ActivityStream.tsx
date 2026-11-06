import React, { useState } from 'react';
import { Heart, MessageSquare, Activity } from 'lucide-react';
import { SocialActivity } from '../types';

interface ActivityStreamProps {
  activities: SocialActivity[];
  currentUserId: string;
  onLike: (activityId: string) => void;
  onComment: (activityId: string, text: string) => void;
  onSelectMedia: (mediaId: string) => void;
}

export const ActivityStream: React.FC<ActivityStreamProps> = ({
  activities,
  currentUserId,
  onLike,
  onComment,
  onSelectMedia
}) => {
  const [commentInputs, setCommentInputs] = useState<{ [activityId: string]: string }>({});

  const handleSendComment = (activityId: string) => {
    const text = commentInputs[activityId] || '';
    if (text.trim()) {
      onComment(activityId, text);
      setCommentInputs(prev => ({ ...prev, [activityId]: '' }));
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {/* Stream Header */}
      <div className="flex items-center justify-between bg-[#161824] border border-[#262A3E] rounded-xl px-4 py-3 shadow-md">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-indigo-400" />
          <span className="text-xs font-semibold text-white">Community Activity Stream</span>
        </div>
        <span className="text-[11px] text-slate-400 font-mono">Live updates from friends & otaku</span>
      </div>

      <div className="space-y-4">
        {activities.map(act => {
          const hasLiked = act.likes.includes(currentUserId);

          return (
            <div
              key={act.id}
              className="bg-[#181A26] border border-[#2A2F45] rounded-2xl p-4 sm:p-5 space-y-3.5 shadow-lg"
            >
              {/* User Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={act.avatar}
                    alt={act.displayName}
                    className="w-9 h-9 rounded-full object-cover ring-2 ring-indigo-500/30"
                  />
                  <div>
                    <div className="text-xs font-bold text-white hover:text-indigo-400 transition-colors">
                      {act.displayName}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      @{act.username} · {act.timestamp}
                    </div>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 capitalize">
                  {act.type.replace('_', ' ')}
                </span>
              </div>

              {/* Activity Content Box */}
              <div
                onClick={() => onSelectMedia(act.mediaId)}
                className="flex items-start gap-3.5 bg-[#12141F] p-3 rounded-xl border border-[#2A2F45]/60 hover:border-indigo-500/40 cursor-pointer transition-colors group"
              >
                <img
                  src={act.mediaCover}
                  alt={act.mediaTitle}
                  onError={e => {
                    (e.currentTarget as HTMLImageElement).src = '/src/assets/images/anime_card_nebula_1793517807647.jpg';
                  }}
                  className="w-12 h-16 object-cover rounded-lg shrink-0 shadow-md group-hover:scale-105 transition-transform bg-slate-900"
                />
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-white group-hover:text-indigo-400 transition-colors truncate">
                    {act.mediaTitle}
                  </div>

                  {act.progress && (
                    <div className="text-[11px] text-slate-300 mt-0.5 font-mono">
                      Reached episode {act.progress} of {act.totalProgress || '?'}
                    </div>
                  )}

                  {act.score && (
                    <div className="text-[11px] text-amber-300 font-mono mt-0.5">
                      Personal Rating: ★ {act.score}/10
                    </div>
                  )}

                  {act.reviewSnippet && (
                    <p className="text-xs text-slate-300 italic mt-1.5 line-clamp-2 bg-[#181A26]/80 p-2 rounded-lg border border-white/5">
                      "{act.reviewSnippet}"
                    </p>
                  )}
                </div>
              </div>

              {/* Actions & Likes */}
              <div className="flex items-center justify-between pt-1 text-xs text-slate-400 border-t border-[#2A2F45]/50">
                <button
                  type="button"
                  onClick={() => onLike(act.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                    hasLiked ? 'text-rose-400 font-semibold bg-rose-500/10' : 'hover:text-white hover:bg-[#202538]'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${hasLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                  <span>{act.likes.length} Likes</span>
                </button>

                <div className="flex items-center gap-1.5 text-slate-400">
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>{act.comments.length} Comments</span>
                </div>
              </div>

              {/* Comment List */}
              {act.comments.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  {act.comments.map(c => (
                    <div key={c.id} className="text-xs bg-[#12141F] p-2.5 rounded-xl text-slate-300 border border-white/5">
                      <span className="font-semibold text-white mr-2">{c.displayName}:</span>
                      {c.text}
                    </div>
                  ))}
                </div>
              )}

              {/* Add Comment Input */}
              <div className="flex gap-2 pt-1">
                <input
                  type="text"
                  placeholder="Write a comment..."
                  value={commentInputs[act.id] || ''}
                  onChange={e => setCommentInputs({ ...commentInputs, [act.id]: e.target.value })}
                  onKeyDown={e => {
                    if (e.key === 'Enter') handleSendComment(act.id);
                  }}
                  className="flex-1 bg-[#12141F] border border-[#2A2F45] focus:border-indigo-500 text-xs text-white rounded-xl px-3 py-2 outline-none placeholder:text-slate-500"
                />
                <button
                  type="button"
                  onClick={() => handleSendComment(act.id)}
                  className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                >
                  Post
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
