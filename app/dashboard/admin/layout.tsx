import AdminSidebar from '@/components/admin/AdminSidebar'
import DashboardMobileNav from '@/components/layout/DashboardMobileNav' // Importar el nuevo componente
import { requireProfile } from '@/utils/supabase/cached-queries'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    await requireProfile(['admin'])

    return (
        <div className="flex h-screen overflow-hidden bg-gray-50 flex-col md:flex-row">
            {/* Sidebar Fijo Desktop */}
            <div className="hidden md:flex md:flex-col">
                <AdminSidebar />
            </div>

            {/* Navbar Móvil (Visible solo en md:hidden) */}
            <DashboardMobileNav role="admin" />

            {/* Contenido Principal */}
            <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
                <main className="flex-1 overflow-y-auto focus:outline-none p-4 sm:p-6">
                    {children}
                </main>
            </div>
        </div>
    )
}