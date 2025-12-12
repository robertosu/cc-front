// app/dashboard/admin/users/page.tsx
import { requireProfile } from '@/utils/supabase/cached-queries'
import { Briefcase, Shield, Users as UsersIcon } from 'lucide-react'
import UsersTable from '@/components/admin/UsersTable'
import { Metadata } from "next"

export const metadata: Metadata = {
    title: 'Gestión de Usuarios - Admin',
    description: 'Administrar usuarios y roles'
}

type Props = {
    searchParams: Promise<{
        page?: string
        search?: string
        role?: string
        sortBy?: string
        sortOrder?: string
    }>
}

export default async function AdminUsersPage({ searchParams }: Props) {
    // 1. Verificación de Seguridad y Cliente Supabase
    const { supabase } = await requireProfile(['admin'])

    // 2. Obtener parámetros de URL
    const params = await searchParams
    const page = parseInt(params.page || '1')
    const pageSize = 10
    const search = params.search || ''
    const role = params.role || ''
    const sortBy = params.sortBy || 'created_at'
    const sortOrder = (params.sortOrder || 'desc') as 'asc' | 'desc'

    // 3. Query Principal (Perfiles)
    let query = supabase
        .from('profiles')
        .select('*', { count: 'exact' })

    // Filtros
    if (search) {
        query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`)
    }
    if (role) {
        query = query.eq('role', role)
    }

    // Ordenamiento
    query = query.order(sortBy, { ascending: sortOrder === 'asc' })

    // Paginación
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1
    query = query.range(from, to)

    // Ejecutar Query
    const { data: profiles, count, error } = await query

    if (error) {
        console.error('Error fetching users:', error)
    }

    const totalPages = count ? Math.ceil(count / pageSize) : 0

    // 4. Enriquecer los usuarios con estadísticas (SOLO para la página actual)
    // Esto es mucho más eficiente que fetchear todos los contadores de todos los usuarios
    let usersWithStats = []
    if (profiles) {
        usersWithStats = await Promise.all(profiles.map(async (profile) => {
            // Fetch paralelo de contadores para este usuario
            const [clientCleanings, cleanerCleanings] = await Promise.all([
                supabase.from('cleanings').select('id', { count: 'exact', head: true }).eq('client_id', profile.id),
                supabase.from('cleaning_cleaners').select('cleaning_id', { count: 'exact', head: true }).eq('cleaner_id', profile.id)
            ])

            return {
                ...profile,
                client_cleanings_count: clientCleanings.count || 0,
                cleaner_cleanings_count: cleanerCleanings.count || 0
            }
        }))
    }

    // 5. Estadísticas Globales Rápidas (Counts independientes)
    // Usamos count: 'exact', head: true para que sea un COUNT(*) ligero sin data
    const [
        { count: clientTotal },
        { count: cleanerTotal },
        { count: adminTotal }
    ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'client'),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'cleaner'),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'admin')
    ])

    return (
        <div className="px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Gestión de Usuarios</h1>
                <p className="mt-2 text-sm text-gray-700">
                    Administra roles, permisos y consulta estadísticas
                </p>
            </div>

            {/* Estadísticas Cards */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-8">
                <StatCard
                    title="Clientes"
                    value={clientTotal || 0}
                    icon={<UsersIcon className="h-6 w-6 text-white" />}
                    color="bg-green-500"
                />
                <StatCard
                    title="Cleaners"
                    value={cleanerTotal || 0}
                    icon={<Briefcase className="h-6 w-6 text-white" />}
                    color="bg-ocean-500"
                />
                <StatCard
                    title="Administradores"
                    value={adminTotal || 0}
                    icon={<Shield className="h-6 w-6 text-white" />}
                    color="bg-purple-500"
                />
            </div>

            {/* Componente Tabla Interactivo */}
            <UsersTable
                users={usersWithStats}
                currentPage={page}
                totalPages={totalPages}
                totalCount={count || 0}
            />
        </div>
    )
}

function StatCard({ title, value, icon, color }: { title: string, value: number, icon: React.ReactNode, color: string }) {
    return (
        <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
                <div className="flex items-center">
                    <div className="flex-shrink-0">
                        <div className={`rounded-md ${color} p-3`}>
                            {icon}
                        </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                        <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
                            <dd className="text-2xl font-semibold text-gray-900">{value}</dd>
                        </dl>
                    </div>
                </div>
            </div>
        </div>
    )
}