import { NavLink } from "react-router-dom";
import { ThemeToggle } from "../shared/ThemeToggle";

const navItems: Array<{ to: string; label: string; icon: string }> = [
  { to: "/dashboard", label: "Panel", icon: "📊" },
  { to: "/journal", label: "Journal", icon: "📓" }, 
  { to: "/habits", label: "Hábitos", icon: "🔥" },
  { to: "/daily-plan", label: "Plan diario", icon: "📅" },
  { to: "/projects", label: "Proyectos", icon: "📁" },
  { to: "/personal-tracking", label: "Tracking personal", icon: "📈" },
  { to: "/weekly-review", label: "Revisión semanal", icon: "🧠" },
  { to: "/history", label: "Historial", icon: "🕓" },
  { to: "/settings", label: "Ajustes", icon: "⚙️" }
];

export function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brandMark" aria-hidden="true" />
        <div className="brandTitle">
          <strong>Mi Sistema</strong>
          <span className="muted">Personal • Sin conexión</span>
        </div>
      </div>

      <nav className="nav" aria-label="Navegación">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            data-active={({ isActive }: { isActive: boolean }) => (isActive ? "true" : "false")}
          >
            <span style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <span style={{ fontSize: "18px" }}>{item.icon}</span>
              {item.label}
            </span>
            <span className="kbd">⌘</span>
          </NavLink>
        ))}
      </nav>

      <div className="divider" />
      <ThemeToggle />
    </aside>
  );
}