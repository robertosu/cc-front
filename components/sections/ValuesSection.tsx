import { ShieldCheck, Clock, Zap } from 'lucide-react'

// Definimos los datos.
// IMPORTANTE: Asegúrate de tener imágenes en tu carpeta /public para reemplazar los placeholders.
const features = [
    {
        name: 'Responsabilidad',
        description: 'Tu seguridad es primero. Nuestro equipo pasa por estrictos filtros de confianza y antecedentes.',
        icon: ShieldCheck,
        // Usa tus propias imagenes aquí. Ej: '/valores-responsabilidad.jpg'
        image: '/responsability.jpg'
    },
    {
        name: 'Disciplina',
        description: 'La puntualidad y el detalle no son negociables. Mantenemos un estándar suizo en cada visita.',
        icon: Clock,
        image: '/cleanroom.jpg'
    },
    {
        name: 'Eficiencia',
        description: 'Técnicas avanzadas y productos premium para resultados brillantes en menos tiempo.',
        icon: Zap,
        image: '/dedication.jpg'
    },
]

export default function ValuesSection() {
    return (
        <section className="py-24 bg-white relative overflow-hidden">
            {/* Decoración de fondo sutil (opcional) */}
            <div className="absolute top-0 left-0 w-full h-full bg-ocean-50/50 -z-10" />

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                {/* Cabecera de la sección */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-ocean-600 font-bold tracking-wide uppercase text-sm mb-3">
                        Nuestros Pilares
                    </h2>
                    <p className="text-4xl md:text-5xl font-bold text-ocean-950 tracking-tight">
                        ¿Por qué elegir <span className="text-ocean-600">Cleaner Club</span>?
                    </p>
                    <p className="mt-4 text-lg text-ocean-900/60 max-w-2xl mx-auto">
                        No solo limpiamos espacios, cuidamos tu paz mental con estándares que marcan la diferencia.
                    </p>
                </div>

                {/* Grid de Tarjetas */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
                    {features.map((feature, index) => (
                        <div
                            key={feature.name}
                            className="group relative h-[500px] w-full overflow-hidden rounded-3xl shadow-xl transition-all duration-500 hover:shadow-2xl hover:shadow-ocean-900/20"
                        >
                            {/* 1. IMAGEN DE FONDO (Con efecto Zoom al hacer Hover) */}
                            <div
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-110"
                                style={{ backgroundImage: `url('${feature.image}')` }}
                            />

                            {/* 2. OVERLAY OSCURO (Para contraste base) */}
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-ocean-900/20 to-ocean-950/90 opacity-80" />

                            {/* 3. CONTENIDO (Estilo Glass/Blur) */}
                            <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">

                                {/* Tarjeta de Vidrio (Glassmorphism) interna */}
                                <div className="relative overflow-hidden rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-6 transition-all duration-300 group-hover:bg-white/15 group-hover:border-white/30">

                                    {/* Icono Flotante */}
                                    <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-xl bg-ocean-500 text-white shadow-lg shadow-ocean-500/30 transform group-hover:-translate-y-1 transition-transform duration-300">
                                        <feature.icon className="h-6 w-6" aria-hidden="true" />
                                    </div>

                                    {/* Textos */}
                                    <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">
                                        {feature.name}
                                    </h3>

                                    <p className="text-ocean-50 text-sm leading-relaxed font-light opacity-90">
                                        {feature.description}
                                    </p>

                                    {/* Decoración de brillo en el borde (opcional) */}
                                    <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-50" />
                                </div>

                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}