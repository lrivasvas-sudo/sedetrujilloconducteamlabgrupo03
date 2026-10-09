import Link from "next/link";
import { MoodPicker } from "@/components/MoodPicker";
import { PanicButton } from "@/components/PanicButton";
import { PendingAction } from "@/components/PendingAction";
import { WelcomeHero } from "@/components/WelcomeHero";

// Pantalla de inicio tras el acceso de prueba.
export default function InicioPage() {
  return (
    <main className="flex flex-1 flex-col gap-8 bg-gradient-to-br from-nara-lavanda/60 via-nara-crema to-nara-cielo/60 px-5 py-10 sm:px-10">
      <div className="mx-auto grid w-full max-w-5xl items-start gap-6 md:grid-cols-[1fr_auto]">
        <WelcomeHero>
          <PendingAction className="rounded-full bg-nara-lavanda-fuerte px-8 py-3 text-lg font-bold text-white transition hover:opacity-90 focus:outline-none focus:ring-4 focus:ring-nara-lavanda">
            Conversar con Nara
          </PendingAction>
        </WelcomeHero>
        <PanicButton />
      </div>

      <div className="mx-auto w-full max-w-5xl">
        <MoodPicker />
      </div>

      <section className="mx-auto flex w-full max-w-5xl flex-col gap-4 rounded-[2rem] bg-white/70 p-6 text-center shadow-sm ring-1 ring-nara-menta sm:p-10">
        <h2 className="text-2xl font-bold text-nara-texto">Atención psicológica</h2>
        <p className="text-lg text-nara-texto/80">
          Si necesitas apoyo, puedes solicitar una cita{" "}
          <PendingAction className="inline font-bold text-nara-menta-fuerte underline underline-offset-4 hover:opacity-80">
            AQUÍ
          </PendingAction>
        </p>
      </section>

      <section className="mx-auto flex w-full max-w-5xl flex-col items-center gap-5 rounded-[2rem] bg-white/70 p-6 text-center shadow-sm ring-1 ring-nara-cielo sm:p-10">
        <h2 className="text-2xl font-bold text-nara-texto">Mi bienestar emocional</h2>
        <PendingAction className="rounded-full bg-nara-cielo-fuerte px-6 py-3 font-bold text-white transition hover:opacity-90 focus:outline-none focus:ring-4 focus:ring-nara-cielo">
          Ver mi progreso
        </PendingAction>
      </section>

      <div className="mx-auto">
        <Link href="/" className="text-sm font-semibold text-nara-texto/70 underline-offset-4 hover:underline">
          Salir del modo de prueba
        </Link>
      </div>
    </main>
  );
}
