import React from "react";

export function Card(props: { title?: string; right?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="card">
      {props.title ? (
        <div className="cardHeaderRow">
          <h2 className="cardTitle">{props.title}</h2>
          {props.right}
        </div>
      ) : null}
      {props.children}
    </section>
  );
}

