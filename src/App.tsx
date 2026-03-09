import { Navigate, Route, Routes } from "react-router-dom";
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

export default function App() {
  return (
    <AppShell>
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