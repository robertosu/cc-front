// app/dashboard/page.tsx
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
    const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    // Si hay error o no hay perfil, redirigir a login
    if (error || !profile) {
        console.error('Error obteniendo perfil:', error)
        redirect('/login')
    }

    // Redirigir según el rol del usuario
    if (profile.role === 'admin') {
        redirect('/dashboard/admin')
    } else if (profile.role === 'cleaner') {
        redirect('/dashboard/cleaner')
    } else if (profile.role === 'cliente') {
        redirect('/dashboard/client')
    } else {
        // Rol desconocido, redirigir a login
        redirect('/login')
    }
}