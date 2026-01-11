export default function JsonLd() {
    const schema = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Organization",
                "@id": "https://Cleaner Club.cl/#organization",
                "name": "Cleaner Club",
                "url": "https://Cleaner Club.cl/",
                "description": "Somos una empresa dedicada a brindar servicios de limpieza a hogares con un enfoque único y personalizado",
                "logo": {
                    "@type": "ImageObject",
                    "url": "https://Cleaner Club.cl/wp-content/uploads/2023/11/logoprincipal.png" // Usa la ruta de tu nueva imagen en public si la cambiaste
                }
            },
            {
                "@type": "WebSite",
                "@id": "https://Cleaner Club.cl/#website",
                "url": "https://Cleaner Club.cl/",
                "name": "Cleaner Club",
                "inLanguage": "es-ES",
                "publisher": {
                    "@id": "https://Cleaner Club.cl/#organization"
                }
            }
        ]
    }

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    )
}