import {Suspense} from "react";
import ResetPasswordForm from "@/app/reset-password/page";

export default function ResetPasswordConfirmPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center py-12 px-4">
            <Suspense fallback={<div className="text-blue-600 font-semibold">Cargando...</div>}>
                <ResetPasswordForm />
            </Suspense>
        </div>
    )
}