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

    // IMPORTANTE: Refrescar la sesión antes de cualquier validación
    const {
        data: { user },
    } = await supabase.auth.getUser()

    const path = request.nextUrl.pathname

    // ========================================
    // 1. RUTAS PÚBLICAS (permitidas sin auth)
    // ========================================
    const publicRoutes = ['/', '/login', '/register', '/auth/callback']
    const isPublicRoute = publicRoutes.some(route => path === route || path.startsWith(route))

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
        const redirectUrl = new URL('/login', request.url)
        redirectUrl.searchParams.set('redirectedFrom', path)
        return NextResponse.redirect(redirectUrl)
    }

    // ========================================
    // 3. OBTENER ROL DEL USUARIO
    // ========================================

    // Dashboard principal - dejar que el componente maneje la redirección
    if (path === '/dashboard') {
        return supabaseResponse
    }

    // Para otras rutas protegidas, verificar el rol
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    // Si hay error obteniendo el perfil, redirigir a login
    if (profileError || !profile) {
        console.error('Error obteniendo perfil:', profileError)
        return NextResponse.redirect(new URL('/login', request.url))
    }

    const userRole = profile.role

    // ========================================
    // 4. PROTECCIÓN POR ROLES
    // ========================================

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
        if (userRole !== 'client') {
            return NextResponse.redirect(new URL('/dashboard', request.url))
        }
        return supabaseResponse
    }

    // API Routes - las API routes manejan su propia autorización
    if (path.startsWith('/api/')) {
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