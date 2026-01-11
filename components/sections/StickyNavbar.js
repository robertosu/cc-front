'use client'

import { useEffect, useRef, useState } from 'react'
import { Users, Star, Home } from 'lucide-react'
import Link from 'next/link'
import { WhatsAppIcon } from "@/components/sections/ServicesSection";
import { WHATSAPP_LINKS } from "@/data/Services";
import LiveProgressBanner from "@/components/sections/LiveProgressBanner"; // <--- IMPORTANTE: Importar el banner

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
    const sectionRef = useRef(null)

    useEffect(() => {
        const handleScroll = () => {
            if (sectionRef.current) {
                const elementRect = sectionRef.current.getBoundingClientRect()
                setIsVisible(elementRect.bottom < 0)
            }
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <>
            <section
                ref={sectionRef}
                className="relative text-white min-h-[90vh] flex flex-col justify-center overflow-hidden pt-24 pb-12 lg:pt-32"
            >

                {/* Capa 1: Imagen Fondo */}
                <div
                    className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transform scale-105"
                    style={{ backgroundImage: "url('/hero-bg2.jpg')" }}
                />

                {/* Capa 2: Overlay */}
                <div className="absolute inset-0 z-0 bg-gradient-to-b from-ocean-900/80 via-ocean-900/70 to-ocean-900/90"></div>

                {/* Capa 3: Contenido Principal */}
                <div className="relative z-10 max-w-7xl mx-auto px-4 w-full flex-grow flex flex-col justify-center">

                    {/* GRID LAYOUT: Texto a la izquierda, Banner a la derecha en Desktop */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">

                        {/* COLUMNA IZQUIERDA: Texto y Botones */}
                        <div className="text-center lg:text-left">
                            <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight leading-tight drop-shadow-lg">
                                Limpieza Profesional <br className="hidden md:block"/> a tu Alcance
                            </h2>
                            <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto lg:mx-0 text-ocean-50 font-light drop-shadow-md">
                                Servicios de limpieza a domicilio en La Serena, Coquimbo y alrededores.
                                Limpieza profesional para hogares o negocios.
                            </p>

                            {/* Botones de Acción HERO */}
                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center">
                                {/* Botón Ver Servicios */}
                                <Link
                                    href="#services"
                                    className="bg-white text-ocean-600 px-8 py-3 rounded-xl font-bold hover:bg-ocean-50 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 inline-block"
                                >
                                    Ver Servicios
                                </Link>

                                {/* Botón WhatsApp */}
                                <a
                                    href={WHATSAPP_LINKS.empresas}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="border-2 border-white text-white px-8 py-0.5 rounded-xl font-bold hover:bg-white/10 transition-all backdrop-blur-sm hover:-translate-y-0.5 inline-flex items-center gap-2"
                                >
                                    <WhatsAppIcon className="w-10 h-10 fill-current" />
                                    <span>Solicitar Presupuesto</span>
                                </a>
                            </div>
                        </div>

                        {/* COLUMNA DERECHA: Banner Animado */}
                        <div className="flex justify-center lg:justify-end relative">
                            {/* Efecto de luz detrás del banner */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-ocean-400/30 blur-3xl rounded-full -z-10"></div>

                            <div className="relative z-10 w-full max-w-sm">
                                <LiveProgressBanner />
                            </div>
                        </div>

                    </div>

                    {/* 📊 STATS FUSIONADOS (Ocupan todo el ancho abajo) */}
                    <div className="mt-auto pt-10 border-t border-white/20 w-full">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto text-center">
                            <div className="flex flex-col items-center group">
                                <Users className="w-8 h-8 text-ocean-200 mb-2 group-hover:text-white transition-colors" />
                                <div className="text-4xl font-bold mb-1 tracking-tight">
                                    +<AnimatedCounter end={1000} />
                                </div>
                                <p className="text-ocean-100 text-sm font-medium uppercase tracking-wider">
                                    Usuarios Felices
                                </p>
                            </div>
                            <div className="flex flex-col items-center group">
                                <Star className="w-8 h-8 text-ocean-200 mb-2 group-hover:text-white transition-colors" />
                                <div className="text-4xl font-bold mb-1 tracking-tight">
                                    5/5
                                </div>
                                <p className="text-ocean-100 text-sm font-medium uppercase tracking-wider">
                                    Calificación
                                </p>
                            </div>
                            <div className="flex flex-col items-center group">
                                <Home className="w-8 h-8 text-ocean-200 mb-2 group-hover:text-white transition-colors" />
                                <div className="text-4xl font-bold mb-1 tracking-tight">
                                    +<AnimatedCounter end={500} />
                                </div>
                                <p className="text-ocean-100 text-sm font-medium uppercase tracking-wider">
                                    Limpiezas Totales
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 🚀 NAVBAR STICKY */}
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
                    style={{ backgroundImage: "url('/hero-bg2.jpg')" }}
                />
                <div className="absolute inset-0 z-0 bg-ocean-900/90 backdrop-blur-md"></div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-row gap-4 justify-center py-3 items-center">
                        {/* Botón Ver Servicios (Sticky) */}
                        <Link
                            href="#services"
                            className="bg-white text-ocean-600 px-5 py-2 rounded-lg font-bold hover:bg-gray-50 transition-colors shadow-sm text-sm inline-block"
                        >
                            Ver Servicios
                        </Link>

                        {/* Botón WhatsApp (Sticky) */}
                        <a
                            href={WHATSAPP_LINKS.empresas}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="border-2 border-white text-white px-5 py-0.5 rounded-lg font-bold hover:bg-white hover:text-ocean-600 transition-colors text-sm inline-flex items-center gap-2"
                        >
                            <WhatsAppIcon className="w-8 h-8 fill-current" />
                            <span>Solicitar Presupuesto</span>
                        </a>
                    </div>
                </div>
            </nav>
        </>
    )
}