import { useMemo, useState } from "react";
import type { TaskItem } from "../../models/types";
import { createId } from "../../utils/id";

export function TaskList(props: {
  tasks: TaskItem[];
  onChange(next: TaskItem[]): void;
  placeholder?: string;
}) {
  const [draft, setDraft] = useState("");
  const sorted = useMemo(() => {
    return [...props.tasks].sort((a, b) => Number(a.done) - Number(b.done) || b.updatedAt - a.updatedAt);
  }, [props.tasks]);

  function add() {
    const title = draft.trim();
    if (!title) return;
    const next: TaskItem[] = [
      { id: createId("task"), title, done: false, updatedAt: Date.now() },
      ...props.tasks
    ];
    props.onChange(next);
    setDraft("");
  }

  function toggle(id: string) {
    props.onChange(
      props.tasks.map((t) => (t.id === id ? { ...t, done: !t.done, updatedAt: Date.now() } : t))
    );
  }

  function updateTitle(id: string, title: string) {
    props.onChange(
      props.tasks.map((t) => (t.id === id ? { ...t, title, updatedAt: Date.now() } : t))
    );
  }

  function remove(id: string) {
    props.onChange(props.tasks.filter((t) => t.id !== id));
  }

  return (
    <div className="stack">
      <div className="row">
        <input
          className="input"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={props.placeholder ?? "Añadir tarea..."}
          onKeyDown={(e) => {
            if (e.key === "Enter") add();
          }}
        />
        <button className="btn btnPrimary" onClick={add}>
          Añadir
        </button>
      </div>

      <div className="stack">
        {sorted.length === 0 ? (
          <div className="muted">Sin tareas por ahora.</div>
        ) : (
          sorted.map((t) => (
            <div key={t.id} className="listItem">
              <input className="checkbox" type="checkbox" checked={t.done} onChange={() => toggle(t.id)} />
              <input
                className="input"
                value={t.title}
                onChange={(e) => updateTitle(t.id, e.target.value)}
                style={{
                  textDecoration: t.done ? "line-through" : "none",
                  opacity: t.done ? 0.7 : 1
                }}
              />
              <button className="btn btnSmall btnDanger" onClick={() => remove(t.id)}>
                Borrar
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

