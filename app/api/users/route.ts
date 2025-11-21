// app/api/users/route.ts
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { checkAuthSimple, unauthorizedResponse } from '@/utils/auth/roleCheck'

export async function GET(request: Request) {
    try {
        // CAMBIO: Usar checkAuthSimple para evitar recursión
        const user = await checkAuthSimple(['admin'])

        if (!user) {
            return unauthorizedResponse('Solo administradores pueden ver usuarios')
        }

        const supabase = await createClient()

        const { data: profiles, error: profilesError } = await supabase
            .from('profiles')
            .select('*')
            .order('created_at', { ascending: false })

        if (profilesError) {
            console.error('Error fetching profiles:', profilesError)
            throw profilesError
        }

        const usersWithCounts = await Promise.all(
            (profiles || []).map(async (profile) => {
                const { count: housesCount } = await supabase
                    .from('houses')
                    .select('*', { count: 'exact', head: true })
                    .eq('client_id', profile.id)

                const { count: cleaningsCount } = await supabase
                    .from('cleanings')
                    .select('*', { count: 'exact', head: true })
                    .eq('cleaner_id', profile.id)

                return {
                    ...profile,
                    houses_count: [{ count: housesCount || 0 }],
                    cleanings_as_cleaner: [{ count: cleaningsCount || 0 }]
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
        // CAMBIO: Usar checkAuthSimple
        const user = await checkAuthSimple(['admin'])

        if (!user) {
            return unauthorizedResponse('Solo administradores pueden actualizar roles')
        }

        const supabase = await createClient()

        const body = await request.json()
        const { user_id, role } = body

        if (!user_id || !role) {
            return NextResponse.json(
                { error: 'user_id y role son requeridos' },
                { status: 400 }
            )
        }

        const validRoles = ['admin', 'cleaner', 'client']
        if (!validRoles.includes(role)) {
            return NextResponse.json(
                { error: 'Rol inválido' },
                { status: 400 }
            )
        }

        if (user_id === user.id) {
            return NextResponse.json(
                { error: 'No puedes cambiar tu propio rol' },
                { status: 400 }
            )
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

export async function DELETE(request: Request) {
    try {
        // CAMBIO: Usar checkAuthSimple
        const user = await checkAuthSimple(['admin'])

        if (!user) {
            return unauthorizedResponse('Solo administradores pueden eliminar usuarios')
        }

        const supabase = await createClient()

        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (!id) {
            return NextResponse.json(
                { error: 'ID de usuario requerido' },
                { status: 400 }
            )
        }

        if (id === user.id) {
            return NextResponse.json(
                { error: 'No puedes eliminar tu propia cuenta' },
                { status: 400 }
            )
        }

        const { error } = await supabase
            .from('profiles')
            .delete()
            .eq('id', id)

        if (error) throw error

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