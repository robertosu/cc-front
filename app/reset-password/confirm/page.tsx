import {Suspense} from "react";
import {ResetPasswordForm} from "@/components/reset-pasword/ResetPasswordForm";

export default function ResetPasswordConfirmPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-teal-50 to-teal-100 flex items-center justify-center py-12 px-4">
            <Suspense fallback={<div className="text-teal-400 font-semibold">Cargando...</div>}>
                <ResetPasswordForm />
            </Suspense>
        </div>
    )
}