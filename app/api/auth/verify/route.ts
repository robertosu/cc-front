import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    try {
        const { email, code } = await request.json()

        if (!email || !code) {
            return NextResponse.json({ error: 'Faltan datos' }, { status: 400 })
        }

        const supabase = await createClient()

        // Verificamos el OTP de tipo 'signup' (registro)
        const { data, error } = await supabase.auth.verifyOtp({
            email,
            token: code,
            type: 'signup'
        })

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 })
        }

        // ⚠️ SEGURIDAD EXTRA (Tu Plan B):
        // Como ya estamos en el servidor, podemos asegurar que el perfil exista aquí mismo
        // por si el Trigger de la base de datos falla.
        if (data.user) {
            const { error: profileError } = await supabase
                .from('profiles')
                .select('id')
                .eq('id', data.user.id)
                .single()

            if (profileError) {
                // Si no existe, lo creamos manualmente usando la metadata
                const meta = data.user.user_metadata
                await supabase.from('profiles').insert({
                    id: data.user.id,
                    email: data.user.email,
                    full_name: meta.full_name || 'Usuario',
                    phone: meta.phone || '',
                    role: meta.role || 'client'
                })
            }
        }

        return NextResponse.json({ success: true })

    } catch (error) {
        return NextResponse.json({ error: 'Error verificando código' }, { status: 500 })
    }
}