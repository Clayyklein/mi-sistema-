import type { DisciplineTracker, Habit, ISODate } from "../models/types";
import { isYesterday } from "./dates";

export function reconcileDailyStreak(streak: number, lastDate: ISODate | undefined, today: ISODate): number {
  if (!lastDate) return 0;
  if (lastDate === today) return streak;
  if (isYesterday(lastDate, today)) return streak;
  return 0;
}

export function markDailyStreak(habit: Habit, today: ISODate): Habit {
  if (habit.lastCompletionDate === today) return habit;

  const nextStreak = habit.lastCompletionDate && isYesterday(habit.lastCompletionDate, today)
    ? habit.streak + 1
    : 1;

  return {
    ...habit,
    streak: nextStreak,
    lastCompletionDate: today
  };
}

export function reconcileDiscipline(tracker: DisciplineTracker, today: ISODate): DisciplineTracker {
  if (!tracker.lastCleanDate) return { ...tracker, streakDays: 0 };
  if (tracker.lastCleanDate === today) return tracker;
  if (isYesterday(tracker.lastCleanDate, today)) return tracker;
  return { ...tracker, streakDays: 0 };
}

export function markDisciplineClean(tracker: DisciplineTracker, today: ISODate): DisciplineTracker {
  if (tracker.lastCleanDate === today) return tracker;

  const next = tracker.lastCleanDate && isYesterday(tracker.lastCleanDate, today)
    ? tracker.streakDays + 1
    : 1;

  return {
    ...tracker,
    streakDays: next,
    lastCleanDate: today
  };
}

