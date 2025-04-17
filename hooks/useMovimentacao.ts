import { useState } from "react";
import { MovimentacaoServices } from "@/services/movimentacaoServices";
import { MovimentacaoType, ProdutosMovType, FormMovimentacaoType } from "@/types/movimentacaoType";
import { useError } from "@/contexts/ErrorContext";

export const useMovimentacao = (initialMovimentacao: MovimentacaoType[] = []) => {
    const [movimentacao, setMovimentacao] = useState<MovimentacaoType[]>(initialMovimentacao)
    const [loading, setLoading] = useState(false);
    const {addError} = useError()
        const listarMovimentacao = async (tipo: string, status: string) => {
        setLoading(true)
        if(tipo != "E" || "S"){
            tipo = ""
        }
        if(status != "F" || "C"){
            tipo = ""
        }
        try{
            const data = await MovimentacaoServices.listarMovimentacoes(tipo, status)
            setMovimentacao(data)

        }catch(err){
            addError(err instanceof Error ? err.message : "Erro ao carregar Movimentacao")
            throw err
        }finally{
            setLoading(false)
        }
    }

    // Criar novo produto
    const cadastrarMovimentacao = async (dados: FormMovimentacaoType) => {

        setLoading(true);
        try {
            const novaMovimentacao = await MovimentacaoServices.criar(dados);
            setMovimentacao(prev => [...prev, novaMovimentacao]);
            return novaMovimentacao;
        } catch (err) {
            addError(err instanceof Error ? err.message : 'Erro ao criar produto');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        movimentacao,
        loading,
        listarMovimentacao, 
        cadastrarMovimentacao
    }
}