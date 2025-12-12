'use client'

import { useCleaningsRealtime } from '@/hooks/useCleaningsRealtime' // ✅ Hook
import { Briefcase, Calendar, CheckCircle, Clock, Users, XCircle } from 'lucide-react'
import Link from 'next/link'
import type { DashboardStats, Cleaning, Cleaner } from '@/types'

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
    // Combinamos las datas iniciales para alimentar el hook
    const combinedInitialData = [...initialCurrentCleanings, ...initialUpcomingCleanings]

    // El hook se encargará de mantener esto actualizado y traer CUALQUIER otra limpieza nueva
    const { cleanings } = useCleaningsRealtime({
        role: 'admin',
        initialData: combinedInitialData
    })

    // Recalculamos stats en vivo basados en la data del hook
    const statistics: DashboardStats = {
        total_cleanings: cleanings.length,
        pending_cleanings: cleanings.filter(c => c.status === 'pending').length,
        in_progress_cleanings: cleanings.filter(c => c.status === 'in_progress').length,
        completed_cleanings: cleanings.filter(c => c.status === 'completed').length,
        cancelled_cleanings: cleanings.filter(c => c.status === 'cancelled').length,
        // Estos dos vienen estáticos del server porque no tenemos hook de usuarios realtime aún
        total_clients: initialStats.total_clients,
        total_cleaners: initialStats.total_cleaners
    }

    const currentCleanings = cleanings.filter(c => c.status === 'in_progress').slice(0, 5)
    const today = new Date().toISOString().split('T')[0]
    const upcomingCleanings = cleanings
        .filter(c => c.status === 'pending' && c.scheduled_date >= today)
        .slice(0, 5)

    const getValidCleaners = (cleaning: Cleaning): Cleaner[] => {
        const assigned = cleaning.assigned_cleaners || [];
        return assigned.map((item: any) => {
            if (item.cleaner) return item.cleaner;
            if (item.id && item.full_name) return { ...item } as Cleaner;
            return null;
        }).filter((c): c is Cleaner => c !== null);
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* ... (Todo el JSX se mantiene igual, usando statistics, currentCleanings, etc.) ... */}
                {/* Copia el JSX de los Cards y Tablas que ya tenías, funciona directo con estas variables */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    {/* ... Links ... */}
                    <div className="bg-gradient-to-br from-ocean-500 to-ocean-400 rounded-xl shadow p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-ocean-100 mb-1">Total Limpiezas</p>
                                <p className="text-3xl font-bold">{statistics.total_cleanings}</p>
                            </div>
                            <Briefcase className="w-10 h-10 text-ocean-200" />
                        </div>
                    </div>
                </div>

                {/* ... StatBoxes ... */}
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
                    <StatBox icon={Users} color="text-ocean-400" bg="bg-ocean-100" label="Clientes" value={statistics.total_clients} />
                    <StatBox icon={Users} color="text-purple-600" bg="bg-purple-100" label="Cleaners" value={statistics.total_cleaners} />
                    <StatBox icon={Briefcase} color="text-ocean-400" bg="bg-ocean-100" label="Activas" value={statistics.in_progress_cleanings} />
                    <StatBox icon={Clock} color="text-yellow-600" bg="bg-yellow-100" label="Pendientes" value={statistics.pending_cleanings} />
                    <StatBox icon={CheckCircle} color="text-green-600" bg="bg-green-100" label="Completadas" value={statistics.completed_cleanings} />
                    <StatBox icon={XCircle} color="text-red-600" bg="bg-red-100" label="Canceladas" value={statistics.cancelled_cleanings} />
                </div>

                {/* ... Listas ... */}
                <div className="grid md:grid-cols-2 gap-8">
                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-4">🔄 Limpiezas en Progreso</h2>
                        <div className="bg-white rounded-xl shadow overflow-hidden">
                            {currentCleanings.length > 0 ? (
                                <div className="divide-y divide-gray-200">
                                    {currentCleanings.map((cleaning) => {
                                        const progressPercentage = (cleaning.current_step / cleaning.total_steps) * 100
                                        const validCleaners = getValidCleaners(cleaning)
                                        return (
                                            <div key={cleaning.id} className="p-4 hover:bg-gray-50 transition-colors">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <p className="font-medium text-gray-900">{cleaning.address}</p>
                                                        <p className="text-sm text-gray-600">Cliente: {cleaning.client_name}</p>
                                                        {validCleaners.length > 0 && (
                                                            <p className="text-xs text-gray-500 mt-1">{validCleaners.map(c => c.full_name).join(', ')}</p>
                                                        )}
                                                    </div>
                                                    <span className="text-xs font-semibold px-2 py-1 bg-ocean-50 text-ocean-600 rounded-full">
                                                        {cleaning.current_step}/{cleaning.total_steps}
                                                    </span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                                                    <div className="bg-ocean-400 h-1.5 rounded-full transition-all duration-500" style={{ width: `${progressPercentage}%` }} />
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            ) : (
                                <div className="p-8 text-center text-gray-500 text-sm">No hay limpiezas en curso</div>
                            )}
                        </div>
                    </section>

                    {/* ... (Sección Upcoming igual) ... */}
                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-4">📅 Próximas Limpiezas</h2>
                        <div className="bg-white rounded-xl shadow overflow-hidden">
                            {upcomingCleanings.length > 0 ? (
                                <div className="divide-y divide-gray-200">
                                    {upcomingCleanings.map((cleaning) => {
                                        const validCleaners = getValidCleaners(cleaning)
                                        return (
                                            <div key={cleaning.id} className="p-4 hover:bg-gray-50 transition-colors">
                                                <div className="flex items-start gap-3">
                                                    <div className="p-2 bg-gray-100 rounded-lg">
                                                        <Calendar className="w-5 h-5 text-gray-500" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="font-medium text-gray-900">{cleaning.address}</p>
                                                        <div className="flex justify-between items-end mt-1">
                                                            <div className="text-sm text-gray-600 space-y-0.5">
                                                                <p>{new Date(cleaning.scheduled_date + 'T00:00:00').toLocaleDateString('es-CL')}</p>
                                                                <p className="text-xs">{cleaning.start_time}</p>
                                                            </div>
                                                            {validCleaners.length === 0 && (
                                                                <span className="text-xs text-yellow-600 bg-yellow-50 px-2 py-1 rounded">⚠️ Sin asignar</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            ) : (
                                <div className="p-8 text-center text-gray-500 text-sm">No hay limpiezas programadas</div>
                            )}
                        </div>
                    </section>
                </div>
            </main>
        </div>
    )
}

function StatBox({ icon: Icon, color, bg, label, value }: any) {
    return (
        <div className="bg-white rounded-xl shadow p-4 flex items-center gap-3">
            <div className={`p-2 ${bg} rounded-lg`}>
                <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <div>
                <p className="text-xs text-gray-600">{label}</p>
                <p className="text-xl font-bold text-gray-900">{value}</p>
            </div>
        </div>
    )
}