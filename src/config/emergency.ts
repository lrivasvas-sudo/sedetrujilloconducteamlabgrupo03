// Contactos oficiales de ayuda urgente que muestra el panel de emergencia.
// Para agregar uno, añade una entrada aquí: el panel la mostrará sola.
// Verificar los números con la fuente oficial antes de cada cambio.

export type EmergencyContact = {
  name: string;
  number: string;
  description: string;
};

// Contactos que se muestran con su número en el panel.
export const emergencyContacts: EmergencyContact[] = [
  {
    name: "Policía Nacional",
    number: "105",
    description: "Si hay peligro inmediato para ti o para otra persona.",
  },
  {
    name: "Línea 113 del Minsa, opción 5",
    number: "113",
    description: "Orientación en salud mental, gratuita y disponible las 24 horas.",
  },
];

// Línea que atiende tanto atención médica como psicológica.
// Sus botones llaman directamente y no muestran el número en el panel.
export const careLineNumber = "997213587";
