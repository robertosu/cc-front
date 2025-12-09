// data/Services.js
import {
    Home,
    Utensils,
    Building,
    Flame,
    Sun,
    Calendar,
    Briefcase,
    Factory,
} from 'lucide-react'

export const WHATSAPP_LINKS = {
    general: "https://wa.me/message/EXZVVF7WM2F6N1",
    empresas: "https://wa.me/message/EXZVVF7WM2F6N1"
};

// He agregado la propiedad 'image' a cada servicio.
// Puedes cambiar las rutas por fotos específicas para cada servicio más adelante.
export const services = [
    {
        icon: <Home className="w-6 h-6" />,
        title: "Limpieza Integral",
        description: "Servicio completo para mantener tu hogar impecable.",
        image: "/limpieza_integral.jpg"
    },
    {
        icon: <Utensils className="w-6 h-6" />,
        title: "Limpieza de Cocina",
        description: "Desengrasado y limpieza profunda.",
        image: "/dedication.jpg"
    },
    {
        icon: <Building className="w-6 h-6" />,
        title: "Limpieza de Fachada",
        description: "Renueva la imagen exterior de tu edificio.",
        image: "/hero-bg.jpg"
    },
    {
        icon: <Flame className="w-6 h-6" />,
        title: "Limpieza de Quincho",
        description: "Tu zona de asados siempre lista.",
        image: "/responsability.jpg"
    },
    {
        icon: <Sun className="w-6 h-6" />,
        title: "Limpieza de Terraza",
        description: "Limpieza de pisos exteriores.",
        image: "/cleanroom.jpg"
    },
    {
        icon: <Calendar className="w-6 h-6" />,
        title: "Limpieza Mensual",
        description: "Planes programados para constancia.",
        image: "/dedication.jpg"
    },
    {
        icon: <Briefcase className="w-6 h-6" />,
        title: "Limpieza de Oficina",
        description: "Ambientes productivos y limpios.",
        image: "/hero-bg.jpg"
    }
];

export const corporateService = {
    icon: <Factory className="w-8 h-8" />,
    title: "Sección Empresas",
    description: "¿Buscas servicio industrial o comercial? Cotiza aquí.",
    link: WHATSAPP_LINKS.empresas
};

export const serviceInclusions = [
    "Insumos y Maquinaria industrial",
    "Personal calificado",
    "Limpieza de electrodomésticos",
    "Barrido, trapeado y aspirado de pisos",
    "Cambio de sábanas y arreglo de camas",
    "Desempolvado de muebles y superficies",
    "Aplicación de desengrasantes y productos",
    "Limpieza completa de baños"
];