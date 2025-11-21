// app/dashboard/admin/cleanings/page.tsx
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { ArrowLeft, Plus } from 'lucide-react'
import CreateCleaningForm from '@/components/admin/CreateCleaningForm'
import CleaningsList from '@/components/admin/CleaningsList'

export const metadata = {
    title: 'Gestión de Limpiezas - Admin',
    description: 'Administrar limpiezas programadas'
}

export default async function AdminCleaningsPage() {
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
        redirect('/login')
    }

    // Obtener limpiezas usando la vista
    const { data: cleanings } = await supabase
        .from('cleanings_with_details')
        .select('*')
        .order('scheduled_date', { ascending: false })

    // Obtener clientes
    const { data: clients } = await supabase
        .from('profiles')
        .select('id, full_name, email')
        .eq('role', 'client')
        .order('full_name', { ascending: true })

    // Obtener cleaners disponibles
    const { data: cleaners } = await supabase
        .from('profiles')
        .select('id, full_name, email, phone')
        .eq('role', 'cleaner')
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
                                <h1 className="text-2xl font-bold text-gray-900">Gestión de Limpiezas</h1>
                                <p className="text-gray-600 text-sm">Programa y asigna trabajos de limpieza</p>
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
                                Nueva Limpieza
                            </h2>
                            <CreateCleaningForm
                                clients={clients || []}
                                cleaners={cleaners || []}
                            />
                        </div>
                    </div>

                    {/* Lista de limpiezas */}
                    <div className="md:col-span-2">
                        <div className="bg-white rounded-xl shadow">
                            <div className="p-6 border-b border-gray-200">
                                <h2 className="text-lg font-bold text-gray-900">
                                    Limpiezas Programadas ({cleanings?.length || 0})
                                </h2>
                            </div>

                            <CleaningsList
                                cleanings={cleanings || []}
                                cleaners={cleaners || []}
                            />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}