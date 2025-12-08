// app/page.tsx
import Header from '@/components/layout/Header'
import ServicesSection from '@/components/sections/ServicesSection'
import Footer from '@/components/layout/Footer'
import StickyNavbar from "@/components/sections/StickyNavbar";
import ValuesSection from "@/components/sections/ValuesSection";


export default function HomePage() {
    return (
        <>
            <Header />
            <main>

                <StickyNavbar/>
                <ServicesSection />
                <ValuesSection />


            </main>
            <Footer />
        </>
    )
}