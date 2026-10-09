"use client";

import { useState } from "react";
import { moods } from "@/config/moods";

// Escala de 8 caritas para elegir cómo te sientes hoy.
// La elección solo se muestra en pantalla; no se guarda.
export function MoodPicker() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = moods.find((mood) => mood.id === selectedId);

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
              onClick={() => setSelectedId(mood.id)}
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
    </section>
  );
}
