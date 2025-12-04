// app/dashboard/admin/layout.tsx
import {createClient} from '@/utils/supabase/server'
import {redirect} from 'next/navigation'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminHeader from '@/components/admin/AdminHeader'
import React from "react";

export default async function AdminLayout({
                                              children,
                                          }: {
    children: React.ReactNode }) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    if (!profile || profile.role !== 'admin') {
        redirect('/login')
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <AdminSidebar profile={profile} />
            <div className="lg:pl-64">
                <AdminHeader/>
                <main className="py-6">
                    {children}
                </main>
            </div>
        </div>
    )
}