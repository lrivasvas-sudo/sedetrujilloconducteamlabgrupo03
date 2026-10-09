// Modo demostración: con MODO_DEMO=true en el servidor, el acceso entra con cualquier
// usuario y contraseña, sin consultar Supabase, y los registros no se guardan en la base.
// Está apagado por defecto. No activarlo en producción con datos reales.

export const DEMO_TOKEN = "demo";

export const DEMO_USER = { id: "demo", email: "demo@nara.local" };

// Contraseña fija del modo demo. Solo vale cuando MODO_DEMO=true.
export const DEMO_PASSWORD = "123456";

export function modoDemo(): boolean {
  return process.env.MODO_DEMO === "true";
}
