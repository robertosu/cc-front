// app/dashboard/client/page.tsx
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import ClientDashboardClient from '@/components/dashboard/ClientDashboardClient'
import {Metadata} from "next";


export const metadata: Metadata = {
    title: 'Mi Dashboard - CleanerClub',
    description: 'Mis limpiezas y servicios'
}

export default async function ClientDashboard() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    if (!profile || profile.role !== 'client') {
        redirect('/login')
    }

    const { data: cleanings } = await supabase
        .from('cleanings')
        .select(`
            *,
            client:profiles!cleanings_client_id_fkey(
                id,
                full_name,
                email,
                phone
            ),
            assigned_cleaners:cleaning_cleaners(
                cleaner:profiles!cleaning_cleaners_cleaner_id_fkey(
                    id,
                    full_name,
                    email,
                    phone
                ),
                assigned_at
            )
        `)
        .eq('client_id', user.id)
        .order('scheduled_date', { ascending: false })



    return (
        <ClientDashboardClient
            profile={profile}
            initialCleanings={cleanings || []}
        />
    )
}