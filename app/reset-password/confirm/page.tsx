import {Suspense} from "react";
import {ResetPasswordForm} from "@/components/reset-pasword/ResetPasswordForm";

export default function ResetPasswordConfirmPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-cyan-100 flex items-center justify-center py-12 px-4">
            <Suspense fallback={<div className="text-cyan-400 font-semibold">Cargando...</div>}>
                <ResetPasswordForm />
            </Suspense>
        </div>
    )
}