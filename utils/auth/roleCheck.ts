// utils/auth/roleCheck.ts
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

/**
 * User roles - debe coincidir con el ENUM user_role en PostgreSQL
 * @enum {string}
 */
export type UserRole = 'admin' | 'cleaner' | 'cliente'

// Constante para validación y uso en toda la app
export const USER_ROLES = {
    ADMIN: 'admin',
    CLEANER: 'cleaner',
    CLIENTE: 'cliente'
} as const

interface AuthUser {
    id: string
    email: string
    role: UserRole
}

/**
 * Verifica que el usuario esté autenticado y tenga el rol requerido
 * @param allowedRoles - Array de roles permitidos
 * @returns Usuario autenticado o null si no cumple requisitos
 */
export async function checkAuth(allowedRoles: UserRole[]): Promise<AuthUser | null> {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    // Obtener usuario actual
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
        return null
    }

    // Obtener perfil con rol
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (profileError || !profile) {
        return null
    }

    // Verificar rol
    if (!allowedRoles.includes(profile.role as UserRole)) {
        return null
    }

    return {
        id: user.id,
        email: user.email!,
        role: profile.role as UserRole
    }
}

/**
 * Respuesta de error de autorización estándar
 */
export function unauthorizedResponse(message: string = 'No autorizado') {
    return NextResponse.json(
        { error: message },
        { status: 403 }
    )
}

/**
 * Respuesta de error de autenticación estándar
 */
export function unauthenticatedResponse(message: string = 'No autenticado') {
    return NextResponse.json(
        { error: message },
        { status: 401 }
    )
}