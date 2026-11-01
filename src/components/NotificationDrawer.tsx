/**
 * Notification Center Component
 * In-app notifications with unread states, action links, and mark as read
 */

import React from 'react';
import { X, Bell, Heart, Users, Award, Calendar, CheckCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const NotificationDrawer: React.FC = () => {
  const {
    isNotificationsOpen,
    setIsNotificationsOpen,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    setActiveView
  } = useApp();

  if (!isNotificationsOpen) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <Heart className="w-4 h-4 text-rose-400 fill-rose-500/20" />;
      case 'follow':
        return <Users className="w-4 h-4 text-indigo-400" />;
      case 'achievement':
        return <Award className="w-4 h-4 text-amber-400" />;
      case 'airing_reminder':
        return <Calendar className="w-4 h-4 text-sky-400" />;
      default:
        return <Bell className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm sm:max-w-md bg-[#181A26] border-l border-[#2A2F45] h-full shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-[#2A2F45] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-semibold text-white">Notifications</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={markAllNotificationsAsRead}
              className="text-[11px] text-slate-400 hover:text-indigo-300 font-medium flex items-center gap-1 transition-colors"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              Mark all read
            </button>
            <button
              onClick={() => setIsNotificationsOpen(false)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-[#1F2335] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Notification List */}
        <div className="flex-1 overflow-y-auto divide-y divide-[#2A2F45]/50">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">
              No notifications yet.
            </div>
          ) : (
            notifications.map(notif => (
              <div
                key={notif.id}
                onClick={() => {
                  markNotificationAsRead(notif.id);
                  if (notif.type === 'airing_reminder') {
                    setActiveView('seasonal');
                  } else if (notif.type === 'achievement') {
                    setActiveView('profile');
                  }
                  setIsNotificationsOpen(false);
                }}
                className={`p-4 flex items-start gap-3 hover:bg-[#1F2335] cursor-pointer transition-colors relative ${
                  !notif.isRead ? 'bg-indigo-950/15' : ''
                }`}
              >
                {!notif.isRead && (
                  <span className="absolute top-4 right-4 w-2 h-2 rounded-full bg-indigo-500" />
                )}

                <div className="mt-0.5 shrink-0 p-2 rounded-lg bg-[#131520] border border-[#2A2F45]">
                  {getIcon(notif.type)}
                </div>

                <div className="min-w-0 flex-1 pr-4">
                  <div className="text-xs font-semibold text-white leading-snug">{notif.title}</div>
                  <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">{notif.description}</p>
                  <span className="text-[10px] text-slate-500 mt-1.5 block font-mono">{notif.createdAt}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
