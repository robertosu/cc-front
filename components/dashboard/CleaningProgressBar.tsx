'use client'

import { CheckCircle, Circle } from 'lucide-react'

interface CleaningProgressBarProps {
    currentSector: number
    totalSectors: number
    status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
}

export default function CleaningProgressBar({
                                                currentSector,
                                                totalSectors,
                                                status
                                            }: CleaningProgressBarProps) {

    const getStatusColor = () => {
        switch (status) {
            case 'completed':
                return 'bg-green-500'
            case 'in_progress':
                return 'bg-blue-500'
            case 'pending':
                return 'bg-gray-300'
            case 'cancelled':
                return 'bg-red-500'
            default:
                return 'bg-gray-300'
        }
    }

    const getStatusText = () => {
        switch (status) {
            case 'completed':
                return 'Completada'
            case 'in_progress':
                return 'En progreso'
            case 'pending':
                return 'Pendiente'
            case 'cancelled':
                return 'Cancelada'
            default:
                return 'Desconocido'
        }
    }

    const progress = totalSectors > 0 ? (currentSector / totalSectors) * 100 : 0

    return (
        <div className="space-y-3">
            {/* Estado y progreso */}
            <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">
                    {getStatusText()}
                </span>
                <span className="text-sm text-gray-600">
                    {currentSector} de {totalSectors} sectores
                </span>
            </div>

            {/* Barra de progreso */}
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                    className={`h-full ${getStatusColor()} transition-all duration-500 ease-out`}
                    style={{ width: `${progress}%` }}
                />
            </div>

            {/* Sectores individuales */}
            <div className="flex gap-2 flex-wrap">
                {Array.from({ length: totalSectors }, (_, i) => {
                    const sectorNumber = i + 1
                    const isCompleted = sectorNumber <= currentSector

                    return (
                        <div
                            key={i}
                            className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                                isCompleted
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-gray-100 text-gray-600'
                            }`}
                        >
                            {isCompleted ? (
                                <CheckCircle className="w-3 h-3" />
                            ) : (
                                <Circle className="w-3 h-3" />
                            )}
                            Sector {sectorNumber}
                        </div>
                    )
                })}
            </div>

            {/* Porcentaje */}
            <div className="text-center">
                <span className="text-2xl font-bold text-gray-900">
                    {Math.round(progress)}%
                </span>
                <span className="text-sm text-gray-600 ml-2">
                    completado
                </span>
            </div>
        </div>
    )
}

/*
📝 CARACTERÍSTICAS:
✅ Barra de progreso visual
✅ Indicadores por sector
✅ Colores según estado
✅ Porcentaje de completado
✅ Animaciones suaves
✅ Responsive
*/