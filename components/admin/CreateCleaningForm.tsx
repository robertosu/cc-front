'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AlertCircle, CheckCircle } from 'lucide-react'

interface House {
    id: string
    address: string
    sectors_count: number
    client: {
        full_name: string
    }
}

interface Cleaner {
    id: string
    full_name: string
    email: string
}

export default function CreateCleaningForm({ houses, cleaners }: { houses: House[], cleaners: Cleaner[] }) {
    const router = useRouter()
    const [formData, setFormData] = useState({
        house_id: '',
        cleaner_id: '',
        scheduled_date: '',
        start_time: '09:00',
        end_time: '12:00',
        notes: ''
    })
    const [isLoading, setIsLoading] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
        setMessage(null)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setMessage(null)

        try {
            const response = await fetch('/api/cleanings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    cleaner_id: formData.cleaner_id || null
                })
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Error al crear limpieza')
            }

            setMessage({ type: 'success', text: '¡Limpieza programada exitosamente!' })

            // Limpiar formulario
            setFormData({
                house_id: '',
                cleaner_id: '',
                scheduled_date: '',
                start_time: '09:00',
                end_time: '12:00',
                notes: ''
            })

            // Refrescar página
            router.refresh()
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message })
        } finally {
            setIsLoading(false)
        }
    }

    const selectedHouse = houses.find(h => h.id === formData.house_id)

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {message && (
                <div className={`px-4 py-3 rounded-lg flex items-start gap-2 ${
                    message.type === 'success'
                        ? 'bg-green-50 text-green-700 border border-green-200'
                        : 'bg-red-50 text-red-700 border border-red-200'
                }`}>
                    {message.type === 'success' ? (
                        <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    ) : (
                        <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    )}
                    <span className="text-sm">{message.text}</span>
                </div>
            )}

            <div>
                <label htmlFor="house_id" className="block text-sm font-medium text-gray-700 mb-2">
                    Casa *
                </label>
                <select
                    id="house_id"
                    name="house_id"
                    value={formData.house_id}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 text-sm"
                >
                    <option value="">Selecciona una casa</option>
                    {houses.map(house => (
                        <option key={house.id} value={house.id}>
                            {house.address} - {house.client.full_name}
                        </option>
                    ))}
                </select>
                {selectedHouse && (
                    <p className="mt-1 text-xs text-gray-500">
                        {selectedHouse.sectors_count} sectores
                    </p>
                )}
            </div>

            <div>
                <label htmlFor="cleaner_id" className="block text-sm font-medium text-gray-700 mb-2">
                    Cleaner (Opcional)
                </label>
                <select
                    id="cleaner_id"
                    name="cleaner_id"
                    value={formData.cleaner_id}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 text-sm"
                >
                    <option value="">Sin asignar</option>
                    {cleaners.map(cleaner => (
                        <option key={cleaner.id} value={cleaner.id}>
                            {cleaner.full_name}
                        </option>
                    ))}
                </select>
                <p className="mt-1 text-xs text-gray-500">
                    Puedes asignarlo después
                </p>
            </div>

            <div>
                <label htmlFor="scheduled_date" className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha *
                </label>
                <input
                    type="date"
                    id="scheduled_date"
                    name="scheduled_date"
                    value={formData.scheduled_date}
                    onChange={handleChange}
                    required
                    min={new Date().toISOString().split('T')[0]}
                    disabled={isLoading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                />
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label htmlFor="start_time" className="block text-sm font-medium text-gray-700 mb-2">
                        Hora Inicio *
                    </label>
                    <input
                        type="time"
                        id="start_time"
                        name="start_time"
                        value={formData.start_time}
                        onChange={handleChange}
                        required
                        disabled={isLoading}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    />
                </div>

                <div>
                    <label htmlFor="end_time" className="block text-sm font-medium text-gray-700 mb-2">
                        Hora Fin *
                    </label>
                    <input
                        type="time"
                        id="end_time"
                        name="end_time"
                        value={formData.end_time}
                        onChange={handleChange}
                        required
                        disabled={isLoading}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    />
                </div>
            </div>

            <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                    Notas (Opcional)
                </label>
                <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    disabled={isLoading}
                    rows={3}
                    placeholder="Instrucciones especiales para el cleaner"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 resize-none text-sm"
                />
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
                {isLoading ? 'Programando...' : 'Programar Limpieza'}
            </button>
        </form>
    )
}