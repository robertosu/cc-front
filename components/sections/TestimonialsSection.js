// app/components/sections/ServicesSection.js
import {CheckCircle, Star} from 'lucide-react'
import {testimonials} from "@/data/Testimonials";

export default function TestimonialsSection() {
    return (
        <section id="testimonials" className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">Lo que dicen nuestros clientes</h2>
                    <p className="text-xl text-gray-600">Experiencias reales de personas satisfechas con nuestros servicios</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <div key={index} className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                            <div className="flex items-center mb-4">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`w-5 h-5 ${
                                            i < testimonial.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                        }`}
                                    />
                                ))}
                            </div>
                            <p className="text-gray-700 mb-4 italic">"{testimonial.text}"</p>
                            <div className="flex items-center">
                                <div className="bg-gray-300 rounded-full w-10 h-10 mr-3"></div>
                                <div>
                                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                                    <p className="text-sm text-gray-600">{testimonial.service}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
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