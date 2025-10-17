// app/dashboard/cleaner/page.tsx
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import LogoutButton from '@/components/auth/LogoutButton'
import CleanerCleaningCard from '@/components/dashboard/CleanerCleaningCard'
import { Briefcase, Clock, CheckCircle } from 'lucide-react'

export const metadata = {
    title: 'Mis Limpiezas - CleanerClub',
    description: 'Gestiona tus trabajos de limpieza'
}

export default async function CleanerDashboard() {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    // Verificar rol
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    if (!profile || profile.role !== 'cleaner') {
        redirect('/login')
    }

    // Obtener limpiezas asignadas
    const { data: cleanings } = await supabase
        .from('cleanings')
        .select(`
            *,
            house:houses(
                *,
                client:profiles!houses_client_id_fkey(id, full_name, email, phone)
            )
        `)
        .eq('cleaner_id', user.id)
        .order('scheduled_date', { ascending: true })

    const activeCleanings = cleanings?.filter(c => c.status === 'in_progress') || []
    const upcomingCleanings = cleanings?.filter(c => c.status === 'pending') || []
    const completedToday = cleanings?.filter(c =>
        c.status === 'completed' &&
        c.scheduled_date === new Date().toISOString().split('T')[0]
    ) || []

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold">
                                Hola, {profile?.full_name}
                            </h1>
                            <p className="text-blue-100 mt-1">Tus trabajos del día</p>
                        </div>
                        <LogoutButton />
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Estadísticas rápidas */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-100 rounded-lg">
                                <Briefcase className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">En Progreso</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {activeCleanings.length}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-yellow-100 rounded-lg">
                                <Clock className="w-6 h-6 text-yellow-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Pendientes</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {upcomingCleanings.length}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-green-100 rounded-lg">
                                <CheckCircle className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Completadas Hoy</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {completedToday.length}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Limpiezas en Progreso */}
                {activeCleanings.length > 0 && (
                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                            🔄 Trabajos en Progreso
                        </h2>
                        <div className="space-y-6">
                            {activeCleanings.map((cleaning) => (
                                <CleanerCleaningCard
                                    key={cleaning.id}
                                    cleaning={cleaning}
                                />
                            ))}
                        </div>
                    </section>
                )}

                {/* Próximas Limpiezas */}
                {upcomingCleanings.length > 0 && (
                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                            📅 Próximos Trabajos
                        </h2>
                        <div className="space-y-6">
                            {upcomingCleanings.map((cleaning) => (
                                <CleanerCleaningCard
                                    key={cleaning.id}
                                    cleaning={cleaning}
                                />
                            ))}
                        </div>
                    </section>
                )}

                {/* Sin trabajos */}
                {cleanings?.length === 0 && (
                    <div className="bg-white rounded-xl shadow p-12 text-center">
                        <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 text-lg mb-2">
                            No tienes trabajos asignados
                        </p>
                        <p className="text-gray-500 text-sm">
                            Contacta con tu administrador para que te asigne trabajos
                        </p>
                    </div>
                )}
            </main>
        </div>
    )
}