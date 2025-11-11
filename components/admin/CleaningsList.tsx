'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Calendar, Clock, MapPin, User, Edit, Trash2, CheckCircle, XCircle, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react'

interface Cleaner {
    id: string
    full_name: string
    email: string
    phone?: string
}

interface Cleaning {
    id: string
    client_id: string
    address: string
    total_steps: number
    current_step: number
    scheduled_date: string
    start_time: string
    end_time: string
    status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
    notes?: string
    created_at: string
    updated_at: string
    // Datos relacionados (de la view o JOIN)
    client_name: string
    client_phone: string
    client_email: string
    assigned_cleaners: Cleaner[]
}

interface CleaningsListProps {
    cleanings: Cleaning[]
    cleaners: Cleaner[]
}

export default function CleaningsList({ cleanings, cleaners }: CleaningsListProps) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState<string | null>(null)
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
    const [expandedCleaning, setExpandedCleaning] = useState<string | null>(null)
    const [editingCleaning, setEditingCleaning] = useState<string | null>(null)
    const [editData, setEditData] = useState<any>({})

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-700 border-green-200'
            case 'in_progress':
                return 'bg-blue-100 text-blue-700 border-blue-200'
            case 'pending':
                return 'bg-yellow-100 text-yellow-700 border-yellow-200'
            case 'cancelled':
                return 'bg-red-100 text-red-700 border-red-200'
            default:
                return 'bg-gray-100 text-gray-700 border-gray-200'
        }
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'completed':
                return <CheckCircle className="w-4 h-4" />
            case 'in_progress':
                return <Clock className="w-4 h-4" />
            case 'pending':
                return <AlertCircle className="w-4 h-4" />
            case 'cancelled':
                return <XCircle className="w-4 h-4" />
            default:
                return null
        }
    }

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'completed':
                return 'Completada'
            case 'in_progress':
                return 'En Progreso'
            case 'pending':
                return 'Pendiente'
            case 'cancelled':
                return 'Cancelada'
            default:
                return status
        }
    }

    const handleEdit = (cleaning: Cleaning) => {
        setEditingCleaning(cleaning.id)
        setEditData({
            cleaner_ids: cleaning.assigned_cleaners?.map(c => c.id) || [],
            scheduled_date: cleaning.scheduled_date,
            start_time: cleaning.start_time,
            end_time: cleaning.end_time,
            status: cleaning.status,
            current_step: cleaning.current_step,
            notes: cleaning.notes || ''
        })
    }

    const toggleCleanerSelection = (cleanerId: string) => {
        setEditData((prev: any) => {
            const cleanerIds = prev.cleaner_ids || []
            if (cleanerIds.includes(cleanerId)) {
                return { ...prev, cleaner_ids: cleanerIds.filter((id: string) => id !== cleanerId) }
            } else {
                return { ...prev, cleaner_ids: [...cleanerIds, cleanerId] }
            }
        })
    }

    const handleSaveEdit = async (cleaningId: string) => {
        setIsLoading(cleaningId)
        setMessage(null)

        try {
            const response = await fetch('/api/cleanings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: cleaningId,
                    ...editData,
                    current_step: parseInt(editData.current_step)
                })
            })

            const data = await response.json()

            if (!response.ok) throw new Error(data.error || 'Error al actualizar limpieza')

            setMessage({ type: 'success', text: 'Limpieza actualizada exitosamente' })
            setEditingCleaning(null)
            router.refresh()
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message })
        } finally {
            setIsLoading(null)
        }
    }

    const handleDelete = async (cleaningId: string, address: string) => {
        if (!confirm(`¿Estás seguro de eliminar la limpieza en ${address}?`)) {
            return
        }

        setIsLoading(cleaningId)
        setMessage(null)

        try {
            const response = await fetch(`/api/cleanings?id=${cleaningId}`, {
                method: 'DELETE'
            })

            if (!response.ok) throw new Error('Error al eliminar limpieza')

            setMessage({ type: 'success', text: 'Limpieza eliminada exitosamente' })
            router.refresh()
        } catch (error) {
            setMessage({ type: 'error', text: 'Error al eliminar la limpieza' })
        } finally {
            setIsLoading(null)
        }
    }

    return (
        <div>
            {message && (
                <div className={`mb-4 px-4 py-3 rounded-lg flex items-start gap-2 ${
                    message.type === 'success'
                        ? 'bg-green-50 text-green-700 border border-green-200'
                        : 'bg-red-50 text-red-700 border border-red-200'
                }`}>
                    {message.type === 'success' ? (
                        <CheckCircle className="w-5 h-5 flex-shrink-0" />
                    ) : (
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    )}
                    <span className="text-sm">{message.text}</span>
                </div>
            )}

            <div className="divide-y divide-gray-200">
                {cleanings.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        No hay limpiezas programadas
                    </div>
                ) : (
                    cleanings.map((cleaning) => (
                        <div
                            key={cleaning.id}
                            className="p-6 hover:bg-gray-50 transition-colors"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="font-semibold text-gray-900 text-lg">
                                            {cleaning.address}
                                        </h3>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${getStatusColor(cleaning.status)}`}>
                                            {getStatusIcon(cleaning.status)}
                                            {getStatusLabel(cleaning.status)}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <User className="w-4 h-4 text-gray-400" />
                                            Cliente: {cleaning.client_name || 'No disponible'}
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <User className="w-4 h-4 text-gray-400" />
                                            Cleaners: {
                                            cleaning.assigned_cleaners && cleaning.assigned_cleaners.length > 0
                                                ? cleaning.assigned_cleaners.map(c => c.full_name).join(', ')
                                                : 'Sin asignar'
                                        }
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Calendar className="w-4 h-4 text-gray-400" />
                                            {new Date(cleaning.scheduled_date + 'T00:00:00').toLocaleDateString('es-CL')}
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Clock className="w-4 h-4 text-gray-400" />
                                            {cleaning.start_time} - {cleaning.end_time}
                                        </div>
                                    </div>

                                    {cleaning.status !== 'pending' && cleaning.status !== 'cancelled' && (
                                        <div className="mt-3">
                                            <div className="flex items-center justify-between text-sm mb-1">
                                                <span className="text-gray-600">Progreso</span>
                                                <span className="font-medium text-blue-600">
                                                    {cleaning.current_step}/{cleaning.total_steps} pasos
                                                </span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-blue-600 h-2 rounded-full transition-all"
                                                    style={{
                                                        width: `${(cleaning.current_step / cleaning.total_steps) * 100}%`
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setExpandedCleaning(expandedCleaning === cleaning.id ? null : cleaning.id)}
                                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                        disabled={isLoading === cleaning.id}
                                    >
                                        {expandedCleaning === cleaning.id ? (
                                            <ChevronUp className="w-5 h-5 text-gray-600" />
                                        ) : (
                                            <ChevronDown className="w-5 h-5 text-gray-600" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {expandedCleaning === cleaning.id && (
                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    {editingCleaning === cleaning.id ? (
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Cleaners
                                                    </label>
                                                    <div className="border border-gray-300 rounded-lg p-3 max-h-40 overflow-y-auto bg-gray-50">
                                                        {cleaners.length === 0 ? (
                                                            <p className="text-sm text-gray-500 text-center py-2">
                                                                No hay cleaners disponibles
                                                            </p>
                                                        ) : (
                                                            <div className="space-y-2">
                                                                {cleaners.map(cleaner => (
                                                                    <label
                                                                        key={cleaner.id}
                                                                        className={`flex items-center gap-2 p-2 rounded hover:bg-white cursor-pointer transition-colors ${
                                                                            editData.cleaner_ids?.includes(cleaner.id) ? 'bg-blue-50' : ''
                                                                        }`}
                                                                    >
                                                                        <input
                                                                            type="checkbox"
                                                                            checked={editData.cleaner_ids?.includes(cleaner.id) || false}
                                                                            onChange={() => toggleCleanerSelection(cleaner.id)}
                                                                            className="w-4 h-4 text-blue-600"
                                                                        />
                                                                        <span className="text-sm text-gray-900">
                                                                            {cleaner.full_name}
                                                                        </span>
                                                                    </label>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Estado
                                                    </label>
                                                    <select
                                                        value={editData.status}
                                                        onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                    >
                                                        <option value="pending">Pendiente</option>
                                                        <option value="in_progress">En Progreso</option>
                                                        <option value="completed">Completada</option>
                                                        <option value="cancelled">Cancelada</option>
                                                    </select>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Paso actual
                                                    </label>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        max={cleaning.total_steps}
                                                        value={editData.current_step}
                                                        onChange={(e) => setEditData({ ...editData, current_step: e.target.value })}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                    />
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        De 0 a {cleaning.total_steps}
                                                    </p>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Fecha
                                                    </label>
                                                    <input
                                                        type="date"
                                                        value={editData.scheduled_date}
                                                        onChange={(e) => setEditData({ ...editData, scheduled_date: e.target.value })}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </div>

                                                <div className="grid grid-cols-2 gap-2">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                            Inicio
                                                        </label>
                                                        <input
                                                            type="time"
                                                            value={editData.start_time}
                                                            onChange={(e) => setEditData({ ...editData, start_time: e.target.value })}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                            Fin
                                                        </label>
                                                        <input
                                                            type="time"
                                                            value={editData.end_time}
                                                            onChange={(e) => setEditData({ ...editData, end_time: e.target.value })}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Notas
                                                </label>
                                                <textarea
                                                    value={editData.notes}
                                                    onChange={(e) => setEditData({ ...editData, notes: e.target.value })}
                                                    rows={2}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
                                                />
                                            </div>

                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleSaveEdit(cleaning.id)}
                                                    disabled={isLoading === cleaning.id}
                                                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {isLoading === cleaning.id ? 'Guardando...' : 'Guardar Cambios'}
                                                </button>
                                                <button
                                                    onClick={() => setEditingCleaning(null)}
                                                    disabled={isLoading === cleaning.id}
                                                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                                                >
                                                    Cancelar
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 space-y-2">
                                                <div className="flex items-center gap-2 text-sm">
                                                    <span className="font-medium text-gray-700">Cliente:</span>
                                                    <span className="text-gray-600">
                                                        {cleaning.client_name} ({cleaning.client_email})
                                                    </span>
                                                </div>
                                                {cleaning.client_phone && (
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <span className="font-medium text-gray-700">Teléfono:</span>
                                                        <span className="text-gray-600">{cleaning.client_phone}</span>
                                                    </div>
                                                )}
                                            </div>

                                            {cleaning.notes && (
                                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                                    <p className="text-sm text-blue-900">
                                                        <strong>Notas:</strong> {cleaning.notes}
                                                    </p>
                                                </div>
                                            )}

                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleEdit(cleaning)}
                                                    className="flex-1 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg font-medium hover:bg-blue-100 transition-colors flex items-center justify-center gap-2"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                    Editar
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(cleaning.id, cleaning.address)}
                                                    disabled={isLoading === cleaning.id}
                                                    className="flex-1 px-4 py-2 bg-red-50 text-red-700 rounded-lg font-medium hover:bg-red-100 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                    Eliminar
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {isLoading === cleaning.id && (
                                <div className="mt-3 flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}