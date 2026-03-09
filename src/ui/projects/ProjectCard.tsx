import type { Project, ProjectStatus, TaskItem } from "../../models/types";
import { Card } from "../shared/Card";
import { TaskList } from "../shared/TaskList";

function statusBadge(status: ProjectStatus) {
  const cls =
    status === "Completed" ? "badgeSuccess" : status === "Paused" ? "badgeWarning" : "badgeAccent";
  const label =
    status === "Completed"
      ? "Completado"
      : status === "Paused"
      ? "Pausado"
      : status === "In Progress"
      ? "En progreso"
      : status === "Planning"
      ? "En planificación"
      : "Idea";
  return (
    <span className={`badge ${cls}`}>
      <span className="badgeDot" />
      {label}
    </span>
  );
}

export function ProjectCard(props: {
  project: Project;
  onChange(next: Project): void;
  onDelete(): void;
}) {
  const p = props.project;

  function setTasks(tasks: TaskItem[]) {
    props.onChange({ ...p, tasks });
  }

  return (
    <Card title={p.name} right={statusBadge(p.status)}>
      <div className="stack">
        <div>
          <div className="label">Estado</div>
          <select
            className="select"
            value={p.status}
            onChange={(e) => props.onChange({ ...p, status: e.target.value as ProjectStatus })}
          >
          <option value="Idea">Idea</option>
          <option value="Planning">En planificación</option>
          <option value="In Progress">En progreso</option>
          <option value="Paused">Pausado</option>
          <option value="Completed">Completado</option>
          </select>
        </div>

        <div>
          <div className="label">Notas</div>
          <textarea
            className="textarea"
            value={p.notes}
            onChange={(e) => props.onChange({ ...p, notes: e.target.value })}
            placeholder="Notas del proyecto..."
          />
        </div>

        <div className="divider" />
        <div className="row">
          <div className="label" style={{ margin: 0 }}>
            Tasks (preview + edición)
          </div>
          <button className="btn btnSmall btnDanger" onClick={props.onDelete}>
            Eliminar proyecto
          </button>
        </div>

        <TaskList tasks={p.tasks} onChange={setTasks} placeholder="Añadir tarea al proyecto..." />
      </div>
    </Card>
  );
}

