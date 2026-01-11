import { requireProfile } from '@/utils/supabase/cached-queries'
import CleanerDashboardClient from '@/components/dashboard/CleanerDashboardClient'
import { Metadata } from "next"

export const metadata: Metadata = {
    title: 'Panel de Cleaner - Cleaner Club',
    description: 'Gestiona tus trabajos asignados'
}

export default async function CleanerDashboardPage() {
    // 1. Verificamos sesión y perfil (Server Side)
    const { user, profile, supabase } = await requireProfile(['cleaner'])

    // 2. Paso A: Obtener IDs de las limpiezas asignadas a este cleaner
    const { data: assignments } = await supabase
        .from('cleaning_cleaners')
        .select('cleaning_id')
        .eq('cleaner_id', user.id)

    const cleaningIds = assignments?.map(a => a.cleaning_id) || []

    let initialCleanings: any[] = []

    // 3. Paso B: Si tiene trabajos, traemos los detalles completos
    // Usamos la MISMA consulta profunda que el hook para que los datos coincidan
    if (cleaningIds.length > 0) {
        const { data } = await supabase
            .from('cleanings')
            .select(`
                *,
                client:profiles!cleanings_client_id_fkey(id, full_name, email, phone),
                assigned_cleaners:cleaning_cleaners(
                    assigned_at,
                    cleaner:profiles!cleaning_cleaners_cleaner_id_fkey(id, full_name, email, phone)
                )
            `)
            .in('id', cleaningIds)
            .order('scheduled_date', { ascending: true })

        initialCleanings = data || []
    }

    // 4. Enviamos los datos listos al componente cliente
    return (
        <CleanerDashboardClient
            profile={profile}
            initialCleanings={initialCleanings}
        />
    )
}