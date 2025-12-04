// app/dashboard/cleaner/page.tsx
import {createClient} from '@/utils/supabase/server'
import {redirect} from 'next/navigation'
import CleanerDashboardClient from '@/components/dashboard/CleanerDashboardClient'
import {Metadata} from "next";

export const metadata: Metadata = {
    title: 'Mis Limpiezas - CleanerClub',
    description: 'Gestiona tus trabajos de limpieza'
}

export default async function CleanerDashboard() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    if (!profile || profile.role !== 'cleaner') {
        redirect('/login')
    }

    // Obtener IDs de limpiezas asignadas
    const { data: assignments } = await supabase
        .from('cleaning_cleaners')
        .select('cleaning_id')
        .eq('cleaner_id', user.id)

    const cleaningIds = assignments?.map(a => a.cleaning_id) || []

    // Obtener limpiezas usando la vista
    const { data: cleanings } = await supabase
        .from('cleanings_with_details')
        .select('*')
        .in('id', cleaningIds)
        .order('scheduled_date', { ascending: true })

    return (
        <CleanerDashboardClient
            profile={profile}
            initialCleanings={cleanings || []}
        />
    )
}