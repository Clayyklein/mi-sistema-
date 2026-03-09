import { useEffect, useState } from "react";
import { PageHeader } from "../shared/PageHeader";
import { Card } from "../shared/Card";
import { formatLongDateES, todayISO } from "../../utils/dates";

const QUESTIONS = [
  "Mis dos ayunos hoy:",
  "Mi primer bloque de enfoque hoy",
  "Expectativa positiva",
  "Declaraciones de creencias",
  "Visualización: mi yo del futuro",
  "¿Cuál es mi tentación número uno hoy?",
  "¿Cómo lo evito?",
  "¿Qué hace el Iván de hoy que el del año pasado no hacía?"
];

function getJournalKey(date: string) {
  return `journal_${date}`;
}

function getInitialAnswers(date: string) {
  const saved = localStorage.getItem(getJournalKey(date));
  if (!saved) return Array(QUESTIONS.length).fill("");

  try {
    const parsed = JSON.parse(saved);
    if (Array.isArray(parsed)) {
      return QUESTIONS.map((_, index) => parsed[index] ?? "");
    }
    return Array(QUESTIONS.length).fill("");
  } catch {
    return Array(QUESTIONS.length).fill("");
  }
}

export function JournalPage() {
  const today = todayISO();
  const [answers, setAnswers] = useState<string[]>(() => getInitialAnswers(today));

  useEffect(() => {
    setAnswers(getInitialAnswers(today));
  }, [today]);

  function updateAnswer(index: number, value: string) {
    const next = [...answers];
    next[index] = value;
    setAnswers(next);
    localStorage.setItem(getJournalKey(today), JSON.stringify(next));
  }

  return (
    <div className="page">
      <PageHeader title="Journaling" subtitle={formatLongDateES(today)} />

      <Card title="Journal diario">
        <div className="stack">
          {QUESTIONS.map((question, index) => (
            <div key={index}>
              <div className="label">{question}</div>
              <textarea
                className="textarea"
                placeholder="Escribe aquí..."
                value={answers[index]}
                onChange={(e) => updateAnswer(index, e.target.value)}
              />
            </div>
          ))}

          <div className="muted" style={{ fontSize: 12 }}>
            Se guarda automáticamente mientras escribes y no se borra al cambiar de pestaña.
          </div>
        </div>
      </Card>
    </div>
  );
}