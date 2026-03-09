import React from "react";
import { Sidebar } from "./Sidebar";
import "../styles/ui.css";

export function AppShell(props: { children: React.ReactNode }) {
  return (
    <div className="appShell">
      <Sidebar />
      <main className="content">{props.children}</main>
    </div>
  );
}

