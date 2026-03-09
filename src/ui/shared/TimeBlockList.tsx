import { useState } from "react";
import type { TimeBlock } from "../../models/types";
import { createId } from "../../utils/id";

export function TimeBlockList(props: { blocks: TimeBlock[]; onChange(next: TimeBlock[]): void }) {
  const [time, setTime] = useState("09:00");
  const [title, setTitle] = useState("");

  function add() {
    const t = title.trim();
    if (!t) return;

    props.onChange([
      ...props.blocks,
      { id: createId("tb"), time, title: t }
    ]);

    setTitle("");
  }

  function update(id: string, patch: Partial<TimeBlock>) {
    props.onChange(
      props.blocks.map((b) => (b.id === id ? { ...b, ...patch } : b))
    );
  }

  function remove(id: string) {
    props.onChange(props.blocks.filter((b) => b.id !== id));
  }

  return (
    <div className="stack">
      <div className="row">
        <input
          className="input"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          style={{ maxWidth: 120 }}
        />

        <input
          className="input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Título del bloque..."
          onKeyDown={(e) => {
            if (e.key === "Enter") add();
          }}
        />

        <button className="btn btnPrimary" onClick={add}>
          Añadir
        </button>
      </div>

      {props.blocks.length === 0 ? (
        <div className="muted">Sin bloques todavía.</div>
      ) : (
        <div className="stack">
          {props.blocks.map((b) => (
            <div key={b.id} className="listItem">
              <input
                className="input"
                value={b.time}
                onChange={(e) => update(b.id, { time: e.target.value })}
                style={{ maxWidth: 120 }}
              />

              <input
                className="input"
                value={b.title}
                onChange={(e) => update(b.id, { title: e.target.value })}
              />

              <button className="btn btnSmall btnDanger" onClick={() => remove(b.id)}>
                Borrar
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}