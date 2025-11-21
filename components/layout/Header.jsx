

import { Sparkles, Menu, User } from "lucide-react"
import { createClient } from '@/utils/supabase/server'
import Link from "next/link";

export default async function Header() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    return (
        <header className="bg-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center space-x-2">
                        <Sparkles className="w-8 h-8 text-blue-400" />
                        <Link href="/" className="text-2xl font-bold text-gray-900">
                            CleanerClub
                        </Link>
                    </div>

                    <nav className="hidden md:flex items-center space-x-8">
                        <Link href="/" className="text-gray-700 hover:text-blue-600 transition-colors">
                            Inicio
                        </Link>
                        <Link href="/#services" className="text-gray-700 hover:text-blue-600 transition-colors">
                            Servicios
                        </Link>
                        <Link href="/#testimonials" className="text-gray-700 hover:text-blue-600 transition-colors">
                            Reseñas
                        </Link>

                        {user ? (
                            <Link
                                href="/dashboard"
                                className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors"
                            >
                                <User className="w-5 h-5" />
                                Dashboard
                            </Link>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Link
                                    href="/login"
                                    className="text-gray-700 hover:text-blue-600 transition-colors"
                                >
                                    Iniciar Sesión
                                </Link>
                                <Link
                                    href="/register"
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Registrarse
                                </Link>
                            </div>
                        )}
                    </nav>
                </div>
            </div>
        </header>
    )
}