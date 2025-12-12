'use client'

import { useCleaningsRealtime } from '@/hooks/useCleaningsRealtime'
import { Briefcase, CheckCircle, Clock, CalendarDays } from 'lucide-react'
import { useState } from 'react'
// Asegúrate de tener este componente, o usa el que tenías antes
import CleanerCleaningCard from '@/components/dashboard/CleanerCleaningCard'
import type { Cleaning, Profile } from '@/types'

interface CleanerDashboardClientProps {
    profile: Profile
    cleanings: Cleaning[]
}

export default function CleanerDashboardClient({
                                                   profile,
                                                   cleanings: initialCleanings,
                                               }: CleanerDashboardClientProps) {

    // 1. Hook Realtime con hidratación instantánea
    const { cleanings } = useCleaningsRealtime({
        userId: profile.id,
        role: 'cleaner',
        initialData: initialCleanings
    })

    const [currentStatus, setCurrentStatus] = useState('in_progress') // Empezar en 'En Progreso' suele ser más útil

    // 2. Filtros Client-Side (Rápido y fluido)
    const activeCleanings = cleanings.filter(c => c.status === 'in_progress')
    const upcomingCleanings = cleanings.filter(c => c.status === 'pending')
    const completedCleanings = cleanings.filter(c => ['completed', 'cancelled'].includes(c.status))

    // Selector de lista a mostrar
    const filteredCleanings = {
        'in_progress': activeCleanings,
        'pending': upcomingCleanings,
        'completed': completedCleanings
    }[currentStatus] || []

    const stats = {
        in_progress: activeCleanings.length,
        pending: upcomingCleanings.length,
        completed: completedCleanings.length
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Hola, {profile.full_name}</h1>
                    <p className="text-gray-500 text-sm">Resumen de tus tareas asignadas.</p>
                </div>
            </div>

            {/* Stats Cards (Tu diseño original) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard
                    title="En Progreso"
                    value={stats.in_progress}
                    icon={<Briefcase className="w-5 h-5 text-white" />}
                    color="bg-ocean-500"
                    active={currentStatus === 'in_progress'}
                    onClick={() => setCurrentStatus('in_progress')}
                />
                <StatCard
                    title="Pendientes"
                    value={stats.pending}
                    icon={<Clock className="w-5 h-5 text-white" />}
                    color="bg-yellow-500"
                    active={currentStatus === 'pending'}
                    onClick={() => setCurrentStatus('pending')}
                />
                <StatCard
                    title="Historial" // Renombrado a historial para incluir canceladas si quieres
                    value={stats.completed}
                    icon={<CheckCircle className="w-5 h-5 text-white" />}
                    color="bg-green-500"
                    active={currentStatus === 'completed'}
                    onClick={() => setCurrentStatus('completed')}
                />
            </div>

            {/* Navegación Tabs (Tu diseño original) */}
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8 overflow-x-auto">
                    {['in_progress', 'pending', 'completed'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setCurrentStatus(status)}
                            className={`
                                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm capitalize flex items-center gap-2 transition-colors
                                ${currentStatus === status
                                ? 'border-ocean-500 text-ocean-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                            `}
                        >
                            {status === 'in_progress' ? 'En Progreso' : status === 'pending' ? 'Pendientes' : 'Completadas'}
                            <span className={`py-0.5 px-2.5 rounded-full text-xs font-medium transition-colors ${
                                currentStatus === status ? 'bg-ocean-100 text-ocean-600' : 'bg-gray-100 text-gray-900'
                            }`}>
                                {stats[status as keyof typeof stats] || 0}
                            </span>
                        </button>
                    ))}
                </nav>
            </div>

            {/* Lista de Cards */}
            <div className="space-y-6">
                {filteredCleanings.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg border border-dashed border-gray-300">
                        <CalendarDays className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No hay limpiezas</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            No tienes tareas en esta categoría por el momento.
                        </p>
                    </div>
                ) : (
                    filteredCleanings.map((cleaning) => (
                        // Asumiendo que este componente ya lo tienes y funciona
                        <CleanerCleaningCard key={cleaning.id} cleaning={cleaning} />
                    ))
                )}
            </div>
        </div>
    )
}

// Subcomponente StatCard (Tu diseño original)
function StatCard({ title, value, icon, color, active, onClick }: any) {
    return (
        <button
            onClick={onClick}
            className={`w-full bg-white overflow-hidden shadow rounded-lg p-5 text-left transition-all ring-2 ${active ? 'ring-ocean-500 ring-offset-2' : 'ring-transparent hover:shadow-md'}`}
        >
            <div className="flex items-center">
                <div className={`flex-shrink-0 rounded-md ${color} p-3 transition-transform ${active ? 'scale-110' : ''}`}>
                    {icon}
                </div>
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