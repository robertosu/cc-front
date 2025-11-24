export interface AssignedCleaner {
    assigned_at: string
    cleaner: {
        id: string
        full_name: string
        email: string
        phone?: string
    } | null
}

export interface Cleaning {
    id: string
    client_id: string
    address: string
    total_steps: number
    current_step: number
    scheduled_date: string
    start_time: string
    end_time: string
    status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
    notes?: string
    created_at: string
    updated_at: string
    client?: {
        id: string
        full_name: string
        email: string
        phone?: string
    }
    assigned_cleaners?: AssignedCleaner[]
}
