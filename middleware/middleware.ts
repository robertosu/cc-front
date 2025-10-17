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

    // Refrescar la sesión
    const {
        data: { user },
    } = await supabase.auth.getUser()

    const path = request.nextUrl.pathname

    // ========================================
    // 1. RUTAS PÚBLICAS (permitidas sin auth)
    // ========================================
    const publicRoutes = ['/', '/login', '/register', '/auth/callback']
    const isPublicRoute = publicRoutes.includes(path)

    // Si es ruta pública, permitir acceso
    if (isPublicRoute) {
        // Si está autenticado e intenta acceder a login/register, redirigir a dashboard
        if (user && (path === '/login' || path === '/register')) {
            return NextResponse.redirect(new URL('/dashboard', request.url))
        }
        return supabaseResponse
    }

    // ========================================
    // 2. VALIDAR AUTENTICACIÓN
    // ========================================
    if (!user) {
        const redirectUrl = request.nextUrl.clone()
        redirectUrl.pathname = '/login'
        redirectUrl.searchParams.set('redirectedFrom', path)
        return NextResponse.redirect(redirectUrl)
    }

    // ========================================
    // 3. OBTENER ROL DEL USUARIO
    // ========================================
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    const userRole = profile?.role

    if (!userRole) {
        // Si no tiene rol, redirigir a login
        return NextResponse.redirect(new URL('/login', request.url))
    }

    // ========================================
    // 4. PROTECCIÓN POR ROLES
    // ========================================

    // Dashboard principal - redirigir según rol
    if (path === '/dashboard') {
        // El componente page.js ya maneja la redirección
        return supabaseResponse
    }

    // RUTAS SOLO PARA ADMIN
    if (path.startsWith('/dashboard/admin')) {
        if (userRole !== 'admin') {
            return NextResponse.redirect(new URL('/dashboard', request.url))
        }
        return supabaseResponse
    }

    // RUTAS SOLO PARA CLEANER
    if (path.startsWith('/dashboard/cleaner')) {
        if (userRole !== 'cleaner') {
            return NextResponse.redirect(new URL('/dashboard', request.url))
        }
        return supabaseResponse
    }

    // RUTAS SOLO PARA CLIENTE
    if (path.startsWith('/dashboard/client')) {
        if (userRole !== 'cliente') {
            return NextResponse.redirect(new URL('/dashboard', request.url))
        }
        return supabaseResponse
    }

    // API Routes - validación adicional
    if (path.startsWith('/api/')) {
        // Las API routes manejan su propia autorización con checkAuth
        return supabaseResponse
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