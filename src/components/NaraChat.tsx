"use client";

import { useEffect, useId, useRef, useState, type FormEvent, type KeyboardEvent, type MouseEvent } from "react";
import { careLineNumber } from "@/config/emergency";
import {
  NARA_GREETING,
  NARA_RESTART,
  NARA_TEXT_STEPS,
  advanceNara,
  type NaraOption,
  type NaraStep,
} from "@/config/nara-flow";

const formattedCareNumber = careLineNumber.replace(/(\d{3})(\d{3})(\d{3})/, "$1 $2 $3");

type Message = { from: "nara" | "user"; text: string };

// Chat guiado con Nara. Se abre desde «Conversar con Nara» y no guarda la conversación.
export function NaraChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [step, setStep] = useState<NaraStep>("inicio");
  const [options, setOptions] = useState<NaraOption[]>([]);
  const [text, setText] = useState("");
  const [showCareNumber, setShowCareNumber] = useState(false);

  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  function reset() {
    setMessages([{ from: "nara", text: NARA_GREETING }]);
    setStep("inicio");
    setOptions([]);
    setText("");
    setShowCareNumber(false);
  }

  function openChat() {
    reset();
    setOpen(true);
  }

  function closeChat() {
    setOpen(false);
  }

  function respond(value: string, label: string) {
    if (value === NARA_RESTART) {
      reset();
      return;
    }
    const turn = advanceNara(step, value);
    setMessages((prev) => [
      ...prev,
      { from: "user", text: label },
      ...turn.replies.map((reply) => ({ from: "nara" as const, text: reply })),
    ]);
    setStep(turn.step);
    setOptions(turn.options ?? []);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const clean = text.trim();
    if (!clean) return;
    setText("");
    respond(clean, clean);
  }

  // En celular el enlace tel: marca directo. En computadora se muestra el número.
  function handleCallClick(event: MouseEvent<HTMLAnchorElement>) {
    const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;
    if (!isTouchDevice) {
      event.preventDefault();
      setShowCareNumber(true);
    }
  }

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    const trigger = triggerRef.current;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    function handleEscape(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
      }
    }

    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = previousOverflow;
      trigger?.focus();
    };
  }, [open]);

  // Mantiene el foco dentro del diálogo mientras está abierto.
  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "Tab" || !dialogRef.current) return;

    const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
      "a[href], button:not([disabled]), input:not([disabled])",
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

  const canWrite = NARA_TEXT_STEPS.includes(step);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={openChat}
        aria-haspopup="dialog"
        className="rounded-full bg-nara-lavanda-fuerte px-8 py-3 text-lg font-bold text-white transition hover:opacity-90 focus:outline-none focus:ring-4 focus:ring-nara-lavanda"
      >
        Conversar con Nara
      </button>

      {open && (
        <div
          onClick={(event) => {
            if (event.target === event.currentTarget) closeChat();
          }}
          className="fixed inset-0 z-50 flex items-end justify-center bg-nara-texto/40 p-0 sm:items-center sm:p-6"
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            onKeyDown={handleKeyDown}
            className="flex h-[90dvh] w-full max-w-lg flex-col gap-4 rounded-t-[2rem] bg-nara-crema p-6 shadow-xl sm:h-auto sm:max-h-[85dvh] sm:rounded-[2rem] sm:p-8"
          >
            <header className="flex items-center justify-between gap-4">
              <h2 id={titleId} className="text-2xl font-bold text-nara-texto">
                Nara
              </h2>
              <button
                ref={closeRef}
                type="button"
                onClick={closeChat}
                className="min-h-11 rounded-full bg-white/80 px-5 font-bold text-nara-texto ring-1 ring-nara-lavanda transition hover:bg-nara-lavanda/60 focus:outline-none focus:ring-4 focus:ring-nara-lavanda"
              >
                Cerrar
              </button>
            </header>

            <ol
              aria-live="polite"
              className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto pr-1"
            >
              {messages.map((message, index) => (
                <li
                  key={index}
                  className={`max-w-[85%] whitespace-pre-line rounded-2xl px-4 py-3 text-base leading-relaxed ${
                    message.from === "nara"
                      ? "self-start bg-white/80 text-nara-texto ring-1 ring-nara-lavanda"
                      : "self-end bg-nara-cielo text-nara-texto"
                  }`}
                >
                  {message.text}
                </li>
              ))}

              {step === "llamada" && (
                <li className="flex flex-col items-center gap-2 self-stretch pt-2">
                  <a
                    href={`tel:${careLineNumber}`}
                    onClick={handleCallClick}
                    className="rounded-full bg-nara-menta-fuerte px-8 py-3 text-lg font-bold text-white transition hover:opacity-90 focus:outline-none focus:ring-4 focus:ring-nara-menta"
                  >
                    Llamar a un profesional
                  </a>
                  {showCareNumber && (
                    <p role="status" className="text-center text-sm text-nara-texto">
                      Para llamar, marca {formattedCareNumber} desde tu teléfono.
                    </p>
                  )}
                </li>
              )}
            </ol>

            {options.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2">
                {options.map((option) => (
                  <button
                    key={option.label}
                    type="button"
                    onClick={() => respond(option.value, option.label)}
                    className="rounded-full bg-white/80 px-4 py-2 text-sm font-bold text-nara-texto ring-1 ring-nara-lavanda-fuerte transition hover:bg-nara-lavanda/60 focus:outline-none focus:ring-4 focus:ring-nara-lavanda"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}

            {canWrite && (
              <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                  type="text"
                  value={text}
                  onChange={(event) => setText(event.target.value)}
                  aria-label="Escribe tu mensaje"
                  placeholder="Escribe aquí..."
                  className="min-h-12 flex-1 rounded-full bg-white px-5 text-base text-nara-texto ring-1 ring-nara-lavanda focus:outline-none focus:ring-4 focus:ring-nara-lavanda"
                />
                <button
                  type="submit"
                  className="min-h-12 rounded-full bg-nara-lavanda-fuerte px-6 font-bold text-white transition hover:opacity-90 focus:outline-none focus:ring-4 focus:ring-nara-lavanda"
                >
                  Enviar
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
