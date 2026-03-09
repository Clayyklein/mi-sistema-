import React from "react";

export function PageHeader(props: {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="pageHeader">
      <div>
        <h1>{props.title}</h1>
        {props.subtitle ? <p>{props.subtitle}</p> : null}
      </div>
      {props.actions ? <div className="headerActions">{props.actions}</div> : null}
    </div>
  );
}

