'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
    LayoutDashboard,
    Users,
    Calendar,
    LogOut,
    Settings
} from 'lucide-react'
import { createClient } from '@/utils/supabase/client'

const navigation = [
    { name: 'Dashboard', href: '/dashboard/admin', icon: LayoutDashboard },
    { name: 'Limpiezas', href: '/dashboard/admin/cleanings', icon: Calendar },
    { name: 'Usuarios', href: '/dashboard/admin/users', icon: Users },
]

export default function AdminSidebar() {
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
            {/* Logo Area */}
            <div className="flex items-center h-16 px-6 bg-gray-950">
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                    Cleaner Club
                </span>
                <span className="ml-2 text-xs text-gray-400 border border-gray-700 rounded px-1">ADMIN</span>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                {navigation.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors group ${
                                isActive
                                    ? 'bg-purple-600 text-white'
                                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                            }`}
                        >
                            <item.icon className={`mr-3 h-5 w-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'}`} />
                            {item.name}
                        </Link>
                    )
                })}
            </nav>

            {/* Bottom Actions (Logout) */}
            <div className="p-4 bg-gray-950 border-t border-gray-800">
                <button
                    onClick={handleLogout}
                    className="flex w-full items-center px-3 py-2.5 text-sm font-medium text-red-400 rounded-lg hover:bg-gray-900 hover:text-red-300 transition-colors"
                >
                    <LogOut className="mr-3 h-5 w-5" />
                    Cerrar Sesión
                </button>
            </div>
        </div>
    )
}