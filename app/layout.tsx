import { Geist_Mono, Inter } from 'next/font/google'
import './globals.css'
import React from 'react'
import JsonLd from "@/components/seo/JsonLd";
import {Metadata} from "next";  // Asegúrate de importar React si usas types

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

const baseUrl = 'https://cc-front-neon.vercel.app/'


export const metadata: Metadata = {
    // Título exacto de WordPress para mantener consistencia
    title: {
        default: 'Cleaner Club - Limpieza a domicilio en La Serena',
        template: '%s | Cleaner Club'
    },
    // Descripción exacta de WordPress (Mejor orientada a la conversión: "Agenda online", "Ahorra tiempo")
    description: 'Agenda online tu servicio de limpieza a domicilio con nuestros profesionales - Ahorra tu tiempo - Automatiza la limpieza de tu hogar.',

    // URL Canónica (CRUCIAL para SEO)
    alternates: {
        canonical: baseUrl,
    },

    // Instrucciones para robots (Googlebot, etc.)
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },

    // Open Graph (Para compartir en Facebook, WhatsApp, etc.)
    openGraph: {
        title: 'Cleaner Club - Limpieza a domicilio en La Serena',
        description: 'Agenda online tu servicio de limpieza a domicilio con nuestros profesionales - Ahorra tu tiempo - Automatiza la limpieza de tu hogar.',
        url: baseUrl,
        siteName: 'Cleaner Club - Somos una empresa dedicada a brindar servicios de limpieza',
        locale: 'es_ES',
        type: 'website', // 'website' es correcto para la home, WordPress usaba 'article' erróneamente en la home.
    },

    // Twitter Card
    twitter: {
        card: 'summary_large_image',
        title: 'Cleaner Club - Limpieza a domicilio en La Serena',
        description: 'Agenda online tu servicio de limpieza a domicilio con nuestros profesionales.',
         images: ['/logo3.jpg'], // Recomendado: Agrega una imagen en public/ y enlázala aquí
    },

    // Iconos (Favicons) - Next.js los busca en /app/favicon.ico automáticamente,
    // pero puedes declararlos explícitamente para Apple devices si tienes los archivos.

    // Metadatos de verificación (Si usas Search Console)
    // verification: {
    //     google: 'tu-codigo-de-verificacion',
    // },
}

export const viewport = {
    width: 'device-width',
    initialScale: 1,
}



export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="es" className={`${inter.variable} ${geistMono.variable}`}>
        <body className="min-h-screen bg-gray-50 antialiased">
        <JsonLd />
        <div className="flex flex-col min-h-screen">
            {children}
        </div>
        </body>
        </html>
    )
}
