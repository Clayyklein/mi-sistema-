import { useAppState } from "../../state/AppState";
import { Card } from "../shared/Card";
import { todayISO } from "../../utils/dates";

export function DisciplineTrackerCard() {
  const { state, actions } = useAppState();
  const today = todayISO();
  const already = state.discipline.lastCleanDate === today;

  return (
    <Card
      title="Disciplina — Racha de pornografía"
      right={
        <span className="badge badgeWarning">
          <span className="badgeDot" />
          Seguimiento
        </span>
      }
    >
      <div className="stack">
        <div style={{ fontSize: 34, letterSpacing: -0.5 }}>
          <strong>🔥 {state.discipline.streakDays}</strong>{" "}
          <span className="muted" style={{ fontSize: 14 }}>
            días clean
          </span>
        </div>

        <div className="row" style={{ justifyContent: "flex-start" }}>
          <button className="btn btnPrimary" onClick={() => actions.markCleanToday()} disabled={already}>
            Hoy me mantuve limpio
          </button>
          <button className="btn btnDanger" onClick={() => actions.resetDiscipline()}>
            Reiniciar racha
          </button>
          {already ? <span className="muted">Marcado para hoy.</span> : null}
        </div>

        <div className="muted" style={{ fontSize: 12 }}>
          Lógica: si marcas hoy, la racha aumenta. Si se salta un día, se reinicia automáticamente.
        </div>
      </div>
    </Card>
  );
}

