import { useEffect, useMemo, useState } from "react";
import { useAppState } from "../../state/AppState";
import { currentISOWeekId, todayISO } from "../../utils/dates";
import { PageHeader } from "../shared/PageHeader";
import { Card } from "../shared/Card";

function avg(nums: number[]) {
  if (!nums.length) return 0;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

export function WeeklyReviewPage() {
  const { state, actions } = useAppState();
  const weekId = currentISOWeekId();
  const existing = state.weeklyReviewsByWeekId[weekId];

  const [wentWell, setWentWell] = useState("");
  const [slowedDown, setSlowedDown] = useState("");
  const [learned, setLearned] = useState("");
  const [improveNext, setImproveNext] = useState("");
  const [topPrioritiesNext, setTopPrioritiesNext] = useState("");

  useEffect(() => {
    setWentWell(existing?.answers.wentWell ?? "");
    setSlowedDown(existing?.answers.slowedDown ?? "");
    setLearned(existing?.answers.learned ?? "");
    setImproveNext(existing?.answers.improveNext ?? "");
    setTopPrioritiesNext(existing?.answers.topPrioritiesNext ?? "");
  }, [weekId, existing?.updatedAt]);

  const summary = useMemo(() => {
    const completed = state.habits.filter((h) => h.progress >= h.weeklyTarget).length;
    const missed = state.habits.filter((h) => h.progress < h.weeklyTarget).length;
    const bestHabitStreak = state.habits.reduce((m, h) => Math.max(m, h.streak), 0);
    const bestStreak = Math.max(bestHabitStreak, state.discipline.streakDays);

    const last7 = Object.values(state.trackingByDate)
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-7);

    const avgFocus = avg(last7.map((e) => e.focus));
    const avgEnergy = avg(last7.map((e) => e.energy));

    return { completed, missed, bestStreak, avgFocus, avgEnergy };
  }, [state.habits, state.discipline.streakDays, state.trackingByDate]);

  function save(next?: {
    wentWell?: string;
    slowedDown?: string;
    learned?: string;
    improveNext?: string;
    topPrioritiesNext?: string;
  }) {
    const now = Date.now();

    actions.setWeeklyReview({
      weekId,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
      answers: {
        wentWell: next?.wentWell ?? wentWell,
        slowedDown: next?.slowedDown ?? slowedDown,
        learned: next?.learned ?? learned,
        improveNext: next?.improveNext ?? improveNext,
        topPrioritiesNext: next?.topPrioritiesNext ?? topPrioritiesNext
      }
    });
  }

  function updateWentWell(value: string) {
    setWentWell(value);
    save({ wentWell: value });
  }

  function updateSlowedDown(value: string) {
    setSlowedDown(value);
    save({ slowedDown: value });
  }

  function updateLearned(value: string) {
    setLearned(value);
    save({ learned: value });
  }

  function updateImproveNext(value: string) {
    setImproveNext(value);
    save({ improveNext: value });
  }

  function updateTopPrioritiesNext(value: string) {
    setTopPrioritiesNext(value);
    save({ topPrioritiesNext: value });
  }

  return (
    <div className="page">
      <PageHeader
        title="Revisión semanal"
        subtitle={`Semana ${weekId} • Resumen automático + reflexión`}
        actions={
          <button className="btn btnPrimary" onClick={() => save()}>
            Guardar
          </button>
        }
      />

      <div className="grid2">
        <Card title="Resumen (auto)">
          <div className="stack">
            <div className="row">
              <span className="muted">Hábitos completados</span>
              <strong>{summary.completed}</strong>
            </div>
            <div className="row">
              <span className="muted">Hábitos no completados</span>
              <strong>{summary.missed}</strong>
            </div>
            <div className="row">
              <span className="muted">Mejor racha</span>
              <strong>{summary.bestStreak} días</strong>
            </div>
            <div className="row">
              <span className="muted">Enfoque medio (7d)</span>
              <strong>{summary.avgFocus.toFixed(1)}</strong>
            </div>
            <div className="row">
              <span className="muted">Energía media (7d)</span>
              <strong>{summary.avgEnergy.toFixed(1)}</strong>
            </div>
            <div className="divider" />
            <div className="muted" style={{ fontSize: 12 }}>
              Nota: en MVP “completed/missed” se basa en progreso vs target actual de la semana.
            </div>
          </div>
        </Card>

        <Card title="Estado actual">
          <div className="stack">
            <div className="row">
              <span className="muted">Hoy</span>
              <strong>{todayISO()}</strong>
            </div>
            <div className="row">
              <span className="muted">Racha No Porn</span>
              <strong>{state.discipline.streakDays} días</strong>
            </div>
            <div className="row">
              <span className="muted">Hábitos</span>
              <strong>{state.habits.length}</strong>
            </div>
            <div className="divider" />
            <div className="muted" style={{ fontSize: 12 }}>
              Lo guardado aquí se ve en Historial y queda guardado por semana automáticamente.
            </div>
          </div>
        </Card>
      </div>

      <div className="divider" />

      <div className="card">
        <div className="cardHeaderRow">
          <h2 className="cardTitle">Preguntas</h2>
          <span className="muted" style={{ fontSize: 12 }}>
            Se guarda por semana (weekId).
          </span>
        </div>

        <div className="stack">
          <div>
            <div className="label">¿Qué ha ido bien esta semana?</div>
            <textarea
              className="textarea"
              value={wentWell}
              onChange={(e) => updateWentWell(e.target.value)}
            />
          </div>

          <div>
            <div className="label">¿Qué me ha frenado?</div>
            <textarea
              className="textarea"
              value={slowedDown}
              onChange={(e) => updateSlowedDown(e.target.value)}
            />
          </div>

          <div>
            <div className="label">¿Qué he aprendido?</div>
            <textarea
              className="textarea"
              value={learned}
              onChange={(e) => updateLearned(e.target.value)}
            />
          </div>

          <div>
            <div className="label">¿Qué voy a mejorar la próxima semana?</div>
            <textarea
              className="textarea"
              value={improveNext}
              onChange={(e) => updateImproveNext(e.target.value)}
            />
          </div>

          <div>
            <div className="label">¿Cuáles son las prioridades principales la próxima semana?</div>
            <textarea
              className="textarea"
              value={topPrioritiesNext}
              onChange={(e) => updateTopPrioritiesNext(e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}