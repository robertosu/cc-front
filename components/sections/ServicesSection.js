'use client'
import { useState, useEffect, useRef } from 'react'
import { CheckCircle, MessageCircle, ArrowRight } from 'lucide-react'
import { services, corporateService, serviceInclusions, WHATSAPP_LINKS } from '@/data/Services'

// Componente de Contador Animado (Sin cambios)
const AnimatedCounter = ({ end, duration = 2000 }) => {
    const [count, setCount] = useState(0);
    const countRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );

        if (countRef.current) observer.observe(countRef.current);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!isVisible) return;
        let startTime = null;
        const animate = (currentTime) => {
            if (!startTime) startTime = currentTime;
            const progress = currentTime - startTime;
            if (progress < duration) {
                const rate = progress / duration;
                const ease = 1 - Math.pow(1 - rate, 4);
                setCount(Math.floor(end * ease));
                requestAnimationFrame(animate);
            } else {
                setCount(end);
            }
        };
        requestAnimationFrame(animate);
    }, [isVisible, end, duration]);

    return <span ref={countRef} className="tabular-nums">+{count.toLocaleString()}</span>;
};

export default function ServicesSection() {
    const scrollContainerRef = useRef(null);
    const [isPaused, setIsPaused] = useState(false);

    // Referencia para acumular decimales (sub-píxeles)
    const scrollAccumulator = useRef(0);

    // Duplicamos servicios para el efecto bucle
    const spinnerServices = [...services, ...services];

    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        let animationFrameId;
        let lastTimestamp = 0;

        // --- CONFIGURACIÓN DE VELOCIDAD ---
        const PIXELS_PER_SECOND = 60;

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
        <section id="services" className="py-20 bg-white overflow-hidden">
            {/* Estilos CSS: Scrollbar personalizada en Desktop, Oculta en Móvil */}
            <style jsx>{`
                /* Estilos base para la scrollbar (Desktop) */
                .custom-scrollbar::-webkit-scrollbar {
                    height: 8px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #F3F4F6;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background-color: #14B8A6;
                    border-radius: 10px;
                    border: 2px solid #F3F4F6;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background-color: #0D9488;
                }
                .custom-scrollbar {
                    scrollbar-width: thin;
                    scrollbar-color: #14B8A6 #F3F4F6;
                }

                /* Media query para ocultar scrollbar solo en móviles (max-width: 768px) */
                @media (max-width: 768px) {
                    .custom-scrollbar {
                        scrollbar-width: none; /* Firefox */
                        -ms-overflow-style: none; /* IE/Edge */
                    }
                    .custom-scrollbar::-webkit-scrollbar {
                        display: none; /* Chrome/Safari */
                    }
                }
            `}</style>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">
                        Nuestros Servicios
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Soluciones profesionales de limpieza adaptadas a tus necesidades.
                    </p>
                </div>

                {/* SECCIÓN 1: CONTADOR */}
                <div className="flex justify-center mb-16">
                    <div className="bg-ocean-500 text-white rounded-3xl py-8 px-12 text-center shadow-xl transform hover:scale-105 transition-transform duration-300">
                        <div className="text-5xl md:text-6xl font-extrabold mb-2">
                            <AnimatedCounter end={10271} />
                        </div>
                        <p className="text-lg md:text-xl font-medium opacity-90 tracking-wide">
                            LIMPIEZAS REALIZADAS
                        </p>
                    </div>
                </div>

                {/* SECCIÓN 2: SPINNER HÍBRIDO */}
                <div className="relative mb-20 group">
                    <div
                        ref={scrollContainerRef}
                        // Volvemos a usar la clase 'custom-scrollbar'
                        className="custom-scrollbar flex overflow-x-auto space-x-8 pb-8 px-4"
                        onMouseEnter={() => setIsPaused(true)}
                        onMouseLeave={() => setIsPaused(false)}
                        onTouchStart={() => setIsPaused(true)}
                        onTouchEnd={() => {
                            setTimeout(() => setIsPaused(false), 1500);
                        }}
                    >
                        {spinnerServices.map((service, index) => (
                            <div
                                key={`${index}-${service.title}`}
                                // Mantenemos el ancho fijo w-[...]
                                className="w-[340px] md:w-[400px] flex-shrink-0 bg-white rounded-2xl p-8 shadow-md border border-gray-100 flex flex-col items-center text-center hover:shadow-xl hover:border-ocean-200 transition-all duration-300 select-none h-full"
                            >
                                <div className="text-ocean-500 bg-ocean-50 p-5 rounded-full mb-6">
                                    {service.icon}
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                                    {service.title}
                                </h3>
                                <p className="text-gray-600 text-base leading-relaxed mb-8 flex-grow">
                                    {service.description}
                                </p>

                                <a
                                    href={WHATSAPP_LINKS.general}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-3 px-4 rounded-xl transition-colors duration-300 flex items-center justify-center gap-2 shadow-sm hover:shadow-md mt-auto"
                                >
                                    <MessageCircle className="w-5 h-5" />
                                    Solicitar Presupuesto
                                </a>
                            </div>
                        ))}
                    </div>
                </div>

                {/* SECCIÓN 4: BANNER EMPRESAS */}
                <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-8 md:p-12 mb-20 text-white shadow-2xl relative overflow-hidden">
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="text-center md:text-left">
                            <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
                                <div className="p-3 bg-white/10 rounded-xl text-ocean-400">
                                    {corporateService.icon}
                                </div>
                                <h3 className="text-3xl font-bold">{corporateService.title}</h3>
                            </div>
                            <p className="text-xl text-gray-300 max-w-2xl">
                                {corporateService.description}
                            </p>
                        </div>
                        <a
                            href={corporateService.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-shrink-0 bg-ocean-500 hover:bg-ocean-600 text-white font-bold py-4 px-8 rounded-full transition-all hover:scale-105 flex items-center gap-2 shadow-lg shadow-ocean-500/20"
                        >
                            Contáctanos
                            <ArrowRight className="w-5 h-5" />
                        </a>
                    </div>
                    <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-ocean-500 opacity-10 rounded-full blur-3xl"></div>
                </div>

                {/* SECCIÓN 5: INCLUSIONES */}
                <div className="bg-ocean-50 rounded-3xl p-8 md:p-12 border border-ocean-100">
                    <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                        Todos nuestros servicios de limpieza a domicilio incluyen:
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl mx-auto">
                        {serviceInclusions.map((inclusion, index) => (
                            <div key={index} className="flex items-start bg-white p-4 rounded-xl shadow-sm border border-ocean-100/50 hover:shadow-md transition-shadow">
                                <CheckCircle className="w-5 h-5 text-ocean-500 mr-3 flex-shrink-0 mt-0.5" />
                                <span className="text-gray-700 font-medium">{inclusion}</span>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </section>
    )
}