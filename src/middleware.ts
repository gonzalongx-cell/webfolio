import { NextResponse, type NextRequest } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

const SUPER_ADMIN_EMAIL = "gonzalezgex@gmail.com";

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return supabaseResponse;
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(
        cookiesToSet: { name: string; value: string; options?: CookieOptions }[]
      ) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        supabaseResponse = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // Rutas públicas permitidas sin sesión
  const isPublicRoute =
    pathname === "/login" || pathname.startsWith("/auth/callback");

  // 1. Si no tiene sesión e intenta entrar a cualquier ruta privada (Súper Admin `/` o Tenant `/app`) -> `/login`
  if (!user && !isPublicRoute) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    return NextResponse.redirect(loginUrl);
  }

  // 2. Si tiene sesión activa:
  if (user) {
    const isSuperAdminUser =
      user.email?.toLowerCase() === SUPER_ADMIN_EMAIL;

    // Si visita `/login` teniendo sesión, enviarlo a su consola correspondiente
    if (pathname === "/login") {
      const targetUrl = request.nextUrl.clone();
      targetUrl.pathname = isSuperAdminUser ? "/" : "/app";
      return NextResponse.redirect(targetUrl);
    }

    // Si NO es el Súper Administrador e intenta acceder a las rutas del Súper Admin (`/`, `/metricas`, `/configuracion`) -> redirigir a `/app`
    const isAdminRoute =
      pathname === "/" ||
      pathname.startsWith("/metricas") ||
      pathname.startsWith("/configuracion");

    if (isAdminRoute && !isSuperAdminUser) {
      const tenantUrl = request.nextUrl.clone();
      tenantUrl.pathname = "/app";
      return NextResponse.redirect(tenantUrl);
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/",
    "/metricas/:path*",
    "/configuracion/:path*",
    "/app/:path*",
    "/login",
  ],
};
