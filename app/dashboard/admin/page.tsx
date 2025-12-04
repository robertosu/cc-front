// app/dashboard/admin/page.tsx
import {createClient} from '@/utils/supabase/server'
import {redirect} from 'next/navigation'
import AdminDashboardClient from '@/components/admin/AdminDashboardClient'
import {Metadata} from "next";

export const metadata: Metadata = {
    title: 'Admin Dashboard - CleanerClub',
    description: 'Panel de administración'
}

interface DashboardStats {
    total_cleanings: number
    pending_cleanings: number
    in_progress_cleanings: number
    completed_cleanings: number
    cancelled_cleanings: number
    total_clients: number
    total_cleaners: number
}

export default async function AdminDashboard() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    if (!profile || profile.role !== 'admin') {
        redirect('/login')
    }

    // Estadísticas
    const [
        { count: totalCleanings },
        { count: pendingCleanings },
        { count: inProgressCleanings },
        { count: completedCleanings },
        { count: cancelledCleanings },
        { count: totalClients },
        { count: totalCleaners }
    ] = await Promise.all([
        supabase.from('cleanings').select('*', { count: 'exact', head: true }),
        supabase.from('cleanings').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('cleanings').select('*', { count: 'exact', head: true }).eq('status', 'in_progress'),
        supabase.from('cleanings').select('*', { count: 'exact', head: true }).eq('status', 'completed'),
        supabase.from('cleanings').select('*', { count: 'exact', head: true }).eq('status', 'cancelled'),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'client'),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'cleaner')
    ])

    const statistics: DashboardStats = {
        total_cleanings: totalCleanings || 0,
        pending_cleanings: pendingCleanings || 0,
        in_progress_cleanings: inProgressCleanings || 0,
        completed_cleanings: completedCleanings || 0,
        cancelled_cleanings: cancelledCleanings || 0,
        total_clients: totalClients || 0,
        total_cleaners: totalCleaners || 0
    }

    // Obtener limpiezas activas con la view
    const { data: currentCleanings } = await supabase
        .from('cleanings_with_details')
        .select('*')
        .eq('status', 'in_progress')
        .order('scheduled_date', { ascending: true })
        .limit(5)

    // Próximas limpiezas
    const today = new Date().toISOString().split('T')[0]
    const { data: upcomingCleanings } = await supabase
        .from('cleanings_with_details')
        .select('*')
        .eq('status', 'pending')
        .gte('scheduled_date', today)
        .order('scheduled_date', { ascending: true })
        .limit(5)

    return (
        <AdminDashboardClient
            initialStats={statistics}
            initialCurrentCleanings={currentCleanings || []}
            initialUpcomingCleanings={upcomingCleanings || []}
        />
    )
}