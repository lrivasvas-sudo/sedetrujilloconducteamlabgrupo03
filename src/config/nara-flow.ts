// Conversación guiada de Nara. Es un guion fijo, no una IA:
// cada paso responde según la opción o el texto que escribe la persona.

export type NaraStep =
  | "inicio"
  | "problema"
  | "cita"
  | "horarios"
  | "seguir"
  | "seguir_texto"
  | "eleccion"
  | "universidad"
  | "llamada"
  | "fin";

export type NaraOption = { label: string; value: string };

export type NaraTurn = {
  replies: string[];
  step: NaraStep;
  options?: NaraOption[];
};

export const NARA_GREETING = "Hola, soy Nara. ¿En qué te puedo ayudar?";

// Pasos en los que la persona escribe en lugar de elegir una opción.
export const NARA_TEXT_STEPS: NaraStep[] = ["inicio", "problema", "seguir_texto"];

// Palabras que indican que la persona necesita ayuda.
const HELP_PATTERN =
  /ayud|necesito|malestar|\bmal\b|triste|ansi|angust|estr[eé]s|miedo|preocup|deprim|llor|nervios|asust|abrumad|no puedo|\bsol[oa]s?\b|problema|dolor|crisis/i;

// Horarios de prueba: no se guardan en ningún sistema.
export const NARA_SLOTS = [
  "Lunes 12 de octubre, 10:00",
  "Martes 13 de octubre, 15:00",
  "Miércoles 14 de octubre, 11:30",
];

export const NARA_RESTART = "reiniciar";
const RESTART_OPTIONS: NaraOption[] = [{ label: "Empezar de nuevo", value: NARA_RESTART }];

const BREATHING_STEPS =
  "1. Siéntate cómodamente y pon una mano en el pecho y otra en el abdomen.\n" +
  "2. Inhala por la nariz contando hasta 4, procurando que se infle el abdomen y no el pecho.\n" +
  "3. Exhala lentamente por la boca contando hasta 6.\n" +
  "4. Repite entre 5 y 10 veces, a tu propio ritmo.";

const YES_NO: NaraOption[] = [
  { label: "Sí", value: "si" },
  { label: "No", value: "no" },
];

// Calcula la respuesta de Nara según el paso actual y lo que escribió o eligió la persona.
export function advanceNara(step: NaraStep, value: string): NaraTurn {
  switch (step) {
    case "inicio":
      return HELP_PATTERN.test(value)
        ? {
            replies: ["Cuéntame con calma, ¿qué es lo que te está pasando?"],
            step: "problema",
          }
        : {
            replies: ["Gracias por escribirme. Si necesitas ayuda, cuéntame qué te está pasando."],
            step: "inicio",
          };

    case "problema":
      return {
        replies: [
          "Comprendo lo que pasas. Por lo que me comentas, es un problema que te genera malestar.",
          "Lo que te puedo recomendar es agendar una cita con Bienestar de Psicología. ¿Te gustaría?",
        ],
        step: "cita",
        options: [
          { label: "Sí, quiero agendar", value: "si" },
          { label: "No, por ahora no", value: "no" },
        ],
      };

    case "cita":
      if (value === "si") {
        return {
          replies: ["Estos son los horarios disponibles para tu cita de prueba:"],
          step: "horarios",
          options: NARA_SLOTS.map((slot) => ({ label: slot, value: slot })),
        };
      }
      return {
        replies: [
          "Entiendo que esto puede dar miedo. Dar el paso hacia la atención es un gran paso. ¿Gustas seguir contándome tu situación?",
        ],
        step: "seguir",
        options: [
          { label: "Sí, quiero seguir", value: "si" },
          { label: "No, gracias", value: "no" },
        ],
      };

    case "horarios":
      return {
        replies: [
          `Listo, tu cita de prueba quedó para: ${value}. Esta demostración no guarda la cita en ningún sistema.`,
        ],
        step: "fin",
        options: RESTART_OPTIONS,
      };

    case "seguir":
      if (value === "no") {
        return {
          replies: [
            "Gracias por tu tiempo. Te recomiendo que vayas a una cita psicológica cuando te sientas listo o lista.",
          ],
          step: "fin",
          options: RESTART_OPTIONS,
        };
      }
      return { replies: ["Cuéntame, te escucho."], step: "seguir_texto" };

    case "seguir_texto":
      return {
        replies: [
          "Gracias por contarme, aprecio tu confianza. Vuelvo a recomendarte hablar con un profesional. ¿Quieres que te contacte con uno, o prefieres por el momento alguna técnica?",
        ],
        step: "eleccion",
        options: [
          { label: "Que me contacte con un profesional", value: "profesional" },
          { label: "Prefiero una técnica", value: "tecnica" },
        ],
      };

    case "eleccion":
      if (value === "tecnica") {
        return {
          replies: [`Te enseño la técnica de respiración diafragmática:\n${BREATHING_STEPS}`],
          step: "fin",
          options: RESTART_OPTIONS,
        };
      }
      return {
        replies: ["¿Te encuentras en la Universidad?"],
        step: "universidad",
        options: YES_NO,
      };

    case "universidad":
      // La respuesta no cambia el camino: en ambos casos se enseña la técnica y luego se llama.
      return {
        replies: [
          `Antes de conectarte con un profesional, practiquemos la técnica de relajación diafragmática:\n${BREATHING_STEPS}`,
          "Ahora te conecto con un profesional de salud. Presiona el botón para llamar.",
        ],
        step: "llamada",
        options: RESTART_OPTIONS,
      };

    default:
      return { replies: [], step: "fin", options: RESTART_OPTIONS };
  }
}
