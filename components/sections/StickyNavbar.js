// components/layout/StickyNavbar.js
'use client'

import { useState, useEffect } from 'react'
import { Sparkles, Menu, X } from 'lucide-react'

export default function StickyNavbar() {
    const [isScrolled, setIsScrolled] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    // Detectar scroll para cambiar el estilo del navbar
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50)
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
            isScrolled
                ? 'bg-white/95 backdrop-blur-md shadow-lg py-2'
                : 'bg-gradient-to-br from-blue-600 to-blue-800 py-4'
        }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center">

                    {/* Logo */}
                    <div className="flex items-center space-x-2">
                        <Sparkles className={`w-8 h-8 transition-colors ${
                            isScrolled ? 'text-blue-600' : 'text-white'
                        }`} />
                        <span className={`text-2xl font-bold transition-colors ${
                            isScrolled ? 'text-gray-900' : 'text-white'
                        }`}>
                            CleanerClub
                        </span>
                    </div>

                    {/* Navegación Desktop */}
                    <div className="hidden lg:flex items-center space-x-8">
                        <a
                            href="#inicio"
                            className={`transition-colors hover:opacity-80 ${
                                isScrolled ? 'text-gray-700' : 'text-white'
                            }`}
                        >
                            Inicio
                        </a>
                        <a
                            href="#services"
                            className={`transition-colors hover:opacity-80 ${
                                isScrolled ? 'text-gray-700' : 'text-white'
                            }`}
                        >
                            Servicios
                        </a>
                        <a
                            href="#testimonials"
                            className={`transition-colors hover:opacity-80 ${
                                isScrolled ? 'text-gray-700' : 'text-white'
                            }`}
                        >
                            Testimonios
                        </a>
                    </div>

                    {/* Botones de acción del Hero */}
                    <div className="hidden lg:flex items-center space-x-4">
                        <button className={`px-6 py-2 rounded-lg font-semibold transition-all transform hover:scale-105 ${
                            isScrolled
                                ? 'bg-blue-600 text-white hover:bg-blue-700'
                                : 'bg-white text-blue-600 hover:bg-gray-100'
                        }`}>
                            Ver Servicios
                        </button>

                        <button className={`px-6 py-2 rounded-lg font-semibold transition-all transform hover:scale-105 ${
                            isScrolled
                                ? 'border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white'
                                : 'border-2 border-white text-white hover:bg-white hover:text-blue-600'
                        }`}>
                            Presupuesto
                        </button>
                    </div>

                    {/* Botón menú móvil */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className={`lg:hidden p-2 rounded-md transition-colors ${
                            isScrolled ? 'text-gray-700' : 'text-white'
                        }`}
                    >
                        {isMobileMenuOpen ? (
                            <X className="w-6 h-6" />
                        ) : (
                            <Menu className="w-6 h-6" />
                        )}
                    </button>
                </div>

                {/* Menú móvil */}
                {isMobileMenuOpen && (
                    <div className={`lg:hidden mt-4 py-4 border-t transition-colors ${
                        isScrolled ? 'border-gray-200' : 'border-white/20'
                    }`}>
                        <div className="flex flex-col space-y-4">
                            {/* Enlaces */}
                            <a
                                href="#inicio"
                                className={`transition-colors ${
                                    isScrolled ? 'text-gray-700' : 'text-white'
                                }`}
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Inicio
                            </a>
                            <a
                                href="#services"
                                className={`transition-colors ${
                                    isScrolled ? 'text-gray-700' : 'text-white'
                                }`}
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Servicios
                            </a>
                            <a
                                href="#testimonials"
                                className={`transition-colors ${
                                    isScrolled ? 'text-gray-700' : 'text-white'
                                }`}
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Testimonios
                            </a>

                            {/* Botones móviles */}
                            <div className="flex flex-col space-y-3 pt-4">
                                <button className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                                    isScrolled
                                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                                        : 'bg-white text-blue-600 hover:bg-gray-100'
                                }`}>
                                    Ver Servicios
                                </button>

                                <button className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                                    isScrolled
                                        ? 'border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white'
                                        : 'border-2 border-white text-white hover:bg-white hover:text-blue-600'
                                }`}>
                                    Solicitar Presupuesto
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    )
}

/*
📝 CONCEPTOS APLICADOS:

✅ CLIENT COMPONENT: 'use client' para usar hooks
✅ useState: Para manejar estado del menú móvil y scroll
✅ useEffect: Para detectar scroll y limpiar event listeners
✅ Conditional styling: Cambio de colores según scroll
✅ Responsive: hidden lg:flex para diferentes breakpoints
✅ Transitions: Animaciones suaves en todos los cambios
✅ Event handling: onClick para menú móvil
✅ Backdrop blur: Para efecto glassmorphism cuando scrolleas
✅ Transform hover: hover:scale-105 para microinteracciones
✅ Fixed positioning: Para que se mantenga arriba

🚀 CARACTERÍSTICAS NUEVAS:
- Cambia de azul degradado a blanco glassmorphism al hacer scroll
- Menú hamburguesa funcional en móvil
- Botones del hero integrados en el navbar
- Efectos hover con escalado
- Backdrop blur moderno
- Z-index alto para mantenerse encima
*/