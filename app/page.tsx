// app/page.js
import Header from '@/components/layout/Header'
import ServicesSection from '@/components/sections/ServicesSection'
import Footer from '@/components/layout/Footer'
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import StickyNavbar from "@/components/sections/StickyNavbar";

export default function HomePage() {
    return (
        <>
            <Header />
            <main>

                <StickyNavbar/>
                <ServicesSection />
                <TestimonialsSection/>
            </main>
            <Footer />
        </>
    )
}

/*
📝 NOTAS IMPORTANTES DE NEXT.JS:

1. **Componentes por defecto son Server Components**
   - Se renderizan en el servidor
   - Mejor SEO y performance inicial
   - No pueden usar useState, useEffect, etc.

2. **Client Components**
   - Necesarios para interactividad
   - Se marcan con 'use client' al inicio del archivo
   - Útiles para formularios, estados, eventos

3. **Estructura modular**
   - Cada sección es un componente independiente
   - Facilita mantenimiento y testing
   - Permite lazy loading futuro
*/