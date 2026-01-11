// app/page.tsx
import Header from '@/components/layout/Header'
import ServicesSection from '@/components/sections/ServicesSection'
import Footer from '@/components/layout/Footer'
import StickyNavbar from "@/components/sections/StickyNavbar";
import ValuesSection from "@/components/sections/ValuesSection";
import LocationSection from "@/components/sections/LocationSection";

export default function HomePage() {
    return (
        <>
            <Header />
            <main>


                <StickyNavbar/>
                <ServicesSection />
                <ValuesSection />
                <LocationSection />
            </main>
            <Footer />
        </>
    )
}