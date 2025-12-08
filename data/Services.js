import {
    Home,
    Utensils,
    Building,
    Flame,
    Sun,
    Calendar,
    Briefcase,
    Factory,
    Maximize,
    ArrowRight
} from 'lucide-react'

// Enlaces de WhatsApp
export const WHATSAPP_LINKS = {
    general: "https://wa.me/message/EXZVVF7WM2F6N1",
    empresas: "https://wa.me/message/EXZVVF7WM2F6N1"
};

// Servicios Principales (Para el Carrusel/Spinner)
export const services = [
    {
        icon: <Home className="w-8 h-8" />,
        title: "Limpieza Integral",
        description: "Servicio completo para mantener tu hogar impecable.",
    },
    {
        icon: <Utensils className="w-8 h-8" />,
        title: "Limpieza de Cocina",
        description: "Desengrasado y limpieza profunda.",
    },
    {
        icon: <Building className="w-8 h-8" />,
        title: "Limpieza de Fachada",
        description: "Renueva la imagen exterior de tu edificio.",
    },
    {
        icon: <Flame className="w-8 h-8" />,
        title: "Limpieza de Quincho",
        description: "Tu zona de asados siempre lista.",
    },
    {
        icon: <Sun className="w-8 h-8" />,
        title: "Limpieza de Terraza",
        description: "Limpieza de pisos exteriores.",
    },
    {
        icon: <Calendar className="w-8 h-8" />,
        title: "Limpieza Mensual",
        description: "Planes programados para constancia.",
    },
    {
        icon: <Briefcase className="w-8 h-8" />,
        title: "Limpieza de Oficina",
        description: "Ambientes productivos y limpios.",
    }
];

// Sección Especial Empresas
export const corporateService = {
    icon: <Factory className="w-12 h-12" />,
    title: "Sección Empresas",
    description: "¿Buscas servicio de limpieza industrial o comercial?",
    link: WHATSAPP_LINKS.empresas
};



// Inclusiones
export const serviceInclusions = [
    "Insumos y Maquinaria industrial",
    "Personal calificado",
    "Limpieza de electrodomésticos",
    "Barrido, trapeado y aspirado de pisos",
    "Cambio de sábanas y arreglo de camas",
    "Desempolvado de muebles y superficies",
    "Aplicación de desengrasantes y productos para muebles",
    "Limpieza completa de baños: ducha, lavamanos, WC, espejos y pisos"
];