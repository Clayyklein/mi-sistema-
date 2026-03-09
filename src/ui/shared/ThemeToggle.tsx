import { useAppState } from "../../state/AppState";

export function ThemeToggle() {
  const { state, actions } = useAppState();
  const isDark = state.settings.theme === "dark";

  return (
    <button
      className="btn btnPrimary"
      onClick={() => actions.setTheme(isDark ? "light" : "dark")}
      aria-label="Cambiar tema"
    >
      {isDark ? "Tema: Oscuro" : "Tema: Claro"} (toggle)
    </button>
  );
}

