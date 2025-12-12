'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Menu, X, LogOut, LayoutDashboard, Calendar, Users, History, PlayCircle, CalendarClock } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'

// Definimos las navegaciones
const ADMIN_NAV = [
    { name: 'Dashboard', href: '/dashboard/admin', icon: LayoutDashboard },
    { name: 'Limpiezas', href: '/dashboard/admin/cleanings', icon: Calendar },
    { name: 'Usuarios', href: '/dashboard/admin/users', icon: Users },
]

const CLEANER_NAV = [
    { name: 'Mis Trabajos', href: '/dashboard/cleaner', icon: LayoutDashboard },
]

// CLIENTE: 3 Secciones separadas
const CLIENT_NAV = [
    { name: 'En Curso', href: '/dashboard/client?view=in_progress', icon: PlayCircle },
    { name: 'Agendados', href: '/dashboard/client?view=scheduled', icon: CalendarClock },
    { name: 'Historial', href: '/dashboard/client?view=history', icon: History },
]

interface Props {
    role: 'admin' | 'cleaner' | 'client'
}

export default function DashboardMobileNav({ role }: Props) {
    const [isOpen, setIsOpen] = useState(false)
    const pathname = usePathname()
    const router = useRouter()
    const supabase = createClient()

    let navigation: any[] = []
    let themeClass = ''
    let bgClass = ''

    if (role === 'admin') {
        navigation = ADMIN_NAV
        themeClass = 'text-purple-600'
        bgClass = 'bg-purple-600'
    } else if (role === 'cleaner') {
        navigation = CLEANER_NAV
        themeClass = 'text-ocean-600'
        bgClass = 'bg-ocean-600'
    } else {
        navigation = CLIENT_NAV
        themeClass = 'text-ocean-600'
        bgClass = 'bg-ocean-600'
    }

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/login')
        router.refresh()
    }

    return (
        <div className="md:hidden bg-gray-900 text-white">
            <div className="flex items-center justify-between px-4 h-16 border-b border-gray-800">
                <div className="flex items-center gap-2">
                    <span className="font-bold text-lg tracking-tight">CleanerClub</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded border border-gray-700 bg-gray-800 ${themeClass.replace('text-', 'text-gray-300 ')}`}>
                        {role === 'client' ? 'CLIENTE' : role.toUpperCase()}
                    </span>
                </div>
                <button onClick={() => setIsOpen(true)} className="p-2 text-gray-300 hover:text-white">
                    <Menu className="w-6 h-6" />
                </button>
            </div>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex">
                    <div
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                        onClick={() => setIsOpen(false)}
                    />

                    <div className="relative flex-1 flex flex-col max-w-xs w-full bg-gray-900 h-full shadow-2xl">
                        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-800">
                            <span className="font-bold text-xl text-white">Menú</span>
                            <button onClick={() => setIsOpen(false)} className="p-2 text-gray-400 hover:text-white">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <nav className="flex-1 px-3 py-4 space-y-2 overflow-y-auto">
                            {navigation.map((item) => {
                                // Lógica para detectar activo con query params
                                const isMatch = pathname === item.href.split('?')[0] &&
                                    (item.href.includes('?') ? window.location.search.includes(item.href.split('?')[1]) : true)

                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        onClick={() => setIsOpen(false)}
                                        className={`flex items-center px-4 py-3 text-base font-medium rounded-xl transition-all ${
                                            isMatch
                                                ? `${bgClass} text-white shadow-lg`
                                                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                                        }`}
                                    >
                                        <item.icon className={`mr-3 h-5 w-5 ${isMatch ? 'text-white' : 'text-gray-500'}`} />
                                        {item.name}
                                    </Link>
                                )
                            })}
                        </nav>

                        <div className="p-4 border-t border-gray-800">
                            <button
                                onClick={handleLogout}
                                className="flex w-full items-center px-4 py-3 text-base font-medium text-red-400 rounded-xl hover:bg-gray-800 hover:text-red-300 transition-colors"
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