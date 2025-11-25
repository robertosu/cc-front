'use client'

import {useEffect, useRef, useState} from 'react'
import {Check, ChevronDown, Search, X} from 'lucide-react'

interface Option {
    id: string
    label: string
    sublabel?: string
}

interface MultiSearchableSelectProps {
    options: Option[]
    value: string[]
    onChange: (value: string[]) => void
    placeholder?: string
    label?: string
    disabled?: boolean
    emptyMessage?: string
    maxHeight?: string
}

export default function MultiSearchableSelect({
                                                  options,
                                                  value,
                                                  onChange,
                                                  placeholder = 'Seleccionar...',
                                                  label,
                                                  disabled = false,
                                                  emptyMessage = 'No se encontraron resultados',
                                                  maxHeight = '200px'
                                              }: MultiSearchableSelectProps) {
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

    // Obtener opciones seleccionadas
    const selectedOptions = options.filter(opt => value.includes(opt.id))

    const toggleOption = (optionId: string) => {
        if (value.includes(optionId)) {
            onChange(value.filter(id => id !== optionId))
        } else {
            onChange([...value, optionId])
        }
    }

    const removeOption = (optionId: string, e: React.MouseEvent) => {
        e.stopPropagation()
        onChange(value.filter(id => id !== optionId))
    }

    const clearAll = (e: React.MouseEvent) => {
        e.stopPropagation()
        onChange([])
    }

    return (
        <div className="relative" ref={dropdownRef}>
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    {label}
                </label>
            )}

            <div
                role="button"
                tabIndex={0}
                onClick={() => !disabled && setIsOpen(!isOpen)}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && !disabled && setIsOpen(!isOpen)}
                className={`w-full flex items-start justify-between px-3 py-2 border rounded-lg transition-colors ${
                    disabled
                        ? 'bg-gray-100 cursor-not-allowed'
                        : 'bg-white hover:border-purple-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:outline-none'
                } ${isOpen ? 'border-purple-500 ring-2 ring-purple-500' : 'border-gray-300'}`}
            >
                <div className="flex-1 text-left">
                    {selectedOptions.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                            {selectedOptions.map((option) => (
                                <span
                                    key={option.id}
                                    className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full"
                                >
                                    {option.label}
                                    {!disabled && (
                                        <button
                                            type="button"
                                            onClick={(e) => removeOption(option.id, e)}
                                            className="hover:text-purple-900"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    )}
                                </span>
                            ))}
                        </div>
                    ) : (
                        <span className="text-sm text-gray-500">{placeholder}</span>
                    )}
                </div>
                <div className="flex items-center gap-1 ml-2">
                    {selectedOptions.length > 0 && !disabled && (
                        <button
                            type="button"
                            onClick={clearAll}
                            className="p-1 hover:bg-gray-100 rounded transition-colors"
                            title="Limpiar selección"
                        >
                            <X className="w-4 h-4 text-gray-400" />
                        </button>
                    )}
                    <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${
                        isOpen ? 'rotate-180' : ''
                    }`} />
                </div>
            </div>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute z-50 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
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
                        {selectedOptions.length > 0 && (
                            <p className="text-xs text-gray-500 mt-2">
                                {selectedOptions.length} seleccionado{selectedOptions.length !== 1 ? 's' : ''}
                            </p>
                        )}
                    </div>

                    {/* Lista de opciones */}
                    <div className="overflow-y-auto" style={{ maxHeight }}>
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option) => {
                                const isSelected = value.includes(option.id)

                                return (
                                    <button
                                        key={option.id}
                                        type="button"
                                        onClick={() => toggleOption(option.id)}
                                        className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-purple-50 transition-colors text-left ${
                                            isSelected ? 'bg-purple-50' : ''
                                        }`}
                                    >
                                        <div className={`w-5 h-5 flex items-center justify-center border-2 rounded ${
                                            isSelected
                                                ? 'bg-purple-600 border-purple-600'
                                                : 'border-gray-300'
                                        }`}>
                                            {isSelected && (
                                                <Check className="w-3 h-3 text-white" />
                                            )}
                                        </div>
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