// utils/auth/roleCheck.ts
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export type UserRole = 'admin' | 'cleaner' | 'cliente'

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
 * Verifica auth usando SOLO auth.uid() sin consultar profiles
 * Útil para evitar recursión en políticas RLS
 */
export async function checkAuthSimple(allowedRoles: UserRole[]): Promise<AuthUser | null> {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
        return null
    }

    // Obtener rol desde user metadata (configurado en el trigger)
    const userRole = user.user_metadata?.role as UserRole

    if (!userRole || !allowedRoles.includes(userRole)) {
        return null
    }

    return {
        id: user.id,
        email: user.email!,
        role: userRole
    }
}

/**
 * Verifica auth consultando la tabla profiles
 * SOLO usar en endpoints que NO modifican profiles
 */
export async function checkAuth(allowedRoles: UserRole[]): Promise<AuthUser | null> {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
        return null
    }

    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (profileError || !profile) {
        return null
    }

    if (!allowedRoles.includes(profile.role as UserRole)) {
        return null
    }

    return {
        id: user.id,
        email: user.email!,
        role: profile.role as UserRole
    }
}

export function unauthorizedResponse(message: string = 'No autorizado') {
    return NextResponse.json({ error: message }, { status: 403 })
}

export function unauthenticatedResponse(message: string = 'No autenticado') {
    return NextResponse.json({ error: message }, { status: 401 })
}