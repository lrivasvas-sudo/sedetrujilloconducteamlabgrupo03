"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

// Formulario de acceso en MODO DE PRUEBA.
// No verifica el correo ni la contraseña, no los guarda y no los envía a ningún servidor.
// Cuando exista autenticación real (etapa de usuarios), este bloque se reemplazará.
export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPassword("");
    router.push("/inicio");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-md flex-col gap-5 rounded-[2rem] bg-white/80 p-6 shadow-sm ring-1 ring-nara-cielo sm:p-10"
    >
      <p className="rounded-2xl bg-nara-cielo/60 px-4 py-3 text-sm text-nara-texto">
        <strong>Modo de prueba:</strong> cualquier correo y contraseña permiten
        entrar. Nada se guarda ni se verifica.
      </p>

      <label className="flex flex-col gap-2 text-sm font-semibold text-nara-texto">
        Correo institucional
        <input
          type="email"
          name="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="nombre@ucv.edu.pe"
          className="rounded-2xl border border-nara-lavanda bg-white px-4 py-3 text-base font-normal outline-none transition focus:border-nara-lavanda-fuerte focus:ring-2 focus:ring-nara-lavanda"
        />
      </label>

      <label className="flex flex-col gap-2 text-sm font-semibold text-nara-texto">
        Contraseña
        <input
          type="password"
          name="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded-2xl border border-nara-lavanda bg-white px-4 py-3 text-base font-normal outline-none transition focus:border-nara-lavanda-fuerte focus:ring-2 focus:ring-nara-lavanda"
        />
      </label>

      <button
        type="submit"
        className="rounded-full bg-nara-lavanda-fuerte px-6 py-3 text-base font-bold text-white transition hover:opacity-90 focus:outline-none focus:ring-4 focus:ring-nara-lavanda"
      >
        Ingresar
      </button>
    </form>
  );
}
