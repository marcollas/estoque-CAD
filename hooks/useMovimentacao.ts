import { useState } from "react";
import { MovimentacaoServices } from "@/services/movimentacaoServices";
import { MovimentcaoType } from "@/types/movimentacaoType";
import { useError } from "@/contexts/ErrorContext";

export const useMovimentacao = (initialMovimentacao: MovimentcaoType[] = []) => {
    const [movimentacao, setMovimentacao] = useState<MovimentcaoType[]>(initialMovimentacao)
    const [loading, setLoading] = useState(false);
    const {addError} = useError()
    
    const listarMovimentacao = async () => {
        setLoading(true)
        try{
            const data = await MovimentacaoServices.listarMovimentacoes()
            setMovimentacao(data)

        }catch(err){
            addError(err instanceof Error ? err.message : "Erro ao carregar Movimentacao")
            throw err
        }finally{
            setLoading(false)
        }
    }

    return {
        movimentacao,
        loading,
        listarMovimentacao
    }
}