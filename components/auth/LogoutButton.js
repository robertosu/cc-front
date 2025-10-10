'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { LogOut } from 'lucide-react'

export default function LogoutButton() {
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    const handleLogout = async () => {
        setIsLoading(true)

        try {
            await supabase.auth.signOut()
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

/*
📝 FUNCIONALIDAD:
✅ Cierra la sesión en Supabase
✅ Redirige al home
✅ Refresca el router para limpiar el estado
✅ Loading state
✅ Icono de Lucide React
*/