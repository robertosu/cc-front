'use client'

import { useCleaningsRealtime } from '@/hooks/useCleaningsRealtime'
import { Calendar, Clock, MapPin, Users } from 'lucide-react'
import LogoutButton from '@/components/auth/LogoutButton'
import CleaningProgressBar from '@/components/dashboard/CleaningProgressBar'
import Link from 'next/link'
import type { Profile, Cleaning, Cleaner } from '@/types'

interface ClientDashboardClientProps {
    profile: Profile
    initialCleanings: Cleaning[]
}

export default function ClientDashboardClient({
                                                  profile,
                                                  initialCleanings
                                              }: ClientDashboardClientProps) {
    // 1. Hook de Realtime: Gestiona estado, carga y suscripciones
    // Se inicializa con los datos del servidor para que la carga inicial sea instantánea
    const { cleanings, isLoading } = useCleaningsRealtime({
        userId: profile.id,
        role: 'client',
        initialData: initialCleanings
    })

    // 2. Derivamos las listas filtradas directamente del estado del hook
    const activeCleanings = cleanings.filter(c => c.status === 'in_progress')
    const upcomingCleanings = cleanings.filter(c => c.status === 'pending')
    const completedCleanings = cleanings.filter(c => c.status === 'completed').slice(0, 3)

    // 3. Helper para extraer cleaners de forma segura (maneja la estructura anidada del hook)
    const getValidCleaners = (cleaning: Cleaning): Cleaner[] => {
        const assigned = cleaning.assigned_cleaners || []
        // El hook para 'client' devuelve assigned_cleaners como: { cleaner: { ... } }
        // Filtramos y extraemos el objeto cleaner real
        return assigned
            .filter((ac: any) => ac.cleaner)
            .map((ac: any) => ac.cleaner as Cleaner)
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                Bienvenido, {profile.full_name}
                            </h1>
                            <div className="flex items-center gap-2 mt-1">
                                <p className="text-gray-600">Mis Servicios de Limpieza</p>
                                {isLoading && (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 animate-pulse">
                                        <span className="w-1.5 h-1.5 mr-1 bg-blue-500 rounded-full"></span>
                                        Sincronizando...
                                    </span>
                                )}
                            </div>
                        </div>
                        <LogoutButton />
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* 1. SECCIÓN: Limpiezas en Progreso */}
                {activeCleanings.length > 0 && (
                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                            🔄 Limpiezas en Progreso
                        </h2>
                        <div className="grid grid-cols-1 gap-6">
                            {activeCleanings.map((cleaning) => {
                                const validCleaners = getValidCleaners(cleaning)
                                return (
                                    <div key={cleaning.id} className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-ocean-500">
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div className="space-y-3">
                                                <div className="flex items-start gap-3">
                                                    <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0 mt-1" />
                                                    <div>
                                                        <p className="text-sm text-gray-600">Dirección</p>
                                                        <p className="font-medium text-gray-900">{cleaning.address}</p>
                                                    </div>
                                                </div>

                                                {validCleaners.length > 0 && (
                                                    <div className="flex items-start gap-3">
                                                        <Users className="w-5 h-5 text-gray-400 flex-shrink-0 mt-1" />
                                                        <div>
                                                            <p className="text-sm text-gray-600">
                                                                {validCleaners.length === 1 ? 'Cleaner Asignado' : 'Equipo Asignado'}
                                                            </p>
                                                            <p className="font-medium text-gray-900">
                                                                {validCleaners.map(c => c.full_name).join(', ')}
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="flex items-start gap-3">
                                                    <Calendar className="w-5 h-5 text-gray-400 flex-shrink-0 mt-1" />
                                                    <div>
                                                        <p className="text-sm text-gray-600">Fecha</p>
                                                        <p className="font-medium text-gray-900">
                                                            {new Date(cleaning.scheduled_date + 'T00:00:00').toLocaleDateString('es-CL', {
                                                                weekday: 'long',
                                                                year: 'numeric',
                                                                month: 'long',
                                                                day: 'numeric'
                                                            })}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-start gap-3">
                                                    <Clock className="w-5 h-5 text-gray-400 flex-shrink-0 mt-1" />
                                                    <div>
                                                        <p className="text-sm text-gray-600">Horario</p>
                                                        <p className="font-medium text-gray-900">
                                                            {cleaning.start_time} - {cleaning.end_time}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <CleaningProgressBar
                                                    currentStep={cleaning.current_step}
                                                    totalSteps={cleaning.total_steps}
                                                    status={cleaning.status}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </section>
                )}

                {/* 2. SECCIÓN: Próximas Limpiezas */}
                {upcomingCleanings.length > 0 && (
                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                            📅 Próximas Limpiezas
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {upcomingCleanings.map((cleaning) => {
                                const validCleaners = getValidCleaners(cleaning)
                                return (
                                    <div key={cleaning.id} className="bg-white rounded-xl shadow p-6 hover:shadow-md transition-shadow">
                                        <div className="flex items-start justify-between mb-4">
                                            <div>
                                                <h3 className="font-semibold text-gray-900">{cleaning.address}</h3>
                                                <p className="text-sm text-gray-600">{cleaning.total_steps} pasos estimados</p>
                                            </div>
                                            <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">
                                                Pendiente
                                            </span>
                                        </div>

                                        <div className="space-y-2 text-sm">
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <Calendar className="w-4 h-4" />
                                                {new Date(cleaning.scheduled_date + 'T00:00:00').toLocaleDateString('es-CL')}
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <Clock className="w-4 h-4" />
                                                {cleaning.start_time} - {cleaning.end_time}
                                            </div>
                                            {validCleaners.length > 0 && (
                                                <div className="flex items-center gap-2 text-gray-600">
                                                    <Users className="w-4 h-4" />
                                                    {validCleaners.map(c => c.full_name).join(', ')}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </section>
                )}

                {/* 3. SECCIÓN: Completadas */}
                {completedCleanings.length > 0 && (
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                            ✅ Limpiezas Completadas Recientemente
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {completedCleanings.map((cleaning) => {
                                const validCleaners = getValidCleaners(cleaning)
                                return (
                                    <div key={cleaning.id} className="bg-white rounded-xl shadow p-6 opacity-75 hover:opacity-100 transition-opacity">
                                        <div className="flex items-start justify-between mb-3">
                                            <h3 className="font-semibold text-gray-900">{cleaning.address}</h3>
                                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                                                Completada
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600 mb-2">
                                            {new Date(cleaning.scheduled_date + 'T00:00:00').toLocaleDateString('es-CL')}
                                        </p>
                                        {validCleaners.length > 0 && (
                                            <p className="text-xs text-gray-500">
                                                Realizada por: {validCleaners.map(c => c.full_name).join(', ')}
                                            </p>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    </section>
                )}

                {/* Empty State */}
                {cleanings.length === 0 && (
                    <div className="bg-white rounded-xl shadow p-12 text-center">
                        <p className="text-gray-600 text-lg mb-4">
                            Aún no tienes limpiezas programadas
                        </p>
                        <Link
                            href="/#services"
                            className="inline-block bg-ocean-400 text-white px-6 py-3 rounded-lg hover:bg-ocean-700 transition-colors"
                        >
                            Ver Servicios
                        </Link>
                    </div>
                )}
            </main>
        </div>
    )
}