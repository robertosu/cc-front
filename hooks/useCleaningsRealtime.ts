// hooks/useCleaningsRealtime.ts
'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js'
import type { Cleaning, CleaningBase, UserRole } from '@/types'

interface UseCleaningsRealtimeOptions {
    userId?: string
    role?: UserRole
    initialData?: Cleaning[]
}

export function useCleaningsRealtime({
                                         userId,
                                         role,
                                         initialData = []
                                     }: UseCleaningsRealtimeOptions = {}) {
    const [cleanings, setCleanings] = useState<Cleaning[]>(initialData)
    const [isLoading, setIsLoading] = useState(false)
    const supabase = createClient()

    useEffect(() => {
        // Si no hay data inicial, cargar
        if (initialData.length === 0 && userId && role) {
            loadCleanings()
        } else {
            setCleanings(initialData)
        }

        // Configurar suscripción realtime
        const channel = supabase
            .channel('cleanings-changes')
            .on(
                'postgres_changes',
                {
                    event: '*', // INSERT, UPDATE, DELETE
                    schema: 'public',
                    table: 'cleanings'
                },
                handleRealtimeChange
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [userId, role])

    const loadCleanings = async () => {
        if (!userId || !role) return

        setIsLoading(true)
        try {
            // 🔥 ADMIN: Usa la vista con todos los detalles
            if (role === 'admin') {
                const { data, error } = await supabase
                    .from('cleanings_with_details')
                    .select('*')
                    .order('scheduled_date', { ascending: true })

                if (error) throw error

                // Transformar al formato Cleaning esperado
                const transformedData: Cleaning[] = (data || []).map(d => ({
                    ...d,
                    assigned_cleaners: d.assigned_cleaners?.map((c: any) => ({
                        assigned_at: new Date().toISOString(),
                        cleaner: c
                    })) || []
                }))

                setCleanings(transformedData)
                return
            }

            // 🔥 CLIENT: Consulta directa con joins
            if (role === 'client') {
                const { data, error } = await supabase
                    .from('cleanings')
                    .select(`
            *,
            client:profiles!cleanings_client_id_fkey(
              id, full_name, email, phone
            ),
            assigned_cleaners:cleaning_cleaners(
              assigned_at,
              cleaner:profiles!cleaning_cleaners_cleaner_id_fkey(
                id, full_name, email, phone
              )
            )
          `)
                    .eq('client_id', userId)
                    .order('scheduled_date', { ascending: true })

                if (error) throw error

                // Transformar añadiendo campos faltantes
                const transformedData: Cleaning[] = (data || []).map(d => ({
                    ...d,
                    client_name: d.client?.full_name || '',
                    client_email: d.client?.email || '',
                    client_phone: d.client?.phone || ''
                }))

                setCleanings(transformedData)
                return
            }

            // 🔥 CLEANER: Consulta sus asignaciones
            if (role === 'cleaner') {
                const { data: assignments } = await supabase
                    .from('cleaning_cleaners')
                    .select('cleaning_id')
                    .eq('cleaner_id', userId)

                const cleaningIds = assignments?.map(a => a.cleaning_id) || []

                if (cleaningIds.length === 0) {
                    setCleanings([])
                    return
                }

                const { data, error } = await supabase
                    .from('cleanings_with_details')
                    .select('*')
                    .in('id', cleaningIds)
                    .order('scheduled_date', { ascending: true })

                if (error) throw error

                // Transformar al formato Cleaning esperado
                const transformedData: Cleaning[] = (data || []).map(d => ({
                    ...d,
                    assigned_cleaners: d.assigned_cleaners?.map((c: any) => ({
                        assigned_at: new Date().toISOString(),
                        cleaner: c
                    })) || []
                }))

                setCleanings(transformedData)
            }

        } catch (error) {
            console.error('Error loading cleanings:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleRealtimeChange = (payload: RealtimePostgresChangesPayload<CleaningBase>) => {
        const { eventType, new: newRecord, old: oldRecord } = payload

        console.log('🔴 Realtime event:', eventType, newRecord)

        switch (eventType) {
            case 'INSERT':
                // Para INSERT, recargar todo para tener las relaciones
                if (shouldShowCleaning(newRecord as CleaningBase)) {
                    loadCleanings()
                }
                break

            case 'UPDATE':
                // Para UPDATE, solo actualizar campos del registro base
                setCleanings(prev =>
                    prev.map(cleaning =>
                        cleaning.id === (newRecord as CleaningBase).id
                            ? {
                                ...cleaning,
                                ...newRecord,
                                // Preservar las relaciones existentes
                                client_name: cleaning.client_name,
                                client_email: cleaning.client_email,
                                client_phone: cleaning.client_phone,
                                assigned_cleaners: cleaning.assigned_cleaners
                            }
                            : cleaning
                    )
                )
                break

            case 'DELETE':
                setCleanings(prev =>
                    prev.filter(cleaning => cleaning.id !== (oldRecord as CleaningBase).id)
                )
                break
        }
    }

    const shouldShowCleaning = (cleaning: CleaningBase): boolean => {
        if (!userId || !role) return false
        if (role === 'admin') return true
        if (role === 'client') return cleaning.client_id === userId
        return false
    }

    return {
        cleanings,
        isLoading,
        refresh: loadCleanings
    }
}