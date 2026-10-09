"use client";

import { useState } from "react";
import { findMood, type MoodEntry } from "@/config/wellbeing";
import { moods } from "@/config/moods";
import { formatLongDate } from "@/lib/dates";

// Registro diario de emociones y historial de los últimos días.
export function WellbeingRegister({
  today,
  entries,
  onSave,
}: {
  today: string;
  entries: MoodEntry[];
  onSave: (moodId: string) => void;
}) {
  const todayEntry = entries.find((entry) => entry.date === today);
  const [picked, setPicked] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const selectedId = picked ?? todayEntry?.moodId ?? null;

  function handleSave() {
    if (!selectedId) return;
    onSave(selectedId);
    setPicked(null);
    setSaved(true);
  }

  const history = entries.slice(0, 14);

  return (
    <div className="flex flex-col gap-6">
      <section className="flex flex-col gap-6 rounded-[2rem] bg-white/70 p-6 shadow-sm ring-1 ring-nara-lavanda sm:p-8">
        <div className="flex flex-col gap-2 text-center sm:text-left">
          <h2 className="text-2xl font-bold text-nara-texto">¿Cómo te sientes hoy?</h2>
          <p className="text-base text-nara-texto/70">
            {todayEntry && !picked
              ? `Hoy ya registraste que te sientes: ${findMood(todayEntry.moodId)?.label.toLowerCase()}. Puedes cambiarlo.`
              : "Elige la carita que mejor describa tu día."}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          {moods.map((mood) => {
            const isSelected = mood.id === selectedId;
            return (
              <button
                key={mood.id}
                type="button"
                aria-pressed={isSelected}
                onClick={() => {
                  setPicked(mood.id);
                  setSaved(false);
                }}
                className={`flex flex-col items-center gap-2 rounded-3xl px-3 py-5 text-base font-semibold transition focus:outline-none focus:ring-4 focus:ring-nara-lavanda ${
                  isSelected
                    ? "bg-nara-menta ring-2 ring-nara-menta-fuerte"
                    : "bg-nara-crema hover:bg-nara-lavanda/50"
                }`}
              >
                <span aria-hidden="true" className="text-4xl sm:text-5xl">
                  {mood.emoji}
                </span>
                {mood.label}
              </button>
            );
          })}
        </div>

        <div className="flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={handleSave}
            disabled={!selectedId}
            className="rounded-full bg-nara-lavanda-fuerte px-8 py-3 font-bold text-white transition hover:opacity-90 focus:outline-none focus:ring-4 focus:ring-nara-lavanda disabled:opacity-50"
          >
            Guardar registro de hoy
          </button>
          {saved && (
            <p role="status" className="text-sm text-nara-texto/80">
              Registro de hoy guardado. Solo se mostrará mientras esta página esté abierta.
            </p>
          )}
        </div>
      </section>

      <section className="flex flex-col gap-4 rounded-[2rem] bg-white/70 p-6 shadow-sm ring-1 ring-nara-menta sm:p-8">
        <h2 className="text-2xl font-bold text-nara-texto">Historial reciente</h2>
        {history.length === 0 ? (
          <p className="text-nara-texto/80">Todavía no hay registros.</p>
        ) : (
          <ul className="grid gap-2">
            {history.map((entry) => {
              const mood = findMood(entry.moodId);
              return (
                <li
                  key={entry.date}
                  className="flex items-center justify-between gap-4 rounded-2xl bg-nara-crema px-4 py-3"
                >
                  <span className="text-sm text-nara-texto/80">{formatLongDate(entry.date)}</span>
                  <span className="flex items-center gap-2 font-semibold text-nara-texto">
                    <span aria-hidden="true">{mood?.emoji}</span>
                    {mood?.label}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
