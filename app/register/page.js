// app/register/page.js
import RegisterForm from '@/components/auth/RegisterForm'

export const metadata = {
    title: 'Registro - CleanerClub',
    description: 'Crea tu cuenta en CleanerClub'
}

export default function RegisterPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <RegisterForm />
        </div>
    )
}