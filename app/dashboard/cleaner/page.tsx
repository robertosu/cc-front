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
    const params = await searchParams

    const page = parseInt(params.page || '1')
    const status = params.status || 'pending'
    const pageSize = 5

    // 1. OBTENCIÓN ROBUSTA DE IDs (Tu lógica original que sí funciona)
    const { data: assignments } = await supabase
        .from('cleaning_cleaners')
        .select('cleaning_id')
        .eq('cleaner_id', user.id)

    // Extraemos los IDs en un array simple
    const cleaningIds = assignments?.map(a => a.cleaning_id) || []

    // Si no tiene nada asignado, pasamos datos vacíos para evitar errores en queries siguientes
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

    // 2. CALCULAR ESTADÍSTICAS (Usando los IDs obtenidos)
    // Filtramos la tabla 'cleanings' usando el array de IDs
    const [
        { count: pendingCount },
        { count: inProgressCount },
        { count: completedCount }
    ] = await Promise.all([
        supabase.from('cleanings').select('*', { count: 'exact', head: true })
            .in('id', cleaningIds).eq('status', 'pending'),
        supabase.from('cleanings').select('*', { count: 'exact', head: true })
            .in('id', cleaningIds).eq('status', 'in_progress'),
        supabase.from('cleanings').select('*', { count: 'exact', head: true })
            .in('id', cleaningIds).eq('status', 'completed')
    ])

    const stats = {
        pending: pendingCount || 0,
        in_progress: inProgressCount || 0,
        completed: completedCount || 0
    }

    // 3. CONSULTA PRINCIPAL PAGINADA
    // Usamos 'cleanings_with_details' para tener toda la info (cliente, etc.)
    let query = supabase
        .from('cleanings_with_details')
        .select('*', { count: 'exact' })
        .in('id', cleaningIds) // Filtro clave: Solo los IDs asignados

    // Aplicar filtro de estado (tabs)
    if (status && status !== 'all') {
        query = query.eq('status', status)
    }

    // Paginación
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    const { data: cleanings, count } = await query
        .order('scheduled_date', { ascending: true })
        .range(from, to)

    const totalPages = count ? Math.ceil(count / pageSize) : 0

    return (
        <CleanerDashboardClient
            profile={profile}
            cleanings={cleanings || []}
            stats={stats}
            totalPages={totalPages}
            currentPage={page}
        />
    )
}