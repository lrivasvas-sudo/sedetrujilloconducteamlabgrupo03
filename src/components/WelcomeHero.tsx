import type { ReactNode } from "react";
import { siteConfig } from "@/config/site";
import { Logo } from "@/components/Logo";

// Bloque principal de bienvenida: logo, pregunta y mensaje.
// «children» permite añadir una acción debajo del mensaje (por ejemplo, un botón).
export function WelcomeHero({ children }: { children?: ReactNode }) {
  return (
    <section className="flex w-full max-w-2xl flex-col items-center gap-8 rounded-[2rem] bg-white/70 px-6 py-14 text-center shadow-sm ring-1 ring-nara-lavanda sm:px-12 sm:py-20">
      <Logo />

      <div className="flex flex-col gap-3">
        <h1 className="text-2xl font-bold text-nara-texto sm:text-3xl">
          {siteConfig.welcomeQuestion}
        </h1>
        <p className="text-lg leading-relaxed text-nara-texto/80 sm:text-xl">
          {siteConfig.welcomeMessage}
        </p>
      </div>

      {children}

      <div className="flex gap-3" aria-hidden="true">
        <span className="h-3 w-3 rounded-full bg-nara-lavanda" />
        <span className="h-3 w-3 rounded-full bg-nara-menta" />
        <span className="h-3 w-3 rounded-full bg-nara-cielo" />
      </div>
    </section>
  );
}
