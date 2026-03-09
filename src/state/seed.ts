import type {
  AppState,
  DailyPlan,
  DisciplineTracker,
  Habit,
  Project,
  TrackingEntry
} from "../models/types";
import { createId } from "../utils/id";
import { currentISOWeekId, todayISO } from "../utils/dates";

export const APP_STORAGE_KEY = "pps:v1";

function seedHabits(): Habit[] {
  const weekId = currentISOWeekId();
  return [
    {
      id: createId("habit"),
      name: "Lectura",
      category: "Mente",
      type: "WeeklyFrequency",
      weeklyTarget: 7,
      progress: 0,
      progressWeekId: weekId,
      streak: 0
    },
    {
      id: createId("habit"),
      name: "Entrenamiento",
      category: "Cuerpo",
      type: "WeeklyFrequency",
      weeklyTarget: 4,
      progress: 0,
      progressWeekId: weekId,
      streak: 0
    },
    {
      id: createId("habit"),
      name: "Estudio",
      category: "Trabajo",
      type: "WeeklyHours",
      weeklyTarget: 3,
      progress: 0,
      progressWeekId: weekId,
      streak: 0
    },
    {
      id: createId("habit"),
      name: "Gratitud",
      category: "Mente",
      type: "DailyStreak",
      weeklyTarget: 7,
      progress: 0,
      progressWeekId: weekId,
      streak: 0
    }
  ];
}

function seedDiscipline(): DisciplineTracker {
  return {
    id: "pornography",
    name: "Racha de pornografía",
    streakDays: 0
  };
}

function seedTodayPlan(): DailyPlan {
  const date = todayISO();
  return {
    date,
    timeBlocks: [
      { id: createId("tb"), time: "09:00", title: "Planificación" },
      { id: createId("tb"), time: "10:00", title: "Trabajo" },
      { id: createId("tb"), time: "14:00", title: "Creación de contenido" },
      { id: createId("tb"), time: "16:00", title: "Estudio" },
      { id: createId("tb"), time: "18:00", title: "Entrenamiento" }
    ],
    tasks: [
      { id: createId("task"), title: "Planificar el día", done: false, updatedAt: Date.now() },
      { id: createId("task"), title: "Bloque de trabajo profundo", done: false, updatedAt: Date.now() },
      { id: createId("task"), title: "Sesión de entrenamiento", done: false, updatedAt: Date.now() }
    ]
  };
}

function seedProjects(): Project[] {
  const now = Date.now();
  return [
    {
      id: createId("proj"),
      name: "Coaching online",
      status: "In Progress",
      notes: "Oferta, contenido y sistema de seguimiento.",
      tasks: [
        { id: createId("task"), title: "Definir propuesta de valor", done: false, updatedAt: now },
        { id: createId("task"), title: "Plan de contenidos semanal", done: false, updatedAt: now }
      ],
      updatedAt: now
    },
    {
      id: createId("proj"),
      name: "Academia de alto rendimiento juvenil",
      status: "Planning",
      notes: "Currículum, estructura y pilotos.",
      tasks: [{ id: createId("task"), title: "Diseñar programa 4 semanas", done: false, updatedAt: now }],
      updatedAt: now
    },
    {
      id: createId("proj"),
      name: "Mini gimnasio en casa",
      status: "Idea",
      notes: "Lista de equipamiento + layout.",
      tasks: [{ id: createId("task"), title: "Priorizar equipamiento esencial", done: false, updatedAt: now }],
      updatedAt: now
    }
  ];
}

function seedTracking(): TrackingEntry {
  const date = todayISO();
  return {
    date,
    energy: 7,
    focus: 7,
    discipline: 7,
    comment: "Hoy: una cosa clave. Mantén simple.",
    updatedAt: Date.now()
  };
}

export function createSeedState(): AppState {
  const today = todayISO();
  const plan = seedTodayPlan();
  const tracking = seedTracking();

  return {
    version: 1,
    settings: {
      theme: "dark"
    },
    habits: seedHabits(),
    discipline: seedDiscipline(),
    dailyPlansByDate: { [today]: plan },
    projects: seedProjects(),
    trackingByDate: { [today]: tracking },
    weeklyReviewsByWeekId: {},
    habitLogs: []
  };
}

