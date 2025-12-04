// app/dashboard/admin/cleanings/create/page.tsx
import {createClient} from '@/utils/supabase/server'
import {redirect} from 'next/navigation'
import Link from 'next/link'
import {ArrowLeft} from 'lucide-react'
import CreateCleaningForm from '@/components/admin/CreateCleaningForm'
import {Metadata} from "next";

export const metadata: Metadata = {
    title: 'Nueva Limpieza - Admin',
    description: 'Crear nueva limpieza programada'
}

export default async function CreateCleaningPage() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (!profile || profile.role !== 'admin') redirect('/login')

    // Obtener clientes y cleaners para el formulario
    const { data: clients } = await supabase
        .from('profiles')
        .select('id, full_name, email')
        .eq('role', 'client')
        .order('full_name', { ascending: true })

    const { data: cleaners } = await supabase
        .from('profiles')
        .select('id, full_name, email, phone')
        .eq('role', 'cleaner')
        .order('full_name', { ascending: true })

    return (
        <div className="px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="mb-8">
                <Link
                    href="/dashboard/admin/cleanings"
                    className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Volver a limpiezas
                </Link>
                <h1 className="text-2xl font-bold text-gray-900">Nueva Limpieza</h1>
                <p className="mt-2 text-sm text-gray-700">
                    Programa una nueva limpieza para tus clientes
                </p>
            </div>

            {/* Formulario */}
            <div className="max-w-2xl">
                <div className="bg-white shadow rounded-lg p-6">
                    <CreateCleaningForm
                        clients={clients || []}
                        cleaners={cleaners || []}
                        redirectAfterSuccess="/dashboard/admin/cleanings"
                    />
                </div>
            </div>
        </div>
    )
}