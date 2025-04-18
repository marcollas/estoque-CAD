"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/UsuarioContext"
import { User, Lock, Mail } from "lucide-react"
import { useRouter } from "next/navigation"
import { AuthService } from "@/services/authServices"
import { useError } from "@/contexts/NotificationContext"
import Loading from "@/components/Loading"
import '../styles/login.css'
export default function LoginPage() {
  const erro = useError()
  const {loading, isAutenticado, login} = useAuth()
  const [loadLogin, setLoadLogin] = useState(true)
  const [emailInstitucional, setEmailInstitucional] = useState("")
  const [senha, setSenha] = useState("")
  const [isActive, setIsActive] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (isAutenticado) {
        router.push("/dashboard")
      } else {
        setLoadLogin(false)
      }
    }
  }, [loading, isAutenticado, router])
  

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoadLogin(true)
  
    try {
      const { token } = await AuthService.login({
        usuLogin: emailInstitucional,
        usuSenha: senha,
      })
  
      localStorage.setItem("Authorization", token)
      
      login(token) //Essa parte é de extrema importância pois é onde inicia o contexto da aplicação
      router.push("/dashboard")
    } catch (error) {
      const erroMsg = error instanceof Error ? error.message : "Erro ao autenticar"
      alert(erroMsg)
      erro.addNotification(erroMsg)
      setEmailInstitucional("")
      setSenha("")
    }finally{
      setLoadLogin(false)
    }
  }


  if(loading || loadLogin){
      return <Loading/>
  }
  return (
    <div className="login-page min-h-screen flex items-center justify-center">
      <div className="container">
          <div className={`form-box login ${isActive ? 'active' : ''}`}>
              <form onSubmit={handleLogin}>
                  <h1>Login</h1>
                  <div className="input-box relative">
                    <input
                      type="text"
                      className="w-full pl-10 py-2 bg-gray-800 text-white rounded-md"
                      placeholder="Email institucional"
                      value={emailInstitucional}
                      onChange={(e) => setEmailInstitucional(e.target.value)}
                      required
                    />
                    <Mail className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  </div>
                  <div className="input-box relative">
                    <input
                      type="password"
                      className="w-full pl-10 py-2 bg-gray-800 text-white rounded-md"
                      placeholder="Senha"
                      value={senha}
                      onChange={(e) => setSenha(e.target.value)}
                      required
                    />
                    <Lock className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  </div>
                  {/* <div className="forgot-link">
                    <button onClick={() => setIsActive(true)}>Esqueceu sua senha?</button>
                  </div> */}
                  <button type="submit" className="btn">Login</button>
                  {/* <p>or login with social platforms</p>
                  <div className="social-icons">
                      <a href="#"><i className='bx bxl-google' ></i></a>
                      <a href="#"><i className='bx bxl-facebook' ></i></a>
                      <a href="#"><i className='bx bxl-github' ></i></a>
                      <a href="#"><i className='bx bxl-linkedin' ></i></a>
                  </div> */}
              </form>
          </div>

          <div className="form-box register">
          <form action="#">
                  <h1>Registration</h1>
                  <div className="input-box">
                      {/* <input type="text" placeholder="Username" required> */}
                      <i className='bx bxs-user'></i>
                  </div>
                  <div className="input-box">
                      {/* <input type="email" placeholder="Email" required> */}
                      <i className='bx bxs-envelope' ></i>
                  </div>
                  <div className="input-box">
                      {/* <input type="password" placeholder="Password" required> */}
                      <i className='bx bxs-lock-alt' ></i>
                  </div>
                  <button type="submit" className="btn">Register</button>
                  <p>or register with social platforms</p>
                  <div className="social-icons">
                      <a href="#"><i className='bx bxl-google' ></i></a>
                      <a href="#"><i className='bx bxl-facebook' ></i></a>
                      <a href="#"><i className='bx bxl-github' ></i></a>
                      <a href="#"><i className='bx bxl-linkedin' ></i></a>
                  </div>
              </form>
          </div>

          <div className="toggle-box">
              <div className="toggle-panel toggle-left">
                <img 
                  src="/assets/logo.png"
                  alt="Logo IGE" 
                  className="w-80 h-40 mb-8 object-contain"
                />
                <h1 className="mt-4">Olá, Bem vindo!</h1>
                <p className="align-text-center">Sistema de gerenciamento de estoque do IGE</p> 
              </div>

              <div className="toggle-panel toggle-right">
                  <h1>Welcome Back!</h1>
                  <p>Already have an account?</p>
                  <button className="btn login-btn">Login</button>
              </div>
          </div>
      </div>
    </div>
  )
}

