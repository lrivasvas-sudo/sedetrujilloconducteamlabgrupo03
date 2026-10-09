// Contactos oficiales de ayuda urgente que muestra el panel de emergencia.
// Para agregar uno, añade una entrada aquí: el panel la mostrará sola.
// Verificar los números con la fuente oficial antes de cada cambio.

export type EmergencyContact = {
  name: string;
  number: string;
  description: string;
  // Si tiene tipo, el panel también lo muestra como icono de acceso rápido.
  kind?: "medical" | "psychological";
};

export const emergencyContacts: EmergencyContact[] = [
  {
    name: "Policía Nacional",
    number: "105",
    description: "Si hay peligro inmediato para ti o para otra persona.",
  },
  {
    name: "SAMU",
    number: "106",
    description: "Si necesitas atención médica de urgencia.",
    kind: "medical",
  },
  {
    name: "Psicólogo",
    number: "997213587",
    description: "Para hablar con un psicólogo ahora mismo.",
    kind: "psychological",
  },
  {
    name: "Línea 113 del Minsa, opción 5",
    number: "113",
    description: "Orientación en salud mental, gratuita y disponible las 24 horas.",
  },
];
