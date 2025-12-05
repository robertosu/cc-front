import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminHeader from '@/components/admin/AdminHeader'
import React from "react";
import { requireAdmin } from "@/app/dashboard/admin/page";
import { SidebarProvider } from '@/components/providers/SidebarContext' // Importar el provider

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const { profile } = await requireAdmin()

    return (
        <SidebarProvider> {/* Envolver todo */}
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