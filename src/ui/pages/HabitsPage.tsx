import { useMemo, useState } from "react";
import { useAppState } from "../../state/AppState";
import type { Habit } from "../../models/types";
import { todayISO } from "../../utils/dates";
import { PageHeader } from "../shared/PageHeader";
import { Card } from "../shared/Card";
import { ProgressBar } from "../shared/ProgressBar";
import { HabitForm } from "../habits/HabitForm";
import { DisciplineTrackerCard } from "../habits/DisciplineTrackerCard";

function habitSubtitle(h: Habit) {
  if (h.type === "WeeklyFrequency") return "Frecuencia semanal";
  if (h.type === "WeeklyHours") return "Horas semanales";
  return "Racha diaria";
}

export function HabitsPage() {
  const { state, actions } = useAppState();
  const [editing, setEditing] = useState<Habit | null>(null);
  const [creating, setCreating] = useState(false);
  const today = todayISO();

  const categories = useMemo(() => {
    const set = new Set(state.habits.map((h) => h.category).filter(Boolean));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [state.habits]);

  return (
    <div className="page">
      <PageHeader
        title="Hábitos"
        subtitle="Crea, edita y marca hábitos. Persistente en localStorage."
        actions={
          <button
            className="btn btnPrimary"
            onClick={() => {
              setCreating(true);
              setEditing(null);
            }}
          >
            + Nuevo hábito
          </button>
        }
      />

      <div className="stack">
        <DisciplineTrackerCard />

        {creating ? (
          <HabitForm
            onCancel={() => setCreating(false)}
            onSave={(h) => {
              actions.addHabit(h as Omit<Habit, "id">);
              setCreating(false);
            }}
          />
        ) : null}

        {editing ? (
          <HabitForm
            initial={editing}
            onCancel={() => setEditing(null)}
            onSave={(h) => {
              actions.updateHabit(h as Habit);
              setEditing(null);
            }}
          />
        ) : null}

        <div className="grid2">
          <Card title="Categorías">
            {categories.length ? (
              <div className="row" style={{ justifyContent: "flex-start", flexWrap: "wrap" }}>
                {categories.map((c) => (
                  <span key={c} className="badge">
                    <span className="badgeDot" />
                    {c}
                  </span>
                ))}
              </div>
            ) : (
              <div className="muted">Aún no hay categorías.</div>
            )}
            <div className="muted" style={{ fontSize: 12, marginTop: 10 }}>
              MVP: las categorías se gestionan editando el campo “Categoría” en cada hábito.
            </div>
          </Card>

          <Card title="Consejos">
            <div className="stack">
              <div className="muted">- Ahora puedes marcar y desmarcar el mismo día.</div>
              <div className="muted">- La racha diaria se reinicia si se pierde un día.</div>
              <div className="muted">- El progreso semanal se reinicia automáticamente al cambiar de semana.</div>
            </div>
          </Card>
        </div>

        <div className="grid2">
          {state.habits.map((h) => {
            const already = h.lastCompletionDate === today;

            return (
              <Card
                key={h.id}
                title={`${h.name} • ${h.category}`}
                right={
                  <span className="badge badgeAccent">
                    <span className="badgeDot" />
                    {habitSubtitle(h)}
                  </span>
                }
              >
                <div className="stack">
                  <ProgressBar value={h.progress} max={h.weeklyTarget} labelLeft={`Racha: ${h.streak} días`} />

                  <div className="row" style={{ justifyContent: "flex-start", flexWrap: "wrap" }}>
                    {already ? (
                      <button className="btn" onClick={() => actions.unmarkHabitToday(h.id)}>
                        Desmarcar hoy
                      </button>
                    ) : (
                      <button className="btn btnPrimary" onClick={() => actions.markHabitToday(h.id)}>
                        Marcar hoy
                      </button>
                    )}

                    <button
                      className="btn"
                      onClick={() => {
                        setEditing(h);
                        setCreating(false);
                      }}
                    >
                      Editar
                    </button>

                    <button className="btn btnDanger" onClick={() => actions.deleteHabit(h.id)}>
                      Eliminar
                    </button>

                    {already ? <span className="muted">Marcado hoy.</span> : null}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {state.habits.length === 0 ? (
          <Card title="Sin hábitos">
            <div className="muted">Crea tu primer hábito para empezar.</div>
          </Card>
        ) : null}
      </div>
    </div>
  );
}