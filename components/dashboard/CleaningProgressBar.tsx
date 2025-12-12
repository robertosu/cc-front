'use client'

import { CheckCircle, Circle } from 'lucide-react'

interface CleaningProgressBarProps {
    currentStep: number
    totalSteps: number
    status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
}

export default function CleaningProgressBar({
                                                currentStep,
                                                totalSteps,
                                                status
                                            }: CleaningProgressBarProps) {

    const getStatusInfo = () => {
        switch (status) {
            case 'completed':
                return { text: 'Completada', color: 'bg-green-500', striped: false }
            case 'in_progress':
                return { text: 'En progreso', color: 'bg-ocean-500', striped: true }
            case 'pending':
                return { text: 'Pendiente', color: 'bg-gray-400', striped: false }
            case 'cancelled':
                return { text: 'Cancelada', color: 'bg-red-500', striped: false }
            default:
                return { text: 'Desconocido', color: 'bg-gray-300', striped: false }
        }
    }

    const { text, color, striped } = getStatusInfo()
    const progress = totalSteps > 0 ? (currentStep / totalSteps) * 100 : 0

    return (
        <div className="space-y-3">
            {/* Estilos para la animación striped */}
            <style jsx>{`
                @keyframes progress-stripes {
                    from { background-position: 1rem 0; }
                    to { background-position: 0 0; }
                }
                .progress-bar-striped {
                    background-image: linear-gradient(
                        45deg,
                        rgba(255, 255, 255, 0.15) 25%,
                        transparent 25%,
                        transparent 50%,
                        rgba(255, 255, 255, 0.15) 50%,
                        rgba(255, 255, 255, 0.15) 75%,
                        transparent 75%,
                        transparent
                    );
                    background-size: 1rem 1rem;
                }
                .animate-stripes {
                    animation: progress-stripes 1s linear infinite;
                }
            `}</style>

            <div className="flex justify-between items-center text-sm">
                <span className={`font-semibold px-2 py-0.5 rounded-full text-xs ${
                    status === 'in_progress' ? 'bg-ocean-100 text-ocean-700' : 'text-gray-600 bg-gray-100'
                }`}>
                    {text}
                </span>
                <span className="text-gray-500 font-medium">
                    {Math.round(progress)}%
                </span>
            </div>

            {/* Barra contenedora */}
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner relative">
                <div
                    className={`h-full ${color} transition-all duration-700 ease-in-out flex items-center justify-end pr-2 ${
                        striped ? 'progress-bar-striped animate-stripes' : ''
                    }`}
                    style={{ width: `${progress}%` }}
                >
                </div>
            </div>

            {/* Pasos */}
            <div className="flex justify-between items-center pt-1">
                <span className="text-xs text-gray-500">{currentStep} de {totalSteps} pasos</span>
                <div className="flex gap-1">
                    {Array.from({ length: totalSteps }, (_, i) => {
                        const stepNumber = i + 1
                        const isCompleted = stepNumber <= currentStep
                        return (
                            <div key={i} title={`Paso ${stepNumber}`} className={`w-2 h-2 rounded-full ${isCompleted ? 'bg-ocean-500' : 'bg-gray-300'}`} />
                        )
                    })}
                </div>
            </div>
        </div>
    )
}