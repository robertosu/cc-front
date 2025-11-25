// hooks/useCleaningsRealtime.ts
'use client'

import {useEffect, useState} from 'react'
import {createClient} from '@/utils/supabase/client'
import type {RealtimePostgresChangesPayload} from '@supabase/supabase-js'
import {Cleaning} from '@/types/cleaning'

interface UseCleaningsRealtimeOptions {
    userId?: string
    role?: 'admin' | 'cleaner' | 'client'
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
            let query = supabase.from('cleanings').select('*')

            // Filtrar según rol
            if (role === 'client') {
                query = query.eq('client_id', userId)
            } else if (role === 'cleaner') {
                // Para cleaners, necesitamos sus asignaciones
                const { data: assignments } = await supabase
                    .from('cleaning_cleaners')
                    .select('cleaning_id')
                    .eq('cleaner_id', userId)

                const cleaningIds = assignments?.map(a => a.cleaning_id) || []
                query = query.in('id', cleaningIds)
            }
            // Admin ve todo (sin filtro)

            const { data, error } = await query.order('scheduled_date', { ascending: true })

            if (error) throw error
            setCleanings(data || [])
        } catch (error) {
            console.error('Error loading cleanings:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleRealtimeChange = (payload: RealtimePostgresChangesPayload<Cleaning>) => {
        const { eventType, new: newRecord, old: oldRecord } = payload

        console.log('🔴 Realtime event:', eventType, newRecord)

        switch (eventType) {
            case 'INSERT':
                // Verificar si el usuario debe ver este cleaning
                if (shouldShowCleaning(newRecord as Cleaning)) {
                    setCleanings(prev => [...prev, newRecord as Cleaning])
                }
                break

            case 'UPDATE':
                setCleanings(prev =>
                    prev.map(cleaning =>
                        cleaning.id === (newRecord as Cleaning).id
                            ? { ...cleaning, ...(newRecord as Cleaning) }
                            : cleaning
                    )
                )
                break

            case 'DELETE':
                setCleanings(prev =>
                    prev.filter(cleaning => cleaning.id !== (oldRecord as Cleaning).id)
                )
                break
        }
    }

    const shouldShowCleaning = (cleaning: Cleaning): boolean => {
        if (!userId || !role) return false

        if (role === 'admin') return true
        if (role === 'client') return cleaning.client_id === userId
        // Para cleaner, necesitaríamos verificar asignaciones (se hace en el server)
        return false
    }

    return {
        cleanings,
        isLoading,
        refresh: loadCleanings
    }
}