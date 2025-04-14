"use client"

import React, {createContext, useContext, useEffect, useState} from "react";
import { UsuarioType } from "@/types/usuarioype";
import { useError } from "./ErrorContext";
import axios from "axios";
import { useRouter } from "next/navigation"
import { AuthService } from "@/services/authServices";


interface AuthContextType{
  usuario: UsuarioType | null
  token: string | null
  logout: () => void
  login: (token: string) => void
  isAutenticado: boolean
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const router = useRouter()
  const [usuario, setUsuario] = useState<UsuarioType | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAutenticado, setIsAutenticado] = useState(false)

  //Verifico se há token ao carregar o app
  useEffect(() => {
    const autenticacaoInicial = async () => {
      const tokenGuardado = localStorage.getItem('Authorization')
      if (tokenGuardado) {
        try {
          await buscarUsuarioToken(tokenGuardado);
        } catch (error) {
          logout();
        }
      }
      setLoading(false);
    };

    autenticacaoInicial()
  }, [])

  // É preciso refatorar essa parte depois pois ele loga, desloga e loga novamente.
  const login = async (token: string) => {
    setLoading(true)
    setIsAutenticado(false)
    try {
      const usuario = await AuthService.validarToken(token)
      setUsuario(usuario)
      setIsAutenticado(true)
      setToken(token)
    } catch (error) {
      logout()
    } finally {
      setLoading(false)
    }
  };

  const buscarUsuarioToken = async (token: string) => {
    try {
      const usuario = await AuthService.validarToken(token)
      setUsuario(usuario)
      setIsAutenticado(true)
      setToken(token)
    } catch (error) {
      logout()
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    console.log("Logout")
    setIsAutenticado(false)
    setUsuario(null);
    setToken(null);
    setLoading(false)
    localStorage.removeItem('Authorization');
    router.push("/")
  };

  return(
    <AuthContext.Provider value={{usuario, token, logout, isAutenticado, login, loading}}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if(context === undefined){
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }  
  return context
}
