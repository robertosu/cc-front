import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { email, password, fullName, phone } = body

        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email y contraseña requeridos' },
                { status: 400 }
            )
        }

        if (password.length < 8) {
            return NextResponse.json(
                { error: 'Contraseña debe tener al menos 8 caracteres' },
                { status: 400 }
            )
        }

        const supabase = await createClient()

        // Obtener la URL base del request
        const origin = request.headers.get('origin') || 'http://localhost:3000'

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                    phone: phone,
                    role: 'client' // Agrega esto si quieres especificar el rol
                },
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
            message: 'Revisa tu correo para confirmar tu cuenta',
            user: data.user
        })

    } catch (error) {
        return NextResponse.json(
            { error: 'Error al intentar registrar, por favor intentelo nuevamente' },
            { status: 500 }
        )
    }
}