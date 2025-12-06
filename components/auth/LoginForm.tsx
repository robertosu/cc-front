'use client'

import {useEffect, useState} from 'react'
import {useRouter, useSearchParams} from 'next/navigation'
import {AlertCircle, Eye, EyeOff, Lock, Mail} from 'lucide-react'

export default function LoginForm() {
    const [formData, setFormData] = useState({ email: '', password: '' })
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const router = useRouter()
    const searchParams = useSearchParams()

    useEffect(() => {
        const error = searchParams.get('error')
        if (error === 'verification_failed') {
            setErrors({ general: 'Error al verificar tu cuenta. Intenta nuevamente.' })
        }
    }, [searchParams])

    const validateForm = () => {
        const newErrors: Record<string, string> = {}
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

        if (!formData.email) {
            newErrors.email = 'El correo es requerido'
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Ingresa un correo válido'
        }

        if (!formData.password) {
            newErrors.password = 'La contraseña es requerida'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev }
                delete newErrors[name]
                return newErrors
            })
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) return

        setIsLoading(true)

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })

            const data = await response.json()

            if (!response.ok) {
                setErrors({ general: data.error })
                return
            }

            const urlParams = new URLSearchParams(window.location.search)
            const redirectTo = urlParams.get('redirectedFrom') || '/dashboard'

            router.push(redirectTo)
            router.refresh()

        } catch {
            setErrors({ general: 'Ocurrió un error inesperado. Intenta nuevamente.' })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="w-full max-w-md mx-auto">
            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8 space-y-6">
                <div className="text-center mb-6">
                    <h2 className="text-3xl font-bold text-gray-900">Iniciar Sesión</h2>
                    <p className="text-gray-600 mt-2">Accede a tu cuenta de CleanerClub</p>
                </div>

                {errors.general && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-2">
                        <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{errors.general}</span>
                    </div>
                )}

                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Correo Electrónico
                    </label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors ${
                                errors.email ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="tu@email.com"
                            autoComplete="email"
                        />
                    </div>
                    {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                        Contraseña
                    </label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className={`w-full pl-10 pr-12 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors ${
                                errors.password ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="••••••••"
                            autoComplete="current-password"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>
                    {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                </div>

                <div className="flex items-center justify-between">
                    <a
                        href="/resend-confirmation"
                        className="text-sm text-cyan-400 hover:text-cyan-700 transition-colors"
                    >
                        ¿No recibiste el correo de confirmación?
                    </a>

                    <a
                        href="/reset-password"
                        className="text-sm text-cyan-400 hover:text-cyan-700 transition-colors"
                    >
                        ¿Olvidaste tu contraseña?
                    </a>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-cyan-400 text-white py-3 rounded-lg font-semibold hover:bg-cyan-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
                >
                    {isLoading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Iniciando sesión...
                        </>
                    ) : 'Iniciar Sesión'}
                </button>

                <p className="text-center text-sm text-gray-600">
                    ¿No tienes cuenta?{' '}
                    <a href="/register" className="text-cyan-400 hover:text-cyan-700 font-semibold">
                        Regístrate
                    </a>
                </p>
            </form>
        </div>
    )
}