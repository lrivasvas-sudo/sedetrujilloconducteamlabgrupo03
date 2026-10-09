"use client";

import { useState } from "react";
import Link from "next/link";
import { professionals, formatHour } from "@/config/booking";
import { type CareReview, type CareSession } from "@/config/wellbeing";
import { formatLongDate } from "@/lib/dates";

const STAR_LABELS = ["1 estrella", "2 estrellas", "3 estrellas", "4 estrellas", "5 estrellas"];

function Stars({ value }: { value: number }) {
  return (
    <span className="text-xl text-nara-lavanda-fuerte" aria-label={`${value} de 5 estrellas`}>
      {Array.from({ length: 5 }, (_, index) => (index < value ? "★" : "☆")).join("")}
    </span>
  );
}

function ReviewForm({
  onSubmit,
  onCancel,
}: {
  onSubmit: (review: CareReview) => void;
  onCancel: () => void;
}) {
  const [rating, setRating] = useState(0);
  const [useful, setUseful] = useState<boolean | null>(null);
  const [liked, setLiked] = useState("");
  const [improve, setImprove] = useState("");
  const [comment, setComment] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit() {
    if (rating === 0 || useful === null) {
      setError("Elige una calificación con estrellas y si la sesión te resultó útil.");
      return;
    }
    onSubmit({ rating, useful, liked: liked.trim(), improve: improve.trim(), comment: comment.trim() });
  }

  const fieldClass =
    "w-full rounded-2xl bg-white px-4 py-3 text-base text-nara-texto ring-1 ring-nara-lavanda focus:outline-none focus:ring-4 focus:ring-nara-lavanda";

  return (
    <div className="flex flex-col gap-5 rounded-2xl bg-nara-crema p-5">
      <div className="flex flex-col gap-2">
        <span className="font-bold text-nara-texto">¿Cómo calificarías la atención?</span>
        <div className="flex flex-wrap gap-2">
          {STAR_LABELS.map((label, index) => {
            const value = index + 1;
            return (
              <button
                key={label}
                type="button"
                aria-label={label}
                aria-pressed={rating === value}
                onClick={() => setRating(value)}
                className={`min-h-11 min-w-11 rounded-full px-3 text-2xl transition focus:outline-none focus:ring-4 focus:ring-nara-lavanda ${
                  value <= rating ? "text-nara-lavanda-fuerte" : "text-nara-texto/30"
                }`}
              >
                ★
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="font-bold text-nara-texto">¿Te resultó útil la sesión?</span>
        <div className="flex flex-wrap gap-2">
          {[
            { label: "Sí, me fue útil", value: true },
            { label: "No, no me fue útil", value: false },
          ].map((option) => (
            <button
              key={option.label}
              type="button"
              aria-pressed={useful === option.value}
              onClick={() => setUseful(option.value)}
              className={`rounded-full px-4 py-2 text-sm font-bold transition focus:outline-none focus:ring-4 focus:ring-nara-lavanda ${
                useful === option.value
                  ? "bg-nara-menta-fuerte text-white"
                  : "bg-white text-nara-texto ring-1 ring-nara-menta"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <label className="flex flex-col gap-2">
        <span className="font-bold text-nara-texto">¿Qué te pareció?</span>
        <textarea rows={3} value={liked} onChange={(event) => setLiked(event.target.value)} className={fieldClass} />
      </label>

      <label className="flex flex-col gap-2">
        <span className="font-bold text-nara-texto">¿Qué podríamos mejorar?</span>
        <textarea rows={3} value={improve} onChange={(event) => setImprove(event.target.value)} className={fieldClass} />
      </label>

      <label className="flex flex-col gap-2">
        <span className="font-bold text-nara-texto">Comentarios adicionales (opcional)</span>
        <textarea rows={2} value={comment} onChange={(event) => setComment(event.target.value)} className={fieldClass} />
      </label>

      {error && (
        <p role="alert" className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-nara-texto ring-1 ring-red-200">
          {error}
        </p>
      )}

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleSubmit}
          className="rounded-full bg-nara-lavanda-fuerte px-6 py-3 font-bold text-white transition hover:opacity-90 focus:outline-none focus:ring-4 focus:ring-nara-lavanda"
        >
          Enviar valoración
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full bg-white px-6 py-3 font-bold text-nara-texto ring-1 ring-nara-lavanda transition hover:bg-nara-lavanda/40 focus:outline-none focus:ring-4 focus:ring-nara-lavanda"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}

// Próximas atenciones e historial de sesiones, con valoración después de cada atención.
export function WellbeingSessions({
  today,
  sessions,
  reviews,
  onReview,
}: {
  today: string;
  sessions: CareSession[];
  reviews: Record<string, CareReview>;
  onReview: (sessionId: string, review: CareReview) => void;
}) {
  const [openReviewId, setOpenReviewId] = useState<string | null>(null);

  const professionalFor = (id: string) => professionals.find((p) => p.id === id);
  const sortedAsc = [...sessions].sort((a, b) => (a.date + a.hour).localeCompare(b.date + b.hour));
  const upcoming = sortedAsc.filter((session) => session.date >= today);
  const history = sortedAsc.filter((session) => session.date < today).reverse();

  function renderCard(session: CareSession, isPast: boolean) {
    const professional = professionalFor(session.professionalId);
    const review = reviews[session.id];

    return (
      <li key={session.id} className="flex flex-col gap-4 rounded-2xl bg-nara-crema p-5 ring-1 ring-nara-cielo">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex flex-col gap-1">
            <span className="text-lg font-bold text-nara-texto">{professional?.name}</span>
            <span className="text-sm text-nara-texto/80">
              {formatLongDate(session.date)} · {formatHour(session.hour)}
            </span>
          </div>
          <span
            className={`rounded-full px-3 py-1 text-xs font-bold ${
              isPast ? "bg-nara-lavanda text-nara-texto" : "bg-nara-menta text-nara-texto"
            }`}
          >
            {isPast ? "Realizada" : "Programada"}
          </span>
        </div>

        {isPast && review && (
          <div className="flex flex-col gap-2 rounded-2xl bg-white/80 p-4 text-sm text-nara-texto">
            <div className="flex flex-wrap items-center gap-3">
              <Stars value={review.rating} />
              <span className="font-semibold">{review.useful ? "Te resultó útil" : "No te resultó útil"}</span>
            </div>
            {review.liked && <p><span className="font-bold">Te pareció:</span> {review.liked}</p>}
            {review.improve && <p><span className="font-bold">Podríamos mejorar:</span> {review.improve}</p>}
            {review.comment && <p><span className="font-bold">Comentario:</span> {review.comment}</p>}
          </div>
        )}

        {isPast && !review && openReviewId !== session.id && (
          <button
            type="button"
            onClick={() => setOpenReviewId(session.id)}
            className="w-fit rounded-full bg-nara-cielo-fuerte px-5 py-2 text-sm font-bold text-white transition hover:opacity-90 focus:outline-none focus:ring-4 focus:ring-nara-cielo"
          >
            Calificar esta atención
          </button>
        )}

        {isPast && !review && openReviewId === session.id && (
          <ReviewForm
            onSubmit={(newReview) => {
              onReview(session.id, newReview);
              setOpenReviewId(null);
            }}
            onCancel={() => setOpenReviewId(null)}
          />
        )}
      </li>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <section className="flex flex-col gap-4 rounded-[2rem] bg-white/70 p-6 shadow-sm ring-1 ring-nara-menta sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-2xl font-bold text-nara-texto">Próximas atenciones</h2>
          <Link
            href="/inicio/cita"
            className="rounded-full bg-nara-menta-fuerte px-5 py-2 text-sm font-bold text-white transition hover:opacity-90 focus:outline-none focus:ring-4 focus:ring-nara-menta"
          >
            Reservar nueva cita
          </Link>
        </div>
        {upcoming.length === 0 ? (
          <p className="text-nara-texto/80">No tienes atenciones programadas.</p>
        ) : (
          <ul className="grid gap-3">{upcoming.map((session) => renderCard(session, false))}</ul>
        )}
      </section>

      <section className="flex flex-col gap-4 rounded-[2rem] bg-white/70 p-6 shadow-sm ring-1 ring-nara-lavanda sm:p-8">
        <h2 className="text-2xl font-bold text-nara-texto">Historial de sesiones</h2>
        {history.length === 0 ? (
          <p className="text-nara-texto/80">Todavía no tienes atenciones realizadas.</p>
        ) : (
          <ul className="grid gap-3">{history.map((session) => renderCard(session, true))}</ul>
        )}
      </section>
    </div>
  );
}
