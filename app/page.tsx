"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/UsuarioContext"
import { User, Lock, LogIn } from "lucide-react"
import { useRouter } from "next/navigation"
import { AuthService } from "@/services/authServices"
import { useError } from "@/contexts/ErrorContext"
export default function LoginPage() {
  const {login} = useAuth()
  const {loading, isAutenticado} = useAuth()
  const [matricula, setMatricula] = useState("")
  const [senha, setSenha] = useState("")
  const router = useRouter()

  useEffect(() => {
    if(isAutenticado){
        router.push("/dashboard")
    }
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
  
    try {
      const { token } = await AuthService.login({
        usuLogin: matricula,
        usuSenha: senha,
      })
  
      localStorage.setItem("Authorization", token)
      login(token) //Essa parte é de extrema importância pois é onde inicia o contexto da aplicação
      router.push("/dashboard")
    } catch (error) {
      const erroMsg = error instanceof Error ? error.message : "Erro ao autenticar"
      alert(erroMsg)
      erro.addError(erroMsg)
    }
  }

  
  const erro = useError()
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="p-4 border-b">
        <h1 className="text-xl font-medium">Login</h1>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold">Gerenciamento de estoque IGE</h2>
        </div>

        <div className="w-full max-w-md bg-[#8cbfbd] rounded-lg p-6 shadow-md">
          <p className="text-center mb-6">Faça o Login para acessar o sistema</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <User className="h-5 w-5 text-gray-700" />
              </div>
              <input
                type="text"
                className="w-full pl-10 py-2 bg-gray-800 text-white rounded-md"
                placeholder="Matrícula"
                value={matricula}
                onChange={(e) => setMatricula(e.target.value)}
                required
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Lock className="h-5 w-5 text-gray-700" />
              </div>
              <input
                type="password"
                className="w-full pl-10 py-2 bg-gray-800 text-white rounded-md"
                placeholder="Senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
              />
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                className="flex items-center gap-2 bg-[#1e3a8a] text-white px-6 py-2 rounded-md hover:bg-blue-800 transition-colors"
              >
                <LogIn className="h-5 w-5" />
                LOGIN
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}

