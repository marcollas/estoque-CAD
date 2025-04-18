import apiClient from "./api/apiCllient";
import type { AlterarSenhaType, UsuarioType } from "@/types/usuarioype";


export const UsuarioServices = {
    async listarTodos(): Promise<UsuarioType[]> {
        const response = await apiClient.get('/usuario/')
        return response.data
    },

    async criar(dados: UsuarioType): Promise<UsuarioType>{
        if(dados.usuPerfil == "ADMIN"){
            dados.usuPerfil = 0
        }else{
            dados.usuPerfil = 1
        }
        const response = await apiClient.post('/usuario/', dados)
        return response.data
    },

    async atualizar(id: number, dados: UsuarioType): Promise<UsuarioType>{
        if(dados.usuPerfil == "ADMIN"){
            dados.usuPerfil = 0
        }else{
            dados.usuPerfil = 1
        }
        const response = await apiClient.put(`/usuario/${id}`, dados)
        return response.data
    },

    async alterarSenhaUsuario(id: number, dados: AlterarSenhaType): Promise<void>{
        const response = await apiClient.put(`/usuario/alterarSenha/${id}`, dados)
        return response.data
    },

    async resetarSenhaDeUsuario(id: number): Promise<void>{
        const response = await apiClient.put(`/usuario/resetarSenha/${id}`)
        return response.data
    },


    async inativar(id: number): Promise<void>{
        const response = await apiClient.put(`/usuario/inativar/${id}`)
        return response.data
    }
}