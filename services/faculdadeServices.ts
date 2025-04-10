import apiClient from "./api/apiCllient";
import type { FaculdadeType } from "@/types/faculdadeType";


export const FaculdadeServices = {
    async listarTodas(): Promise<FaculdadeType[]> {
        const response = await apiClient.get('/faculdade/')
        return response.data
        
    },

    async criar(dados: FaculdadeType): Promise<FaculdadeType>{
        
            const response = await apiClient.post('/faculdade/', dados)
            return response.data
    },

    async atualizar(id: number, dados: FaculdadeType): Promise<FaculdadeType>{
        const response = await apiClient.put(`/faculdade/${id}`, dados)
        return response.data
        
    },

    async inativar(id: number): Promise<void>{
        const response = await apiClient.put(`/faculdade/inativar/${id}`)
        return response.data
        
    }
}