// app/components/layout/Footer.js
import { Sparkles, Facebook, Instagram, Phone, Mail, MapPin } from "lucide-react";

// Icono personalizado de WhatsApp simple para el footer
const WhatsAppIcon = ({ className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
    </svg>
);

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-white py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Contenido principal del footer */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

                    {/* Columna 1: Logo y descripción */}
                    <div>
                        <div className="flex items-center space-x-2 mb-4">
                            <Sparkles className="text-teal-400"/>
                            <span className="text-2xl font-bold">CleanerClub</span>
                        </div>
                        <p className="text-gray-400 mb-6">
                            En Cleaner Club, nuestra misión es crear hogares impecables con servicios de limpieza
                            eficientes, responsables y disciplinados.
                        </p>

                        {/* Redes Sociales */}
                        <div className="flex space-x-4">
                            <a
                                href="https://www.facebook.com/profile.php?id=61553657292395"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-gray-800 p-2 rounded-full hover:bg-[#1877F2] transition-colors"
                                aria-label="Facebook"
                            >
                                <Facebook size={20} />
                            </a>
                            <a
                                href="https://www.instagram.com/cleanerclubcl"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-gray-800 p-2 rounded-full hover:bg-[#E4405F] transition-colors"
                                aria-label="Instagram"
                            >
                                <Instagram size={20} />
                            </a>
                            <a
                                href="https://wa.me/message/EXZVVF7WM2F6N1"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-gray-800 p-2 rounded-full hover:bg-[#25D366] transition-colors"
                                aria-label="WhatsApp"
                            >
                                <WhatsAppIcon className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Columna 2: Información de Contacto */}
                    <div>
                        <h3 className="text-lg font-semibold mb-6 text-teal-400">Información de contacto</h3>
                        <div className="space-y-4">
                            <div className="flex items-start space-x-3">
                                <Phone className="w-5 h-5 text-gray-500 mt-1" />
                                <div>
                                    <p className="text-sm text-gray-500">Teléfono</p>
                                    <p className="font-medium hover:text-teal-400 transition-colors">
                                        <a href="tel:+56974851828">+56 9 7485 1828</a>
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-3">
                                <Mail className="w-5 h-5 text-gray-500 mt-1" />
                                <div>
                                    <p className="text-sm text-gray-500">E-mail</p>
                                    <p className="font-medium hover:text-teal-400 transition-colors">
                                        <a href="mailto:Contacto@cleanerclub.cl">Contacto@cleanerclub.cl</a>
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-3">
                                <MapPin className="w-5 h-5 text-gray-500 mt-1" />
                                <div>
                                    <p className="text-sm text-gray-500">Ubicación</p>
                                    <p className="font-medium">La Serena y Coquimbo</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Columna 3: Enlaces rápidos (Opcional, o puede eliminarse si prefieres solo contacto) */}
                    <div>
                        <h3 className="text-lg font-semibold mb-6 text-teal-400">Enlaces Rápidos</h3>
                        <ul className="space-y-3">
                            <li>
                                <a href="#services" className="text-gray-400 hover:text-white transition-colors">
                                    Nuestros Servicios
                                </a>
                            </li>
                            <li>
                                <a href="https://wa.me/message/EXZVVF7WM2F6N1" className="text-gray-400 hover:text-white transition-colors">
                                    Solicitar Presupuesto
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Línea divisoria */}
                <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500 text-sm">
                    <p>&copy; {new Date().getFullYear()} CleanerClub. Todos los derechos reservados.</p>
                </div>
            </div>
        </footer>
    )
}