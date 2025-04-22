import { useState } from "react";
import { MovimentacaoServices } from "@/services/movimentacaoServices";
import { MovimentacaoType, ProdutosMovType, FormMovimentacaoType } from "@/types/movimentacaoType";
import { useError } from "@/contexts/NotificationContext";

export const useMovimentacao = (initialMovimentacao: MovimentacaoType[] = []) => {
    const [movimentacao, setMovimentacao] = useState<MovimentacaoType[]>(initialMovimentacao)
    const [loading, setLoading] = useState(false);
    const {addNotification} = useError()
    const listarMovimentacao = async (tipo: string, status: string) => {
        setLoading(true)
        if(tipo != "E" && tipo != "S"){
            tipo = "S"
        }
        if(status != "F" && status != "C"){
            status = "F"
        }
        try{
            const data = await MovimentacaoServices.listarMovimentacoes(tipo, status)
            setMovimentacao(data)

        }catch(err){
            addNotification(err instanceof Error ? err.message : "Erro ao carregar Movimentacao")
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
            addNotification({mensagem: "Movimentação concluída com sucesso", tipo: "info"})
            return novaMovimentacao;
        } catch (err) {
            addNotification(err instanceof Error ? err.message : 'Erro ao criar produto');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const cancelarMovimentacao = async (id: number) => {
        setLoading(true)
        try {
            await MovimentacaoServices.cancelar(id)
            setMovimentacao(prev => prev.filter(movimentacao => movimentacao.movId !== id))
            addNotification({mensagem: "Movimentação cancelada com sucesso", tipo: "info"})
        } catch (err) {
            addNotification(err instanceof Error ? err.message : "Erro ao cancelar movimentação")
            throw err
        }finally{
            setLoading(false)
        }
    }
    return {
        movimentacao,
        loading,
        listarMovimentacao, 
        cadastrarMovimentacao,
        cancelarMovimentacao
    }
}