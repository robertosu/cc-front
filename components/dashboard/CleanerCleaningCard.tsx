// components/dashboard/CleanerCleaningCard.tsx
'use client'

import { useState } from 'react'
import {
    Calendar,
    CheckCircle,
    ChevronLeft,
    ChevronRight,
    Clock,
    MapPin,
    Phone,
    User,
    Users,
    AlertTriangle,
    Check,
    Play
} from 'lucide-react'
import CleaningProgressBar from './CleaningProgressBar'
import { useRouter } from 'next/navigation'
import type { Cleaning } from '@/types'

interface CleanerCleaningCardProps {
    cleaning: Cleaning
}

export default function CleanerCleaningCard({ cleaning }: CleanerCleaningCardProps) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Estados derivados
    const canStart = cleaning.status === 'pending'
    const isInProgress = cleaning.status === 'in_progress'
    const isCompleted = cleaning.status === 'completed'
    // Validación de Pasos
    const stepsCompleted = cleaning.current_step === cleaning.total_steps

    // Helpers de visualización
    const cleanersList = cleaning.assigned_cleaners?.filter(ac => ac.cleaner).map(ac => ac.cleaner!) || []

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

        // Si completa los pasos, la API automáticamente lo podría marcar completed,
        // pero preferimos dejarlo en in_progress hasta que el usuario confirme,
        // a menos que sea el último paso.
        // Aquí solo actualizamos el step y mantenemos 'in_progress'
        updateStatus('in_progress', nextStep)
    }


    return (
        <div className={`bg-white rounded-xl shadow border transition-all ${isCompleted ? 'border-green-200 bg-green-50/30' : 'border-gray-100'}`}>
            <div className="p-6">
                {/* Header sin emojis, con badges de color */}
                {/* ... (código del header igual) ... */}

                {/* ... Detalles ... */}

                {/* Área de Acciones */}
                <div className="pt-4 border-t border-gray-100">
                    <CleaningProgressBar
                        currentStep={cleaning.current_step}
                        totalSteps={cleaning.total_steps}
                        status={cleaning.status}
                    />

                    {/* ... Mensaje de error ... */}

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
                                        <ChevronLeft className="w-4 h-4" />
                                        Anterior
                                    </button>
                                    <button
                                        onClick={() => handleStepChange(1)}
                                        disabled={isLoading || stepsCompleted}
                                        className="flex-1 bg-ocean-100 text-ocean-700 py-2 rounded-lg font-medium hover:bg-ocean-200 disabled:opacity-50 flex items-center justify-center gap-1"
                                    >
                                        Siguiente
                                        <ChevronRight className="w-4 h-4" />
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