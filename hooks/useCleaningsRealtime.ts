// hooks/useCleaningsRealtime.ts
'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js'
import type { Cleaning, CleaningBase, UserRole } from '@/types'
import {USER_ROLES} from "@/utils/auth/roleCheck";

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
        if (!userId || !role) return; // No conectar si no hay usuario

        // Configurar filtro según el rol para recibir MENOS eventos
        let filterValue = undefined;
        if (role === 'client') {
            // Solo escuchar eventos donde el client_id sea el del usuario
            filterValue = `client_id=eq.${userId}`;
        }
        // Para cleaner es más complejo filtrar por realtime simple,
        // pero podrías intentar filtrar por status si es relevante.

        const channel = supabase
            .channel('cleanings-changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'cleanings',
                    filter: filterValue // <--- AQUÍ ESTÁ EL FILTRO
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

    const handleRealtimeChange = async (payload: RealtimePostgresChangesPayload<CleaningBase>) => {
        const { eventType, new: newRecord, old: oldRecord } = payload

        console.log('🔴 Realtime event:', eventType, newRecord)

        switch (eventType) {
            case 'INSERT':
                // Verificar si debemos mostrar esta limpieza
                if (shouldShowCleaning(newRecord as CleaningBase)) {

                    // OPTIMIZACIÓN: Fetch SOLO del registro nuevo para obtener sus relaciones
                    let dataToTransform = null;

                    if (role === 'admin' || role === 'cleaner') {
                        // Admin/Cleaner: Consultar a la VISTA
                        const { data } = await supabase
                            .from('cleanings_with_details')
                            .select('*')
                            .eq('id', (newRecord as CleaningBase).id)
                            .single();
                        dataToTransform = data;
                    }
                    else if (role === 'client') {
                        // Client: Consultar a la TABLA con JOINS
                        const { data } = await supabase
                            .from('cleanings')
                            .select(`
                                *,
                                client:profiles!cleanings_client_id_fkey(id, full_name, email, phone),
                                assigned_cleaners:cleaning_cleaners(
                                    assigned_at,
                                    cleaner:profiles!cleaning_cleaners_cleaner_id_fkey(id, full_name, email, phone)
                                )
                            `)
                            .eq('id', (newRecord as CleaningBase).id)
                            .single();
                        dataToTransform = data;
                    }

                    // Si obtuvimos datos, los transformamos y agregamos al estado
                    if (dataToTransform) {
                        const formattedCleaning = transformData(dataToTransform, role);
                        setCleanings(prev => [...prev, formattedCleaning]);
                    }
                }
                break;

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


    // Helper para normalizar los datos según el rol y la fuente
    const transformData = (rawRecord: any, role: UserRole | undefined): Cleaning => {
        // CASO 1: Admin o Cleaner (Datos vienen de la vista 'cleanings_with_details')
        // La vista entrega 'assigned_cleaners' como un array plano de objetos,
        // pero tu frontend espera una estructura { assigned_at, cleaner: {...} }
        if (role === 'admin' || role === 'cleaner') {
            return {
                ...rawRecord,
                // Replicando tu lógica original de loadCleanings:
                assigned_cleaners: rawRecord.assigned_cleaners?.map((c: any) => ({
                    assigned_at: c.assigned_at || new Date().toISOString(), // Usar la fecha real si existe
                    cleaner: c
                })) || []
            } as Cleaning;
        }

        // CASO 2: Client (Datos vienen de consulta directa a 'cleanings' con Joins)
        // Aquí 'assigned_cleaners' ya viene bien por el query, pero faltan los datos planos del cliente
        if (role === 'client') {
            return {
                ...rawRecord,
                client_name: rawRecord.client?.full_name || '',
                client_email: rawRecord.client?.email || '',
                client_phone: rawRecord.client?.phone || ''
            } as Cleaning;
        }

        return rawRecord as Cleaning;
    };


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