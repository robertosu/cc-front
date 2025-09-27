// app/components/layout/Header.js

import {Sparkles} from "lucide-react";

export default function Header() {
    return (
        <header className="bg-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex items-center space-x-2">
                        <Sparkles className="w-8 h-8 text-blue-400" />
                        <span className="text-2xl font-bold text-gray-900">
              CleanerClub
            </span>
                    </div>

                    {/* Navegación básica */}
                    <nav className="hidden md:flex space-x-8">
                        <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors">
                            Inicio
                        </a>
                        <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors">
                            Servicios
                        </a>
                        <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors">
                            Presupuesto
                        </a>
                    </nav>

                    {/* Botón de contacto */}
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                        Contactar
                    </button>
                </div>
            </div>
        </header>
    )
}

/*
📝 NOTA:
- Es un Server Component (sin 'use client')
- Solo HTML y CSS, sin interactividad aún
- Responsive con clases de Tailwind (hidden md:flex)
- Usa max-w-7xl para limitar el ancho
*/