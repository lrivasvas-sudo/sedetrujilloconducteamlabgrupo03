import { Suspense, type ReactNode } from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/services/session";

// Comprueba la sesión en cada petición. Sin sesión válida y registrada, vuelve al acceso.
async function RequireSession({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/");
  }
  return children;
}

// Protege todas las pantallas de /inicio. La comprobación va dentro de Suspense
// porque depende de la cookie de la persona (solo existe en cada petición).
export default function InicioLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="flex flex-1 items-center justify-center px-5 py-10 text-nara-texto/80">
          Cargando...
        </div>
      }
    >
      <RequireSession>{children}</RequireSession>
    </Suspense>
  );
}
