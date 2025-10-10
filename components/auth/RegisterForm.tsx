'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Mail, Lock, User, Phone, AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react'
import CountrySelector from './CountrySelector'
import PasswordStrength, { validatePassword } from './PasswordStrength'
import { defaultCountry, type Country } from '@/data/Countries'

// Mensajes de error traducidos
const errorMessages: Record<string, string> = {
    'User already registered': 'Este correo ya está registrado',
    'email_address_invalid': 'El correo electrónico no es válido',
    'Email rate limit exceeded': 'Demasiados intentos. Intenta más tarde',
    'Password should be at least 6 characters': 'La contraseña debe tener al menos 6 caracteres',
    'Signup requires a valid password': 'Se requiere una contraseña válida',
    'Email address is invalid': 'El correo electrónico no es válido',
    'Unable to validate email address: invalid format': 'Formato de correo inválido'
}

export default function RegisterForm() {
    const [formData, setFormData] = useState({
        email: '',
        fullName: '',
        phone: '',
        password: '',
        confirmPassword: ''
    })

    const [selectedCountry, setSelectedCountry] = useState<Country>(defaultCountry)
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [isLoading, setIsLoading] = useState(false)
    const [successMessage, setSuccessMessage] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const supabase = createClient()

    // Traducir mensaje de error de Supabase
    const translateError = (errorMessage: string): string => {
        // Buscar coincidencia exacta
        if (errorMessages[errorMessage]) {
            return errorMessages[errorMessage]
        }

        // Buscar coincidencia parcial
        for (const [key, value] of Object.entries(errorMessages)) {
            if (errorMessage.includes(key)) {
                return value
            }
        }

        // Retornar mensaje por defecto si no hay traducción
        return 'Ocurrió un error. Por favor intenta nuevamente.'
    }

    // Validación del formulario
    const validateForm = () => {
        const newErrors: Record<string, string> = {}

        // Validar email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!formData.email) {
            newErrors.email = 'El correo es requerido'
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Ingresa un correo válido'
        }

        // Validar nombre completo
        if (!formData.fullName || formData.fullName.trim().length < 3) {
            newErrors.fullName = 'El nombre debe tener al menos 3 caracteres'
        }

        // Validar teléfono (solo números, espacios y guiones)
        const phoneRegex = /^[\d\s-]+$/
        if (!formData.phone) {
            newErrors.phone = 'El teléfono es requerido'
        } else if (!phoneRegex.test(formData.phone)) {
            newErrors.phone = 'Solo números, espacios y guiones'
        } else if (formData.phone.replace(/[\s-]/g, '').length < 8) {
            newErrors.phone = 'Ingresa al menos 8 dígitos'
        }

        // Validar contraseña con requisitos
        if (!formData.password) {
            newErrors.password = 'La contraseña es requerida'
        } else if (!validatePassword(formData.password)) {
            newErrors.password = 'La contraseña no cumple todos los requisitos'
        }

        // Validar confirmación de contraseña
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Las contraseñas no coinciden'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    // Manejar cambios en los inputs
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))

        // Limpiar error del campo que se está editando
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev }
                delete newErrors[name]
                return newErrors
            })
        }
    }

    // Manejar el envío del formulario
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSuccessMessage('')

        if (!validateForm()) {
            return
        }

        setIsLoading(true)

        try {
            // Formatear número completo con prefijo
            const fullPhoneNumber = `${selectedCountry.dialCode}${formData.phone.replace(/[\s-]/g, '')}`

            const { data, error } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    data: {
                        full_name: formData.fullName,
                        phone: fullPhoneNumber
                    },
                    emailRedirectTo: `${window.location.origin}/auth/callback`
                }
            })

            if (error) {
                const translatedError = translateError(error.message)

                // Determinar si es error de email
                if (error.message.toLowerCase().includes('email') ||
                    error.message.toLowerCase().includes('registered')) {
                    setErrors({ email: translatedError })
                } else if (error.message.toLowerCase().includes('password')) {
                    setErrors({ password: translatedError })
                } else {
                    setErrors({ general: translatedError })
                }
                return
            }

            setSuccessMessage(
                '¡Registro exitoso! 🎉 Por favor revisa tu correo para confirmar tu cuenta.'
            )

            // Limpiar formulario
            setFormData({
                email: '',
                fullName: '',
                phone: '',
                password: '',
                confirmPassword: ''
            })

        } catch (error) {
            setErrors({ general: 'Ocurrió un error inesperado. Intenta nuevamente.' })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="w-full max-w-md mx-auto">
            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8 space-y-6">

                <div className="text-center mb-6">
                    <h2 className="text-3xl font-bold text-gray-900">Crear Cuenta</h2>
                    <p className="text-gray-600 mt-2">Únete a CleanerClub</p>
                </div>

                {/* Mensaje de error general */}
                {errors.general && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-2">
                        <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{errors.general}</span>
                    </div>
                )}

                {/* Mensaje de éxito */}
                {successMessage && (
                    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{successMessage}</span>
                    </div>
                )}

                {/* Email */}
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Correo Electrónico *
                    </label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                                errors.email ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="tu@email.com"
                        />
                    </div>
                    {errors.email && (
                        <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                    )}
                </div>

                {/* Nombre Completo */}
                <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre Completo *
                    </label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            id="fullName"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                                errors.fullName ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="Juan Pérez"
                        />
                    </div>
                    {errors.fullName && (
                        <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
                    )}
                </div>

                {/* Teléfono con selector de país */}
                <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                        Número de Teléfono *
                    </label>
                    <div className="flex gap-2">
                        <CountrySelector
                            selectedCountry={selectedCountry}
                            onSelect={setSelectedCountry}
                        />
                        <div className="relative flex-1">
                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                                    errors.phone ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="9 1234 5678"
                            />
                        </div>
                    </div>
                    {errors.phone && (
                        <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                    )}
                    <p className="mt-1 text-xs text-gray-500">
                        Tu número: {selectedCountry.dialCode} {formData.phone}
                    </p>
                </div>

                {/* Contraseña */}
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                        Contraseña *
                    </label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className={`w-full pl-10 pr-12 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                                errors.password ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="••••••••"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>
                    {errors.password && (
                        <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                    )}

                    {/* Indicador de fortaleza de contraseña */}
                    <PasswordStrength password={formData.password} />
                </div>

                {/* Confirmar Contraseña */}
                <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                        Repetir Contraseña *
                    </label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className={`w-full pl-10 pr-12 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                                errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="••••••••"
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>
                    {errors.confirmPassword && (
                        <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                    )}
                </div>

                {/* Botón de registro */}
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
                >
                    {isLoading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Creando cuenta...
                        </>
                    ) : (
                        'Crear Cuenta'
                    )}
                </button>

                {/* Link a login */}
                <p className="text-center text-sm text-gray-600">
                    ¿Ya tienes cuenta?{' '}
                    <a href="/login" className="text-blue-600 hover:text-blue-700 font-semibold">
                        Inicia sesión
                    </a>
                </p>
            </form>
        </div>
    )
}

/*
📝 MEJORAS IMPLEMENTADAS:
✅ Selector de país con banderas y búsqueda
✅ Validación de contraseña con requisitos visuales
✅ Indicador de fortaleza en tiempo real
✅ Botón para mostrar/ocultar contraseña
✅ Todos los mensajes traducidos al español
✅ Formato automático del teléfono con prefijo
✅ Validación mejorada de todos los campos
✅ UX optimizada con feedback visual
*/