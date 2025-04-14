import apiClient from "./api/apiCllient";
import { MovimentcaoType } from "@/types/movimentacaoType";

export const MovimentacaoServices = {
    async listarMovimentacoes(): Promise<MovimentcaoType[]> {
        const response = await apiClient.get('/movimentacao/')
        return response.data
    }
}