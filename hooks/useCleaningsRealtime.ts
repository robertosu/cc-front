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

interface CleaningCleanerRelation {
    cleaning_id?: string
    cleaner_id?: string
}

export function useCleaningsRealtime({
                                         userId,
                                         role,
                                         initialData = []
                                     }: UseCleaningsRealtimeOptions = {}) {
    const [cleanings, setCleanings] = useState<Cleaning[]>(initialData)
    const [isLoading, setIsLoading] = useState(false)
    const supabase = createClient()
    const initialDataRef = useRef(initialData)

    // -------------------------------------------------------------------------
    // 1. TRANSFORM DATA HELPER (CORREGIDO)
    // -------------------------------------------------------------------------
    const transformData = useCallback((rawRecord: any, userRole: UserRole | undefined): Cleaning => {
        // Lógica común para normalizar cleaners
        const normalizeCleaners = (record: any) => {
            return record.assigned_cleaners?.map((c: any) => ({
                assigned_at: c.assigned_at || new Date().toISOString(),
                // Truco clave: Si 'c' tiene propiedad 'cleaner', úsala (anidado).
                // Si no, asume que 'c' es el cleaner mismo (vista plana).
                cleaner: c.cleaner || c
            })) || []
        }

        if (userRole === 'admin' || userRole === 'cleaner') {
            return {
                ...rawRecord,
                assigned_cleaners: normalizeCleaners(rawRecord)
            } as Cleaning;
        }

        if (userRole === 'client') {
            return {
                ...rawRecord,
                client_name: rawRecord.client?.full_name || '',
                client_email: rawRecord.client?.email || '',
                client_phone: rawRecord.client?.phone || '',
                // AHORA NORMALIZAMOS TAMBIÉN PARA EL CLIENTE
                assigned_cleaners: normalizeCleaners(rawRecord)
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
            if (role === 'admin') {
                const { data, error } = await supabase
                    .from('cleanings_with_details')
                    .select('*')
                    .order('scheduled_date', { ascending: true })

                if (error) throw error
                setCleanings((data || []).map(d => transformData(d, 'admin')))
            }
            // CLIENTE: Usamos la consulta profunda para asegurar datos anidados
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
            else if (role === 'cleaner') {
                const { data: assignments } = await supabase
                    .from('cleaning_cleaners')
                    .select('cleaning_id')
                    .eq('cleaner_id', userId)

                const cleaningIds = assignments?.map(a => a.cleaning_id) || []

                if (cleaningIds.length === 0) {
                    setCleanings([])
                } else {
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
    // 3. REFRESH SINGLE CLEANING
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

            if (role === 'cleaner' && data) {
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
                    const newList = [...prev, formatted];
                    return newList.sort((a, b) =>
                        new Date(a.scheduled_date).getTime() - new Date(b.scheduled_date).getTime()
                    );
                }
            });
        }
    };

    // 4. SYNC INITIAL DATA
    useEffect(() => {
        if (JSON.stringify(initialDataRef.current) !== JSON.stringify(initialData)) {
            // Aplicamos la transformación también a la data inicial por si acaso viene plana
            const safeData = initialData.map(d => transformData(d, role));
            setCleanings(safeData)
            initialDataRef.current = initialData
        }
    }, [initialData, role, transformData])

    // 5. REVALIDATE ON FOCUS
    useEffect(() => {
        const handleRevalidation = () => {
            if (document.visibilityState === 'visible') {
                loadCleanings();
            }
        };
        window.addEventListener('focus', handleRevalidation);
        return () => window.removeEventListener('focus', handleRevalidation);
    }, [loadCleanings]);

    // 6. REALTIME SUBSCRIPTION
    useEffect(() => {
        if (!userId || !role) return;
        const channel = supabase.channel(`cleanings-realtime-${role}-${userId}`)

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
                    await refreshSingleCleaning((payload.new as CleaningBase).id);
                }
            }
        )

        if (role === 'admin' || role === 'cleaner') {
            channel.on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'cleaning_cleaners' },
                async (payload) => {
                    const record = payload.new as CleaningCleanerRelation || payload.old as CleaningCleanerRelation;
                    if (record?.cleaning_id) await refreshSingleCleaning(record.cleaning_id);
                }
            )
        }

        channel.subscribe();
        return () => { supabase.removeChannel(channel); }
    }, [userId, role, supabase]);

    return { cleanings, isLoading, refresh: loadCleanings }
}