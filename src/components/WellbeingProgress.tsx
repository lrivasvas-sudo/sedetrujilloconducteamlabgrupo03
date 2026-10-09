"use client";

import { useState } from "react";
import { findMood, type CareReview, type MoodRecord } from "@/config/wellbeing";
import { moods } from "@/config/moods";
import { addDays, weekdayShort } from "@/lib/dates";

type Period = "semana" | "mes";

type BarItem = { label: string; sub: string; value: number | null };

function average(values: number[]): number | null {
  if (values.length === 0) return null;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

// Barras verticales con puntaje de 1 a 5. Los días sin registro quedan vacíos.
function ScoreBars({ items }: { items: BarItem[] }) {
  return (
    <div className="flex h-56 items-end gap-2 sm:gap-4" role="img" aria-label="Gráfico de evolución del bienestar">
      {items.map((item) => (
        <div key={item.label + item.sub} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
          <div className="flex w-full flex-1 flex-col justify-end">
            {item.value === null ? (
              <div className="h-3 w-full rounded-full border-2 border-dashed border-nara-texto/20" />
            ) : (
              <div
                className="w-full rounded-t-2xl bg-gradient-to-t from-nara-lavanda-fuerte/70 to-nara-lavanda"
                style={{ height: `${(item.value / 5) * 100}%` }}
                title={`${item.value.toFixed(1)} de 5`}
              />
            )}
          </div>
          <span className="text-xs font-semibold text-nara-texto/80">{item.label}</span>
          <span className="text-[11px] text-nara-texto/60">{item.sub}</span>
        </div>
      ))}
    </div>
  );
}

function SummaryCard({ title, value, detail, color }: { title: string; value: string; detail: string; color: string }) {
  return (
    <div className={`flex flex-col gap-1 rounded-[2rem] p-5 shadow-sm ring-1 ring-white ${color}`}>
      <span className="text-sm font-semibold text-nara-texto/80">{title}</span>
      <span className="text-2xl font-bold text-nara-texto">{value}</span>
      <span className="text-sm text-nara-texto/70">{detail}</span>
    </div>
  );
}

// Resumen visual del progreso: emociones frecuentes, cambios en el tiempo y valoraciones.
export function WellbeingProgress({
  today,
  entries,
  reviews,
}: {
  today: string;
  entries: MoodRecord[];
  reviews: CareReview[];
}) {
  const [period, setPeriod] = useState<Period>("semana");

  const monthFrom = addDays(today, -29);
  const weekFrom = addDays(today, -6);
  const inRange = (from: string, to: string) =>
    entries.filter((entry) => entry.date >= from && entry.date <= to);

  const lastMonth = inRange(monthFrom, today);
  const shownEntries = period === "semana" ? inRange(weekFrom, today) : lastMonth;

  // Frecuencia de emociones por periodo (semana o mes).
  const countsFor = (list: MoodRecord[]) =>
    moods
      .map((mood) => ({
        mood,
        count: list.filter((entry) => entry.moodId === mood.id).length,
      }))
      .filter((item) => item.count > 0)
      .sort((a, b) => b.count - a.count);

  const counts = countsFor(shownEntries);
  const maxCount = counts[0]?.count ?? 0;

  // Resumen de los últimos 30 días, sin depender del periodo elegido.
  const topMood = countsFor(lastMonth)[0];
  const monthAverage = average(lastMonth.map((entry) => findMood(entry.moodId)?.score ?? 0));
  const ratingAverage = average(reviews.map((review) => review.rating));
  const usefulShare = reviews.length
    ? Math.round((reviews.filter((review) => review.useful).length / reviews.length) * 100)
    : null;

  // Evolución: 7 días (semana) o 4 semanas (mes).
  const weekItems: BarItem[] = Array.from({ length: 7 }, (_, index) => {
    const date = addDays(today, index - 6);
    // Si hay varios registros el mismo día, se usa el promedio de ese día.
    const dayEntries = entries.filter((item) => item.date === date);
    return {
      label: weekdayShort(date),
      sub: date.slice(8),
      value: average(dayEntries.map((item) => findMood(item.moodId)?.score ?? 0)),
    };
  });

  const monthItems: BarItem[] = Array.from({ length: 4 }, (_, index) => {
    const to = addDays(today, -7 * (3 - index));
    const from = addDays(to, -6);
    const bucket = inRange(from, to);
    const value = average(bucket.map((entry) => findMood(entry.moodId)?.score ?? 0));
    return { label: `Sem ${index + 1}`, sub: `${from.slice(8)}–${to.slice(8)}`, value };
  });

  return (
    <div className="flex flex-col gap-6">
      <section aria-label="Resumen de progreso" className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <SummaryCard
          title="Emoción más frecuente"
          value={topMood ? `${topMood.mood.emoji} ${topMood.mood.label}` : "—"}
          detail={lastMonth.length ? "Últimos 30 días" : "Aún no hay registros"}
          color="bg-nara-lavanda/60"
        />
        <SummaryCard
          title="Bienestar promedio"
          value={monthAverage === null ? "—" : `${monthAverage.toFixed(1)} / 5`}
          detail={`${lastMonth.length} registros en 30 días`}
          color="bg-nara-menta/60"
        />
        <SummaryCard
          title="Valoración de atenciones"
          value={ratingAverage === null ? "—" : `★ ${ratingAverage.toFixed(1)} / 5`}
          detail={reviews.length ? `${reviews.length} valoraciones` : "Aún no hay valoraciones"}
          color="bg-nara-cielo/70"
        />
        <SummaryCard
          title="Te resultaron útiles"
          value={usefulShare === null ? "—" : `${usefulShare}%`}
          detail="De las atenciones valoradas"
          color="bg-nara-crema"
        />
      </section>

      <section className="flex flex-col gap-4 rounded-[2rem] bg-white/70 p-6 shadow-sm ring-1 ring-nara-lavanda sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-2xl font-bold text-nara-texto">Evolución del bienestar</h2>
          <div className="flex gap-2" role="group" aria-label="Periodo">
            {(["semana", "mes"] as const).map((option) => (
              <button
                key={option}
                type="button"
                aria-pressed={period === option}
                onClick={() => setPeriod(option)}
                className={`rounded-full px-4 py-2 text-sm font-bold capitalize transition focus:outline-none focus:ring-4 focus:ring-nara-lavanda ${
                  period === option
                    ? "bg-nara-lavanda-fuerte text-white"
                    : "bg-nara-crema text-nara-texto ring-1 ring-nara-lavanda"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
        <p className="text-sm text-nara-texto/70">
          {period === "semana"
            ? "Puntaje de cada día de la última semana (1 a 5)."
            : "Promedio semanal de las últimas 4 semanas (1 a 5)."}
        </p>
        <ScoreBars items={period === "semana" ? weekItems : monthItems} />
      </section>

      <section className="flex flex-col gap-4 rounded-[2rem] bg-white/70 p-6 shadow-sm ring-1 ring-nara-menta sm:p-8">
        <h2 className="text-2xl font-bold text-nara-texto">Emociones más frecuentes</h2>
        {counts.length === 0 ? (
          <p className="text-nara-texto/80">
            No hay registros en este periodo. Registra cómo te sientes para ver tu frecuencia.
          </p>
        ) : (
          <ul className="flex flex-col gap-3">
            {counts.map((item) => (
              <li key={item.mood.id} className="flex items-center gap-3">
                <span className="flex w-36 shrink-0 items-center gap-2 text-sm font-semibold text-nara-texto">
                  <span aria-hidden="true" className="text-xl">{item.mood.emoji}</span>
                  {item.mood.label}
                </span>
                <div className="h-4 flex-1 overflow-hidden rounded-full bg-nara-crema">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-nara-menta-fuerte/60 to-nara-menta"
                    style={{ width: `${(item.count / maxCount) * 100}%` }}
                  />
                </div>
                <span className="w-10 shrink-0 text-right text-sm font-bold text-nara-texto">{item.count}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
