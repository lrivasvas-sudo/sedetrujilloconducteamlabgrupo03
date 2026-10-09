// Datos ficticios para la demostración de reserva de citas.
// No son profesionales reales ni existe una agenda conectada.

export type Professional = {
  id: string;
  name: string;
  role: string;
  area: string;
};

export const professionals: Professional[] = [
  { id: "luisa-rivas", name: "Luisa Rivas", role: "Psicóloga", area: "Psicología" },
  { id: "jackelyn-altuna", name: "Jackelyn Altuna", role: "Psicóloga", area: "Psicología" },
  { id: "cesar-garcia", name: "César García", role: "Psicólogo", area: "Psicología" },
  { id: "dayron-alvarez", name: "Dayron Álvarez", role: "Médico", area: "Área médica" },
];

// Fechas fijas de la demostración. Se dejan fijas para que el servidor y el
// navegador muestren lo mismo, sin depender de la fecha actual.
export const demoDates = [
  { iso: "2026-10-12", short: "Lun 12", long: "Lunes 12 de octubre" },
  { iso: "2026-10-13", short: "Mar 13", long: "Martes 13 de octubre" },
  { iso: "2026-10-14", short: "Mié 14", long: "Miércoles 14 de octubre" },
  { iso: "2026-10-15", short: "Jue 15", long: "Jueves 15 de octubre" },
  { iso: "2026-10-16", short: "Vie 16", long: "Viernes 16 de octubre" },
  { iso: "2026-10-17", short: "Sáb 17", long: "Sábado 17 de octubre" },
  { iso: "2026-10-18", short: "Dom 18", long: "Domingo 18 de octubre" },
];

// Horas de inicio: de 7:00 a. m. a 6:00 p. m., cada una de una hora (hasta las 7:00 p. m.).
export const demoHours = Array.from({ length: 12 }, (_, index) => index + 7);

export function formatHour(hour: number): string {
  const period = hour < 12 ? "a. m." : "p. m.";
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${hour12}:00 ${period}`;
}
