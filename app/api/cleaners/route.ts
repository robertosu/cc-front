// app/api/cleaners/route.ts
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { checkAuth, unauthorizedResponse } from '@/utils/auth/roleCheck'

// GET: Obtener lista de cleaners (solo admin)
export async function GET(request: Request) {
    const user = await checkAuth(['admin'])

    if (!user) {
        return unauthorizedResponse('Solo administradores pueden ver la lista de cleaners')
    }

    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    try {
        const { data, error } = await supabase
            .from('profiles')
            .select(`
                id,
                full_name,
                email,
                phone,
                created_at,
                cleanings:cleanings(count)
            `)
            .eq('role', 'cleaner')
            .order('full_name', { ascending: true })

        if (error) throw error

        return NextResponse.json({ cleaners: data })
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        )
    }
}

// POST: Convertir usuario en cleaner (solo admin)
export async function POST(request: Request) {
    const user = await checkAuth(['admin'])

    if (!user) {
        return unauthorizedResponse('Solo administradores pueden asignar roles')
    }

    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    try {
        const body = await request.json()
        const { user_id } = body

        if (!user_id) {
            return NextResponse.json(
                { error: 'user_id requerido' },
                { status: 400 }
            )
        }

        const { data, error } = await supabase
            .from('profiles')
            .update({ role: 'cleaner' })
            .eq('id', user_id)
            .select()
            .single()

        if (error) throw error

        return NextResponse.json({ profile: data })
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        )
    }
}