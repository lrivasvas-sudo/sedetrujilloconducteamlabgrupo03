import Link from "next/link";
import { Logo } from "@/components/Logo";

// Página provisional a la que llega el modo de prueba.
// Aún no tiene funciones: sirve para comprobar la navegación.
export default function InicioPage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 bg-gradient-to-br from-nara-menta/60 via-nara-crema to-nara-lavanda/60 px-5 py-12 text-center">
      <Logo />
      <h1 className="text-2xl font-bold sm:text-3xl">Has entrado en modo de prueba</h1>
      <p className="max-w-md text-lg text-nara-texto/80">
        Esta página es provisional. Las funciones de bienestar llegarán en etapas posteriores.
      </p>
      <Link
        href="/"
        className="rounded-full bg-nara-menta-fuerte px-6 py-3 font-bold text-white transition hover:opacity-90"
      >
        Volver al inicio
      </Link>
    </main>
  );
}
