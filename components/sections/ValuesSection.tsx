import { ShieldCheck, Clock, Zap } from 'lucide-react'

// Definimos los datos.
const features = [
    {
        name: 'Responsabilidad',
        description: 'Tu seguridad es primero. Nuestro equipo pasa por estrictos filtros de confianza.',
        icon: ShieldCheck,
        image: '/responsability.jpg'
    },
    {
        name: 'Disciplina',
        description: 'La puntualidad y el detalle no son negociables. Mantenemos un estándar alto.',
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
        <section className="py-12 md:py-24 bg-white relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-ocean-50/50 -z-10" />

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                {/* Cabecera */}
                <div className="text-center max-w-3xl mx-auto mb-10 md:mb-16">
                    <h2 className="text-ocean-600 font-bold tracking-wide uppercase text-sm mb-3">
                        Nuestros Pilares
                    </h2>
                    <p className="text-4xl md:text-5xl font-bold text-ocean-950 tracking-tight">
                        ¿Por qué elegir <span className="text-ocean-600">Cleaner Club</span>?
                    </p>
                    <p className="mt-4 text-lg text-ocean-900/60 max-w-2xl mx-auto">
                        No solo limpiamos espacios, cuidamos tu paz mental.
                    </p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-10">
                    {features.map((feature) => (
                        <div
                            key={feature.name}
                            // MÓVIL: h-[300px] (bajito). PC: h-[500px] (original).
                            className="group relative h-[200px] md:h-[500px] w-full overflow-hidden rounded-3xl shadow-xl transition-all duration-500 hover:shadow-2xl hover:shadow-ocean-900/20"
                        >
                            {/* 1. IMAGEN DE FONDO */}
                            <div
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-110"
                                style={{ backgroundImage: `url('${feature.image}')` }}
                            />

                            {/* 2. OVERLAY OSCURO */}
                            <div className="absolute inset-0 bg-gradient-to-b from-ocean-900/40 to-ocean-950/90 opacity-60 md:from-transparent md:via-ocean-900/20 md:to-ocean-950/90" />

                            {/* 3. CONTENIDO */}
                            {/* MÓVIL: p-3 (padding pequeño). PC: p-8 y justify-end (al fondo). */}
                            <div className="absolute inset-0 flex flex-col p-3 md:p-4 md:justify-end">

                                {/* TARJETA DE VIDRIO */}
                                {/* MÓVIL: h-full (ocupa todo) y justify-center (centrado). */}
                                {/* PC: h-auto (altura automática), justify-start (normal) y diseño original. */}
                                <div className="relative overflow-hidden rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 transition-all duration-300 group-hover:bg-white/15 group-hover:border-white/30
                                    h-full flex flex-col justify-center items-start p-
                                    md:h-auto md:block md:p-6"
                                >
                                    {/* Icono */}
                                    <div className="mb-3 md:mb-4 inline-flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-xl bg-ocean-500 text-white shadow-lg shadow-ocean-500/30 transform group-hover:-translate-y-1 transition-transform duration-300">
                                        <feature.icon className="h-5 w-5 md:h-6 md:w-6" aria-hidden="true" />
                                    </div>

                                    {/* Títulos y textos */}
                                    <h3 className="text-xl md:text-2xl font-bold text-white mb-2 tracking-tight">
                                        {feature.name}
                                    </h3>

                                    <p className="text-ocean-50 text-sm leading-relaxed font-light opacity-90">
                                        {feature.description}
                                    </p>

                                    {/* Brillo decorativo */}
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