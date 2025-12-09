'use client'

import { useEffect, useRef, useState } from 'react'
import { Users, Star, Home } from 'lucide-react'

// 🔢 Componente contador (Animación suave)
function AnimatedCounter({ end, duration = 2000 }) {
    const [count, setCount] = useState(0)
    const ref = useRef(null)
    const [hasAnimated, setHasAnimated] = useState(false)

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !hasAnimated) {
                    let startTime = null
                    const animate = (timestamp) => {
                        if (!startTime) startTime = timestamp
                        const progress = timestamp - startTime
                        const percentage = Math.min(progress / duration, 1)
                        const easeOut = (x) => (x === 1 ? 1 : 1 - Math.pow(2, -10 * x))

                        setCount(Math.floor(easeOut(percentage) * end))

                        if (progress < duration) {
                            window.requestAnimationFrame(animate)
                        }
                    }
                    window.requestAnimationFrame(animate)
                    setHasAnimated(true)
                }
            },
            { threshold: 0.5 }
        )

        if (ref.current) {
            observer.observe(ref.current)
        }

        return () => observer.disconnect()
    }, [end, duration, hasAnimated])

    return <span ref={ref}>{count}</span>
}

export default function StickyNavbar() {
    const [isVisible, setIsVisible] = useState(false)
    const sectionRef = useRef(null) // 1. Cambiamos la referencia para apuntar a la SECCIÓN completa

    useEffect(() => {
        const handleScroll = () => {
            if (sectionRef.current) {
                const elementRect = sectionRef.current.getBoundingClientRect()

                // 2. Lógica ajustada:
                // Solo mostrar la barra cuando el borde INFERIOR de la hero section (< 0)
                // haya pasado completamente hacia arriba de la pantalla.
                setIsVisible(elementRect.bottom < 0)
            }
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <>
            {/* 3. Asignamos la ref aquí, al contenedor padre */}
            <section
                ref={sectionRef}
                className="relative text-white min-h-[90vh] flex flex-col justify-center overflow-hidden pt-20 pb-12"
            >

                {/* Capa 1: Imagen Fondo */}
                <div
                    className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transform scale-105"
                    style={{ backgroundImage: "url('/hero-bg.jpg')" }}
                />

                {/* Capa 2: Overlay */}
                <div className="absolute inset-0 z-0 bg-gradient-to-b from-ocean-900/80 via-ocean-900/70 to-ocean-900/90"></div>

                {/* Capa 3: Contenido Principal */}
                <div className="relative z-10 max-w-7xl mx-auto px-4 text-center flex-grow flex flex-col justify-center">

                    {/* Texto Hero */}
                    <div className="mb-12">
                        <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight leading-tight drop-shadow-lg">
                            Limpieza Profesional <br className="hidden md:block"/> a tu Alcance
                        </h2>
                        <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto text-ocean-50 font-light drop-shadow-md">
                            Servicios de limpieza a domicilio en La Serena, Coquimbo y alrededores.

                            Limpieza profesional para hogares o negocios.
                        </p>

                        {/* Botones de Acción */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button className="bg-white text-ocean-600 px-8 py-3 rounded-xl font-bold hover:bg-ocean-50 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                                Ver Servicios
                            </button>
                            <button className="border-2 border-white text-white px-8 py-3 rounded-xl font-bold hover:bg-white/10 transition-all backdrop-blur-sm hover:-translate-y-0.5">
                                Solicitar Presupuesto
                            </button>
                        </div>
                    </div>

                    {/* 📊 STATS FUSIONADOS (Parte de la Hero) */}
                    <div className="mt-8 pt-10 border-t border-white/20">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">

                            {/* Stat 1 */}
                            <div className="flex flex-col items-center group">
                                <Users className="w-8 h-8 text-ocean-200 mb-2 group-hover:text-white transition-colors" />
                                <div className="text-4xl font-bold mb-1 tracking-tight">
                                    +<AnimatedCounter end={1000} />
                                </div>
                                <p className="text-ocean-100 text-sm font-medium uppercase tracking-wider">
                                    Clientes Felices
                                </p>
                            </div>

                            {/* Stat 2 */}
                            <div className="flex flex-col items-center group">
                                <Star className="w-8 h-8 text-ocean-200 mb-2 group-hover:text-white transition-colors" />
                                <div className="text-4xl font-bold mb-1 tracking-tight">
                                    5/5
                                </div>
                                <p className="text-ocean-100 text-sm font-medium uppercase tracking-wider">
                                    Calificación
                                </p>
                            </div>

                            {/* Stat 3 */}
                            <div className="flex flex-col items-center group">
                                <Home className="w-8 h-8 text-ocean-200 mb-2 group-hover:text-white transition-colors" />
                                <div className="text-4xl font-bold mb-1 tracking-tight">
                                    +<AnimatedCounter end={5000} />
                                </div>
                                <p className="text-ocean-100 text-sm font-medium uppercase tracking-wider">
                                    Limpiezas Totales
                                </p>
                            </div>

                        </div>
                    </div>

                </div>
            </section>

            {/* 🚀 NAVBAR STICKY (Aparece solo después de que la Hero se va completa) */}
            <nav className={`
                fixed top-0 w-full z-50 
                shadow-xl border-b border-white/10 overflow-hidden
                transition-all duration-500 ease-in-out
                ${isVisible
                ? 'translate-y-0 opacity-100'
                : '-translate-y-full opacity-0'
            }
            `}>
                <div
                    className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: "url('/hero-bg.jpg')" }}
                />
                <div className="absolute inset-0 z-0 bg-ocean-900/90 backdrop-blur-md"></div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-row gap-4 justify-center py-3">
                        <button className="bg-white text-ocean-600 px-5 py-2 rounded-lg font-bold hover:bg-gray-50 transition-colors shadow-sm text-sm">
                            Ver Servicios
                        </button>
                        <button className="border-2 border-white text-white px-5 py-2 rounded-lg font-bold hover:bg-white hover:text-ocean-600 transition-colors text-sm">
                            Solicitar Presupuesto
                        </button>
                    </div>
                </div>
            </nav>
        </>
    )
}