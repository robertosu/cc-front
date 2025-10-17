import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

export const metadata = {
    title: 'Dashboard - CleanerClub',
    description: 'Panel de control de usuario'
}

export default async function DashboardPage() {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    // Obtener el usuario actual
    const {
        data: { user },
    } = await supabase.auth.getUser()

    // Si no hay usuario, redirigir a login
    if (!user) {
        redirect('/login')
    }

    // Obtener el perfil del usuario con su rol
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    // Redirigir según el rol del usuario
    if (profile?.role === 'admin') {
        redirect('/dashboard/admin')
    } else if (profile?.role === 'cleaner') {
        redirect('/dashboard/cleaner')
    } else {
        redirect('/dashboard/client')
    }
}