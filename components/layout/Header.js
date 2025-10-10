'use client'

import { Sparkles, Menu, X, User } from "lucide-react"
import { useState, useEffect } from "react"
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [user, setUser] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        // Obtener usuario actual
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            setUser(user)
            setIsLoading(false)
        }

        getUser()

        // Suscribirse a cambios de autenticación
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null)
        })

        return () => subscription.unsubscribe()
    }, [])

    return (
        <header className="bg-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex items-center space-x-2">
                        <Sparkles className="w-8 h-8 text-blue-400" />
                        <a href="/" className="text-2xl font-bold text-gray-900">
                            CleanerClub
                        </a>
                    </div>

                    {/* Navegación de escritorio */}
                    <nav className="hidden md:flex items-center space-x-8">
                        <a href="/" className="text-gray-700 hover:text-blue-600 transition-colors">
                            Inicio
                        </a>
                        <a href="/#services" className="text-gray-700 hover:text-blue-600 transition-colors">
                            Servicios
                        </a>
                        <a href="/#testimonials" className="text-gray-700 hover:text-blue-600 transition-colors">
                            Reseñas
                        </a>

                        {/* Mostrar enlaces según estado de autenticación */}
                        {!isLoading && (
                            <>
                                {user ? (
                                    <div className="flex items-center gap-4">
                                        <a
                                            href="/dashboard"
                                            className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors"
                                        >
                                            <User className="w-5 h-5" />
                                            Dashboard
                                        </a>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-4">
                                        <a
                                            href="/login"
                                            className="text-gray-700 hover:text-blue-600 transition-colors"
                                        >
                                            Iniciar Sesión
                                        </a>
                                        <a
                                            href="/register"
                                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                        >
                                            Registrarse
                                        </a>
                                    </div>
                                )}
                            </>
                        )}
                    </nav>

                    {/* Botón menú hamburguesa (solo móvil) */}
                    <button
                        className="md:hidden p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 transition-colors"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="Abrir menú"
                    >
                        {isMenuOpen ? (
                            <X className="w-6 h-6" />
                        ) : (
                            <Menu className="w-6 h-6" />
                        )}
                    </button>
                </div>

                {/* Menú móvil desplegable */}
                {isMenuOpen && (
                    <div className="md:hidden border-t border-gray-200 bg-white">
                        <nav className="px-2 pt-2 pb-3 space-y-1">
                            <a
                                href="/"
                                className="block px-3 py-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 transition-colors"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Inicio
                            </a>
                            <a
                                href="/#services"
                                className="block px-3 py-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 transition-colors"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Servicios
                            </a>
                            <a
                                href="/#testimonials"
                                className="block px-3 py-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 transition-colors"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Reseñas
                            </a>

                            {/* Enlaces de autenticación en móvil */}
                            {!isLoading && (
                                <>
                                    {user ? (
                                        <a
                                            href="/dashboard"
                                            className="block px-3 py-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 transition-colors"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            Dashboard
                                        </a>
                                    ) : (
                                        <>
                                            <a
                                                href="/login"
                                                className="block px-3 py-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 transition-colors"
                                                onClick={() => setIsMenuOpen(false)}
                                            >
                                                Iniciar Sesión
                                            </a>
                                            <a
                                                href="/register"
                                                className="block px-3 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                                                onClick={() => setIsMenuOpen(false)}
                                            >
                                                Registrarse
                                            </a>
                                        </>
                                    )}
                                </>
                            )}
                        </nav>
                    </div>
                )}
            </div>
        </header>
    )
}

/*
📝 NUEVAS CARACTERÍSTICAS:
✅ Detecta si hay usuario autenticado
✅ Muestra "Dashboard" si está logueado
✅ Muestra "Iniciar Sesión / Registrarse" si no lo está
✅ Se actualiza en tiempo real al cambiar el estado de auth
✅ Funciona tanto en desktop como móvil
✅ Loading state para evitar flickering
*/