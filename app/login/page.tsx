// app/login/page.js
import LoginForm from '@/components/auth/LoginForm'
import {Suspense} from "react";
import {Metadata} from "next";
import Header from "@/components/layout/Header";

export const metadata: Metadata= {
    title: 'Iniciar Sesión - Cleaner Club',
    description: 'Accede a tu cuenta de Cleaner Club'
}

export default function LoginPage() {
    return (
        <><Header>

        </Header>
            <div
                className="min-h-screen bg-gradient-to-br from-ocean-50 to-ocean-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <Suspense>
                    <LoginForm/>
                </Suspense>
            </div>
        </>
    )
}