"use client";

import { useActionState } from "react";
import { loginAction, type LoginState } from "@/app/actions";

const initialState: LoginState = { error: null };

// Acceso con correo y contraseña. Solo entran las cuentas registradas en Nara.
// La validación ocurre en el servidor (src/app/actions.ts).
export function LoginForm() {
  const [state, formAction, isPending] = useActionState(loginAction, initialState);

  return (
    <form
      action={formAction}
      className="flex w-full max-w-md flex-col gap-5 rounded-[2rem] bg-white/80 p-6 shadow-sm ring-1 ring-nara-cielo sm:p-10"
    >
      <p className="rounded-2xl bg-nara-cielo/60 px-4 py-3 text-sm text-nara-texto">
        Ingresa con el usuario y la contraseña que te dio Nara.
      </p>

      <label className="flex flex-col gap-2 text-sm font-semibold text-nara-texto">
        Usuario
        <input
          type="text"
          name="email"
          autoComplete="username"
          required
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
          className="rounded-2xl border border-nara-lavanda bg-white px-4 py-3 text-base font-normal outline-none transition focus:border-nara-lavanda-fuerte focus:ring-2 focus:ring-nara-lavanda"
        />
      </label>

      {state.error && (
        <p role="alert" className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-nara-texto ring-1 ring-red-200">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="rounded-full bg-nara-lavanda-fuerte px-6 py-3 text-base font-bold text-white transition hover:opacity-90 focus:outline-none focus:ring-4 focus:ring-nara-lavanda disabled:opacity-60"
      >
        {isPending ? "Ingresando..." : "Ingresar"}
      </button>
    </form>
  );
}
