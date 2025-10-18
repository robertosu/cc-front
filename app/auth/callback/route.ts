// app/auth/callback/route.ts
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')
    const next = requestUrl.searchParams.get('next') ?? '/dashboard'
    const origin = requestUrl.origin

    if (code) {
        const cookieStore = await cookies()
        const supabase = createClient(cookieStore)

        try {
            const { error } = await supabase.auth.exchangeCodeForSession(code)

            if (error) {
                console.error('Error exchanging code:', error)
                return NextResponse.redirect(`${origin}/login?error=verification_failed&message=${encodeURIComponent(error.message)}`)
            }

            // Verificar que el perfil existe
            const { data: { user } } = await supabase.auth.getUser()

            if (user) {
                const { data: profile, error: profileError } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single()

                if (profileError || !profile) {
                    console.error('Profile not found:', profileError)
                }
            }

            // Redirigir al dashboard con éxito
            const forwardedHost = request.headers.get('x-forwarded-host')
            const isLocalEnv = process.env.NODE_ENV === 'development'

            if (isLocalEnv) {
                return NextResponse.redirect(`${origin}${next}?verified=true`)
            } else if (forwardedHost) {
                return NextResponse.redirect(`https://${forwardedHost}${next}?verified=true`)
            } else {
                return NextResponse.redirect(`${origin}${next}?verified=true`)
            }

        } catch (error: any) {
            console.error('Unexpected error in callback:', error)
            return NextResponse.redirect(`${origin}/login?error=verification_failed&message=${encodeURIComponent(error.message)}`)
        }
    }

    // Sin código, redirigir a login
    return NextResponse.redirect(`${origin}/login?error=no_code`)
}