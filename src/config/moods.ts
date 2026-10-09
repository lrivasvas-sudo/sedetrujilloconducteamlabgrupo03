// Opciones de la escala «¿Cómo te sientes hoy?».
// Se usan solo para mostrar la elección; todavía no se guardan (seguimiento emocional, etapa posterior).

export type Mood = {
  id: string;
  label: string;
  emoji: string;
  // Puntaje de bienestar de 1 (más bajo) a 5 (más alto), para los gráficos de progreso.
  score: number;
};

export const moods: Mood[] = [
  { id: "muy-bien", label: "Muy bien", emoji: "😄", score: 5 },
  { id: "bien", label: "Bien", emoji: "🙂", score: 4 },
  { id: "tranquilo", label: "Tranquilo", emoji: "😌", score: 4 },
  { id: "regular", label: "Regular", emoji: "😐", score: 3 },
  { id: "ansioso", label: "Ansioso", emoji: "😰", score: 2 },
  { id: "triste", label: "Triste", emoji: "😢", score: 1 },
  { id: "enojado", label: "Enojado", emoji: "😠", score: 2 },
  { id: "abrumado", label: "Abrumado", emoji: "😩", score: 2 },
];
