'use client'

import {useEffect, useRef, useState} from 'react'
import {ChevronDown, Search} from 'lucide-react'
import {countries, type Country} from '@/data/Countries'

interface CountrySelectorProps {
    selectedCountry: Country
    onSelect: (country: Country) => void
}

export default function CountrySelector({ selectedCountry, onSelect }: CountrySelectorProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const dropdownRef = useRef<HTMLDivElement>(null)

    // Cerrar dropdown al hacer clic fuera
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
                setSearchTerm('')
            }
        }

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside)
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isOpen])

    // Filtrar países por búsqueda
    const filteredCountries = countries.filter(country =>
        country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        country.dialCode.includes(searchTerm)
    )

    const handleSelect = (country: Country) => {
        onSelect(country)
        setIsOpen(false)
        setSearchTerm('')
    }

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Botón selector */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:border-cyan-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-colors bg-white"
            >
                <span className="text-xl">{selectedCountry.flag}</span>
                <span className="font-medium text-gray-700">{selectedCountry.dialCode}</span>
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute z-50 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg">
                    {/* Buscador */}
                    <div className="p-3 border-b border-gray-200">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Buscar país..."
                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                                autoFocus
                            />
                        </div>
                    </div>

                    {/* Lista de países */}
                    <div className="max-h-60 overflow-y-auto">
                        {filteredCountries.length > 0 ? (
                            filteredCountries.map((country) => (
                                <button
                                    key={country.code}
                                    type="button"
                                    onClick={() => handleSelect(country)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-cyan-50 transition-colors text-left ${
                                        selectedCountry.code === country.code ? 'bg-cyan-50' : ''
                                    }`}
                                >
                                    <span className="text-xl">{country.flag}</span>
                                    <span className="flex-1 font-medium text-gray-900">{country.name}</span>
                                    <span className="text-gray-600">{country.dialCode}</span>
                                </button>
                            ))
                        ) : (
                            <div className="px-4 py-8 text-center text-gray-500">
                                No se encontraron países
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

/*
📝 CARACTERÍSTICAS:
✅ Búsqueda en tiempo real
✅ Banderas emoji
✅ Cierre automático al hacer clic fuera
✅ Indicador visual del país seleccionado
✅ Diseño responsive
✅ Accesibilidad con focus states
*/