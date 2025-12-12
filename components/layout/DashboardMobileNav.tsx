'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Menu, X, LogOut, LayoutDashboard, Calendar, Users, CheckSquare } from 'lucide-react' // Importa los iconos necesarios
import { createClient } from '@/utils/supabase/client'

// Definimos las navegaciones aquí o las pasamos por props.
// Para simplificar, las definiremos dentro basadas en el rol.
const ADMIN_NAV = [
    { name: 'Dashboard', href: '/dashboard/admin', icon: LayoutDashboard },
    { name: 'Limpiezas', href: '/dashboard/admin/cleanings', icon: Calendar },
    { name: 'Usuarios', href: '/dashboard/admin/users', icon: Users },
]

const CLEANER_NAV = [
    { name: 'Mis Trabajos', href: '/dashboard/cleaner', icon: LayoutDashboard },
]

interface Props {
    role: 'admin' | 'cleaner'
}

export default function DashboardMobileNav({ role }: Props) {
    const [isOpen, setIsOpen] = useState(false)
    const pathname = usePathname()
    const router = useRouter()
    const supabase = createClient()

    const navigation = role === 'admin' ? ADMIN_NAV : CLEANER_NAV
    const themeColor = role === 'admin' ? 'purple' : 'ocean' // Ajusta según tu theme
    const themeClass = role === 'admin' ? 'text-purple-600' : 'text-ocean-600'
    const bgClass = role === 'admin' ? 'bg-purple-600' : 'bg-ocean-600'

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/login')
        router.refresh()
    }

    return (
        <div className="md:hidden bg-gray-900 text-white">
            {/* Header Móvil */}
            <div className="flex items-center justify-between px-4 h-16">
                <div className="flex items-center gap-2">
                    <span className="font-bold text-lg">CleaningApp</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded border border-gray-600 ${themeClass.replace('text-', 'text-gray-300 ')}`}>
                        {role.toUpperCase()}
                    </span>
                </div>
                <button onClick={() => setIsOpen(true)} className="p-2 text-gray-300 hover:text-white">
                    <Menu className="w-6 h-6" />
                </button>
            </div>

            {/* Overlay y Menú Slide-over */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex">
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Drawer */}
                    <div className="relative flex-1 flex flex-col max-w-xs w-full bg-gray-900 h-full shadow-xl transition-transform transform translate-x-0">
                        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-800">
                            <span className="font-bold text-xl text-white">Menú</span>
                            <button onClick={() => setIsOpen(false)} className="p-2 text-gray-400 hover:text-white">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
                            {navigation.map((item) => {
                                const isActive = pathname === item.href
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        onClick={() => setIsOpen(false)}
                                        className={`flex items-center px-3 py-3 text-base font-medium rounded-lg transition-colors ${
                                            isActive
                                                ? `${bgClass} text-white`
                                                : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                                        }`}
                                    >
                                        <item.icon className="mr-3 h-5 w-5" />
                                        {item.name}
                                    </Link>
                                )
                            })}
                        </nav>

                        <div className="p-4 border-t border-gray-800">
                            <button
                                onClick={handleLogout}
                                className="flex w-full items-center px-3 py-3 text-base font-medium text-red-400 rounded-lg hover:bg-gray-800 hover:text-red-300 transition-colors"
                            >
                                <LogOut className="mr-3 h-5 w-5" />
                                Cerrar Sesión
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}