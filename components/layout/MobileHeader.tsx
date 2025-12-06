'use client'

import { Sparkles, User, Menu, X } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"

interface MobileHeaderProps {
    user: unknown | null
}

export default function MobileHeader({ user }: MobileHeaderProps) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    // Cerrar el menú cuando cambia el tamaño de pantalla
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setIsMobileMenuOpen(false)
            }
        }

        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    // Prevenir scroll cuando el menú está abierto
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }

        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isMobileMenuOpen])

    return (
        <>
            <header className="bg-white shadow-lg sticky top-0 z-50">
                <div className="px-4">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <Link href="/" className="flex items-center space-x-2">
                            <Sparkles className="w-6 h-6 text-cyan-400" />
                            <span className="text-xl font-bold text-gray-900">CleanerClub</span>
                        </Link>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                            aria-label="Toggle menu"
                        >
                            {isMobileMenuOpen ? (
                                <X className="w-6 h-6 text-gray-700" />
                            ) : (
                                <Menu className="w-6 h-6 text-gray-700" />
                            )}
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Mobile Menu */}
            <div
                className={`
          fixed top-16 right-0 bottom-0 w-64 bg-white shadow-xl z-50
          transform transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
            >
                <nav className="flex flex-col p-6 space-y-4">
                    <Link
                        href="/"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-gray-700 hover:text-cyan-400 transition-colors py-2 text-lg"
                    >
                        Inicio
                    </Link>
                    <Link
                        href="/#services"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-gray-700 hover:text-cyan-400 transition-colors py-2 text-lg"
                    >
                        Servicios
                    </Link>
                    <Link
                        href="/#testimonials"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-gray-700 hover:text-cyan-400 transition-colors py-2 text-lg"
                    >
                        Reseñas
                    </Link>

                    <div className="border-t border-gray-200 pt-4 mt-4">
                        {user ? (
                            <Link
                                href="/dashboard"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="flex items-center gap-2 text-gray-700 hover:text-cyan-400 transition-colors py-2 text-lg"
                            >
                                <User className="w-5 h-5" />
                                Dashboard
                            </Link>
                        ) : (
                            <div className="space-y-3">
                                <Link
                                    href="/login"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="block w-full text-center text-gray-700 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-lg"
                                >
                                    Iniciar Sesión
                                </Link>
                                <Link
                                    href="/register"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="block w-full text-center bg-cyan-400 text-white px-4 py-2 rounded-lg hover:bg-cyan-700 transition-colors text-lg font-semibold"
                                >
                                    Registrarse
                                </Link>
                            </div>
                        )}
                    </div>
                </nav>
            </div>
        </>
    )
}