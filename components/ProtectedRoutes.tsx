'use client'

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/UsuarioContext"
import { useError } from "@/contexts/NotificationContext"
import Loading from "./Loading"

interface ProtectedRoutesProps {
    children: React.ReactNode
}

export default function ProtectedRoute({children}: ProtectedRoutesProps){
    const erro = useError()
    const {loading, isAutenticado} = useAuth()
    const router = useRouter()

    useEffect(() => {
        if(!loading && !isAutenticado){
            erro.addNotification("Token inválido ou expirado")
            erro.addNotification("Faça login novamente")
            router.push("/")
        }
    }, [loading, isAutenticado, router])

    if(loading || !isAutenticado){
        return <Loading/>
    }
    return <>{children} </>
}