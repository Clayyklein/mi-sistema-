export function EmptyState(props: { title: string; description?: string; action?: React.ReactNode }) {
  return (
    <div className="card" style={{ textAlign: "center" }}>
      <h3 style={{ margin: 0, fontSize: 14 }}>{props.title}</h3>
      {props.description ? <p className="muted" style={{ margin: "8px 0 0" }}>{props.description}</p> : null}
      {props.action ? <div style={{ marginTop: 12 }}>{props.action}</div> : null}
    </div>
  );
}

