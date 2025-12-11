// app/dashboard/client/page.tsx
import {createClient} from '@/utils/supabase/server'
import {redirect} from 'next/navigation'
import ClientDashboardClient from '@/components/dashboard/ClientDashboardClient'
import {Metadata} from "next";
import { requireProfile } from '@/utils/supabase/cached-queries'


export const metadata: Metadata = {
    title: 'Mi Dashboard - CleanerClub',
    description: 'Mis limpiezas y servicios'
}

export default async function ClientDashboard() {

    const { user, profile, supabase } = await requireProfile(['client'])

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