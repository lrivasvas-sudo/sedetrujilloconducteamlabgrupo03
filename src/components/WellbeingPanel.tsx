"use client";

import { useState, useSyncExternalStore } from "react";
import { WellbeingProgress } from "@/components/WellbeingProgress";
import { WellbeingRegister } from "@/components/WellbeingRegister";
import { WellbeingSessions } from "@/components/WellbeingSessions";
import {
  WELLBEING_DEMO_NOTICE,
  buildDemoReviews,
  buildDemoSessions,
  type CareReview,
  type CareSession,
  type MoodRecord,
} from "@/config/wellbeing";
import { toIsoDate } from "@/lib/dates";
import { bookingKey, listDemoBookings } from "@/services/booking";
import { getMoodRecords, subscribeMoodRecords } from "@/services/mood-log";

type Tab = "registro" | "progreso" | "atenciones";

const TABS: { id: Tab; label: string }[] = [
  { id: "registro", label: "Mi registro" },
  { id: "progreso", label: "Mi progreso" },
  { id: "atenciones", label: "Mis atenciones" },
];

// La fecha de hoy solo se lee en el navegador. En el servidor no hay fecha todavía
// y se muestra un aviso de carga, así no se generan datos distintos en cada lado.
const subscribeNothing = () => () => {};
const readToday = () => toIsoDate(new Date());
const noToday = () => null;

const NO_RECORDS: MoodRecord[] = [];

// Panel personal de bienestar emocional. Todo el estado vive solo en esta visita.
export function WellbeingPanel() {
  const today = useSyncExternalStore(subscribeNothing, readToday, noToday);

  if (!today) {
    return <p className="text-center text-nara-texto/80">Cargando tu panel...</p>;
  }

  return <WellbeingContent today={today} />;
}

function WellbeingContent({ today }: { today: string }) {
  const [tab, setTab] = useState<Tab>("registro");

  // Los registros de emociones vienen del almacén compartido: se actualizan solos
  // cuando se registra una emoción desde inicio o desde este panel.
  const records = useSyncExternalStore(subscribeMoodRecords, getMoodRecords, () => NO_RECORDS);

  // Citas de demostración y las reservadas en esta visita.
  const [sessions] = useState<CareSession[]>(() => [
    ...buildDemoSessions(today),
    ...listDemoBookings().map((booking) => ({
      id: bookingKey(booking),
      professionalId: booking.professionalId,
      date: booking.date,
      hour: booking.hour,
    })),
  ]);
  const [reviews, setReviews] = useState<Record<string, CareReview>>(buildDemoReviews);

  function saveReview(sessionId: string, review: CareReview) {
    setReviews((previous) => ({ ...previous, [sessionId]: review }));
  }

  return (
    <div className="flex w-full flex-col gap-6">
      <header className="flex flex-col gap-3 rounded-[2rem] bg-white/70 p-6 text-center shadow-sm ring-1 ring-nara-lavanda sm:p-8">
        <h1 className="text-3xl font-bold text-nara-texto">Mi bienestar emocional</h1>
        <p className="rounded-2xl bg-nara-lavanda/50 px-4 py-3 text-sm text-nara-texto">{WELLBEING_DEMO_NOTICE}</p>
      </header>

      <nav aria-label="Secciones" className="flex flex-wrap justify-center gap-2">
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            aria-pressed={tab === item.id}
            onClick={() => setTab(item.id)}
            className={`rounded-full px-5 py-3 text-sm font-bold transition focus:outline-none focus:ring-4 focus:ring-nara-lavanda ${
              tab === item.id
                ? "bg-nara-lavanda-fuerte text-white"
                : "bg-white/80 text-nara-texto ring-1 ring-nara-lavanda hover:bg-nara-lavanda/50"
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>

      {tab === "registro" && <WellbeingRegister records={records} />}
      {tab === "progreso" && (
        <WellbeingProgress today={today} entries={records} reviews={Object.values(reviews)} />
      )}
      {tab === "atenciones" && (
        <WellbeingSessions today={today} sessions={sessions} reviews={reviews} onReview={saveReview} />
      )}
    </div>
  );
}
