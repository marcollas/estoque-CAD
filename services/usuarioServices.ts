import apiClient from "./api/apiCllient";
import type { UsuarioType } from "@/types/usuarioype";


export const UsuarioServices = {
    async listarTodos(): Promise<UsuarioType[]> {
        try {
            const response = await apiClient.get('/usuario/')
            return response.data
            
        } catch (error) {
            console.log(error)
            throw new Error("ocorreu um erro ao listar usuarios")
        }
    },

    async criar(dados: UsuarioType): Promise<UsuarioType>{
        if(dados.usuPerfil == "ADMIN"){
            dados.usuPerfil = 0
        }else{
            dados.usuPerfil = 1
        }
        try {
            const response = await apiClient.post('/usuario/', dados)
            return response.data
        } catch (error) {
            console.log(error)
            throw new Error("ocorreu um erro ao cadastrar usuario")
        }
    },

    async atualizar(id: number, dados: UsuarioType): Promise<UsuarioType>{
        if(dados.usuPerfil == "ADMIN"){
            dados.usuPerfil = 0
        }else{
            dados.usuPerfil = 1
        }
        try {
            const response = await apiClient.put(`/usuario/${id}`, dados)
            return response.data
        } catch (error) {
            console.log(error)
            throw new Error("ocorreu um erro ao atualizar usuario")
        }
    },

    async inativar(id: number): Promise<void>{
        try {
            const response = await apiClient.put(`/usuario/inativar/${id}`)
            return response.data
        } catch (error) {
            console.log(error)
            throw new Error("ocorreu um erro ao inativar usuario")
        }
    }
}