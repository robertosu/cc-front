'use client'

import { useState, useEffect } from 'react'
import { Smartphone, Zap } from 'lucide-react'

export default function LiveProgressBanner() {
    const [progress, setProgress] = useState(15)
    const [statusText, setStatusText] = useState('Iniciando servicio...')

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) return 0
                return prev + (prev < 50 ? 0.5 : 0.8)
            })
        }, 100)
        return () => clearInterval(interval)
    }, [])

    useEffect(() => {
        if (progress < 25) setStatusText('Llegando al domicilio...')
        else if (progress < 50) setStatusText('Limpiando Cocina y Baños...')
        else if (progress < 75) setStatusText('Aspirando Dormitorios...')
        else if (progress < 95) setStatusText('Finalizando detalles...')
        else setStatusText('¡Limpieza Completada!')
    }, [progress])

    return (
        <div className="w-full max-w-sm bg-white/30 backdrop-blur-md border border-white/20 shadow-2xl rounded-2xl p-5 transform transition-all hover:scale-105 duration-300 text-left">
            <div className="flex items-start justify-between mb-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="relative flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                        </span>
                        <h3 className="font-bold text-white text-sm">Seguimiento en Vivo</h3>
                    </div>
                    <p className="text-xs text-ocean-100">
                        Monitorea a tu Cleaner desde el celular
                    </p>
                </div>
                <div className="bg-white/10 p-2 rounded-lg">
                    <Smartphone className="w-5 h-5 text-white" />
                </div>
            </div>

            <div className="space-y-2">
                <div className="flex justify-between text-xs font-medium text-white">
                    <span className="animate-pulse text-ocean-200">{statusText}</span>
                    <span>{Math.floor(progress)}%</span>
                </div>

                <div className="w-full bg-black/20 rounded-full h-3 overflow-hidden shadow-inner relative">
                    <style jsx>{`
                        @keyframes progress-stripes { from { background-position: 1rem 0; } to { background-position: 0 0; } }
                        .progress-bar-striped {
                            background-image: linear-gradient(45deg,rgba(255, 255, 255, 0.15) 25%,transparent 25%,transparent 50%,rgba(255, 255, 255, 0.15) 50%,rgba(255, 255, 255, 0.15) 75%,transparent 75%,transparent);
                            background-size: 1rem 1rem;
                        }
                        .animate-stripes { animation: progress-stripes 1s linear infinite; }
                    `}</style>
                    <div
                        className="h-full bg-ocean-400 progress-bar-striped animate-stripes transition-all duration-100 ease-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            <div className="mt-4 flex items-center gap-2 text-[10px] text-ocean-100 bg-white/5 p-2 rounded border border-white/10">
                <Zap className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                <span>Disponible en todos nuestros servicios</span>
            </div>
        </div>
    )
}