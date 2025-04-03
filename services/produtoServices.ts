import apiClient from './api/apiCllient'
import type { Produto, FormProduto } from '@/types/produtoType'

//Essa função formata os dados provenientes da API para envio ao backEnd
const formatarDadosApi = (formData: FormProduto) =>{
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
    async listarTodos(): Promise<Produto[]> {
        try {
            const response = await apiClient.get('/produto/')
            return response.data
            
        } catch (error) {
            console.log(error)
            throw new Error("ocorreu um erro ao listar produtos")
        }
    },

    async criar(dados: FormProduto): Promise<Produto>{
        try {
            const response = await apiClient.post('/produto/', formatarDadosApi(dados))
            return response.data
        } catch (error) {
            console.log(error)
            throw new Error("ocorreu um erro ao cadastrar produtos")
        }
    },

    async atualizar(id: number, dados: FormProduto): Promise<Produto>{
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
            const response = await apiClient.put(`/produto/${id}`)
            return response.data
        } catch (error) {
            console.log(error)
            throw new Error("ocorreu um erro ao inativar produtos")
        }
    }
}