// app/dashboard/admin/layout.tsx
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminHeader from '@/components/admin/AdminHeader'
import React from "react"
import { SidebarProvider } from '@/components/providers/SidebarContext'
// CAMBIO AQUÍ: Importar desde utils, no desde page
import { requireProfile } from '@/utils/supabase/cached-queries'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    // CAMBIO AQUÍ: Usamos requireProfile directametne
    const { profile } = await requireProfile(['admin'])

    return (
        <SidebarProvider>
            <div className="min-h-screen bg-gray-50">
                <AdminSidebar profile={profile} />
                <div className="lg:pl-64">
                    <AdminHeader/>
                    <main className="py-6">
                        {children}
                    </main>
                </div>
            </div>
        </SidebarProvider>
    )
}