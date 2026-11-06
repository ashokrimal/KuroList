/**
 * CommunityView - Community Discussions, Interactive Polls & Creator Network
 * Refactored into modular components with high-fidelity skeleton loading:
 * - DiscussionThreadReader: Thread reader, poll voting, and replies
 * - ActivityStream: Live social activity feed with likes and comments
 * - CommunitySkeleton: Fluid loading placeholder
 */

import React, { useState, useEffect } from 'react';
import {
  Users,
  MessageSquare,
  Plus,
  Sparkles,
  UserPlus,
  Check,
  Vote,
  Activity
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CommunityTopic } from '../types';
import { DiscussionThreadReader } from '../components/DiscussionThreadReader';
import { GlobalActivity } from '../components/GlobalActivity';
import { CommunitySkeleton } from '../components/SkeletonLoader';

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
    activities,
    reviews,
    likeActivity,
    commentActivity,
    setSelectedMedia,
    getMediaById
  } = useApp();

  const [isLoading, setIsLoading] = useState(true);
  const [communityTab, setCommunityTab] = useState<'discussions' | 'activity'>('discussions');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedTopic, setSelectedTopic] = useState<CommunityTopic | null>(topics[0] || null);
  const [isCreatingTopic, setIsCreatingTopic] = useState(false);

  // New topic form state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<CommunityTopic['category']>('General');
  const [newContent, setNewContent] = useState('');
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState(['', '']);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 240);
    return () => clearTimeout(timer);
  }, []);

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

  if (isLoading) {
    return <CommunitySkeleton />;
  }

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
          type="button"
          onClick={() => setIsCreatingTopic(!isCreatingTopic)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-indigo-600/30 transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{isCreatingTopic ? 'Cancel Topic' : 'Start Discussion'}</span>
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
                  type="button"
                  onClick={() => toggleFollow(user.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-all cursor-pointer ${
                    isUserFollowing
                      ? 'bg-[#181A26] text-slate-300 border border-[#2A2F45]'
                      : 'bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30'
                  }`}
                >
                  {isUserFollowing ? <Check className="w-3 h-3 text-emerald-400" /> : <UserPlus className="w-3 h-3" />}
                  <span>{isUserFollowing ? 'Following' : 'Follow'}</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* New Topic Creation Form (Drawer / Modal Style) */}
      {isCreatingTopic && (
        <form onSubmit={handleCreateTopicSubmit} className="bg-[#181A26] border border-indigo-500/40 rounded-2xl p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-[#2A2F45] pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-indigo-400" />
              Create New Forum Topic
            </h3>
            <button
              type="button"
              onClick={() => setIsCreatingTopic(false)}
              className="text-xs text-slate-400 hover:text-white cursor-pointer"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-400 mb-1">Topic Title</label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                placeholder="e.g. Frieren Episode 28 Final Sakuga Discussion"
                className="w-full bg-[#131520] border border-[#2A2F45] focus:border-indigo-500 rounded-xl px-3 py-2 text-xs text-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Category</label>
              <select
                value={newCategory}
                onChange={e => setNewCategory(e.target.value as any)}
                className="w-full bg-[#131520] border border-[#2A2F45] focus:border-indigo-500 rounded-xl px-3 py-2 text-xs text-white outline-none"
              >
                <option value="General">General</option>
                <option value="Episode Reaction">Episode Reaction</option>
                <option value="Theories">Theories</option>
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
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-colors cursor-pointer"
          >
            Publish Topic
          </button>
        </form>
      )}

      {/* Community Section Switcher: Forums vs Live Activity Feed */}
      <div className="flex items-center gap-2 border-b border-[#2A2F45] pb-3">
        <button
          type="button"
          onClick={() => setCommunityTab('discussions')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            communityTab === 'discussions'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-950/40'
              : 'text-slate-400 hover:text-white hover:bg-[#181A26]'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Discussions & Forums</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-white/10 text-white font-mono">
            {topics.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setCommunityTab('activity')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            communityTab === 'activity'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-950/40'
              : 'text-slate-400 hover:text-white hover:bg-[#181A26]'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Global Activity</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-white/10 text-white font-mono">
            {activities.length + reviews.length}
          </span>
        </button>
      </div>

      {communityTab === 'discussions' ? (
        /* Main 2-Column: Thread List + Modular DiscussionThreadReader */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Topics List */}
          <div className="space-y-3">
            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar p-1 bg-[#181A26] border border-[#2A2F45] rounded-xl">
              {categories.map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer ${
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
                        ? 'bg-[#1D2132] border-indigo-500/60 shadow-lg'
                        : 'bg-[#181A26] border-[#2A2F45] hover:border-slate-500'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="text-indigo-400 font-medium px-2 py-0.5 rounded bg-indigo-500/10">
                        {topic.category}
                      </span>
                      <span className="text-slate-400 font-mono">{topic.createdAt}</span>
                    </div>

                    <h4 className="text-xs font-semibold text-white line-clamp-1 mb-1">
                      {topic.title}
                    </h4>

                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>@{topic.username}</span>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="w-3 h-3" />
                        <span>{topic.replies.length} replies</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Modular Thread Reader Component */}
          <div className="lg:col-span-2">
            <DiscussionThreadReader
              selectedTopic={selectedTopic}
              onVotePoll={votePoll}
              onSendReply={(content, isSpoiler) => {
                if (selectedTopic) {
                  replyTopic(selectedTopic.id, content, isSpoiler);
                }
              }}
            />
          </div>
        </div>
      ) : (
        /* Modular Global Activity Feed Component */
        <GlobalActivity />
      )}
    </div>
  );
};
