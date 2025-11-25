// components/admin/AdminDashboardClient.tsx
'use client'

import {useCleaningsRealtime} from '@/hooks/useCleaningsRealtime'
import {Briefcase, Calendar, CheckCircle, Clock, Users, XCircle} from 'lucide-react'
import Link from 'next/link'

interface DashboardStats {
    total_cleanings: number
    pending_cleanings: number
    in_progress_cleanings: number
    completed_cleanings: number
    cancelled_cleanings: number
    total_clients: number
    total_cleaners: number
}

interface Cleaning {
    id: string
    address: string
    total_steps: number
    current_step: number
    scheduled_date: string
    start_time: string
    status: string
    client_name: string
    assigned_cleaners: Array<{
        id: string
        full_name: string
        email: string
        assigned_at: string
    }>
}

interface AdminDashboardClientProps {
    initialStats: DashboardStats
    initialCurrentCleanings: Cleaning[]
    initialUpcomingCleanings: Cleaning[]
}

export default function AdminDashboardClient({
                                                 initialStats,
                                                 initialCurrentCleanings,
                                                 initialUpcomingCleanings
                                             }: AdminDashboardClientProps) {
    // Hook de realtime para todas las cleanings (admin ve todo)
    const { cleanings, isLoading } = useCleaningsRealtime({
        role: 'admin',
        initialData: [...initialCurrentCleanings, ...initialUpcomingCleanings]
    })

    // Calcular stats en tiempo real
    const statistics = {
        total_cleanings: cleanings.length,
        pending_cleanings: cleanings.filter((c: Cleaning) => c.status === 'pending').length,
        in_progress_cleanings: cleanings.filter((c: Cleaning) => c.status === 'in_progress').length,
        completed_cleanings: cleanings.filter((c: Cleaning) => c.status === 'completed').length,
        cancelled_cleanings: cleanings.filter((c: Cleaning) => c.status === 'cancelled').length,
        total_clients: initialStats.total_clients,
        total_cleaners: initialStats.total_cleaners
    }

    const currentCleanings = cleanings.filter((c: Cleaning) => c.status === 'in_progress').slice(0, 5)
    const today = new Date().toISOString().split('T')[0]
    const upcomingCleanings = cleanings
        .filter((c: Cleaning) => c.status === 'pending' && c.scheduled_date >= today)
        .slice(0, 5)

    return (
        <div className="min-h-screen bg-gray-50">
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Indicador de actualización */}
                {isLoading && (
                    <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center gap-2">
                        <span className="animate-pulse text-blue-600">●</span>
                        <span className="text-sm text-blue-700">Actualizando datos en tiempo real...</span>
                    </div>
                )}

                {/* Acciones rápidas */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <Link
                        href="/dashboard/admin/cleanings"
                        className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition-shadow border-l-4 border-green-500"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Gestionar</p>
                                <p className="text-xl font-bold text-gray-900">Limpiezas</p>
                            </div>
                            <Briefcase className="w-10 h-10 text-green-500" />
                        </div>
                    </Link>

                    <Link
                        href="/dashboard/admin/users"
                        className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition-shadow border-l-4 border-purple-500"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Gestionar</p>
                                <p className="text-xl font-bold text-gray-900">Usuarios</p>
                            </div>
                            <Users className="w-10 h-10 text-purple-500" />
                        </div>
                    </Link>

                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-blue-100 mb-1">Total Limpiezas</p>
                                <p className="text-3xl font-bold">{statistics.total_cleanings}</p>
                            </div>
                            <Briefcase className="w-10 h-10 text-blue-200" />
                        </div>
                    </div>
                </div>

                {/* Estadísticas */}
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
                    <div className="bg-white rounded-xl shadow p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Users className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-600">Clientes</p>
                                <p className="text-xl font-bold text-gray-900">{statistics.total_clients}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <Users className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-600">Cleaners</p>
                                <p className="text-xl font-bold text-gray-900">{statistics.total_cleaners}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Briefcase className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-600">Activas</p>
                                <p className="text-xl font-bold text-gray-900">{statistics.in_progress_cleanings}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-yellow-100 rounded-lg">
                                <Clock className="w-5 h-5 text-yellow-600" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-600">Pendientes</p>
                                <p className="text-xl font-bold text-gray-900">{statistics.pending_cleanings}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <CheckCircle className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-600">Completadas</p>
                                <p className="text-xl font-bold text-gray-900">{statistics.completed_cleanings}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-red-100 rounded-lg">
                                <XCircle className="w-5 h-5 text-red-600" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-600">Canceladas</p>
                                <p className="text-xl font-bold text-gray-900">{statistics.cancelled_cleanings}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Limpiezas activas */}
                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-4">🔄 Limpiezas en Progreso</h2>
                        <div className="bg-white rounded-xl shadow">
                            {currentCleanings && currentCleanings.length > 0 ? (
                                <div className="divide-y divide-gray-200">
                                    {currentCleanings.map((cleaning: Cleaning) => {
                                        const progressPercentage = (cleaning.current_step / cleaning.total_steps) * 100
                                        return (
                                            <div key={cleaning.id} className="p-4 hover:bg-gray-50">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <p className="font-medium text-gray-900">
                                                            {cleaning.address}
                                                        </p>
                                                        <p className="text-sm text-gray-600">
                                                            Cliente: {cleaning.client_name}
                                                        </p>
                                                        {cleaning.assigned_cleaners && cleaning.assigned_cleaners.length > 0 && (
                                                            <p className="text-sm text-gray-600">
                                                                Cleaners: {cleaning.assigned_cleaners.map((c: any) => c.full_name).join(', ')}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <span className="text-sm font-medium text-blue-600">
                                                        {cleaning.current_step}/{cleaning.total_steps}
                                                    </span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className="bg-blue-600 h-2 rounded-full transition-all"
                                                        style={{ width: `${progressPercentage}%` }}
                                                    />
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            ) : (
                                <div className="p-8 text-center text-gray-500">
                                    No hay limpiezas en progreso
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Próximas limpiezas */}
                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-4">📅 Próximas Limpiezas</h2>
                        <div className="bg-white rounded-xl shadow">
                            {upcomingCleanings && upcomingCleanings.length > 0 ? (
                                <div className="divide-y divide-gray-200">
                                    {upcomingCleanings.map((cleaning: Cleaning) => (
                                        <div key={cleaning.id} className="p-4 hover:bg-gray-50">
                                            <div className="flex items-start gap-3">
                                                <Calendar className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                                                <div className="flex-1">
                                                    <p className="font-medium text-gray-900">
                                                        {cleaning.address}
                                                    </p>
                                                    <p className="text-sm text-gray-600">
                                                        Cliente: {cleaning.client_name}
                                                    </p>
                                                    {cleaning.assigned_cleaners && cleaning.assigned_cleaners.length > 0 ? (
                                                        <p className="text-sm text-gray-600">
                                                            Cleaners: {cleaning.assigned_cleaners.map((c: any) => c.full_name).join(', ')}
                                                        </p>
                                                    ) : (
                                                        <p className="text-sm text-yellow-600">
                                                            ⚠️ Sin cleaners asignados
                                                        </p>
                                                    )}
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        {new Date(cleaning.scheduled_date + 'T00:00:00').toLocaleDateString('es-CL')} • {cleaning.start_time}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-8 text-center text-gray-500">
                                    No hay limpiezas programadas
                                </div>
                            )}
                        </div>
                    </section>
                </div>
            </main>
        </div>
    )
}