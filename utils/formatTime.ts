// utils/formatTime.ts

/**
 * Formatea una hora eliminando los segundos
 * Ejemplos:
 * - "09:00:00" -> "09:00"
 * - "14:30:45" -> "14:30"
 * - "09:00" -> "09:00" (ya está bien)
 */
export function formatTime(time: string): string {
    if (!time) return ''

    // Si ya tiene el formato correcto (HH:MM), devolver tal cual
    if (time.length === 5 && time.includes(':')) {
        return time
    }

    // Si tiene segundos (HH:MM:SS), removerlos
    const parts = time.split(':')
    if (parts.length >= 2) {
        return `${parts[0]}:${parts[1]}`
    }

    return time
}

/**
 * Formatea una fecha y hora completa
 */
export function formatDateTime(dateTime: string): string {
    try {
        const date = new Date(dateTime)
        const hours = date.getHours().toString().padStart(2, '0')
        const minutes = date.getMinutes().toString().padStart(2, '0')
        return `${hours}:${minutes}`
    } catch {
        return ''
    }
}