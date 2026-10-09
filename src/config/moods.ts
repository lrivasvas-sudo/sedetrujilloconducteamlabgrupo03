// Opciones de la escala «¿Cómo te sientes hoy?».
// Se usan solo para mostrar la elección; todavía no se guardan (seguimiento emocional, etapa posterior).

export type Mood = {
  id: string;
  label: string;
  emoji: string;
};

export const moods: Mood[] = [
  { id: "muy-bien", label: "Muy bien", emoji: "😄" },
  { id: "bien", label: "Bien", emoji: "🙂" },
  { id: "tranquilo", label: "Tranquilo", emoji: "😌" },
  { id: "regular", label: "Regular", emoji: "😐" },
  { id: "ansioso", label: "Ansioso", emoji: "😰" },
  { id: "triste", label: "Triste", emoji: "😢" },
  { id: "enojado", label: "Enojado", emoji: "😠" },
  { id: "abrumado", label: "Abrumado", emoji: "😩" },
];
