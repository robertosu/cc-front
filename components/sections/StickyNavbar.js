'use client'

import {useEffect, useRef, useState} from 'react'

export default function StickyNavbar() {
    const [isVisible, setIsVisible] = useState(false)
    const triggerElementRef = useRef(null)

    useEffect(() => {
        const handleScroll = () => {
            if (triggerElementRef.current) {
                const elementRect = triggerElementRef.current.getBoundingClientRect()
                setIsVisible(elementRect.bottom < 0)
            }
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <>
            {/* 🎯 SECCIÓN HERO (ORIGINAL) */}
            <section className="relative text-white py-24 overflow-hidden">
                {/* Capa 1: Imagen Fondo */}
                <div
                    className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transform scale-105"
                    style={{ backgroundImage: "url('/hero-bg.jpg')" }}
                />
                {/* Capa 2: Overlay */}
                <div className="absolute inset-0 z-0 bg-ocean-900/80"></div>

                {/* Capa 3: Contenido */}
                <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
                        Limpieza Profesional a tu Alcance
                    </h2>
                    <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto text-ocean-50">
                        Servicios de limpieza de alta calidad para tu hogar o negocio.
                        Profesionales certificados, productos ecológicos y precios competitivos.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center" ref={triggerElementRef}>
                        <button className="bg-white text-ocean-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                            Ver Servicios
                        </button>
                        <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-bold hover:bg-white hover:text-ocean-600 transition-all backdrop-blur-sm">
                            Solicitar Presupuesto
                        </button>
                    </div>
                </div>
            </section>

            {/* 🚀 NAVBAR STICKY (Ahora con fondo de imagen) */}
            <nav className={`
                fixed top-0 w-full z-50 
                shadow-xl border-b border-white/10 overflow-hidden
                transition-all duration-300 ease-in-out
                ${isVisible
                ? 'translate-y-0 opacity-100'
                : '-translate-y-full opacity-0'
            }
            `}>
                {/* --- CAPA 1: IMAGEN DE FONDO (Navbar) --- */}
                {/* Usamos la misma imagen. 'bg-center' o 'bg-bottom' suelen verse bien en tiras delgadas */}
                <div
                    className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: "url('/hero-bg.jpg')" }}
                />

                {/* --- CAPA 2: OVERLAY (Navbar) --- */}
                {/* Un poco más opaco (90%) para asegurar legibilidad máxima en tamaño reducido */}
                <div className="absolute inset-0 z-0 bg-ocean-900/80 backdrop-blur-sm"></div>

                {/* --- CAPA 3: CONTENIDO (Botones) --- */}
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-row sm:flex-row gap-4 justify-center py-4">
                        <button className="bg-white text-ocean-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-50 transition-colors shadow-md text-sm">
                            Ver Servicios
                        </button>
                        <button className="border-2 border-white text-white px-6 py-2 rounded-lg font-semibold hover:bg-white hover:text-ocean-600 transition-colors text-sm">
                            Solicitar Presupuesto
                        </button>
                    </div>
                </div>
            </nav>
        </>
    )
}