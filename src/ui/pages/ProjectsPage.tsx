import { useState } from "react";
import { useAppState } from "../../state/AppState";
import { PageHeader } from "../shared/PageHeader";
import { Card } from "../shared/Card";
import { ProjectCard } from "../projects/ProjectCard";

export function ProjectsPage() {
  const { state, actions } = useAppState();
  const [name, setName] = useState("");

  function create() {
    const n = name.trim();
    if (!n) return;
    actions.addProject({ name: n, status: "Idea", notes: "", tasks: [] });
    setName("");
  }

  return (
    <div className="page">
      <PageHeader
        title="Proyectos"
        subtitle="Tarjetas con estado, notas y tasks."
      />

      <div className="grid2">
        <Card title="Nuevo proyecto">
          <div className="stack">
            <div>
              <div className="label">Nombre</div>
              <input
                className="input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej: Coaching online"
                onKeyDown={(e) => {
                  if (e.key === "Enter") create();
                }}
              />
            </div>
            <button className="btn btnPrimary" onClick={create}>
              Crear
            </button>
            <div className="muted" style={{ fontSize: 12 }}>
              MVP: el resto de campos se editan en la tarjeta tras crear.
            </div>
          </div>
        </Card>

        <Card title="Resumen">
          <div className="stack">
            <div className="row">
              <span className="muted">Total</span>
              <strong>{state.projects.length}</strong>
            </div>
            <div className="row">
              <span className="muted">En progreso</span>
              <strong>{state.projects.filter((p) => p.status === "In Progress").length}</strong>
            </div>
            <div className="row">
              <span className="muted">Completados</span>
              <strong>{state.projects.filter((p) => p.status === "Completed").length}</strong>
            </div>
          </div>
        </Card>
      </div>

      <div className="divider" />

      <div className="grid2">
        {state.projects.map((p) => (
          <ProjectCard
            key={p.id}
            project={p}
            onChange={(next) => actions.updateProject(next)}
            onDelete={() => actions.deleteProject(p.id)}
          />
        ))}
      </div>

      {state.projects.length === 0 ? (
        <Card title="Sin proyectos">
          <div className="muted">Crea tu primer proyecto.</div>
        </Card>
      ) : null}
    </div>
  );
}

