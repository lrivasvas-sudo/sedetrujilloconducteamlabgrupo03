import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, userFromToken } from "@/services/session-check";

// Antes de mostrar cualquier pantalla de /inicio, comprueba que haya una sesión válida
// y registrada. Si no la hay, redirige al acceso sin enviar la pantalla.
export async function proxy(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const user = token ? await userFromToken(token) : null;

  if (!user) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/inicio/:path*",
};
