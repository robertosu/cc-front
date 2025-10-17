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

        const cookieStore = cookies()
        const supabase = createClient(cookieStore)

        // Obtener la URL base del request
        const origin = request.headers.get('origin') || 'http://localhost:3000'

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                    phone: phone
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

/*
📝 FLUJO DE REGISTRO:
1. Usuario completa el formulario
2. Backend crea la cuenta en Supabase
3. Supabase envía email con link de verificación
4. Usuario hace click en el link del email
5. Link redirige a /auth/callback con código
6. /auth/callback valida el código y crea la sesión
7. Usuario es redirigido a /dashboard ya autenticado

⚠️ IMPORTANTE: Configurar en Supabase Dashboard:
Authentication → Email Templates → Confirm signup
Cambiar {{ .ConfirmationURL }} por: 
{{ .SiteURL }}/auth/callback?code={{ .TokenHash }}
*/