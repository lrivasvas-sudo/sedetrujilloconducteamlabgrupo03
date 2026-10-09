"use client";

import { useCallback, useState } from "react";
import { EmergencyPanel } from "@/components/EmergencyPanel";

// Botón de pánico. Abre el panel de ayuda urgente con contactos oficiales.
export function PanicButton() {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  return (
    <div className="flex w-full flex-col items-center gap-3">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
        className="flex w-full flex-1 flex-col items-center justify-center gap-4 rounded-[2rem] bg-white/70 px-12 py-14 text-lg font-bold text-nara-texto shadow-sm ring-1 ring-red-200 transition hover:bg-red-50 focus:outline-none focus:ring-4 focus:ring-red-300 sm:py-20"
      >
        Botón de pánico
        <span
          aria-hidden="true"
          className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500 text-white shadow-md"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-9 w-9"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M7 16a5 5 0 0 1 10 0" />
            <path d="M5 16h14v3H5z" />
            <path d="M12 4v2" />
            <path d="M6.5 6.5l1.4 1.4" />
            <path d="M17.5 6.5l-1.4 1.4" />
          </svg>
        </span>
      </button>

      {open && <EmergencyPanel onClose={close} />}
    </div>
  );
}
