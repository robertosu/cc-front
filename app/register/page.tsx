// app/register/page.js
import RegisterForm from '@/components/auth/RegisterForm'
import {Suspense} from "react";
import {Metadata} from "next";

export const metadata: Metadata = {
    title: 'Registro - CleanerClub',
    description: 'Crea tu cuenta en CleanerClub'
}

export default function RegisterPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-cyan-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <Suspense>
                <RegisterForm />
            </Suspense>
        </div>
    )
}