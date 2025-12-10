// components/sections/LocationSection.tsx
import React from 'react';
import { Star, ExternalLink, User } from 'lucide-react';

export default function LocationSection() {
    // URL provista para ver las reseñas en Google
    const googleReviewsUrl = "https://www.google.com/search?q=cleanerclub&rlz=1C1ONGR_enCL1174CL1174&oq=cleanerclub+&gs_lcrp=EgZjaHJvbWUqBggAEEUYOzIGCAAQRRg7MgoIARAAGAoYDRgeMgoIAhAAGAgYDRgeMgYIAxBFGDwyBggEEEUYPDIGCAUQRRg8MgYIBhBFGD0yBggHEEUYPdIBCDEzNzFqMGo3qAIAsAIA&sourceid=chrome&ie=UTF-8#lrd=0xad4a8dff4cf7d2eb:0x8ecad36edbbece03,1,,,,";

    // Datos simulados para la vista previa (puedes editarlos con textos reales)
    const reviews = [
        {
            id: 1,
            author: "Kamila Bermejo Olivares",
            rating: 5,
            text: "Siempre un excelente servicio y atención.\n" +
                "Un agrado cada vez que van 😊\n" +
                "Recomiendo el servicio de todas maneras.",
            date: "Hace 1 año"
        },
        {
            id: 2,
            author: "Macarena Santander Chavez",
            rating: 5,
            text: "Súper buen servicio , fácil reservar , puntuales y dejaron todo impecable , una gran ayuda para quienes trabajamos en la semana y queremos no dedicar todo el fin de semana a la limpieza de casa",
            date: "Hace 1 año"
        }
    ];

    return (
        <section className="py-24 bg-ocean-50 relative overflow-hidden">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-ocean-600 font-bold tracking-wide uppercase text-sm mb-3">
                        Ubicación
                    </h2>
                    <p className="text-4xl md:text-5xl font-bold text-ocean-950 tracking-tight">
                        La Serena y <span className="text-ocean-600">Coquimbo</span>
                    </p>
                    <p className="mt-4 text-lg text-ocean-900/60 max-w-2xl mx-auto">
                        Brindamos servicios de limpieza integral en La Serena y Coquimbo, próximamente también en Santiago.
                    </p>
                </div>

                {/* Grid de 2 Columnas: Mapa y Reviews */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">

                    {/* COLUMNA 1: Mapa (Más chico) */}
                    <div className="w-full h-full rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-white relative">
                        <iframe
                            width="100%"
                            height="100%"
                            frameBorder="0"
                            scrolling="no"
                            marginHeight={0}
                            marginWidth={0}
                            title="Mapa de La Serena"
                            // Recuerda: Para la línea roja de delimitación exacta, usa el src de "Compartir -> Insertar mapa" de Google Maps.
                            src="https://maps.google.com/maps?width=100%25&height=600&hl=es&q=La%20Serena%2C%20Chile&t=&z=11&ie=UTF8&iwloc=B&output=embed"
                            className="w-full h-full"
                        ></iframe>
                    </div>

                    {/* COLUMNA 2: Sección de Reviews */}
                    <div className="flex flex-col h-full justify-center space-y-6">

                        {/* Tarjeta de Resumen General */}
                        <div className="bg-white rounded-3xl p-8 shadow-lg border border-ocean-100">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-2xl font-bold text-ocean-950">Opiniones de Google</h3>
                                    <div className="flex items-center mt-2 space-x-2">
                                        <span className="text-3xl font-bold text-ocean-600">5.0</span>
                                        <div className="flex text-yellow-400">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className="w-5 h-5 fill-current" />
                                            ))}
                                        </div>
                                        <span className="text-ocean-400 text-sm">(Basado en reseñas)</span>
                                    </div>
                                </div>
                                {/* Logo de Google o Icono decorativo */}
                                <div className="bg-gray-100 p-3 rounded-full">
                                    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z" fill="#FBBC05"/>
                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                                    </svg>
                                </div>
                            </div>

                            {/* Lista de Reviews (Ejemplos estáticos) */}
                            <div className="space-y-4 mb-6">
                                {reviews.map((review) => (
                                    <div key={review.id} className="border-t border-gray-100 pt-4 first:pt-0 first:border-0">
                                        <div className="flex items-center space-x-3 mb-2">
                                            <div className="bg-ocean-100 p-2 rounded-full text-ocean-600">
                                                <User size={16} />
                                            </div>
                                            <span className="font-semibold text-ocean-900 text-sm">{review.author}</span>
                                            <span className="text-gray-400 text-xs">• {review.date}</span>
                                        </div>
                                        <div className="flex text-yellow-400 mb-1">
                                            {[...Array(review.rating)].map((_, i) => (
                                                <Star key={i} className="w-3 h-3 fill-current" />
                                            ))}
                                        </div>
                                        <p className="text-gray-600 text-sm italic">"{review.text}"</p>
                                    </div>
                                ))}
                            </div>

                            {/* Botón Call to Action */}
                            <a
                                href={googleReviewsUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full block text-center bg-white border-2 border-ocean-600 text-ocean-600 hover:bg-ocean-50 font-semibold py-3 px-6 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2"
                            >
                                Leer más reseñas en Google
                                <ExternalLink size={18} />
                            </a>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
}