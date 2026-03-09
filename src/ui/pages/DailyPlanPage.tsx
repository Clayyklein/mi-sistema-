import { useMemo, useState } from "react";
import { useAppState } from "../../state/AppState";
import { PageHeader } from "../shared/PageHeader";
import { Card } from "../shared/Card";
import { TimeBlockList } from "../shared/TimeBlockList";
import { TaskList } from "../shared/TaskList";
import { todayISO } from "../../utils/dates";

export function DailyPlanPage() {
  const { state, actions } = useAppState();
  const [date, setDate] = useState(todayISO());
  const plan = useMemo(() => actions.ensureDailyPlan(date), [actions, date, state.dailyPlansByDate]);

  return (
    <div className="page">
      <PageHeader
        title="Plan diario"
        subtitle="Planificación diaria por fecha (persistente)."
        actions={
          <input className="input" value={date} onChange={(e) => setDate(e.target.value)} style={{ maxWidth: 160 }} />
        }
      />

      <div className="grid2">
        <Card title="Bloques de tiempo">
          <TimeBlockList
            blocks={plan.timeBlocks}
            onChange={(timeBlocks) => actions.setDailyPlan({ ...plan, timeBlocks })}
          />
        </Card>

        <Card title="Tareas">
          <TaskList tasks={plan.tasks} onChange={(tasks) => actions.setDailyPlan({ ...plan, tasks })} />
        </Card>
      </div>
    </div>
  );
}

