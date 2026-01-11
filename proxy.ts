// proxy.ts (o middleware.ts)
import { createServerClient } from "@supabase/ssr"
import { type NextRequest, NextResponse } from "next/server"

export default async function proxy(request: NextRequest) {
    // 1. Preparar respuesta base
    let supabaseResponse = NextResponse.next({
        request,
    })

    // 2. Configurar cliente Supabase (Solo para manejo de cookies)
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

    // 3. REFRESCAR SESIÓN (Crucial: no borrar)
    // Esto actualiza el token si ha expirado. No consultamos la DB de perfiles aquí.
    const {
        data: { user },
    } = await supabase.auth.getUser()

    const path = request.nextUrl.pathname

    // 4. DEFINIR RUTAS PÚBLICAS
    const publicRoutes = ['/', '/login', '/register', '/auth/callback', '/verify', '/reset-password']
    const isPublicRoute = publicRoutes.some(route => path === route || path.startsWith(route))

    // CASO A: Ruta Pública
    if (isPublicRoute) {
        // Si el usuario ya está logueado y entra al Login, lo mandamos al Dashboard
        if (user && (path === '/login' || path === '/register')) {
            return NextResponse.redirect(new URL('/dashboard', request.url))
        }
        return supabaseResponse
    }

    // CASO B: Ruta Protegida
    if (!user) {
        const redirectUrl = new URL('/login', request.url)

        // ✅ AGREGAR ESTA VALIDACIÓN
        const isValidPath = path.startsWith('/') && !path.startsWith('//')
        if (isValidPath) {
            redirectUrl.searchParams.set('redirectedFrom', path)
        }

        return NextResponse.redirect(redirectUrl)
    }


    // ¡LISTO! No hacemos nada más.
    // La validación de si es 'admin', 'client' o 'cleaner'
    // se hace en app/dashboard/page.tsx o en el layout, usando requireProfile().
    return supabaseResponse
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}