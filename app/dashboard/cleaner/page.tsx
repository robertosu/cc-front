// app/dashboard/cleaner/page.tsx
import { requireProfile } from '@/utils/supabase/cached-queries'
import CleanerDashboardClient from '@/components/dashboard/CleanerDashboardClient'
import {Metadata} from "next";

export const metadata: Metadata = {
    title: 'Mis Limpiezas - CleanerClub',
    description: 'Gestiona tus trabajos de limpieza'
}

export default async function CleanerDashboard() {

    const { user, profile, supabase } = await requireProfile(['cleaner'])

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