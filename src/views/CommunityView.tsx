/**
 * CommunityView - Community Discussions, Interactive Polls & Creator Network
 * Discussions, thread replies, spoiler toggles, live community voting, and user discovery
 */

import React, { useState } from 'react';
import {
  Users,
  MessageSquare,
  Flame,
  Plus,
  Heart,
  Vote,
  Sparkles,
  Eye,
  EyeOff,
  UserPlus,
  Check,
  Send,
  Pin
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CommunityTopic } from '../types';

export const CommunityView: React.FC = () => {
  const {
    topics,
    createTopic,
    replyTopic,
    votePoll,
    currentUser,
    otherUsers,
    following,
    toggleFollow,
    setActiveProfileViewUser,
    setActiveView,
    showToast
  } = useApp();

  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedTopic, setSelectedTopic] = useState<CommunityTopic | null>(topics[0] || null);
  const [replyText, setReplyText] = useState('');
  const [replySpoiler, setReplySpoiler] = useState(false);
  const [isCreatingTopic, setIsCreatingTopic] = useState(false);

  // New topic form state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<CommunityTopic['category']>('General');
  const [newContent, setNewContent] = useState('');
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState(['', '']);

  const categories = ['All', 'Theories', 'Episode Reaction', 'General', 'Manga Discussion', 'Recommendations'];

  const filteredTopics = topics.filter(t => activeCategory === 'All' || t.category === activeCategory);

  const handleCreateTopicSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const validPollOptions = pollOptions.filter(o => o.trim().length > 0);
    const hasValidPoll = pollQuestion.trim().length > 0 && validPollOptions.length >= 2;

    createTopic(
      newTitle,
      newCategory,
      newContent,
      undefined,
      hasValidPoll ? { question: pollQuestion, options: validPollOptions } : undefined
    );

    setIsCreatingTopic(false);
    setNewTitle('');
    setNewContent('');
    setPollQuestion('');
    setPollOptions(['', '']);
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedTopic) return;

    replyTopic(selectedTopic.id, replyText, replySpoiler);
    setReplyText('');
    setReplySpoiler(false);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Users className="w-6 h-6 text-indigo-400" />
            Otaku Community & Forums
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Discuss seasonal episodes, debate character motivations, participate in polls, and connect with fans
          </p>
        </div>

        <button
          onClick={() => setIsCreatingTopic(!isCreatingTopic)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-indigo-600/30 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Start Discussion
        </button>
      </div>

      {/* Suggested Anime Creators to Follow */}
      <div className="bg-[#181A26] border border-[#2A2F45] rounded-2xl p-4 shadow-lg">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          Creators You May Like
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {otherUsers.map(user => {
            const isUserFollowing = following.includes(user.id);

            return (
              <div
                key={user.id}
                className="bg-[#131520] border border-[#2A2F45] rounded-xl p-3 flex items-center justify-between gap-3"
              >
                <div
                  onClick={() => {
                    setActiveProfileViewUser(user);
                    setActiveView('profile');
                  }}
                  className="flex items-center gap-2.5 min-w-0 cursor-pointer group"
                >
                  <img src={user.avatar} alt={user.displayName} className="w-10 h-10 rounded-full object-cover shrink-0" />
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-white truncate group-hover:text-indigo-400">
                      {user.displayName}
                    </div>
                    <div className="text-[11px] text-slate-400 truncate">@{user.username} · Lv.{user.level}</div>
                  </div>
                </div>

                <button
                  onClick={() => toggleFollow(user.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors shrink-0 flex items-center gap-1 ${
                    isUserFollowing
                      ? 'bg-[#1F2335] text-slate-300 border border-[#2A2F45]'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                  }`}
                >
                  {isUserFollowing ? <Check className="w-3 h-3" /> : <UserPlus className="w-3 h-3" />}
                  {isUserFollowing ? 'Following' : 'Follow'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Create Topic Modal Form (Collapsible) */}
      {isCreatingTopic && (
        <form
          onSubmit={handleCreateTopicSubmit}
          className="bg-[#181A26] border border-indigo-500/40 rounded-2xl p-5 shadow-2xl space-y-4 animate-in fade-in duration-200"
        >
          <div className="flex items-center justify-between border-b border-[#2A2F45] pb-3">
            <h3 className="text-sm font-bold text-white">Create New Discussion Topic</h3>
            <button
              type="button"
              onClick={() => setIsCreatingTopic(false)}
              className="text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-400 mb-1">Title</label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                placeholder="What would you like to discuss?"
                className="w-full bg-[#131520] border border-[#2A2F45] focus:border-indigo-500 rounded-xl px-3 py-2 text-xs text-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Category</label>
              <select
                value={newCategory}
                onChange={e => setNewCategory(e.target.value as any)}
                className="w-full bg-[#131520] border border-[#2A2F45] text-xs text-slate-200 rounded-xl p-2 outline-none"
              >
                <option value="General">General</option>
                <option value="Theories">Theories</option>
                <option value="Episode Reaction">Episode Reaction</option>
                <option value="Manga Discussion">Manga Discussion</option>
                <option value="Recommendations">Recommendations</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Content</label>
            <textarea
              required
              rows={3}
              value={newContent}
              onChange={e => setNewContent(e.target.value)}
              placeholder="Provide background, questions, or theories for the community..."
              className="w-full bg-[#131520] border border-[#2A2F45] focus:border-indigo-500 rounded-xl p-3 text-xs text-white outline-none resize-none"
            />
          </div>

          {/* Optional Poll Section */}
          <div className="p-3 bg-[#131520] border border-[#2A2F45] rounded-xl space-y-2">
            <div className="text-xs font-semibold text-indigo-400 flex items-center gap-1.5">
              <Vote className="w-3.5 h-3.5" />
              Optional Community Poll
            </div>
            <input
              type="text"
              value={pollQuestion}
              onChange={e => setPollQuestion(e.target.value)}
              placeholder="Poll question (e.g., Best animation cut in episode 2?)"
              className="w-full bg-[#181A26] border border-[#2A2F45] text-xs text-white rounded-lg px-2.5 py-1.5 outline-none"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={pollOptions[0]}
                onChange={e => setPollOptions([e.target.value, pollOptions[1]])}
                placeholder="Option 1"
                className="bg-[#181A26] border border-[#2A2F45] text-xs text-white rounded-lg px-2.5 py-1.5 outline-none"
              />
              <input
                type="text"
                value={pollOptions[1]}
                onChange={e => setPollOptions([pollOptions[0], e.target.value])}
                placeholder="Option 2"
                className="bg-[#181A26] border border-[#2A2F45] text-xs text-white rounded-lg px-2.5 py-1.5 outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-colors"
          >
            Publish Topic
          </button>
        </form>
      )}

      {/* Main 2-Column: Thread List + Thread Details & Comments */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Topics List */}
        <div className="space-y-3">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar p-1 bg-[#181A26] border border-[#2A2F45] rounded-xl">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all whitespace-nowrap shrink-0 ${
                  activeCategory === cat
                    ? 'bg-indigo-600 text-white font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* List of Topics */}
          <div className="space-y-2.5">
            {filteredTopics.map(topic => {
              const isSelected = selectedTopic?.id === topic.id;

              return (
                <div
                  key={topic.id}
                  onClick={() => setSelectedTopic(topic)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-950/20 border-indigo-500 shadow-md ring-1 ring-indigo-500/50'
                      : 'bg-[#181A26] border-[#2A2F45] hover:border-slate-500'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="text-indigo-400 font-semibold">{topic.category}</span>
                    <span className="text-slate-400">{topic.createdAt}</span>
                  </div>

                  <h3 className="text-xs font-bold text-white line-clamp-2 leading-snug">{topic.title}</h3>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2.5 pt-2 border-t border-[#2A2F45]/50">
                    <span className="truncate max-w-[120px]">@{topic.username}</span>
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-3 h-3 text-slate-500" />
                        {topic.replies.length}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 2 Columns: Selected Topic Thread Viewer */}
        <div className="lg:col-span-2">
          {selectedTopic ? (
            <div className="bg-[#181A26] border border-[#2A2F45] rounded-2xl p-6 shadow-xl space-y-6">
              {/* Header */}
              <div>
                <div className="flex items-center gap-2 text-xs text-indigo-400 font-semibold mb-1">
                  <span>{selectedTopic.category}</span>
                  {selectedTopic.isPinned && (
                    <span className="flex items-center gap-1 text-amber-400 text-[10px] font-mono font-bold bg-amber-500/10 px-1.5 py-0.5 rounded">
                      <Pin className="w-3 h-3" /> PINNED
                    </span>
                  )}
                </div>
                <h2 className="text-lg font-bold text-white tracking-tight">{selectedTopic.title}</h2>
                <div className="flex items-center gap-2 mt-2 text-xs text-slate-400">
                  <img src={selectedTopic.avatar} alt="Author" className="w-5 h-5 rounded-full object-cover" />
                  <span className="font-medium text-slate-200">{selectedTopic.displayName}</span>
                  <span>·</span>
                  <span>{selectedTopic.createdAt}</span>
                </div>
              </div>

              {/* Topic Content Body */}
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line border-t border-b border-[#2A2F45]/60 py-4">
                {selectedTopic.content}
              </p>

              {/* Community Poll (if attached) */}
              {selectedTopic.poll && (
                <div className="bg-[#131520] border border-indigo-500/30 rounded-xl p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <Vote className="w-4 h-4 text-indigo-400" />
                    <h4 className="text-xs font-bold text-white">{selectedTopic.poll.question}</h4>
                  </div>

                  {/* Poll Options */}
                  <div className="space-y-2">
                    {selectedTopic.poll.options.map(option => {
                      const totalVotes = selectedTopic.poll!.options.reduce((sum, o) => sum + o.votes, 0);
                      const pct = totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0;
                      const hasVotedThis = selectedTopic.poll!.userVotedOptionId === option.id;

                      return (
                        <button
                          key={option.id}
                          onClick={() => votePoll(selectedTopic.id, option.id)}
                          className={`w-full relative overflow-hidden p-3 rounded-lg border text-left text-xs transition-all ${
                            hasVotedThis
                              ? 'border-indigo-500 bg-indigo-950/30 font-semibold'
                              : 'border-[#2A2F45] bg-[#181A26] hover:border-slate-500'
                          }`}
                        >
                          {/* Progress fill */}
                          <div
                            className="absolute top-0 bottom-0 left-0 bg-indigo-600/20 transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          />

                          <div className="relative z-10 flex items-center justify-between">
                            <span className="text-slate-200">{option.text}</span>
                            <span className="font-mono text-indigo-300 tabular-nums">
                              {pct}% ({option.votes})
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Replies Section */}
              <div className="space-y-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Replies ({selectedTopic.replies.length})
                </h3>

                <div className="space-y-3">
                  {selectedTopic.replies.map(reply => (
                    <div key={reply.id} className="bg-[#131520] border border-[#2A2F45] rounded-xl p-3.5 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <img src={reply.avatar} alt={reply.displayName} className="w-6 h-6 rounded-full object-cover" />
                          <span className="font-semibold text-white">{reply.displayName}</span>
                          <span className="text-[11px] text-slate-400">@{reply.username}</span>
                        </div>
                        <span className="text-[11px] text-slate-500 font-mono">{reply.createdAt}</span>
                      </div>

                      <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-line pl-8">
                        {reply.content}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Reply Authoring Input */}
                <form onSubmit={handleSendReply} className="pt-2 space-y-2">
                  <textarea
                    rows={2}
                    value={replyText}
                    onChange={e => setReplyText(e.target.value)}
                    placeholder="Join the discussion..."
                    className="w-full bg-[#131520] border border-[#2A2F45] focus:border-indigo-500 rounded-xl p-3 text-xs text-white outline-none resize-none placeholder:text-slate-500"
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
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-md shadow-indigo-600/25"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Post Reply
                    </button>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-xs text-slate-400 bg-[#181A26] rounded-2xl border border-[#2A2F45]">
              Select a discussion topic to read replies or cast your vote.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
