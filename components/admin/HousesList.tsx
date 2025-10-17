'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MapPin, User, Hash, Edit, Trash2, ChevronDown, ChevronUp, Calendar, CheckCircle, Clock } from 'lucide-react'

interface House {
    id: string
    address: string
    sectors_count: number
    notes?: string
    created_at: string
    client: {
        id: string
        full_name: string
        email: string
        phone?: string
    }
    cleanings?: Array<{
        id: string
        status: string
    }>
}

export default function HousesList({ houses }: { houses: House[] }) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState<string | null>(null)
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
    const [expandedHouse, setExpandedHouse] = useState<string | null>(null)
    const [editingHouse, setEditingHouse] = useState<string | null>(null)
    const [editData, setEditData] = useState<any>({})

    const getCleaningsStats = (cleanings?: Array<{ status: string }>) => {
        if (!cleanings) return { total: 0, completed: 0, pending: 0, inProgress: 0 }

        return {
            total: cleanings.length,
            completed: cleanings.filter(c => c.status === 'completed').length,
            pending: cleanings.filter(c => c.status === 'pending').length,
            inProgress: cleanings.filter(c => c.status === 'in_progress').length
        }
    }

    const handleEdit = (house: House) => {
        setEditingHouse(house.id)
        setEditData({
            address: house.address,
            sectors_count: house.sectors_count,
            notes: house.notes || ''
        })
    }

    const handleSaveEdit = async (houseId: string) => {
        setIsLoading(houseId)
        setMessage(null)

        try {
            const response = await fetch('/api/houses', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: houseId, ...editData })
            })

            if (!response.ok) throw new Error('Error al actualizar casa')

            setMessage({ type: 'success', text: 'Casa actualizada exitosamente' })
            setEditingHouse(null)
            router.refresh()
        } catch (error) {
            setMessage({ type: 'error', text: 'Error al actualizar la casa' })
        } finally {
            setIsLoading(null)
        }
    }

    const handleDelete = async (houseId: string, address: string) => {
        if (!confirm(`¿Estás seguro de eliminar la casa en ${address}? Esto eliminará también todas las limpiezas asociadas.`)) {
            return
        }

        setIsLoading(houseId)
        setMessage(null)

        try {
            const response = await fetch(`/api/houses?id=${houseId}`, {
                method: 'DELETE'
            })

            if (!response.ok) throw new Error('Error al eliminar casa')

            setMessage({ type: 'success', text: 'Casa eliminada exitosamente' })
            router.refresh()
        } catch (error) {
            setMessage({ type: 'error', text: 'Error al eliminar la casa' })
        } finally {
            setIsLoading(null)
        }
    }

    return (
        <div>
            {message && (
                <div className={`mb-4 px-4 py-3 rounded-lg ${
                    message.type === 'success'
                        ? 'bg-green-50 text-green-700 border border-green-200'
                        : 'bg-red-50 text-red-700 border border-red-200'
                }`}>
                    {message.text}
                </div>
            )}

            <div className="divide-y divide-gray-200">
                {houses.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        No hay casas registradas
                    </div>
                ) : (
                    houses.map((house) => {
                        const stats = getCleaningsStats(house.cleanings)

                        return (
                            <div
                                key={house.id}
                                className="p-6 hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white">
                                                <MapPin className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-900 text-lg">
                                                    {house.address}
                                                </h3>
                                                <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                                                    <Hash className="w-4 h-4" />
                                                    {house.sectors_count} {house.sectors_count === 1 ? 'sector' : 'sectores'}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <User className="w-4 h-4 text-gray-400" />
                                                {house.client.full_name}
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Calendar className="w-4 h-4 text-gray-400" />
                                                Desde {new Date(house.created_at).toLocaleDateString('es-CL')}
                                            </div>
                                        </div>

                                        {/* Estadísticas de limpiezas */}
                                        {stats.total > 0 && (
                                            <div className="flex items-center gap-3 mt-3 flex-wrap">
                                                <div className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium">
                                                    📊 {stats.total} {stats.total === 1 ? 'limpieza' : 'limpiezas'}
                                                </div>
                                                {stats.completed > 0 && (
                                                    <div className="px-3 py-1 bg-green-50 text-green-700 rounded-lg text-sm font-medium flex items-center gap-1">
                                                        <CheckCircle className="w-3 h-3" />
                                                        {stats.completed} completadas
                                                    </div>
                                                )}
                                                {stats.inProgress > 0 && (
                                                    <div className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium flex items-center gap-1">
                                                        <Clock className="w-3 h-3" />
                                                        {stats.inProgress} en progreso
                                                    </div>
                                                )}
                                                {stats.pending > 0 && (
                                                    <div className="px-3 py-1 bg-yellow-50 text-yellow-700 rounded-lg text-sm font-medium">
                                                        ⏳ {stats.pending} pendientes
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => setExpandedHouse(expandedHouse === house.id ? null : house.id)}
                                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                            disabled={isLoading === house.id}
                                        >
                                            {expandedHouse === house.id ? (
                                                <ChevronUp className="w-5 h-5 text-gray-600" />
                                            ) : (
                                                <ChevronDown className="w-5 h-5 text-gray-600" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {expandedHouse === house.id && (
                                    <div className="mt-4 pt-4 border-t border-gray-200">
                                        {editingHouse === house.id ? (
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Dirección
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={editData.address}
                                                        onChange={(e) => setEditData({ ...editData, address: e.target.value })}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Número de Sectores
                                                    </label>
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        max="20"
                                                        value={editData.sectors_count}
                                                        onChange={(e) => setEditData({ ...editData, sectors_count: parseInt(e.target.value) })}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Notas
                                                    </label>
                                                    <textarea
                                                        value={editData.notes}
                                                        onChange={(e) => setEditData({ ...editData, notes: e.target.value })}
                                                        rows={3}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                        placeholder="Instrucciones especiales, acceso, etc."
                                                    />
                                                </div>

                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleSaveEdit(house.id)}
                                                        disabled={isLoading === house.id}
                                                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
                                                    >
                                                        Guardar Cambios
                                                    </button>
                                                    <button
                                                        onClick={() => setEditingHouse(null)}
                                                        disabled={isLoading === house.id}
                                                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                                                    >
                                                        Cancelar
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-3">
                                                {house.notes && (
                                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                                        <p className="text-sm text-blue-900">
                                                            <strong>Notas:</strong> {house.notes}
                                                        </p>
                                                    </div>
                                                )}

                                                <div className="bg-gray-50 rounded-lg p-3">
                                                    <h4 className="text-sm font-medium text-gray-900 mb-2">
                                                        Información del Cliente
                                                    </h4>
                                                    <div className="space-y-1 text-sm text-gray-600">
                                                        <p>📧 {house.client.email}</p>
                                                        {house.client.phone && (
                                                            <p>📞 {house.client.phone}</p>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleEdit(house)}
                                                        className="flex-1 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg font-medium hover:bg-blue-100 transition-colors flex items-center justify-center gap-2"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                        Editar
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(house.id, house.address)}
                                                        disabled={isLoading === house.id}
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

                                {isLoading === house.id && (
                                    <div className="mt-3 flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                                    </div>
                                )}
                            </div>
                        )
                    })
                )}
            </div>
        </div>
    )
}