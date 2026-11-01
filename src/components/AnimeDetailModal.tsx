/**
 * Anime & Manga Detailed Modal Page
 * Comprehensive view with banner, characters, staff, reviews, recommendations, and list controls
 */

import React, { useState } from 'react';
import {
  X,
  Star,
  Bookmark,
  Heart,
  Play,
  Calendar,
  Clock,
  Sparkles,
  MessageSquare,
  ThumbsUp,
  Share2,
  ExternalLink,
  Plus,
  Tv
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { WATCH_PROVIDERS } from './StreamingSyncModal';

export const AnimeDetailModal: React.FC = () => {
  const {
    selectedMedia,
    setSelectedMedia,
    getLibraryEntry,
    openAddToListModal,
    openReviewModal,
    reviews,
    likeReview,
    toggleFavorite,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<'about' | 'characters' | 'reviews' | 'trailer'>('about');

  if (!selectedMedia) return null;

  const entry = getLibraryEntry(selectedMedia.id);
  const mediaReviews = reviews.filter(r => r.mediaId === selectedMedia.id);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    showToast('Copied title link to clipboard!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-[#181A26] border border-[#2A2F45] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Close Button */}
        <button
          onClick={() => setSelectedMedia(null)}
          className="absolute top-4 right-4 z-20 p-2 text-white/80 hover:text-white bg-black/60 hover:bg-black/80 backdrop-blur-md rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable Container */}
        <div className="overflow-y-auto overflow-x-hidden flex-1">
          {/* Header Banner */}
          <div className="relative h-56 sm:h-72 w-full overflow-hidden bg-slate-950">
            <img
              src={selectedMedia.bannerImage || selectedMedia.coverImage}
              alt={selectedMedia.title}
              onError={e => {
                (e.currentTarget as HTMLImageElement).src = '/src/assets/images/hero_cinematic_anime_1793517807898.jpg';
              }}
              className="w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#181A26] via-[#181A26]/50 to-transparent" />

            {/* Trailer preview floating trigger if available */}
            {selectedMedia.trailerUrl && (
              <a
                href={selectedMedia.trailerUrl}
                target="_blank"
                rel="noreferrer"
                className="absolute bottom-4 right-4 px-3 py-1.5 bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/20 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
              >
                <Play className="w-3.5 h-3.5 fill-white text-white" />
                Watch Trailer
              </a>
            )}
          </div>

          {/* Hero Content Section */}
          <div className="px-6 pb-6 -mt-24 sm:-mt-28 relative z-10">
            <div className="flex flex-col sm:flex-row items-start gap-6">
              {/* Poster Card */}
              <div className="w-36 sm:w-44 shrink-0 aspect-[3/4] rounded-xl overflow-hidden shadow-2xl border-2 border-[#2A2F45] bg-slate-900 mx-auto sm:mx-0">
                <img
                  src={selectedMedia.coverImage}
                  alt={selectedMedia.title}
                  onError={e => {
                    (e.currentTarget as HTMLImageElement).src = '/src/assets/images/anime_card_nebula_1793517807647.jpg';
                  }}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Title & Key Highlights */}
              <div className="flex-1 min-w-0 text-center sm:text-left">
                {/* Titles */}
                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-tight">
                  {selectedMedia.title}
                </h1>
                {selectedMedia.titleJapanese && (
                  <p className="text-xs text-slate-400 mt-1 font-sans">{selectedMedia.titleJapanese}</p>
                )}

                {/* Score and Stats Row (Zero-pill text styling) */}
                <div className="mt-3 flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-slate-300">
                  <div className="flex items-center gap-1 text-amber-300 font-semibold tabular-nums">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span>{selectedMedia.score}</span>
                    <span className="text-slate-400 font-normal">/ 10</span>
                  </div>
                  <span className="text-slate-600">·</span>
                  <span className="tabular-nums font-mono text-indigo-300 font-semibold">Rank #{selectedMedia.rank}</span>
                  <span className="text-slate-600">·</span>
                  <span className="text-slate-400">{selectedMedia.members?.toLocaleString()} members</span>
                  <span className="text-slate-600">·</span>
                  <span className="text-slate-400 capitalize">{selectedMedia.status}</span>
                </div>

                {/* Action CTA buttons */}
                <div className="mt-5 flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                  <button
                    onClick={() => openAddToListModal(selectedMedia)}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-lg shadow-indigo-600/25 transition-all"
                  >
                    <Bookmark className="w-4 h-4" />
                    {entry ? `Status: ${entry.status.replace('_', ' ')} (${entry.progress}/${entry.totalProgress})` : 'Add to Library'}
                  </button>

                  <button
                    onClick={() => openReviewModal(selectedMedia)}
                    className="px-3.5 py-2 bg-[#1F2335] hover:bg-[#2A2F45] text-slate-200 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
                    Review
                  </button>

                  <button
                    onClick={() => {
                      if (entry) {
                        toggleFavorite(selectedMedia.id);
                      } else {
                        openAddToListModal(selectedMedia);
                      }
                    }}
                    className={`p-2 rounded-xl border transition-colors ${
                      entry?.isFavorite
                        ? 'bg-rose-500/20 border-rose-500/50 text-rose-400'
                        : 'bg-[#1F2335] border-transparent text-slate-300 hover:text-white'
                    }`}
                    title="Toggle Favorite"
                  >
                    <Heart className={`w-4 h-4 ${entry?.isFavorite ? 'fill-rose-500' : ''}`} />
                  </button>

                  <button
                    onClick={handleShare}
                    className="p-2 bg-[#1F2335] hover:bg-[#2A2F45] text-slate-300 hover:text-white rounded-xl transition-colors"
                    title="Share title"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Navigation Tabs for Details */}
            <div className="mt-8 border-b border-[#2A2F45] flex items-center gap-6 text-xs font-medium">
              <button
                onClick={() => setActiveTab('about')}
                className={`pb-3 transition-colors relative ${
                  activeTab === 'about' ? 'text-indigo-400 font-semibold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Overview & Details
                {activeTab === 'about' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 rounded-full" />}
              </button>
              <button
                onClick={() => setActiveTab('characters')}
                className={`pb-3 transition-colors relative ${
                  activeTab === 'characters' ? 'text-indigo-400 font-semibold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Characters & Cast
                {activeTab === 'characters' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 rounded-full" />}
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`pb-3 transition-colors relative ${
                  activeTab === 'reviews' ? 'text-indigo-400 font-semibold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Community Reviews ({mediaReviews.length})
                {activeTab === 'reviews' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 rounded-full" />}
              </button>
            </div>

            {/* Tab 1: Overview */}
            {activeTab === 'about' && (
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                  {/* Synopsis */}
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                      Synopsis
                    </h3>
                    <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-line">
                      {selectedMedia.synopsis}
                    </p>
                  </div>

                  {/* Watch on Streaming Providers */}
                  <div className="p-4 bg-[#131520] border border-[#2A2F45] rounded-2xl space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Tv className="w-4 h-4 text-indigo-400" />
                        <h4 className="text-xs font-bold text-white">Watch On Streaming Providers</h4>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">Auto-Track Progress</span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {WATCH_PROVIDERS.map(prov => (
                        <a
                          key={prov.id}
                          href={prov.searchUrl(selectedMedia.title)}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 bg-[#181A26] border border-[#2A2F45] hover:border-indigo-400 text-slate-200 hover:text-white transition-all shadow-sm group"
                        >
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: prov.color }}
                          />
                          <span>{prov.name}</span>
                          <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-indigo-400" />
                        </a>
                      ))}
                    </div>
                  </div>

                  {/* Recommendations */}
                  {selectedMedia.recommendations && selectedMedia.recommendations.length > 0 && (
                    <div>
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                        If you loved this, check out
                      </h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {selectedMedia.recommendations.map(rec => (
                          <div
                            key={rec.id}
                            className="bg-[#131520] border border-[#2A2F45] rounded-xl p-2.5 flex items-center gap-2.5"
                          >
                            <img src={rec.coverImage} alt={rec.title} className="w-10 h-14 object-cover rounded-lg shrink-0" />
                            <div className="min-w-0">
                              <h4 className="text-xs font-semibold text-white truncate">{rec.title}</h4>
                              <p className="text-[11px] text-slate-400">★ {rec.score}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Sidebar Details */}
                <div className="bg-[#131520] border border-[#2A2F45] rounded-xl p-4 space-y-3.5 text-xs">
                  <div>
                    <span className="text-slate-400 block mb-0.5">Format</span>
                    <span className="text-white font-medium">{selectedMedia.format}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-0.5">Episodes / Length</span>
                    <span className="text-white font-medium font-mono">
                      {selectedMedia.episodes || selectedMedia.chapters || 'Ongoing'} {selectedMedia.duration ? `(${selectedMedia.duration})` : ''}
                    </span>
                  </div>
                  {selectedMedia.studios && selectedMedia.studios.length > 0 && (
                    <div>
                      <span className="text-slate-400 block mb-0.5">Studio</span>
                      <span className="text-indigo-300 font-medium">{selectedMedia.studios.join(', ')}</span>
                    </div>
                  )}
                  {selectedMedia.authors && selectedMedia.authors.length > 0 && (
                    <div>
                      <span className="text-slate-400 block mb-0.5">Author / Creator</span>
                      <span className="text-indigo-300 font-medium">{selectedMedia.authors.join(', ')}</span>
                    </div>
                  )}
                  <div>
                    <span className="text-slate-400 block mb-0.5">Season & Year</span>
                    <span className="text-white font-medium">{selectedMedia.season || ''} {selectedMedia.year || ''}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-1">Genres</span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedMedia.genres.map(genre => (
                        <span key={genre} className="text-[11px] text-slate-300 bg-[#181A26] px-2 py-0.5 rounded border border-[#2A2F45]">
                          {genre}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Characters */}
            {activeTab === 'characters' && (
              <div className="mt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {(selectedMedia.characters || [
                    { id: 'c1', name: 'Lead Protagonist', role: 'Main', image: selectedMedia.coverImage },
                    { id: 'c2', name: 'Secondary Lead', role: 'Main', image: selectedMedia.coverImage }
                  ]).map(char => (
                    <div
                      key={char.id}
                      className="bg-[#131520] border border-[#2A2F45] rounded-xl p-3 flex items-center gap-3"
                    >
                      <img src={char.image} alt={char.name} className="w-12 h-14 object-cover rounded-lg shrink-0" />
                      <div className="min-w-0 flex-1">
                        <h4 className="text-xs font-semibold text-white truncate">{char.name}</h4>
                        <p className="text-[11px] text-indigo-400">{char.role} Character</p>
                        {char.voiceActor && (
                          <p className="text-[11px] text-slate-400 truncate mt-0.5">
                            VA: {char.voiceActor.name} ({char.voiceActor.language})
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 3: Reviews */}
            {activeTab === 'reviews' && (
              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Community Reviews
                  </h3>
                  <button
                    onClick={() => openReviewModal(selectedMedia)}
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
                  >
                    + Write Your Review
                  </button>
                </div>

                {mediaReviews.length === 0 ? (
                  <div className="bg-[#131520] border border-[#2A2F45] rounded-xl p-8 text-center text-slate-400 text-xs">
                    No community reviews for this title yet. Be the first to write one!
                  </div>
                ) : (
                  mediaReviews.map(review => (
                    <div
                      key={review.id}
                      className="bg-[#131520] border border-[#2A2F45] rounded-xl p-4 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={review.avatar}
                            alt={review.displayName}
                            className="w-7 h-7 rounded-full object-cover"
                          />
                          <div>
                            <span className="text-xs font-semibold text-white">{review.displayName}</span>
                            <span className="text-[11px] text-slate-400 ml-2">@{review.username}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 text-xs font-mono font-bold text-amber-300">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>{review.rating}/10</span>
                        </div>
                      </div>

                      <h4 className="text-sm font-semibold text-white">{review.title}</h4>
                      <p className="text-xs text-slate-300 leading-relaxed">{review.content}</p>

                      {/* Pros & Cons */}
                      {review.pros.length > 0 && (
                        <div className="text-[11px] space-y-1">
                          <div className="text-emerald-400 font-semibold">Strengths:</div>
                          <ul className="list-disc list-inside text-slate-400 pl-1">
                            {review.pros.map((p, i) => <li key={i}>{p}</li>)}
                          </ul>
                        </div>
                      )}

                      <div className="pt-2 border-t border-[#2A2F45]/60 flex items-center justify-between text-xs text-slate-400">
                        <button
                          onClick={() => likeReview(review.id)}
                          className="flex items-center gap-1.5 hover:text-indigo-400 transition-colors"
                        >
                          <ThumbsUp className="w-3.5 h-3.5" />
                          <span>Helpful ({review.helpfulCount})</span>
                        </button>
                        <span>{review.createdAt}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
