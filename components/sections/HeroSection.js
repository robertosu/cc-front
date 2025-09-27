// components/sections/SimplifiedHeroSection.js

export default function SimplifiedHeroSection() {
    return (
        <section id="inicio" className="bg-gradient-to-br from-blue-600 to-blue-800 text-white pt-32 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                {/* Título principal */}
                <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                    Limpieza Profesional
                    <span className="block text-blue-200">a tu Alcance</span>
                </h1>

                {/* Descripción */}
                <p className="text-xl md:text-2xl mb-12 max-w-4xl mx-auto leading-relaxed opacity-90">
                    Servicios de limpieza de alta calidad para tu hogar o negocio.
                    <span className="block mt-2">
                        Profesionales certificados, productos ecológicos y precios competitivos.
                    </span>
                </p>

                {/* Elementos decorativos */}
                <div className="flex justify-center items-center space-x-12 mb-12">
                    <div className="text-center">
                        <div className="text-3xl font-bold text-blue-200">500+</div>
                        <div className="text-sm opacity-80">Clientes Satisfechos</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-blue-200">24/7</div>
                        <div className="text-sm opacity-80">Disponibilidad</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-blue-200">5★</div>
                        <div className="text-sm opacity-80">Calificación</div>
                    </div>
                </div>

                {/* Call to action visual */}
                <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20">
                    <span className="w-3 h-3 bg-green-400 rounded-full mr-3 animate-pulse"></span>
                    <span className="text-sm font-medium">Disponibles ahora - Respuesta inmediata</span>
                </div>
            </div>

            {/* Decoración de ondas */}
            <div className="absolute bottom-0 left-0 right-0">
                <svg className="w-full h-20 text-white" viewBox="0 0 1200 120" preserveAspectRatio="none">
                    <path d="M0,60 C150,100 350,0 600,60 C850,120 1050,20 1200,60 L1200,120 L0,120 Z" fill="currentColor"></path>
                </svg>
            </div>
        </section>
    )
}

/*
📝 MEJORAS APLICADAS:

✅ Padding top aumentado: pt-32 para compensar el navbar fijo
✅ ID agregado: id="inicio" para navegación
✅ Título mejorado: Span en dos líneas con color diferente
✅ Descripción ampliada: Más espacio y mejor legibilidad
✅ Estadísticas: Elementos que generan confianza
✅ Indicador en vivo: Muestra disponibilidad inmediata
✅ Decoración SVG: Ondas en la parte inferior
✅ Glassmorphism: Efectos modernos con backdrop-blur
✅ Responsive mejorado: md:text-6xl para pantallas grandes
✅ Animaciones sutiles: animate-pulse en indicador

🎨 DISEÑO MODERNO:
- Sin botones (ahora en navbar)
- Enfoque en el mensaje y credibilidad
- Elementos visuales que generan confianza
- Transición suave al siguiente section
*/