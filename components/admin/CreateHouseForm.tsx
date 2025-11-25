'use client'

import {useState} from 'react'
import {useRouter} from 'next/navigation'
import {AlertCircle, CheckCircle} from 'lucide-react'

interface Client {
    id: string
    full_name: string
    email: string
}

export default function CreateHouseForm({ clients }: { clients: Client[] }) {
    const router = useRouter()
    const [formData, setFormData] = useState({
        client_id: '',
        address: '',
        sectors_count: '1',
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
            const response = await fetch('/api/houses', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    sectors_count: parseInt(formData.sectors_count)
                })
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Error al crear casa')
            }

            setMessage({ type: 'success', text: '¡Casa creada exitosamente!' })

            // Limpiar formulario
            setFormData({
                client_id: '',
                address: '',
                sectors_count: '1',
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                >
                    <option value="">Selecciona un cliente</option>
                    {clients.map(client => (
                        <option key={client.id} value={client.id}>
                            {client.full_name} ({client.email})
                        </option>
                    ))}
                </select>
            </div>

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

            <div>
                <label htmlFor="sectors_count" className="block text-sm font-medium text-gray-700 mb-2">
                    Número de Sectores *
                </label>
                <input
                    type="number"
                    id="sectors_count"
                    name="sectors_count"
                    value={formData.sectors_count}
                    onChange={handleChange}
                    required
                    min="1"
                    max="20"
                    disabled={isLoading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                />
                <p className="mt-1 text-xs text-gray-500">
                    Divide la casa en sectores (1-20)
                </p>
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
                    placeholder="Instrucciones especiales, acceso, mascotas, etc."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 resize-none"
                />
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
                {isLoading ? 'Creando...' : 'Crear Casa'}
            </button>
        </form>
    )
}