// Inicio de sesión y sesión de Nara. Solo se usa en el servidor (acciones y pantallas).
// La contraseña nunca llega al navegador. El token de acceso se guarda en una cookie
// que JavaScript no puede leer. Las reglas de la base de datos (RLS) son la protección real.

import { cookies } from "next/headers";
import {
  SESSION_COOKIE,
  isRegistered,
  userFromToken,
  type SessionUser,
} from "@/services/session-check";

export type { SessionUser };

export type SignInResult =
  | { ok: true }
  | { ok: false; reason: "credenciales" | "no-registrado" | "servicio" };

function supabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) {
    throw new Error("Falta configurar NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.");
  }
  return { url, key };
}

export async function signIn(email: string, password: string): Promise<SignInResult> {
  const { url, key } = supabaseConfig();

  let response: Response;
  try {
    response = await fetch(`${url}/auth/v1/token?grant_type=password`, {
      method: "POST",
      headers: { apikey: key, "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      cache: "no-store",
    });
  } catch {
    return { ok: false, reason: "servicio" };
  }

  if (response.status === 400 || response.status === 401) {
    return { ok: false, reason: "credenciales" };
  }
  if (!response.ok) return { ok: false, reason: "servicio" };

  const session = (await response.json()) as {
    access_token: string;
    expires_in: number;
    user: { id: string };
  };

  if (!(await isRegistered(session.access_token, session.user.id))) {
    return { ok: false, reason: "no-registrado" };
  }

  // Cada ingreso queda registrado. Si no se puede registrar, no se deja entrar.
  const access = await fetch(`${url}/rest/v1/accesos`, {
    method: "POST",
    headers: {
      apikey: key,
      Authorization: `Bearer ${session.access_token}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify({ user_id: session.user.id }),
    cache: "no-store",
  });
  if (!access.ok) return { ok: false, reason: "servicio" };

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, session.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: session.expires_in,
  });

  return { ok: true };
}

export async function getAccessToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE)?.value ?? null;
}

// Devuelve la persona con sesión válida y registrada, o null.
export async function getCurrentUser(): Promise<SessionUser | null> {
  const token = await getAccessToken();
  if (!token) return null;
  return userFromToken(token);
}

export async function signOut() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}
