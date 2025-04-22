//Aqui ficarão todos os métodos services da tela inicial Dashboard

import { AlterarSenhaType } from "@/types/usuarioype";
import apiClient from "./api/apiCllient";


export const HomeServices = {
    async inativar(id: number): Promise<void>{
        const response = await apiClient.put(`/unidadeProduto/inativar/${id}`)
        return response.data
    }
}