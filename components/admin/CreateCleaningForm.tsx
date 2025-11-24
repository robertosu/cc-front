'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AlertCircle, CheckCircle } from 'lucide-react'
import SearchableSelect from '@/components/common/SearchableSelect'
import MultiSearchableSelect from '@/components/common/MultiSearchableSelect'

interface Client {
    id: string
    full_name: string
    email: string
    phone?: string
}

interface Cleaner {
    id: string
    full_name: string
    email: string
    phone?: string
}

interface CreateCleaningFormProps {
    clients: Client[]
    cleaners: Cleaner[]
    redirectAfterSuccess?: string
}

export default function CreateCleaningForm({
    clients,
    cleaners,
    redirectAfterSuccess = '/dashboard/admin/cleanings'
}: CreateCleaningFormProps) {
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

    // Convertir clientes a opciones
    const clientOptions = clients.map(client => ({
        id: client.id,
        label: client.full_name,
        sublabel: `${client.email}${client.phone ? ` • ${client.phone}` : ''}`
    }))

    // Convertir cleaners a opciones
    const cleanerOptions = cleaners.map(cleaner => ({
        id: cleaner.id,
        label: cleaner.full_name,
        sublabel: `${cleaner.email}${cleaner.phone ? ` • ${cleaner.phone}` : ''}`
    }))

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

            // Redirigir después de 1.5 segundos
            setTimeout(() => {
                router.push(redirectAfterSuccess)
                router.refresh()
            }, 1500)
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
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

            {/* Cliente con búsqueda */}
            <SearchableSelect
                options={clientOptions}
                value={formData.client_id}
                onChange={(value) => {
                    setFormData(prev => ({ ...prev, client_id: value }))
                    setMessage(null)
                }}
                label="Cliente"
                placeholder="Buscar cliente por nombre, email o teléfono..."
                required
                disabled={isLoading}
                emptyMessage="No se encontraron clientes"
            />

            {/* Dirección */}
            <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                    Dirección <span className="text-red-500">*</span>
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100"
                />
            </div>

            {/* Steps */}
            <div>
                <label htmlFor="total_steps" className="block text-sm font-medium text-gray-700 mb-2">
                    Número de Steps <span className="text-red-500">*</span>
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100"
                />
                <p className="mt-1 text-xs text-gray-500">
                    Divide la limpieza en pasos (1-20)
                </p>
            </div>

            {/* Cleaners con búsqueda múltiple */}
            <MultiSearchableSelect
                options={cleanerOptions}
                value={selectedCleaners}
                onChange={setSelectedCleaners}
                label="Cleaners (Opcional)"
                placeholder="Buscar y seleccionar cleaners..."
                disabled={isLoading}
                emptyMessage="No se encontraron cleaners disponibles"
                maxHeight="240px"
            />

            {/* Fecha y Horarios */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label htmlFor="scheduled_date" className="block text-sm font-medium text-gray-700 mb-2">
                        Fecha <span className="text-red-500">*</span>
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100"
                    />
                </div>

                <div>
                    <label htmlFor="start_time" className="block text-sm font-medium text-gray-700 mb-2">
                        Hora Inicio <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="time"
                        id="start_time"
                        name="start_time"
                        value={formData.start_time}
                        onChange={handleChange}
                        required
                        disabled={isLoading}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100"
                    />
                </div>

                <div>
                    <label htmlFor="end_time" className="block text-sm font-medium text-gray-700 mb-2">
                        Hora Fin <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="time"
                        id="end_time"
                        name="end_time"
                        value={formData.end_time}
                        onChange={handleChange}
                        required
                        disabled={isLoading}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100 resize-none text-sm"
                />
            </div>

            {/* Botones */}
            <div className="flex gap-3 pt-4">
                <button
                    type="button"
                    onClick={() => router.back()}
                    disabled={isLoading}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 bg-purple-600 text-white py-2 rounded-lg font-semibold hover:bg-purple-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    {isLoading ? 'Programando...' : 'Programar Limpieza'}
                </button>
            </div>
        </form>
    )
}