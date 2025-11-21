import { Inter, Geist_Mono } from 'next/font/google'
import './globals.css'

// Configuración de fuentes optimizada para Next.js
const inter = Inter({
    subsets: ['latin'],
    variable: '--font-geist-sans',
    display: 'swap', // Mejora la performance de carga
})

const geistMono = Geist_Mono({
    subsets: ['latin'],
    variable: '--font-geist-mono',
    display: 'swap',
})

// Metadata para SEO (una de las grandes ventajas de Next.js)
export const metadata: {
    title: string;
    description: string;
    keywords: string;
    authors: { name: string }[];
    openGraph: { title: string; description: string; type: string; locale: string };

} = {
    title: 'CleanerClub - Limpieza Profesional a Domicilio',
    description: 'Servicios de limpieza profesional para tu hogar. Limpieza general, profunda, post-obra y más. Profesionales certificados y productos ecológicos.',
    keywords: 'limpieza, domicilio, profesional, hogar, limpieza profunda, post-obra',
    authors: [{ name: 'CleanerClub Team' }],
    openGraph: {
        title: 'CleanerClub - Limpieza Profesional',
        description: 'Tu hogar impecable con nuestros servicios de limpieza profesional',
        type: 'website',
        locale: 'es_ES',
    },
}

export const viewport = {
    width: 'device-width',
    initialScale: 1
}

// @ts-ignore
export default function RootLayout({ children  }) {
    return (
        <html lang="es" className={`${inter.variable} ${geistMono.variable}`}>
        <body className="min-h-screen bg-gray-50 antialiased">
        <div className="flex flex-col min-h-screen">
            {children}
        </div>
        </body>
        </html>
    )
}