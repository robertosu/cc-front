// app/dashboard/cleaner/page.tsx
import { requireProfile } from '@/utils/supabase/cached-queries'
import CleanerDashboardClient from '@/components/dashboard/CleanerDashboardClient'
import { Metadata } from "next"

export const metadata: Metadata = {
    title: 'Mis Limpiezas - CleanerClub',
    description: 'Gestiona tus trabajos de limpieza'
}

type Props = {
    searchParams: Promise<{
        page?: string
        status?: string
    }>
}

export default async function CleanerDashboard({ searchParams }: Props) {
    const { user, profile, supabase } = await requireProfile(['cleaner'])

    // 1. Obtener params
    const params = await searchParams
    const page = parseInt(params.page || '1')
    const status = params.status || 'pending'
    const pageSize = 5

    // 2. Obtener IDs asignados (Tu lógica segura)
    const { data: assignments } = await supabase
        .from('cleaning_cleaners')
        .select('cleaning_id')
        .eq('cleaner_id', user.id)

    const cleaningIds = assignments?.map(a => a.cleaning_id) || []

    // 3. Si no hay trabajos, enviar array vacío
    if (cleaningIds.length === 0) {
        return (
            <CleanerDashboardClient
                profile={profile}
                cleanings={[]}
                stats={{ pending: 0, in_progress: 0, completed: 0 }}
                totalPages={0}
                currentPage={1}
            />
        )
    }

    // 4. Calcular Estadísticas (Usando la VISTA con tus IDs)
    const [
        { count: pendingCount },
        { count: inProgressCount },
        { count: completedCount }
    ] = await Promise.all([
        supabase.from('cleanings_with_details').select('*', { count: 'exact', head: true })
            .in('id', cleaningIds).eq('status', 'pending'),
        supabase.from('cleanings_with_details').select('*', { count: 'exact', head: true })
            .in('id', cleaningIds).eq('status', 'in_progress'),
        supabase.from('cleanings_with_details').select('*', { count: 'exact', head: true })
            .in('id', cleaningIds).eq('status', 'completed')
    ])

    const stats = {
        pending: pendingCount || 0,
        in_progress: inProgressCount || 0,
        completed: completedCount || 0
    }

    // 5. Query Principal (Usando la VISTA con tus IDs)
    let query = supabase
        .from('cleanings_with_details')
        .select('*', { count: 'exact' })
        .in('id', cleaningIds)

    if (status && status !== 'all') {
        query = query.eq('status', status)
    }

    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    const { data: cleanings, count } = await query
        .order('scheduled_date', { ascending: true })
        .range(from, to)

    // 6. Enviar al cliente
    return (
        <CleanerDashboardClient
            profile={profile}
            cleanings={cleanings || []} // Aquí van los datos llenos
            stats={stats}
            totalPages={count ? Math.ceil(count / pageSize) : 0}
            currentPage={page}
        />
    )
}