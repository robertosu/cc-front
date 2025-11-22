// components/admin/CreateCleaningModal.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, X, AlertCircle, CheckCircle } from 'lucide-react'

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

interface CreateCleaningModalProps {
    clients: Client[]
    cleaners: Cleaner[]
}

export default function CreateCleaningModal({ clients, cleaners }: CreateCleaningModalProps) {
    const router = useRouter()
    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

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

            setMessage({ type: 'success', text: '¡Limpieza creada exitosamente!' })

            // Reset form
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

            // Close modal after 2 seconds
            setTimeout(() => {
                setIsOpen(false)
                setMessage(null)
                router.refresh()
            }, 2000)
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
                <Plus className="w-5 h-5 mr-2" />
                Nueva Limpieza
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex min-h-screen items-center justify-center px-4 py-12">
                        {/* Overlay */}
                        <div
                            className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                            onClick={() => setIsOpen(false)}
                        />

                        {/* Modal */}
                        <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 z-50">
                            <div className="absolute top-4 right-4">
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="text-gray-400 hover:text-gray-500"
                                >
                                    <X className="h-6 w-6" />
                                </button>
                            </div>

                            <div className="mb-6">
                                <h3 className="text-lg leading-6 font-medium text-gray-900">
                                    Programar Nueva Limpieza
                                </h3>
                                <p className="mt-2 text-sm text-gray-500">
                                    Completa los detalles para crear una nueva limpieza
                                </p>
                            </div>

                            {message && (
                                <div className={`mb-4 px-4 py-3 rounded-lg flex items-start gap-2 ${
                                    message.type === 'success'
                                        ? 'bg-green-50 text-green-700 border border-green-200'
                                        : 'bg-red-50 text-red-700 border border-red-200'
                                }`}>
                                    {message.type === 'success' ? (
                                        <CheckCircle className="w-5 h-5 flex-shrink-0" />
                                    ) : (
                                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                    )}
                                    <span className="text-sm">{message.text}</span>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    {/* Cliente */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Cliente *
                                        </label>
                                        <select
                                            value={formData.client_id}
                                            onChange={(e) => setFormData({ ...formData, client_id: e.target.value })}
                                            required
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                                        >
                                            <option value="">Seleccionar cliente</option>
                                            {clients.map(client => (
                                                <option key={client.id} value={client.id}>
                                                    {client.full_name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Total Steps */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Número de Steps *
                                        </label>
                                        <input
                                            type="number"
                                            min="1"
                                            max="20"
                                            value={formData.total_steps}
                                            onChange={(e) => setFormData({ ...formData, total_steps: e.target.value })}
                                            required
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                                        />
                                    </div>
                                </div>

                                {/* Dirección */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Dirección *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        required
                                        placeholder="Calle, número, comuna"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                                    />
                                </div>

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                    {/* Fecha */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Fecha *
                                        </label>
                                        <input
                                            type="date"
                                            value={formData.scheduled_date}
                                            onChange={(e) => setFormData({ ...formData, scheduled_date: e.target.value })}
                                            min={new Date().toISOString().split('T')[0]}
                                            required
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                                        />
                                    </div>

                                    {/* Hora inicio */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Hora Inicio *
                                        </label>
                                        <input
                                            type="time"
                                            value={formData.start_time}
                                            onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                                            required
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                                        />
                                    </div>

                                    {/* Hora fin */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Hora Fin *
                                        </label>
                                        <input
                                            type="time"
                                            value={formData.end_time}
                                            onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                                            required
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                                        />
                                    </div>
                                </div>

                                {/* Cleaners */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Cleaners (Opcional)
                                    </label>
                                    <div className="border border-gray-300 rounded-md p-3 max-h-40 overflow-y-auto">
                                        {cleaners.map(cleaner => (
                                            <label key={cleaner.id} className="flex items-center py-2 cursor-pointer hover:bg-gray-50 rounded px-2">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedCleaners.includes(cleaner.id)}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setSelectedCleaners([...selectedCleaners, cleaner.id])
                                                        } else {
                                                            setSelectedCleaners(selectedCleaners.filter(id => id !== cleaner.id))
                                                        }
                                                    }}
                                                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                                                />
                                                <span className="ml-3 text-sm text-gray-700">{cleaner.full_name}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Notas */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Notas (Opcional)
                                    </label>
                                    <textarea
                                        value={formData.notes}
                                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                        rows={3}
                                        placeholder="Instrucciones especiales..."
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                                    />
                                </div>

                                <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 mt-6">
                                    <button
                                        type="button"
                                        onClick={() => setIsOpen(false)}
                                        disabled={isLoading}
                                        className="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-purple-600 text-sm font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
                                    >
                                        {isLoading ? 'Creando...' : 'Crear Limpieza'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}