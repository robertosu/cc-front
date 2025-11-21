// app/login/page.js
import LoginForm from '@/components/auth/LoginForm'
import {Suspense} from "react";
import {Metadata} from "next";

export const metadata: Metadata= {
    title: 'Iniciar Sesión - CleanerClub',
    description: 'Accede a tu cuenta de CleanerClub'
}

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <Suspense>
                <LoginForm />
            </Suspense>
        </div>
    )
}