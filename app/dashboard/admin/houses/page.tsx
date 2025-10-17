// app/dashboard/admin/houses/page.tsx
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { ArrowLeft, MapPin, User, Hash, Plus } from 'lucide-react'
import CreateHouseForm from '@/components/admin/CreateHouseForm'
import HousesList from '@/components/admin/HousesList'

export const metadata = {
    title: 'Gestión de Casas - Admin',
    description: 'Administrar casas de clientes'
}

export default async function AdminHousesPage() {
    const cookieStore = await cookies()
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

    // Obtener casas
    const { data: houses } = await supabase
        .from('houses')
        .select(`
            *,
            client:profiles!houses_client_id_fkey(id, full_name, email, phone),
            cleanings(id, status)
        `)
        .order('created_at', { ascending: false })

    // Obtener clientes para el formulario
    const { data: clients } = await supabase
        .from('profiles')
        .select('id, full_name, email')
        .eq('role', 'cliente')
        .order('full_name', { ascending: true })

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
                                <h1 className="text-2xl font-bold text-gray-900">Gestión de Casas</h1>
                                <p className="text-gray-600 text-sm">Administra las casas de tus clientes</p>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid md:grid-cols-3 gap-8">
                    {/* Formulario de creación */}
                    <div className="md:col-span-1">
                        <div className="bg-white rounded-xl shadow p-6 sticky top-8">
                            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Plus className="w-5 h-5" />
                                Nueva Casa
                            </h2>
                            <CreateHouseForm clients={clients || []} />
                        </div>
                    </div>

                    {/* Lista de casas */}
                    <div className="md:col-span-2">
                        <div className="bg-white rounded-xl shadow">
                            <div className="p-6 border-b border-gray-200">
                                <h2 className="text-lg font-bold text-gray-900">
                                    Casas Registradas ({houses?.length || 0})
                                </h2>
                            </div>

                            <HousesList houses={houses || []} />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}