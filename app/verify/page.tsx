'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import Header from "@/components/layout/Header";

function VerifyContent() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const email = searchParams.get('email') || ''

    const [code, setCode] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setIsLoading(true)

        try {
            const res = await fetch('/api/auth/verify', {
                method: 'POST',
                body: JSON.stringify({ email, code }),
                headers: { 'Content-Type': 'application/json' }
            })

            const data = await res.json()

            if (!res.ok) throw new Error(data.error || 'Código inválido')

            // Éxito: Vamos al dashboard
            router.push('/dashboard?verified=true')

        } catch (err: any) {
            setError(err.message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <><Header>

        </Header>
            <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Verifica tu cuenta
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Hemos enviado un código a <strong>{email}</strong>
                    </p>
                </div>

                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                        <form className="space-y-6" onSubmit={handleVerify}>
                            <div>
                                <label htmlFor="code" className="block text-sm font-medium text-gray-700">
                                    Código de 6 dígitos
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="code"
                                        name="code"
                                        type="text"
                                        required
                                        maxLength={6}
                                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-ocean-500 focus:border-ocean-500 sm:text-sm text-center tracking-widest text-2xl"
                                        value={code}
                                        onChange={(e) => setCode(e.target.value)}
                                        placeholder="123456"/>
                                </div>
                            </div>

                            {error && (
                                <div className="rounded-md bg-red-50 p-4">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <AlertCircle className="h-5 w-5 text-red-400"/>
                                        </div>
                                        <div className="ml-3">
                                            <h3 className="text-sm font-medium text-red-800">{error}</h3>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-ocean-400 hover:bg-ocean-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ocean-500 disabled:opacity-50"
                                >
                                    {isLoading ? (
                                        <Loader2 className="animate-spin h-5 w-5"/>
                                    ) : (
                                        'Verificar Cuenta'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

// En Next.js 14+ es necesario envolver en Suspense componentes que usen useSearchParams
export default function VerifyPage() {
    return (
        <Suspense fallback={<div className="p-4 text-center">Cargando...</div>}>
            <VerifyContent />
        </Suspense>
    )
}