import Image from "next/image";
import { ShieldCheck, Eye, Zap, Users, Sparkles, Home } from "lucide-react";
import { Metadata } from "next";
import Header from "@/components/layout/Header";

export const metadata: Metadata = {
    title: 'Quiénes Somos - CleanerClub',
    description: 'Conoce al equipo y los valores detrás de Cleaner Club.',
}

export default function AboutPage() {
    return (
        <><Header>

        </Header>
            <div className="bg-white">
                {/* 1. HERO SECTION */}
                <div className="relative bg-ocean-50 py-20 sm:py-28">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-6">
                            Quiénes <span className="text-ocean-600">Somos</span>
                        </h1>
                        <p className="text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
                            Tu tranquilidad es nuestra prioridad. Conoce el estándar Cleaner Club.
                        </p>
                    </div>
                    {/* Adorno de fondo opcional */}

                </div>

                {/* 2. NUESTRA HISTORIA (Compromiso y Equipo) */}
                <section className="py-16 sm:py-24 overflow-hidden">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            {/* Texto */}
                            <div className="order-2 lg:order-1">
                                <div className="flex items-center gap-2 mb-4">
                                    <Sparkles className="w-6 h-6 text-ocean-500"/>
                                    <span className="text-ocean-600 font-semibold tracking-wide uppercase text-sm">
                                        Nuestro Compromiso
                                    </span>
                                </div>
                                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                                    Una experiencia de limpieza excepcional
                                </h2>
                                <div className="space-y-6 text-gray-600">
                                    <p>
                                        Nuestro compromiso es proporcionar a nuestros clientes una experiencia de
                                        limpieza excepcional. Utilizamos técnicas avanzadas, productos de limpieza de
                                        alta calidad y un enfoque meticuloso para garantizar que cada rincón de tu hogar
                                        se mantenga impecable.
                                    </p>
                                    <div className="bg-ocean-50 p-6 rounded-2xl border border-ocean-100">
                                        <h3 className="flex items-center gap-2 font-semibold text-gray-900 mb-2">
                                            <Users className="w-5 h-5 text-ocean-600"/>
                                            Equipo de Profesionales
                                        </h3>
                                        <p className="text-sm">
                                            En Cleaner Club, contamos con un equipo de profesionales dedicados y
                                            cuidadosamente seleccionados. Nuestros expertos en limpieza están
                                            comprometidos con la eficiencia y la atención al detalle, asegurando que tu
                                            hogar reciba el tratamiento que se merece.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Imagen */}
                            <div className="order-1 lg:order-2 relative">
                                <div
                                    className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/3] rotate-1 hover:rotate-0 transition-transform duration-500">
                                    <Image
                                        src="/dedication.jpg" // Usando imagen existente
                                        alt="Equipo Cleaner Club"
                                        fill
                                        className="object-cover"/>
                                </div>
                                {/* Elemento decorativo flotante */}
                                <div
                                    className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-lg border-l-4 border-ocean-500 hidden md:block">
                                    <p className="font-bold text-2xl text-ocean-600">100%</p>
                                    <p className="text-xs text-gray-500">Compromiso y Calidad</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 3. SERVICIOS ADAPTADOS (Bloque inverso) */}
                <section className="py-16 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            {/* Imagen */}
                            <div
                                className="relative rounded-2xl overflow-hidden shadow-xl aspect-[4/3] -rotate-1 hover:rotate-0 transition-transform duration-500">
                                <Image
                                    src="/cleanroom.jpg" // Usando imagen existente
                                    alt="Limpieza adaptada"
                                    fill
                                    className="object-cover"/>
                            </div>

                            {/* Texto */}
                            <div>
                                <div className="flex items-center gap-2 mb-4">
                                    <Home className="w-6 h-6 text-ocean-500"/>
                                    <span className="text-ocean-600 font-semibold tracking-wide uppercase text-sm">
                                        A tu medida
                                    </span>
                                </div>
                                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                                    Servicios adaptados a tus necesidades
                                </h2>
                                <p className="text-gray-600 mb-6">
                                    Entendemos que cada hogar es único, y por eso ofrecemos servicios adaptados a tus
                                    necesidades específicas. Ya sea que necesites una limpieza regular, una limpieza
                                    profunda de primera o servicios especializados, estamos aquí para asegurarnos de que
                                    tu hogar luzca impecable en todo momento.
                                </p>
                                <ul className="space-y-3">
                                    {[
                                        "Limpiezas Regulares",
                                        "Limpiezas Profundas",
                                        "Servicios Especializados"
                                    ].map((item) => (
                                        <li key={item} className="flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full bg-ocean-500"/>
                                            <span className="text-gray-700 font-medium">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 4. MISIÓN, VISIÓN Y VALORES (Reutilizando estilo cards) */}
                <section className="py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold text-gray-900">Nuestra Esencia</h2>
                            <p className="mt-4 text-gray-600">Los pilares que sostienen cada limpieza que
                                realizamos.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Tarjeta Misión */}
                            <div
                                className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl hover:border-ocean-200 transition-all duration-300 group">
                                <div
                                    className="w-12 h-12 bg-ocean-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-ocean-100 transition-colors">
                                    <ShieldCheck className="w-6 h-6 text-ocean-600"/>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">Misión</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    Confía en Cleaner Club para la limpieza de tu hogar. Nuestro equipo ético y
                                    seleccionado cuidadosamente garantiza tu seguridad.
                                </p>
                            </div>

                            {/* Tarjeta Visión */}
                            <div
                                className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl hover:border-ocean-200 transition-all duration-300 group">
                                <div
                                    className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-purple-100 transition-colors">
                                    <Eye className="w-6 h-6 text-purple-600"/>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">Visión</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    Mantenemos un estándar consistente, desde la puntualidad hasta los detalles más
                                    pequeños.
                                </p>
                            </div>

                            {/* Tarjeta Valores */}
                            <div
                                className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl hover:border-ocean-200 transition-all duration-300 group">
                                <div
                                    className="w-12 h-12 bg-yellow-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-yellow-100 transition-colors">
                                    <Zap className="w-6 h-6 text-yellow-600"/>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">Valores</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    En Cleaner Club, garantizamos limpieza rápida y precisa, utilizando técnicas
                                    avanzadas para resultados impecables en poco tiempo.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}