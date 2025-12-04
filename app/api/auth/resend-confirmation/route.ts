import {createClient} from '@/utils/supabase/server'
import {NextResponse} from 'next/server'

export async function POST(request: Request) {
    try {
        const { email } = await request.json()

        if (!email) {
            return NextResponse.json(
                { error: 'Email es requerido' },
                { status: 400 }
            )
        }

        const supabase = await createClient()
        const origin = request.headers.get('origin') || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

        const { error } = await supabase.auth.resend({
            type: 'signup',
            email: email,
            options: {
                emailRedirectTo: `${origin}/auth/callback`
            }
        })

        if (error) {
            return NextResponse.json(
                { error: error.message },
                { status: 400 }
            )
        }

        return NextResponse.json({
            success: true,
            message: 'Correo de confirmación reenviado. Revisa tu bandeja de entrada.'
        })

    } catch (error: unknown) {
        console.error('Error en resend-confirmation:', error)
        return NextResponse.json(
            { error: 'Error al reenviar el correo' },
            { status: 500 }
        )
    }
}
