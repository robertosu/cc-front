'use client'

import {useState} from 'react'
import {useRouter} from 'next/navigation'
import {Briefcase, Calendar, Mail, MoreVertical, Phone, Shield, Trash2, User, Users} from 'lucide-react'

interface Profile {
    id: string
    full_name: string
    email: string
    phone?: string
    role: 'admin' | 'cleaner' | 'client'
    created_at: string
    client_cleanings_count?: number
    cleaner_cleanings_count?: number
}

export default function UsersList({ users }: { users: Profile[] }) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState<string | null>(null)
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
    const [expandedUser, setExpandedUser] = useState<string | null>(null)

    const getRoleColor = (role: string) => {
        switch (role) {
            case 'admin':
                return 'bg-purple-100 text-purple-700 border-purple-200'
            case 'cleaner':
                return 'bg-blue-100 text-blue-700 border-blue-200'
            case 'client':
                return 'bg-green-100 text-green-700 border-green-200'
            default:
                return 'bg-gray-100 text-gray-700 border-gray-200'
        }
    }

    const getRoleIcon = (role: string) => {
        switch (role) {
            case 'admin':
                return <Shield className="w-4 h-4" />
            case 'cleaner':
                return <Briefcase className="w-4 h-4" />
            case 'client':
                return <Users className="w-4 h-4" />
            default:
                return <User className="w-4 h-4" />
        }
    }

    const getRoleLabel = (role: string) => {
        switch (role) {
            case 'admin':
                return 'Administrador'
            case 'cleaner':
                return 'Cleaner'
            case 'client':
                return 'Cliente'
            default:
                return role
        }
    }

    const handleRoleChange = async (userId: string, newRole: string) => {
        if (!confirm(`¿Estás seguro de cambiar el rol de este usuario a ${getRoleLabel(newRole)}?`)) {
            return
        }

        setIsLoading(userId)
        setMessage(null)

        try {
            const response = await fetch('/api/users', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: userId, role: newRole })
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Error al actualizar rol')
            }

            setMessage({ type: 'success', text: 'Rol actualizado exitosamente' })
            router.refresh()
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message })
        } finally {
            setIsLoading(null)
        }
    }

    const handleDelete = async (userId: string, userName: string) => {
        if (!confirm(`¿Estás seguro de eliminar a ${userName}? Esta acción no se puede deshacer.`)) {
            return
        }

        setIsLoading(userId)
        setMessage(null)

        try {
            const response = await fetch(`/api/users?id=${userId}`, {
                method: 'DELETE'
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Error al eliminar usuario')
            }

            setMessage({ type: 'success', text: 'Usuario eliminado exitosamente' })
            router.refresh()
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message })
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
                {users.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        No hay usuarios registrados
                    </div>
                ) : (
                    users.map((user) => (
                        <div
                            key={user.id}
                            className="p-6 hover:bg-gray-50 transition-colors"
                        >
                            <div className="flex items-start justify-between">
                                {/* Información del usuario */}
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                            {user.full_name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 text-lg">
                                                {user.full_name}
                                            </h3>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${getRoleColor(user.role)}`}>
                                                    {getRoleIcon(user.role)}
                                                    {getRoleLabel(user.role)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Mail className="w-4 h-4 text-gray-400" />
                                            {user.email}
                                        </div>
                                        {user.phone && (
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Phone className="w-4 h-4 text-gray-400" />
                                                {user.phone}
                                            </div>
                                        )}
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Calendar className="w-4 h-4 text-gray-400" />
                                            Desde {new Date(user.created_at).toLocaleDateString('es-CL')}
                                        </div>
                                    </div>

                                    {/* Estadísticas según rol */}
                                    {user.role === 'client' && user.client_cleanings_count !== undefined && (
                                        <div className="flex items-center gap-4 text-sm">
                                            <div className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg">
                                                🏠 {user.client_cleanings_count} {user.client_cleanings_count === 1 ? 'limpieza' : 'limpiezas'}
                                            </div>
                                        </div>
                                    )}

                                    {user.role === 'cleaner' && user.cleaner_cleanings_count !== undefined && (
                                        <div className="flex items-center gap-4 text-sm">
                                            <div className="px-3 py-1 bg-green-50 text-green-700 rounded-lg">
                                                ✨ {user.cleaner_cleanings_count} {user.cleaner_cleanings_count === 1 ? 'limpieza' : 'limpiezas'}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Acciones */}
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setExpandedUser(expandedUser === user.id ? null : user.id)}
                                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                        disabled={isLoading === user.id}
                                    >
                                        <MoreVertical className="w-5 h-5 text-gray-600" />
                                    </button>
                                </div>
                            </div>

                            {/* Panel expandido de acciones */}
                            {expandedUser === user.id && (
                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <div className="space-y-3">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Cambiar rol:
                                            </label>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleRoleChange(user.id, 'client')}
                                                    disabled={isLoading === user.id || user.role === 'client'}
                                                    className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                                                        user.role === 'client'
                                                            ? 'bg-green-100 text-green-700 cursor-not-allowed'
                                                            : 'bg-gray-100 text-gray-700 hover:bg-green-100 hover:text-green-700'
                                                    }`}
                                                >
                                                    Cliente
                                                </button>
                                                <button
                                                    onClick={() => handleRoleChange(user.id, 'cleaner')}
                                                    disabled={isLoading === user.id || user.role === 'cleaner'}
                                                    className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                                                        user.role === 'cleaner'
                                                            ? 'bg-blue-100 text-blue-700 cursor-not-allowed'
                                                            : 'bg-gray-100 text-gray-700 hover:bg-blue-100 hover:text-blue-700'
                                                    }`}
                                                >
                                                    Cleaner
                                                </button>
                                                <button
                                                    onClick={() => handleRoleChange(user.id, 'admin')}
                                                    disabled={isLoading === user.id || user.role === 'admin'}
                                                    className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                                                        user.role === 'admin'
                                                            ? 'bg-purple-100 text-purple-700 cursor-not-allowed'
                                                            : 'bg-gray-100 text-gray-700 hover:bg-purple-100 hover:text-purple-700'
                                                    }`}
                                                >
                                                    Admin
                                                </button>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => handleDelete(user.id, user.full_name)}
                                            disabled={isLoading === user.id}
                                            className="w-full px-4 py-2 bg-red-50 text-red-700 rounded-lg font-medium hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            Eliminar Usuario
                                        </button>
                                    </div>
                                </div>
                            )}

                            {isLoading === user.id && (
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