"use client"

import type React from "react"

import { useState } from "react"
import { User, Lock, LogIn } from "lucide-react"
import { useRouter } from "next/navigation"
import { url, port} from '../configApi.json'
import axios from "axios"

export default function LoginPage() {
  const [matricula, setMatricula] = useState("")
  const [senha, setSenha] = useState("")
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try{
      const response = await axios.post(`${url}:${port}/login`, 
        {
          usuLogin:matricula,
          usuSenha:senha
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true})

      if(response.status == 200){
        let key = "Authorization"
        let token = response.headers.authorization

        window.localStorage.setItem(key, token)
        router.push("/dashboard")
      }else{
        alert("Erro de autenticação")
      }
      
    }catch(error){
      alert("Erro de autenticação")
      console.log("errorrrrr" + error)
    }
  }

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

