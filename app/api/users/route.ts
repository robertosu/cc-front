// app/api/users/route.ts
import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'
import {checkAuth, unauthorizedResponse, USER_ROLES} from '@/utils/auth/roleCheck'

export async function GET(request: Request) {
    try {
        const supabase = await createClient()

        // ✅ SOLO consultar profiles - sin JOINs innecesarios
        const { data: profiles, error: profilesError } = await supabase
            .from('profiles')
            .select('*')
            .order('created_at', { ascending: false })

        if (profilesError) {
            console.error('Error fetching profiles:', profilesError)
            throw profilesError
        }

        //  Contar limpiezas por usuario (como cliente y como cleaner)
        const usersWithCounts = await Promise.all(
            (profiles || []).map(async (profile) => {
                // Contar limpiezas como cliente
                const { count: clientCleaningsCount } = await supabase
                    .from('cleanings')
                    .select('*', { count: 'exact', head: true })
                    .eq('client_id', profile.id)

                // Contar asignaciones como cleaner
                const { count: cleanerCleaningsCount } = await supabase
                    .from('cleaning_cleaners')
                    .select('*', { count: 'exact', head: true })
                    .eq('cleaner_id', profile.id)

                return {
                    ...profile,
                    client_cleanings_count: clientCleaningsCount || 0,
                    cleaner_cleanings_count: cleanerCleaningsCount || 0
                }
            })
        )

        return NextResponse.json({
            users: usersWithCounts,
            total: usersWithCounts.length
        })

    } catch (error: any) {
        console.error('Error in GET /api/users:', error)
        return NextResponse.json(
            { error: error.message || 'Error al obtener usuarios' },
            { status: 500 }
        )
    }
}

export async function PUT(request: Request) {
    try {

        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        const body = await request.json()
        const { user_id, role } = body

        if (user) {
            if (!user_id || !role) {
                return NextResponse.json(
                    {error: 'user_id y role son requeridos'},
                    {status: 400}
                )
            }

            const validRoles = ['admin', 'cleaner', 'client']
            if (!validRoles.includes(role)) {
                return NextResponse.json(
                    {error: 'Rol inválido'},
                    {status: 400}
                )
            }

            if (user_id === user.id) {
                return NextResponse.json(
                    {error: 'No puedes cambiar tu propio rol'},
                    {status: 400}
                )
            }
        }

        const { data, error } = await supabase
            .from('profiles')
            .update({ role, updated_at: new Date().toISOString() })
            .eq('id', user_id)
            .select()
            .single()

        if (error) throw error

        return NextResponse.json({
            profile: data,
            message: 'Rol actualizado exitosamente'
        })

    } catch (error: any) {
        console.error('Error in PUT /api/users:', error)
        return NextResponse.json(
            { error: error.message || 'Error al actualizar rol' },
            { status: 500 }
        )
    }
}

// app/api/users/route.ts
export async function DELETE(request: Request) {
    try {
        // Verificación programática (primera línea de defensa)
        const user = await checkAuth([USER_ROLES.ADMIN])

        if (!user) {
            return unauthorizedResponse('Solo administradores pueden eliminar usuarios')
        }

        const supabase = await createClient() // Cliente normal, NO admin
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (!id) {
            return NextResponse.json(
                { error: 'ID de usuario requerido' },
                { status: 400 }
            )
        }

        // Verificación adicional (segunda línea de defensa)
        if (id === user.id) {
            return NextResponse.json(
                { error: 'No puedes eliminar tu propia cuenta' },
                { status: 400 }
            )
        }

        // ✅ Llamar a la función SQL que tiene SECURITY DEFINER
        // Las verificaciones TAMBIÉN se hacen en la base de datos
        const { data, error } = await supabase.rpc('delete_user_completely', {
            target_user_id: id
        })

        if (error) throw error

        if (data && !data.success) {
            throw new Error(data.error || 'Error al eliminar usuario')
        }

        return NextResponse.json({
            success: true,
            message: 'Usuario eliminado exitosamente'
        })

    } catch (error: any) {
        console.error('Error in DELETE /api/users:', error)
        return NextResponse.json(
            { error: error.message || 'Error al eliminar usuario' },
            { status: 500 }
        )
    }
}