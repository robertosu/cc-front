'use client'
import { useState, useEffect, useRef } from 'react'
import { CheckCircle, ArrowRight } from 'lucide-react'
import { services, corporateService, serviceInclusions, WHATSAPP_LINKS } from '@/data/Services'

// Icono Oficial de WhatsApp SVG
const WhatsAppIcon = ({ className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className={className}
    >
        <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.592 2.654-.694c.93.533 1.656.823 2.809.823 3.183 0 5.769-2.586 5.769-5.766 0-3.181-2.585-5.767-5.766-5.767zm0 10.605c-1.026 0-1.748-.28-2.618-.752l-.187-.101-1.57.411.419-1.531-.11-.192c-.524-.913-.804-1.72-.804-2.673 0-2.668 2.171-4.839 4.842-4.839 2.669 0 4.841 2.17 4.841 4.839 0 2.669-2.172 4.839-4.842 4.839h.029zm3.554-3.626c-.195-.098-1.155-.57-1.334-.634-.179-.065-.309-.098-.439.097-.13.195-.504.634-.618.764-.114.13-.228.146-.423.049-.195-.097-.822-.303-1.566-.966-.576-.513-.965-1.146-1.079-1.341-.114-.195-.012-.3.085-.397.088-.087.195-.227.293-.341.098-.114.13-.195.195-.325.065-.13.033-.244-.016-.341-.049-.098-.439-1.057-.602-1.447-.159-.383-.321-.33-.439-.336-.11-.006-.236-.006-.362-.006-.126 0-.33.048-.504.238-.175.19-0.667.65-0.667 1.585 0 .935.683 1.837.777 1.967.094.13 1.345 2.053 3.259 2.879.455.197.81.315 1.086.403.454.144.868.124 1.196.075.367-.055 1.155-.472 1.318-.927.163-.455.163-.845.114-.927-.049-.082-.179-.13-.374-.228z"/>
    </svg>
);

export default function ServicesSection() {
    const scrollContainerRef = useRef(null);
    const [isPaused, setIsPaused] = useState(false);
    const scrollAccumulator = useRef(0);

    // Duplicamos servicios para el efecto bucle infinito
    const spinnerServices = [...services, ...services];

    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        let animationFrameId;
        let lastTimestamp = 0;
        const PIXELS_PER_SECOND = 50; // Velocidad ajustada para apreciar mejor las imágenes

        const scroll = (timestamp) => {
            if (!lastTimestamp) lastTimestamp = timestamp;
            const deltaTime = timestamp - lastTimestamp;
            lastTimestamp = timestamp;

            if (!isPaused && container) {
                const pixelsToMove = (PIXELS_PER_SECOND * deltaTime) / 1000;
                scrollAccumulator.current += pixelsToMove;

                if (scrollAccumulator.current >= 1) {
                    const pixelsInteger = Math.floor(scrollAccumulator.current);
                    if (container.scrollLeft >= container.scrollWidth / 2) {
                        container.scrollLeft = 0;
                    } else {
                        container.scrollLeft += pixelsInteger;
                    }
                    scrollAccumulator.current -= pixelsInteger;
                }
            }
            animationFrameId = requestAnimationFrame(scroll);
        };

        animationFrameId = requestAnimationFrame(scroll);
        return () => cancelAnimationFrame(animationFrameId);
    }, [isPaused]);

    return (
        <section id="services" className="py-24 bg-gray-50 overflow-hidden relative">

            {/* CSS para ocultar Scrollbar */}
            <style jsx>{`
                
            `}</style>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">

                {/* HEADER + EMPRESAS (Layout Híbrido para optimizar espacio) */}
                <div className="flex flex-col lg:flex-row items-end justify-between gap-8 md:gap-12">

                    {/* Texto Introductorio */}
                    <div className="lg:w-1/2 text-center lg:text-left">
                        <h2 className="text-ocean-600 font-bold tracking-wide uppercase text-sm mb-3">
                            Nuestros Servicios
                        </h2>
                        <h3 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                            Soluciones de limpieza para cada necesidad
                        </h3>
                        <p className="text-xl text-gray-600 leading-relaxed">
                            Desde el mantenimiento diario hasta limpiezas profundas especializadas.
                            Un precio justo para cada hogar.
                        </p>
                    </div>

                    {/* Tarjeta Compacta de Empresas (Destacada) */}
                    <div className="lg:w-1/2 w-full">
                        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 md:p-8 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden group">

                            {/* Efecto decorativo de fondo */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-ocean-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

                            <div className="relative z-10 flex items-center gap-4 text-center sm:text-left">
                                <div className="p-3 bg-white/10 rounded-xl text-ocean-400 shrink-0">
                                    {corporateService.icon}
                                </div>
                                <div>
                                    <h4 className="text-2xl font-bold text-white">{corporateService.title}</h4>
                                    <p className="text-gray-300 text-sm mt-1 max-w-xs mx-auto sm:mx-0">
                                        {corporateService.description}
                                    </p>
                                </div>
                            </div>

                            <a
                                href={corporateService.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="relative z-10 shrink-0 bg-ocean-500 hover:bg-ocean-400 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg shadow-ocean-900/50 flex items-center gap-2 group-hover:scale-105"
                            >
                                Contactar por WhatSapp
                                <ArrowRight className="w-5 h-5" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* CARRUSEL DE SERVICIOS (Estilo ValuesSection) */}
            <div className="relative mb-20">
                <div
                    ref={scrollContainerRef}
                    className="no-scrollbar flex overflow-x-auto space-x-6 pb-4 px-4"
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                    onTouchStart={() => setIsPaused(true)}
                    onTouchEnd={() => setTimeout(() => setIsPaused(false), 1500)}
                >
                    {spinnerServices.map((service, index) => (
                        <div
                            key={`${index}-${service.title}`}
                            className="relative w-[340px] md:w-[380px] h-[500px] flex-shrink-0 rounded-3xl overflow-hidden shadow-lg group select-none cursor-pointer"
                        >
                            {/* 1. IMAGEN DE FONDO con Zoom Hover */}
                            <div
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-110"
                                style={{ backgroundImage: `url('${service.image || '/cleanroom.jpg'}')` }}
                            />

                            {/* 2. OVERLAY OSCURO (Ajustado para ser más oscuro abajo) */}
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-900/20 to-transparent opacity-80 transition-opacity duration-300" />

                            {/* 3. CONTENIDO GLASSMORPHISM */}
                            <div className="absolute inset-0 flex flex-col justify-end p-4"> {/* Cambié p-6 a p-4 para dar un poco más de margen visual a la imagen */}

                                {/* CAMBIOS AQUÍ:
                1. Quitamos 'h-full' y 'justify-between'
                2. Agregamos 'gap-4' para separar los elementos
            */}
                                <div className="relative w-full overflow-hidden rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-5 transition-all duration-300 group-hover:bg-white/20 group-hover:border-white/40 flex flex-col gap-4">

                                    <div>
                                        {/* Header con Icono y Título en linea para ahorrar espacio vertical */}
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-ocean-500 text-white shadow-lg shrink-0">
                                                {service.icon}
                                            </div>
                                            <h3 className="text-xl font-bold text-white leading-tight">
                                                {service.title}
                                            </h3>
                                        </div>

                                        <p className="text-gray-200 text-sm leading-relaxed line-clamp-2">
                                            {service.description}
                                        </p>
                                    </div>

                                    {/* Botón WhatsApp */}
                                    <a
                                        href={WHATSAPP_LINKS.general}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold py-0.5 px-4 rounded-xl transition-colors duration-300 flex items-center justify-center gap-2 shadow-lg"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <WhatsAppIcon className="w-10 h-10 fill-current" />
                                        Solicitar Presupuesto
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* SECCIÓN INCLUSIONES (Simplificada y limpia) */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100">
                    <h3 className="text-xl md:text-2xl font-bold text-center text-gray-800 mb-8">
                        Estándar <span className="text-ocean-600">Cleaner Club</span> incluido en cada visita:
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-4">
                        {serviceInclusions.map((inclusion, index) => (
                            <div key={index} className="flex items-start gap-3">
                                <CheckCircle className="w-5 h-5 text-ocean-500 shrink-0 mt-0.5" />
                                <span className="text-gray-600 text-sm font-medium leading-tight">
                                    {inclusion}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

        </section>
    )
}