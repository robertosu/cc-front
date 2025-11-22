// components/admin/AdminSidebar.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    LayoutDashboard,
    Users,
    Briefcase,
    Settings,
    ChevronLeft,
    ChevronRight,
    Sparkles,
    Home
} from 'lucide-react'

interface AdminSidebarProps {
    profile: {
        full_name: string
        email: string
    }
}

const navigation = [
    { name: 'Dashboard', href: '/dashboard/admin', icon: LayoutDashboard },
    { name: 'Limpiezas', href: '/dashboard/admin/cleanings', icon: Briefcase },
    { name: 'Usuarios', href: '/dashboard/admin/users', icon: Users },
]

export default function AdminSidebar({ profile }: AdminSidebarProps) {
    const [collapsed, setCollapsed] = useState(false)
    const pathname = usePathname()

    return (
        <>
            {/* Sidebar Desktop */}
            <div className={`hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:flex-col transition-all duration-300 ${
                collapsed ? 'lg:w-20' : 'lg:w-64'
            }`}>
                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white border-r border-gray-200 px-6 pb-4">
                    {/* Logo y Toggle */}
                    <div className="flex h-16 shrink-0 items-center justify-between">
                        {!collapsed && (
                            <Link href="/" className="flex items-center gap-2">
                                <Sparkles className="w-8 h-8 text-purple-600" />
                                <span className="text-xl font-bold text-gray-900">CleanerClub</span>
                            </Link>
                        )}
                        <button
                            onClick={() => setCollapsed(!collapsed)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            {collapsed ? (
                                <ChevronRight className="w-5 h-5 text-gray-600" />
                            ) : (
                                <ChevronLeft className="w-5 h-5 text-gray-600" />
                            )}
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex flex-1 flex-col">
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
                                                    className={`group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 transition-colors ${
                                                        isActive
                                                            ? 'bg-purple-50 text-purple-600'
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

                            {/* Volver al inicio */}
                            <li className="mt-auto">
                                <Link
                                    href="/"
                                    className={`group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-purple-600 transition-colors ${
                                        collapsed ? 'justify-center' : ''
                                    }`}
                                >
                                    <Home className="h-6 w-6 shrink-0 text-gray-400 group-hover:text-purple-600" />
                                    {!collapsed && 'Volver al Inicio'}
                                </Link>
                            </li>

                            {/* User Info */}
                            {!collapsed && (
                                <li className="-mx-2 mt-auto">
                                    <div className="flex items-center gap-x-4 p-3 text-sm font-semibold leading-6 text-gray-900 bg-gray-50 rounded-lg">
                                        <div className="h-10 w-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold">
                                            {profile.full_name.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-gray-900 truncate">
                                                {profile.full_name}
                                            </p>
                                            <p className="text-xs text-gray-600 truncate">
                                                {profile.email}
                                            </p>
                                        </div>
                                    </div>
                                </li>
                            )}
                        </ul>
                    </nav>
                </div>
            </div>

            {/* Mobile Sidebar - Por implementar si lo necesitas */}
        </>
    )
}