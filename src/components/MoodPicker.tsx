"use client";

import { useState, useTransition } from "react";
import { saveMoodAction } from "@/app/actions";
import { moods, type Mood } from "@/config/moods";
import { toTimeText } from "@/lib/dates";
import { addMoodRecord } from "@/services/mood-log";

// Escala de 8 caritas para elegir cómo te sientes hoy.
// «Registrar» guarda la emoción con fecha y hora en la base de datos y muestra un mensaje motivacional.
export function MoodPicker() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [registered, setRegistered] = useState<{ mood: Mood; time: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const selected = moods.find((mood) => mood.id === selectedId);

  function handleRegister() {
    if (!selected) return;
    const mood = selected;

    startTransition(async () => {
      setError(null);
      const result = await saveMoodAction(mood.id);

      if (!result.ok) {
        setError(result.error);
        return;
      }

      // Se refleja también en el historial del panel de bienestar.
      addMoodRecord(mood.id);
      setRegistered({ mood, time: toTimeText(new Date(result.registradoEn)) });
    });
  }

  return (
    <section className="flex w-full flex-col gap-6 rounded-[2rem] bg-white/70 p-6 shadow-sm ring-1 ring-nara-lavanda sm:p-10">
      <div className="flex flex-col gap-2 text-center sm:text-left">
        <h2 className="text-2xl font-bold text-nara-texto">¿Cómo te sientes hoy?</h2>
        <p className="text-base text-nara-texto/70">
          {selected
            ? `Elegiste: ${selected.label.toLowerCase()}.`
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
              disabled={isPending}
              onClick={() => {
                setSelectedId(mood.id);
                setRegistered(null);
                setError(null);
              }}
              className={`flex flex-col items-center gap-2 rounded-3xl px-3 py-5 text-base font-semibold transition focus:outline-none focus:ring-4 focus:ring-nara-lavanda disabled:opacity-60 ${
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

      <div className="flex flex-col items-center gap-4">
        <button
          type="button"
          onClick={handleRegister}
          disabled={!selected || isPending}
          className="rounded-full bg-nara-lavanda-fuerte px-8 py-3 font-bold text-white transition hover:opacity-90 focus:outline-none focus:ring-4 focus:ring-nara-lavanda disabled:opacity-50"
        >
          {isPending ? "Guardando..." : "Registrar"}
        </button>

        {error && (
          <p role="alert" className="rounded-2xl bg-red-50 px-4 py-3 text-center text-sm font-semibold text-nara-texto ring-1 ring-red-200">
            {error}
          </p>
        )}

        {registered && (
          <div role="status" className="flex max-w-md flex-col gap-2 rounded-2xl bg-nara-menta/60 px-5 py-4 text-center text-nara-texto">
            <span className="text-sm font-semibold">
              Registrado hoy a las {registered.time}: {registered.mood.emoji} {registered.mood.label}
            </span>
            <p className="text-base leading-relaxed">{registered.mood.motivation}</p>
          </div>
        )}
      </div>
    </section>
  );
}
