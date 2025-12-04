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

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${origin}/reset-password/confirm`
        })

        if (error) {
            return NextResponse.json(
                { error: error.message },
                { status: 400 }
            )
        }

        return NextResponse.json({
            success: true,
            message: 'Te hemos enviado un enlace para resetear tu contraseña. Revisa tu email.'
        })

    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Error in PUT /api/cleanings:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        } else {
            console.error('Unknown error:', error)
            return NextResponse.json({ error: 'Error desconocido' }, { status: 500 })
        }

    }
}