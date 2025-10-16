// app/api/auth/register/route.ts
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { email, password, fullName, phone } = body

        // ✅ Validaciones en el servidor
        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email y contraseña requeridos' },
                { status: 400 }
            )
        }

        // Validación de contraseña segura
        if (password.length < 8) {
            return NextResponse.json(
                { error: 'Contraseña debe tener al menos 8 caracteres' },
                { status: 400 }
            )
        }

        // Crear cliente de Supabase en el servidor
        const cookieStore = cookies()
        const supabase = createClient(cookieStore)

        // ✅ Crear usuario desde el BACKEND
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                    phone: phone
                },
                emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`
            }
        })

        if (error) {
            return NextResponse.json(
                { error: error.message },
                { status: 400 }
            )
        }

        // ✅ Aquí puedes hacer cosas adicionales:
        // - Enviar email de bienvenida
        // - Crear registros en otras tablas
        // - Log de auditoría
        // - Integración con Stripe, etc.

        return NextResponse.json({
            success: true,
            message: 'Confirma tu correo electrónico',
            user: data.user
        })

    } catch (error) {
        //console.error('Error en registro:', error)
        return NextResponse.json(
            { error: 'Error al intentar registrar, por favor intentelo nuevamente' },
            { status: 500 }
        )
    }
}