import apiClient from "./api/apiCllient";
import type { CategoriaType } from "@/types/categoriaType"; 


export const CategoriaServices = {
    async listarTodas(status: boolean): Promise<CategoriaType[]> {
        
        const response = await apiClient.get('/categoriaProduto/', {
            params: {
                status: status
            }
        })
        return response.data
    },

    async criar(dados: CategoriaType): Promise<CategoriaType>{
        const response = await apiClient.post('/categoriaProduto/', dados)
        return response.data
    
    },

    async atualizar(id: number, dados: CategoriaType): Promise<CategoriaType>{
        const response = await apiClient.put(`/categoriaProduto/${id}`, dados)
        return response.data
    },

    async inativar(id: number): Promise<void>{
        const response = await apiClient.put(`/categoriaProduto/inativar/${id}`)
        return response.data
    }
}