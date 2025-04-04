import apiClient from "./api/apiCllient";
import type { CategoriaType } from "@/types/categoriaType"; 


export const CategoriaServices = {
    async listarTodas(): Promise<CategoriaType[]> {
        try {
            const response = await apiClient.get('/categoriaProduto/')
            return response.data
        } catch (error) {
            console.log(error)
            throw new Error("ocorreu um erro ao listar categorias")
        }
    },

    async criar(dados: CategoriaType): Promise<CategoriaType>{
        try {
            const response = await apiClient.post('/categoriaProduto/', dados)
            return response.data
        } catch (error) {
            console.log(error)
            throw new Error("ocorreu um erro ao cadastrar categoria")
        }
    },

    async atualizar(id: number, dados: CategoriaType): Promise<CategoriaType>{
        try {
            const response = await apiClient.put(`/categoriaProduto/${id}`, dados)
            return response.data
        } catch (error) {
            console.log(error)
            throw new Error("ocorreu um erro ao atualizar categoria")
        }
    },

    async inativar(id: number): Promise<void>{
        try {
            const response = await apiClient.put(`/categoriaProduto/inativar/${id}`)
            console.log(response)
            return response.data
        } catch (error) {
            console.log(error)
            throw new Error("ocorreu um erro ao inativar categoria")
        }
    }
}