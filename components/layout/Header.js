'use client'

import { Sparkles, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Header() {

    const [isMenuOpen, setIsMenuOpen] = useState(false);

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

                    {/* Navegación de escritorio */}
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
                                href="#"
                                className="block px-3 py-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 transition-colors"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Inicio
                            </a>
                            <a
                                href="#"
                                className="block px-3 py-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 transition-colors"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Servicios
                            </a>
                            <a
                                href="#"
                                className="block px-3 py-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 transition-colors"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Presupuesto
                            </a>
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
}

/*
📝 CAMBIOS REALIZADOS:
- Agregado 'use client' para usar estado (useState)
- Botón hamburguesa que aparece solo en móvil (md:hidden)
- Estado para controlar si el menú está abierto
- Menú desplegable que se muestra solo en móvil cuando isMenuOpen es true
- Los enlaces del menú móvil cierran el menú al hacer clic
- Iconos X y Menu de lucide-react para el botón
- Navegación responsive completa

🔧 FUNCIONALIDADES:
- En escritorio: menú horizontal normal
- En móvil: botón hamburguesa + menú desplegable
- Transiciones suaves y hover effects
- Accesibilidad con aria-label
*/