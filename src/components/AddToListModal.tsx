/**
 * Add / Edit to List Modal
 * Allows updating watch/read status, episode counts, scores, and personal review notes
 */

import React, { useState, useEffect } from 'react';
import { X, Star, Heart, Trash2, Plus, Minus, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { LibraryStatus, MediaItem } from '../types';

interface AddToListModalContentProps {
  media: MediaItem;
  onClose: () => void;
}

const AddToListModalContent: React.FC<AddToListModalContentProps> = ({ media, onClose }) => {
  const {
    getLibraryEntry,
    addOrUpdateLibraryEntry,
    removeLibraryEntry,
    openReviewModal
  } = useApp();

  const existingEntry = getLibraryEntry(media.id);
  const isAnime = media.type === 'anime';

  const defaultStatus: LibraryStatus = isAnime ? 'watching' : 'reading';
  const totalUnits = isAnime ? (media.episodes || 12) : (media.chapters || 100);

  const [status, setStatus] = useState<LibraryStatus>(existingEntry?.status || defaultStatus);
  const [progress, setProgress] = useState<number>(existingEntry?.progress ?? (existingEntry ? 0 : 1));
  const [score, setScore] = useState<number>(existingEntry?.score ?? 0);
  const [notes, setNotes] = useState<string>(existingEntry?.notes ?? '');
  const [isFavorite, setIsFavorite] = useState<boolean>(existingEntry?.isFavorite ?? false);

  useEffect(() => {
    if (existingEntry) {
      setStatus(existingEntry.status);
      setProgress(existingEntry.progress);
      setScore(existingEntry.score);
      setNotes(existingEntry.notes || '');
      setIsFavorite(existingEntry.isFavorite);
    } else {
      setStatus(defaultStatus);
      setProgress(1);
      setScore(0);
      setNotes('');
      setIsFavorite(false);
    }
  }, [existingEntry, defaultStatus]);

  const animeStatuses: { id: LibraryStatus; label: string }[] = [
    { id: 'watching', label: 'Watching' },
    { id: 'completed', label: 'Completed' },
    { id: 'on_hold', label: 'On Hold' },
    { id: 'dropped', label: 'Dropped' },
    { id: 'plan_to_watch', label: 'Plan to Watch' }
  ];

  const mangaStatuses: { id: LibraryStatus; label: string }[] = [
    { id: 'reading', label: 'Reading' },
    { id: 'completed', label: 'Completed' },
    { id: 'on_hold', label: 'On Hold' },
    { id: 'dropped', label: 'Dropped' },
    { id: 'plan_to_read', label: 'Plan to Read' }
  ];

  const statuses = isAnime ? animeStatuses : mangaStatuses;

  const handleSave = () => {
    addOrUpdateLibraryEntry({
      mediaId: media.id,
      mediaType: media.type,
      status,
      progress,
      totalProgress: totalUnits,
      score,
      notes,
      isFavorite
    });
    onClose();
  };

  const handleDelete = () => {
    removeLibraryEntry(media.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#181A26] border border-[#2A2F45] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header with thumbnail */}
        <div className="flex items-center justify-between p-4 border-b border-[#2A2F45]">
          <div className="flex items-center gap-3 min-w-0">
            <img
              src={media.coverImage}
              alt={media.title}
              className="w-10 h-14 object-cover rounded-lg shrink-0 bg-slate-900"
            />
            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-white truncate">{media.title}</h3>
              <p className="text-xs text-slate-400">
                {media.format} · {totalUnits} {isAnime ? 'Episodes' : 'Chapters'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-[#1F2335] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Body */}
        <div className="p-5 space-y-5 overflow-y-auto max-h-[75vh]">
          {/* Status Selection Buttons */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Status
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {statuses.map(s => {
                const isSelected = status === s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      setStatus(s.id);
                      if (s.id === 'completed' && progress < totalUnits) {
                        setProgress(totalUnits);
                      }
                    }}
                    className={`px-3 py-2 text-xs font-medium rounded-lg border transition-all text-center whitespace-nowrap ${
                      isSelected
                        ? 'bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-950/40'
                        : 'bg-[#131520] border-[#2A2F45] text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    {s.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Episode / Chapter Progress Stepper */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                {isAnime ? 'Episodes Watched' : 'Chapters Read'}
              </label>
              <button
                type="button"
                onClick={() => setProgress(totalUnits)}
                className="text-[11px] text-indigo-400 hover:text-indigo-300 font-medium"
              >
                Mark all completed
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center bg-[#131520] border border-[#2A2F45] rounded-xl p-1">
                <button
                  type="button"
                  onClick={() => setProgress(Math.max(0, progress - 1))}
                  className="p-2 text-slate-300 hover:text-white hover:bg-[#1F2335] rounded-lg transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <input
                  type="number"
                  min="0"
                  max={totalUnits}
                  value={progress}
                  onChange={e => setProgress(Math.max(0, Math.min(totalUnits, parseInt(e.target.value) || 0)))}
                  className="w-14 text-center bg-transparent font-mono text-white text-sm font-semibold outline-none"
                />
                <button
                  type="button"
                  onClick={() => setProgress(Math.min(totalUnits, progress + 1))}
                  className="p-2 text-slate-300 hover:text-white hover:bg-[#1F2335] rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <span className="text-xs text-slate-400 font-mono">/ {totalUnits} total</span>
            </div>
          </div>

          {/* Personal Rating Score (1 to 10) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Your Rating
              </label>
              <span className="text-xs font-mono font-bold text-amber-400">
                {score > 0 ? `${score} / 10` : 'Not Rated'}
              </span>
            </div>

            <div className="grid grid-cols-10 gap-1">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(star => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setScore(score === star ? 0 : star)}
                  className={`py-1.5 text-xs font-mono font-semibold rounded-lg border transition-all ${
                    score >= star
                      ? 'bg-amber-400/20 border-amber-400/50 text-amber-300'
                      : 'bg-[#131520] border-[#2A2F45] text-slate-400 hover:text-white hover:border-slate-500'
                  }`}
                >
                  {star}
                </button>
              ))}
            </div>
          </div>

          {/* Favorite Toggle */}
          <div className="flex items-center justify-between p-3 bg-[#131520] border border-[#2A2F45] rounded-xl">
            <div className="flex items-center gap-2.5">
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : 'text-slate-400'}`} />
              <div>
                <div className="text-xs font-semibold text-white">Add to Favorites</div>
                <div className="text-[11px] text-slate-400">Showcase this on your profile overview</div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={isFavorite}
              onChange={e => setIsFavorite(e.target.checked)}
              className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
            />
          </div>

          {/* Personal Notes */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Personal Notes
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Memorable episodes, favorite scenes, or thoughts..."
              className="w-full bg-[#131520] border border-[#2A2F45] focus:border-indigo-500 rounded-xl p-3 text-xs text-white outline-none resize-none placeholder:text-slate-500"
            />
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 border-t border-[#2A2F45] flex items-center justify-between gap-3 bg-[#131520]/60">
          <div>
            {existingEntry && (
              <button
                type="button"
                onClick={handleDelete}
                className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 font-medium px-2 py-1.5 rounded-lg hover:bg-rose-500/10 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Remove
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                openReviewModal(media);
              }}
              className="px-3 py-2 text-xs font-medium text-indigo-300 hover:text-white hover:bg-[#1F2335] rounded-xl transition-colors"
            >
              Write Review
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-colors shadow-lg shadow-indigo-600/20 flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              Save Entry
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const AddToListModal: React.FC = () => {
  const { isAddToListOpen, setIsAddToListOpen, listModalMedia } = useApp();

  if (!isAddToListOpen || !listModalMedia) return null;

  return (
    <AddToListModalContent
      media={listModalMedia}
      onClose={() => setIsAddToListOpen(false)}
    />
  );
};

