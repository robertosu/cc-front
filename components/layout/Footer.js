// app/components/layout/Footer.js

import {Sparkles} from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-white py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Contenido principal del footer */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

                    {/* Columna 1: Logo y descripción */}
                    <div className="md:col-span-2">
                        <div className="flex items-center space-x-2 mb-4">
                            <Sparkles/>
                            <span className="text-2xl font-bold">CleanerClub</span>
                        </div>
                        <p className="text-gray-400 max-w-md">
                            En Cleaner Club, nuestra misión es crear hogares impecables con servicios de limpieza
                            eficientes, responsables y disciplinados. Nos esforzamos por aligerar tu carga diaria,
                            brindándote un espacio fresco y acogedor para disfrutar sin preocupaciones.
                        </p>
                        <p className="text-gray-400 max-w-md">
                            Los Mejores profesionales al alcance de tus dedos.
                        </p>
                    </div>

                    {/* Columna 2: Enlaces rápidos */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Enlaces</h3>
                        <ul className="space-y-2">
                            <li>
                                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                    Servicios
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                    Presupuesto
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                    Reseñas
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Columna 3: Contacto */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Contacto</h3>
                        <div className="space-y-2 text-gray-400">
                            <p>📞 +1 (555) 123-4567</p>
                            <p>✉️ info@cleanerclub.com</p>
                            <p>📍 123 Calle Principal</p>
                        </div>
                    </div>
                </div>

                {/* Línea divisoria */}
                <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                    <p>&copy; 2024 CleanerClub. Todos los derechos reservados.</p>
                </div>
            </div>
        </footer>
    )
}

/*
📝 CONCEPTOS APLICADOS:
- Grid layout: grid-cols-1 md:grid-cols-4 (responsive)
- Spacing: space-y-2 para elementos verticales
- Colors: bg-gray-900, text-gray-400 para jerarquía
- Hover states: hover:text-white
*/