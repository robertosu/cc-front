'use client'

import {useState} from 'react'
import {useRouter} from 'next/navigation'
import {LogOut} from 'lucide-react'

export default function LogoutButton() {
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const handleLogout = async () => {
        setIsLoading(true)

        try {
            await fetch('/api/auth/logout', { method: 'POST' })
            router.push('/')
            router.refresh()
        } catch (error) {
            console.error('Error al cerrar sesión:', error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <button
            onClick={handleLogout}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
            <LogOut className="w-4 h-4" />
            {isLoading ? 'Cerrando...' : 'Cerrar Sesión'}
        </button>
    )
}