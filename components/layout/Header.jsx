'use client'

import { useState, useEffect } from 'react'
import { Sparkles, User, Menu, X } from "lucide-react"
import { createClient } from '@/utils/supabase/client'
import Link from "next/link";
import Image from "next/image";

export default function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [user, setUser] = useState(null)
    const supabase = createClient()

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            setUser(user)
        }
        checkUser()

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null)
        })

        return () => subscription.unsubscribe()
    }, [])

    return (
        <header className="bg-white shadow-lg relative z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex items-center space-x-2">
                        <Link href="/">
                            <Image
                                src="/logo3.png"
                                alt="Cleaner Club Logo"
                                width={256}
                                height={256}
                                className="rounded cursor-pointer"
                            />
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-8">
                        <Link href="/" className="text-gray-700 hover:text-ocean-600 transition-colors">
                            Inicio
                        </Link>

                        {/* NUEVO LINK AGREGADO */}
                        <Link href="/quienes-somos" className="text-gray-700 hover:text-ocean-600 transition-colors">
                            Quienes somos
                        </Link>

                        <Link href="/#services" className="text-gray-700 hover:text-ocean-600 transition-colors">
                            Servicios
                        </Link>

                        {user ? (
                            <Link
                                // Optimización de ruta directa si tienes el rol en metadata
                                href={user.user_metadata?.role ? `/dashboard/${user.user_metadata.role}` : '/dashboard'}
                                className="flex items-center gap-2 text-gray-700 hover:text-ocean-600 transition-colors font-medium"
                            >
                                <User className="w-5 h-5" /> Dashboard
                            </Link>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Link
                                    href="/login"
                                    className="text-gray-700 hover:text-ocean-600 transition-colors font-medium"
                                >
                                    Iniciar Sesión
                                </Link>
                                <Link
                                    href="/register"
                                    className="bg-ocean-400 text-white px-4 py-2 rounded-lg hover:bg-ocean-600 transition-colors font-medium"
                                >
                                    Registrarse
                                </Link>
                            </div>
                        )}
                    </nav>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-2 text-gray-600 hover:text-gray-900"
                            aria-label={isMobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
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
                        className="text-gray-700 py-2 hover:text-ocean-600 font-medium"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        Inicio
                    </Link>

                    {/* NUEVO LINK EN MÓVIL */}
                    <Link
                        href="/about"
                        className="text-gray-700 py-2 hover:text-ocean-600 font-medium"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        Quienes somos
                    </Link>

                    <Link
                        href="/#services"
                        className="text-gray-700 py-2 hover:text-ocean-600 font-medium"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        Servicios
                    </Link>

                    <hr className="border-gray-200" />

                    {user ? (
                        <Link
                            href={user.user_metadata?.role ? `/dashboard/${user.user_metadata.role}` : '/dashboard'}
                            className="flex items-center gap-2 text-gray-700 py-2 font-medium hover:text-ocean-600"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <User className="w-5 h-5" /> Dashboard
                        </Link>
                    ) : (
                        <div className="flex flex-col gap-3 pt-2">
                            <Link
                                href="/login"
                                className="text-center text-gray-700 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 font-medium"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Iniciar Sesión
                            </Link>
                            <Link
                                href="/register"
                                className="text-center bg-ocean-400 text-white px-4 py-2 rounded-lg hover:bg-ocean-600 font-medium"
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