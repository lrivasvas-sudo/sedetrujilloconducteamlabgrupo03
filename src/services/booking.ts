// Reserva de citas en modo demostración.
// NO hay base de datos conectada: nada se guarda de forma permanente y ninguna
// cita queda reservada en un sistema real. Cuando exista la base de datos,
// solo hay que reemplazar «requestBooking» por la llamada real al servidor.

export type BookingRequest = {
  professionalId: string;
  date: string;
  hour: number;
};

export type BookingResult = { ok: true } | { ok: false; reason: "taken" };

// Horarios reservados durante esta visita (se pierden al recargar la página).
const demoBookings = new Map<string, BookingRequest>();

// Citas reservadas en esta visita (demostración).
export function listDemoBookings(): BookingRequest[] {
  return [...demoBookings.values()];
}

function slotKey({ professionalId, date, hour }: BookingRequest): string {
  return `${professionalId}|${date}|${hour}`;
}

// Ocupación ficticia y fija: aprox. 1 de cada 3 horarios aparece ocupado.
function isDemoOccupied(request: BookingRequest): boolean {
  let sum = 0;
  for (const char of slotKey(request)) sum += char.charCodeAt(0);
  return sum % 3 === 0;
}

export function isSlotTaken(request: BookingRequest): boolean {
  return isDemoOccupied(request) || demoBookings.has(slotKey(request));
}

export function bookingKey(request: BookingRequest): string {
  return slotKey(request);
}

// Simula la respuesta del servidor. Lanza un error si algo falla de verdad.
export async function requestBooking(request: BookingRequest): Promise<BookingResult> {
  await new Promise((resolve) => setTimeout(resolve, 700));

  if (isSlotTaken(request)) {
    return { ok: false, reason: "taken" };
  }

  demoBookings.set(slotKey(request), request);
  return { ok: true };
}
