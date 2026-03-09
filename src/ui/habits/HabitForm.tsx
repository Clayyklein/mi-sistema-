import { useEffect, useMemo, useState } from "react";
import type { Habit, HabitType } from "../../models/types";

const habitTypes: Array<{ value: HabitType; label: string }> = [
  { value: "WeeklyFrequency", label: "Frecuencia semanal" },
  { value: "WeeklyHours", label: "Horas semanales" },
  { value: "DailyStreak", label: "Racha diaria" }
];

export function HabitForm(props: {
  initial?: Habit;
  onSave(h: Omit<Habit, "id"> | Habit): void;
  onCancel(): void;
}) {
  const isEdit = Boolean(props.initial);
  const [name, setName] = useState(props.initial?.name ?? "");
  const [category, setCategory] = useState(props.initial?.category ?? "General");
  const [type, setType] = useState<HabitType>(props.initial?.type ?? "WeeklyFrequency");
  const [weeklyTarget, setWeeklyTarget] = useState<number>(props.initial?.weeklyTarget ?? 7);

  const validation = useMemo(() => {
    const errors: string[] = [];
    if (!name.trim()) errors.push("El nombre es obligatorio.");
    if (!category.trim()) errors.push("La categoría es obligatoria.");
    if (!Number.isFinite(weeklyTarget) || weeklyTarget <= 0) errors.push("El target debe ser > 0.");
    return errors;
  }, [name, category, weeklyTarget]);

  useEffect(() => {
    // keep type-specific defaults small
    if (type === "WeeklyHours" && weeklyTarget < 1) setWeeklyTarget(3);
  }, [type, weeklyTarget]);

  function save() {
    if (validation.length) return;
    const base = {
      name: name.trim(),
      category: category.trim(),
      type,
      weeklyTarget: Number(weeklyTarget),
      progress: props.initial?.progress ?? 0,
      progressWeekId: props.initial?.progressWeekId ?? "",
      streak: props.initial?.streak ?? 0,
      lastCompletionDate: props.initial?.lastCompletionDate
    };
    props.onSave(props.initial ? { ...props.initial, ...base } : base);
  }

  return (
    <div className="card">
      <div className="cardHeaderRow">
        <h2 className="cardTitle">{isEdit ? "Editar hábito" : "Nuevo hábito"}</h2>
        <div className="row" style={{ justifyContent: "flex-end" }}>
          <button className="btn btnSmall" onClick={props.onCancel}>
            Cancelar
          </button>
          <button className="btn btnSmall btnPrimary" onClick={save} disabled={validation.length > 0}>
            Guardar
          </button>
        </div>
      </div>

      {validation.length ? (
        <div className="badge badgeWarning" style={{ marginBottom: 10 }}>
          <span className="badgeDot" />
          {validation[0]}
        </div>
      ) : null}

      <div className="formGrid">
        <div>
          <div className="label">Nombre</div>
          <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Lectura..." />
        </div>
        <div>
          <div className="label">Categoría</div>
          <input className="input" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Mente..." />
        </div>
        <div>
          <div className="label">Tipo</div>
          <select className="select" value={type} onChange={(e) => setType(e.target.value as HabitType)}>
            {habitTypes.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <div className="label">Target semanal</div>
          <input
            className="input"
            type="number"
            min={1}
            value={weeklyTarget}
            onChange={(e) => setWeeklyTarget(Number(e.target.value))}
          />
        </div>
      </div>
    </div>
  );
}

