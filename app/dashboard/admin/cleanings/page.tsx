// app/dashboard/admin/cleanings/page.tsx
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { Plus } from 'lucide-react'
import CleaningsTable from '@/components/admin/CleaningsTable'
import Link from 'next/link'
import { Metadata } from "next"

export const metadata: Metadata = {
    title: 'Gestión de Limpiezas - Admin',
    description: 'Administrar limpiezas programadas'
}

type Props = {
    searchParams: Promise<{
        page?: string
        search?: string
        status?: string
        sortBy?: string
        sortOrder?: string
        // NUEVOS PARAMS
        startDate?: string
        endDate?: string
    }>
}

export default async function AdminCleaningsPage({ searchParams }: Props) {
    // 1. Esperamos a que se resuelvan los parámetros
    const params = await searchParams

    const supabase = await createClient()

    // Verificación de Auth (Mismo código que tenías)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (!profile || profile.role !== 'admin') redirect('/login')

    // Parámetros
    const page = parseInt(params.page || '1')
    const pageSize = 10
    const search = params.search || ''
    const status = params.status || ''
    const sortBy = params.sortBy || 'scheduled_date'
    const sortOrder = (params.sortOrder || 'desc') as 'asc' | 'desc'

    // NUEVO: Variables de fecha
    const startDate = params.startDate
    const endDate = params.endDate

    // Query base
    let query = supabase
        .from('cleanings_with_details')
        .select('*', { count: 'exact' })

    // Aplicar filtros
    if (search) {
        query = query.or(`address.ilike.%${search}%,client_name.ilike.%${search}%`)
    }

    if (status) {
        query = query.eq('status', status)
    }

    // NUEVO: Filtros de rango de fecha
    if (startDate) {
        query = query.gte('scheduled_date', startDate)
    }
    if (endDate) {
        query = query.lte('scheduled_date', endDate)
    }

    // Ordenamiento
    query = query.order(sortBy, { ascending: sortOrder === 'asc' })

    // Paginación
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1
    query = query.range(from, to)

    const { data: cleanings, error, count } = await query

    if (error) {
        console.error('Error fetching cleanings:', error)
    }

    const totalPages = count ? Math.ceil(count / pageSize) : 0

    // Obtener cleaners para el formulario de edición
    const { data: cleaners } = await supabase
        .from('profiles')
        .select('id, full_name, email, phone')
        .eq('role', 'cleaner')
        .order('full_name', { ascending: true })

    // Estadísticas rápidas (Mismo código que tenías)
    const { count: totalCount } = await supabase
        .from('cleanings')
        .select('*', { count: 'exact', head: true })

    const { count: pendingCount } = await supabase
        .from('cleanings')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending')

    const { count: inProgressCount } = await supabase
        .from('cleanings')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'in_progress')

    const { count: completedCount } = await supabase
        .from('cleanings')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'completed')

    return (
        <div className="px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="sm:flex sm:items-center sm:justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Gestión de Limpiezas</h1>
                    <p className="mt-2 text-sm text-gray-700">
                        Administra y programa trabajos de limpieza
                    </p>
                </div>
                <div className="mt-4 sm:mt-0">
                    <Link
                        href="/dashboard/admin/cleanings/create"
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        Nueva Limpieza
                    </Link>
                </div>
            </div>

            {/* Estadísticas rápidas (Mismo JSX) */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                {/* ... Mantener tus tarjetas de estadísticas igual ... */}
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="rounded-md bg-ocean-500 p-3">
                                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                </div>
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Total</dt>
                                    <dd className="text-2xl font-semibold text-gray-900">{totalCount || 0}</dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="rounded-md bg-yellow-500 p-3">
                                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Pendientes</dt>
                                    <dd className="text-2xl font-semibold text-gray-900">{pendingCount || 0}</dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="rounded-md bg-ocean-500 p-3">
                                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">En Progreso</dt>
                                    <dd className="text-2xl font-semibold text-gray-900">{inProgressCount || 0}</dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="rounded-md bg-green-500 p-3">
                                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Completadas</dt>
                                    <dd className="text-2xl font-semibold text-gray-900">{completedCount || 0}</dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabla con filtros */}
            <CleaningsTable
                cleanings={cleanings || []}
                cleaners={cleaners || []}
                currentPage={page}
                totalPages={totalPages}
                totalCount={count || 0}
            />
        </div>
    )
}