import { RequisitanteType } from "@/types/requisitanteType";
import apiClient from "./api/apiCllient";
import { FormMovimentacaoType, MovimentacaoType, ProdutosMovType } from "@/types/movimentacaoType";

const formatarDadosApi = (formData: FormMovimentacaoType) =>{
    return {
        movOrigem: formData.movOrigem,
        movTipo: formData.movTipo,
        movRequisitante: {
            reqId: formData.movRequisitante?.reqId
        },
        produtosMov: formData.produtosMov?.map(produtoMov => ({
            proMovQtdProduto: produtoMov.qtdProduto,
            proMovProduto: {
                proId: produtoMov.produto.proId
            }
        }))
    };
}

export const MovimentacaoServices = {
    async listarMovimentacoes(tipo: string, status: string): Promise<MovimentacaoType[]> {
        const response = await apiClient.get('/movimentacao/', {
            params: {
                matricula: tipo,
                senha: status
              }
        })
        console.log(response.data)
        return response.data
    },

    async criar(dados: FormMovimentacaoType): Promise<MovimentacaoType>{
        console.log(dados.produtosMov)
        const response = await apiClient.post('/movimentacao/', formatarDadosApi(dados))
        return response.data
    },
}