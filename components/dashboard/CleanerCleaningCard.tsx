'use client'

import { useState } from 'react'
import { Calendar, CheckCircle, ChevronLeft, ChevronRight, Clock, MapPin, Phone, Users, AlertTriangle, Play, Check } from 'lucide-react'
import CleaningProgressBar from './CleaningProgressBar'
import { useRouter } from 'next/navigation'
import type { Cleaning, Cleaner } from '@/types'

interface CleanerCleaningCardProps {
    cleaning: Cleaning
}

export default function CleanerCleaningCard({ cleaning }: CleanerCleaningCardProps) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Estados
    const canStart = cleaning.status === 'pending'
    const isInProgress = cleaning.status === 'in_progress'
    const isCompleted = cleaning.status === 'completed'
    const stepsCompleted = cleaning.current_step === cleaning.total_steps

    // Helper seguro para obtener cleaners (soporta vista y realtime)
    const cleanersList = cleaning.assigned_cleaners?.map((ac: any) => {
        if (ac.cleaner) return ac.cleaner as Cleaner; // Anidado
        if (ac.full_name) return { id: ac.id, full_name: ac.full_name, email: ac.email || '' } as Cleaner; // Plano
        return null;
    }).filter(Boolean) as Cleaner[] || []

    const updateStatus = async (newStatus: string, newStep?: number) => {
        setIsLoading(true)
        setError(null)
        try {
            const body: any = { id: cleaning.id, status: newStatus }
            if (newStep !== undefined) body.current_step = newStep

            const res = await fetch('/api/cleanings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            })

            const data = await res.json()
            if (!res.ok) throw new Error(data.error || 'Error al actualizar')
            router.refresh()
        } catch (err: any) {
            setError(err.message)
        } finally {
            setIsLoading(false)
        }
    }

    const handleStepChange = (delta: number) => {
        const nextStep = cleaning.current_step + delta
        if (nextStep < 0 || nextStep > cleaning.total_steps) return
        updateStatus('in_progress', nextStep)
    }

    return (
        <div className={`bg-white rounded-xl shadow border transition-all ${isCompleted ? 'border-green-200 bg-green-50/30' : 'border-gray-100'}`}>
            <div className="p-6">
                {/* Header: Dirección y Cliente */}
                <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0" />
                            {/* Fallback de seguridad si falta la dirección */}
                            {cleaning.address || 'Sin dirección registrada'}
                        </h3>
                        <p className="text-sm text-gray-500 ml-7">
                            {cleaning.client_name || 'Cliente sin nombre'}
                        </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide whitespace-nowrap ml-2 ${
                        isCompleted ? 'bg-green-100 text-green-700' :
                            isInProgress ? 'bg-ocean-100 text-ocean-700' :
                                'bg-yellow-100 text-yellow-700'
                    }`}>
                        {isCompleted ? 'Completada' : isInProgress ? 'En Curso' : 'Pendiente'}
                    </span>
                </div>

                {/* Detalles: Fechas y Contacto */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-6 ml-1">
                    <div className="space-y-3 text-gray-600">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="font-medium">
                                {cleaning.scheduled_date
                                    ? new Date(cleaning.scheduled_date + 'T00:00:00').toLocaleDateString('es-CL', { dateStyle: 'long' })
                                    : 'Fecha pendiente'}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span>{cleaning.start_time || '--:--'} - {cleaning.end_time || '--:--'}</span>
                        </div>
                    </div>

                    <div className="space-y-3 text-gray-600">
                        {cleaning.client_phone && (
                            <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-gray-400" />
                                <a href={`tel:${cleaning.client_phone}`} className="hover:text-ocean-600 underline">{cleaning.client_phone}</a>
                            </div>
                        )}
                        {cleanersList.length > 0 && (
                            <div className="flex items-center gap-2">
                                <Users className="w-4 h-4 text-gray-400" />
                                <span>{cleanersList.map(c => c.full_name.split(' ')[0]).join(', ')}</span>
                            </div>
                        )}
                    </div>
                </div>

                {cleaning.notes && (
                    <div className="mb-6 p-3 bg-yellow-50 text-yellow-800 text-sm rounded-md border border-yellow-100">
                        <strong>Nota:</strong> {cleaning.notes}
                    </div>
                )}

                {/* Área de Acción */}
                <div className="pt-4 border-t border-gray-100">
                    <CleaningProgressBar
                        currentStep={cleaning.current_step}
                        totalSteps={cleaning.total_steps}
                        status={cleaning.status}
                    />

                    {error && (
                        <div className="mt-3 p-2 bg-red-50 text-red-600 text-xs rounded flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4" /> {error}
                        </div>
                    )}

                    <div className="mt-6 flex flex-col sm:flex-row gap-3">
                        {canStart && (
                            <button
                                onClick={() => updateStatus('in_progress', 0)}
                                disabled={isLoading}
                                className="w-full bg-ocean-600 text-white py-2.5 rounded-lg font-medium hover:bg-ocean-700 transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isLoading ? 'Iniciando...' : <><Play className="w-4 h-4" /> Iniciar Trabajo</>}
                            </button>
                        )}

                        {isInProgress && (
                            <>
                                <div className="flex flex-1 gap-2">
                                    <button
                                        onClick={() => handleStepChange(-1)}
                                        disabled={isLoading || cleaning.current_step === 0}
                                        className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-200 disabled:opacity-50 flex items-center justify-center gap-1"
                                    >
                                        <ChevronLeft className="w-4 h-4" /> Anterior
                                    </button>
                                    <button
                                        onClick={() => handleStepChange(1)}
                                        disabled={isLoading || stepsCompleted}
                                        className="flex-1 bg-ocean-100 text-ocean-700 py-2 rounded-lg font-medium hover:bg-ocean-200 disabled:opacity-50 flex items-center justify-center gap-1"
                                    >
                                        Siguiente <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>

                                <button
                                    onClick={() => updateStatus('completed')}
                                    disabled={isLoading || !stepsCompleted}
                                    className={`flex-[2] py-2.5 rounded-lg font-medium transition-all shadow-sm flex items-center justify-center gap-2
                                        ${stepsCompleted
                                        ? 'bg-green-600 text-white hover:bg-green-700'
                                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'}
                                    `}
                                >
                                    {isLoading ? 'Guardando...' : stepsCompleted ? <><Check className="w-4 h-4" /> Finalizar Tarea</> : 'Completa los pasos'}
                                </button>
                            </>
                        )}

                        {isCompleted && (
                            <div className="w-full py-2 flex items-center justify-center gap-2 text-green-700 font-medium bg-green-50 rounded-lg">
                                <CheckCircle className="w-5 h-5" />
                                Trabajo finalizado
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}