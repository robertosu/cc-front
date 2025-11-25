'use client'

import {Check, X} from 'lucide-react'

interface PasswordStrengthProps {
    password: string
}

interface Requirement {
    label: string
    test: (password: string) => boolean
}

const requirements: Requirement[] = [
    {
        label: 'Al menos 8 caracteres',
        test: (pwd) => pwd.length >= 8
    },
    {
        label: 'Una letra mayúscula (A-Z)',
        test: (pwd) => /[A-Z]/.test(pwd)
    },
    {
        label: 'Una letra minúscula (a-z)',
        test: (pwd) => /[a-z]/.test(pwd)
    },
    {
        label: 'Un número (0-9)',
        test: (pwd) => /\d/.test(pwd)
    },
    {
        label: 'Un caracter especial (!@#$%^&*)',
        test: (pwd) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd)
    }
]

export default function PasswordStrength({ password }: PasswordStrengthProps) {
    if (!password) return null

    const passedRequirements = requirements.filter(req => req.test(password)).length
    const allPassed = passedRequirements === requirements.length

    // Calcular el nivel de seguridad
    const getStrengthLevel = () => {
        if (passedRequirements <= 2) return { label: 'Débil', color: 'bg-red-500', width: '33%' }
        if (passedRequirements <= 4) return { label: 'Media', color: 'bg-yellow-500', width: '66%' }
        return { label: 'Fuerte', color: 'bg-green-500', width: '100%' }
    }

    const strength = getStrengthLevel()

    return (
        <div className="mt-3 space-y-3">
            {/* Barra de progreso */}
            <div>
                <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-medium text-gray-600">Seguridad de la contraseña</span>
                    <span className={`text-xs font-semibold ${
                        strength.label === 'Débil' ? 'text-red-600' :
                            strength.label === 'Media' ? 'text-yellow-600' :
                                'text-green-600'
                    }`}>
            {strength.label}
          </span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                        className={`h-full ${strength.color} transition-all duration-300`}
                        style={{ width: strength.width }}
                    />
                </div>
            </div>

            {/* Lista de requisitos */}
            <div className="space-y-2">
                {requirements.map((requirement, index) => {
                    const isPassed = requirement.test(password)
                    return (
                        <div key={index} className="flex items-center gap-2">
                            <div className={`flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center ${
                                isPassed ? 'bg-green-100' : 'bg-gray-100'
                            }`}>
                                {isPassed ? (
                                    <Check className="w-3 h-3 text-green-600" />
                                ) : (
                                    <X className="w-3 h-3 text-gray-400" />
                                )}
                            </div>
                            <span className={`text-sm ${
                                isPassed ? 'text-green-700 font-medium' : 'text-gray-600'
                            }`}>
                {requirement.label}
              </span>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

// Función helper para validar contraseña (exportable para uso en el formulario)
export function validatePassword(password: string): boolean {
    return requirements.every(req => req.test(password))
}

/*
📝 CARACTERÍSTICAS:
✅ Validación en tiempo real
✅ Indicadores visuales con iconos
✅ Barra de progreso con colores
✅ Lista clara de requisitos
✅ Feedback inmediato
✅ Exporta función de validación
*/