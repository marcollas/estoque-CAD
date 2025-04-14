import axios from "axios"
import apiClient from "./api/apiCllient"
import type { AxiosError } from "axios"
import { UsuarioType } from "@/types/usuarioype"

export interface LoginRequest {
  usuLogin: string
  usuSenha: string
}

export interface LoginResponse {
  token: string
}

export const AuthService = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await apiClient.post("/login", credentials, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      })

      const token = response.headers.authorization

      if (!token) {
        throw new Error("Token não fornecido pelo servidor")
      }

      return { token }
    } catch (error) {
      const err = error as AxiosError<any>

      // Tenta extrair mensagem personalizada do backend
      const mensagem = err.response?.data?.message || "Erro ao autenticar"
      throw new Error(mensagem)
    }
  },

  async validarToken(token: string): Promise<UsuarioType>{
    console.log("Opa")
    try {
      const response = await apiClient.post("/auth/validarToken", 
        {},
        {headers: {
          Authorization: `Bearer ${token}`
        }}
      )
      return response.data
    } catch (error) {
      const err = error as AxiosError<any>
      const mensagem = err.response?.data?.message || "Erro ao autenticar"
      throw new Error(mensagem)
    }
  }

  
}
