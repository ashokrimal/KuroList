/**
 * CollectionsView - Community & Personal Curated Anime & Manga Collections
 * Features custom watchlist creation, multi-item preview collages,
 * detail inspector, and full skeleton loading.
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  Layers,
  Plus,
  Search,
  Sparkles,
  Share2,
  Lock,
  Globe,
  Film,
  Bookmark,
  Check,
  ChevronRight,
  ExternalLink,
  Trash2,
  Tv,
  BookOpen
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CustomCollection, MediaItem } from '../types';
import { CollectionsSkeleton } from '../components/SkeletonLoader';
import { triggerHaptic } from '../utils/haptics';

export const CollectionsView: React.FC = () => {
  const {
    collections,
    createCollection,
    mediaItems,
    currentUser,
    otherUsers,
    setSelectedMedia,
    openAddToListModal,
    setActiveProfileViewUser,
    setActiveView,
    showToast
  } = useApp();

  const [isLoading, setIsLoading] = useState(true);
  const [filterTab, setFilterTab] = useState<'all' | 'mine' | 'community'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState<CustomCollection | null>(null);

  // New Collection Form State
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newIsPublic, setNewIsPublic] = useState(true);
  const [selectedMediaIds, setSelectedMediaIds] = useState<string[]>([]);
  const [mediaPickerSearch, setMediaPickerSearch] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 240);
    return () => clearTimeout(timer);
  }, []);

  // Filter collections
  const filteredCollections = useMemo(() => {
    return collections.filter(col => {
      if (filterTab === 'mine' && col.userId !== currentUser.id) return false;
      if (filterTab === 'community' && col.userId === currentUser.id) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = col.title.toLowerCase().includes(q);
        const matchesDesc = col.description.toLowerCase().includes(q);
        const matchesUser = col.username.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc && !matchesUser) return false;
      }

      return true;
    });
  }, [collections, filterTab, searchQuery, currentUser.id]);

  // Media items filtered for the picker inside Create Modal
  const pickerMediaItems = useMemo(() => {
    if (!mediaPickerSearch.trim()) return mediaItems.slice(0, 16);
    const q = mediaPickerSearch.toLowerCase();
    return mediaItems.filter(m => m.title.toLowerCase().includes(q) || m.genres.some(g => g.toLowerCase().includes(q)));
  }, [mediaItems, mediaPickerSearch]);

  const handleToggleSelectMedia = (id: string) => {
    triggerHaptic();
    setSelectedMediaIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      showToast('Please provide a collection title');
      return;
    }
    if (selectedMediaIds.length === 0) {
      showToast('Please select at least 1 anime or manga');
      return;
    }

    createCollection(newTitle, newDesc, selectedMediaIds, newIsPublic);
    setIsCreateModalOpen(false);
    setNewTitle('');
    setNewDesc('');
    setSelectedMediaIds([]);
    setMediaPickerSearch('');
  };

  const handleShare = (col: CustomCollection) => {
    triggerHaptic();
    navigator.clipboard?.writeText(window.location.href);
    showToast(`Collection link copied to clipboard!`);
  };

  if (isLoading) {
    return <CollectionsSkeleton />;
  }

  return (
    <div className="space-y-8 pb-16">
      {/* 1. View Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Layers className="w-6 h-6 text-indigo-400" />
            Curated Collections & Anthologies
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Discover community-curated tier lists, thematic marathons, and essential staff selections
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            triggerHaptic();
            setIsCreateModalOpen(true);
          }}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-indigo-600/30 transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create Collection</span>
        </button>
      </div>

      {/* 2. Controls: Filter Tabs & Instant Search */}
      <div className="bg-[#181A26] border border-[#2A2F45] rounded-2xl p-4 shadow-lg flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Filter Navigation */}
        <div className="flex items-center gap-1.5 p-1 bg-[#131520] border border-[#2A2F45]/60 rounded-xl overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => {
              triggerHaptic();
              setFilterTab('all');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer shrink-0 ${
              filterTab === 'all'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-[#181A26]'
            }`}
          >
            All Collections ({collections.length})
          </button>
          <button
            type="button"
            onClick={() => {
              triggerHaptic();
              setFilterTab('community');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer shrink-0 ${
              filterTab === 'community'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-[#181A26]'
            }`}
          >
            Community Picks
          </button>
          <button
            type="button"
            onClick={() => {
              triggerHaptic();
              setFilterTab('mine');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer shrink-0 ${
              filterTab === 'mine'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-[#181A26]'
            }`}
          >
            My Collections ({collections.filter(c => c.userId === currentUser.id).length})
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search collections..."
            className="w-full bg-[#131520] border border-[#2A2F45] focus:border-indigo-500 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 outline-none transition-colors"
          />
        </div>
      </div>

      {/* 3. Collections Grid */}
      {filteredCollections.length === 0 ? (
        <div className="bg-[#181A26] border border-[#2A2F45] rounded-2xl p-12 text-center space-y-3">
          <Layers className="w-10 h-10 text-slate-500 mx-auto" />
          <h3 className="text-sm font-bold text-white">No collections found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {searchQuery
              ? `No collections matching "${searchQuery}". Try different keywords.`
              : 'Be the first to curate a custom anime or manga anthology!'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCollections.map(col => {
            const author =
              col.userId === currentUser.id
                ? currentUser
                : otherUsers.find(u => u.id === col.userId) || {
                    displayName: col.username,
                    username: col.username,
                    avatar: 'https://cdn.myanimelist.net/images/characters/15/422168.jpg'
                  };

            // Get media objects for thumbnails
            const colMediaItems = col.itemIds
              .map(id => mediaItems.find(m => m.id === id))
              .filter(Boolean) as MediaItem[];

            return (
              <div
                key={col.id}
                className="bg-[#181A26] border border-[#2A2F45] hover:border-slate-500/80 rounded-2xl overflow-hidden shadow-xl transition-all flex flex-col group"
              >
                {/* Poster Collage Header */}
                <div
                  onClick={() => setSelectedCollection(col)}
                  className="h-44 bg-[#12141F] relative cursor-pointer overflow-hidden grid grid-cols-3 gap-1 p-1 bg-gradient-to-b from-[#181A26] to-[#12141F]"
                >
                  {colMediaItems.slice(0, 3).map((item, idx) => (
                    <div key={item.id} className="relative h-full overflow-hidden rounded-lg">
                      <img
                        src={item.coverImage}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    </div>
                  ))}

                  {/* Overlaid Count Badge */}
                  <div className="absolute bottom-2.5 right-2.5 px-2.5 py-1 bg-[#0F1016]/90 border border-white/10 backdrop-blur-md rounded-lg text-[10px] font-mono text-white flex items-center gap-1">
                    <Film className="w-3 h-3 text-indigo-400" />
                    <span>{col.itemIds.length} Titles</span>
                  </div>
                </div>

                {/* Content Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <div
                        onClick={() => {
                          const targetUser = otherUsers.find(u => u.id === col.userId) || currentUser;
                          setActiveProfileViewUser(targetUser as any);
                          setActiveView('profile');
                        }}
                        className="flex items-center gap-2 cursor-pointer hover:text-indigo-400 transition-colors"
                      >
                        <img
                          src={author.avatar}
                          alt={author.displayName}
                          className="w-5 h-5 rounded-full object-cover"
                        />
                        <span className="font-medium truncate">{author.displayName}</span>
                      </div>

                      <span className="font-mono text-[10px]">{col.createdAt}</span>
                    </div>

                    <h3
                      onClick={() => setSelectedCollection(col)}
                      className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors cursor-pointer line-clamp-1"
                    >
                      {col.title}
                    </h3>

                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {col.description || 'A hand-curated collection of top tier anime and manga.'}
                    </p>
                  </div>

                  {/* Footer Action Strip */}
                  <div className="pt-3 border-t border-[#2A2F45]/50 flex items-center justify-between text-xs">
                    <button
                      type="button"
                      onClick={() => setSelectedCollection(col)}
                      className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <span>Explore Titles</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleShare(col)}
                      className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-[#12141F] transition-colors cursor-pointer"
                      title="Share Collection"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 4. Collection Inspector Modal */}
      {selectedCollection && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#181A26] border border-[#2A2F45] rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-6 border-b border-[#2A2F45] flex items-start justify-between gap-4">
              <div>
                <span className="text-[10px] text-indigo-400 font-mono uppercase tracking-wider">
                  Curated Collection
                </span>
                <h2 className="text-lg font-bold text-white mt-0.5">
                  {selectedCollection.title}
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  {selectedCollection.description}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedCollection(null)}
                className="w-8 h-8 rounded-full bg-[#12141F] border border-[#2A2F45] text-slate-400 hover:text-white flex items-center justify-center text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Scrollable Items List */}
            <div className="p-6 overflow-y-auto space-y-3 flex-1 no-scrollbar">
              {selectedCollection.itemIds.map((itemId, idx) => {
                const item = mediaItems.find(m => m.id === itemId);
                if (!item) return null;

                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3.5 bg-[#12141F] border border-[#2A2F45]/60 rounded-2xl hover:border-indigo-500/50 transition-colors group"
                  >
                    <div
                      onClick={() => {
                        setSelectedMedia(item);
                        setSelectedCollection(null);
                      }}
                      className="flex items-center gap-3.5 cursor-pointer min-w-0 flex-1"
                    >
                      <span className="font-mono text-xs font-bold text-slate-500 w-5">
                        #{idx + 1}
                      </span>
                      <img
                        src={item.coverImage}
                        alt={item.title}
                        className="w-11 h-15 object-cover rounded-lg shrink-0 shadow-md group-hover:scale-105 transition-transform"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-white group-hover:text-indigo-400 transition-colors truncate">
                          {item.title}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono mt-0.5 flex items-center gap-2">
                          <span className="capitalize">{item.type}</span>
                          <span>·</span>
                          <span>★ {item.score || '8.5'}</span>
                          <span>·</span>
                          <span className="truncate">{item.genres.slice(0, 2).join(', ')}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pl-3">
                      <button
                        type="button"
                        onClick={() => openAddToListModal(item)}
                        className="px-3 py-1.5 bg-[#181A26] hover:bg-indigo-600 hover:text-white border border-[#2A2F45] text-slate-300 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                        title="Add to My Watchlist"
                      >
                        <Bookmark className="w-3 h-3" />
                        <span className="hidden sm:inline">Track</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-[#2A2F45] bg-[#12141F] flex items-center justify-between text-xs">
              <span className="text-slate-400 font-mono">
                {selectedCollection.itemIds.length} titles in this collection
              </span>
              <button
                type="button"
                onClick={() => setSelectedCollection(null)}
                className="px-4 py-2 bg-[#181A26] hover:bg-[#1F2335] text-white rounded-xl font-semibold cursor-pointer transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Create Collection Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateSubmit}
            className="bg-[#181A26] border border-[#2A2F45] rounded-3xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
          >
            {/* Header */}
            <div className="p-6 border-b border-[#2A2F45] flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  Create New Anime Collection
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Curate your personal masterpiece lists and share with the community
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#12141F] border border-[#2A2F45] text-slate-400 hover:text-white flex items-center justify-center text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Form Fields */}
            <div className="p-6 overflow-y-auto space-y-4 flex-1 no-scrollbar">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Collection Title *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="e.g., God-Tier Sakuga Fights or Melancholic Rainy Days"
                  className="w-full bg-[#12141F] border border-[#2A2F45] focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={newDesc}
                  onChange={e => setNewDesc(e.target.value)}
                  placeholder="Tell fellow fans why this collection is special..."
                  className="w-full bg-[#12141F] border border-[#2A2F45] focus:border-indigo-500 rounded-xl p-3 text-xs text-white outline-none resize-none"
                />
              </div>

              {/* Media Picker */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-400">
                    Select Anime or Manga ({selectedMediaIds.length} selected) *
                  </label>
                </div>

                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={mediaPickerSearch}
                    onChange={e => setMediaPickerSearch(e.target.value)}
                    placeholder="Filter anime to add..."
                    className="w-full bg-[#12141F] border border-[#2A2F45] rounded-xl pl-8 pr-3 py-1.5 text-xs text-white outline-none"
                  />
                </div>

                {/* Items Selection Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-1 bg-[#12141F] rounded-xl border border-[#2A2F45]/50 no-scrollbar">
                  {pickerMediaItems.map(item => {
                    const isSelected = selectedMediaIds.includes(item.id);

                    return (
                      <div
                        key={item.id}
                        onClick={() => handleToggleSelectMedia(item.id)}
                        className={`flex items-center gap-2.5 p-2 rounded-lg cursor-pointer border transition-colors ${
                          isSelected
                            ? 'bg-indigo-600/20 border-indigo-500/60 text-white'
                            : 'bg-[#181A26] border-[#2A2F45]/40 text-slate-300 hover:border-slate-500'
                        }`}
                      >
                        <img
                          src={item.coverImage}
                          alt={item.title}
                          className="w-8 h-10 object-cover rounded shrink-0"
                        />
                        <div className="min-w-0 flex-1 text-left">
                          <div className="text-xs font-semibold truncate">{item.title}</div>
                          <div className="text-[10px] text-slate-400 capitalize">{item.type}</div>
                        </div>
                        <div
                          className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 ${
                            isSelected
                              ? 'bg-indigo-600 border-indigo-400 text-white'
                              : 'border-[#2A2F45]'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Visibility Toggle */}
              <div className="flex items-center justify-between p-3 bg-[#12141F] rounded-xl border border-[#2A2F45]/60">
                <div className="flex items-center gap-2 text-xs">
                  {newIsPublic ? (
                    <Globe className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Lock className="w-4 h-4 text-slate-400" />
                  )}
                  <div>
                    <div className="font-semibold text-white">
                      {newIsPublic ? 'Public Collection' : 'Private Collection'}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {newIsPublic
                        ? 'Visible to all community members'
                        : 'Only visible to you on your profile'}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setNewIsPublic(!newIsPublic)}
                  className="px-3 py-1 bg-[#181A26] hover:bg-[#1F2335] text-xs font-semibold rounded-lg text-slate-300 border border-[#2A2F45] cursor-pointer"
                >
                  {newIsPublic ? 'Make Private' : 'Make Public'}
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-[#2A2F45] bg-[#12141F] flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-colors cursor-pointer"
              >
                Publish Collection (+100 XP)
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
