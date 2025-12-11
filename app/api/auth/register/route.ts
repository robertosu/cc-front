import {createClient} from '@/utils/supabase/server'
import {NextResponse} from 'next/server'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { email, password, fullName, phone } = body
        const supabase = await createClient()

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


        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                    phone: phone,
                    role: 'client'
                },
                // ⚠️ CAMBIO: Quitamos emailRedirectTo para no depender de links
            }
        })

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 })
        }

        // ⚠️ CAMBIO: La respuesta ahora indica que vamos a verificar código
        return NextResponse.json({
            success: true,
            message: 'Código enviado',
            email: email // Devolvemos el email para pre-llenar la siguiente pantalla
        })

    } catch (error) {
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        )
    }
}