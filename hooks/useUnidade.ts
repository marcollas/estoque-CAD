import { useState } from "react";
import { UnidadeServices } from "@/services/unidadeServices";
import type { UnidadeType } from "@/types/unidadeType";
import { useError } from "@/contexts/NotificationContext";

export const useUnidades = (initialUnidades: UnidadeType[] = []) => {
    const [unidades, setUnidades] = useState<UnidadeType[]>(initialUnidades)
    const [loading, setLoading] = useState(false);
    const {addNotification} = useError()
    
    const listarUnidades = async () => {
        setLoading(true)
        try{
            const data = await UnidadeServices.listarTodos()
            setUnidades(data)
        }catch(err){
            addNotification(err instanceof Error ? err.message : "Erro ao carregar unidades")
            throw err
        }finally{
            setLoading(false)
        }
    }

    const criarUnidade = async (dados: UnidadeType) => {
        setLoading(true)
        try {
            const novaUnidade = await UnidadeServices.criar(dados)
            setUnidades(prev => [...prev, novaUnidade]); //Insiro no array de unidades
            addNotification({mensagem: "Unidade cadastrada com sucesso", tipo: "info"})
            return novaUnidade
        } catch (err) {
            addNotification(err instanceof Error ? err.message : "Erro ao criar unidades")
            throw err
        }finally{
            setLoading(false)
        }
    }

    const atualizarUnidade = async(id: number, dados: UnidadeType) => {
        setLoading(true)
        try {
            const unidadeAtualizada = await UnidadeServices.atualizar(id, dados)
                setUnidades(prev => prev.map(unidade => unidade.unId === id ? {
                    ...unidade, //Copio os dados originais
                    ...unidadeAtualizada //Sobrescrevo com o dado atualizado
                } : unidade
            ))
            addNotification({mensagem: "Unidade atualizada com sucesso", tipo: "info"})
            return unidadeAtualizada
        } catch (err) {
            addNotification(err instanceof Error ? err.message : "Erro ao atualizar unidade")
            throw err
        }finally{
            setLoading(false)
        }
    }

    const inativarUnidade = async (id: number) => {
        setLoading(true)
        try {
            await UnidadeServices.inativar(id)
            setUnidades(prev => prev.filter(unidade => unidade.unId !== id))
            addNotification({mensagem: "Unidade inativada com sucesso", tipo: "info"})
        } catch (err) {
            addNotification(err instanceof Error ? err.message : "Erro ao atualizar unidade")
            throw err
        }finally{
            setLoading(false)
        }
    }

    return {
        unidades,
        loading,
        listarUnidades,
        criarUnidade,
        atualizarUnidade,
        inativarUnidade
    }
}