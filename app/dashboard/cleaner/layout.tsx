import CleanerSidebar from '@/components/cleaner/CleanerSidebar'
import DashboardMobileNav from '@/components/layout/DashboardMobileNav' // Importar
import { requireProfile } from '@/utils/supabase/cached-queries'

export default async function CleanerLayout({ children }: { children: React.ReactNode }) {
    await requireProfile(['cleaner'])

    return (
        <div className="flex h-screen overflow-hidden bg-gray-50 flex-col md:flex-row">
            <div className="hidden md:flex md:flex-col">
                <CleanerSidebar />
            </div>

            <DashboardMobileNav role="cleaner" />

            <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
                <main className="flex-1 overflow-y-auto p-4 sm:p-6">
                    {children}
                </main>
            </div>
        </div>
    )
}