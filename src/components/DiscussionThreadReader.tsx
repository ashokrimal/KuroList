import React, { useState } from 'react';
import { Vote, Send } from 'lucide-react';
import { CommunityTopic } from '../types';

interface DiscussionThreadReaderProps {
  selectedTopic: CommunityTopic | null;
  onVotePoll: (topicId: string, optionId: string) => void;
  onSendReply: (content: string, isSpoiler: boolean) => void;
}

export const DiscussionThreadReader: React.FC<DiscussionThreadReaderProps> = ({
  selectedTopic,
  onVotePoll,
  onSendReply
}) => {
  const [replyText, setReplyText] = useState('');
  const [replySpoiler, setReplySpoiler] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    onSendReply(replyText, replySpoiler);
    setReplyText('');
    setReplySpoiler(false);
  };

  if (!selectedTopic) {
    return (
      <div className="p-12 text-center text-xs text-slate-400 bg-[#181A26] rounded-2xl border border-[#2A2F45]">
        Select a discussion topic to read replies or cast your vote.
      </div>
    );
  }

  return (
    <div className="bg-[#181A26] border border-[#2A2F45] rounded-2xl p-6 shadow-xl space-y-6">
      {/* Header */}
      <div className="border-b border-[#2A2F45] pb-4">
        <div className="flex items-center gap-2 text-xs text-indigo-400 font-medium mb-1">
          <span>{selectedTopic.category}</span>
          <span className="text-slate-600">•</span>
          <span className="text-slate-400">Posted by @{selectedTopic.username}</span>
        </div>
        <h2 className="text-lg font-bold text-white tracking-tight">
          {selectedTopic.title}
        </h2>
      </div>

      {/* Content */}
      <p className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
        {selectedTopic.content}
      </p>

      {/* Optional Interactive Community Poll */}
      {selectedTopic.poll && (
        <div className="bg-[#131520] border border-indigo-500/30 rounded-xl p-4 space-y-3">
          <div className="text-xs font-bold text-white flex items-center gap-2">
            <Vote className="w-4 h-4 text-indigo-400" />
            <span>{selectedTopic.poll.question}</span>
          </div>

          <div className="space-y-2">
            {selectedTopic.poll.options.map(opt => {
              const hasVoted = selectedTopic.poll?.userVotedOptionId === opt.id;
              const totalVotes = selectedTopic.poll?.options.reduce((sum, o) => sum + o.votes, 0) || 1;
              const pct = Math.round((opt.votes / totalVotes) * 100);

              return (
                <button
                  key={opt.id}
                  type="button"
                  disabled={Boolean(selectedTopic.poll?.userVotedOptionId)}
                  onClick={() => onVotePoll(selectedTopic.id, opt.id)}
                  className={`w-full p-2.5 rounded-lg border text-left transition-all relative overflow-hidden flex items-center justify-between text-xs cursor-pointer ${
                    hasVoted
                      ? 'bg-indigo-600/20 border-indigo-500 text-white font-semibold'
                      : 'bg-[#181A26] border-[#2A2F45] text-slate-300 hover:border-indigo-400'
                  }`}
                >
                  <span className="relative z-10">{opt.text}</span>
                  <span className="relative z-10 font-mono text-[11px] text-slate-400">
                    {opt.votes} votes ({pct}%)
                  </span>
                  <div
                    className="absolute inset-y-0 left-0 bg-indigo-500/10 transition-all duration-300"
                    style={{ width: `${pct}%` }}
                  />
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Replies Thread */}
      <div className="border-t border-[#2A2F45] pt-5 space-y-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Replies ({selectedTopic.replies.length})
        </h3>

        <div className="space-y-3">
          {selectedTopic.replies.map(rep => (
            <div key={rep.id} className="p-3 bg-[#131520] rounded-xl border border-[#2A2F45]/60 space-y-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white">{rep.displayName}</span>
                  <span className="text-slate-500 font-mono">@{rep.username}</span>
                </div>
                <span className="text-slate-500 font-mono">{rep.createdAt}</span>
              </div>
              <p className="text-xs text-slate-300">{rep.content}</p>
            </div>
          ))}
        </div>

        {/* Reply Input Form */}
        <form onSubmit={handleSubmit} className="pt-2 space-y-3">
          <textarea
            rows={2}
            value={replyText}
            onChange={e => setReplyText(e.target.value)}
            placeholder="Add to the discussion..."
            className="w-full bg-[#131520] border border-[#2A2F45] focus:border-indigo-500 rounded-xl p-3 text-xs text-white outline-none resize-none"
          />

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer">
              <input
                type="checkbox"
                checked={replySpoiler}
                onChange={e => setReplySpoiler(e.target.checked)}
                className="w-3.5 h-3.5 accent-indigo-600 rounded"
              />
              <span>Mark spoiler</span>
            </label>

            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-md shadow-indigo-600/25 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              Post Reply
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
