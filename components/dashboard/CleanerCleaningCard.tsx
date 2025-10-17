'use client'

import { useState } from 'react'
import { Calendar, Clock, MapPin, Phone, User, ChevronRight, ChevronLeft, CheckCircle } from 'lucide-react'
import CleaningProgressBar from './CleaningProgressBar'

interface Cleaning {
    id: string
    scheduled_date: string
    start_time: string
    end_time: string
    status: string
    current_sector: number
    notes?: string
    house: {
        address: string
        sectors_count: number
        notes?: string
        client: {
            full_name: string
            phone?: string
        }
    }
}

export default function CleanerCleaningCard({ cleaning }: { cleaning: Cleaning }) {
    const [currentSector, setCurrentSector] = useState(cleaning.current_sector)
    const [status, setStatus] = useState(cleaning.status)
    const [isLoading, setIsLoading] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

    const canStart = status === 'pending'
    const canUpdate = status === 'in_progress'
    const isCompleted = status === 'completed'

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
                    current_sector: 0
                })
            })

            if (!response.ok) throw new Error('Error al iniciar')

            setStatus('in_progress')
            setMessage({ type: 'success', text: '¡Limpieza iniciada!' })
        } catch (error) {
            setMessage({ type: 'error', text: 'Error al iniciar la limpieza' })
        } finally {
            setIsLoading(false)
        }
    }

    const handleSectorUpdate = async (newSector: number) => {
        if (newSector < 0 || newSector > cleaning.house.sectors_count) return

        setIsLoading(true)
        setMessage(null)

        try {
            const response = await fetch('/api/cleanings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: cleaning.id,
                    current_sector: newSector,
                    status: newSector === cleaning.house.sectors_count ? 'completed' : 'in_progress'
                })
            })

            if (!response.ok) throw new Error('Error al actualizar')

            setCurrentSector(newSector)

            if (newSector === cleaning.house.sectors_count) {
                setStatus('completed')
                setMessage({ type: 'success', text: '¡Limpieza completada! 🎉' })
            } else {
                setMessage({ type: 'success', text: `Sector ${newSector} completado` })
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Error al actualizar el progreso' })
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
                    current_sector: cleaning.house.sectors_count
                })
            })

            if (!response.ok) throw new Error('Error al completar')

            setStatus('completed')
            setCurrentSector(cleaning.house.sectors_count)
            setMessage({ type: 'success', text: '¡Limpieza completada! 🎉' })
        } catch (error) {
            setMessage({ type: 'error', text: 'Error al completar la limpieza' })
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
                            <p className="font-medium text-gray-900">{cleaning.house.address}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <User className="w-5 h-5 text-gray-400 flex-shrink-0 mt-1" />
                        <div>
                            <p className="text-sm text-gray-600">Cliente</p>
                            <p className="font-medium text-gray-900">{cleaning.house.client.full_name}</p>
                            {cleaning.house.client.phone && (
                                <a
                                    href={`tel:${cleaning.house.client.phone}`}
                                    className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 mt-1"
                                >
                                    <Phone className="w-3 h-3" />
                                    {cleaning.house.client.phone}
                                </a>
                            )}
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <Calendar className="w-5 h-5 text-gray-400 flex-shrink-0 mt-1" />
                        <div>
                            <p className="text-sm text-gray-600">Fecha</p>
                            <p className="font-medium text-gray-900">
                                {new Date(cleaning.scheduled_date).toLocaleDateString('es-CL', {
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

                    {cleaning.house.notes && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                            <p className="text-sm text-blue-900">
                                <strong>Notas:</strong> {cleaning.house.notes}
                            </p>
                        </div>
                    )}
                </div>

                {/* Controles y progreso */}
                <div className="space-y-6">
                    <CleaningProgressBar
                        currentSector={currentSector}
                        totalSectors={cleaning.house.sectors_count}
                        status={status as any}
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
                                        onClick={() => handleSectorUpdate(currentSector - 1)}
                                        disabled={isLoading || currentSector === 0}
                                        className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        <ChevronLeft className="w-5 h-5" />
                                        Anterior
                                    </button>

                                    <button
                                        onClick={() => handleSectorUpdate(currentSector + 1)}
                                        disabled={isLoading || currentSector >= cleaning.house.sectors_count}
                                        className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        Siguiente
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                </div>

                                {currentSector < cleaning.house.sectors_count && (
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

/*
📝 CARACTERÍSTICAS:
✅ Actualización de progreso por sector
✅ Botones para avanzar/retroceder
✅ Inicio de limpieza
✅ Completar limpieza
✅ Feedback visual inmediato
✅ Validaciones de estado
✅ Información del cliente
*/