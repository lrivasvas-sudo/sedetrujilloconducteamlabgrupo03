"use client";

import { useState, type ReactNode } from "react";

// Botón de una función que todavía no existe.
// Solo muestra un aviso: no abre ninguna cita ni guarda ningún dato.
export function PendingAction({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const [showNotice, setShowNotice] = useState(false);

  return (
    <span className="block">
      <button
        type="button"
        onClick={() => setShowNotice(true)}
        className={className}
      >
        {children}
      </button>
      {showNotice && (
        <span role="status" className="mt-3 block text-sm text-nara-texto/80">
          Esta función estará disponible en una etapa posterior del proyecto.
        </span>
      )}
    </span>
  );
}
