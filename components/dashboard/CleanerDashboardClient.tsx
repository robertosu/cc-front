'use client'

import { useEffect, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Briefcase, CheckCircle, Clock, CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react'
import CleanerCleaningCard from '@/components/dashboard/CleanerCleaningCard'
import { createClient } from '@/utils/supabase/client'
import type { Cleaning, Profile } from '@/types'

interface CleanerStats {
    pending: number
    in_progress: number
    completed: number
}

interface CleanerDashboardClientProps {
    profile: Profile
    cleanings: Cleaning[]
    stats: CleanerStats
    totalPages: number
    currentPage: number
}

export default function CleanerDashboardClient({
                                                   profile,
                                                   cleanings,
                                                   stats,
                                                   totalPages,
                                                   currentPage
                                               }: CleanerDashboardClientProps) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [isPending, startTransition] = useTransition()
    const supabase = createClient()

    const currentStatus = searchParams.get('status') || 'pending'

    // 🔥 PATRÓN REFRESH: Solo escuchamos cambios, NO traemos datos nosotros mismos
    useEffect(() => {
        const channel = supabase
            .channel('cleaner-dashboard')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'cleanings' }, () => {
                router.refresh() // Recarga los datos del servidor sin perder el estado
            })
            .subscribe()

        return () => { supabase.removeChannel(channel) }
    }, [supabase, router])

    const updateUrl = (newParams: Record<string, string>) => {
        const params = new URLSearchParams(searchParams.toString())
        Object.entries(newParams).forEach(([key, value]) => {
            if (value) params.set(key, value)
            else params.delete(key)
        })
        startTransition(() => {
            router.push(`?${params.toString()}`)
        })
    }

    const handleTabChange = (status: string) => updateUrl({ status, page: '1' })
    const handlePageChange = (page: number) => updateUrl({ page: page.toString() })

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Hola, {profile.full_name}</h1>
                    <p className="text-gray-500 text-sm">Resumen de tus tareas asignadas.</p>
                </div>
            </div>

            {/* Estadísticas / Tabs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard
                    title="En Progreso"
                    value={stats.in_progress}
                    icon={<Briefcase className="w-5 h-5 text-white" />}
                    color="bg-ocean-500"
                    active={currentStatus === 'in_progress'}
                    onClick={() => handleTabChange('in_progress')}
                />
                <StatCard
                    title="Pendientes"
                    value={stats.pending}
                    icon={<Clock className="w-5 h-5 text-white" />}
                    color="bg-yellow-500"
                    active={currentStatus === 'pending'}
                    onClick={() => handleTabChange('pending')}
                />
                <StatCard
                    title="Completadas"
                    value={stats.completed}
                    icon={<CheckCircle className="w-5 h-5 text-white" />}
                    color="bg-green-500"
                    active={currentStatus === 'completed'}
                    onClick={() => handleTabChange('completed')}
                />
            </div>

            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                    {['pending', 'in_progress', 'completed'].map((status) => (
                        <button
                            key={status}
                            onClick={() => handleTabChange(status)}
                            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm capitalize flex items-center gap-2 ${
                                currentStatus === status
                                    ? 'border-ocean-500 text-ocean-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            {status === 'in_progress' ? 'En Progreso' : status === 'pending' ? 'Pendientes' : 'Completadas'}
                            <span className={`py-0.5 px-2.5 rounded-full text-xs font-medium ${
                                currentStatus === status ? 'bg-ocean-100 text-ocean-600' : 'bg-gray-100 text-gray-900'
                            }`}>
                                {stats[status as keyof CleanerStats]}
                            </span>
                        </button>
                    ))}
                </nav>
            </div>

            {/* Lista de Limpiezas */}
            <div className={`space-y-6 ${isPending ? 'opacity-50 pointer-events-none' : ''}`}>
                {cleanings.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg border border-dashed border-gray-300">
                        <CalendarDays className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No hay limpiezas</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            No se encontraron tareas en esta categoría.
                        </p>
                    </div>
                ) : (
                    cleanings.map((cleaning) => (
                        <CleanerCleaningCard key={cleaning.id} cleaning={cleaning} />
                    ))
                )}
            </div>

            {/* Paginación */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                    >
                        <ChevronLeft className="w-4 h-4 mr-2" /> Anterior
                    </button>
                    <span className="text-sm text-gray-700">Página {currentPage} de {totalPages}</span>
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                    >
                        Siguiente <ChevronRight className="w-4 h-4 ml-2" />
                    </button>
                </div>
            )}
        </div>
    )
}

function StatCard({ title, value, icon, color, active, onClick }: any) {
    return (
        <button onClick={onClick} className={`bg-white overflow-hidden shadow rounded-lg p-5 text-left transition-all ring-2 ${active ? 'ring-ocean-500 ring-offset-2' : 'ring-transparent hover:shadow-md'}`}>
            <div className="flex items-center">
                <div className={`flex-shrink-0 rounded-md ${color} p-3`}>{icon}</div>
                <div className="ml-5 w-0 flex-1">
                    <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
                        <dd className="text-2xl font-semibold text-gray-900">{value}</dd>
                    </dl>
                </div>
            </div>
        </button>
    )
}