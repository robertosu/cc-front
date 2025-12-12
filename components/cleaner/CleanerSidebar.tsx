'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, CheckSquare, LogOut } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'

const navigation = [
    { name: 'Mis Trabajos', href: '/dashboard/cleaner', icon: LayoutDashboard },
    // Agrega más rutas si el cleaner tiene historial o perfil
]

export default function CleanerSidebar() {
    const pathname = usePathname()
    const router = useRouter()
    const supabase = createClient()

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/login')
        router.refresh()
    }

    return (
        <div className="flex flex-col h-full bg-gray-900 text-white w-64 flex-shrink-0">
            <div className="flex items-center h-16 px-6 bg-gray-950">
                <span className="text-xl font-bold text-white">CleanerClub</span>
                <span className="ml-2 text-xs text-ocean-400 border border-ocean-700 rounded px-1">CLEANER</span>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-1">
                {navigation.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors group ${
                                isActive
                                    ? 'bg-ocean-600 text-white' // Color Ocean para cleaner
                                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                            }`}
                        >
                            <item.icon className="mr-3 h-5 w-5" />
                            {item.name}
                        </Link>
                    )
                })}
            </nav>

            <div className="p-4 bg-gray-950 border-t border-gray-800">
                <button
                    onClick={handleLogout}
                    // CAMBIO AQUÍ: Clases text-red-400 y hover:text-red-300
                    className="flex w-full items-center px-3 py-2.5 text-sm font-medium text-red-400 rounded-lg hover:bg-gray-900 hover:text-red-300 transition-colors"
                >
                    <LogOut className="mr-3 h-5 w-5" />
                    Cerrar Sesión
                </button>
            </div>
        </div>
    )
}