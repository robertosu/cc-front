// app/page.tsx
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
                <TestimonialsSection />
            </main>
            <Footer />
        </>
    )
}