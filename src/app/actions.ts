"use server";

import { redirect } from "next/navigation";
import { moods } from "@/config/moods";
import { getAccessToken, getCurrentUser, signIn, signOut } from "@/services/session";

const LOGIN_MESSAGES = {
  credenciales: "Usuario o contraseña incorrectos.",
  "no-registrado": "Esta cuenta no está registrada en Nara. Pide al administrador que te dé acceso.",
  servicio: "No pudimos completar el ingreso. Intenta de nuevo en un momento.",
  campos: "Escribe tu usuario y tu contraseña.",
} as const;

export type LoginState = { error: string | null };

export async function loginAction(_previous: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: LOGIN_MESSAGES.campos };
  }

  const result = await signIn(email, password);
  if (!result.ok) {
    return { error: LOGIN_MESSAGES[result.reason] };
  }

  redirect("/inicio");
}

export async function logoutAction() {
  await signOut();
  redirect("/");
}

export type SaveMoodResult =
  | { ok: true; registradoEn: string }
  | { ok: false; error: string };

// Guarda el estado de ánimo elegido con la fecha y hora de la base de datos.
export async function saveMoodAction(moodId: string): Promise<SaveMoodResult> {
  const mood = moods.find((item) => item.id === moodId);
  if (!mood) {
    return { ok: false, error: "Elige una emoción válida." };
  }

  const user = await getCurrentUser();
  const token = await getAccessToken();
  if (!user || !token) {
    return { ok: false, error: "Tu sesión terminó. Vuelve a ingresar." };
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) {
    return { ok: false, error: "El servicio no está configurado." };
  }

  try {
    const response = await fetch(`${url}/rest/v1/estados_animo?select=registrado_en`, {
      method: "POST",
      headers: {
        apikey: key,
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify({ user_id: user.id, estado_animo: mood.id }),
      cache: "no-store",
    });

    if (!response.ok) {
      return { ok: false, error: "No pudimos guardar tu registro. Intenta de nuevo." };
    }

    const [row] = (await response.json()) as { registrado_en: string }[];
    return { ok: true, registradoEn: row.registrado_en };
  } catch {
    return { ok: false, error: "No pudimos guardar tu registro. Revisa tu conexión." };
  }
}
