// Catálogo de universidades y carreras profesionales, guardado en Supabase.
// Se usa la API REST con la clave pública: solo se puede leer lo que las reglas de la tabla permiten.

import { PostgrestClient } from "@supabase/postgrest-js";

export type Universidad = { id: number; nombre: string };

export type CarreraProfesional = {
  id: number;
  universidad_id: number;
  nombre: string;
};

export function getCatalogClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !publishableKey) {
    throw new Error(
      "Falta configurar NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.",
    );
  }

  return new PostgrestClient(`${url}/rest/v1`, {
    headers: { apikey: publishableKey, Authorization: `Bearer ${publishableKey}` },
  });
}

export async function listarUniversidades(): Promise<Universidad[]> {
  const { data, error } = await getCatalogClient()
    .from("universidades")
    .select("id, nombre")
    .order("nombre")
    .returns<Universidad[]>();

  if (error) throw new Error(error.message);
  return data;
}

export async function listarCarreras(universidadId: number): Promise<CarreraProfesional[]> {
  const { data, error } = await getCatalogClient()
    .from("carreras_profesionales")
    .select("id, universidad_id, nombre")
    .eq("universidad_id", universidadId)
    .order("nombre")
    .returns<CarreraProfesional[]>();

  if (error) throw new Error(error.message);
  return data;
}
