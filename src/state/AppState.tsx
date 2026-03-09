import React, { createContext, useContext, useEffect, useMemo, useReducer, useState } from "react";
import type {
  AppState,
  DailyPlan,
  Habit,
  HabitLogEntry,
  ISODate,
  Project,
  TrackingEntry,
  WeeklyReview
} from "../models/types";
import { createSeedState, APP_STORAGE_KEY } from "./seed";
import { loadFromStorage, saveToStorage } from "../utils/storage";
import { createId } from "../utils/id";
import { addDaysISO, currentISOWeekId, isYesterday, todayISO } from "../utils/dates";
import { markDailyStreak, markDisciplineClean, reconcileDailyStreak, reconcileDiscipline } from "../utils/streaks";

type Action =
  | { type: "hydrate"; state: AppState }
  | { type: "setTheme"; theme: AppState["settings"]["theme"] }
  | { type: "habits/set"; habits: Habit[] }
  | { type: "habits/add"; habit: Habit }
  | { type: "habits/update"; habit: Habit }
  | { type: "habits/delete"; id: string }
  | { type: "habits/markToday"; id: string; date: ISODate }
  | { type: "habits/unmarkToday"; id: string; date: ISODate }
  | { type: "discipline/cleanToday"; date: ISODate }
  | { type: "discipline/reset" }
  | { type: "dailyPlan/set"; plan: DailyPlan }
  | { type: "projects/set"; projects: Project[] }
  | { type: "projects/add"; project: Project }
  | { type: "projects/update"; project: Project }
  | { type: "projects/delete"; id: string }
  | { type: "tracking/setEntry"; entry: TrackingEntry }
  | { type: "weeklyReview/set"; review: WeeklyReview }
  | { type: "data/resetAll" }
  | { type: "data/replace"; state: AppState };

function ensureWeekProgress(h: Habit, weekId: string): Habit {
  if (h.progressWeekId === weekId) return h;
  return { ...h, progress: 0, progressWeekId: weekId };
}

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "hydrate":
      return action.state;

    case "setTheme":
      return { ...state, settings: { ...state.settings, theme: action.theme } };

    case "habits/set":
      return { ...state, habits: action.habits };

    case "habits/add":
      return { ...state, habits: [action.habit, ...state.habits] };

    case "habits/update":
      return { ...state, habits: state.habits.map((h) => (h.id === action.habit.id ? action.habit : h)) };

    case "habits/delete":
      return { ...state, habits: state.habits.filter((h) => h.id !== action.id) };

    case "habits/markToday": {
      const today = action.date;
      const weekId = currentISOWeekId();
      const logs: HabitLogEntry[] = [];

      const nextHabits = state.habits.map((h) => {
        if (h.id !== action.id) return ensureWeekProgress(h, weekId);

        const base = ensureWeekProgress(h, weekId);
        if (base.lastCompletionDate === today) return base;

        const nextStreak =
          base.lastCompletionDate && isYesterday(base.lastCompletionDate, today) ? base.streak + 1 : 1;

        const next =
          base.type === "DailyStreak"
            ? markDailyStreak(base, today)
            : { ...base, progress: base.progress + 1, lastCompletionDate: today, streak: nextStreak };

        logs.push({
          id: createId("hlog"),
          date: today,
          habitId: base.id,
          action: "marked",
          createdAt: Date.now()
        });

        return next;
      });

      return { ...state, habits: nextHabits, habitLogs: [...logs, ...state.habitLogs] };
    }

    case "habits/unmarkToday": {
      const today = action.date;
      const weekId = currentISOWeekId();

      const nextHabits = state.habits.map((h) => {
        if (h.id !== action.id) return ensureWeekProgress(h, weekId);

        const base = ensureWeekProgress(h, weekId);
        if (base.lastCompletionDate !== today) return base;

        const previousDate = base.streak > 1 ? addDaysISO(today, -1) : undefined;
        const previousStreak = Math.max(base.streak - 1, 0);

        if (base.type === "DailyStreak") {
          return {
            ...base,
            streak: previousStreak,
            lastCompletionDate: previousDate
          };
        }

        return {
          ...base,
          progress: Math.max(base.progress - 1, 0),
          streak: previousStreak,
          lastCompletionDate: previousDate
        };
      });

      return { ...state, habits: nextHabits };
    }

    case "discipline/cleanToday":
      return { ...state, discipline: markDisciplineClean(state.discipline, action.date) };

    case "discipline/reset":
      return { ...state, discipline: { ...state.discipline, streakDays: 0, lastCleanDate: undefined } };

    case "dailyPlan/set":
      return { ...state, dailyPlansByDate: { ...state.dailyPlansByDate, [action.plan.date]: action.plan } };

    case "projects/set":
      return { ...state, projects: action.projects };

    case "projects/add":
      return { ...state, projects: [action.project, ...state.projects] };

    case "projects/update":
      return { ...state, projects: state.projects.map((p) => (p.id === action.project.id ? action.project : p)) };

    case "projects/delete":
      return { ...state, projects: state.projects.filter((p) => p.id !== action.id) };

    case "tracking/setEntry":
      return { ...state, trackingByDate: { ...state.trackingByDate, [action.entry.date]: action.entry } };

    case "weeklyReview/set":
      return {
        ...state,
        weeklyReviewsByWeekId: { ...state.weeklyReviewsByWeekId, [action.review.weekId]: action.review }
      };

    case "data/replace":
      return action.state;

    case "data/resetAll":
      return createSeedState();

    default:
      return state;
  }
}

function reconcileOnLoad(state: AppState): AppState {
  const today = todayISO();
  const weekId = currentISOWeekId();

  const habits = state.habits.map((h) => {
    const w = ensureWeekProgress(h, weekId);
    if (w.type === "DailyStreak") {
      return { ...w, streak: reconcileDailyStreak(w.streak, w.lastCompletionDate, today) };
    }
    return w;
  });

  return {
    ...state,
    habits,
    discipline: reconcileDiscipline(state.discipline, today)
  };
}

type AppStateContextValue = {
  state: AppState;
  actions: {
    setTheme(theme: "light" | "dark"): void;
    resetAll(): void;
    replaceState(next: AppState): void;

    addHabit(h: Omit<Habit, "id">): void;
    updateHabit(h: Habit): void;
    deleteHabit(id: string): void;
    markHabitToday(id: string, date?: ISODate): void;
    unmarkHabitToday(id: string, date?: ISODate): void;

    markCleanToday(date?: ISODate): void;
    resetDiscipline(): void;

    setDailyPlan(plan: DailyPlan): void;
    ensureDailyPlan(date: ISODate): DailyPlan;

    addProject(p: Omit<Project, "id" | "updatedAt">): void;
    updateProject(p: Project): void;
    deleteProject(id: string): void;

    setTracking(entry: Omit<TrackingEntry, "updatedAt">): void;

    setWeeklyReview(review: WeeklyReview): void;
  };
};

const Ctx = createContext<AppStateContextValue | null>(null);

export function AppStateProvider(props: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, createSeedState());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const loaded = loadFromStorage<AppState>(APP_STORAGE_KEY);
    if (loaded.ok && loaded.value) {
      dispatch({ type: "hydrate", state: reconcileOnLoad(loaded.value) });
    } else {
      const seed = createSeedState();
      dispatch({ type: "hydrate", state: reconcileOnLoad(seed) });
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveToStorage(APP_STORAGE_KEY, state);
  }, [state, hydrated]);

  useEffect(() => {
    document.documentElement.dataset.theme = state.settings.theme;
  }, [state.settings.theme]);

  const actions = useMemo<AppStateContextValue["actions"]>(() => {
    return {
      setTheme(theme) {
        dispatch({ type: "setTheme", theme });
      },

      resetAll() {
        dispatch({ type: "data/resetAll" });
      },

      replaceState(next) {
        dispatch({ type: "data/replace", state: next });
      },

      addHabit(h) {
        const weekId = currentISOWeekId();
        dispatch({
          type: "habits/add",
          habit: {
            ...h,
            id: createId("habit"),
            progressWeekId: weekId
          }
        });
      },

      updateHabit(h) {
        dispatch({ type: "habits/update", habit: h });
      },

      deleteHabit(id) {
        dispatch({ type: "habits/delete", id });
      },

      markHabitToday(id, date) {
        dispatch({ type: "habits/markToday", id, date: date ?? todayISO() });
      },

      unmarkHabitToday(id, date) {
        dispatch({ type: "habits/unmarkToday", id, date: date ?? todayISO() });
      },

      markCleanToday(date) {
        dispatch({ type: "discipline/cleanToday", date: date ?? todayISO() });
      },

      resetDiscipline() {
        dispatch({ type: "discipline/reset" });
      },

      setDailyPlan(plan) {
        dispatch({ type: "dailyPlan/set", plan });
      },

      ensureDailyPlan(date) {
        const existing = state.dailyPlansByDate[date];
        if (existing) return existing;
        const fresh: DailyPlan = { date, timeBlocks: [], tasks: [] };
        dispatch({ type: "dailyPlan/set", plan: fresh });
        return fresh;
      },

      addProject(p) {
        dispatch({
          type: "projects/add",
          project: { ...p, id: createId("proj"), updatedAt: Date.now() }
        });
      },

      updateProject(p) {
        dispatch({ type: "projects/update", project: { ...p, updatedAt: Date.now() } });
      },

      deleteProject(id) {
        dispatch({ type: "projects/delete", id });
      },

      setTracking(entry) {
        dispatch({ type: "tracking/setEntry", entry: { ...entry, updatedAt: Date.now() } });
      },

      setWeeklyReview(review) {
        dispatch({ type: "weeklyReview/set", review: { ...review, updatedAt: Date.now() } });
      }
    };
  }, [state.dailyPlansByDate]);

  const value = useMemo<AppStateContextValue>(() => ({ state, actions }), [state, actions]);
  return <Ctx.Provider value={value}>{props.children}</Ctx.Provider>;
}

export function useAppState() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAppState debe usarse dentro de AppStateProvider");
  return ctx;
}