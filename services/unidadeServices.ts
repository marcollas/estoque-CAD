import apiClient from "./api/apiCllient";
import type { UnidadeType } from "@/types/unidadeType";


export const UnidadeServices = {
    async listarTodos(): Promise<UnidadeType[]> {
        try {
            const response = await apiClient.get('/unidadeProduto/')
            return response.data
            
        } catch (error) {
            console.log(error)
            throw new Error("ocorreu um erro ao listar unidades")
        }
    },

    async criar(dados: UnidadeType): Promise<UnidadeType>{
        try {
            const response = await apiClient.post('/unidadeProduto/', dados)
            return response.data
        } catch (error) {
            console.log(error)
            throw new Error("ocorreu um erro ao cadastrar unidade")
        }
    },

    async atualizar(id: number, dados: UnidadeType): Promise<UnidadeType>{
        try {
            const response = await apiClient.put(`/unidadeProduto/${id}`, dados)
            return response.data
        } catch (error) {
            console.log(error)
            throw new Error("ocorreu um erro ao atualizar unidade")
        }
    },

    async inativar(id: number): Promise<void>{
        try {
            const response = await apiClient.put(`/unidadeProduto/inativar/${id}`)
            return response.data
        } catch (error) {
            console.log(error)
            throw new Error("ocorreu um erro ao inativar unidade")
        }
    }
}