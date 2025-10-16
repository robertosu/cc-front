// app/auth/callback/route.ts
import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

/**
 * Ruta de callback para manejar la confirmación de email de Supabase
 * Esta ruta se ejecuta cuando el usuario hace clic en el link de confirmación
 */
export async function GET(request: Request) {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')
    const origin = requestUrl.origin

    if (code) {
        const cookieStore = await cookies()
        const supabase = createClient(cookieStore)

        // Intercambiar el código por una sesión de usuario
        const { error } = await supabase.auth.exchangeCodeForSession(code)

        if (error) {
            console.error('Error al intercambiar código:', error)
            // Redirigir a login con mensaje de error
            return NextResponse.redirect(`${origin}/login?error=verification_failed`)
        }
    }

    // Redirigir al dashboard después de una confirmación exitosa
    return NextResponse.redirect(`${origin}/dashboard`)
}

/*
📝 FUNCIONAMIENTO:
1. El usuario hace clic en el link del email
2. Supabase redirige a esta ruta con un código temporal
3. Intercambiamos el código por una sesión válida
4. Redirigimos al dashboard con la sesión activa
*/