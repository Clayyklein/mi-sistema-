import { Card } from "./Card";

export function StreakCard(props: { title: string; days: number; subtitle?: string }) {
  return (
    <Card
      title={props.title}
      right={<span className="badge badgeAccent"><span className="badgeDot" />Racha</span>}
    >
      <div style={{ display: "grid", gap: 8 }}>
        <div style={{ fontSize: 34, letterSpacing: -0.5 }}>
          <strong>{props.days}</strong> <span className="muted" style={{ fontSize: 14 }}>días</span>
        </div>
        {props.subtitle ? <div className="muted">{props.subtitle}</div> : null}
      </div>
    </Card>
  );
}

