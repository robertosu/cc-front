import { Geist_Mono, Inter } from 'next/font/google'
import './globals.css'
import React from 'react'  // Asegúrate de importar React si usas types

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-geist-sans',
    display: 'swap',
})

const geistMono = Geist_Mono({
    subsets: ['latin'],
    variable: '--font-geist-mono',
    display: 'swap',
})

export const metadata: {
    title: string
    description: string
    keywords: string
    authors: { name: string }[]
    openGraph: { title: string; description: string; type: string; locale: string }
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
    initialScale: 1,
}

// ✨ Tipeo explícito de children
export default function RootLayout({ children }: { children: React.ReactNode }) {
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
