import apiClient from "./api/apiCllient"

export interface LoginRequest {
  usuLogin: string
  usuSenha: string
}

export interface LoginResponse {
  token: string
}

export const AuthService = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
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
  },
}
