import { Home, Building, Car, Users, Sofa, Sparkles } from 'lucide-react'


export const services = [
    {
        icon: <Home className="w-8 h-8" />,
        title: "Limpieza General",
        description: "Limpieza completa de tu hogar incluyendo pisos, baños, cocina y áreas comunes.",
        features: ["Pisos y superficies", "Baños y cocinas", "Polvo y basura", "Cambio de sábanas"],
        price: "Desde $25/hora"
    },
    {
        icon: <Building className="w-8 h-8" />,
        title: "Limpieza Profunda",
        description: "Limpieza intensiva para eliminar suciedad acumulada en áreas difíciles de alcanzar.",
        features: ["Detalles y rincones", "Electrodomésticos", "Ventanas interiores", "Armarios y cajones"],
        price: "Desde $35/hora"
    },
    {
        icon: <Car className="w-8 h-8" />,
        title: "Limpieza Post-Obra",
        description: "Eliminación de residuos de construcción y limpieza profesional post-renovación.",
        features: ["Residuos de obra", "Polvo de construcción", "Superficies delicadas", "Limpieza final"],
        price: "Presupuesto personalizado"
    },
    {
        icon: <Users className="w-8 h-8" />,
        title: "Limpieza de Ventanas",
        description: "Ventanas impecables tanto interiores como exteriores con productos especializados.",
        features: ["Cristales sin marcas", "Marcos y persianas", "Altura segura", "Productos ecológicos"],
        price: "Desde $15/ventana"
    },
    {
        icon: <Sofa className="w-8 h-8" />,
        title: "Tapicería y Alfombras",
        description: "Limpieza profunda de muebles tapizados y alfombras con equipos profesionales.",
        features: ["Eliminación de manchas", "Desinfección", "Secado rápido", "Sin químicos agresivos"],
        price: "Desde $40/mueble"
    },
    {
        icon: <Sparkles className="w-8 h-8" />,
        title: "Servicio Express",
        description: "Limpieza rápida y eficiente para emergencias o visitas inesperadas.",
        features: ["30-60 minutos", "Áreas prioritarias", "Personal experto", "Disponible 24/7"],
        price: "Desde $30/servicio"
    }
];