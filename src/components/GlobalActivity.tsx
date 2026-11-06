/**
 * GlobalActivity - Community Global Activity Component
 * Fetches and displays recent user reviews and list updates (progress, ratings, status changes)
 * Features high-fidelity skeleton loading, live filtering, search, and interactions.
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  Activity,
  Star,
  MessageSquare,
  Heart,
  RefreshCw,
  Search,
  BookOpen,
  Tv,
  Eye,
  EyeOff,
  Send,
  Sparkles,
  CheckCircle2,
  ListPlus,
  Flame,
  ThumbsUp,
  Share2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SocialActivity, MediaReview, UserProfile, MediaType } from '../types';
import { GlobalActivitySkeleton } from './SkeletonLoader';
import { triggerHaptic } from '../utils/haptics';

export type ActivityFilterType = 'all' | 'reviews' | 'list_updates';

interface UnifiedFeedItem {
  id: string;
  kind: 'review' | 'activity';
  timestampMs: number;
  dateDisplay: string;
  userId: string;
  username: string;
  displayName: string;
  avatar: string;
  mediaId: string;
  mediaTitle: string;
  mediaCover: string;
  mediaType: MediaType;
  reviewData?: MediaReview;
  activityData?: SocialActivity;
}

interface GlobalActivityProps {
  initialFilter?: ActivityFilterType;
  className?: string;
}

export const GlobalActivity: React.FC<GlobalActivityProps> = ({
  initialFilter = 'all',
  className = ''
}) => {
  const {
    activities,
    reviews,
    currentUser,
    otherUsers,
    likeActivity,
    commentActivity,
    likeReview,
    commentReview,
    setSelectedMedia,
    getMediaById,
    setActiveProfileViewUser,
    setActiveView
  } = useApp();

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filterType, setFilterType] = useState<ActivityFilterType>(initialFilter);
  const [searchQuery, setSearchQuery] = useState('');
  const [revealedSpoilers, setRevealedSpoilers] = useState<Record<string, boolean>>({});
  const [expandedReviews, setExpandedReviews] = useState<Record<string, boolean>>({});
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Simulated initial async data fetch with skeleton loader
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 380);
    return () => clearTimeout(timer);
  }, []);

  // Manual refresh trigger to showcase live updates and skeleton state
  const handleManualRefresh = () => {
    triggerHaptic();
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 450);
  };

  // Convert human-readable or ISO timestamp to relative sortable epoch
  const parseTimestampToEpoch = (ts: string): number => {
    if (!ts) return 0;
    const now = Date.now();
    const lower = ts.toLowerCase();

    if (lower.includes('just now') || lower.includes('minute')) {
      const mins = parseInt(lower) || 1;
      return now - mins * 60 * 1000;
    }
    if (lower.includes('hour')) {
      const hours = parseInt(lower) || 1;
      return now - hours * 3600 * 1000;
    }
    if (lower.includes('yesterday')) {
      return now - 24 * 3600 * 1000;
    }
    if (lower.includes('day')) {
      const days = parseInt(lower) || 1;
      return now - days * 24 * 3600 * 1000;
    }

    const parsed = Date.parse(ts);
    return isNaN(parsed) ? now - 100000 : parsed;
  };

  // Combine reviews and activities into a unified chronological feed
  const unifiedFeed: UnifiedFeedItem[] = useMemo(() => {
    const listItems: UnifiedFeedItem[] = [];

    // Map List Updates & Progress activities
    activities.forEach(act => {
      listItems.push({
        id: `act_${act.id}`,
        kind: 'activity',
        timestampMs: parseTimestampToEpoch(act.timestamp),
        dateDisplay: act.timestamp,
        userId: act.userId,
        username: act.username,
        displayName: act.displayName,
        avatar: act.avatar,
        mediaId: act.mediaId,
        mediaTitle: act.mediaTitle,
        mediaCover: act.mediaCover,
        mediaType: act.mediaType,
        activityData: act
      });
    });

    // Map User Reviews
    reviews.forEach(rev => {
      listItems.push({
        id: `rev_${rev.id}`,
        kind: 'review',
        timestampMs: parseTimestampToEpoch(rev.createdAt),
        dateDisplay: rev.createdAt,
        userId: rev.userId,
        username: rev.username,
        displayName: rev.displayName,
        avatar: rev.avatar,
        mediaId: rev.mediaId,
        mediaTitle: rev.mediaTitle,
        mediaCover: rev.mediaCover,
        mediaType: rev.mediaType,
        reviewData: rev
      });
    });

    // Sort newest first
    return listItems.sort((a, b) => b.timestampMs - a.timestampMs);
  }, [activities, reviews]);

  // Filter feed based on active tab and query
  const filteredFeed = useMemo(() => {
    return unifiedFeed.filter(item => {
      if (filterType === 'reviews' && item.kind !== 'review') return false;
      if (filterType === 'list_updates' && item.kind !== 'activity') return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesMedia = item.mediaTitle.toLowerCase().includes(q);
        const matchesUser =
          item.displayName.toLowerCase().includes(q) ||
          item.username.toLowerCase().includes(q);
        const matchesReview =
          item.reviewData?.title.toLowerCase().includes(q) ||
          item.reviewData?.content.toLowerCase().includes(q);
        const matchesSnippet = item.activityData?.reviewSnippet?.toLowerCase().includes(q);

        if (!matchesMedia && !matchesUser && !matchesReview && !matchesSnippet) {
          return false;
        }
      }

      return true;
    });
  }, [unifiedFeed, filterType, searchQuery]);

  const toggleSpoiler = (id: string) => {
    triggerHaptic();
    setRevealedSpoilers(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleExpandReview = (id: string) => {
    triggerHaptic();
    setExpandedReviews(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleComments = (id: string) => {
    triggerHaptic();
    setExpandedComments(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSendComment = (item: UnifiedFeedItem) => {
    const text = commentInputs[item.id]?.trim();
    if (!text) return;
    triggerHaptic();

    if (item.kind === 'activity' && item.activityData) {
      commentActivity(item.activityData.id, text);
    } else if (item.kind === 'review' && item.reviewData) {
      commentReview(item.reviewData.id, text);
    }

    setCommentInputs(prev => ({ ...prev, [item.id]: '' }));
    setExpandedComments(prev => ({ ...prev, [item.id]: true }));
  };

  const handleSelectMedia = (mediaId: string) => {
    triggerHaptic();
    const media = getMediaById(mediaId);
    if (media) {
      setSelectedMedia(media);
    }
  };

  const handleSelectUser = (userId: string) => {
    triggerHaptic();
    const user = otherUsers.find(u => u.id === userId);
    if (user) {
      setActiveProfileViewUser(user);
      setActiveView('profile');
    }
  };

  const handleShare = (id: string) => {
    triggerHaptic();
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Render skeleton when loading or refreshing
  if (isLoading || isRefreshing) {
    return <GlobalActivitySkeleton />;
  }

  const reviewCount = reviews.length;
  const listUpdateCount = activities.length;

  return (
    <div className={`max-w-4xl mx-auto space-y-5 ${className}`}>
      {/* Control Header: Feed Tabs, Search & Manual Refresh */}
      <div className="bg-[#181A26] border border-[#2A2F45] rounded-2xl p-4 shadow-lg space-y-3.5">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Filter Navigation */}
          <div className="flex items-center gap-1.5 p-1 bg-[#131520] border border-[#2A2F45]/60 rounded-xl overflow-x-auto no-scrollbar">
            <button
              type="button"
              onClick={() => {
                triggerHaptic();
                setFilterType('all');
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer shrink-0 ${
                filterType === 'all'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-[#181A26]'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>All Global Activity</span>
              <span className="font-mono text-[10px] text-indigo-200">
                {unifiedFeed.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                triggerHaptic();
                setFilterType('reviews');
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer shrink-0 ${
                filterType === 'reviews'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-[#181A26]'
              }`}
            >
              <Star className="w-3.5 h-3.5" />
              <span>User Reviews</span>
              <span className="font-mono text-[10px] text-indigo-200">
                {reviewCount}
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                triggerHaptic();
                setFilterType('list_updates');
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer shrink-0 ${
                filterType === 'list_updates'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-[#181A26]'
              }`}
            >
              <ListPlus className="w-3.5 h-3.5" />
              <span>List Updates</span>
              <span className="font-mono text-[10px] text-indigo-200">
                {listUpdateCount}
              </span>
            </button>
          </div>

          {/* Search & Refresh Actions */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-56">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search anime or user..."
                className="w-full bg-[#131520] border border-[#2A2F45] focus:border-indigo-500 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 outline-none transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={handleManualRefresh}
              title="Refresh feed and fetch latest global events"
              className="p-2 bg-[#131520] hover:bg-[#1F2335] border border-[#2A2F45] text-slate-300 hover:text-white rounded-xl transition-colors cursor-pointer flex items-center justify-center shrink-0"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Live status bar */}
        <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-[#2A2F45]/50 pt-2.5 px-1 font-mono">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Real-time Community Activity Feed</span>
          </div>
          <span>Showing {filteredFeed.length} updates</span>
        </div>
      </div>

      {/* Activity Feed Cards */}
      {filteredFeed.length === 0 ? (
        <div className="bg-[#181A26] border border-[#2A2F45] rounded-2xl p-12 text-center space-y-3">
          <Activity className="w-10 h-10 text-slate-500 mx-auto" />
          <h3 className="text-sm font-bold text-white">No activity found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {searchQuery
              ? `No updates matching "${searchQuery}". Try a different keyword.`
              : 'There are no updates in this category yet. Be the first to post a review or update your watchlist!'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredFeed.map(item => {
            if (item.kind === 'review' && item.reviewData) {
              return renderReviewCard(item, item.reviewData);
            } else if (item.kind === 'activity' && item.activityData) {
              return renderActivityCard(item, item.activityData);
            }
            return null;
          })}
        </div>
      )}
    </div>
  );

  /**
   * Render User Review Feed Card
   */
  function renderReviewCard(item: UnifiedFeedItem, review: MediaReview) {
    const isExpanded = !!expandedReviews[item.id];
    const isSpoilerRevealed = !!revealedSpoilers[item.id];
    const isCommentsOpen = !!expandedComments[item.id];
    const hasLiked = review.likedBy.includes(currentUser.id);
    const isOwnReview = review.userId === currentUser.id;

    return (
      <div
        key={item.id}
        className="bg-[#181A26] border border-[#2A2F45] rounded-2xl p-5 space-y-4 shadow-lg hover:border-slate-600/70 transition-colors"
      >
        {/* User Header & Timestamp */}
        <div className="flex items-center justify-between">
          <div
            onClick={() => handleSelectUser(review.userId)}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <img
              src={review.avatar}
              alt={review.displayName}
              onError={e => {
                (e.currentTarget as HTMLImageElement).src =
                  'https://cdn.myanimelist.net/images/characters/15/422168.jpg';
              }}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500/30 group-hover:ring-indigo-400 transition-all"
            />
            <div>
              <div className="text-xs font-bold text-white group-hover:text-indigo-400 transition-colors flex items-center gap-1.5">
                <span>{review.displayName}</span>
                {isOwnReview && (
                  <span className="text-[10px] text-indigo-400 font-mono">(You)</span>
                )}
              </div>
              <div className="text-[11px] text-slate-400 font-mono">
                @{review.username} · {item.dateDisplay}
              </div>
            </div>
          </div>

          {/* Review Score Badge */}
          <div className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-xl text-amber-400">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span className="text-xs font-bold font-mono">{review.rating} / 10</span>
          </div>
        </div>

        {/* Media Preview Card */}
        <div
          onClick={() => handleSelectMedia(review.mediaId)}
          className="flex items-start gap-3.5 bg-[#12141F] p-3.5 rounded-xl border border-[#2A2F45]/60 hover:border-indigo-500/40 cursor-pointer transition-colors group"
        >
          <img
            src={review.mediaCover}
            alt={review.mediaTitle}
            onError={e => {
              (e.currentTarget as HTMLImageElement).src =
                '/src/assets/images/anime_card_nebula_1793517807647.jpg';
            }}
            className="w-12 h-16 object-cover rounded-lg shrink-0 shadow-md group-hover:scale-105 transition-transform bg-slate-900"
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider flex items-center gap-1">
                {review.mediaType === 'anime' ? (
                  <Tv className="w-3 h-3 text-indigo-400" />
                ) : (
                  <BookOpen className="w-3 h-3 text-cyan-400" />
                )}
                {review.mediaType} Review
              </span>
            </div>
            <div className="text-xs font-bold text-white group-hover:text-indigo-400 transition-colors truncate mt-0.5">
              {review.mediaTitle}
            </div>
            <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
              Click to open complete anime details & episode guide
            </p>
          </div>
        </div>

        {/* Review Title & Body */}
        <div className="space-y-2">
          <h4 className="text-sm font-bold text-white tracking-tight">
            "{review.title}"
          </h4>

          {/* Spoiler Protection */}
          {review.hasSpoilers && !isSpoilerRevealed ? (
            <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-rose-300 text-xs">
                <EyeOff className="w-4 h-4 shrink-0" />
                <span>This review contains narrative spoilers.</span>
              </div>
              <button
                type="button"
                onClick={() => toggleSpoiler(item.id)}
                className="text-xs text-rose-200 hover:text-white underline font-medium cursor-pointer shrink-0"
              >
                Reveal Review
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <p
                className={`text-xs text-slate-300 leading-relaxed ${
                  !isExpanded ? 'line-clamp-3' : ''
                }`}
              >
                {review.content}
              </p>

              {review.content.length > 220 && (
                <button
                  type="button"
                  onClick={() => toggleExpandReview(item.id)}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer"
                >
                  {isExpanded ? 'Show less' : 'Read full review'}
                </button>
              )}
            </div>
          )}

          {/* Pros & Cons Subtle Typographic Badges */}
          {((review.pros && review.pros.length > 0) ||
            (review.cons && review.cons.length > 0)) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-[#2A2F45]/40 text-[11px]">
              {review.pros && review.pros.length > 0 && (
                <div className="space-y-1">
                  <div className="text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Highlights:</span>
                  </div>
                  <ul className="text-slate-300 space-y-0.5 pl-4 list-disc marker:text-emerald-500">
                    {review.pros.map((p, idx) => (
                      <li key={idx}>{p}</li>
                    ))}
                  </ul>
                </div>
              )}
              {review.cons && review.cons.length > 0 && (
                <div className="space-y-1">
                  <div className="text-rose-400 font-semibold flex items-center gap-1">
                    <span>Drawbacks:</span>
                  </div>
                  <ul className="text-slate-300 space-y-0.5 pl-4 list-disc marker:text-rose-500">
                    {review.cons.map((c, idx) => (
                      <li key={idx}>{c}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Social Actions Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-[#2A2F45]/40">
          <div className="flex items-center gap-4">
            {/* Helpful / Like Button */}
            <button
              type="button"
              onClick={() => {
                triggerHaptic();
                likeReview(review.id);
              }}
              className={`flex items-center gap-1.5 text-xs font-medium transition-colors cursor-pointer ${
                hasLiked ? 'text-indigo-400 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <ThumbsUp
                className={`w-3.5 h-3.5 ${hasLiked ? 'fill-indigo-400 text-indigo-400' : ''}`}
              />
              <span>Helpful ({review.helpfulCount})</span>
            </button>

            {/* Comments Toggle */}
            <button
              type="button"
              onClick={() => toggleComments(item.id)}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white font-medium transition-colors cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Discussion ({review.comments?.length || 0})</span>
            </button>
          </div>

          {/* Share Button */}
          <button
            type="button"
            onClick={() => handleShare(item.id)}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="font-mono text-[10px]">
              {copiedId === item.id ? 'Copied!' : 'Share'}
            </span>
          </button>
        </div>

        {/* Expandable Comments Section */}
        {isCommentsOpen && (
          <div className="pt-3 border-t border-[#2A2F45]/60 space-y-3">
            {/* Comment List */}
            {review.comments && review.comments.length > 0 ? (
              <div className="space-y-2">
                {review.comments.map(c => (
                  <div
                    key={c.id}
                    className="flex items-start gap-2.5 p-2.5 bg-[#12141F] rounded-xl border border-[#2A2F45]/50 text-xs"
                  >
                    <img
                      src={c.avatar}
                      alt={c.displayName}
                      className="w-7 h-7 rounded-full object-cover shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between text-[11px] mb-0.5">
                        <span className="font-semibold text-white">{c.displayName}</span>
                        <span className="text-slate-400 font-mono">{c.createdAt}</span>
                      </div>
                      <p className="text-slate-300 leading-normal">{c.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-slate-400 italic py-1">
                No replies yet. Join the conversation below.
              </div>
            )}

            {/* Input Form */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={commentInputs[item.id] || ''}
                onChange={e =>
                  setCommentInputs(prev => ({ ...prev, [item.id]: e.target.value }))
                }
                onKeyDown={e => {
                  if (e.key === 'Enter') handleSendComment(item);
                }}
                placeholder="Share your thoughts on this review..."
                className="flex-1 bg-[#12141F] border border-[#2A2F45] focus:border-indigo-500 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 outline-none"
              />
              <button
                type="button"
                onClick={() => handleSendComment(item)}
                className="p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-colors cursor-pointer shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  /**
   * Render Social List Update Feed Card
   */
  function renderActivityCard(item: UnifiedFeedItem, act: SocialActivity) {
    const isCommentsOpen = !!expandedComments[item.id];
    const hasLiked = act.likes.includes(currentUser.id);
    const isOwnActivity = act.userId === currentUser.id;

    // Friendly descriptive headline
    const renderActivityBadge = () => {
      switch (act.type) {
        case 'progress_update':
          return (
            <span className="text-indigo-400 font-medium">
              Watched Episode {act.progress}{' '}
              {act.totalProgress ? `of ${act.totalProgress}` : ''}
            </span>
          );
        case 'completed':
          return <span className="text-emerald-400 font-medium">Completed series</span>;
        case 'status_update':
          return <span className="text-cyan-400 font-medium">Updated watch status</span>;
        case 'rated':
          return (
            <span className="text-amber-400 font-medium">
              Rated ★ {act.score} / 10
            </span>
          );
        case 'favorite':
          return <span className="text-pink-400 font-medium">Added to favorites</span>;
        case 'reviewed':
          return <span className="text-indigo-400 font-medium">Published review</span>;
        default:
          return <span className="text-slate-300 font-medium">List update</span>;
      }
    };

    return (
      <div
        key={item.id}
        className="bg-[#181A26] border border-[#2A2F45] rounded-2xl p-5 space-y-4 shadow-lg hover:border-slate-600/70 transition-colors"
      >
        {/* User Header */}
        <div className="flex items-center justify-between">
          <div
            onClick={() => handleSelectUser(act.userId)}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <img
              src={act.avatar}
              alt={act.displayName}
              onError={e => {
                (e.currentTarget as HTMLImageElement).src =
                  'https://cdn.myanimelist.net/images/characters/15/422168.jpg';
              }}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500/30 group-hover:ring-indigo-400 transition-all"
            />
            <div>
              <div className="text-xs font-bold text-white group-hover:text-indigo-400 transition-colors flex items-center gap-1.5">
                <span>{act.displayName}</span>
                {isOwnActivity && (
                  <span className="text-[10px] text-indigo-400 font-mono">(You)</span>
                )}
              </div>
              <div className="text-[11px] text-slate-400 font-mono">
                @{act.username} · {act.timestamp}
              </div>
            </div>
          </div>

          {/* Activity Type Indicator */}
          <div className="text-xs font-mono">{renderActivityBadge()}</div>
        </div>

        {/* Media Preview Card */}
        <div
          onClick={() => handleSelectMedia(act.mediaId)}
          className="flex items-start gap-3.5 bg-[#12141F] p-3.5 rounded-xl border border-[#2A2F45]/60 hover:border-indigo-500/40 cursor-pointer transition-colors group"
        >
          <img
            src={act.mediaCover}
            alt={act.mediaTitle}
            onError={e => {
              (e.currentTarget as HTMLImageElement).src =
                '/src/assets/images/anime_card_nebula_1793517807647.jpg';
            }}
            className="w-12 h-16 object-cover rounded-lg shrink-0 shadow-md group-hover:scale-105 transition-transform bg-slate-900"
          />
          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold text-white group-hover:text-indigo-400 transition-colors truncate">
              {act.mediaTitle}
            </div>

            {/* Progress Bar if Progress Update */}
            {act.progress && (
              <div className="mt-2 space-y-1">
                <div className="flex justify-between text-[11px] text-slate-300 font-mono">
                  <span>Progress</span>
                  <span>
                    {act.progress} / {act.totalProgress || '?'} eps
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-[#1F2335] overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full"
                    style={{
                      width: `${Math.min(
                        100,
                        Math.round((act.progress / (act.totalProgress || act.progress)) * 100)
                      )}%`
                    }}
                  />
                </div>
              </div>
            )}

            {/* Rating score line */}
            {act.score && !act.progress && (
              <div className="text-[11px] text-amber-300 font-mono mt-1 flex items-center gap-1">
                <Star className="w-3 h-3 fill-current" />
                <span>Personal Score: {act.score} / 10</span>
              </div>
            )}

            {/* Snippet */}
            {act.reviewSnippet && (
              <p className="text-xs text-slate-300 italic mt-2 line-clamp-2 border-l-2 border-indigo-500/60 pl-2">
                "{act.reviewSnippet}"
              </p>
            )}
          </div>
        </div>

        {/* Social Actions Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-[#2A2F45]/40">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => {
                triggerHaptic();
                likeActivity(act.id);
              }}
              className={`flex items-center gap-1.5 text-xs font-medium transition-colors cursor-pointer ${
                hasLiked ? 'text-rose-400 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Heart
                className={`w-3.5 h-3.5 ${hasLiked ? 'fill-rose-400 text-rose-400' : ''}`}
              />
              <span>Like ({act.likes.length})</span>
            </button>

            <button
              type="button"
              onClick={() => toggleComments(item.id)}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white font-medium transition-colors cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Comments ({act.comments.length})</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => handleShare(item.id)}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="font-mono text-[10px]">
              {copiedId === item.id ? 'Copied!' : 'Share'}
            </span>
          </button>
        </div>

        {/* Expandable Comments Drawer */}
        {isCommentsOpen && (
          <div className="pt-3 border-t border-[#2A2F45]/60 space-y-3">
            {act.comments.length > 0 ? (
              <div className="space-y-2">
                {act.comments.map(c => (
                  <div
                    key={c.id}
                    className="flex items-start gap-2.5 p-2.5 bg-[#12141F] rounded-xl border border-[#2A2F45]/50 text-xs"
                  >
                    <img
                      src={c.avatar}
                      alt={c.displayName}
                      className="w-7 h-7 rounded-full object-cover shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between text-[11px] mb-0.5">
                        <span className="font-semibold text-white">{c.displayName}</span>
                        <span className="text-slate-400 font-mono">{c.timestamp}</span>
                      </div>
                      <p className="text-slate-300 leading-normal">{c.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-slate-400 italic py-1">
                No comments yet. Start the conversation!
              </div>
            )}

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={commentInputs[item.id] || ''}
                onChange={e =>
                  setCommentInputs(prev => ({ ...prev, [item.id]: e.target.value }))
                }
                onKeyDown={e => {
                  if (e.key === 'Enter') handleSendComment(item);
                }}
                placeholder="Leave a comment on this update..."
                className="flex-1 bg-[#12141F] border border-[#2A2F45] focus:border-indigo-500 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 outline-none"
              />
              <button
                type="button"
                onClick={() => handleSendComment(item)}
                className="p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-colors cursor-pointer shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
};
