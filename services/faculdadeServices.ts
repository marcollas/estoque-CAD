import apiClient from "./api/apiCllient";
import type { FaculdadeType } from "@/types/faculdadeType";


export const FaculdadeServices = {
    async listarTodas(): Promise<FaculdadeType[]> {
        try {
            const response = await apiClient.get('/faculdade/')
            return response.data
        } catch (error) {
            console.log(error)
            throw new Error("ocorreu um erro ao listar categorias")
        }
    },

    async criar(dados: FaculdadeType): Promise<FaculdadeType>{
        try {
            const response = await apiClient.post('/faculdade/', dados)
            return response.data
        } catch (error) {
            console.log(error)
            throw new Error("ocorreu um erro ao cadastrar categoria")
        }
    },

    async atualizar(id: number, dados: FaculdadeType): Promise<FaculdadeType>{
        try {
            const response = await apiClient.put(`/faculdade/${id}`, dados)
            return response.data
        } catch (error) {
            console.log(error)
            throw new Error("ocorreu um erro ao atualizar categoria")
        }
    },

    async inativar(id: number): Promise<void>{
        try {
            const response = await apiClient.put(`/faculdade/inativar/${id}`)
            return response.data
        } catch (error) {
            console.log(error)
            throw new Error("ocorreu um erro ao inativar categoria")
        }
    }
}