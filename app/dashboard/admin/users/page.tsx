// app/dashboard/admin/users/page.tsx
import {createClient} from '@/utils/supabase/server'
import {redirect} from 'next/navigation'
import {Briefcase, Shield, Users as UsersIcon} from 'lucide-react'
import UsersList from '@/components/admin/UsersList'
import {Metadata} from "next";
import {Profile} from "@/types";

type User = {
    id: string
    role: 'admin' | 'cleaner' | 'client'
    full_name?: string
    email?: string
    phone?: string
    created_at?: string
    client_cleanings_count?: number
    cleaner_cleanings_count?: number
}

export const metadata: Metadata = {
    title: 'Gestión de Usuarios - Admin',
    description: 'Administrar usuarios y roles'
}

export default async function AdminUsersPage() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    // Verificar rol admin
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (!profile || profile.role !== 'admin') {
        redirect('/dashboard')
    }

    // Obtener usuarios
    const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

    let users: Profile[] = []

    if (profiles && !profilesError) {
        users = await Promise.all(
            profiles.map(async (profile) => {
                // Contar limpiezas como cliente
                const { count: clientCleaningsCount } = await supabase
                    .from('cleanings')
                    .select('*', { count: 'exact', head: true })
                    .eq('client_id', profile.id)

                // Contar asignaciones como cleaner
                const { count: cleanerCleaningsCount } = await supabase
                    .from('cleaning_cleaners')
                    .select('*', { count: 'exact', head: true })
                    .eq('cleaner_id', profile.id)

                return {
                    ...profile,
                    full_name: profile.full_name || 'Sin Nombre',   // ✅ obligatorio
                    created_at: profile.created_at || new Date().toISOString(), // ✅ obligatorio
                    client_cleanings_count: clientCleaningsCount || 0,
                    cleaner_cleanings_count: cleanerCleaningsCount || 0
                } as Profile
            })
        )
    }

    const clients = users.filter((u: User) => u.role === 'client')
    const cleaners = users.filter((u: User) => u.role === 'cleaner')
    const admins = users.filter((u: User) => u.role === 'admin')

    return (
        <div className="px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Gestión de Usuarios</h1>
                <p className="mt-2 text-sm text-gray-700">
                    Administra roles y permisos de usuarios
                </p>
            </div>

            {/* Estadísticas */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8">
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="rounded-md bg-green-500 p-3">
                                    <UsersIcon className="h-6 w-6 text-white" />
                                </div>
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Clientes</dt>
                                    <dd className="text-2xl font-semibold text-gray-900">{clients.length}</dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="rounded-md bg-cyan-500 p-3">
                                    <Briefcase className="h-6 w-6 text-white" />
                                </div>
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Cleaners</dt>
                                    <dd className="text-2xl font-semibold text-gray-900">{cleaners.length}</dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="rounded-md bg-purple-500 p-3">
                                    <Shield className="h-6 w-6 text-white" />
                                </div>
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Administradores</dt>
                                    <dd className="text-2xl font-semibold text-gray-900">{admins.length}</dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Error de carga */}
            {profilesError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <p className="text-red-700 font-semibold">Error al cargar usuarios:</p>
                    <p className="text-red-600 text-sm">{profilesError.message}</p>
                </div>
            )}

            {/* Lista de usuarios */}
            <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                    <h2 className="text-lg font-medium text-gray-900">
                        Todos los Usuarios ({users.length})
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                        Gestiona roles y permisos de cada usuario
                    </p>
                </div>

                {users.length === 0 ? (
                    <div className="p-12 text-center">
                        <UsersIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No hay usuarios</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            Los nuevos registros aparecerán aquí automáticamente
                        </p>
                    </div>
                ) : (
                    <UsersList users={users} />
                )}
            </div>
        </div>
    )
}