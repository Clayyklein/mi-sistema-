import { useEffect, useMemo, useState } from "react";
import { useAppState } from "../../state/AppState";
import { addDaysISO, formatLongDateES, todayISO } from "../../utils/dates";
import { PageHeader } from "../shared/PageHeader";
import { Card } from "../shared/Card";
import { TrackingChart } from "../tracking/TrackingChart";

function lastNDates(today: string, n: number) {
  const dates: string[] = [];
  for (let i = n - 1; i >= 0; i--) dates.push(addDaysISO(today, -i));
  return dates;
}

function avg(nums: number[]) {
  if (!nums.length) return 0;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

type DisciplineState = "clean" | "alert" | "relapse" | null;

type DisciplineDayData = {
  state: DisciplineState;
  note: string;
  relapseWhy: string;
  relapseTomorrow: string;
};

function getDisciplineKey(date: string) {
  return `discipline_${date}`;
}

function emptyDisciplineData(): DisciplineDayData {
  return {
    state: null,
    note: "",
    relapseWhy: "",
    relapseTomorrow: ""
  };
}

function getDisciplineData(date: string): DisciplineDayData {
  const saved = localStorage.getItem(getDisciplineKey(date));
  if (!saved) return emptyDisciplineData();

  try {
    const parsed = JSON.parse(saved);
    return {
      state: parsed.state ?? null,
      note: parsed.note ?? "",
      relapseWhy: parsed.relapseWhy ?? "",
      relapseTomorrow: parsed.relapseTomorrow ?? ""
    };
  } catch {
    return emptyDisciplineData();
  }
}

function saveDisciplineData(date: string, data: DisciplineDayData) {
  localStorage.setItem(getDisciplineKey(date), JSON.stringify(data));
}

export function PersonalTrackingPage() {
  const { state, actions } = useAppState();
  const today = todayISO();
  const existing = state.trackingByDate[today];

  const [energy, setEnergy] = useState(existing?.energy ?? 7);
  const [focus, setFocus] = useState(existing?.focus ?? 7);
  const [discipline, setDiscipline] = useState(existing?.discipline ?? 7);
  const [comment, setComment] = useState(existing?.comment ?? "");

  const initialDiscipline = getDisciplineData(today);

  const [disciplineState, setDisciplineState] = useState<DisciplineState>(initialDiscipline.state);
  const [disciplineNote, setDisciplineNote] = useState(initialDiscipline.note);
  const [relapseWhy, setRelapseWhy] = useState(initialDiscipline.relapseWhy);
  const [relapseTomorrow, setRelapseTomorrow] = useState(initialDiscipline.relapseTomorrow);

  const dates7 = useMemo(() => lastNDates(today, 7), [today]);
  const dates14 = useMemo(() => lastNDates(today, 14), [today]);

  useEffect(() => {
    setEnergy(existing?.energy ?? 7);
    setFocus(existing?.focus ?? 7);
    setDiscipline(existing?.discipline ?? 7);
    setComment(existing?.comment ?? "");

    const saved = getDisciplineData(today);
    setDisciplineState(saved.state);
    setDisciplineNote(saved.note);
    setRelapseWhy(saved.relapseWhy);
    setRelapseTomorrow(saved.relapseTomorrow);
  }, [today]);

  function saveTracking() {
    actions.setTracking({
      date: today,
      energy,
      focus,
      discipline,
      comment
    });
  }

  function saveCurrentDiscipline(
    nextState: DisciplineState,
    nextNote: string,
    nextRelapseWhy: string,
    nextRelapseTomorrow: string
  ) {
    saveDisciplineData(today, {
      state: nextState,
      note: nextNote,
      relapseWhy: nextRelapseWhy,
      relapseTomorrow: nextRelapseTomorrow
    });
  }

  function markClean() {
    setDisciplineState("clean");
    saveCurrentDiscipline("clean", disciplineNote, relapseWhy, relapseTomorrow);
  }

  function markAlert() {
    setDisciplineState("alert");
    saveCurrentDiscipline("alert", disciplineNote, relapseWhy, relapseTomorrow);
  }

  function markRelapse() {
    setDisciplineState("relapse");
    saveCurrentDiscipline("relapse", disciplineNote, relapseWhy, relapseTomorrow);
  }

  function updateDisciplineNote(value: string) {
    setDisciplineNote(value);
    saveCurrentDiscipline(disciplineState, value, relapseWhy, relapseTomorrow);
  }

  function updateRelapseWhy(value: string) {
    setRelapseWhy(value);
    saveCurrentDiscipline(disciplineState, disciplineNote, value, relapseTomorrow);
  }

  function updateRelapseTomorrow(value: string) {
    setRelapseTomorrow(value);
    saveCurrentDiscipline(disciplineState, disciplineNote, relapseWhy, value);
  }

  const weeklyValues = useMemo(() => {
    const entries = dates7.map((d) => state.trackingByDate[d]).filter(Boolean);
    return {
      avgEnergy: avg(entries.map((e) => e.energy)),
      avgFocus: avg(entries.map((e) => e.focus)),
      avgDiscipline: avg(entries.map((e) => e.discipline))
    };
  }, [dates7, state.trackingByDate]);

  function getDisciplineLabel(value: DisciplineState) {
    if (value === "clean") return "Limpio";
    if (value === "alert") return "Alerta";
    if (value === "relapse") return "Recaída";
    return "Sin marcar";
  }

  function getHistoryColor(date: string) {
    const data = getDisciplineData(date);

    if (data.state === "clean") return "#22c55e";
    if (data.state === "alert") return "#f59e0b";
    if (data.state === "relapse") return "#ef4444";
    return "var(--card-border)";
  }

  return (
    <div className="page">
      <PageHeader title="Tracking personal" subtitle={formatLongDateES(today)} />

      <Card title="🔥 Disciplina personal">
        <div className="stack">
          <div style={{ fontSize: 24, fontWeight: "bold" }}>
            Estado de hoy
          </div>

          <div className="row" style={{ gap: 10, flexWrap: "wrap" }}>
            <button className="btn btnSuccess" onClick={markClean}>
              ✔ Hoy cumplí
            </button>

            <button className="btn btnWarning" onClick={markAlert}>
              ⚠ Tuve alerta
            </button>

            <button className="btn btnDanger" onClick={markRelapse}>
              ⛔ Recaída
            </button>
          </div>

          <div className="muted" style={{ marginTop: 4 }}>
            Estado actual: <strong>{getDisciplineLabel(disciplineState)}</strong>
          </div>

          {(disciplineState === "clean" || disciplineState === "alert") && (
            <div>
              <div className="label">
                {disciplineState === "clean"
                  ? "Notas del día (opcional)"
                  : "¿Qué pasó hoy?"}
              </div>
              <textarea
                className="textarea"
                placeholder={
                  disciplineState === "clean"
                    ? "Ej: hoy estuve enfocado, evité redes, controlé bien mi mente..."
                    : "Ej: estuve cansado, solo, con el celular mucho tiempo..."
                }
                value={disciplineNote}
                onChange={(e) => updateDisciplineNote(e.target.value)}
              />
            </div>
          )}

          {disciplineState === "relapse" && (
            <div className="stack">
              <div>
                <div className="label">¿Por qué ocurrió?</div>
                <textarea
                  className="textarea"
                  placeholder="Ej: estaba aburrido, cansado, solo, agarré el celular en la cama..."
                  value={relapseWhy}
                  onChange={(e) => updateRelapseWhy(e.target.value)}
                />
              </div>

              <div>
                <div className="label">¿Qué haré diferente mañana?</div>
                <textarea
                  className="textarea"
                  placeholder="Ej: dejar el celular lejos, dormir antes, salir a caminar, entrenar..."
                  value={relapseTomorrow}
                  onChange={(e) => updateRelapseTomorrow(e.target.value)}
                />
              </div>
            </div>
          )}

          <div className="divider" />

          <div>
            <div className="label">Historial visual (últimos 14 días)</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
              {dates14.map((date) => (
                <div
                  key={date}
                  title={date}
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: 4,
                    background: getHistoryColor(date),
                    border: "1px solid var(--card-border)"
                  }}
                />
              ))}
            </div>
            <div className="muted" style={{ fontSize: 12, marginTop: 8 }}>
              Verde = limpio · Amarillo = alerta · Rojo = recaída
            </div>
          </div>
        </div>
      </Card>

      <div className="divider" />

      <div className="grid2">
        <Card
          title="Entrada de hoy"
          right={
            <button className="btn btnPrimary" onClick={saveTracking}>
              Guardar
            </button>
          }
        >
          <div className="stack">
            <div>
              <div className="label">Energía: {energy}</div>
              <input
                className="input"
                type="range"
                min={1}
                max={10}
                value={energy}
                onChange={(e) => setEnergy(Number(e.target.value))}
              />
            </div>

            <div>
              <div className="label">Enfoque: {focus}</div>
              <input
                className="input"
                type="range"
                min={1}
                max={10}
                value={focus}
                onChange={(e) => setFocus(Number(e.target.value))}
              />
            </div>

            <div>
              <div className="label">Disciplina: {discipline}</div>
              <input
                className="input"
                type="range"
                min={1}
                max={10}
                value={discipline}
                onChange={(e) => setDiscipline(Number(e.target.value))}
              />
            </div>

            <div>
              <div className="label">Comentario</div>
              <textarea
                className="textarea"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Nota corta del día..."
              />
            </div>

            <div className="muted" style={{ fontSize: 12 }}>
              Guarda manualmente tu energía, enfoque, disciplina y comentario.
            </div>
          </div>
        </Card>

        <Card title="Promedios (últimos 7 días)">
          <div className="stack">
            <div className="row">
              <span className="muted">Energía</span>
              <strong>{weeklyValues.avgEnergy.toFixed(1)}</strong>
            </div>

            <div className="row">
              <span className="muted">Enfoque</span>
              <strong>{weeklyValues.avgFocus.toFixed(1)}</strong>
            </div>

            <div className="row">
              <span className="muted">Disciplina</span>
              <strong>{weeklyValues.avgDiscipline.toFixed(1)}</strong>
            </div>
          </div>
        </Card>
      </div>

      <div className="divider" />

      <div className="grid3">
        <TrackingChart
          title="Energía"
          dates={dates7}
          entriesByDate={state.trackingByDate}
          metric="energy"
          colorVar="var(--success)"
        />

        <TrackingChart
          title="Enfoque"
          dates={dates7}
          entriesByDate={state.trackingByDate}
          metric="focus"
          colorVar="var(--accent)"
        />

        <TrackingChart
          title="Disciplina"
          dates={dates7}
          entriesByDate={state.trackingByDate}
          metric="discipline"
          colorVar="var(--warning)"
        />
      </div>
    </div>
  );
}