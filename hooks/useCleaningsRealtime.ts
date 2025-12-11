// hooks/useCleaningsRealtime.ts
'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/utils/supabase/client'
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js'
import type { Cleaning, CleaningBase, UserRole } from '@/types'

interface UseCleaningsRealtimeOptions {
    userId?: string
    role?: UserRole
    initialData?: Cleaning[]
}

// Interfaz auxiliar para la tabla intermedia (resuelve el error TS)
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

    // -------------------------------------------------------------------------
    // 1. TRANSFORM DATA HELPER
    // -------------------------------------------------------------------------
    const transformData = useCallback((rawRecord: any, userRole: UserRole | undefined): Cleaning => {
        if (userRole === 'admin' || userRole === 'cleaner') {
            return {
                ...rawRecord,
                assigned_cleaners: rawRecord.assigned_cleaners?.map((c: any) => ({
                    assigned_at: c.assigned_at || new Date().toISOString(),
                    cleaner: c
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
    // 2. LOAD ALL CLEANINGS
    // -------------------------------------------------------------------------
    const loadCleanings = useCallback(async () => {
        if (!userId || !role) return

        if (cleanings.length === 0) setIsLoading(true)

        try {
            // 🔥 ADMIN
            if (role === 'admin') {
                const { data, error } = await supabase
                    .from('cleanings_with_details')
                    .select('*')
                    .order('scheduled_date', { ascending: true })

                if (error) throw error
                setCleanings((data || []).map(d => transformData(d, 'admin')))
            }

            // 🔥 CLIENT
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

            // 🔥 CLEANER
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
        // console.log('🔄 Refreshing single cleaning:', cleaningId);

        let dataToTransform = null;

        if (role === 'admin' || role === 'cleaner') {
            const { data } = await supabase
                .from('cleanings_with_details')
                .select('*')
                .eq('id', cleaningId)
                .single();

            if (role === 'cleaner' && data) {
                const isAssigned = data.assigned_cleaners?.some((ac: any) => ac.id === userId);
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
                    return [...prev, formatted];
                }
            });
        }
    };


    // -------------------------------------------------------------------------
    // 4. REVALIDATE ON FOCUS
    // -------------------------------------------------------------------------
    useEffect(() => {
        const handleRevalidation = () => {
            if (document.visibilityState === 'visible') {
                // console.log('👀 App en foco: Revalidando datos...');
                loadCleanings();
            }
        };

        window.addEventListener('focus', handleRevalidation);
        document.addEventListener('visibilitychange', handleRevalidation);

        return () => {
            window.removeEventListener('focus', handleRevalidation);
            document.removeEventListener('visibilitychange', handleRevalidation);
        };
    }, [loadCleanings]);


    // -------------------------------------------------------------------------
    // 5. REALTIME SUBSCRIPTION
    // -------------------------------------------------------------------------
    useEffect(() => {
        if (!userId || !role) return;

        const channel = supabase.channel('cleanings-realtime-logic')

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
                    await refreshSingleCleaning((payload.new as CleaningBase).id);
                }
            }
        )

        // B) Escuchar tabla intermedia 'cleaning_cleaners' (Solo Admin/Cleaner)
        if (role === 'admin' || role === 'cleaner') {
            channel.on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'cleaning_cleaners'
                },
                async (payload) => {
                    // SOLUCIÓN AL ERROR: Casteamos new/old a un tipo conocido
                    const newRecord = payload.new as CleaningCleanerRelation;
                    const oldRecord = payload.old as CleaningCleanerRelation;

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