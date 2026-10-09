"use client";

import { useState } from "react";
import { demoDates, demoHours, formatHour, professionals } from "@/config/booking";
import { isSlotTaken, requestBooking } from "@/services/booking";

type Status = "idle" | "sending" | "done";

// Flujo de reserva: elegir profesional, fecha y horario, revisar el resumen y confirmar.
// Es una demostración: no hay base de datos conectada y no se reserva ninguna cita real.
export function BookingFlow() {
  const [professionalId, setProfessionalId] = useState<string | null>(null);
  const [dateIso, setDateIso] = useState<string | null>(null);
  const [hour, setHour] = useState<number | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState<{ professionalId: string; dateIso: string; hour: number } | null>(null);

  const busy = status === "sending";
  const selectedProfessional = professionals.find((p) => p.id === professionalId);
  const selectedDate = demoDates.find((d) => d.iso === dateIso);
  const isComplete = Boolean(selectedProfessional && selectedDate && hour !== null);

  function isHourTaken(candidate: number): boolean {
    if (!professionalId || !dateIso) return false;
    return isSlotTaken({ professionalId, date: dateIso, hour: candidate });
  }

  // Al cambiar una elección se quita el horario elegido (puede estar ocupado con otra opción)
  // y se borra cualquier mensaje de error anterior.
  function chooseProfessional(id: string) {
    setProfessionalId(id);
    setHour(null);
    setError(null);
  }

  function chooseDate(iso: string) {
    setDateIso(iso);
    setHour(null);
    setError(null);
  }

  function chooseHour(value: number) {
    setHour(value);
    setError(null);
  }

  function startOver() {
    setProfessionalId(null);
    setDateIso(null);
    setHour(null);
    setError(null);
    setConfirmed(null);
    setStatus("idle");
  }

  async function confirmRequest() {
    if (!professionalId || !dateIso || hour === null) return;

    setStatus("sending");
    setError(null);

    try {
      const result = await requestBooking({ professionalId, date: dateIso, hour });

      if (result.ok) {
        setConfirmed({ professionalId, dateIso, hour });
        setStatus("done");
      } else {
        setHour(null);
        setError("Ese horario acaba de ocuparse. Elige otro horario disponible.");
        setStatus("idle");
      }
    } catch {
      setError("No pudimos enviar tu solicitud. Revisa tu conexión e inténtalo de nuevo.");
      setStatus("idle");
    }
  }

  if (status === "done" && confirmed) {
    const doneProfessional = professionals.find((p) => p.id === confirmed.professionalId);
    const doneDate = demoDates.find((d) => d.iso === confirmed.dateIso);

    return (
      <section
        role="status"
        className="flex flex-col gap-6 rounded-[2rem] bg-white/70 p-6 text-center shadow-sm ring-1 ring-nara-menta sm:p-10"
      >
        <h1 className="text-3xl font-bold text-nara-texto">Cita Agendada</h1>

        <dl className="mx-auto grid w-full max-w-sm gap-3 rounded-2xl bg-nara-menta/50 p-5 text-left">
          <div className="flex justify-between gap-4">
            <dt className="font-semibold text-nara-texto/80">Profesional</dt>
            <dd className="font-bold text-nara-texto">{doneProfessional?.name}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="font-semibold text-nara-texto/80">Fecha</dt>
            <dd className="font-bold text-nara-texto">{doneDate?.long}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="font-semibold text-nara-texto/80">Hora</dt>
            <dd className="font-bold text-nara-texto">{formatHour(confirmed.hour)}</dd>
          </div>
        </dl>

        <p className="text-sm text-nara-texto/70">
          Demostración: esta cita no está reservada en ningún sistema.
        </p>

        <p className="text-xl font-bold text-nara-menta-fuerte">Te esperamos.</p>

        <button
          type="button"
          onClick={startOver}
          className="mx-auto rounded-full bg-nara-lavanda-fuerte px-6 py-3 font-bold text-white transition hover:opacity-90 focus:outline-none focus:ring-4 focus:ring-nara-lavanda"
        >
          Reservar otra cita
        </button>
      </section>
    );
  }

  return (
    <div className="flex w-full flex-col gap-6">
      <header className="flex flex-col gap-3 rounded-[2rem] bg-white/70 p-6 text-center shadow-sm ring-1 ring-nara-lavanda sm:p-8">
        <h1 className="text-3xl font-bold text-nara-texto">Reserva tu cita</h1>
        <p className="rounded-2xl bg-nara-lavanda/50 px-4 py-3 text-sm text-nara-texto">
          Demostración: los profesionales y horarios son ficticios. No se reserva ninguna cita real.
        </p>
      </header>

      {error && (
        <p role="alert" className="rounded-2xl bg-red-50 px-4 py-3 text-center text-sm font-semibold text-nara-texto ring-1 ring-red-200">
          {error}
        </p>
      )}

      <section aria-labelledby="titulo-profesional" className="flex flex-col gap-4 rounded-[2rem] bg-white/70 p-6 shadow-sm ring-1 ring-nara-cielo sm:p-8">
        <h2 id="titulo-profesional" className="text-xl font-bold text-nara-texto">
          1. Elige un profesional
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {professionals.map((professional) => {
            const isSelected = professional.id === professionalId;
            const isMedical = professional.area === "Área médica";
            return (
              <button
                key={professional.id}
                type="button"
                disabled={busy}
                aria-pressed={isSelected}
                onClick={() => chooseProfessional(professional.id)}
                className={`flex flex-col gap-1 rounded-2xl px-5 py-4 text-left transition focus:outline-none focus:ring-4 focus:ring-nara-cielo-fuerte disabled:opacity-60 ${
                  isSelected
                    ? "bg-nara-cielo ring-2 ring-nara-cielo-fuerte"
                    : "bg-white/80 ring-1 ring-nara-cielo hover:bg-nara-cielo/50"
                }`}
              >
                <span className="text-lg font-bold text-nara-texto">{professional.name}</span>
                <span className="text-sm text-nara-texto/80">{professional.role}</span>
                <span
                  className={`mt-1 w-fit rounded-full px-3 py-1 text-xs font-semibold ${
                    isMedical ? "bg-nara-menta text-nara-texto" : "bg-nara-lavanda text-nara-texto"
                  }`}
                >
                  {professional.area}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section aria-labelledby="titulo-fecha" className="flex flex-col gap-4 rounded-[2rem] bg-white/70 p-6 shadow-sm ring-1 ring-nara-lavanda sm:p-8">
        <h2 id="titulo-fecha" className="text-xl font-bold text-nara-texto">
          2. Elige una fecha
        </h2>
        <div className="-mx-2 flex gap-2 overflow-x-auto px-2 pb-2">
          {demoDates.map((date) => {
            const isSelected = date.iso === dateIso;
            return (
              <button
                key={date.iso}
                type="button"
                disabled={busy}
                aria-pressed={isSelected}
                onClick={() => chooseDate(date.iso)}
                className={`shrink-0 rounded-full px-5 py-3 font-bold transition focus:outline-none focus:ring-4 focus:ring-nara-lavanda disabled:opacity-60 ${
                  isSelected
                    ? "bg-nara-lavanda-fuerte text-white"
                    : "bg-white/80 text-nara-texto ring-1 ring-nara-lavanda hover:bg-nara-lavanda/60"
                }`}
              >
                {date.short}
              </button>
            );
          })}
        </div>
      </section>

      <section aria-labelledby="titulo-horario" className="flex flex-col gap-4 rounded-[2rem] bg-white/70 p-6 shadow-sm ring-1 ring-nara-menta sm:p-8">
        <h2 id="titulo-horario" className="text-xl font-bold text-nara-texto">
          3. Elige un horario
        </h2>
        {!professionalId || !dateIso ? (
          <p className="text-sm text-nara-texto/80">
            Primero elige un profesional y una fecha para ver los horarios.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {demoHours.map((candidate) => {
              const taken = isHourTaken(candidate);
              const isSelected = candidate === hour;
              return (
                <button
                  key={candidate}
                  type="button"
                  disabled={busy || taken}
                  aria-pressed={isSelected}
                  onClick={() => chooseHour(candidate)}
                  className={`flex flex-col items-center gap-1 rounded-2xl px-3 py-3 text-sm font-bold transition focus:outline-none focus:ring-4 focus:ring-nara-menta-fuerte disabled:cursor-not-allowed ${
                    taken
                      ? "bg-nara-texto/5 text-nara-texto/50 line-through"
                      : isSelected
                        ? "bg-nara-menta-fuerte text-white"
                        : "bg-white/80 text-nara-texto ring-1 ring-nara-menta hover:bg-nara-menta/60"
                  }`}
                >
                  {formatHour(candidate)}
                  {taken && <span className="text-xs font-semibold no-underline">Ocupado</span>}
                </button>
              );
            })}
          </div>
        )}
      </section>

      {isComplete && selectedProfessional && selectedDate && hour !== null && (
        <section aria-labelledby="titulo-resumen" className="flex flex-col gap-4 rounded-[2rem] bg-white/70 p-6 shadow-sm ring-1 ring-nara-cielo sm:p-8">
          <h2 id="titulo-resumen" className="text-xl font-bold text-nara-texto">
            Resumen
          </h2>
          <dl className="grid gap-3 rounded-2xl bg-nara-cielo/40 p-5">
            <div className="flex justify-between gap-4">
              <dt className="font-semibold text-nara-texto/80">Profesional</dt>
              <dd className="text-right font-bold text-nara-texto">{selectedProfessional.name}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="font-semibold text-nara-texto/80">Fecha</dt>
              <dd className="text-right font-bold text-nara-texto">{selectedDate.long}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="font-semibold text-nara-texto/80">Hora</dt>
              <dd className="text-right font-bold text-nara-texto">{formatHour(hour)}</dd>
            </div>
          </dl>

          <button
            type="button"
            onClick={confirmRequest}
            disabled={busy}
            className="rounded-full bg-nara-menta-fuerte px-8 py-3 text-lg font-bold text-white transition hover:opacity-90 focus:outline-none focus:ring-4 focus:ring-nara-menta disabled:opacity-60"
          >
            {busy ? "Enviando solicitud..." : "Confirmar solicitud"}
          </button>
        </section>
      )}
    </div>
  );
}
