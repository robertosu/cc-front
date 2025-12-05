'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronLeft, ChevronRight, ClipboardList, Home, LayoutDashboard, Plus, Sparkles, Users, X } from 'lucide-react'
import { useSidebar } from '@/components/providers/SidebarContext' // Importar hook

// ... interfaces y navigation array igual que antes ...
interface AdminSidebarProps {
    profile: {
        full_name: string
        email: string
    }
}
const navigation = [
    { name: 'Dashboard', href: '/dashboard/admin', icon: LayoutDashboard },
    { name: 'Limpiezas', href: '/dashboard/admin/cleanings', icon: ClipboardList },
    { name: 'Nueva Limpieza', href: '/dashboard/admin/cleanings/create', icon: Plus, highlight: true },
    { name: 'Usuarios', href: '/dashboard/admin/users', icon: Users },
]

export default function AdminSidebar({ profile }: AdminSidebarProps) {
    const [collapsed, setCollapsed] = useState(false)
    const pathname = usePathname()
    const { isOpen, close } = useSidebar() // Consumir contexto

    // Componente interno para reutilizar la lista de navegación
    const NavContent = () => (
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
                <ul role="list" className="-mx-2 space-y-1">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href ||
                            (item.href !== '/dashboard/admin' && pathname.startsWith(item.href))

                        return (
                            <li key={item.name}>
                                <Link
                                    href={item.href}
                                    onClick={() => close()} // Cerrar al hacer click en móvil
                                    className={`group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 transition-colors ${
                                        isActive
                                            ? 'bg-purple-50 text-purple-600'
                                            : item.highlight
                                                ? 'text-purple-600 hover:bg-purple-50'
                                                : 'text-gray-700 hover:text-purple-600 hover:bg-gray-50'
                                    } ${collapsed ? 'justify-center' : ''}`}
                                >
                                    <item.icon className={`h-6 w-6 shrink-0 ${
                                        isActive ? 'text-purple-600' : 'text-gray-400 group-hover:text-purple-600'
                                    }`} />
                                    {!collapsed && item.name}
                                </Link>
                            </li>
                        )
                    })}
                </ul>
            </li>
            <li className="mt-auto">
                <Link
                    href="/"
                    className={`group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-purple-600 transition-colors ${collapsed ? 'justify-center' : ''}`}
                >
                    <Home className="h-6 w-6 shrink-0 text-gray-400 group-hover:text-purple-600" />
                    {!collapsed && 'Volver al Inicio'}
                </Link>
            </li>
        </ul>
    )

    return (
        <>
            {/* MOBILE SIDEBAR (Overlay + Drawer) */}
            {isOpen && (
                <div className="relative z-50 lg:hidden" role="dialog" aria-modal="true">
                    {/* Backdrop oscuro */}
                    <div className="fixed inset-0 bg-gray-900/80 transition-opacity" onClick={close} />

                    <div className="fixed inset-0 flex">
                        {/* Panel deslizante */}
                        <div className="relative mr-16 flex w-full max-w-xs flex-1 transition-transform duration-300 ease-in-out bg-white">
                            <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                                <button type="button" className="-m-2.5 p-2.5" onClick={close}>
                                    <span className="sr-only">Close sidebar</span>
                                    <X className="h-6 w-6 text-white" aria-hidden="true" />
                                </button>
                            </div>

                            {/* Contenido del Mobile Sidebar */}
                            <div className="flex grow flex-col gap-y-5 overflow-y-auto px-6 pb-4">
                                <div className="flex h-16 shrink-0 items-center gap-2">
                                    <Sparkles className="w-8 h-8 text-purple-600" />
                                    <span className="text-xl font-bold text-gray-900">CleanerClub</span>
                                </div>
                                <nav className="flex flex-1 flex-col">
                                    <NavContent />
                                    {/* User info mobile */}
                                    <div className="mt-auto -mx-2 flex items-center gap-x-4 p-3 text-sm font-semibold leading-6 text-gray-900 bg-gray-50 rounded-lg">
                                        <div className="h-10 w-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold">
                                            {profile.full_name.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="truncate">{profile.full_name}</p>
                                            <p className="text-xs text-gray-600 truncate">{profile.email}</p>
                                        </div>
                                    </div>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* DESKTOP SIDEBAR (Existente, con lógica de collapse) */}
            <div className={`hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:flex-col transition-all duration-300 ${
                collapsed ? 'lg:w-20' : 'lg:w-64'
            }`}>
                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white border-r border-gray-200 px-6 pb-4">
                    <div className="flex h-16 shrink-0 items-center justify-between">
                        {!collapsed && (
                            <Link href="/" className="flex items-center gap-2">
                                <Sparkles className="w-8 h-8 text-purple-600" />
                                <span className="text-xl font-bold text-gray-900">CleanerClub</span>
                            </Link>
                        )}
                        <button onClick={() => setCollapsed(!collapsed)} className="p-2 hover:bg-gray-100 rounded-lg">
                            {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
                        </button>
                    </div>
                    <nav className="flex flex-1 flex-col">
                        <NavContent />
                        {!collapsed && (
                            <li className="-mx-2 mt-auto list-none">
                                <div className="flex items-center gap-x-4 p-3 text-sm font-semibold leading-6 text-gray-900 bg-gray-50 rounded-lg">
                                    <div className="h-10 w-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold">
                                        {profile.full_name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="truncate">{profile.full_name}</p>
                                        <p className="text-xs text-gray-600 truncate">{profile.email}</p>
                                    </div>
                                </div>
                            </li>
                        )}
                    </nav>
                </div>
            </div>
        </>
    )
}