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
    User,
    X
} from 'lucide-react'
import MultiSearchableSelect from '@/components/common/MultiSearchableSelect'
import { formatTime } from "@/utils/formatTime"
import {Option} from "@/types";

// --- TIPOS ---
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

// --- COMPONENTE DE FORMULARIO REUTILIZABLE ---
// Extraemos esto para usarlo tanto en la fila de la tabla (Desktop) como en la tarjeta (Mobile)
const CleaningEditForm = ({
                              editData,
                              setEditData,
                              cleanerOptions,
                              isLoading,
                              handleSave,
                              handleCancel,
                              totalSteps
                          }: {
    editData: Partial<EditData>,
    setEditData: (data: Partial<EditData>) => void,
    cleanerOptions: Option[],
    isLoading: boolean,
    handleSave: () => void,
    handleCancel: () => void,
    totalSteps: number
}) => {
    return (
        <div className="space-y-4 p-2">
            <div className="grid grid-cols-1 gap-4">
                {/* Selector de cleaners */}
                <div>
                    <MultiSearchableSelect
                        options={cleanerOptions}
                        value={editData.cleaner_ids || []}
                        onChange={(value) => setEditData({ ...editData, cleaner_ids: value })}
                        label="Cleaners"
                        placeholder="Seleccionar..."
                        disabled={isLoading}
                        maxHeight="200px"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                    <select
                        value={editData.status}
                        onChange={(e) => setEditData({ ...editData, status: e.target.value as EditData['status'] })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    >
                        <option value="pending">Pendiente</option>
                        <option value="in_progress">En Progreso</option>
                        <option value="completed">Completada</option>
                        <option value="cancelled">Cancelada</option>
                    </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Paso actual</label>
                        <input
                            type="number"
                            min="0"
                            max={totalSteps}
                            value={editData.current_step}
                            onChange={(e) => setEditData({ ...editData, current_step: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                        />
                        <span className="text-xs text-gray-500">Max: {totalSteps}</span>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
                        <input
                            type="date"
                            value={editData.scheduled_date}
                            onChange={(e) => setEditData({ ...editData, scheduled_date: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Inicio</label>
                        <input
                            type="time"
                            value={editData.start_time}
                            onChange={(e) => setEditData({ ...editData, start_time: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Fin</label>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Notas</label>
                <textarea
                    value={editData.notes}
                    onChange={(e) => setEditData({ ...editData, notes: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 resize-none"
                />
            </div>

            <div className="flex gap-2 pt-2">
                <button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50"
                >
                    {isLoading ? 'Guardando...' : 'Guardar'}
                </button>
                <button
                    onClick={handleCancel}
                    disabled={isLoading}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                >
                    Cancelar
                </button>
            </div>
        </div>
    )
}

// --- COMPONENTE PRINCIPAL ---
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
    // NUEVO: Estados para fechas
    const [startDate, setStartDate] = useState(searchParams.get('startDate') || '')
    const [endDate, setEndDate] = useState(searchParams.get('endDate') || '')

    const handleSearch = (value: string) => {
        setSearchTerm(value)
        updateUrl({ search: value, page: '1' })
    }

    const handleStatusFilter = (value: string) => {
        setStatusFilter(value)
        updateUrl({ status: value, page: '1' })
    }

    // NUEVO: Manejadores de fecha
    const handleDateFilter = (type: 'start' | 'end', value: string) => {
        if (type === 'start') {
            setStartDate(value)
            updateUrl({ startDate: value, page: '1' })
        } else {
            setEndDate(value)
            updateUrl({ endDate: value, page: '1' })
        }
    }

    // NUEVO: Limpiar filtros
    const clearFilters = () => {
        setSearchTerm('')
        setStatusFilter('')
        setStartDate('')
        setEndDate('')
        router.push('?')
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

            setRowMessage({ cleaningId, type: 'success', text: 'Actualizado correctamente' })
            setEditingCleaning(null)
            setTimeout(() => setRowMessage(null), 5000)
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
        try {
            const response = await fetch(`/api/cleanings?id=${cleaningId}`, { method: 'DELETE' })
            if (!response.ok) throw new Error()
            setRowMessage({ cleaningId, type: 'success', text: 'Eliminado correctamente' })
            setTimeout(() => {
                setExpandedRow(null)
                setRowMessage(null)
                router.refresh()
            }, 1000)
        } catch {
            setRowMessage({ cleaningId, type: 'error', text: 'Error al eliminar' })
        } finally {
            setIsLoading(null)
        }
    }

    const getStatusBadge = (status: Cleaning['status']) => {
        const styles = {
            pending: 'bg-yellow-100 text-yellow-800',
            in_progress: 'bg-teal-100 text-teal-800',
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
        sublabel: `${cleaner.email}`
    }))

    // Función para renderizar el contenido "normal" (no edición) de una fila/tarjeta
    const renderCleaningDetails = (cleaning: Cleaning) => (
        <div className="space-y-3 text-sm">
            <div className="flex justify-between items-start">
                <div>
                    <h4 className="font-medium text-gray-900">{cleaning.address}</h4>
                    <p className="text-gray-500">{cleaning.client_name}</p>
                </div>
                {getStatusBadge(cleaning.status)}
            </div>

            <div className="grid grid-cols-2 gap-2 text-gray-600">
                <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {new Date(cleaning.scheduled_date + 'T00:00:00').toLocaleDateString('es-CL')}
                </div>
                <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {formatTime(cleaning.start_time)} - {formatTime(cleaning.end_time)}
                </div>
            </div>

            {/* Cleaners */}
            {cleaning.assigned_cleaners && cleaning.assigned_cleaners.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {cleaning.assigned_cleaners.map((cleaner) => (
                        <span key={cleaner.id} className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-purple-50 text-purple-700 border border-purple-100">
                            {cleaner.full_name}
                        </span>
                    ))}
                </div>
            )}

            {/* Progreso */}
            <div>
                <div className="flex justify-between text-xs mb-1">
                    <span>Progreso</span>
                    <span>{cleaning.current_step}/{cleaning.total_steps}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div
                        className="bg-purple-600 h-1.5 rounded-full"
                        style={{ width: `${(cleaning.current_step / cleaning.total_steps) * 100}%` }}
                    />
                </div>
            </div>

            {/* Botones Acciones */}
            <div className="flex gap-2 pt-2 border-t border-gray-100 mt-2">
                <button
                    onClick={() => handleEdit(cleaning)}
                    className="flex-1 inline-flex justify-center items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                    <Edit className="w-4 h-4 mr-2" /> Editar
                </button>
                <button
                    onClick={() => handleDelete(cleaning.id, cleaning.address)}
                    className="inline-flex items-center px-3 py-2 border border-red-200 shadow-sm text-sm font-medium rounded-md text-red-600 bg-white hover:bg-red-50"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        </div>
    )

    return (
        <div className="bg-white shadow rounded-lg">
            {/* Header: Filtros y búsqueda */}
            <div className="p-4 border-b border-gray-200 space-y-4">

                {/* Fila 1: Búsqueda y Estado */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="block w-full rounded-md border-0 py-2 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-purple-600 sm:text-sm"
                            placeholder="Buscar por dirección o cliente..."
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => handleStatusFilter(e.target.value)}
                        className="block w-full sm:w-48 rounded-md border-0 py-2 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-purple-600 sm:text-sm"
                    >
                        <option value="">Todos los estados</option>
                        <option value="pending">Pendientes</option>
                        <option value="in_progress">En Progreso</option>
                        <option value="completed">Completadas</option>
                        <option value="cancelled">Canceladas</option>
                    </select>
                </div>

                {/* Fila 2: Filtros de Fecha */}
                <div className="flex flex-col sm:flex-row gap-4 items-end sm:items-center">
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <span className="text-sm text-gray-500 min-w-[40px]">Desde:</span>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => handleDateFilter('start', e.target.value)}
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-purple-600 sm:text-sm"
                        />
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <span className="text-sm text-gray-500 min-w-[40px]">Hasta:</span>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => handleDateFilter('end', e.target.value)}
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-purple-600 sm:text-sm"
                        />
                    </div>

                    {/* Botón para limpiar filtros si hay alguno activo */}
                    {(searchTerm || statusFilter || startDate || endDate) && (
                        <button
                            onClick={clearFilters}
                            className="text-sm text-purple-600 hover:text-purple-800 font-medium whitespace-nowrap"
                        >
                            Limpiar filtros
                        </button>
                    )}
                </div>

                <div className="mt-2 text-xs text-gray-500">
                    Total: {totalCount} registros encontrados
                </div>
            </div>

            {/* ... (RESTO DEL COMPONENTE: Vista Móvil, Vista Desktop, Paginación) ... */}
            {/* Mantener exactamente el mismo código que tenías abajo para renderizar la tabla */}
            <div className="md:hidden divide-y divide-gray-200">
                {/* ... tu código existente ... */}
                {cleanings.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">No se encontraron limpiezas</div>
                ) : (
                    cleanings.map((cleaning) => (
                        // ... renderizado móvil ...
                        <div key={cleaning.id} className="p-4">
                            {/* ... (asegúrate de incluir todo el bloque original) ... */}
                            {editingCleaning === cleaning.id ? (
                                <CleaningEditForm
                                    editData={editData}
                                    setEditData={setEditData}
                                    cleanerOptions={cleanerOptions}
                                    isLoading={isLoading === cleaning.id}
                                    handleSave={() => handleSaveEdit(cleaning.id)}
                                    handleCancel={() => setEditingCleaning(null)}
                                    totalSteps={cleaning.total_steps}
                                />
                            ) : (
                                renderCleaningDetails(cleaning)
                            )}
                        </div>
                    ))
                )}
            </div>

            {/* ... renderizado desktop ... */}
            <div className="hidden md:block overflow-x-auto">
                {/* ... tu tabla original ... */}
                <table className="min-w-full divide-y divide-gray-200">
                    {/* ... thead, tbody, etc ... */}
                    <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {/* ... mantener el header de Fecha ... */}
                        </th>
                        {/* ... mantener resto headers ... */}
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dirección</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progreso</th>
                        <th scope="col" className="relative px-6 py-3"><span className="sr-only">Acciones</span></th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {/* ... mapeo de cleanings ... */}
                    {cleanings.map((cleaning) => (
                        <Fragment key={cleaning.id}>
                            {/* ... tu fila de tabla ... */}
                            <tr className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    <div className="font-medium">{new Date(cleaning.scheduled_date + 'T00:00:00').toLocaleDateString('es-CL')}</div>
                                    <div className="text-xs text-gray-500">{formatTime(cleaning.start_time)} - {formatTime(cleaning.end_time)}</div>
                                </td>
                                {/* ... resto de celdas ... */}
                                {/* Asegúrate de no borrar ninguna columna */}
                                <td className="px-6 py-4 text-sm text-gray-900">{cleaning.address}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    <div>{cleaning.client_name}</div>
                                    <div className="text-xs text-gray-500">{cleaning.client_email}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(cleaning.status)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    <div className="w-24 bg-gray-200 rounded-full h-2 mb-1">
                                        <div className="bg-purple-600 h-2 rounded-full" style={{ width: `${(cleaning.current_step / cleaning.total_steps) * 100}%` }} />
                                    </div>
                                    <div className="text-xs text-gray-500">{cleaning.current_step}/{cleaning.total_steps}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button onClick={() => setExpandedRow(expandedRow === cleaning.id ? null : cleaning.id)} className="text-purple-600 hover:text-purple-900">
                                        {expandedRow === cleaning.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                                    </button>
                                </td>
                            </tr>
                            {/* ... fila expandida ... */}
                            {expandedRow === cleaning.id && (
                                <tr>
                                    {/* ... contenido expandido ... */}
                                    <td colSpan={6} className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                                        {/* ... lógica de edición o vista ... */}
                                        {editingCleaning === cleaning.id ? (
                                            <div className="max-w-3xl">
                                                <CleaningEditForm
                                                    editData={editData}
                                                    setEditData={setEditData}
                                                    cleanerOptions={cleanerOptions}
                                                    isLoading={isLoading === cleaning.id}
                                                    handleSave={() => handleSaveEdit(cleaning.id)}
                                                    handleCancel={() => setEditingCleaning(null)}
                                                    totalSteps={cleaning.total_steps}
                                                />
                                            </div>
                                        ) : (
                                            // ... vista detalles ...
                                            <div className="flex justify-between items-start">
                                                {/* ... */}
                                                <div className="space-y-2">
                                                    {cleaning.assigned_cleaners.length > 0 && (
                                                        <div>
                                                            <span className="text-xs font-semibold text-gray-500 uppercase">Cleaners:</span>
                                                            <div className="flex gap-2 mt-1">
                                                                {cleaning.assigned_cleaners.map(c => (
                                                                    <span key={c.id} className="bg-white border px-2 py-1 rounded text-sm">{c.full_name}</span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                    {cleaning.notes && (
                                                        <div className="bg-teal-50 p-3 rounded border border-teal-100 text-sm text-teal-800 mt-2">
                                                            <strong>Notas:</strong> {cleaning.notes}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex gap-2">
                                                    <button onClick={() => handleEdit(cleaning)} className="text-gray-600 hover:text-purple-600 flex items-center gap-1 px-3 py-1 border rounded bg-white">
                                                        <Edit className="w-4 h-4" /> Editar
                                                    </button>
                                                    <button onClick={() => handleDelete(cleaning.id, cleaning.address)} className="text-red-600 hover:text-red-800 flex items-center gap-1 px-3 py-1 border rounded bg-white">
                                                        <Trash2 className="w-4 h-4" /> Eliminar
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            )}
                        </Fragment>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* ... paginación ... */}
            {totalPages > 1 && (
                <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between sm:px-6">
                    <button
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                        Anterior
                    </button>
                    <span className="text-sm text-gray-700">
                        Página {currentPage} de {totalPages}
                    </span>
                    <button
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                        Siguiente
                    </button>
                </div>
            )}
        </div>
    )
}