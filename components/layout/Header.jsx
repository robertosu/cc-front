'use client' // 1. Agrega esto para poder usar useState

import { useState } from 'react' // 2. Importar useState
import { Sparkles, User, Menu, X } from "lucide-react" // 3. Importar iconos Menu y X
import { createClient } from '@/utils/supabase/client' // Nota: Cambia a client client si usas hooks
import Link from "next/link";

export default function Header() {
    // Estado para el menú móvil
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    // Nota: En un componente cliente, usa createClient del cliente, no del server
    // Si necesitas validar sesión en header, es mejor pasar el usuario como prop o usar un contexto
    // Por ahora asumo que user viene de props o contexto para simplificar la UI
    const user = null; // Obtener usuario de la forma adecuada para Client Components

    return (
        <header className="bg-white shadow-lg relative z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex items-center space-x-2">
                        <Sparkles className="w-8 h-8 text-teal-400" />
                        <Link href="/" className="text-2xl font-bold text-gray-900">
                            CleanerClub
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-8">
                        <Link href="/" className="text-gray-700 hover:text-teal-400 transition-colors">Inicio</Link>
                        <Link href="/#services" className="text-gray-700 hover:text-teal-400 transition-colors">Servicios</Link>
                        <Link href="/#testimonials" className="text-gray-700 hover:text-teal-400 transition-colors">Reseñas</Link>

                        {user ? (
                            <Link href="/dashboard" className="flex items-center gap-2 text-gray-700 hover:text-teal-400 transition-colors">
                                <User className="w-5 h-5" /> Dashboard
                            </Link>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Link href="/login" className="text-gray-700 hover:text-teal-400 transition-colors">Iniciar Sesión</Link>
                                <Link href="/register" className="bg-teal-400 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors">Registrarse</Link>
                            </div>
                        )}
                    </nav>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-2 text-gray-600 hover:text-gray-900"
                        >
                            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-16 left-0 w-full bg-white border-t border-gray-100 shadow-lg py-4 px-4 flex flex-col space-y-4">
                    <Link
                        href="/"
                        className="text-gray-700 py-2 hover:text-teal-400"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        Inicio
                    </Link>
                    <Link
                        href="/#services"
                        className="text-gray-700 py-2 hover:text-teal-400"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        Servicios
                    </Link>
                    <Link
                        href="/#testimonials"
                        className="text-gray-700 py-2 hover:text-teal-400"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        Reseñas
                    </Link>
                    <hr className="border-gray-200" />
                    {user ? (
                        <Link
                            href="/dashboard"
                            className="flex items-center gap-2 text-gray-700 py-2 font-medium"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <User className="w-5 h-5" /> Dashboard
                        </Link>
                    ) : (
                        <div className="flex flex-col gap-3 pt-2">
                            <Link
                                href="/login"
                                className="text-center text-gray-700 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Iniciar Sesión
                            </Link>
                            <Link
                                href="/register"
                                className="text-center bg-teal-400 text-white px-4 py-2 rounded-lg hover:bg-teal-700"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Registrarse
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </header>
    )
}