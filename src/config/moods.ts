// Opciones de la escala «¿Cómo te sientes hoy?».
// Al registrar una emoción se guarda con fecha y hora (ver src/services/mood-log.ts).

export type Mood = {
  id: string;
  label: string;
  emoji: string;
  // Puntaje de bienestar de 1 (más bajo) a 5 (más alto), para los gráficos de progreso.
  score: number;
  // Mensaje motivacional que se muestra después de registrar esta emoción.
  motivation: string;
};

export const moods: Mood[] = [
  {
    id: "muy-bien",
    label: "Muy bien",
    emoji: "😄",
    score: 5,
    motivation: "¡Qué bonito! Disfruta este momento y recuerda qué lo hizo posible.",
  },
  {
    id: "bien",
    label: "Bien",
    emoji: "🙂",
    score: 4,
    motivation: "Me alegra que hoy te sientas bien. Los pequeños momentos como este suman.",
  },
  {
    id: "tranquilo",
    label: "Tranquilo",
    emoji: "😌",
    score: 4,
    motivation: "La calma también es un logro. Permítete seguir disfrutándola.",
  },
  {
    id: "regular",
    label: "Regular",
    emoji: "😐",
    score: 3,
    motivation: "Está bien sentirte regular. Un día no tiene que ser perfecto para valer la pena.",
  },
  {
    id: "ansioso",
    label: "Ansioso",
    emoji: "😰",
    score: 2,
    motivation: "Gracias por ponerle nombre a lo que sientes. Respira despacio: no tienes que resolverlo todo hoy.",
  },
  {
    id: "triste",
    label: "Triste",
    emoji: "😢",
    score: 1,
    motivation: "Sentirte triste es válido. No estás a solas, y reconocerlo ya es un paso valiente.",
  },
  {
    id: "enojado",
    label: "Enojado",
    emoji: "😠",
    score: 2,
    motivation: "El enojo también dice algo importante. Tomarte un momento antes de actuar te cuida a ti y a los demás.",
  },
  {
    id: "abrumado",
    label: "Abrumado",
    emoji: "😩",
    score: 2,
    motivation: "Cuando todo pesa, avanzar de a poco ayuda. Hoy basta con cuidarte un poco.",
  },
];
