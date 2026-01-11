// app/dashboard/client/page.tsx
import { requireProfile } from '@/utils/supabase/cached-queries'
import ClientDashboardClient from '@/components/dashboard/ClientDashboardClient'
import { Metadata } from "next"

export const metadata: Metadata = {
    title: 'Mi Panel - Cleaner Club',
    description: 'Gestiona tus servicios contratados'
}

export default async function ClientDashboardPage() {
    const { user, profile, supabase } = await requireProfile(['client'])

    // CAMBIO IMPORTANTE:
    // Usamos la misma consulta anidada que usa el hook 'useCleaningsRealtime'
    // Esto garantiza que 'assigned_cleaners' tenga la estructura { cleaner: ... }
    const { data: cleanings } = await supabase
        .from('cleanings_with_details') // Volvemos a la vista segura
        .select('*')
        .eq('client_id', user.id)
        .order('scheduled_date', { ascending: true })

    // Nota: Aunque TypeScript pueda quejarse de que los tipos anidados de Supabase no coinciden
    // perfectamente con la interfaz Cleaning, la estructura en tiempo de ejecución será correcta.
    return (
        <ClientDashboardClient
            profile={profile}
            initialCleanings={(cleanings as any) || []}
        />
    )
}