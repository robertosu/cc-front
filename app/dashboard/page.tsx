// app/dashboard/page.tsx (Versión Optimizada)
import { requireProfile } from '@/utils/supabase/cached-queries'
import { redirect } from 'next/navigation'
import {Metadata} from "next";

export const metadata:Metadata = { title: 'Dashboard - CleanerClub', description: 'Panel de control' }

export default async function DashboardPage() {
    // Esta llamada es rápida y se cachea
    const { profile } = await requireProfile()

    // Redirección instantánea
    switch (profile.role) {
        case 'admin': redirect('/dashboard/admin'); break
        case 'cleaner': redirect('/dashboard/cleaner'); break
        case 'client': redirect('/dashboard/client'); break
        default: redirect('/login');
    }
}