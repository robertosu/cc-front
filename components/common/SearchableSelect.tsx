'use client'

import { useState, useRef, useEffect } from 'react'
import { Search, ChevronDown, Check, X } from 'lucide-react'

interface Option {
    id: string
    label: string
    sublabel?: string
}

interface SearchableSelectProps {
    options: Option[]
    value: string
    onChange: (value: string) => void
    placeholder?: string
    label?: string
    required?: boolean
    disabled?: boolean
    emptyMessage?: string
}

export default function SearchableSelect({
                                             options,
                                             value,
                                             onChange,
                                             placeholder = 'Seleccionar...',
                                             label,
                                             required = false,
                                             disabled = false,
                                             emptyMessage = 'No se encontraron resultados'
                                         }: SearchableSelectProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const dropdownRef = useRef<HTMLDivElement>(null)
    const searchInputRef = useRef<HTMLInputElement>(null)

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

    // Focus en el input de búsqueda cuando se abre
    useEffect(() => {
        if (isOpen && searchInputRef.current) {
            searchInputRef.current.focus()
        }
    }, [isOpen])

    // Filtrar opciones por búsqueda
    const filteredOptions = options.filter(option =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        option.sublabel?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    // Obtener la opción seleccionada
    const selectedOption = options.find(opt => opt.id === value)

    const handleSelect = (optionId: string) => {
        onChange(optionId)
        setIsOpen(false)
        setSearchTerm('')
    }

    const handleClear = (e: React.MouseEvent | React.KeyboardEvent) => {
        e.stopPropagation()
        onChange('')
    }

    return (
        <div className="relative" ref={dropdownRef}>
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}

            {/* Botón selector */}
            <button
                type="button"
                onClick={() => !disabled && setIsOpen(!isOpen)}
                disabled={disabled}
                className={`w-full flex items-center justify-between px-3 py-2 border rounded-lg transition-colors ${
                    disabled
                        ? 'bg-gray-100 cursor-not-allowed'
                        : 'bg-white hover:border-purple-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:outline-none'
                } ${isOpen ? 'border-purple-500 ring-2 ring-purple-500' : 'border-gray-300'}`}
            >
                <div className="flex-1 text-left truncate">
                    {selectedOption ? (
                        <div>
                            <p className="text-sm font-medium text-gray-900">{selectedOption.label}</p>
                            {selectedOption.sublabel && (
                                <p className="text-xs text-gray-500">{selectedOption.sublabel}</p>
                            )}
                        </div>
                    ) : (
                        <span className="text-sm text-gray-500">{placeholder}</span>
                    )}
                </div>
                <div className="flex items-center gap-1 ml-2">
                    {selectedOption && !disabled && (
                        <div
                            role="button"
                            tabIndex={0}
                            onClick={(e) => {
                                e.stopPropagation()
                                handleClear(e)
                            }}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") handleClear(e)
                            }}
                            className="p-1 hover:bg-gray-100 rounded transition-colors cursor-pointer"
                        >
                            <X className="w-4 h-4 text-gray-400" />
                        </div>
                    )}
                    <ChevronDown
                        className={`w-4 h-4 text-gray-500 transition-transform ${
                            isOpen ? 'rotate-180' : ''
                        }`}
                    />
                </div>
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute z-50 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-hidden">
                    {/* Buscador */}
                    <div className="p-3 border-b border-gray-200 bg-gray-50">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                ref={searchInputRef}
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Buscar..."
                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:outline-none text-sm"
                            />
                        </div>
                    </div>

                    {/* Lista de opciones */}
                    <div className="max-h-60 overflow-y-auto">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option) => {
                                const isSelected = option.id === value

                                return (
                                    <button
                                        key={option.id}
                                        type="button"
                                        onClick={() => handleSelect(option.id)}
                                        className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-purple-50 transition-colors text-left ${
                                            isSelected ? 'bg-purple-50' : ''
                                        }`}
                                    >
                                        <div className="flex-1">
                                            <p className={`text-sm font-medium ${
                                                isSelected ? 'text-purple-900' : 'text-gray-900'
                                            }`}>
                                                {option.label}
                                            </p>
                                            {option.sublabel && (
                                                <p className="text-xs text-gray-500">{option.sublabel}</p>
                                            )}
                                        </div>
                                        {isSelected && (
                                            <Check className="w-5 h-5 text-purple-600 flex-shrink-0" />
                                        )}
                                    </button>
                                )
                            })
                        ) : (
                            <div className="px-4 py-8 text-center text-gray-500 text-sm">
                                {emptyMessage}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}