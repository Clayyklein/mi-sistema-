export type ISODate = string; // YYYY-MM-DD
export type Id = string;

export type HabitType = "WeeklyFrequency" | "WeeklyHours" | "DailyStreak";

export type ProjectStatus = "Idea" | "Planning" | "In Progress" | "Paused" | "Completed";

export interface Habit {
  id: Id;
  name: string;
  category: string;
  type: HabitType;
  weeklyTarget: number;
  progress: number;
  progressWeekId: string; // ISO week id used to reset weekly progress
  streak: number; // for DailyStreak + optional info
  lastCompletionDate?: ISODate;
}

export interface DisciplineTracker {
  id: "pornography";
  name: "Racha de pornografía";
  streakDays: number;
  lastCleanDate?: ISODate;
}

export interface TaskItem {
  id: Id;
  title: string;
  done: boolean;
  updatedAt: number;
}

export interface TimeBlock {
  id: Id;
  time: string; // HH:MM
  title: string;
}

export interface DailyPlan {
  date: ISODate;
  timeBlocks: TimeBlock[];
  tasks: TaskItem[];
}

export interface Project {
  id: Id;
  name: string;
  status: ProjectStatus;
  notes: string;
  tasks: TaskItem[];
  updatedAt: number;
}

export interface TrackingEntry {
  date: ISODate;
  energy: number; // 1-10
  focus: number; // 1-10
  discipline: number; // 1-10
  comment: string;
  updatedAt: number;
}

export interface WeeklyReview {
  weekId: string; // YYYY-Www (ISO week)
  createdAt: number;
  updatedAt: number;
  answers: {
    wentWell: string;
    slowedDown: string;
    learned: string;
    improveNext: string;
    topPrioritiesNext: string;
  };
}

export interface AppSettings {
  theme: "light" | "dark";
}

export interface HabitLogEntry {
  id: Id;
  date: ISODate;
  habitId: Id;
  action: "marked" | "unmarked";
  createdAt: number;
}

export interface AppState {
  version: 1;
  settings: AppSettings;
  habits: Habit[];
  discipline: DisciplineTracker;
  dailyPlansByDate: Record<ISODate, DailyPlan>;
  projects: Project[];
  trackingByDate: Record<ISODate, TrackingEntry>;
  weeklyReviewsByWeekId: Record<string, WeeklyReview>;
  habitLogs: HabitLogEntry[];
}

