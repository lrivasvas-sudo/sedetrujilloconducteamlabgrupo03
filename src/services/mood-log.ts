// Registro de emociones en modo demostración.
// NO hay base de datos conectada: los registros viven en memoria mientras la página esté abierta
// y se pierden al recargar. Cuando exista la base de datos, reemplazar «addMoodRecord» por la llamada real.

import { buildDemoMoodRecords, type MoodRecord } from "@/config/wellbeing";
import { toIsoDate, toTimeText } from "@/lib/dates";

let records: MoodRecord[] | null = null;
const listeners = new Set<() => void>();

// Los datos ficticios se crean la primera vez que se leen en el navegador.
function ensureRecords(): MoodRecord[] {
  if (!records) {
    records = buildDemoMoodRecords(toIsoDate(new Date()));
  }
  return records;
}

function emitChange() {
  listeners.forEach((listener) => listener());
}

// Para useSyncExternalStore: avisa cuando cambian los registros.
export function subscribeMoodRecords(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

// Registros del más reciente al más antiguo. La referencia solo cambia al registrar.
export function getMoodRecords(): MoodRecord[] {
  return ensureRecords();
}

// Guarda una emoción con la fecha y hora actuales.
export function addMoodRecord(moodId: string): MoodRecord {
  const now = new Date();
  const record: MoodRecord = { date: toIsoDate(now), time: toTimeText(now), moodId };
  records = [record, ...ensureRecords()];
  emitChange();
  return record;
}
