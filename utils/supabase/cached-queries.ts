import { cache } from 'react'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export const getCachedUser = cache(async () => {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error || !user) return null
    return user
})

export const getCachedProfile = cache(async (userId: string) => {
    const supabase = await createClient()
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()
    return profile
})

// Helper combinado para proteger rutas (Opcional pero muy útil)
export const requireProfile = cache(async (allowedRoles?: string[]) => {
    const user = await getCachedUser()
    if (!user) redirect('/login')

    const profile = await getCachedProfile(user.id)
    if (!profile) redirect('/login')

    if (allowedRoles && !allowedRoles.includes(profile.role)) {
        // Redirigir al dashboard correcto si tiene rol equivocado, o login
        redirect('/login')
    }

    const supabase = await createClient() // Para consultas adicionales
    return { user, profile, supabase }
})