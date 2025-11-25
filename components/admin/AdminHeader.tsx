// components/admin/AdminHeader.tsx
'use client'

import {Bell} from 'lucide-react'
import LogoutButton from '@/components/auth/LogoutButton'

interface AdminHeaderProps {
    profile: {
        full_name: string
        email: string
    }
}

export default function AdminHeader({ profile }: AdminHeaderProps) {
    return (
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
            {/* Mobile menu button - Por implementar */}
            <button type="button" className="-m-2.5 p-2.5 text-gray-700 lg:hidden">
                <span className="sr-only">Open sidebar</span>
            </button>

            {/* Separator */}
            <div className="h-6 w-px bg-gray-200 lg:hidden" />

            <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
                {/* Search - Placeholder para búsqueda global si la necesitas */}
                <div className="flex flex-1"></div>

                <div className="flex items-center gap-x-4 lg:gap-x-6">
                    {/* Notifications */}
                    <button type="button" className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500">
                        <span className="sr-only">View notifications</span>
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