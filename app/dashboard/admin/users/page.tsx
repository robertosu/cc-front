// app/dashboard/admin/users/page.tsx
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import UsersList from '@/components/admin/UsersList'

export const metadata = {
    title: 'Gestión de Usuarios - Admin',
    description: 'Administrar usuarios y roles'
}

export default async function AdminUsersPage() {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    // Verificar rol admin
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (!profile || profile.role !== 'admin') {
        redirect('/login')
    }

    // Obtener todos los usuarios
    const { data: users } = await supabase
        .from('profiles')
        .select(`
            *,
            houses_count:houses(count),
            cleanings_as_cleaner:cleanings!cleanings_cleaner_id_fkey(count)
        `)
        .order('created_at', { ascending: false })

    const clients = users?.filter(u => u.role === 'cliente') || []
    const cleaners = users?.filter(u => u.role === 'cleaner') || []
    const admins = users?.filter(u => u.role === 'admin') || []

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link
                                href="/dashboard/admin"
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </Link>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Gestión de Usuarios</h1>
                                <p className="text-gray-600 text-sm">Administra roles y permisos</p>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Estadísticas */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                        <div className="text-center">
                            <p className="text-3xl font-bold text-blue-600">{clients.length}</p>
                            <p className="text-blue-900 font-medium mt-2">Clientes</p>
                        </div>
                    </div>

                    <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
                        <div className="text-center">
                            <p className="text-3xl font-bold text-purple-600">{cleaners.length}</p>
                            <p className="text-purple-900 font-medium mt-2">Cleaners</p>
                        </div>
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                        <div className="text-center">
                            <p className="text-3xl font-bold text-green-600">{admins.length}</p>
                            <p className="text-green-900 font-medium mt-2">Administradores</p>
                        </div>
                    </div>
                </div>

                {/* Lista de usuarios */}
                <div className="bg-white rounded-xl shadow">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-lg font-bold text-gray-900">
                            Todos los Usuarios ({users?.length || 0})
                        </h2>
                    </div>

                    <UsersList users={users || []} />
                </div>
            </main>
        </div>
    )
}