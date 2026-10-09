"use client";

import { useEffect, useId, useRef, type KeyboardEvent, type MouseEvent } from "react";
import { emergencyContacts } from "@/config/emergency";

function MedicalIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-8 w-8" fill="currentColor">
      <path d="M10 3h4v7h7v4h-7v7h-4v-7H3v-4h7z" />
    </svg>
  );
}

function PsychologicalIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-8 w-8"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />
    </svg>
  );
}

// Panel de ayuda urgente. Se abre desde el botón de pánico.
// No guarda datos, no envía nada y no registra la visita.
// Se cierra con Escape, con el botón «Cerrar» o tocando el fondo.
export function EmergencyPanel({ onClose }: { onClose: () => void }) {
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    function handleEscape(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    }

    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus();
    };
  }, [onClose]);

  // Mantiene el foco dentro del panel mientras está abierto.
  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "Tab" || !dialogRef.current) return;

    const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
      "a[href], button:not([disabled])",
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (!first || !last) return;

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function handleBackdropClick(event: MouseEvent<HTMLDivElement>) {
    if (event.target === event.currentTarget) onClose();
  }

  return (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-end justify-center bg-nara-texto/40 p-0 sm:items-center sm:p-6"
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onKeyDown={handleKeyDown}
        className="flex max-h-[90dvh] w-full max-w-lg flex-col gap-6 overflow-y-auto rounded-t-[2rem] bg-nara-crema p-6 shadow-xl sm:rounded-[2rem] sm:p-8"
      >
        <header className="flex flex-col gap-2 text-center">
          <h2 id={titleId} className="text-2xl font-bold text-nara-texto">
            Ayuda urgente
          </h2>
          <p className="text-lg text-nara-texto/80">
            Lo que sientes importa. No tienes que atravesar este momento a solas.
          </p>
        </header>

        <p
          role="alert"
          className="rounded-2xl bg-red-50 px-4 py-3 text-center text-sm font-semibold text-nara-texto ring-1 ring-red-200"
        >
          Si estás en peligro o podrías hacerte daño, llama ahora a los servicios de emergencia.
          Nara no reemplaza una atención de emergencia.
        </p>

        <p className="text-center text-2xl font-black text-nara-lavanda-fuerte">
          Respira y pide ayuda
        </p>

        <ul className="flex flex-col gap-3">
          {emergencyContacts.map((contact) => (
            <li key={contact.number}>
              <a
                href={`tel:${contact.number}`}
                className="flex min-h-14 items-center justify-between gap-4 rounded-2xl bg-white/80 px-5 py-3 ring-1 ring-nara-menta transition hover:bg-nara-menta/60 focus:outline-none focus:ring-4 focus:ring-nara-menta-fuerte"
              >
                <span className="flex flex-col">
                  <span className="font-bold text-nara-texto">{contact.name}</span>
                  <span className="text-sm text-nara-texto/80">{contact.description}</span>
                </span>
                <span className="shrink-0 text-2xl font-black text-nara-menta-fuerte">
                  {contact.number}
                </span>
              </a>
            </li>
          ))}
        </ul>

        <nav aria-label="Acceso rápido" className="flex justify-center gap-8">
          {emergencyContacts
            .filter((contact) => contact.kind)
            .map((contact) => (
              <a
                key={contact.number}
                href={`tel:${contact.number}`}
                className="flex flex-col items-center gap-2 rounded-2xl p-2 text-center font-bold text-nara-texto transition hover:opacity-80 focus:outline-none focus:ring-4 focus:ring-nara-menta-fuerte"
              >
                <span
                  aria-hidden="true"
                  className={`flex h-16 w-16 items-center justify-center rounded-full text-white shadow-md ${
                    contact.kind === "medical" ? "bg-red-400" : "bg-nara-cielo-fuerte"
                  }`}
                >
                  {contact.kind === "medical" ? <MedicalIcon /> : <PsychologicalIcon />}
                </span>
                {contact.kind === "medical" ? "Atención médica" : "Atención psicológica"}
              </a>
            ))}
        </nav>

        <p className="text-center text-xs text-nara-texto/70">
          Esta ventana no guarda datos ni registra tu visita. Presiona Esc para cerrarla.
        </p>

        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          className="min-h-12 rounded-full bg-nara-lavanda-fuerte px-6 py-3 font-bold text-white transition hover:opacity-90 focus:outline-none focus:ring-4 focus:ring-nara-lavanda"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}
