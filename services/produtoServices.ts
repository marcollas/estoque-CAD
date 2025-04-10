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
        const response = await apiClient.get('/produto/')
        return response.data
    },

    async criar(dados: FormProdutoType): Promise<ProdutoType>{
        const response = await apiClient.post('/produto/', formatarDadosApi(dados))
        return response.data
       
    },

    async atualizar(id: number, dados: FormProdutoType): Promise<ProdutoType>{
        const response = await apiClient.put(`/produto/${id}`, formatarDadosApi(dados))
        return response.data
       
    },

    async inativar(id: number): Promise<void>{
        const response = await apiClient.put(`/produto/inativar/${id}`)
        return response.data
       
    }
}