import apiClient from "./api/apiCllient";
import type { UnidadeType } from "@/types/unidadeType";


export const UnidadeServices = {
    async listarTodos(): Promise<UnidadeType[]> {
        const response = await apiClient.get('/unidadeProduto/')
        return response.data
            
    },

    async criar(dados: UnidadeType): Promise<UnidadeType>{
        const response = await apiClient.post('/unidadeProduto/', dados)
        return response.data
    },

    async atualizar(id: number, dados: UnidadeType): Promise<UnidadeType>{
        const response = await apiClient.put(`/unidadeProduto/${id}`, dados)
        return response.data
    },

    async inativar(id: number): Promise<void>{
        const response = await apiClient.put(`/unidadeProduto/inativar/${id}`)
        return response.data
    }
}