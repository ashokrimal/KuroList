/**
 * Seasonal Calendar & Weekly Airing Schedule
 * Displays release dates, broadcast times, episode countdowns, and quick-track triggers
 */

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Bell, Bookmark, Play, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MediaItem } from '../types';
import { SeasonalSkeleton } from '../components/SkeletonLoader';
import { fetchWeeklyBroadcastSchedule } from '../services/animeCatalogService';

export const SeasonalCalendarView: React.FC = () => {
  const {
    mediaItems,
    setSelectedMedia,
    openAddToListModal,
    getLibraryEntry,
    showToast
  } = useApp();

  const [isLoading, setIsLoading] = useState(true);
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const;
  const [selectedDay, setSelectedDay] = useState<typeof daysOfWeek[number]>('Saturday');
  const [activeSeason, setActiveSeason] = useState('Current Season Airing Schedule');
  const [weeklySchedule, setWeeklySchedule] = useState<Record<string, MediaItem[]>>({});

  useEffect(() => {
    let isCancelled = false;
    fetchWeeklyBroadcastSchedule()
      .then(schedule => {
        if (!isCancelled && schedule) {
          setWeeklySchedule(schedule);
        }
      })
      .catch(err => {
        console.warn('Could not fetch live schedule:', err);
      })
      .finally(() => {
        if (!isCancelled) setIsLoading(false);
      });

    return () => {
      isCancelled = true;
    };
  }, []);

  if (isLoading) {
    return <SeasonalSkeleton />;
  }

  // Filter airing anime for selected day
  const airingAnime = mediaItems.filter(m => m.type === 'anime');
  const dayAnime = (weeklySchedule[selectedDay] && weeklySchedule[selectedDay].length > 0)
    ? weeklySchedule[selectedDay]
    : airingAnime.filter(m => (m.airingDay || 'Saturday') === selectedDay);

  const handleSetReminder = (anime: MediaItem) => {
    showToast(`Episode alert enabled for ${anime.title}!`);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Calendar className="w-6 h-6 text-indigo-400" />
            Seasonal Airing Calendar
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Track weekly broadcast schedules, premiere countdowns, and episode drops
          </p>
        </div>

        <div className="px-3 py-1.5 bg-[#181A26] border border-[#2A2F45] rounded-xl text-xs font-semibold text-indigo-400">
          Season: {activeSeason}
        </div>
      </div>

      {/* Days of Week Tab Bar */}
      <div className="flex items-center gap-1.5 p-1.5 bg-[#181A26] border border-[#2A2F45] rounded-2xl overflow-x-auto no-scrollbar">
        {daysOfWeek.map(day => {
          const isSelected = selectedDay === day;
          const count = (weeklySchedule[day] && weeklySchedule[day].length > 0)
            ? weeklySchedule[day].length
            : airingAnime.filter(m => (m.airingDay || 'Saturday') === day).length;

          return (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`flex-1 min-w-[100px] py-2.5 px-3 rounded-xl text-xs font-medium transition-all text-center shrink-0 ${
                isSelected
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 font-semibold'
                  : 'text-slate-400 hover:text-white hover:bg-[#1F2335]'
              }`}
            >
              <div>{day}</div>
              <div className={`text-[10px] mt-0.5 ${isSelected ? 'text-indigo-200' : 'text-slate-500'}`}>
                {count} {count === 1 ? 'Show' : 'Shows'}
              </div>
            </button>
          );
        })}
      </div>

      {/* Schedule Listing for Selected Day */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Broadcasting every {selectedDay} (JST)</span>
          <span className="font-mono">{dayAnime.length} active series</span>
        </div>

        {dayAnime.length === 0 ? (
          <div className="bg-[#181A26] border border-[#2A2F45] rounded-2xl p-12 text-center text-slate-400 text-xs">
            No scheduled premieres found for this day. Select another day of the week above.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dayAnime.map(anime => {
              const entry = getLibraryEntry(anime.id);
              const isInLibrary = !!entry;

              return (
                <div
                  key={anime.id}
                  className="bg-[#181A26] border border-[#2A2F45] rounded-2xl p-4 flex gap-4 hover:border-indigo-500/50 transition-all shadow-md group"
                >
                  <img
                    src={anime.coverImage}
                    alt={anime.title}
                    onClick={() => setSelectedMedia(anime)}
                    className="w-20 h-28 object-cover rounded-xl shrink-0 cursor-pointer group-hover:scale-105 transition-transform bg-slate-900"
                  />

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      {/* Broadcast Time & Episode Status */}
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <span className="text-indigo-400 font-mono font-medium flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {anime.airingTime || '23:30 JST'}
                        </span>
                        <span className="text-slate-400 font-mono">
                          Next: Ep {anime.nextEpisode || anime.episodes || 1}
                        </span>
                      </div>

                      <h3
                        onClick={() => setSelectedMedia(anime)}
                        className="text-sm font-bold text-white truncate cursor-pointer hover:text-indigo-400 transition-colors"
                      >
                        {anime.title}
                      </h3>

                      <div className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                        {anime.genres.slice(0, 3).join(' · ')} · {anime.studios.join(', ')}
                      </div>
                    </div>

                    {/* Bottom Actions */}
                    <div className="pt-2 border-t border-[#2A2F45]/50 flex items-center justify-between">
                      <button
                        onClick={() => handleSetReminder(anime)}
                        className="text-[11px] text-slate-400 hover:text-indigo-300 font-medium flex items-center gap-1 transition-colors"
                      >
                        <Bell className="w-3 h-3 text-indigo-400" />
                        Airing Alert
                      </button>

                      <button
                        onClick={() => openAddToListModal(anime)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
                          isInLibrary
                            ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                            : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                        }`}
                      >
                        {isInLibrary ? <Check className="w-3 h-3" /> : <Bookmark className="w-3 h-3" />}
                        {isInLibrary ? 'In List' : 'Track'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
