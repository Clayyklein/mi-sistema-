import { useMemo } from "react";
import { useAppState } from "../../state/AppState";
import { addDaysISO, formatLongDateES, todayISO } from "../../utils/dates";
import { Card } from "../shared/Card";
import { PageHeader } from "../shared/PageHeader";
import { ProgressBar } from "../shared/ProgressBar";
import { StreakCard } from "../shared/StreakCard";
import { TaskList } from "../shared/TaskList";

function lastNDates(today: string, n: number) {
  const dates: string[] = [];
  for (let i = n - 1; i >= 0; i--) {
    dates.push(addDaysISO(today, -i));
  }
  return dates;
}

function getDisciplineKey(date: string) {
  return `discipline_${date}`;
}

function getDisciplineState(date: string): "clean" | "alert" | "relapse" | null {
  const saved = localStorage.getItem(getDisciplineKey(date));
  if (!saved) return null;

  try {
    const parsed = JSON.parse(saved);
    return parsed.state ?? null;
  } catch {
    return null;
  }
}

function getDisciplineColor(date: string) {
  const state = getDisciplineState(date);

  if (state === "clean") return "#22c55e";
  if (state === "alert") return "#f59e0b";
  if (state === "relapse") return "#ef4444";
  return "var(--border)";
}

export function DashboardPage() {
  const { state, actions } = useAppState();
  const today = todayISO();
  const plan = actions.ensureDailyPlan(today);
  const tracking = state.trackingByDate[today];

  const weeklyHabits = useMemo(() => {
    return state.habits.map((h) => ({
      id: h.id,
      name: h.name,
      category: h.category,
      progress: h.progress,
      target: h.weeklyTarget,
      already: h.lastCompletionDate === today
    }));
  }, [state.habits, today]);

  const disciplineDates90 = useMemo(() => lastNDates(today, 90), [today]);

  const streakNoPorn = state.discipline.streakDays;
  const streakTraining =
    state.habits.find((h) => h.name.toLowerCase().includes("entrenamiento"))?.streak ?? 0;
  const streakReading =
    state.habits.find((h) => h.name.toLowerCase().includes("lectura"))?.streak ?? 0;

  function goToHistoryDate(date: string) {
    window.location.href = `/history?date=${date}`;
  }

  return (
    <div className="page">
      <PageHeader title="Panel" subtitle={formatLongDateES(today)} />

      <div className="grid2">
        <div className="stack">
          <Card title="Progreso semanal de hábitos">
            <div className="stack">
              {weeklyHabits.length === 0 ? (
                <div className="muted">Crea tus hábitos para ver el progreso semanal.</div>
              ) : (
                weeklyHabits.map((h) => (
                  <div key={h.id} className="stack">
                    <div className="row">
                      <div>
                        <div style={{ fontSize: 13 }}>
                          <strong>{h.name}</strong>{" "}
                          <span className="muted">• {h.category}</span>
                        </div>
                      </div>

                      {h.already ? (
                        <button
                          className="btn btnSmall"
                          onClick={() => actions.unmarkHabitToday(h.id)}
                        >
                          Desmarcar hoy
                        </button>
                      ) : (
                        <button
                          className="btn btnSmall"
                          onClick={() => actions.markHabitToday(h.id)}
                        >
                          Marcar hoy
                        </button>
                      )}
                    </div>

                    <ProgressBar value={h.progress} max={h.target} labelLeft="Esta semana" />
                  </div>
                ))
              )}
            </div>
          </Card>

          <Card title="Tareas de hoy">
            <TaskList
              tasks={plan.tasks}
              onChange={(tasks) => actions.setDailyPlan({ ...plan, tasks })}
              placeholder="Añadir tarea para hoy..."
            />
          </Card>
        </div>

        <div className="stack">
          <div className="grid3">
            <StreakCard
              title="Racha sin porno"
              days={streakNoPorn}
              subtitle="Seguimiento de disciplina"
            />
            <StreakCard
              title="Racha de entrenamiento"
              days={streakTraining}
              subtitle="Días consecutivos"
            />
            <StreakCard
              title="Racha de lectura"
              days={streakReading}
              subtitle="Días consecutivos"
            />
          </div>

          <Card title="Disciplina visual (últimos 90 días)">
            <div className="stack">
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(15, 1fr)",
                  gap: 8,
                  alignItems: "center"
                }}
              >
                {disciplineDates90.map((date) => (
                  <button
                    key={date}
                    title={`Ver historial del ${date}`}
                    onClick={() => goToHistoryDate(date)}
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 5,
                      background: getDisciplineColor(date),
                      border: "1px solid var(--border)",
                      cursor: "pointer",
                      padding: 0
                    }}
                  />
                ))}
              </div>

              <div
                className="row"
                style={{ justifyContent: "flex-start", gap: 12, flexWrap: "wrap", marginTop: 8 }}
              >
                <span className="muted" style={{ fontSize: 12 }}>🟩 Limpio</span>
                <span className="muted" style={{ fontSize: 12 }}>🟨 Alerta</span>
                <span className="muted" style={{ fontSize: 12 }}>🟥 Recaída</span>
                <span className="muted" style={{ fontSize: 12 }}>⬜ Sin marcar</span>
              </div>

              <div className="muted" style={{ fontSize: 12 }}>
                Haz clic en un cuadrado para abrir el historial de ese día.
              </div>
            </div>
          </Card>

          <Card title="Bloques de tiempo de hoy">
            <div className="stack">
              {plan.timeBlocks.length === 0 ? (
                <div className="muted">Añade bloques en Plan diario.</div>
              ) : (
                plan.timeBlocks.map((b) => (
                  <div key={b.id} className="listItem">
                    <span className="badge">
                      <span className="badgeDot" />
                      {b.time}
                    </span>
                    <div style={{ fontSize: 13 }}>
                      <strong>{b.title}</strong>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>

          <Card title="Estado personal">
            {tracking ? (
              <div className="stack">
                <div className="twoCol">
                  <div className="listItem">
                    <strong>Energía</strong>
                    <span className="muted">{tracking.energy}/10</span>
                  </div>
                  <div className="listItem">
                    <strong>Enfoque</strong>
                    <span className="muted">{tracking.focus}/10</span>
                  </div>
                  <div className="listItem">
                    <strong>Disciplina</strong>
                    <span className="muted">{tracking.discipline}/10</span>
                  </div>
                </div>

                <div className="divider" />

                <div>
                  <div className="label">Nota rápida</div>
                  <div className="muted">{tracking.comment || "—"}</div>
                </div>
              </div>
            ) : (
              <div className="muted">Completa tu seguimiento en “Tracking personal”.</div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}