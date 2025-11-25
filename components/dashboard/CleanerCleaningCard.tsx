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
    const router = useRouter()

    // Sincronizar cuando cleaning cambia desde el padre (por el hook de realtime)
    useEffect(() => {
        console.log('🔵 Card - Cleaning updated from parent:', initialCleaning.current_step)
        setCleaning(initialCleaning)
    }, [initialCleaning])

    const canStart = cleaning.status === 'pending'
    const canUpdate = cleaning.status === 'in_progress'
    const isCompleted = cleaning.status === 'completed'

    // 🔥 Helper para obtener cleaners válidos
    const getValidCleaners = () => {
        return cleaning.assigned_cleaners?.filter(ac => ac.cleaner !== null) || []
    }

    const validCleaners = getValidCleaners()
    const cleanersList = validCleaners.map(ac => ac.cleaner!)

    const handleStart = async () => {
        setIsLoading(true)
        setMessage(null)

        try {
            const response = await fetch('/api/cleanings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: cleaning.id,
                    status: 'in_progress',
                    current_step: 0
                })
            })

            const data = await response.json()

            if (!response.ok) throw new Error(data.error || 'Error al iniciar')

            setMessage({ type: 'success', text: '¡Limpieza iniciada!' })
            router.refresh()
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || 'Error al iniciar la limpieza' })
        } finally {
            setIsLoading(false)
        }
    }

    const handleStepUpdate = async (newStep: number) => {
        if (newStep < 0 || newStep > cleaning.total_steps) return

        setIsLoading(true)
        setMessage(null)

        try {
            const response = await fetch('/api/cleanings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: cleaning.id,
                    current_step: newStep,
                    status: newStep === cleaning.total_steps ? 'completed' : 'in_progress'
                })
            })

            const data = await response.json()

            if (!response.ok) throw new Error(data.error || 'Error al actualizar')

            if (newStep === cleaning.total_steps) {
                setMessage({ type: 'success', text: '¡Limpieza completada! 🎉' })
            } else {
                setMessage({ type: 'success', text: `Paso ${newStep} completado` })
            }

            router.refresh()
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || 'Error al actualizar el progreso' })
        } finally {
            setIsLoading(false)
        }
    }

    const handleComplete = async () => {
        setIsLoading(true)
        setMessage(null)

        try {
            const response = await fetch('/api/cleanings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: cleaning.id,
                    status: 'completed',
                    current_step: cleaning.total_steps
                })
            })

            const data = await response.json()

            if (!response.ok) throw new Error(data.error || 'Error al completar')

            setMessage({ type: 'success', text: '¡Limpieza completada! 🎉' })
            router.refresh()
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || 'Error al completar la limpieza' })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className={`bg-white rounded-xl shadow-lg p-6 ${
            isCompleted ? 'opacity-75' : ''
        }`}>
            {/* Mensaje de feedback */}
            {message && (
                <div className={`mb-4 px-4 py-3 rounded-lg ${
                    message.type === 'success'
                        ? 'bg-green-50 text-green-700 border border-green-200'
                        : 'bg-red-50 text-red-700 border border-red-200'
                }`}>
                    {message.text}
                </div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
                {/* Información del trabajo */}
                <div className="space-y-4">
                    <div>
                        <div className="flex items-start justify-between mb-4">
                            <h3 className="text-xl font-bold text-gray-900">
                                Limpieza Programada
                            </h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                isCompleted ? 'bg-green-100 text-green-700' :
                                    canUpdate ? 'bg-blue-100 text-blue-700' :
                                        'bg-yellow-100 text-yellow-700'
                            }`}>
                {isCompleted ? 'Completada' : canUpdate ? 'En Progreso' : 'Pendiente'}
              </span>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0 mt-1" />
                        <div>
                            <p className="text-sm text-gray-600">Dirección</p>
                            <p className="font-medium text-gray-900">{cleaning.address}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <User className="w-5 h-5 text-gray-400 flex-shrink-0 mt-1" />
                        <div>
                            <p className="text-sm text-gray-600">Cliente</p>
                            <p className="font-medium text-gray-900">{cleaning.client_name}</p>
                            {cleaning.client_phone && (
                                <a
                                    href={`tel:${cleaning.client_phone}`}
                                    className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 mt-1"
                                >
                                    <Phone className="w-3 h-3" />
                                    {cleaning.client_phone}
                                </a>
                            )}
                        </div>
                    </div>

                    {cleanersList.length > 1 && (
                        <div className="flex items-start gap-3">
                            <Users className="w-5 h-5 text-gray-400 flex-shrink-0 mt-1" />
                            <div>
                                <p className="text-sm text-gray-600">Equipo</p>
                                <p className="font-medium text-gray-900">
                                    {cleanersList.map(c => c.full_name).join(', ')}
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