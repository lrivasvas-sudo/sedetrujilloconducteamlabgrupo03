"use client";

import { MoodPicker } from "@/components/MoodPicker";
import { findMood, type MoodRecord } from "@/config/wellbeing";
import { formatLongDate } from "@/lib/dates";

// Registro de emociones (mismo selector que en inicio) y el historial con fecha y hora.
export function WellbeingRegister({ records }: { records: MoodRecord[] }) {
  const history = records.slice(0, 20);

  return (
    <div className="flex flex-col gap-6">
      <MoodPicker />

      <section className="flex flex-col gap-4 rounded-[2rem] bg-white/70 p-6 shadow-sm ring-1 ring-nara-menta sm:p-8">
        <h2 className="text-2xl font-bold text-nara-texto">Historial reciente</h2>
        {history.length === 0 ? (
          <p className="text-nara-texto/80">Todavía no hay registros.</p>
        ) : (
          <ul className="grid gap-2">
            {history.map((record, index) => {
              const mood = findMood(record.moodId);
              return (
                <li
                  key={index}
                  className="flex items-center justify-between gap-4 rounded-2xl bg-nara-crema px-4 py-3"
                >
                  <span className="text-sm text-nara-texto/80">
                    {formatLongDate(record.date)} · {record.time}
                  </span>
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
