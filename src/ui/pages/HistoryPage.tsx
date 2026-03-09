import { useEffect, useMemo, useState } from "react";
import { useAppState } from "../../state/AppState";
import { PageHeader } from "../shared/PageHeader";
import { Card } from "../shared/Card";
import { ExportButton } from "../shared/ExportButton";
import { downloadJson } from "../../utils/export";
import { todayISO } from "../../utils/dates";

function getJournalKey(date: string) {
  return `journal_${date}`;
}

function getDisciplineKey(date: string) {
  return `discipline_${date}`;
}

function getJournalAnswers(date: string): string[] {
  const saved = localStorage.getItem(getJournalKey(date));
  if (!saved) return [];
  try {
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function getDisciplineData(date: string) {
  const saved = localStorage.getItem(getDisciplineKey(date));
  if (!saved) {
    return {
      state: null,
      note: "",
      relapseWhy: "",
      relapseTomorrow: ""
    };
  }

  try {
    const parsed = JSON.parse(saved);
    return {
      state: parsed.state ?? null,
      note: parsed.note ?? "",
      relapseWhy: parsed.relapseWhy ?? "",
      relapseTomorrow: parsed.relapseTomorrow ?? ""
    };
  } catch {
    return {
      state: null,
      note: "",
      relapseWhy: "",
      relapseTomorrow: ""
    };
  }
}

function getDisciplineLabel(value: string | null) {
  if (value === "clean") return "Limpio";
  if (value === "alert") return "Alerta";
  if (value === "relapse") return "Recaída";
  return "Sin marcar";
}

function getISOWeekId(dateString: string) {
  const date = new Date(dateString + "T00:00:00");
  const temp = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = temp.getUTCDay() || 7;
  temp.setUTCDate(temp.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(temp.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((temp.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  return `${temp.getUTCFullYear()}-W${String(weekNo).padStart(2, "0")}`;
}

const JOURNAL_QUESTIONS = [
  "Mis dos ayunos hoy:",
  "Mi primer bloque de enfoque hoy",
  "Expectativa positiva",
  "Declaraciones de creencias",
  "Visualización: mi yo del futuro",
  "¿Cuál es mi tentación número uno hoy?",
  "¿Cómo lo evito?",
  "¿Qué hace el Iván de hoy que el del año pasado no hacía?"
];

function getInitialSelectedDate() {
  const params = new URLSearchParams(window.location.search);
  return params.get("date") || todayISO();
}

export function HistoryPage() {
  const { state } = useAppState();
  const [selectedDate, setSelectedDate] = useState(getInitialSelectedDate());

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const dateFromUrl = params.get("date");
    if (dateFromUrl) {
      setSelectedDate(dateFromUrl);
    }
  }, []);

  const trackingSorted = useMemo(() => {
    return Object.values(state.trackingByDate).sort((a, b) => b.date.localeCompare(a.date));
  }, [state.trackingByDate]);

  const reviewsSorted = useMemo(() => {
    return Object.values(state.weeklyReviewsByWeekId).sort((a, b) => b.weekId.localeCompare(a.weekId));
  }, [state.weeklyReviewsByWeekId]);

  const habitLogsSorted = useMemo(() => {
    return [...state.habitLogs].sort((a, b) => b.createdAt - a.createdAt).slice(0, 80);
  }, [state.habitLogs]);

  const journalAnswers = useMemo(() => getJournalAnswers(selectedDate), [selectedDate]);
  const disciplineData = useMemo(() => getDisciplineData(selectedDate), [selectedDate]);
  const trackingEntry = state.trackingByDate[selectedDate];
  const dailyPlan = state.dailyPlansByDate[selectedDate];

  const completedHabitLogs = useMemo(() => {
    return state.habitLogs.filter((log) => log.date === selectedDate && log.action === "marked");
  }, [state.habitLogs, selectedDate]);

  const weekId = useMemo(() => getISOWeekId(selectedDate), [selectedDate]);
  const weeklyReview = state.weeklyReviewsByWeekId[weekId];

  return (
    <div className="page">
      <PageHeader
        title="Historial"
        subtitle="Registro completo por fecha + exportación."
        actions={
          <>
            <button
              className="btn"
              onClick={() => downloadJson(`mi-sistema-backup-${Date.now()}.json`, state)}
            >
              Exportar JSON
            </button>
            <ExportButton label="Exportar a PDF" />
          </>
        }
      />

      <Card title="Seleccionar fecha">
        <div className="row" style={{ justifyContent: "flex-start", gap: 12, flexWrap: "wrap" }}>
          <input
            className="input"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={{ maxWidth: 220 }}
          />
          <span className="muted">
            Viendo el registro de: <strong>{selectedDate}</strong>
          </span>
        </div>
      </Card>

      <div className="divider" />

      <div className="grid2">
        <Card title="Disciplina personal">
          <div className="stack">
            <div className="row">
              <span className="muted">Estado</span>
              <strong>{getDisciplineLabel(disciplineData.state)}</strong>
            </div>

            {disciplineData.note ? (
              <div>
                <div className="label">Nota</div>
                <div className="muted">{disciplineData.note}</div>
              </div>
            ) : null}

            {disciplineData.relapseWhy ? (
              <div>
                <div className="label">¿Por qué ocurrió?</div>
                <div className="muted">{disciplineData.relapseWhy}</div>
              </div>
            ) : null}

            {disciplineData.relapseTomorrow ? (
              <div>
                <div className="label">¿Qué haré diferente mañana?</div>
                <div className="muted">{disciplineData.relapseTomorrow}</div>
              </div>
            ) : null}

            {!disciplineData.note && !disciplineData.relapseWhy && !disciplineData.relapseTomorrow ? (
              <div className="muted">No hay datos de disciplina para esta fecha.</div>
            ) : null}
          </div>
        </Card>

        <Card title="Tracking personal">
          {trackingEntry ? (
            <div className="stack">
              <div className="row">
                <span className="muted">Energía</span>
                <strong>{trackingEntry.energy}/10</strong>
              </div>
              <div className="row">
                <span className="muted">Enfoque</span>
                <strong>{trackingEntry.focus}/10</strong>
              </div>
              <div className="row">
                <span className="muted">Disciplina</span>
                <strong>{trackingEntry.discipline}/10</strong>
              </div>
              <div>
                <div className="label">Comentario</div>
                <div className="muted">{trackingEntry.comment || "—"}</div>
              </div>
            </div>
          ) : (
            <div className="muted">No hay tracking personal para esta fecha.</div>
          )}
        </Card>
      </div>

      <div className="divider" />

      <Card title="Journaling">
        {journalAnswers.length ? (
          <div className="stack">
            {JOURNAL_QUESTIONS.map((question, index) => (
              <div key={index}>
                <div className="label">{question}</div>
                <div className="muted">{journalAnswers[index] || "—"}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="muted">No hay journaling guardado para esta fecha.</div>
        )}
      </Card>

      <div className="divider" />

      <div className="grid2">
        <Card title="Hábitos marcados ese día">
          {completedHabitLogs.length ? (
            <div className="stack">
              {completedHabitLogs.map((log) => {
                const habit = state.habits.find((h) => h.id === log.habitId);
                return (
                  <div key={log.id} className="listItem">
                    <span className="badge">
                      <span className="badgeDot" />
                      {log.date}
                    </span>
                    <div className="muted" style={{ fontSize: 12 }}>
                      <strong>{habit?.name ?? log.habitId}</strong>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="muted">No hay hábitos marcados en esta fecha.</div>
          )}
        </Card>

        <Card title="Plan diario">
          {dailyPlan ? (
            <div className="stack">
              <div>
                <div className="label">Tareas</div>
                {dailyPlan.tasks.length ? (
                  <div className="stack">
                    {dailyPlan.tasks.map((task) => (
                      <div key={task.id} className="listItem">
                        <span className="muted">
                          {task.done ? "✅" : "⬜"} {task.title}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="muted">Sin tareas guardadas.</div>
                )}
              </div>

              <div className="divider" />

              <div>
                <div className="label">Bloques de tiempo</div>
                {dailyPlan.timeBlocks.length ? (
                  <div className="stack">
                    {dailyPlan.timeBlocks.map((block) => (
                      <div key={block.id} className="listItem">
                        <span className="badge">
                          <span className="badgeDot" />
                          {block.time}
                        </span>
                        <div className="muted">{block.title}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="muted">Sin bloques guardados.</div>
                )}
              </div>
            </div>
          ) : (
            <div className="muted">No hay plan diario para esta fecha.</div>
          )}
        </Card>
      </div>

      <div className="divider" />

      <Card title="Revisión semanal relacionada">
        {weeklyReview ? (
          <div className="stack">
            <div className="row">
              <span className="muted">Semana</span>
              <strong>{weeklyReview.weekId}</strong>
            </div>

            <div>
              <div className="label">¿Qué salió bien?</div>
              <div className="muted">{weeklyReview.answers.wentWell || "—"}</div>
            </div>

            <div>
              <div className="label">¿Qué me frenó?</div>
              <div className="muted">{weeklyReview.answers.slowedDown || "—"}</div>
            </div>

            <div>
              <div className="label">¿Qué aprendí?</div>
              <div className="muted">{weeklyReview.answers.learned || "—"}</div>
            </div>

            <div>
              <div className="label">¿Qué voy a mejorar?</div>
              <div className="muted">{weeklyReview.answers.improveNext || "—"}</div>
            </div>

            <div>
              <div className="label">Prioridades principales</div>
              <div className="muted">{weeklyReview.answers.topPrioritiesNext || "—"}</div>
            </div>
          </div>
        ) : (
          <div className="muted">No hay revisión semanal guardada para la semana de esta fecha.</div>
        )}
      </Card>

      <div className="divider" />

      <div className="grid2">
        <Card title="Logs de hábitos (últimos 80)">
          {habitLogsSorted.length ? (
            <div className="stack">
              {habitLogsSorted.map((l) => (
                <div key={l.id} className="listItem">
                  <span className="badge">
                    <span className="badgeDot" />
                    {l.date}
                  </span>
                  <div className="muted" style={{ fontSize: 12 }}>
                    Habit:{" "}
                    <strong>{state.habits.find((h) => h.id === l.habitId)?.name ?? l.habitId}</strong> •{" "}
                    {l.action}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="muted">Aún no hay logs.</div>
          )}
        </Card>

        <Card title="Tracking personal reciente">
          {trackingSorted.length ? (
            <div className="stack">
              {trackingSorted.slice(0, 30).map((e) => (
                <div key={e.date} className="listItem">
                  <span className="badge">
                    <span className="badgeDot" />
                    {e.date}
                  </span>
                  <div className="row" style={{ width: "100%" }}>
                    <span className="muted" style={{ fontSize: 12 }}>
                      Energía {e.energy} • Enfoque {e.focus} • Disciplina {e.discipline}
                    </span>
                    <span className="muted" style={{ fontSize: 12 }}>
                      {e.comment ? e.comment.slice(0, 60) + (e.comment.length > 60 ? "…" : "") : "—"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="muted">Aún no hay tracking entries.</div>
          )}
        </Card>
      </div>

      <div className="divider" />

      <div className="grid2">
        <Card title="Historial de racha">
          <div className="stack">
            <div className="row">
              <span className="muted">Racha de pornografía</span>
              <strong>{state.discipline.streakDays} días</strong>
            </div>
            <div className="row">
              <span className="muted">Último día marcado</span>
              <strong>{state.discipline.lastCleanDate ?? "—"}</strong>
            </div>
          </div>
        </Card>

        <Card title="Resumen rápido">
          <div className="stack">
            <div className="row">
              <span className="muted">Hábitos</span>
              <strong>{state.habits.length}</strong>
            </div>
            <div className="row">
              <span className="muted">Planes diarios</span>
              <strong>{Object.keys(state.dailyPlansByDate).length}</strong>
            </div>
            <div className="row">
              <span className="muted">Entradas de tracking</span>
              <strong>{trackingSorted.length}</strong>
            </div>
            <div className="row">
              <span className="muted">Revisiones semanales</span>
              <strong>{reviewsSorted.length}</strong>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}