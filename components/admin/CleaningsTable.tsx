'use client'

import React, { Fragment, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
    AlertCircle,
    ArrowUpDown,
    Calendar,
    CheckCircle,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    ChevronUp,
    Clock,
    Edit,
    MapPin,
    Search,
    Trash2,
    User
} from 'lucide-react'
import MultiSearchableSelect from '@/components/common/MultiSearchableSelect'
import { formatTime } from "@/utils/formatTime"

interface Cleaner {
    id: string
    full_name: string
    email: string
    phone?: string
}

interface Cleaning {
    id: string
    address: string
    total_steps: number
    current_step: number
    scheduled_date: string
    start_time: string
    end_time: string
    status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
    client_name: string
    client_email: string
    assigned_cleaners: Cleaner[]
    notes?: string
}

interface CleaningsTableProps {
    cleanings: Cleaning[]
    cleaners: Cleaner[]
    currentPage: number
    totalPages: number
    totalCount: number
}

interface EditData {
    cleaner_ids: string[]
    scheduled_date: string
    start_time: string
    end_time: string
    status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
    current_step: number | string
    notes: string
}

export default function CleaningsTable({
                                           cleanings,
                                           cleaners,
                                           currentPage,
                                           totalPages,
                                           totalCount
                                       }: CleaningsTableProps) {

    const router = useRouter()
    const searchParams = useSearchParams()
    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '')
    const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || '')
    const [expandedRow, setExpandedRow] = useState<string | null>(null)
    const [editingCleaning, setEditingCleaning] = useState<string | null>(null)
    const [editData, setEditData] = useState<Partial<EditData>>({})
    const [isLoading, setIsLoading] = useState<string | null>(null)
    const [rowMessage, setRowMessage] = useState<{
        cleaningId: string
        type: 'success' | 'error'
        text: string
    } | null>(null)

    const handleSearch = (value: string) => {
        setSearchTerm(value)
        updateUrl({ search: value, page: '1' })
    }

    const handleStatusFilter = (value: string) => {
        setStatusFilter(value)
        updateUrl({ status: value, page: '1' })
    }

    const handleSort = (field: string) => {
        const currentSort = searchParams.get('sortBy')
        const currentOrder = searchParams.get('sortOrder')

        let newOrder = 'desc'
        if (currentSort === field && currentOrder === 'desc') {
            newOrder = 'asc'
        }

        updateUrl({ sortBy: field, sortOrder: newOrder })
    }

    const updateUrl = (params: Record<string, string>) => {
        const current = new URLSearchParams(Array.from(searchParams.entries()))

        Object.entries(params).forEach(([key, value]) => {
            if (value) current.set(key, value)
            else current.delete(key)
        })

        router.push(`?${current.toString()}`)
    }

    const goToPage = (page: number) => updateUrl({ page: page.toString() })

    const handleEdit = (cleaning: Cleaning) => {
        setEditingCleaning(cleaning.id)
        setRowMessage(null)

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

    const handleSaveEdit = async (cleaningId: string) => {
        setIsLoading(cleaningId)
        setRowMessage(null)

        try {
            const response = await fetch('/api/cleanings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: cleaningId,
                    ...editData,
                    current_step: parseInt(String(editData.current_step))
                })
            })

            const data = await response.json()
            if (!response.ok) throw new Error(data.error || 'Error al actualizar limpieza')

            setRowMessage({
                cleaningId,
                type: 'success',
                text: 'Limpieza actualizada exitosamente'
            })

            setEditingCleaning(null)

            setTimeout(() => setRowMessage(null), 10000)

            router.refresh()
        } catch (error: unknown) {
            const msg = error instanceof Error ? error.message : 'Error desconocido'
            setRowMessage({ cleaningId, type: 'error', text: msg })
        } finally {
            setIsLoading(null)
        }
    }

    const handleDelete = async (cleaningId: string, address: string) => {
        if (!confirm(`¿Estás seguro de eliminar la limpieza en ${address}?`)) return

        setIsLoading(cleaningId)
        setRowMessage(null)

        try {
            const response = await fetch(`/api/cleanings?id=${cleaningId}`, {
                method: 'DELETE'
            })

            if (!response.ok) throw new Error()

            setRowMessage({
                cleaningId,
                type: 'success',
                text: 'Limpieza eliminada exitosamente'
            })

            setTimeout(() => {
                setExpandedRow(null)
                setRowMessage(null)
                router.refresh()
            }, 2000)
        } catch {
            setRowMessage({
                cleaningId,
                type: 'error',
                text: 'Error al eliminar la limpieza'
            })
        } finally {
            setIsLoading(null)
        }
    }

    const getStatusBadge = (status: Cleaning['status']) => {
        const styles = {
            pending: 'bg-yellow-100 text-yellow-800',
            in_progress: 'bg-blue-100 text-blue-800',
            completed: 'bg-green-100 text-green-800',
            cancelled: 'bg-red-100 text-red-800'
        }

        const labels = {
            pending: 'Pendiente',
            in_progress: 'En Progreso',
            completed: 'Completada',
            cancelled: 'Cancelada'
        }

        return (
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status]}`}>
                {labels[status]}
            </span>
        )
    }

    const cleanerOptions = cleaners.map(cleaner => ({
        id: cleaner.id,
        label: cleaner.full_name,
        sublabel: `${cleaner.email}${cleaner.phone ? ` • ${cleaner.phone}` : ''}`
    }))

    return (
        <div className="bg-white shadow rounded-lg p-3">
            {/* Filtros y búsqueda */}
            <div className="p-6 border-b border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Búsqueda */}
                    <div className="md:col-span-2">
                        <label htmlFor="search" className="sr-only">Buscar</label>
                        <div className="relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <Search className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                name="search"
                                id="search"
                                value={searchTerm}
                                onChange={(e) => handleSearch(e.target.value)}
                                className="block w-full rounded-md border-0 py-2 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm sm:leading-6"
                                placeholder="Buscar por dirección o cliente..."
                            />
                        </div>
                    </div>

                    {/* Filtro de estado */}
                    <div>
                        <label htmlFor="status" className="sr-only">Estado</label>
                        <select
                            id="status"
                            name="status"
                            value={statusFilter}
                            onChange={(e) => handleStatusFilter(e.target.value)}
                            className="block w-full rounded-md border-0 py-2 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-purple-600 sm:text-sm sm:leading-6"
                        >
                            <option value="">Todos los estados</option>
                            <option value="pending">Pendientes</option>
                            <option value="in_progress">En Progreso</option>
                            <option value="completed">Completadas</option>
                            <option value="cancelled">Canceladas</option>
                        </select>
                    </div>
                </div>

                {/* Contador de resultados */}
                <div className="mt-4 text-sm text-gray-700">
                    Mostrando <span className="font-medium">{cleanings.length}</span> de{' '}
                    <span className="font-medium">{totalCount}</span> resultados
                </div>
            </div>

            {/* Tabla */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            <button
                                onClick={() => handleSort('scheduled_date')}
                                className="flex items-center gap-1 hover:text-gray-700"
                            >
                                Fecha
                                <ArrowUpDown className="w-4 h-4" />
                            </button>
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Dirección
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Cliente
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Estado
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Progreso
                        </th>
                        <th scope="col" className="relative px-6 py-3">
                            <span className="sr-only">Acciones</span>
                        </th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {cleanings.length === 0 ? (
                        <tr>
                            <td colSpan={6} className="px-6 py-12 text-center text-sm text-gray-500">
                                No se encontraron limpiezas
                            </td>
                        </tr>
                    ) : (
                        cleanings.map((cleaning) => (
                            <Fragment key={cleaning.id}>
                                <tr className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        <div className="flex items-center">
                                            <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                                            {new Date(cleaning.scheduled_date + 'T00:00:00').toLocaleDateString('es-CL')}
                                        </div>
                                        <div className="flex items-center text-xs text-gray-500 mt-1">
                                            <Clock className="w-3 h-3 mr-1" />
                                            {formatTime(cleaning.start_time)} - {formatTime(cleaning.end_time)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        <div className="flex items-center">
                                            <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                                            {cleaning.address}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        <div className="flex items-center">
                                            <User className="w-4 h-4 text-gray-400 mr-2" />
                                            <div>
                                                <div className="font-medium">{cleaning.client_name}</div>
                                                <div className="text-xs text-gray-500">{cleaning.client_email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {getStatusBadge(cleaning.status)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        <div className="flex items-center">
                                            <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                                                <div
                                                    className="bg-purple-600 h-2 rounded-full"
                                                    style={{ width: `${(cleaning.current_step / cleaning.total_steps) * 100}%` }}
                                                />
                                            </div>
                                            <span className="text-xs font-medium">
                                                {cleaning.current_step}/{cleaning.total_steps}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => setExpandedRow(expandedRow === cleaning.id ? null : cleaning.id)}
                                            className="text-purple-600 hover:text-purple-900 inline-flex items-center"
                                        >
                                            {expandedRow === cleaning.id ? (
                                                <ChevronUp className="w-5 h-5" />
                                            ) : (
                                                <ChevronDown className="w-5 h-5" />
                                            )}
                                        </button>
                                    </td>
                                </tr>
                                {expandedRow === cleaning.id && (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-4 bg-gray-50">
                                            {/* Mensaje de éxito/error en la fila */}
                                            {rowMessage && rowMessage.cleaningId === cleaning.id && (
                                                <div className={`mb-4 px-4 py-3 rounded-lg flex items-start gap-2 ${
                                                    rowMessage.type === 'success'
                                                        ? 'bg-green-50 text-green-700 border border-green-200'
                                                        : 'bg-red-50 text-red-700 border border-red-200'
                                                }`}>
                                                    {rowMessage.type === 'success' ? (
                                                        <CheckCircle className="w-5 h-5 flex-shrink-0" />
                                                    ) : (
                                                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                                    )}
                                                    <span className="text-sm">{rowMessage.text}</span>
                                                </div>
                                            )}

                                            {editingCleaning === cleaning.id ? (
                                                <div className="space-y-4">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        {/* Selector de cleaners mejorado */}
                                                        <div>
                                                            <MultiSearchableSelect
                                                                options={cleanerOptions}
                                                                value={editData.cleaner_ids || []}
                                                                onChange={(value) => setEditData({ ...editData, cleaner_ids: value })}
                                                                label="Cleaners"
                                                                placeholder="Buscar y seleccionar cleaners..."
                                                                disabled={isLoading === cleaning.id}
                                                                maxHeight="200px"
                                                            />
                                                        </div>

                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                                Estado
                                                            </label>
                                                            <select
                                                                value={editData.status}
                                                                onChange={(e) =>
                                                                    setEditData({
                                                                        ...editData,
                                                                        status: e.target.value as EditData['status']
                                                                    })
                                                                }
                                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
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
                                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
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
                                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
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
                                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
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
                                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
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
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 resize-none"
                                                        />
                                                    </div>

                                                    <div className="flex gap-2 pt-2">
                                                        <button
                                                            onClick={() => handleSaveEdit(cleaning.id)}
                                                            disabled={isLoading === cleaning.id}
                                                            className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                        >
                                                            {isLoading === cleaning.id ? 'Guardando...' : 'Guardar Cambios'}
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                setEditingCleaning(null)
                                                                setRowMessage(null)
                                                            }}
                                                            disabled={isLoading === cleaning.id}
                                                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                                                        >
                                                            Cancelar
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="space-y-3">
                                                    {/* Cleaners asignados */}
                                                    {cleaning.assigned_cleaners && cleaning.assigned_cleaners.length > 0 && (
                                                        <div>
                                                            <h4 className="text-sm font-medium text-gray-900 mb-2">Cleaners Asignados:</h4>
                                                            <div className="flex flex-wrap gap-2">
                                                                {cleaning.assigned_cleaners.map((cleaner) => (
                                                                    <span key={cleaner.id} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                                                                        {cleaner.full_name}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Notas */}
                                                    {cleaning.notes && (
                                                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                                            <p className="text-sm text-blue-900">
                                                                <strong>Notas:</strong> {cleaning.notes}
                                                            </p>
                                                        </div>
                                                    )}

                                                    {/* Botones de acción */}
                                                    <div className="flex gap-2 pt-2">
                                                        <button
                                                            onClick={() => handleEdit(cleaning)}
                                                            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                                                        >
                                                            <Edit className="w-4 h-4 mr-2" />
                                                            Editar
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(cleaning.id, cleaning.address)}
                                                            disabled={isLoading === cleaning.id}
                                                            className="inline-flex items-center px-3 py-2 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                                                        >
                                                            <Trash2 className="w-4 h-4 mr-2" />
                                                            Eliminar
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                )}
                            </Fragment>
                        ))
                    )}
                    </tbody>
                </table>
            </div>

            {/* Paginación */}
            {totalPages > 1 && (
                <div className="px-6 py-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                        <div className="flex-1 flex justify-between sm:hidden">
                            <button
                                onClick={() => goToPage(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Anterior
                            </button>
                            <button
                                onClick={() => goToPage(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Siguiente
                            </button>
                        </div>
                        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm text-gray-700">
                                    Página <span className="font-medium">{currentPage}</span> de{' '}
                                    <span className="font-medium">{totalPages}</span>
                                </p>
                            </div>
                            <div>
                                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                    <button
                                        onClick={() => goToPage(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <ChevronLeft className="h-5 w-5" />
                                    </button>
                                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                        let pageNum
                                        if (totalPages <= 5) {
                                            pageNum = i + 1
                                        } else if (currentPage <= 3) {
                                            pageNum = i + 1
                                        } else if (currentPage >= totalPages - 2) {
                                            pageNum = totalPages - 4 + i
                                        } else {
                                            pageNum = currentPage - 2 + i
                                        }

                                        return (
                                            <button
                                                key={pageNum}
                                                onClick={() => goToPage(pageNum)}
                                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                                    currentPage === pageNum
                                                        ? 'z-10 bg-purple-50 border-purple-500 text-purple-600'
                                                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                }`}
                                            >
                                                {pageNum}
                                            </button>
                                        )
                                    })}
                                    <button
                                        onClick={() => goToPage(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <ChevronRight className="h-5 w-5" />
                                    </button>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}