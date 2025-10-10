// middleware.ts
import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => {
                        request.cookies.set(name, value)
                    })
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) => {
                        supabaseResponse.cookies.set(name, value, options)
                    })
                },
            },
        }
    )

    // IMPORTANTE: Refrescar la sesión si existe
    const {
        data: { user },
    } = await supabase.auth.getUser()

    // Lista de rutas protegidas que requieren autenticación
    const protectedRoutes = ['/dashboard', '/profile', '/bookings']
    const isProtectedRoute = protectedRoutes.some(route =>
        request.nextUrl.pathname.startsWith(route)
    )

    // Si es ruta protegida y no hay usuario, redirigir a login
    if (isProtectedRoute && !user) {
        const redirectUrl = request.nextUrl.clone()
        redirectUrl.pathname = '/login'
        redirectUrl.searchParams.set('redirectedFrom', request.nextUrl.pathname)
        return NextResponse.redirect(redirectUrl)
    }

    // Si el usuario está autenticado e intenta acceder a login/register,
    // redirigir a dashboard
    if (user && (
        request.nextUrl.pathname === '/login' ||
        request.nextUrl.pathname === '/register'
    )) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    return supabaseResponse
}

export const config = {
    matcher: [
        /*
         * Aplicar middleware a todas las rutas excepto:
         * - _next/static (archivos estáticos)
         * - _next/image (optimización de imágenes)
         * - favicon.ico
         * - archivos públicos (imágenes, etc)
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}

/*
📝 QUÉ HACE:
✅ Refresca automáticamente las sesiones de usuario
✅ Protege rutas privadas (dashboard, profile, bookings)
✅ Redirige usuarios no autenticados a /login
✅ Redirige usuarios autenticados fuera de login/register
✅ Mantiene las cookies actualizadas
*/