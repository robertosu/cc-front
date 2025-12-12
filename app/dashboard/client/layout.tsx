import ClientSidebar from '@/components/client/ClientSidebar' // Ajusta la ruta si lo guardaste en otro lado
import DashboardMobileNav from '@/components/layout/DashboardMobileNav'
import { requireProfile } from '@/utils/supabase/cached-queries'

export default async function ClientLayout({ children }: { children: React.ReactNode }) {
    await requireProfile(['client'])

    return (
        <div className="flex h-screen overflow-hidden bg-gray-50 flex-col md:flex-row">
            {/* Sidebar Desktop */}
            <div className="hidden md:flex md:flex-col">
                <ClientSidebar />
            </div>

            {/* Navbar Móvil */}
            <DashboardMobileNav role="client" />

            {/* Contenido Principal */}
            <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
                <main className="flex-1 overflow-y-auto bg-gray-50">
                    {children}
                </main>
            </div>
        </div>
    )
}