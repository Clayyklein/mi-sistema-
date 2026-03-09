export function ProgressBar(props: {
  value: number;
  max: number;
  labelLeft?: string;
  labelRight?: string;
}) {
  const pct = props.max <= 0 ? 0 : Math.max(0, Math.min(100, (props.value / props.max) * 100));
  return (
    <div>
      <div className="progress" aria-label="Progreso">
        <div className="progressFill" style={{ width: `${pct}%` }} />
      </div>
      <div className="progressMeta">
        <span>{props.labelLeft ?? ""}</span>
        <span>{props.labelRight ?? `${props.value} / ${props.max}`}</span>
      </div>
    </div>
  );
}

