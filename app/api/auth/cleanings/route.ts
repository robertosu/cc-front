// app/api/cleanings/route.ts
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { checkAuth, unauthorizedResponse } from '@/utils/auth/roleCheck'

// GET: Obtener limpiezas (según rol)
export async function GET(request: Request) {
    const user = await checkAuth(['admin', 'cleaner', 'cliente'])

    if (!user) {
        return unauthorizedResponse()
    }

    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    try {
        const { searchParams } = new URL(request.url)
        const status = searchParams.get('status')

        let query = supabase
            .from('cleanings')
            .select(`
                *,
                house:houses(
                    *,
                    client:profiles!houses_client_id_fkey(id, full_name, email, phone)
                ),
                cleaner:profiles!cleanings_cleaner_id_fkey(id, full_name, email, phone)
            `)

        // Filtrar por status si se proporciona
        if (status) {
            query = query.eq('status', status)
        }

        // Cleaner solo ve sus limpiezas
        if (user.role === 'cleaner') {
            query = query.eq('cleaner_id', user.id)
        }

        // RLS maneja automáticamente el filtrado para clientes

        const { data, error } = await query.order('scheduled_date', { ascending: true })

        if (error) throw error

        return NextResponse.json({ cleanings: data })
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        )
    }
}

// POST: Crear limpieza (solo admin)
export async function POST(request: Request) {
    const user = await checkAuth(['admin'])

    if (!user) {
        return unauthorizedResponse('Solo administradores pueden crear limpiezas')
    }

    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    try {
        const body = await request.json()
        const { house_id, cleaner_id, scheduled_date, start_time, end_time, notes } = body

        // Validaciones
        if (!house_id || !scheduled_date || !start_time || !end_time) {
            return NextResponse.json(
                { error: 'Faltan campos requeridos' },
                { status: 400 }
            )
        }

        // Verificar que la casa existe
        const { data: house } = await supabase
            .from('houses')
            .select('id')
            .eq('id', house_id)
            .single()

        if (!house) {
            return NextResponse.json(
                { error: 'Casa no encontrada' },
                { status: 404 }
            )
        }

        // Si se asigna cleaner, verificar que existe y tiene rol correcto
        if (cleaner_id) {
            const { data: cleaner } = await supabase
                .from('profiles')
                .select('id, role')
                .eq('id', cleaner_id)
                .single()

            if (!cleaner || cleaner.role !== 'cleaner') {
                return NextResponse.json(
                    { error: 'Cleaner no válido' },
                    { status: 400 }
                )
            }
        }

        // Crear limpieza
        const { data, error } = await supabase
            .from('cleanings')
            .insert({
                house_id,
                cleaner_id: cleaner_id || null,
                scheduled_date,
                start_time,
                end_time,
                notes,
                status: 'pending',
                current_sector: 0
            })
            .select(`
                *,
                house:houses(
                    *,
                    client:profiles!houses_client_id_fkey(id, full_name, email)
                ),
                cleaner:profiles!cleanings_cleaner_id_fkey(id, full_name, email)
            `)
            .single()

        if (error) throw error

        return NextResponse.json({ cleaning: data }, { status: 201 })
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        )
    }
}

// PUT: Actualizar limpieza
export async function PUT(request: Request) {
    const user = await checkAuth(['admin', 'cleaner'])

    if (!user) {
        return unauthorizedResponse()
    }

    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    try {
        const body = await request.json()
        const { id, cleaner_id, scheduled_date, start_time, end_time, status, current_sector, notes } = body

        if (!id) {
            return NextResponse.json(
                { error: 'ID de limpieza requerido' },
                { status: 400 }
            )
        }

        // Obtener limpieza actual
        const { data: currentCleaning } = await supabase
            .from('cleanings')
            .select('*, house:houses(sectors_count)')
            .eq('id', id)
            .single()

        if (!currentCleaning) {
            return NextResponse.json(
                { error: 'Limpieza no encontrada' },
                { status: 404 }
            )
        }

        // Si es cleaner, solo puede actualizar sus propias limpiezas
        if (user.role === 'cleaner' && currentCleaning.cleaner_id !== user.id) {
            return unauthorizedResponse('No puedes actualizar limpiezas de otros')
        }

        const updateData: any = {}

        // Admin puede actualizar todo
        if (user.role === 'admin') {
            if (cleaner_id !== undefined) updateData.cleaner_id = cleaner_id
            if (scheduled_date !== undefined) updateData.scheduled_date = scheduled_date
            if (start_time !== undefined) updateData.start_time = start_time
            if (end_time !== undefined) updateData.end_time = end_time
            if (status !== undefined) updateData.status = status
            if (notes !== undefined) updateData.notes = notes
        }

        // Cleaner solo puede actualizar estado y sector
        if (current_sector !== undefined) {
            const maxSectors = currentCleaning.house.sectors_count
            if (current_sector < 0 || current_sector > maxSectors) {
                return NextResponse.json(
                    { error: `El sector debe estar entre 0 y ${maxSectors}` },
                    { status: 400 }
                )
            }
            updateData.current_sector = current_sector

            // Si completa todos los sectores, marcar como completado
            if (current_sector === maxSectors && status !== 'completed') {
                updateData.status = 'completed'
            }
        }

        if (status !== undefined && user.role === 'cleaner') {
            // Cleaner solo puede cambiar a in_progress o completed
            if (['in_progress', 'completed'].includes(status)) {
                updateData.status = status
            }
        }

        const { data, error } = await supabase
            .from('cleanings')
            .update(updateData)
            .eq('id', id)
            .select(`
                *,
                house:houses(
                    *,
                    client:profiles!houses_client_id_fkey(id, full_name, email)
                ),
                cleaner:profiles!cleanings_cleaner_id_fkey(id, full_name, email)
            `)
            .single()

        if (error) throw error

        return NextResponse.json({ cleaning: data })
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        )
    }
}

// DELETE: Eliminar limpieza (solo admin)
export async function DELETE(request: Request) {
    const user = await checkAuth(['admin'])

    if (!user) {
        return unauthorizedResponse('Solo administradores pueden eliminar limpiezas')
    }

    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (!id) {
            return NextResponse.json(
                { error: 'ID de limpieza requerido' },
                { status: 400 }
            )
        }

        const { error } = await supabase
            .from('cleanings')
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