import apiClient from './api/apiCllient'
import type { RequisitanteType } from '@/types/requisitanteType';

//Essa função formata os dados provenientes da API para envio ao backEnd
const formatarDadosApi = (formData: RequisitanteType) =>{
    return {
        reqNome: formData.reqNome,
        facRequisitante:{
            facId:formData.reqFaqId,
            facNome: formData.reqFacNome,
            facSigla: formData.reqFacSigla
        }
    };
}

export const RequisitanteServices = {
    async listarTodos(): Promise<RequisitanteType[]> {
        try {
            const response = await apiClient.get('/requisitante/')
            return response.data
            
        } catch (error) {
            console.log(error)
            throw new Error("ocorreu um erro ao listar requisitantes")
        }
    },

    async criar(dados: RequisitanteType): Promise<RequisitanteType>{
        try {
            const response = await apiClient.post('/requisitante/', formatarDadosApi(dados))
            return response.data
        } catch (error) {
            console.log(error)
            throw new Error("ocorreu um erro ao cadastrar requisitantes")
        }
    },

    async atualizar(id: number, dados: RequisitanteType): Promise<RequisitanteType>{
        
        try {
            const response = await apiClient.put(`/requisitante/${id}`, formatarDadosApi(dados))
            console.log(dados)
            console.log(response.data)
            return response.data
        } catch (error) {
            console.log(error)
            throw new Error("ocorreu um erro ao atualizar requisitantes")
        }
    },

    async inativar(id: number): Promise<void>{
        try {
            const response = await apiClient.put(`/requisitante/inativar/${id}`)
            return response.data
        } catch (error) {
            console.log(error)
            throw new Error("ocorreu um erro ao inativar requisitantes")
        }
    }
}