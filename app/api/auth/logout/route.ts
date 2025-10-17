import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST() {
    try {
        const cookieStore = cookies()
        const supabase = createClient(cookieStore)

        await supabase.auth.signOut()

        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json(
            { error: 'Error al cerrar sesión' },
            { status: 500 }
        )
    }
}