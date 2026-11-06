/**
 * KuroList Streak Engine
 * Tracks consecutive active tracking days, daily goals, and weekly activity.
 */

export interface StreakDay {
  dayName: string; // e.g. 'Mon', 'Tue'
  date: string;    // 'YYYY-MM-DD'
  active: boolean;
  isToday: boolean;
}

export interface StreakState {
  currentStreak: number;
  longestStreak: number;
  todayLogsCount: number;
  dailyGoal: number;
  lastActiveDate: string;
  activityDates: string[]; // List of YYYY-MM-DD when user logged
  weeklyDays: StreakDay[];
}

const STORAGE_KEY = 'kuro_user_streak';

export function getTodayDateString(): string {
  return new Date().toISOString().split('T')[0];
}

export function getYesterdayDateString(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0];
}

export function computeWeeklyDays(activityDates: string[]): StreakDay[] {
  const days: StreakDay[] = [];
  const today = getTodayDateString();
  const dateSet = new Set(activityDates);

  // Generate 7 days ending with today
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });

    days.push({
      dayName,
      date: dateStr,
      active: dateSet.has(dateStr),
      isToday: dateStr === today
    });
  }

  return days;
}

export function getInitialStreakState(): StreakState {
  const today = getTodayDateString();
  const yesterday = getYesterdayDateString();

  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const activityDates: string[] = Array.isArray(parsed.activityDates) ? parsed.activityDates : [];

        // Check if today already logged
        const isTodayActive = activityDates.includes(today);
        const isYesterdayActive = activityDates.includes(yesterday);

        let currentStreak = parsed.currentStreak || 5;

        // If neither today nor yesterday was active, streak was broken unless it was just initialized
        if (!isTodayActive && !isYesterdayActive) {
          // If the last active date was older than yesterday, reset streak
          const lastActive = parsed.lastActiveDate || yesterday;
          const diffDays = Math.floor(
            (new Date(today).getTime() - new Date(lastActive).getTime()) / (1000 * 60 * 60 * 24)
          );
          if (diffDays > 1) {
            currentStreak = 0;
          }
        }

        const todayLogsCount = isTodayActive ? (parsed.todayLogsCount || 2) : 0;
        const dailyGoal = parsed.dailyGoal || 3;
        const longestStreak = Math.max(parsed.longestStreak || 14, currentStreak);

        return {
          currentStreak,
          longestStreak,
          todayLogsCount,
          dailyGoal,
          lastActiveDate: parsed.lastActiveDate || yesterday,
          activityDates,
          weeklyDays: computeWeeklyDays(activityDates)
        };
      }
    } catch (e) {
      console.warn('Failed to parse streak state', e);
    }
  }

  // Sensible default for demo user: 5-day active streak
  const pastDates: string[] = [];
  for (let i = 5; i >= 1; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    pastDates.push(d.toISOString().split('T')[0]);
  }
  pastDates.push(today); // Also active today

  return {
    currentStreak: 6,
    longestStreak: 14,
    todayLogsCount: 2,
    dailyGoal: 3,
    lastActiveDate: today,
    activityDates: pastDates,
    weeklyDays: computeWeeklyDays(pastDates)
  };
}

export function logStreakActivity(current: StreakState): StreakState {
  const today = getTodayDateString();
  const yesterday = getYesterdayDateString();

  const activityDates = current.activityDates.includes(today)
    ? current.activityDates
    : [...current.activityDates, today];

  const wasAlreadyActiveToday = current.lastActiveDate === today;
  let newStreak = current.currentStreak;

  if (!wasAlreadyActiveToday) {
    if (current.lastActiveDate === yesterday || current.currentStreak === 0) {
      newStreak = current.currentStreak + 1;
    } else {
      newStreak = 1;
    }
  }

  const newTodayCount = current.todayLogsCount + 1;
  const newLongest = Math.max(current.longestStreak, newStreak);

  const updated: StreakState = {
    ...current,
    currentStreak: newStreak,
    longestStreak: newLongest,
    todayLogsCount: newTodayCount,
    lastActiveDate: today,
    activityDates,
    weeklyDays: computeWeeklyDays(activityDates)
  };

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to save streak', e);
    }
  }

  return updated;
}
