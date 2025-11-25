import {createClient} from '@/utils/supabase/server'
import {NextResponse} from 'next/server'

export async function POST() {
    try {
        const supabase = await createClient()

        await supabase.auth.signOut()

        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json(
            { error: 'Error al cerrar sesión' },
            { status: 500 }
        )
    }
}