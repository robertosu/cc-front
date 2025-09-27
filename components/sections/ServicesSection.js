// app/components/sections/ServicesSection.js
import { CheckCircle } from 'lucide-react'
import { services} from '@/data/Services'



export default function ServicesSection() {
    return (
        <section id="services" className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Título y descripción de la sección */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">
                        Nuestros Servicios
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Ofrecemos una amplia gama de servicios de limpieza para satisfacer todas tus necesidades
                    </p>
                </div>

                {/* Grid de tarjetas de servicios */}
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-8 lg:gap-8">
                    {services.map((service, index) => (
                        <div
                            key={index}
                            className="bg-gray-50 rounded-xl p-3 md:p-6 lg:p-6 hover:shadow-lg transition-shadow border border-gray-200"
                        >
                            {/* Icono del servicio */}
                            <div className="text-blue-600 mb-4">
                                {service.icon}
                            </div>

                            {/* Título del servicio */}
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                {service.title}
                            </h3>

                            {/* Descripción */}
                            <p className="text-gray-600 mb-4">
                                {service.description}
                            </p>

                            {/* Lista de características */}
                            <ul className="space-y-2 mb-4">
                                {service.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-center text-gray-700">
                                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            {/* Precio */}
                            <div className="text-lg font-bold text-blue-600">
                                {service.price}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

/*
📝 CONCEPTOS APLICADOS EN TU TAREA:

✅ Componente Server (sin 'use client')
✅ Importación de iconos de Lucide React
✅ Array.map() para renderizar lista de elementos
✅ Grid responsive: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
✅ Hover effects: hover:shadow-lg
✅ Spacing consistente: py-20, mb-16, space-y-2
✅ Color system: text-blue-600, text-gray-900, bg-gray-50
✅ Flex layout: flex items-center para alinear iconos
✅ Key prop en map() para performance de React

🚀 SIGUIENTE NIVEL:
- Podrías hacer las tarjetas clickeables
- Agregar animaciones de entrada
- Crear modal con más detalles del servicio
*/