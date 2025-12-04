
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminHeader from '@/components/admin/AdminHeader'
import React from "react";
import {requireAdmin} from "@/app/dashboard/admin/page";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    // 1 sola línea reemplaza las 14 duplicadas
    const { profile } = await requireAdmin()

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