'use client'
import { Bell, Menu } from 'lucide-react' // Importar Menu
import LogoutButton from '@/components/auth/LogoutButton'
import { useSidebar } from '@/components/providers/SidebarContext' // Importar hook

export default function AdminHeader() {
    const { toggle } = useSidebar() // Usar hook

    return (
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
            {/* Botón Mobile conectado al toggle */}
            <button
                type="button"
                className="-m-2.5 p-2.5 text-gray-700 lg:hidden hover:text-gray-900"
                onClick={toggle}
            >
                <span className="sr-only">Open sidebar</span>
                <Menu className="h-6 w-6" />
            </button>

            {/* Separator */}
            <div className="h-6 w-px bg-gray-200 lg:hidden" />

            {/* ... resto del header ... */}
            <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">

                <div className="flex flex-1"></div>

                <div className="flex items-center gap-x-4 lg:gap-x-6">
                    {/* Notifications */}
                    <button type="button" className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500">
                        <span className="sr-only">Ver notificaciones</span>
                        <Bell className="h-6 w-6" />
                    </button>

                    {/* Separator */}
                    <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200" />

                    {/* Logout */}
                    <LogoutButton />
                </div>
            </div>
        </div>
    )
}