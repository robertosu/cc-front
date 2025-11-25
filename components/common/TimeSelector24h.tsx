// components/common/TimeSelector24h.tsx
'use client'

import { useState, useRef, useEffect } from 'react'
import { Clock, ChevronDown } from 'lucide-react'

interface TimeSelector24hProps {
    value: string // Formato "HH:MM"
    onChange: (value: string) => void
    label?: string
    required?: boolean
    disabled?: boolean
    placeholder?: string
}

export default function TimeSelector24h({
                                            value,
                                            onChange,
                                            label,
                                            required = false,
                                            disabled = false,
                                            placeholder = "Seleccionar hora"
                                        }: TimeSelector24hProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [selectedHour, setSelectedHour] = useState<string>('09')
    const [selectedMinute, setSelectedMinute] = useState<string>('00')
    const dropdownRef = useRef<HTMLDivElement>(null)

    // Inicializar con el valor prop
    useEffect(() => {
        if (value) {
            const [hour, minute] = value.split(':')
            setSelectedHour(hour)
            setSelectedMinute(minute)
        }
    }, [value])

    // Cerrar dropdown al hacer clic fuera
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside)
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isOpen])

    // Generar arrays de horas y minutos
    const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'))
    const minutes = Array.from({ length: 12 }, (_, i) => (i * 5).toString().padStart(2, '0'))

    const handleHourSelect = (hour: string) => {
        setSelectedHour(hour)
        onChange(`${hour}:${selectedMinute}`)
    }

    const handleMinuteSelect = (minute: string) => {
        setSelectedMinute(minute)
        onChange(`${selectedHour}:${minute}`)
        setIsOpen(false) // Cerrar al seleccionar minuto
    }

    const displayValue = value || placeholder

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
                <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className={`text-sm ${value ? 'text-gray-900' : 'text-gray-500'}`}>
                        {displayValue}
                    </span>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${
                    isOpen ? 'rotate-180' : ''
                }`} />
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute z-50 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg">
                    <div className="p-4">
                        <div className="grid grid-cols-2 gap-4">
                            {/* Columna de Horas */}
                            <div>
                                <p className="text-xs font-medium text-gray-700 mb-2 text-center">
                                    Hora
                                </p>
                                <div className="max-h-48 overflow-y-auto space-y-1 border border-gray-200 rounded-lg p-2">
                                    {hours.map((hour) => (
                                        <button
                                            key={hour}
                                            type="button"
                                            onClick={() => handleHourSelect(hour)}
                                            className={`w-full px-3 py-2 text-sm rounded transition-colors ${
                                                selectedHour === hour
                                                    ? 'bg-purple-600 text-white font-medium'
                                                    : 'hover:bg-purple-50 text-gray-700'
                                            }`}
                                        >
                                            {hour}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Columna de Minutos */}
                            <div>
                                <p className="text-xs font-medium text-gray-700 mb-2 text-center">
                                    Minutos
                                </p>
                                <div className="max-h-48 overflow-y-auto space-y-1 border border-gray-200 rounded-lg p-2">
                                    {minutes.map((minute) => (
                                        <button
                                            key={minute}
                                            type="button"
                                            onClick={() => handleMinuteSelect(minute)}
                                            className={`w-full px-3 py-2 text-sm rounded transition-colors ${
                                                selectedMinute === minute
                                                    ? 'bg-purple-600 text-white font-medium'
                                                    : 'hover:bg-purple-50 text-gray-700'
                                            }`}
                                        >
                                            :{minute}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Vista previa de la hora seleccionada */}
                        <div className="mt-4 pt-4 border-t border-gray-200 text-center">
                            <p className="text-xs text-gray-600 mb-1">Hora seleccionada:</p>
                            <p className="text-2xl font-bold text-purple-600">
                                {selectedHour}:{selectedMinute}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Ayuda visual */}
            <p className="mt-1 text-xs text-gray-500">
                Formato 24 horas (00:00 - 23:59)
            </p>
        </div>
    )
}