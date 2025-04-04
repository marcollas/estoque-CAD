import apiClient from './api/apiCllient'
import type { ProdutoType, FormProdutoType } from '@/types/produtoType'

//Essa função formata os dados provenientes da API para envio ao backEnd
const formatarDadosApi = (formData: FormProdutoType) =>{
    return {
        proNome: formData.proNome,
        proSipac: formData.proSipac,
        proQtd: formData.proQtd,
        proDescricao: formData.proDescricao || '',
        proEstoqueMin: formData.proEstoqueMin,
        proCategoria: {
            catProId: formData.proCategoriaId || null
        },
        proUn: {
            unId: formData.proUnId
        }
    };
}

export const ProdutoServices = {
    async listarTodos(): Promise<ProdutoType[]> {
        try {
            const response = await apiClient.get('/produto/')
            return response.data
            
        } catch (error) {
            console.log(error)
            throw new Error("ocorreu um erro ao listar produtos")
        }
    },

    async criar(dados: FormProdutoType): Promise<ProdutoType>{
        try {
            const response = await apiClient.post('/produto/', formatarDadosApi(dados))
            return response.data
        } catch (error) {
            console.log(error)
            throw new Error("ocorreu um erro ao cadastrar produtos")
        }
    },

    async atualizar(id: number, dados: FormProdutoType): Promise<ProdutoType>{
        try {
            const response = await apiClient.put(`/produto/${id}`, formatarDadosApi(dados))
            return response.data
        } catch (error) {
            console.log(error)
            throw new Error("ocorreu um erro ao atualizar produtos")
        }
    },

    async inativar(id: number): Promise<void>{
        try {
            const response = await apiClient.put(`/produto/inativar/${id}`)
            console.log(response)
            return response.data
        } catch (error) {
            console.log(error)
            throw new Error("ocorreu um erro ao inativar produtos")
        }
    }
}