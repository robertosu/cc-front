// components/admin/UsersTable.tsx
'use client'

import React, { Fragment, useState, useTransition, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
    Search,
    ChevronDown,
    ChevronUp,
    ChevronLeft,
    ChevronRight,
    ArrowUpDown,
    MoreVertical,
    Shield,
    Briefcase,
    User as UserIcon,
    Mail,
    Phone,
    Calendar,
    Trash2,
    CheckCircle
} from 'lucide-react'
import { Profile } from '@/types'

// Extendemos el tipo Profile para incluir los contadores que calculamos en el servidor
interface UserWithStats extends Profile {
    client_cleanings_count: number
    cleaner_cleanings_count: number
}

interface UsersTableProps {
    users: UserWithStats[]
    currentPage: number
    totalPages: number
    totalCount: number
}

export default function UsersTable({
                                       users,
                                       currentPage,
                                       totalPages,
                                       totalCount
                                   }: UsersTableProps) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [isPending, startTransition] = useTransition()

    // Estados de filtros locales para input inmediato
    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '')
    const [roleFilter, setRoleFilter] = useState(searchParams.get('role') || '')
    const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)

    // Estado para acciones
    const [expandedRow, setExpandedRow] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState<string | null>(null)
    const [rowMessage, setRowMessage] = useState<{ userId: string, type: 'success' | 'error', text: string } | null>(null)

    // --- MANEJO DE URL (Filtros y Ordenamiento) ---
    const updateUrl = (params: Record<string, string>) => {
        const current = new URLSearchParams(Array.from(searchParams.entries()))
        Object.entries(params).forEach(([key, value]) => {
            if (value) current.set(key, value)
            else current.delete(key)
        })
        startTransition(() => {
            router.push(`?${current.toString()}`)
        })
    }

    const handleSearch = (value: string) => {
        setSearchTerm(value)
        if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current)
        searchTimeoutRef.current = setTimeout(() => {
            updateUrl({ search: value, page: '1' })
        }, 500)
    }

    const handleRoleFilter = (value: string) => {
        setRoleFilter(value)
        updateUrl({ role: value, page: '1' })
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

    const goToPage = (page: number) => updateUrl({ page: page.toString() })
    const clearFilters = () => {
        setSearchTerm('')
        setRoleFilter('')
        router.push('?')
    }

    // --- ACCIONES (API) ---
    const handleRoleChange = async (userId: string, newRole: string) => {
        if (!confirm(`¿Cambiar rol a ${newRole}?`)) return
        setIsLoading(userId)
        setRowMessage(null)

        try {
            const response = await fetch('/api/users', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: userId, role: newRole })
            })
            const data = await response.json()
            if (!response.ok) throw new Error(data.error || 'Error')

            setRowMessage({ userId, type: 'success', text: 'Rol actualizado' })
            setTimeout(() => {
                setRowMessage(null)
                setExpandedRow(null)
                router.refresh()
            }, 1500)
        } catch (error: any) {
            setRowMessage({ userId, type: 'error', text: error.message })
        } finally {
            setIsLoading(null)
        }
    }

    const handleDelete = async (userId: string) => {
        if (!confirm('¿Eliminar usuario permanentemente?')) return
        setIsLoading(userId)
        try {
            const response = await fetch(`/api/users?id=${userId}`, { method: 'DELETE' })
            if (!response.ok) throw new Error('Error al eliminar')
            setRowMessage({ userId, type: 'success', text: 'Usuario eliminado' })
            setTimeout(() => {
                setRowMessage(null)
                router.refresh()
            }, 1000)
        } catch {
            setRowMessage({ userId, type: 'error', text: 'Error al eliminar' })
        } finally {
            setIsLoading(null)
        }
    }

    // --- RENDER HELPERS ---
    const getRoleBadge = (role: string) => {
        const styles: Record<string, string> = {
            admin: 'bg-purple-100 text-purple-700 border-purple-200',
            cleaner: 'bg-ocean-100 text-ocean-700 border-ocean-200',
            client: 'bg-green-100 text-green-700 border-green-200'
        }
        const labels: Record<string, string> = {
            admin: 'Admin',
            cleaner: 'Cleaner',
            client: 'Cliente'
        }
        const icons: Record<string, React.ReactNode> = {
            admin: <Shield className="w-3 h-3 mr-1" />,
            cleaner: <Briefcase className="w-3 h-3 mr-1" />,
            client: <UserIcon className="w-3 h-3 mr-1" />
        }
        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[role] || 'bg-gray-100 text-gray-800'}`}>
                {icons[role]}
                {labels[role] || role}
            </span>
        )
    }

    const renderSortArrow = (field: string) => {
        const sort = searchParams.get('sortBy')
        const order = searchParams.get('sortOrder')
        if (sort !== field) return <ArrowUpDown className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-50" />
        return order === 'asc'
            ? <ChevronUp className="w-4 h-4 text-purple-600" />
            : <ChevronDown className="w-4 h-4 text-purple-600" />
    }

    // Vista Móvil (Card)
    const renderMobileCard = (user: UserWithStats) => (
        <div className="p-4 space-y-3">
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                        {user.full_name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <div className="font-medium text-gray-900">{user.full_name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                </div>
                {getRoleBadge(user.role)}
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    {user.phone || '-'}
                </div>
                <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {new Date(user.created_at).toLocaleDateString()}
                </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-medium text-gray-500 border-t pt-2 mt-2">
                <span>Cliente: {user.client_cleanings_count} limpiezas</span>
                <span>Cleaner: {user.cleaner_cleanings_count} trabajos</span>
            </div>

            <div className="pt-2 flex gap-2">
                <button
                    onClick={() => setExpandedRow(expandedRow === user.id ? null : user.id)}
                    className="flex-1 px-3 py-2 border rounded-md text-sm text-gray-700 bg-gray-50 hover:bg-gray-100"
                >
                    Gestionar
                </button>
            </div>

            {/* Panel de Acciones Expandido (Móvil) */}
            {expandedRow === user.id && (
                <div className="mt-2 p-3 bg-gray-50 rounded-md space-y-3 animate-fadeIn">
                    {rowMessage?.userId === user.id && (
                        <div className={`text-xs p-2 rounded ${rowMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {rowMessage.text}
                        </div>
                    )}
                    <div>
                        <span className="text-xs font-semibold text-gray-500 uppercase block mb-2">Cambiar Rol</span>
                        <div className="flex gap-2">
                            {['client', 'cleaner', 'admin'].map((role) => (
                                <button
                                    key={role}
                                    onClick={() => handleRoleChange(user.id, role)}
                                    disabled={user.role === role || isLoading === user.id}
                                    className={`flex-1 py-1 text-xs rounded border ${
                                        user.role === role
                                            ? 'bg-purple-600 text-white border-purple-600'
                                            : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                                    }`}
                                >
                                    {role === 'client' ? 'Cliente' : role === 'cleaner' ? 'Cleaner' : 'Admin'}
                                </button>
                            ))}
                        </div>
                    </div>
                    <button
                        onClick={() => handleDelete(user.id)}
                        disabled={isLoading === user.id}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm text-red-600 border border-red-200 bg-red-50 rounded hover:bg-red-100"
                    >
                        <Trash2 className="w-4 h-4" /> Eliminar Usuario
                    </button>
                </div>
            )}
        </div>
    )

    return (
        <div className="bg-white shadow rounded-lg flex flex-col h-full">
            {/* --- HEADER: Filtros --- */}
            <div className="p-4 border-b border-gray-200 space-y-4">
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
                            placeholder="Buscar por nombre o email..."
                        />
                    </div>
                    <select
                        value={roleFilter}
                        onChange={(e) => handleRoleFilter(e.target.value)}
                        className="block w-full sm:w-48 rounded-md border-0 py-2 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-purple-600 sm:text-sm"
                    >
                        <option value="">Todos los roles</option>
                        <option value="client">Cliente</option>
                        <option value="cleaner">Cleaner</option>
                        <option value="admin">Administrador</option>
                    </select>

                    {(searchTerm || roleFilter) && (
                        <button onClick={clearFilters} className="text-sm text-purple-600 hover:text-purple-800 font-medium">
                            Limpiar
                        </button>
                    )}
                </div>
                <div className="text-xs text-gray-500">Total: {totalCount} usuarios</div>
            </div>

            {/* --- TABLA (Desktop) / CARDS (Mobile) --- */}
            <div className="flex-1 overflow-auto">
                {/* Mobile */}
                <div className="md:hidden divide-y divide-gray-200">
                    {users.length === 0 ? <div className="p-8 text-center text-gray-500">No se encontraron usuarios</div> : users.map(user => (
                        <div key={user.id}>{renderMobileCard(user)}</div>
                    ))}
                </div>

                {/* Desktop */}
                <div className="hidden md:block">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                        <tr>
                            <th onClick={() => handleSort('full_name')} className="group px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors">
                                <div className="flex items-center gap-1">Usuario {renderSortArrow('full_name')}</div>
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contacto</th>
                            <th onClick={() => handleSort('role')} className="group px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors">
                                <div className="flex items-center gap-1">Rol {renderSortArrow('role')}</div>
                            </th>
                            <th onClick={() => handleSort('created_at')} className="group px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors">
                                <div className="flex items-center gap-1">Registro {renderSortArrow('created_at')}</div>
                            </th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Stats</th>
                            <th className="px-6 py-3 text-right"></th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {users.map((user) => (
                            <Fragment key={user.id}>
                                <tr className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="h-8 w-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-sm">
                                                {user.full_name?.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="ml-3">
                                                <div className="text-sm font-medium text-gray-900">{user.full_name}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900 flex items-center gap-2"><Mail className="w-3 h-3 text-gray-400"/> {user.email}</div>
                                        {user.phone && <div className="text-sm text-gray-500 flex items-center gap-2 mt-1"><Phone className="w-3 h-3 text-gray-400"/> {user.phone}</div>}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {getRoleBadge(user.role)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(user.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center text-xs text-gray-500">
                                        {user.role === 'client' && <div>🏠 {user.client_cleanings_count} pedidas</div>}
                                        {user.role === 'cleaner' && <div>✨ {user.cleaner_cleanings_count} realizadas</div>}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => setExpandedRow(expandedRow === user.id ? null : user.id)}
                                            className={`text-gray-400 hover:text-purple-600 p-1 rounded-full hover:bg-purple-50 ${expandedRow === user.id ? 'text-purple-600 bg-purple-50' : ''}`}
                                        >
                                            <MoreVertical className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>

                                {/* Fila Expandida para Acciones (Desktop) */}
                                {expandedRow === user.id && (
                                    <tr className="bg-gray-50">
                                        <td colSpan={6} className="px-6 py-4 border-b border-gray-200 shadow-inner">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <span className="text-sm font-medium text-gray-700">Cambiar Rol:</span>
                                                    <div className="flex bg-white rounded-lg border border-gray-200 p-1">
                                                        {['client', 'cleaner', 'admin'].map(role => (
                                                            <button
                                                                key={role}
                                                                onClick={() => handleRoleChange(user.id, role)}
                                                                disabled={user.role === role || isLoading === user.id}
                                                                className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                                                                    user.role === role
                                                                        ? 'bg-purple-100 text-purple-700 shadow-sm'
                                                                        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                                                                }`}
                                                            >
                                                                {role === 'client' ? 'Cliente' : role === 'cleaner' ? 'Cleaner' : 'Admin'}
                                                            </button>
                                                        ))}
                                                    </div>
                                                    {rowMessage?.userId === user.id && (
                                                        <span className={`text-sm flex items-center gap-1 ${rowMessage.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                                                                {rowMessage.type === 'success' && <CheckCircle className="w-4 h-4"/>}
                                                            {rowMessage.text}
                                                            </span>
                                                    )}
                                                </div>
                                                <button
                                                    onClick={() => handleDelete(user.id)}
                                                    className="flex items-center gap-2 text-sm text-red-600 hover:text-red-800 bg-white border border-red-200 px-3 py-1.5 rounded-md hover:bg-red-50 transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" /> Eliminar cuenta
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </Fragment>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* --- PAGINACIÓN --- */}
            {totalPages > 1 && (
                <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between sm:px-6">
                    <div className="flex-1 flex justify-between sm:hidden">
                        <button
                            onClick={() => goToPage(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                        >
                            Anterior
                        </button>
                        <button
                            onClick={() => goToPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="relative ml-3 inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                        >
                            Siguiente
                        </button>
                    </div>
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm text-gray-700">
                                Mostrando página <span className="font-medium">{currentPage}</span> de <span className="font-medium">{totalPages}</span>
                            </p>
                        </div>
                        <div>
                            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                <button
                                    onClick={() => goToPage(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                >
                                    <span className="sr-only">Anterior</span>
                                    <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                                </button>
                                <button
                                    onClick={() => goToPage(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                >
                                    <span className="sr-only">Siguiente</span>
                                    <ChevronRight className="h-5 w-5" aria-hidden="true" />
                                </button>
                            </nav>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}