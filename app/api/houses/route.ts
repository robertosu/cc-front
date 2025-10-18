// app/api/houses/route.ts
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { checkAuth, unauthorizedResponse } from '@/utils/auth/roleCheck'

// GET: Obtener casas (según rol)
export async function GET(request: Request) {
    const user = await checkAuth(['admin', 'cleaner', 'cliente'])

    if (!user) {
        return unauthorizedResponse()
    }

    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    try {
        let query = supabase
            .from('houses')
            .select(`
                *,
                client:profiles!houses_client_id_fkey(id, full_name, email),
                cleanings(id, status, scheduled_date)
            `)

        // Cliente solo ve sus casas (RLS lo maneja automáticamente)
        if (user.role === 'cliente') {
            query = query.eq('client_id', user.id)
        }

        const { data, error } = await query.order('created_at', { ascending: false })

        if (error) throw error

        return NextResponse.json({ houses: data })
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        )
    }
}

// POST: Crear casa (solo admin)
export async function POST(request: Request) {
    const user = await checkAuth(['admin'])

    if (!user) {
        return unauthorizedResponse('Solo administradores pueden crear casas')
    }

    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    try {
        const body = await request.json()
        const { client_id, address, sectors_count, notes } = body

        // Validaciones
        if (!client_id || !address || !sectors_count) {
            return NextResponse.json(
                { error: 'Faltan campos requeridos: client_id, address, sectors_count' },
                { status: 400 }
            )
        }

        if (sectors_count < 1 || sectors_count > 20) {
            return NextResponse.json(
                { error: 'El número de sectores debe estar entre 1 y 20' },
                { status: 400 }
            )
        }

        // Verificar que el cliente existe
        const { data: clientExists } = await supabase
            .from('profiles')
            .select('id')
            .eq('id', client_id)
            .eq('role', 'cliente')
            .single()

        if (!clientExists) {
            return NextResponse.json(
                { error: 'Cliente no encontrado' },
                { status: 404 }
            )
        }

        // Crear casa
        const { data, error } = await supabase
            .from('houses')
            .insert({
                client_id,
                address,
                sectors_count,
                notes
            })
            .select(`
                *,
                client:profiles!houses_client_id_fkey(id, full_name, email)
            `)
            .single()

        if (error) throw error

        return NextResponse.json({ house: data }, { status: 201 })
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        )
    }
}

// PUT: Actualizar casa (solo admin)
export async function PUT(request: Request) {
    const user = await checkAuth(['admin'])

    if (!user) {
        return unauthorizedResponse('Solo administradores pueden actualizar casas')
    }

    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    try {
        const body = await request.json()
        const { id, address, sectors_count, notes } = body

        if (!id) {
            return NextResponse.json(
                { error: 'ID de casa requerido' },
                { status: 400 }
            )
        }

        const updateData: any = {}
        if (address !== undefined) updateData.address = address
        if (sectors_count !== undefined) updateData.sectors_count = sectors_count
        if (notes !== undefined) updateData.notes = notes

        const { data, error } = await supabase
            .from('houses')
            .update(updateData)
            .eq('id', id)
            .select(`
                *,
                client:profiles!houses_client_id_fkey(id, full_name, email)
            `)
            .single()

        if (error) throw error

        return NextResponse.json({ house: data })
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        )
    }
}

// DELETE: Eliminar casa (solo admin)
export async function DELETE(request: Request) {
    const user = await checkAuth(['admin'])

    if (!user) {
        return unauthorizedResponse('Solo administradores pueden eliminar casas')
    }

    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (!id) {
            return NextResponse.json(
                { error: 'ID de casa requerido' },
                { status: 400 }
            )
        }

        const { error } = await supabase
            .from('houses')
            .delete()
            .eq('id', id)

        if (error) throw error

        return NextResponse.json({ success: true })
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        )
    }
}