// app/dashboard/admin/page.tsx
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import LogoutButton from '@/components/auth/LogoutButton'
import { Users, Briefcase, Clock, CheckCircle, Calendar } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
    title: 'Admin Dashboard - CleanerClub',
    description: 'Panel de administración'
}

export default async function AdminDashboard() {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    // Verificar rol admin
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    if (!profile || profile.role !== 'admin') {
        redirect('/login')
    }

    // Obtener estadísticas usando la función de la BD
    const { data: stats } = await supabase
        .rpc('get_dashboard_stats', { user_id: user.id })

    const statistics = stats?.[0] || {
        total_cleanings: 0,
        pending_cleanings: 0,
        in_progress_cleanings: 0,
        completed_cleanings: 0,
        total_clients: 0,
        total_cleaners: 0
    }

    // Obtener limpiezas activas
    const { data: currentCleanings } = await supabase
        .from('cleanings_detailed')
        .select('*')
        .eq('status', 'in_progress')
        .order('scheduled_date', { ascending: true })
        .limit(5)

    // Próximas limpiezas
    const today = new Date().toISOString().split('T')[0]
    const { data: upcomingCleanings } = await supabase
        .from('cleanings_detailed')
        .select('*')
        .eq('status', 'pending')
        .gte('scheduled_date', today)
        .order('scheduled_date', { ascending: true })
        .limit(5)

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold">Panel de Administración</h1>
                            <p className="text-purple-100 mt-1">CleanerClub Management</p>
                        </div>
                        <LogoutButton />
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Acciones rápidas */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <Link
                        href="/dashboard/admin/cleanings"
                        className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition-shadow border-l-4 border-green-500"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Gestionar</p>
                                <p className="text-xl font-bold text-gray-900">Limpiezas</p>
                            </div>
                            <Briefcase className="w-10 h-10 text-green-500" />
                        </div>
                    </Link>

                    <Link
                        href="/dashboard/admin/users"
                        className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition-shadow border-l-4 border-purple-500"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Gestionar</p>
                                <p className="text-xl font-bold text-gray-900">Usuarios</p>
                            </div>
                            <Users className="w-10 h-10 text-purple-500" />
                        </div>
                    </Link>

                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-blue-100 mb-1">Total Limpiezas</p>
                                <p className="text-3xl font-bold">{statistics.total_cleanings}</p>
                            </div>
                            <Briefcase className="w-10 h-10 text-blue-200" />
                        </div>
                    </div>
                </div>

                {/* Estadísticas */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                    <div className="bg-white rounded-xl shadow p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Users className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-600">Clientes</p>
                                <p className="text-xl font-bold text-gray-900">{statistics.total_clients}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <Users className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-600">Cleaners</p>
                                <p className="text-xl font-bold text-gray-900">{statistics.total_cleaners}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Briefcase className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-600">Activas</p>
                                <p className="text-xl font-bold text-gray-900">{statistics.in_progress_cleanings}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-yellow-100 rounded-lg">
                                <Clock className="w-5 h-5 text-yellow-600" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-600">Pendientes</p>
                                <p className="text-xl font-bold text-gray-900">{statistics.pending_cleanings}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <CheckCircle className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-600">Completadas</p>
                                <p className="text-xl font-bold text-gray-900">{statistics.completed_cleanings}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Limpiezas activas */}
                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-4">🔄 Limpiezas en Progreso</h2>
                        <div className="bg-white rounded-xl shadow">
                            {currentCleanings && currentCleanings.length > 0 ? (
                                <div className="divide-y divide-gray-200">
                                    {currentCleanings.map((cleaning) => (
                                        <div key={cleaning.id} className="p-4 hover:bg-gray-50">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <p className="font-medium text-gray-900">
                                                        {cleaning.address}
                                                    </p>
                                                    <p className="text-sm text-gray-600">
                                                        Cliente: {cleaning.client.full_name}
                                                    </p>
                                                    {cleaning.cleaners.length > 0 && (
                                                        <p className="text-sm text-gray-600">
                                                            Cleaners: {cleaning.cleaners.map((c: any) => c.full_name).join(', ')}
                                                        </p>
                                                    )}
                                                </div>
                                                <span className="text-sm font-medium text-blue-600">
                                                    {cleaning.current_step}/{cleaning.total_steps}
                                                </span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-blue-600 h-2 rounded-full transition-all"
                                                    style={{
                                                        width: `${cleaning.progress_percentage}%`
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-8 text-center text-gray-500">
                                    No hay limpiezas en progreso
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Próximas limpiezas */}
                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-4">📅 Próximas Limpiezas</h2>
                        <div className="bg-white rounded-xl shadow">
                            {upcomingCleanings && upcomingCleanings.length > 0 ? (
                                <div className="divide-y divide-gray-200">
                                    {upcomingCleanings.map((cleaning) => (
                                        <div key={cleaning.id} className="p-4 hover:bg-gray-50">
                                            <div className="flex items-start gap-3">
                                                <Calendar className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                                                <div className="flex-1">
                                                    <p className="font-medium text-gray-900">
                                                        {cleaning.address}
                                                    </p>
                                                    <p className="text-sm text-gray-600">
                                                        Cliente: {cleaning.client.full_name}
                                                    </p>
                                                    {cleaning.cleaners.length > 0 ? (
                                                        <p className="text-sm text-gray-600">
                                                            Cleaners: {cleaning.cleaners.map((c: any) => c.full_name).join(', ')}
                                                        </p>
                                                    ) : (
                                                        <p className="text-sm text-yellow-600">
                                                            ⚠️ Sin cleaners asignados
                                                        </p>
                                                    )}
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        {new Date(cleaning.scheduled_date).toLocaleDateString('es-CL')} • {cleaning.start_time}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-8 text-center text-gray-500">
                                    No hay limpiezas programadas
                                </div>
                            )}
                        </div>
                    </section>
                </div>
            </main>
        </div>
    )
}