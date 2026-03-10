import { useEffect, useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { AppShell } from "./ui/layout/AppShell";
import { DashboardPage } from "./ui/pages/DashboardPage";
import { JournalPage } from "./ui/pages/JournalingPage";
import { HabitsPage } from "./ui/pages/HabitsPage";
import { DailyPlanPage } from "./ui/pages/DailyPlanPage";
import { ProjectsPage } from "./ui/pages/ProjectsPage";
import { PersonalTrackingPage } from "./ui/pages/PersonalTrackingPage";
import { WeeklyReviewPage } from "./ui/pages/WeeklyReviewPage";
import { HistoryPage } from "./ui/pages/HistoryPage";
import { SettingsPage } from "./ui/pages/SettingsPage";

function ScrollToTopOnRouteChange() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname]);

  return null;
}

export default function App() {

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 900);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#070b12",
        color: "#f2f5ff",
        flexDirection: "column",
        fontFamily: "system-ui"
      }}>
        <div style={{
          width: 36,
          height: 36,
          border: "3px solid rgba(255,255,255,0.2)",
          borderTop: "3px solid #2f6bff",
          borderRadius: "50%",
          animation: "spin 1s linear infinite"
        }} />
        <div style={{ marginTop: 14, opacity: 0.7 }}>
          Cargando sistema...
        </div>

        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <AppShell>
      <ScrollToTopOnRouteChange />
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/journal" element={<JournalPage />} />
        <Route path="/habits" element={<HabitsPage />} />
        <Route path="/daily-plan" element={<DailyPlanPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/personal-tracking" element={<PersonalTrackingPage />} />
        <Route path="/weekly-review" element={<WeeklyReviewPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </AppShell>
  );
}