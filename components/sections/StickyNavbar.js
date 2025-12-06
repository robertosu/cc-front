'use client'

import {useEffect, useRef, useState} from 'react'

export default function StickyNavbar() {
    const [isVisible, setIsVisible] = useState(false)
    const triggerElementRef = useRef(null)

    useEffect(() => {
        const handleScroll = () => {
            if (triggerElementRef.current) {
                const elementRect = triggerElementRef.current.getBoundingClientRect()
                // El navbar sticky aparece cuando el elemento trigger desaparece completamente
                setIsVisible(elementRect.bottom < 0)
            }
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <>

            {/* 🎯 ELEMENTO TRIGGER - Este es el que "observamos" */}
            <section

                className="bg-cyan-400 text-white py-16"
            >
                <div className="max-w-7xl mx-auto px-4 text-center">

                    <h2 className="text-3xl font-bold mb-6">Limpieza Profesional a tu Alcance</h2>
                    <p className="text-lg mb-8">
                        Servicios de limpieza de alta calidad para tu hogar o negocio.
                        Profesionales certificados, productos ecológicos y precios competitivos.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center"
                         ref={triggerElementRef}>
                        <button className="bg-white text-cyan-400 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-md">
                            Ver Servicios
                        </button>
                        <button className="border-2 border-white text-white px-6 py-2 rounded-lg font-semibold hover:bg-white hover:text-cyan-400 transition-colors">
                            Solicitar Presupuesto
                        </button>
                    </div>
                </div>
            </section>


            {/* 🚀 NAVBAR STICKY - Aparece cuando el elemento trigger desaparece */}
            <nav className={`
                fixed top-0 w-full z-50 
                bg-cyan-400/95 backdrop-blur-sm shadow-lg
                transition-all duration-300 ease-in-out
                ${isVisible
                ? 'translate-y-0 opacity-100'
                : '-translate-y-full opacity-0'
            }
            `}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-row sm:flex-row gap-4 justify-center py-4">
                        <button className="bg-white text-cyan-400 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-md">
                            Ver Servicios
                        </button>
                        <button className="border-2 border-white text-white px-6 py-2 rounded-lg font-semibold hover:bg-white hover:text-cyan-400 transition-colors">
                            Solicitar Presupuesto
                        </button>
                    </div>
                </div>
            </nav>
        </>
    )
}