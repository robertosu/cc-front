// app/dashboard/page.tsx
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import LogoutButton from '@/components/auth/LogoutButton'

export const metadata = {
    title: 'Dashboard - CleanerClub',
    description: 'Panel de control de usuario'
}

export default async function DashboardPage() {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    // Obtener el usuario actual
    const {
        data: { user },
    } = await supabase.auth.getUser()

    // Si no hay usuario, redirigir a login
    if (!user) {
        redirect('/login')
    }

    // Obtener el perfil del usuario
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header del Dashboard */}
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                Bienvenido, {profile?.full_name || 'Usuario'}
                            </h1>
                            <p className="text-gray-600 mt-1">Panel de Control de CleanerClub</p>
                        </div>
                        <LogoutButton />
                    </div>
                </div>
            </header>

            {/* Contenido del Dashboard */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Tarjetas de información */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

                    {/* Tarjeta de Perfil */}
                    <div className="bg-white rounded-xl shadow p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Tu Perfil</h3>
                        <div className="space-y-3">
                            <div>
                                <p className="text-sm text-gray-600">Email</p>
                                <p className="font-medium text-gray-900">{user.email}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Nombre</p>
                                <p className="font-medium text-gray-900">{profile?.full_name || 'No especificado'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Teléfono</p>
                                <p className="font-medium text-gray-900">{profile?.phone || 'No especificado'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Cuenta verificada</p>
                                <p className="font-medium text-gray-900">
                                    {user.email_confirmed_at ? (
                                        <span className="text-green-600">✓ Verificada</span>
                                    ) : (
                                        <span className="text-yellow-600">⚠ Pendiente</span>
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Tarjeta de Servicios */}
                    <div className="bg-white rounded-xl shadow p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Tus Servicios</h3>
                        <div className="text-center py-8">
                            <p className="text-gray-500 mb-4">Aún no tienes servicios contratados</p>
                            <a
                                href="/#services"
                                className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Ver Servicios
                            </a>
                        </div>
                    </div>

                    {/* Tarjeta de Reservas */}
                    <div className="bg-white rounded-xl shadow p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Próximas Reservas</h3>
                        <div className="text-center py-8">
                            <p className="text-gray-500 mb-4">No tienes reservas programadas</p>
                            <a
                                href="/#services"
                                className="inline-block border-2 border-blue-600 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
                            >
                                Agendar Servicio
                            </a>
                        </div>
                    </div>

                </div>

                {/* Sección de acciones rápidas */}
                <div className="bg-white rounded-xl shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                        <button className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left">
                            <span className="text-2xl mb-2 block">📅</span>
                            <p className="font-medium text-gray-900">Nueva Reserva</p>
                        </button>
                        <button className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left">
                            <span className="text-2xl mb-2 block">⭐</span>
                            <p className="font-medium text-gray-900">Dejar Reseña</p>
                        </button>
                        <button className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left">
                            <span className="text-2xl mb-2 block">📞</span>
                            <p className="font-medium text-gray-900">Contactar Soporte</p>
                        </button>
                        <button className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left">
                            <span className="text-2xl mb-2 block">⚙️</span>
                            <p className="font-medium text-gray-900">Configuración</p>
                        </button>
                    </div>
                </div>

            </main>
        </div>
    )
}