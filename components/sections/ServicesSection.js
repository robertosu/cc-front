import { CheckCircle2 } from "lucide-react";

const includedServices = [
    "Limpieza de comedor, living, dormitorios y cocina",
    "Limpieza de electrodomésticos (externa)",
    "Barrido, trapeado y aspirado de pisos",
    "Cambio de sábanas y arreglo de camas",
    "Desempolvado de muebles y superficies",
    "Aplicación de desengrasantes y productos para muebles",
    "Limpieza completa de baños: ducha, lavamanos, WC, espejos y pisos"
];

export default function ServicesSection() {
    return (
        <section id="services" className="bg-white py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl lg:text-center mb-16">
                    <h2 className="text-base font-semibold leading-7 text-teal-600">Servicios y Precios</h2>
                    <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        Todo lo que necesitas para un hogar brillante
                    </p>
                    <p className="mt-6 text-lg leading-8 text-gray-600">
                        Simplificamos la limpieza de tu hogar con un servicio todo incluido.
                    </p>
                </div>

                <div className="mx-auto max-w-2xl rounded-3xl ring-1 ring-gray-200 sm:mt-20 lg:mx-0 lg:flex lg:max-w-none">
                    <div className="p-8 sm:p-10 lg:flex-auto">
                        <h3 className="text-2xl font-bold tracking-tight text-gray-900">Limpieza a domicilio estándar</h3>
                        <p className="mt-6 text-base leading-7 text-gray-600">
                            Nuestro servicio está diseñado para mantener tu hogar impecable de manera regular. Llevamos nuestros propios productos y herramientas profesionales.
                        </p>
                        <div className="mt-10 flex items-center gap-x-4">
                            <h4 className="flex-none text-sm font-semibold leading-6 text-teal-600">¿Qué incluye?</h4>
                            <div className="h-px flex-auto bg-gray-100" />
                        </div>
                        <ul
                            role="list"
                            className="mt-8 grid grid-cols-1 gap-4 text-sm leading-6 text-gray-600 sm:grid-cols-2 sm:gap-6"
                        >
                            {includedServices.map((service) => (
                                <li key={service} className="flex gap-x-3">
                                    <CheckCircle2 className="h-6 w-5 flex-none text-teal-600" aria-hidden="true" />
                                    {service}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="-mt-2 p-2 lg:mt-0 lg:w-full lg:max-w-md lg:flex-shrink-0">
                        <div className="rounded-2xl bg-gray-50 py-10 text-center ring-1 ring-inset ring-gray-900/5 lg:flex lg:flex-col lg:justify-center lg:py-16">
                            <div className="mx-auto max-w-xs px-8">
                                <p className="text-base font-semibold text-gray-600">Invierte en tu tranquilidad</p>
                                <p className="mt-6 flex items-baseline justify-center gap-x-2">
                                    <span className="text-5xl font-bold tracking-tight text-gray-900">$35.000</span>
                                    <span className="text-sm font-semibold leading-6 tracking-wide text-gray-600">CLP</span>
                                </p>
                                <p className="mt-2 text-xs text-gray-500">Valor referencial por sesión (4 horas)</p>
                                <a
                                    href="/register"
                                    className="mt-10 block w-full rounded-md bg-teal-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
                                >
                                    Agendar Limpieza
                                </a>
                                <p className="mt-6 text-xs leading-5 text-gray-600">
                                    Garantía de satisfacción y seguro incluido.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}