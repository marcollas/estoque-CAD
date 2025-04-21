import apiClient from './api/apiCllient'
import type { ProdutoMaisMovimentadoType, ProdutosPorRequisitanteType } from '@/types/RelatorioType'

export const RelatorioServices = {
    async produtoMaisMovimentado(): Promise<ProdutoMaisMovimentadoType[]> {
        const response = await apiClient.get('/relatorios/buscarProdutosMaisMovimentados')
        return response.data
    },

    async produtosPorRequisitante(): Promise<ProdutosPorRequisitanteType[]> {
        const response = await apiClient.get('/relatorios/buscarRequisitantesComMaisProdutos')
        return response.data
    },

    async buscarQtdMov(tipo: string, status: string): Promise<number> {
        if(tipo != "E" && tipo != "S"){
            tipo = "S"
        }
        if(status != "F" && status != "C"){
            status = "F"
        }

        const response = await apiClient.get('/relatorios/buscarQtdMov', {
            params: {
                tipo: tipo,
                status: status
              }
        })
        return response.data
    },

    async buscarQtdProdutosAtivos(): Promise<number> {
        const response = await apiClient.get('/relatorios/buscarQtdProdutosAtivos')
        return response.data
    },

    async buscarProdutosAbaixoMin(): Promise<number> {
        const response = await apiClient.get('/relatorios/buscarProdutosAbaixoMin')
        return response.data
    }

}