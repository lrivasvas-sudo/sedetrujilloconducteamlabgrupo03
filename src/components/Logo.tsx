// Logotipo de Nara: solo la palabra, con tipografía redondeada.
export function Logo({ className = "" }: { className?: string }) {
  return (
    <span
      className={`text-5xl font-extrabold tracking-wide text-nara-lavanda-fuerte sm:text-6xl ${className}`}
    >
      Nara
    </span>
  );
}
