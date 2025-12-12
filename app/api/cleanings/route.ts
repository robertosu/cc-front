// app/api/cleanings/route.ts
import {createClient} from '@/utils/supabase/server'
import {NextResponse} from 'next/server'
import {checkAuth, unauthorizedResponse} from '@/utils/auth/roleCheck'

type CleaningUpdate = Partial<{
    client_id: string
    address: string
    total_steps: number
    scheduled_date: string
    start_time: string
    end_time: string
    status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
    current_step: number
    notes: string
}>


// GET: Obtener limpiezas (según rol)
export async function GET(request: Request) {
    const user = await checkAuth(['admin', 'cleaner', 'client'])

    if (!user) {
        return unauthorizedResponse()
    }

    const supabase = await createClient()

    try {
        const { searchParams } = new URL(request.url)
        const status = searchParams.get('status')

        // Admin: usa la vista para obtener toda la información
        if (user.role === 'admin') {

            const { data, error } = await supabase
                .from('cleanings_with_details')
                .select('*')
                .order('scheduled_date', { ascending: true })

            if (error) throw error

            return NextResponse.json({ cleanings: data })
        }

        // Cleaner: solo sus limpiezas asignadas
        if (user.role === 'cleaner') {
            let query = supabase
                .from('cleanings')
                .select('*')
                .contains('cleaners', [{ id: user.id }])

            if (status) {
                query = query.eq('status', status)
            }

            const { data, error } = await query.order('scheduled_date', { ascending: true })

            if (error) throw error

            return NextResponse.json({ cleanings: data })
        }

        // Cliente: solo sus limpiezas
        if (user.role === 'client') {
            let query = supabase
                .from('cleanings')
                .select('*')
                .eq('client->>id', user.id)

            if (status) {
                query = query.eq('status', status)
            }

            const { data, error } = await query.order('scheduled_date', { ascending: true })

            if (error) throw error

            return NextResponse.json({ cleanings: data })
        }

        return NextResponse.json({ cleanings: [] })

    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Error in PUT /api/cleanings:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        } else {
            console.error('Unknown error:', error)
            return NextResponse.json({ error: 'Error desconocido' }, { status: 500 })
        }
    }
}

// POST: Crear limpieza (solo admin)
export async function POST(request: Request) {
    const user = await checkAuth(['admin'])

    if (!user) {
        return unauthorizedResponse('Solo administradores pueden crear limpiezas')
    }

    const supabase = await createClient()

    try {
        const body = await request.json()
        const {
            client_id,
            cleaner_ids, // Array de IDs de cleaners
            address,
            total_steps,
            scheduled_date,
            start_time,
            end_time,
            notes
        } = body

        // Validaciones
        if (!client_id || !address || !total_steps || !scheduled_date || !start_time || !end_time) {
            return NextResponse.json(
                { error: 'Faltan campos requeridos: client_id, address, total_steps, scheduled_date, start_time, end_time' },
                { status: 400 }
            )
        }

        if (total_steps < 1 || total_steps > 20) {
            return NextResponse.json(
                { error: 'El número de pasos debe estar entre 1 y 20' },
                { status: 400 }
            )
        }

        // Verificar que el cliente existe y tiene rol correcto
        const { data: clientExists } = await supabase
            .from('profiles')
            .select('id, role')
            .eq('id', client_id)
            .eq('role', 'client')
            .single()

        if (!clientExists) {
            return NextResponse.json(
                { error: 'Cliente no encontrado' },
                { status: 404 }
            )
        }

        // Verificar cleaners si se proporcionaron
        if (cleaner_ids && cleaner_ids.length > 0) {
            const { data: cleaners } = await supabase
                .from('profiles')
                .select('id')
                .eq('role', 'cleaner')
                .in('id', cleaner_ids)

            if (!cleaners || cleaners.length !== cleaner_ids.length) {
                return NextResponse.json(
                    { error: 'Uno o más cleaners no son válidos' },
                    { status: 400 }
                )
            }
        }

        // Crear limpieza
        const { data: cleaning, error: cleaningError } = await supabase
            .from('cleanings')
            .insert({
                client_id,
                address,
                total_steps,
                scheduled_date,
                start_time,
                end_time,
                notes,
                status: 'pending',
                current_step: 0
            })
            .select()
            .single()

        if (cleaningError) throw cleaningError

        // Asignar cleaners si se proporcionaron
        if (cleaner_ids && cleaner_ids.length > 0) {
            const assignments = cleaner_ids.map((cleaner_id: string) => ({
                cleaning_id: cleaning.id,
                cleaner_id
            }))

            const { error: assignmentError } = await supabase
                .from('cleaning_cleaners')
                .insert(assignments)

            if (assignmentError) throw assignmentError
        }

        // Obtener limpieza completa con relaciones
        const { data: fullCleaning } = await supabase
            .from('cleanings')
            .select('*')
            .eq('id', cleaning.id)
            .single()

        return NextResponse.json({ cleaning: fullCleaning }, { status: 201 })

    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Error in PUT /api/cleanings:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        } else {
            console.error('Unknown error:', error)
            return NextResponse.json({ error: 'Error desconocido' }, { status: 500 })
        }
    }
}

// PUT: Actualizar limpieza
export async function PUT(request: Request) {
    const user = await checkAuth(['admin', 'cleaner'])

    if (!user) {
        return unauthorizedResponse()
    }

    const supabase = await createClient()

    try {
        const body = await request.json()
        const {
            id,
            client_id,
            cleaner_ids, // Array de IDs para admin
            address,
            total_steps,
            scheduled_date,
            start_time,
            end_time,
            status,
            current_step,
            notes
        } = body

        if (!id) {
            return NextResponse.json(
                { error: 'ID de limpieza requerido' },
                { status: 400 }
            )
        }

        // Obtener limpieza actual
        const { data: currentCleaning, error: fetchError } = await supabase
            .from('cleanings')
            .select('*')
            .eq('id', id)
            .single()

        if (fetchError || !currentCleaning) {
            return NextResponse.json(
                { error: 'Limpieza no encontrada' },
                { status: 404 }
            )
        }

        // Si es cleaner, verificar que está asignado a esta limpieza
        if (user.role === 'cleaner') {
            const { data: assignment } = await supabase
                .from('cleaning_cleaners')
                .select('*')
                .eq('cleaning_id', id)
                .eq('cleaner_id', user.id)
                .single()

            if (!assignment) {
                return unauthorizedResponse('No puedes actualizar limpiezas no asignadas a ti')
            }
        }

        const updateData: CleaningUpdate = {}

        // Admin puede actualizar todo
        if (user.role === 'admin') {
            if (client_id !== undefined) updateData.client_id = client_id
            if (address !== undefined) updateData.address = address
            if (total_steps !== undefined) updateData.total_steps = total_steps
            if (scheduled_date !== undefined) updateData.scheduled_date = scheduled_date
            if (start_time !== undefined) updateData.start_time = start_time
            if (end_time !== undefined) updateData.end_time = end_time
            if (status !== undefined) updateData.status = status
            if (current_step !== undefined) updateData.current_step = current_step
            if (notes !== undefined) updateData.notes = notes

            // Actualizar asignaciones de cleaners si se proporcionaron
            if (cleaner_ids !== undefined) {
                // Eliminar asignaciones actuales
                await supabase
                    .from('cleaning_cleaners')
                    .delete()
                    .eq('cleaning_id', id)

                // Crear nuevas asignaciones
                if (cleaner_ids.length > 0) {
                    const assignments = cleaner_ids.map((cleaner_id: string) => ({
                        cleaning_id: id,
                        cleaner_id
                    }))

                    await supabase
                        .from('cleaning_cleaners')
                        .insert(assignments)
                }
            }
        }

        // Cleaner solo puede actualizar progreso
        if (user.role === 'cleaner') {

            // 1. VALIDACIÓN DE STEPS
            if (current_step !== undefined) {
                if (current_step < 0 || current_step > currentCleaning.total_steps) {
                    return NextResponse.json(
                        { error: `El paso debe estar entre 0 y ${currentCleaning.total_steps}` },
                        { status: 400 }
                    )
                }
                updateData.current_step = current_step

                // Automáticamente marcar como completado si llega al final
                if (current_step === currentCleaning.total_steps) {
                    updateData.status = 'completed'
                }
                // Si estaba completada y baja un paso, volver a in_progress
                else if (current_step < currentCleaning.total_steps && currentCleaning.status === 'completed') {
                    updateData.status = 'in_progress'
                }
                // Si empieza (paso > 0) y estaba pendiente
                else if (current_step > 0 && currentCleaning.status === 'pending') {
                    updateData.status = 'in_progress'
                }
            }

            // 2. VALIDACIÓN DE STATUS MANUAL
            if (status !== undefined) {
                // Si el cleaner intenta marcar "completed" manualmente...
                if (status === 'completed') {
                    // Verificamos si los pasos están completos (ya sea en la DB o en el update actual)
                    const stepsToCheck = current_step !== undefined ? current_step : currentCleaning.current_step

                    if (stepsToCheck < currentCleaning.total_steps) {
                        return NextResponse.json(
                            { error: 'No puedes completar la limpieza hasta terminar todos los pasos.' },
                            { status: 400 }
                        )
                    }
                }

                // Permitir cambios válidos
                if (['in_progress', 'completed'].includes(status)) {
                    updateData.status = status
                }
            }
        }

        // Actualizar limpieza
        const { error: updateError } = await supabase
            .from('cleanings')
            .update(updateData)
            .eq('id', id)

        if (updateError) throw updateError

        // Obtener limpieza actualizada con relaciones
        const { data: updatedCleaning } = await supabase
            .from('cleanings')
            .select('*')
            .eq('id', id)
            .single()

        return NextResponse.json({ cleaning: updatedCleaning })

    }catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Error in PUT /api/cleanings:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        } else {
            console.error('Unknown error:', error)
            return NextResponse.json({ error: 'Error desconocido' }, { status: 500 })
        }
    }
}

// DELETE: Eliminar limpieza (solo admin)
export async function DELETE(request: Request) {
    const user = await checkAuth(['admin'])

    if (!user) {
        return unauthorizedResponse('Solo administradores pueden eliminar limpiezas')
    }

    const supabase = await createClient()

    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (!id) {
            return NextResponse.json(
                { error: 'ID de limpieza requerido' },
                { status: 400 }
            )
        }

        // Las asignaciones se eliminan automáticamente por CASCADE
        const { error } = await supabase
            .from('cleanings')
            .delete()
            .eq('id', id)

        if (error) throw error

        return NextResponse.json({ success: true })

    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Error in PUT /api/cleanings:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        } else {
            console.error('Unknown error:', error)
            return NextResponse.json({ error: 'Error desconocido' }, { status: 500 })
        }
    }
}