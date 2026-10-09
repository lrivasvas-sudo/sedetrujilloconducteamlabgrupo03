// Datos del panel de bienestar emocional.
// No hay base de datos conectada: todo lo de aquí es ficticio y lo que la persona registra
// solo vive mientras la página está abierta. Nada se guarda de forma permanente.

import { addDays } from "@/lib/dates";
import { moods, type Mood } from "@/config/moods";

export const WELLBEING_DEMO_NOTICE =
  "Datos ficticios de demostración. No hay base de datos conectada: lo que registres o valores solo se muestra mientras esta página esté abierta.";

// Registro de una emoción, con fecha (AAAA-MM-DD) y hora (HH:mm).
export type MoodRecord = { date: string; time: string; moodId: string };

export type CareSession = {
  id: string;
  professionalId: string;
  date: string;
  hour: number;
};

export type CareReview = {
  rating: number;
  useful: boolean;
  liked: string;
  improve: string;
  comment: string;
};

export function findMood(moodId: string): Mood | undefined {
  return moods.find((mood) => mood.id === moodId);
}

// Registros de los últimos 30 días (sin incluir hoy), con un patrón fijo de ejemplo.
// Van del más reciente al más antiguo, igual que los registros nuevos.
export function buildDemoMoodRecords(today: string): MoodRecord[] {
  const records: MoodRecord[] = [];
  for (let offset = 1; offset <= 30; offset++) {
    const index = (offset * 3 + (offset % 5)) % moods.length;
    records.push({ date: addDays(today, -offset), time: "20:00", moodId: moods[index].id });
  }
  return records;
}

export function buildDemoSessions(today: string): CareSession[] {
  return [
    { id: "demo-1", professionalId: "luisa-rivas", date: addDays(today, -14), hour: 10 },
    { id: "demo-2", professionalId: "cesar-garcia", date: addDays(today, -7), hour: 15 },
    { id: "demo-3", professionalId: "jackelyn-altuna", date: addDays(today, 4), hour: 9 },
  ];
}

export function buildDemoReviews(): Record<string, CareReview> {
  return {
    "demo-1": {
      rating: 5,
      useful: true,
      liked: "Me sentí escuchada desde el primer momento.",
      improve: "Quizás una sesión más larga.",
      comment: "",
    },
  };
}
