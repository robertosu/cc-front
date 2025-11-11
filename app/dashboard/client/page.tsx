// app/dashboard/client/page.tsx
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import LogoutButton from '@/components/auth/LogoutButton'
import CleaningProgressBar from '@/components/dashboard/CleaningProgressBar'
import { Calendar, Clock, MapPin, User, Users } from 'lucide-react'

export const metadata = {
    title: 'Mi Dashboard - CleanerClub',
    description: 'Mis limpiezas y servicios'
}

export default async function ClientDashboard() {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    // Verificar rol
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    if (!profile || profile.role !== 'client') {
        redirect('/login')
    }

    // Obtener limpiezas usando la vista
    const { data: cleanings } = await supabase
        .from('cleanings')
        .select('*')
        .eq('client->>id', user.id)
        .order('scheduled_date', { ascending: false })

    const activeCleanings = cleanings?.filter(c => c.status === 'in_progress') || []
    const upcomingCleanings = cleanings?.filter(c => c.status === 'pending') || []
    const completedCleanings = cleanings?.filter(c => c.status === 'completed').slice(0, 3) || []

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                Bienvenido, {profile?.full_name}
                            </h1>
                            <p className="text-gray-600 mt-1">Mis Servicios de Limpieza</p>
                        </div>
                        <LogoutButton />
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Limpiezas en Progreso */}
                {activeCleanings.length > 0 && (
                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                            🔄 Limpiezas en Progreso
                        </h2>
                        <div className="grid grid-cols-1 gap-6">
                            {activeCleanings.map((cleaning) => (
                                <div
                                    key={cleaning.id}
                                    className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500"
                                >
                                    <div className="grid md:grid-cols-2 gap-6">
                                        {/* Información */}
                                        <div className="space-y-3">
                                            <div className="flex items-start gap-3">
                                                <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0 mt-1" />
                                                <div>
                                                    <p className="text-sm text-gray-600">Dirección</p>
                                                    <p className="font-medium text-gray-900">
                                                        {cleaning.address}
                                                    </p>
                                                </div>
                                            </div>

                                            {cleaning.cleaners.length > 0 && (
                                                <div className="flex items-start gap-3">
                                                    <Users className="w-5 h-5 text-gray-400 flex-shrink-0 mt-1" />
                                                    <div>
                                                        <p className="text-sm text-gray-600">
                                                            {cleaning.cleaners.length === 1 ? 'Cleaner Asignado' : 'Equipo Asignado'}
                                                        </p>
                                                        <p className="font-medium text-gray-900">
                                                            {cleaning.cleaners.map((c: any) => c.full_name).join(', ')}
                                                        </p>
                                                        {cleaning.cleaners[0]?.phone && (
                                                            <p className="text-sm text-gray-600">
                                                                {cleaning.cleaners[0].phone}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                            <div className="flex items-start gap-3">
                                                <Calendar className="w-5 h-5 text-gray-400 flex-shrink-0 mt-1" />
                                                <div>
                                                    <p className="text-sm text-gray-600">Fecha</p>
                                                    <p className="font-medium text-gray-900">
                                                        {new Date(cleaning.scheduled_date).toLocaleDateString('es-CL', {
                                                            weekday: 'long',
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric'
                                                        })}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-3">
                                                <Clock className="w-5 h-5 text-gray-400 flex-shrink-0 mt-1" />
                                                <div>
                                                    <p className="text-sm text-gray-600">Horario</p>
                                                    <p className="font-medium text-gray-900">
                                                        {cleaning.start_time} - {cleaning.end_time}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Progreso */}
                                        <div>
                                            <CleaningProgressBar
                                                currentStep={cleaning.current_step}
                                                totalSteps={cleaning.total_steps}
                                                status={cleaning.status}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Próximas Limpiezas */}
                {upcomingCleanings.length > 0 && (
                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                            📅 Próximas Limpiezas
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {upcomingCleanings.map((cleaning) => (
                                <div
                                    key={cleaning.id}
                                    className="bg-white rounded-xl shadow p-6"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <h3 className="font-semibold text-gray-900">
                                                {cleaning.address}
                                            </h3>
                                            <p className="text-sm text-gray-600">
                                                {cleaning.total_steps} steps
                                            </p>
                                        </div>
                                        <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">
                                            Pendiente
                                        </span>
                                    </div>

                                    <div className="space-y-2 text-sm">
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <Calendar className="w-4 h-4" />
                                            {new Date(cleaning.scheduled_date).toLocaleDateString('es-CL')}
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <Clock className="w-4 h-4" />
                                            {cleaning.start_time} - {cleaning.end_time}
                                        </div>
                                        {cleaning.cleaners.length > 0 && (
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <Users className="w-4 h-4" />
                                                {cleaning.cleaners.map((c: any) => c.full_name).join(', ')}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Historial Reciente */}
                {completedCleanings.length > 0 && (
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                            ✅ Limpiezas Completadas Recientemente
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {completedCleanings.map((cleaning) => (
                                <div
                                    key={cleaning.id}
                                    className="bg-white rounded-xl shadow p-6 opacity-75"
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <h3 className="font-semibold text-gray-900">
                                            {cleaning.address}
                                        </h3>
                                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                                            ✓
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600">
                                        {new Date(cleaning.scheduled_date).toLocaleDateString('es-CL')}
                                    </p>
                                    {cleaning.cleaners.length > 0 && (
                                        <p className="text-sm text-gray-600">
                                            Por {cleaning.cleaners.map((c: any) => c.full_name).join(', ')}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Sin limpiezas */}
                {cleanings?.length === 0 && (
                    <div className="bg-white rounded-xl shadow p-12 text-center">
                        <p className="text-gray-600 text-lg mb-4">
                            Aún no tienes limpiezas programadas
                        </p>
                        <a
                            href="/#services"
                            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Ver Servicios
                        </a>
                    </div>
                )}
            </main>
        </div>
    )
}