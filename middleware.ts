import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Rotas públicas que não requerem autenticação
const publicRoutes = ["/login", "/register", "/forgot-password"]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Verifica se é uma rota pública
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route))

  // Verifica se existe o cookie de sessão (setado pelo cliente quando faz login)
  const hasSession = request.cookies.has("has-session")

  // Se não tem sessão e não é rota pública, redireciona para login
  if (!hasSession && !isPublicRoute) {
    const loginUrl = new URL("/login", request.url)
    return NextResponse.redirect(loginUrl)
  }

  if (hasSession && isPublicRoute) {
    const homeUrl = new URL("/", request.url)
    return NextResponse.redirect(homeUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
