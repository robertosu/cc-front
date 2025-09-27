// app/components/sections/HeroSection.js

import StickyNavbar from "@/components/sections/StickyNavbar";

export default function HeroSection() {
    return (
        <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h1 className="text-5xl font-bold mb-6">
                    Limpieza Profesional a tu Alcance
                </h1>
                <p className="text-xl mb-8 max-w-3xl mx-auto">
                    Servicios de limpieza de alta calidad para tu hogar o negocio.
                    Profesionales certificados, productos ecológicos y precios competitivos.
                </p>
                {/* Botones de acción */}
              {/*  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                        Ver Servicios
                    </button>
                    <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
                        Solicitar Presupuesto
                    </button>
                </div>*/}
            </div>
        </section>
    )
}

/*
📝 CONCEPTOS APLICADOS:
- Semantic HTML: <section> para estructura
- Responsive: flex-col sm:flex-row (columna en móvil, fila en desktop)
- Spacing: max-w-3xl mx-auto para centrar texto
- Hover effects: hover:bg-gray-100 para interactividad visual
*/