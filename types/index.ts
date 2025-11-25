// types/index.ts
// =====================================================
// ARCHIVO ÚNICO DE TIPOS - USA ESTE EN TODA LA APP
// =====================================================

// ==================== USUARIOS ====================
export type UserRole = 'admin' | 'cleaner' | 'client'

export interface Profile {
    id: string
    full_name: string
    email: string
    phone?: string
    role: UserRole
    created_at: string
    updated_at?: string
    // Contadores opcionales (solo cuando se incluyen)
    client_cleanings_count?: number
    cleaner_cleanings_count?: number
}

export interface AuthUser {
    id: string
    email: string
    role: UserRole
}

// ==================== CLEANERS ====================
export interface Cleaner {
    id: string
    full_name: string
    email: string
    phone?: string
}

export interface AssignedCleaner {
    assigned_at: string
    cleaner: Cleaner | null
}

// ==================== CLIENT ====================
export interface Client {
    id: string
    full_name: string
    email: string
    phone?: string
}

// ==================== CLEANINGS ====================
export type CleaningStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled'

// 🔥 TIPO BASE - Lo que viene de la DB
export interface CleaningBase {
    id: string
    client_id: string
    address: string
    total_steps: number
    current_step: number
    scheduled_date: string
    start_time: string
    end_time: string
    status: CleaningStatus
    notes?: string
    created_at: string
    updated_at: string
}

// 🔥 TIPO COMPLETO - Con relaciones incluidas
export interface Cleaning extends CleaningBase {
    // Información del cliente (desde la vista o join)
    client_name: string
    client_email: string
    client_phone: string

    // Cleaners asignados (desde join)
    assigned_cleaners: AssignedCleaner[]

    // Opcional: objeto completo del cliente
    client?: Client
}

// 🔥 TIPO PARA LA VISTA cleanings_with_details
export interface CleaningWithDetails extends CleaningBase {
    client_name: string
    client_email: string
    client_phone: string
    assigned_cleaners: Cleaner[] // Array directo de cleaners
}

// ==================== API RESPONSES ====================
export interface ApiError {
    error: string
    field?: string
}

export interface ApiSuccess<T = any> {
    success: boolean
    data?: T
    message?: string
}

// ==================== FORMS ====================
export interface CreateCleaningForm {
    client_id: string
    address: string
    total_steps: number
    scheduled_date: string
    start_time: string
    end_time: string
    notes?: string
    cleaner_ids?: string[]
}

export interface UpdateCleaningForm {
    id: string
    client_id?: string
    address?: string
    total_steps?: number
    scheduled_date?: string
    start_time?: string
    end_time?: string
    status?: CleaningStatus
    current_step?: number
    notes?: string
    cleaner_ids?: string[]
}

// ==================== COMPONENTES ====================
export interface Option {
    id: string
    label: string
    sublabel?: string
}

export interface Message {
    type: 'success' | 'error'
    text: string
}

// ==================== DASHBOARD STATS ====================
export interface DashboardStats {
    total_cleanings: number
    pending_cleanings: number
    in_progress_cleanings: number
    completed_cleanings: number
    cancelled_cleanings: number
    total_clients: number
    total_cleaners: number
}

// ==================== HELPERS DE TIPOS ====================
// Para cuando necesites un tipo parcial
export type PartialCleaning = Partial<Cleaning>

// Para cuando necesites solo ciertos campos
export type CleaningListItem = Pick<Cleaning,
    'id' | 'address' | 'scheduled_date' | 'status' | 'current_step' | 'total_steps'
>