'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useSearchParams, useRouter } from 'next/navigation'
import { PlayCircle, CalendarClock, History, LogOut } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'

export default function ClientSidebar() {
    const searchParams = useSearchParams()
    // Default a 'in_progress' si no hay view
    const currentView = searchParams.get('view') || 'in_progress'
    const router = useRouter()
    const supabase = createClient()

    const navigation = [
        {
            name: 'En Curso',
            href: '/dashboard/client?view=in_progress',
            icon: PlayCircle,
            active: currentView === 'in_progress'
        },
        {
            name: 'Agendados',
            href: '/dashboard/client?view=scheduled',
            icon: CalendarClock,
            active: currentView === 'scheduled'
        },
        {
            name: 'Historial',
            href: '/dashboard/client?view=history',
            icon: History,
            active: currentView === 'history'
        },
    ]

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/login')
        router.refresh()
    }

    return (
        <div className="flex flex-col h-full bg-gray-900 text-white w-64 flex-shrink-0">
            {/* LOGO AREA */}
            <div className="flex items-center justify-center h-24 px-6 bg-gray-950 border-b border-gray-800">
                <div className="relative w-full h-12">
                    {/* Ajusta src="/logoprincipal.png" a tu archivo de logo real */}
                    <Image
                        src="/logoprincipal.png"
                        alt="CleanerClub Logo"
                        fill
                        className="object-contain object-left"
                        priority
                    />
                </div>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-2">
                {navigation.map((item) => (
                    <Link
                        key={item.name}
                        href={item.href}
                        className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group ${
                            item.active
                                ? 'bg-ocean-600 text-white shadow-lg shadow-ocean-900/20'
                                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                        }`}
                    >
                        <item.icon className={`mr-3 h-5 w-5 transition-colors ${
                            item.active ? 'text-white' : 'text-gray-500 group-hover:text-white'
                        }`} />
                        {item.name}
                    </Link>
                ))}
            </nav>

            <div className="p-4 bg-gray-950 border-t border-gray-800">
                <div className="mb-4 px-2">
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Tu Cuenta</p>
                </div>
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