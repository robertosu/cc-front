'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useCleaningsRealtime } from '@/hooks/useCleaningsRealtime'
import { Calendar, Clock, MapPin, Users, ChevronLeft, ChevronRight, PlayCircle, CalendarClock, History } from 'lucide-react'
import CleaningProgressBar from '@/components/dashboard/CleaningProgressBar'
import type { Profile, Cleaning, Cleaner } from '@/types'

interface ClientDashboardClientProps {
    profile: Profile
    initialCleanings: Cleaning[]
}

export default function ClientDashboardClient({
                                                  profile,
                                                  initialCleanings
                                              }: ClientDashboardClientProps) {
    const { cleanings, isLoading } = useCleaningsRealtime({
        userId: profile.id,
        role: 'client',
        initialData: initialCleanings
    })

    const searchParams = useSearchParams()
    const currentView = searchParams.get('view') || 'in_progress'

    // Paginación
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 6

    // Lógica de Filtrado Estricta
    const inProgressCleanings = cleanings.filter(c => c.status === 'in_progress')
    const scheduledCleanings = cleanings.filter(c => c.status === 'pending')
    const historyCleanings = cleanings.filter(c => ['completed', 'cancelled'].includes(c.status))

    // Selección de lista según vista
    let listToDisplay: Cleaning[] = []
    let title = ''
    let subtitle = ''
    let icon = null

    switch (currentView) {
        case 'scheduled':
            listToDisplay = scheduledCleanings
            title = 'Próximos Servicios Agendados'
            subtitle = 'Gestiona tus reservas futuras'
            icon = <CalendarClock className="w-6 h-6 text-ocean-600" />
            break
        case 'history':
            listToDisplay = historyCleanings
            title = 'Historial de Servicios'
            subtitle = 'Registro de limpiezas completadas'
            icon = <History className="w-6 h-6 text-purple-600" />
            break
        case 'in_progress':
        default:
            listToDisplay = inProgressCleanings
            title = 'Servicios En Curso'
            subtitle = 'Monitorea el progreso en tiempo real'
            icon = <PlayCircle className="w-6 h-6 text-green-600" />
            break
    }

    // Paginación lógica
    const totalPages = Math.ceil(listToDisplay.length / itemsPerPage)
    const safeCurrentPage = Math.min(Math.max(1, currentPage), Math.max(1, totalPages)) || 1

    const paginatedData = listToDisplay.slice(
        (safeCurrentPage - 1) * itemsPerPage,
        safeCurrentPage * itemsPerPage
    )

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const getValidCleaners = (cleaning: Cleaning): Cleaner[] => {
        const assigned = cleaning.assigned_cleaners || []

        return assigned.map((ac: any) => {
            // CASO 1: Formato Realtime (Anidado) -> { cleaner: { full_name: "..." } }
            if (ac.cleaner) return ac.cleaner as Cleaner

            // CASO 2: Formato Vista SQL (Plano) -> { full_name: "...", id: "..." }
            // Verificamos si tiene campos de cleaner directamente
            if (ac.full_name || ac.email) return ac as Cleaner

            return null
        }).filter((c): c is Cleaner => c !== null)
    }

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            {/* Header Dinámico */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-4 bg-white p-6 rounded-xl shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-gray-50 rounded-lg">
                        {icon}
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
                        <p className="text-gray-500 text-sm">{subtitle}</p>
                    </div>
                </div>
                {isLoading && (
                    <span className="text-xs font-medium text-ocean-600 animate-pulse bg-ocean-50 px-3 py-1 rounded-full border border-ocean-100">
                        Sincronizando...
                    </span>
                )}
            </div>

            {/* Grid de Tarjetas */}
            {paginatedData.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {paginatedData.map((cleaning) => {
                        const validCleaners = getValidCleaners(cleaning)
                        const isProgress = cleaning.status === 'in_progress'

                        return (
                            <div
                                key={cleaning.id}
                                className={`bg-white rounded-xl shadow-sm border p-6 transition-all hover:shadow-md ${
                                    isProgress ? 'border-ocean-300 ring-1 ring-ocean-100 shadow-ocean-100' : 'border-gray-100'
                                }`}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">
                                            {cleaning.address}
                                        </h3>
                                        <p className="text-sm text-gray-500 capitalize">
                                            {new Date(cleaning.scheduled_date + 'T00:00:00').toLocaleDateString('es-CL', {
                                                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                    <div className={`p-2 rounded-lg ${isProgress ? 'bg-ocean-50' : 'bg-gray-50'}`}>
                                        <MapPin className={`w-5 h-5 ${isProgress ? 'text-ocean-500' : 'text-gray-400'}`} />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {/* Mostrar Barra solo si es necesario (no en agendados puros a menos que quieras ver 0%) */}
                                    {(currentView === 'in_progress' || currentView === 'history') && (
                                        <div className="mb-4">
                                            <CleaningProgressBar
                                                currentStep={cleaning.current_step}
                                                totalSteps={cleaning.total_steps}
                                                status={cleaning.status}
                                            />
                                        </div>
                                    )}

                                    {/* Si es agendado mostramos un badge simple */}
                                    {currentView === 'scheduled' && (
                                        <div className="mb-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                Pendiente de inicio
                                            </span>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-2 gap-4 text-sm pt-2 border-t border-gray-50">
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <Clock className="w-4 h-4 text-gray-400" />
                                            <span>{cleaning.start_time} - {cleaning.end_time}</span>
                                        </div>
                                        {validCleaners.length > 0 ? (
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <Users className="w-4 h-4 text-gray-400" />
                                                <span className="truncate font-medium">
                                                    {validCleaners[0].full_name}
                                                    {validCleaners.length > 1 && ` +${validCleaners.length - 1}`}
                                                </span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2 text-gray-400 italic">
                                                <Users className="w-4 h-4" />
                                                <span>Por asignar</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            ) : (
                <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                    <div className="mx-auto w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                        {currentView === 'in_progress' ? (
                            <PlayCircle className="w-8 h-8 text-gray-300" />
                        ) : (
                            <Calendar className="w-8 h-8 text-gray-300" />
                        )}
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">
                        {currentView === 'in_progress'
                            ? 'No tienes servicios activos ahora'
                            : currentView === 'scheduled'
                                ? 'No tienes servicios agendados'
                                : 'No hay historial disponible'}
                    </h3>
                    <p className="text-gray-500 mt-1 max-w-sm mx-auto">
                        {currentView === 'in_progress'
                            ? 'Tus próximos servicios aparecerán aquí cuando comiencen.'
                            : 'Reserva un nuevo servicio para verlo aquí.'}
                    </p>
                </div>
            )}

            {/* Paginación */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-gray-200 pt-4 mt-6">
                    <p className="text-sm text-gray-700 hidden sm:block">
                        Página <span className="font-medium">{safeCurrentPage}</span> de <span className="font-medium">{totalPages}</span>
                    </p>
                    <div className="flex gap-2 mx-auto sm:mx-0">
                        <button
                            onClick={() => handlePageChange(safeCurrentPage - 1)}
                            disabled={safeCurrentPage === 1}
                            className="p-2 border rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed bg-white"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <span className="flex items-center px-4 text-sm font-medium text-gray-700 sm:hidden">
                            {safeCurrentPage} / {totalPages}
                        </span>
                        <button
                            onClick={() => handlePageChange(safeCurrentPage + 1)}
                            disabled={safeCurrentPage === totalPages}
                            className="p-2 border rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed bg-white"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}