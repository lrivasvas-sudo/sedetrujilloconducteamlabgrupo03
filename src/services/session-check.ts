// Comprobación de un token de acceso: ¿es una cuenta válida y registrada en Nara?
// No usa cookies, así que sirve tanto para el proxy como para las pantallas.

import { DEMO_TOKEN, DEMO_USER, modoDemo } from "@/services/demo-mode";

export const SESSION_COOKIE = "nara_sesion";

export type SessionUser = { id: string; email: string };

function supabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) {
    throw new Error("Falta configurar NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.");
  }
  return { url, key };
}

// ¿La cuenta del token está en la lista de usuarios registrados? La consulta la limita RLS.
export async function isRegistered(accessToken: string, userId: string): Promise<boolean> {
  const { url, key } = supabaseConfig();
  const response = await fetch(
    `${url}/rest/v1/usuarios_registrados?select=user_id&user_id=eq.${userId}`,
    {
      headers: { apikey: key, Authorization: `Bearer ${accessToken}` },
      cache: "no-store",
    },
  );
  if (!response.ok) return false;
  const rows = (await response.json()) as { user_id: string }[];
  return rows.length === 1;
}

// Devuelve la persona del token si la sesión es válida y la cuenta está registrada; si no, null.
export async function userFromToken(token: string): Promise<SessionUser | null> {
  if (modoDemo()) {
    return token === DEMO_TOKEN ? DEMO_USER : null;
  }

  const { url, key } = supabaseConfig();
  const response = await fetch(`${url}/auth/v1/user`, {
    headers: { apikey: key, Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!response.ok) return null;

  const user = (await response.json()) as { id: string; email: string };
  if (!(await isRegistered(token, user.id))) return null;

  return { id: user.id, email: user.email };
}
