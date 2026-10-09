import Image from "next/image";
import Link from "next/link";
import { MoodPicker } from "@/components/MoodPicker";
import { NaraChat } from "@/components/NaraChat";
import { PanicButton } from "@/components/PanicButton";
import { PendingAction } from "@/components/PendingAction";
import { WelcomeHero } from "@/components/WelcomeHero";

// Pantalla de inicio tras el acceso de prueba.
export default function InicioPage() {
  return (
    <main className="flex flex-1 flex-col gap-8 bg-gradient-to-br from-nara-lavanda/60 via-nara-crema to-nara-cielo/60 px-5 py-10 sm:px-10">
      <div className="mx-auto grid w-full max-w-5xl gap-6 md:grid-cols-2">
        <WelcomeHero>
          <NaraChat />
        </WelcomeHero>
        <PanicButton />
      </div>

      <div className="mx-auto w-full max-w-5xl">
        <MoodPicker />
      </div>

      <div className="mx-auto grid w-full max-w-5xl gap-6 md:grid-cols-2">
        <section className="flex flex-col items-center gap-4 rounded-[2rem] bg-white/70 p-6 text-center shadow-sm ring-1 ring-nara-menta sm:p-8">
          <Image
            src="/images/atencion-psicologica.svg"
            alt=""
            width={200}
            height={140}
            className="h-auto w-full max-w-[200px]"
          />
          <h2 className="text-2xl font-bold text-nara-texto">Atención psicológica</h2>
          <p className="text-lg text-nara-texto/80">
            Si necesitas apoyo, puedes solicitar una cita{" "}
            <PendingAction className="inline font-bold text-nara-menta-fuerte underline underline-offset-4 hover:opacity-80">
              AQUÍ
            </PendingAction>
          </p>
        </section>

        <section className="flex flex-col items-center gap-4 rounded-[2rem] bg-white/70 p-6 text-center shadow-sm ring-1 ring-nara-cielo sm:p-8">
          <Image
            src="/images/bienestar-emocional.svg"
            alt=""
            width={200}
            height={140}
            className="h-auto w-full max-w-[200px]"
          />
          <h2 className="text-2xl font-bold text-nara-texto">Mi bienestar emocional</h2>
          <PendingAction className="rounded-full bg-nara-cielo-fuerte px-6 py-3 font-bold text-white transition hover:opacity-90 focus:outline-none focus:ring-4 focus:ring-nara-cielo">
            Ver mi progreso
          </PendingAction>
        </section>
      </div>

      <div className="mx-auto">
        <Link href="/" className="text-sm font-semibold text-nara-texto/70 underline-offset-4 hover:underline">
          Salir del modo de prueba
        </Link>
      </div>
    </main>
  );
}
