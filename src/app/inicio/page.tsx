import Link from "next/link";
import { MoodPicker } from "@/components/MoodPicker";
import { PanicButton } from "@/components/PanicButton";
import { WelcomeHero } from "@/components/WelcomeHero";

// Pantalla de inicio tras el acceso de prueba.
export default function InicioPage() {
  return (
    <main className="flex flex-1 flex-col gap-8 bg-gradient-to-br from-nara-lavanda/60 via-nara-crema to-nara-cielo/60 px-5 py-10 sm:px-10">
      <div className="mx-auto grid w-full max-w-5xl items-start gap-6 md:grid-cols-[1fr_auto]">
        <WelcomeHero />
        <PanicButton />
      </div>

      <div className="mx-auto w-full max-w-5xl">
        <MoodPicker />
      </div>

      <div className="mx-auto">
        <Link href="/" className="text-sm font-semibold text-nara-texto/70 underline-offset-4 hover:underline">
          Salir del modo de prueba
        </Link>
      </div>
    </main>
  );
}
