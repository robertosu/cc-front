import { requireProfile } from '@/utils/supabase/cached-queries'
import CleanerDashboardClient from '@/components/dashboard/CleanerDashboardClient'
import { Metadata } from "next"

export const metadata: Metadata = {
    title: 'Mis Limpiezas - CleanerClub',
    description: 'Gestiona tus trabajos de limpieza'
}

export default async function CleanerDashboard() {
    const { user, profile, supabase } = await requireProfile(['cleaner'])

    // ESTRATEGIA DE CARGA ÚNICA (Rápida)
    // Traemos todo lo asignado de una sola vez usando !inner.
    // Esto evita inconsistencias entre los contadores y la lista.
    const { data: cleanings } = await supabase
        .from('cleanings')
        .select(`
            *,
            client:profiles!cleanings_client_id_fkey(id, full_name, email, phone, address),
            assigned_cleaners:cleaning_cleaners!inner(
                assigned_at,
                cleaner:profiles!cleaning_cleaners_cleaner_id_fkey(id, full_name, email, phone)
            )
        `)
        .eq('assigned_cleaners.cleaner_id', user.id)
        .order('scheduled_date', { ascending: true })

    // Normalizamos un poco la data para que entre limpia al componente si es necesario
    // aunque tu hook ya se encarga de esto, es bueno enviar un array limpio.
    const safeCleanings = (cleanings || []).map((c: any) => ({
        ...c,
        // Aseguramos estructura compatible con lo que espera tu UI
        assigned_cleaners: c.assigned_cleaners || []
    }))

    return (
        <CleanerDashboardClient
            profile={profile}
            cleanings={safeCleanings}
        />
    )
}