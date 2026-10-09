"use client";

import { useState } from "react";

// Botón de pánico. Todavía NO conecta con ningún servicio de ayuda:
// solo muestra un aviso. La conexión real se definirá con la UCV en una etapa posterior.
export function PanicButton() {
  const [showNotice, setShowNotice] = useState(false);

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        type="button"
        onClick={() => setShowNotice(true)}
        aria-describedby={showNotice ? "aviso-panico" : undefined}
        className="flex h-full min-h-32 w-full flex-col items-center justify-center gap-2 rounded-[2rem] bg-white/70 px-5 py-4 text-base font-bold text-nara-texto shadow-sm ring-1 ring-red-200 transition hover:bg-red-50 focus:outline-none focus:ring-4 focus:ring-red-300 md:w-40"
      >
        Botón de pánico
        <span
          aria-hidden="true"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500 text-2xl font-black text-white shadow-md"
        >
          !
        </span>
      </button>

      {showNotice && (
        <p
          id="aviso-panico"
          role="status"
          className="max-w-xs rounded-2xl bg-red-50 px-4 py-3 text-center text-sm text-nara-texto"
        >
          Esta función todavía no está activa. Si estás en peligro, comunícate de inmediato con los servicios de emergencia de tu localidad.
        </p>
      )}
    </div>
  );
}
