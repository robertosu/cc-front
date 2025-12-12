// app/dashboard/client/page.tsx
import { requireProfile } from '@/utils/supabase/cached-queries'
import ClientDashboardClient from '@/components/dashboard/ClientDashboardClient'
import { Metadata } from "next"

export const metadata: Metadata = {
    title: 'Mi Panel - CleanerClub',
    description: 'Gestiona tus servicios contratados'
}

export default async function ClientDashboardPage() {
    const { user, profile, supabase } = await requireProfile(['client'])

    // Obtenemos los datos iniciales en el servidor para que la carga sea instantánea
    // Usamos la tabla cleanings (con select anidado) o la vista si tienes acceso
    // Para asegurar que funciona con el componente ClientDashboardClient, traemos todo:
    const { data: cleanings } = await supabase
        .from('cleanings_with_details') // O 'cleanings' si la vista tiene RLS
        .select('*')
        .eq('client_id', user.id)
        .order('scheduled_date', { ascending: true })

    return (
        <ClientDashboardClient
            profile={profile}
            initialCleanings={cleanings || []}
        />
    )
}