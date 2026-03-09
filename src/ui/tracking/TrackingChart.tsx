import type { ISODate, TrackingEntry } from "../../models/types";
import { formatShortDateES } from "../../utils/dates";

function clamp01(x: number) {
  return Math.max(0, Math.min(1, x));
}

function points(values: Array<number | null>, w: number, h: number, pad = 10) {
  const n = values.length;
  const xs = values.map((_, i) => pad + (i * (w - pad * 2)) / Math.max(1, n - 1));
  const ys = values.map((v) => {
    if (v == null) return null;
    const t = clamp01((v - 1) / 9);
    return pad + (1 - t) * (h - pad * 2);
  });
  const pts: string[] = [];
  for (let i = 0; i < n; i++) {
    const y = ys[i];
    if (y == null) continue;
    pts.push(`${xs[i]},${y}`);
  }
  return pts.join(" ");
}

export function TrackingChart(props: {
  title: string;
  dates: ISODate[];
  entriesByDate: Record<ISODate, TrackingEntry>;
  metric: "energy" | "focus" | "discipline";
  colorVar: "var(--accent)" | "var(--success)" | "var(--warning)";
}) {
  const values = props.dates.map((d) => props.entriesByDate[d]?.[props.metric] ?? null);
  const w = 520;
  const h = 120;
  const poly = points(values, w, h, 12);

  return (
    <div className="card">
      <div className="cardHeaderRow">
        <h2 className="cardTitle">{props.title}</h2>
        <span className="badge badgeAccent">
          <span className="badgeDot" />
          Últimos 7 días
        </span>
      </div>

      <svg width="100%" viewBox={`0 0 ${w} ${h}`} role="img" aria-label={props.title}>
        <defs>
          <linearGradient id={`g_${props.metric}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={props.colorVar} stopOpacity="0.9" />
            <stop offset="100%" stopColor={props.colorVar} stopOpacity="0.35" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width={w} height={h} rx="14" fill="transparent" />
        <polyline
          points={poly}
          fill="none"
          stroke={`url(#g_${props.metric})`}
          strokeWidth="4"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </svg>

      <div className="row" style={{ marginTop: 10 }}>
        {props.dates.map((d) => (
          <div key={d} className="muted" style={{ fontSize: 12 }}>
            {formatShortDateES(d)}
          </div>
        ))}
      </div>
    </div>
  );
}

