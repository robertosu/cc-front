// components/dashboard/CleanerCleaningCard.tsx
'use client'

import { useEffect, useState } from 'react'
import { Calendar, CheckCircle, ChevronLeft, ChevronRight, Clock, MapPin, Phone, User, Users } from 'lucide-react'
import CleaningProgressBar from './CleaningProgressBar'
import { useRouter } from 'next/navigation'
import type { Cleaning } from '@/types'

interface CleanerCleaningCardProps {
    cleaning: Cleaning
}

export default function CleanerCleaningCard({ cleaning: initialCleaning }: CleanerCleaningCardProps) {
    const [cleaning, setCleaning] = useState<Cleaning>(initialCleaning)
    const [isLoading, setIsLoading] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

    // ESTADO NUEVO: Para guardar la fecha formateada
    const [formattedDate, setFormattedDate] = useState<string>('')

    const router = useRouter()

    // Sincronizar cuando cleaning cambia desde el padre y formatear fecha
    useEffect(() => {
        console.log('🔵 Card - Cleaning updated from parent:', initialCleaning.current_step)
        setCleaning(initialCleaning)

        // LÓGICA DE FECHA MOVIDA AQUÍ (Solo corre en el cliente)
        if (initialCleaning.scheduled_date) {
            const date = new Date(initialCleaning.scheduled_date + 'T00:00:00')
            const dateString = date.toLocaleDateString('es-CL', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            })
            // Capitalizar la primera letra (opcional, estilo estético)
            setFormattedDate(dateString.charAt(0).toUpperCase() + dateString.slice(1))
        }
    }, [initialCleaning])

    const canStart = cleaning.status === 'pending'
    const canUpdate = cleaning.status === 'in_progress'
    const isCompleted = cleaning.status === 'completed'

    const getValidCleaners = () => {
        return cleaning.assigned_cleaners?.filter(ac => ac.cleaner !== null) || []
    }

    const validCleaners = getValidCleaners()
    const cleanersList = validCleaners.map(ac => ac.cleaner!)

    // ... (Mantén tus funciones handleStart, handleStepUpdate, handleComplete igual que antes) ...
    const handleStart = async () => { /* ... */ }
    const handleStepUpdate = async (newStep: number) => { /* ... */ }
    const handleComplete = async () => { /* ... */ }

    return (
        <div className={`bg-white rounded-xl shadow-lg p-6 ${
            isCompleted ? 'opacity-75' : ''
        }`}>
            {/* ... (Header y alertas igual que antes) ... */}

            <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    {/* ... (Status, MapPin, User, Users igual que antes) ... */}

                    {/* SECCIÓN FECHA CORREGIDA */}
                    <div className="flex items-start gap-3">
                        <Calendar className="w-5 h-5 text-gray-400 flex-shrink-0 mt-1" />
                        <div>
                            <p className="text-sm text-gray-600">Fecha</p>
                            <p className="font-medium text-gray-900 min-h-[1.5rem]">
                                {/* Renderizamos el estado. Si está vacío (carga inicial),
                                    mostramos la fecha cruda o un skeleton para evitar saltos */}
                                {formattedDate || cleaning.scheduled_date}
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

                    {cleaning.notes && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                            <p className="text-sm text-blue-900">
                                <strong>Notas:</strong> {cleaning.notes}
                            </p>
                        </div>
                    )}
                </div>

                {/* Controles y progreso */}
                <div className="space-y-6">
                    <CleaningProgressBar
                        currentStep={cleaning.current_step}
                        totalSteps={cleaning.total_steps}
                        status={cleaning.status}
                    />

                    {/* Botones de acción */}
                    <div className="space-y-3">
                        {canStart && (
                            <button
                                onClick={handleStart}
                                disabled={isLoading}
                                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isLoading ? 'Iniciando...' : 'Iniciar Limpieza'}
                            </button>
                        )}

                        {canUpdate && !isCompleted && (
                            <>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => handleStepUpdate(cleaning.current_step - 1)}
                                        disabled={isLoading || cleaning.current_step === 0}
                                        className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        <ChevronLeft className="w-5 h-5" />
                                        Anterior
                                    </button>

                                    <button
                                        onClick={() => handleStepUpdate(cleaning.current_step + 1)}
                                        disabled={isLoading || cleaning.current_step >= cleaning.total_steps}
                                        className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        Siguiente
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                </div>

                                {cleaning.current_step < cleaning.total_steps && (
                                    <button
                                        onClick={handleComplete}
                                        disabled={isLoading}
                                        className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        <CheckCircle className="w-5 h-5" />
                                        Marcar como Completada
                                    </button>
                                )}
                            </>
                        )}

                        {isCompleted && (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                                <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-2" />
                                <p className="text-green-900 font-semibold">
                                    ¡Limpieza Completada!
                                </p>
                                <p className="text-green-700 text-sm mt-1">
                                    Excelente trabajo
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}