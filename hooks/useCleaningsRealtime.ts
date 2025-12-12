// hooks/useCleaningsRealtime.ts
'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { createClient } from '@/utils/supabase/client'
import type { Cleaning, CleaningBase, UserRole } from '@/types'

interface UseCleaningsRealtimeOptions {
    userId?: string
    role?: UserRole
    initialData?: Cleaning[]
}

// Interfaz auxiliar para la tabla intermedia
interface CleaningCleanerRelation {
    cleaning_id?: string
    cleaner_id?: string
}

export function useCleaningsRealtime({
                                         userId,
                                         role,
                                         initialData = []
                                     }: UseCleaningsRealtimeOptions = {}) {
    // Iniciamos con los datos del servidor para renderizado inmediato
    const [cleanings, setCleanings] = useState<Cleaning[]>(initialData)
    const [isLoading, setIsLoading] = useState(false)
    const supabase = createClient()

    // Referencia para evitar ciclos infinitos en dependencias
    const initialDataRef = useRef(initialData)

    // -------------------------------------------------------------------------
    // 1. TRANSFORM DATA HELPER
    // -------------------------------------------------------------------------
    const transformData = useCallback((rawRecord: any, userRole: UserRole | undefined): Cleaning => {
        // Normalizamos la data que viene de Supabase para que coincida con la interfaz Cleaning
        if (userRole === 'admin' || userRole === 'cleaner') {
            return {
                ...rawRecord,
                // Aseguramos que assigned_cleaners tenga el formato correcto
                assigned_cleaners: rawRecord.assigned_cleaners?.map((c: any) => ({
                    assigned_at: c.assigned_at || new Date().toISOString(),
                    // Si viene plano (vista) o anidado (realtime), lo manejamos en el componente,
                    // pero aquí intentamos preservar la estructura.
                    cleaner: c.cleaner || c
                })) || []
            } as Cleaning;
        }

        if (userRole === 'client') {
            return {
                ...rawRecord,
                client_name: rawRecord.client?.full_name || '',
                client_email: rawRecord.client?.email || '',
                client_phone: rawRecord.client?.phone || ''
            } as Cleaning;
        }

        return rawRecord as Cleaning;
    }, []);

    // -------------------------------------------------------------------------
    // 2. LOAD ALL CLEANINGS (FETCH)
    // -------------------------------------------------------------------------
    const loadCleanings = useCallback(async () => {
        if (!userId || !role) return

        setIsLoading(true)

        try {
            // 🔥 ADMIN: Trae todo desde la vista
            if (role === 'admin') {
                const { data, error } = await supabase
                    .from('cleanings_with_details')
                    .select('*')
                    .order('scheduled_date', { ascending: true })

                if (error) throw error
                setCleanings((data || []).map(d => transformData(d, 'admin')))
            }

            // 🔥 CLIENT: Trae sus limpiezas con relaciones
            else if (role === 'client') {
                const { data, error } = await supabase
                    .from('cleanings')
                    .select(`
                        *,
                        client:profiles!cleanings_client_id_fkey(id, full_name, email, phone),
                        assigned_cleaners:cleaning_cleaners(
                            assigned_at,
                            cleaner:profiles!cleaning_cleaners_cleaner_id_fkey(id, full_name, email, phone)
                        )
                    `)
                    .eq('client_id', userId)
                    .order('scheduled_date', { ascending: true })

                if (error) throw error
                setCleanings((data || []).map(d => transformData(d, 'client')))
            }

            // 🔥 CLEANER: Estrategia Robusta (IDs -> Vista)
            else if (role === 'cleaner') {
                // Paso 1: Obtener IDs asignados
                const { data: assignments } = await supabase
                    .from('cleaning_cleaners')
                    .select('cleaning_id')
                    .eq('cleaner_id', userId)

                const cleaningIds = assignments?.map(a => a.cleaning_id) || []

                if (cleaningIds.length === 0) {
                    setCleanings([])
                } else {
                    // Paso 2: Obtener detalles de esos IDs
                    const { data, error } = await supabase
                        .from('cleanings_with_details')
                        .select('*')
                        .in('id', cleaningIds)
                        .order('scheduled_date', { ascending: true })

                    if (error) throw error
                    setCleanings((data || []).map(d => transformData(d, 'cleaner')))
                }
            }

        } catch (error) {
            console.error('Error loading cleanings:', error)
        } finally {
            setIsLoading(false)
        }
    }, [userId, role, supabase, transformData]);


    // -------------------------------------------------------------------------
    // 3. REFRESH SINGLE CLEANING (OPTIMISTIC UPDATE HELPER)
    // -------------------------------------------------------------------------
    const refreshSingleCleaning = async (cleaningId: string) => {
        if (!cleaningId) return;

        let dataToTransform = null;

        if (role === 'admin' || role === 'cleaner') {
            const { data } = await supabase
                .from('cleanings_with_details')
                .select('*')
                .eq('id', cleaningId)
                .single();

            // Validación extra para cleaner: si se le desasignó, quitarlo de la lista
            if (role === 'cleaner' && data) {
                // En la vista 'cleanings_with_details', assigned_cleaners suele ser un array de objetos planos
                // Verificamos si nuestro ID está en ese array
                const isAssigned = data.assigned_cleaners?.some((ac: any) => ac.id === userId || ac.cleaner?.id === userId);

                if (!isAssigned) {
                    setCleanings(prev => prev.filter(c => c.id !== cleaningId));
                    return;
                }
            }
            dataToTransform = data;
        }
        else if (role === 'client') {
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
                .eq('id', cleaningId)
                .single();
            dataToTransform = data;
        }

        if (dataToTransform) {
            const formatted = transformData(dataToTransform, role);
            setCleanings(prev => {
                const exists = prev.find(c => c.id === cleaningId);
                if (exists) {
                    return prev.map(c => c.id === cleaningId ? formatted : c);
                } else {
                    // Si es nuevo, lo agregamos y reordenamos
                    const newList = [...prev, formatted];
                    return newList.sort((a, b) =>
                        new Date(a.scheduled_date).getTime() - new Date(b.scheduled_date).getTime()
                    );
                }
            });
        }
    };

    // -------------------------------------------------------------------------
    // 4. SYNC INITIAL DATA (Hydration)
    // -------------------------------------------------------------------------
    // Si la data inicial cambia desde el padre (page reload), actualizamos el estado
    useEffect(() => {
        if (JSON.stringify(initialDataRef.current) !== JSON.stringify(initialData)) {
            setCleanings(initialData)
            initialDataRef.current = initialData
        }
    }, [initialData])

    // -------------------------------------------------------------------------
    // 5. REVALIDATE ON FOCUS (SWR-like behavior)
    // -------------------------------------------------------------------------
    useEffect(() => {
        const handleRevalidation = () => {
            if (document.visibilityState === 'visible') {
                loadCleanings();
            }
        };
        window.addEventListener('focus', handleRevalidation);
        return () => window.removeEventListener('focus', handleRevalidation);
    }, [loadCleanings]);


    // -------------------------------------------------------------------------
    // 6. REALTIME SUBSCRIPTION
    // -------------------------------------------------------------------------
    useEffect(() => {
        if (!userId || !role) return;

        const channel = supabase.channel(`cleanings-realtime-${role}-${userId}`)

        // A) Escuchar tabla principal 'cleanings'
        channel.on(
            'postgres_changes',
            {
                event: '*',
                schema: 'public',
                table: 'cleanings',
                filter: role === 'client' ? `client_id=eq.${userId}` : undefined
            },
            async (payload) => {
                if (payload.eventType === 'DELETE') {
                    setCleanings(prev => prev.filter(c => c.id !== payload.old.id));
                } else {
                    // Insert o Update: Traemos el dato fresco completo y lo inyectamos
                    await refreshSingleCleaning((payload.new as CleaningBase).id);
                }
            }
        )

        // B) Escuchar tabla intermedia 'cleaning_cleaners' (Solo Admin/Cleaner)
        // Esto es vital para saber cuando nos asignan/desasignan un trabajo
        if (role === 'admin' || role === 'cleaner') {
            channel.on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'cleaning_cleaners'
                },
                async (payload) => {
                    const newRecord = payload.new as CleaningCleanerRelation;
                    const oldRecord = payload.old as CleaningCleanerRelation;
                    // Refrescamos la limpieza afectada para ver si cambiaron los cleaners asignados
                    const cleaningId = newRecord?.cleaning_id || oldRecord?.cleaning_id;
                    if (cleaningId) {
                        await refreshSingleCleaning(cleaningId);
                    }
                }
            )
        }

        channel.subscribe();

        return () => {
            supabase.removeChannel(channel);
        }
    }, [userId, role, supabase]);

    return {
        cleanings,
        isLoading,
        refresh: loadCleanings
    }
}