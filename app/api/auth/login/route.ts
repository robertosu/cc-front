// app/api/auth/login/route.ts
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    try {
        const {email, password} = await request.json()

        if (!email || !password) {
            return NextResponse.json(
                {error: 'Email y contraseña requeridos'},
                {status: 400}
            )
        }

        const supabase = await createClient()

        const {data, error} = await supabase.auth.signInWithPassword({
            email,
            password
        })

        if (error) {
            const errorMessages: Record<string, string> = {
                'Invalid login credentials': 'Correo o contraseña incorrectos',
                'Email not confirmed': 'Por favor confirma tu correo antes de iniciar sesión',
                'Invalid email': 'El correo electrónico no es válido',
                'User not found': 'Usuario no encontrado',
            }

            const translatedError = Object.entries(errorMessages).find(([key]) =>
                error.message.includes(key)
            )?.[1] || 'Error al iniciar sesión'

            return NextResponse.json(
                {error: translatedError},
                {status: 400}
            )
        }

        return NextResponse.json({
            success: true,
            user: data.user
        })

    } catch (error) {
        return NextResponse.json(
            {error: 'Error del servidor'},
            {status: 500}
        )
    }
}