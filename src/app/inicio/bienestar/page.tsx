import Link from "next/link";
import { WellbeingPanel } from "@/components/WellbeingPanel";

// Panel personal de bienestar emocional (datos ficticios, sin base de datos).
export default function BienestarPage() {
  return (
    <main className="flex flex-1 flex-col gap-6 bg-gradient-to-br from-nara-lavanda/60 via-nara-crema to-nara-cielo/60 px-5 py-10 sm:px-10">
      <div className="mx-auto w-full max-w-4xl">
        <Link href="/inicio" className="text-sm font-semibold text-nara-texto/70 underline-offset-4 hover:underline">
          ← Volver al inicio
        </Link>
      </div>

      <div className="mx-auto w-full max-w-4xl">
        <WellbeingPanel />
      </div>
    </main>
  );
}
