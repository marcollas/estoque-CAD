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
        const response = await apiClient.get('/requisitante/')
        return response.data
            
    },

    async criar(dados: RequisitanteType): Promise<RequisitanteType>{
        const response = await apiClient.post('/requisitante/', formatarDadosApi(dados))
        return response.data
        
    },

    async atualizar(id: number, dados: RequisitanteType): Promise<RequisitanteType>{
        const response = await apiClient.put(`/requisitante/${id}`, formatarDadosApi(dados))
        return response.data
    },

    async inativar(id: number): Promise<void>{
        const response = await apiClient.put(`/requisitante/inativar/${id}`)
        return response.data
    }
}