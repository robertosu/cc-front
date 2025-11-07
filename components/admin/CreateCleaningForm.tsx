'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AlertCircle, CheckCircle, X } from 'lucide-react'

interface Client {
    id: string
    full_name: string
    email: string
}

interface Cleaner {
    id: string
    full_name: string
    email: string
}

export default function CreateCleaningForm({
                                               clients,
                                               cleaners
                                           }: {
    clients: Client[],
    cleaners: Cleaner[]
}) {
    const router = useRouter()
    const [formData, setFormData] = useState({
        client_id: '',
        address: '',
        total_steps: '3',
        scheduled_date: '',
        start_time: '09:00',
        end_time: '12:00',
        notes: ''
    })
    const [selectedCleaners, setSelectedCleaners] = useState<string[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
        setMessage(null)
    }

    const toggleCleaner = (cleanerId: string) => {
        setSelectedCleaners(prev =>
            prev.includes(cleanerId)
                ? prev.filter(id => id !== cleanerId)
                : [...prev, cleanerId]
        )
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
                    total_steps: parseInt(formData.total_steps),
                    cleaner_ids: selectedCleaners
                })
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Error al crear limpieza')
            }

            setMessage({ type: 'success', text: '¡Limpieza programada exitosamente!' })

            // Limpiar formulario
            setFormData({
                client_id: '',
                address: '',
                total_steps: '3',
                scheduled_date: '',
                start_time: '09:00',
                end_time: '12:00',
                notes: ''
            })
            setSelectedCleaners([])

            // Refrescar página
            router.refresh()
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message })
        } finally {
            setIsLoading(false)
        }
    }

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

            {/* Cliente */}
            <div>
                <label htmlFor="client_id" className="block text-sm font-medium text-gray-700 mb-2">
                    Cliente *
                </label>
                <select
                    id="client_id"
                    name="client_id"
                    value={formData.client_id}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 text-sm"
                >
                    <option value="">Selecciona un cliente</option>
                    {clients.map(client => (
                        <option key={client.id} value={client.id}>
                            {client.full_name} ({client.email})
                        </option>
                    ))}
                </select>
            </div>

            {/* Dirección */}
            <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                    Dirección *
                </label>
                <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                    placeholder="Calle 123, Ciudad"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                />
            </div>

            {/* Steps */}
            <div>
                <label htmlFor="total_steps" className="block text-sm font-medium text-gray-700 mb-2">
                    Número de Steps *
                </label>
                <input
                    type="number"
                    id="total_steps"
                    name="total_steps"
                    value={formData.total_steps}
                    onChange={handleChange}
                    required
                    min="1"
                    max="20"
                    disabled={isLoading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                />
                <p className="mt-1 text-xs text-gray-500">
                    Divide la limpieza en pasos (1-20)
                </p>
            </div>

            {/* Cleaners */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cleaners (Opcional)
                </label>
                <div className="border border-gray-300 rounded-lg p-3 max-h-40 overflow-y-auto bg-gray-50">
                    {cleaners.length === 0 ? (
                        <p className="text-sm text-gray-500 text-center py-2">
                            No hay cleaners disponibles
                        </p>
                    ) : (
                        <div className="space-y-2">
                            {cleaners.map(cleaner => (
                                <label
                                    key={cleaner.id}
                                    className={`flex items-center gap-2 p-2 rounded hover:bg-white cursor-pointer transition-colors ${
                                        selectedCleaners.includes(cleaner.id) ? 'bg-blue-50' : ''
                                    }`}
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedCleaners.includes(cleaner.id)}
                                        onChange={() => toggleCleaner(cleaner.id)}
                                        disabled={isLoading}
                                        className="w-4 h-4 text-blue-600"
                                    />
                                    <span className="text-sm text-gray-900">
                                        {cleaner.full_name}
                                    </span>
                                </label>
                            ))}
                        </div>
                    )}
                </div>
                {selectedCleaners.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                        {selectedCleaners.map(cleanerId => {
                            const cleaner = cleaners.find(c => c.id === cleanerId)
                            return (
                                <span
                                    key={cleanerId}
                                    className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                                >
                                    {cleaner?.full_name}
                                    <button
                                        type="button"
                                        onClick={() => toggleCleaner(cleanerId)}
                                        className="hover:text-blue-900"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </span>
                            )
                        })}
                    </div>
                )}
            </div>

            {/* Fecha */}
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

            {/* Horarios */}
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

            {/* Notas */}
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
                    placeholder="Instrucciones especiales para los cleaners"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 resize-none text-sm"
                />
            </div>

            {/* Botón */}
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