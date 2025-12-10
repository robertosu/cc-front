import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')
    const next = requestUrl.searchParams.get('next') ?? '/dashboard'
    const origin = requestUrl.origin

    if (code) {
        const supabase = await createClient()

        try {
            // 1. Intercambiar código por sesión
            const { error: sessionError } = await supabase.auth.exchangeCodeForSession(code)

            if (sessionError) {
                console.error('Error exchanging code:', sessionError)
                return NextResponse.redirect(`${origin}/login?error=verification_failed&message=${encodeURIComponent(sessionError.message)}`)
            }

            // 2. Obtener el usuario verificado
            const { data: { user }, error: userError } = await supabase.auth.getUser()

            if (userError || !user) {
                console.error('Error getting user:', userError)
                return NextResponse.redirect(`${origin}/login?error=user_not_found`)
            }

            // 3. Verificar si el perfil existe
            const { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single()

            // ⚠️ SOLUCIÓN: Si el perfil no existe, LO CREAMOS AQUÍ MISMO
            if (!profile) {
                console.log('Perfil no encontrado en callback. Intentando crear manualmente...')

                const metadata = user.user_metadata || {}

                // Mapeo seguro del rol (por defecto client)
                const role = ['admin', 'cleaner', 'client'].includes(metadata.role)
                    ? metadata.role
                    : 'client'

                const { error: insertError } = await supabase
                    .from('profiles')
                    .insert({
                        id: user.id,
                        email: user.email,
                        full_name: metadata.full_name || 'Usuario',
                        phone: metadata.phone || '',
                        role: role
                    })

                if (insertError) {
                    console.error('Error fatal creando perfil manual:', insertError)
                    return NextResponse.redirect(`${origin}/login?error=profile_creation_failed`)
                }
                console.log('Perfil creado exitosamente desde el callback')
            }

            // 4. Redirección exitosa (Manejo de entorno local vs producción)
            const forwardedHost = request.headers.get('x-forwarded-host')
            const isLocalEnv = process.env.NODE_ENV === 'development'

            // Construir la URL base correcta
            let redirectBase = origin
            if (!isLocalEnv && forwardedHost) {
                redirectBase = `https://${forwardedHost}`
            }

            return NextResponse.redirect(`${redirectBase}${next}?verified=true`)

        } catch (error) {
            const message = error instanceof Error ? error.message : String(error)
            console.error('Unexpected error in callback:', error)
            return NextResponse.redirect(
                `${origin}/login?error=verification_failed&message=${encodeURIComponent(message)}`
            )
        }
    }

    // Sin código, redirigir a login
    return NextResponse.redirect(`${origin}/login?error=no_code`)
}