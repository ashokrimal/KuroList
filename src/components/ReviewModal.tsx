/**
 * Review Creation Modal
 * Complete review authoring with ratings, pros/cons, spoiler toggle, and markdown-friendly body
 */

import React, { useState } from 'react';
import { X, Star, Plus, Minus, AlertTriangle, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ReviewModal: React.FC = () => {
  const {
    isReviewModalOpen,
    setIsReviewModalOpen,
    reviewModalMedia,
    addReview
  } = useApp();

  const [rating, setRating] = useState<number>(10);
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [pros, setPros] = useState<string[]>(['Masterpiece animation', 'Deep emotional resonance']);
  const [newPro, setNewPro] = useState<string>('');
  const [cons, setCons] = useState<string[]>([]);
  const [newCon, setNewCon] = useState<string>('');
  const [hasSpoilers, setHasSpoilers] = useState<boolean>(false);

  if (!isReviewModalOpen || !reviewModalMedia) return null;

  const handleAddPro = () => {
    if (newPro.trim()) {
      setPros([...pros, newPro.trim()]);
      setNewPro('');
    }
  };

  const handleRemovePro = (index: number) => {
    setPros(pros.filter((_, i) => i !== index));
  };

  const handleAddCon = () => {
    if (newCon.trim()) {
      setCons([...cons, newCon.trim()]);
      setNewCon('');
    }
  };

  const handleRemoveCon = (index: number) => {
    setCons(cons.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    addReview({
      mediaId: reviewModalMedia.id,
      rating,
      title: title.trim(),
      content: content.trim(),
      pros,
      cons,
      hasSpoilers
    });

    setIsReviewModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#181A26] border border-[#2A2F45] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#2A2F45]">
          <div>
            <h3 className="text-sm font-semibold text-white">Write Review</h3>
            <p className="text-xs text-slate-400">for {reviewModalMedia.title}</p>
          </div>
          <button
            onClick={() => setIsReviewModalOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-[#1F2335] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto max-h-[75vh]">
          {/* Rating 1 to 10 */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Score
              </label>
              <div className="flex items-center gap-1 text-xs font-mono font-bold text-amber-400">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{rating} / 10</span>
              </div>
            </div>
            <div className="grid grid-cols-10 gap-1">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(star => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`py-1.5 text-xs font-mono font-semibold rounded-lg border transition-all ${
                    rating >= star
                      ? 'bg-amber-400/20 border-amber-400/50 text-amber-300'
                      : 'bg-[#131520] border-[#2A2F45] text-slate-400 hover:text-white hover:border-slate-500'
                  }`}
                >
                  {star}
                </button>
              ))}
            </div>
          </div>

          {/* Review Headline */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Review Headline
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. A generational meditation on mortality and memory"
              className="w-full bg-[#131520] border border-[#2A2F45] focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none placeholder:text-slate-500"
            />
          </div>

          {/* Review Content */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Detailed Thoughts
            </label>
            <textarea
              required
              rows={5}
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Discuss the animation direction, pacing, character motivations, and thematic impact..."
              className="w-full bg-[#131520] border border-[#2A2F45] focus:border-indigo-500 rounded-xl p-3.5 text-xs text-white outline-none resize-none placeholder:text-slate-500 leading-relaxed"
            />
          </div>

          {/* Pros & Cons Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Pros */}
            <div>
              <label className="block text-xs font-semibold text-emerald-400 mb-1.5">
                Strengths (Pros)
              </label>
              <div className="flex gap-1.5 mb-2">
                <input
                  type="text"
                  value={newPro}
                  onChange={e => setNewPro(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddPro();
                    }
                  }}
                  placeholder="Add a highlight..."
                  className="flex-1 bg-[#131520] border border-[#2A2F45] text-xs text-white rounded-lg px-2.5 py-1.5 outline-none placeholder:text-slate-500"
                />
                <button
                  type="button"
                  onClick={handleAddPro}
                  className="px-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 rounded-lg text-xs"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-1">
                {pros.map((p, i) => (
                  <div key={i} className="flex items-center justify-between text-[11px] text-slate-300 bg-[#131520] px-2.5 py-1 rounded-lg">
                    <span>+ {p}</span>
                    <button type="button" onClick={() => handleRemovePro(i)} className="text-slate-500 hover:text-rose-400">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Cons */}
            <div>
              <label className="block text-xs font-semibold text-rose-400 mb-1.5">
                Critiques (Cons)
              </label>
              <div className="flex gap-1.5 mb-2">
                <input
                  type="text"
                  value={newCon}
                  onChange={e => setNewCon(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddCon();
                    }
                  }}
                  placeholder="Add a critique..."
                  className="flex-1 bg-[#131520] border border-[#2A2F45] text-xs text-white rounded-lg px-2.5 py-1.5 outline-none placeholder:text-slate-500"
                />
                <button
                  type="button"
                  onClick={handleAddCon}
                  className="px-2 bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 rounded-lg text-xs"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-1">
                {cons.map((c, i) => (
                  <div key={i} className="flex items-center justify-between text-[11px] text-slate-300 bg-[#131520] px-2.5 py-1 rounded-lg">
                    <span>- {c}</span>
                    <button type="button" onClick={() => handleRemoveCon(i)} className="text-slate-500 hover:text-rose-400">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Spoiler Warning Toggle */}
          <div className="flex items-center justify-between p-3 bg-[#131520] border border-[#2A2F45] rounded-xl">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <div>
                <span className="text-xs font-semibold text-white">Contains Plot Spoilers</span>
                <p className="text-[11px] text-slate-400">Blur content until clicked by other community members</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={hasSpoilers}
              onChange={e => setHasSpoilers(e.target.checked)}
              className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
            />
          </div>

          {/* Submit CTA */}
          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsReviewModalOpen(false)}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white rounded-xl hover:bg-[#1F2335] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-colors shadow-lg shadow-indigo-600/25 flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              Publish Review
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
