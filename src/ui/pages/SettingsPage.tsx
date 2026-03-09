import { useAppState } from "../../state/AppState";
import { PageHeader } from "../shared/PageHeader";
import { Card } from "../shared/Card";
import { ThemeToggle } from "../shared/ThemeToggle";
import { downloadJson } from "../../utils/export";

export function SettingsPage() {
  const { state, actions } = useAppState();

  return (
    <div className="page">
      <PageHeader title="Ajustes" subtitle="Preferencias, exportación y acciones rápidas." />

      <div className="grid2">
        <Card title="Tema">
          <div className="stack">
            <div className="muted">Modo claro/oscuro persistente.</div>
            <ThemeToggle />
          </div>
        </Card>

        <Card title="Datos">
          <div className="stack">
            <button
              className="btn"
              onClick={() => downloadJson(`mi-sistema-backup-${Date.now()}.json`, state)}
            >
              Exportar data (JSON)
            </button>
            <button className="btn btnDanger" onClick={() => actions.resetDiscipline()}>
              Reiniciar racha (tracker de porno)
            </button>
            <button
              className="btn btnDanger"
              onClick={() => {
                const ok = confirm("Esto borrará y reiniciará TODOS tus datos locales. ¿Continuar?");
                if (ok) actions.resetAll();
              }}
            >
              Reiniciar TODO (seed)
            </button>
            <div className="muted" style={{ fontSize: 12 }}>
              Todo se guarda en `localStorage`. No hay backend.
            </div>
          </div>
        </Card>
      </div>

      <div className="divider" />

      <div className="grid2">
        <Card title="Editar hábitos / categorías">
          <div className="stack">
            <div className="muted">
              MVP: edita hábitos desde la página “Hábitos”. Las categorías son texto libre por hábito.
            </div>
          </div>
        </Card>

        <Card title="Offline">
          <div className="stack">
            <div className="muted">
              La app funciona sin conexión para el core. Solo requiere navegador moderno.
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

