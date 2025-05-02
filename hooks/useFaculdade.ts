import { useState } from "react";
import { FaculdadeServices } from "@/services/faculdadeServices";
import { FaculdadeType } from "@/types/faculdadeType";
import { useError } from "@/contexts/NotificationContext";

export const useFaculdade = (initialFaculdade: FaculdadeType[] = []) => {
    const [faculdade, setFaculdade] = useState<FaculdadeType[]>(initialFaculdade)
    const [loading, setLoading] = useState(false);
    const {addNotification} = useError()
    
    const listarFaculdade = async (status: number | boolean) => {
        setLoading(true)
        if(status == 0){
            status = false
        }else{
            status = true
        }
        try{
            const data = await FaculdadeServices.listarTodas(status)
            setFaculdade(data)

        }catch(err){
            addNotification(err instanceof Error ? err.message : "Erro ao carregar Faculdade")
            throw err
        }finally{
            setLoading(false)
        }
    }

    const criarFaculdade = async (dados: FaculdadeType) => {
        setLoading(true)
        try {
            const novaFaculdade = await FaculdadeServices.criar(dados)
            setFaculdade(prev => [...prev, novaFaculdade]); //Insiro no array de Faculdade
            addNotification({mensagem: "Faculdade cadastrada com sucesso", tipo: "info"})
            return novaFaculdade
        } catch (err) {
            addNotification(err instanceof Error ? err.message : "Erro ao criar Faculdade")
            throw err
        }finally{
            setLoading(false)
        }
    }

    const atualizarFaculdade = async(id: number, dados: FaculdadeType) => {
        setLoading(true)
        try {
            const faculdadeAtualizada = await FaculdadeServices.atualizar(id, dados)
                setFaculdade(prev => prev.map(faculdade => faculdade.facId === id ? {
                    ...faculdade, //Copio os dados originais
                    ...faculdadeAtualizada //Sobrescrevo com o dado atualizado
                } : faculdade
            ))
            addNotification({mensagem: "Faculdade atualizada com sucesso", tipo: "info"})
            return faculdadeAtualizada
        } catch (err) {
            addNotification(err instanceof Error ? err.message : "Erro ao atualizar Faculdade")
            throw err
        }finally{
            setLoading(false)
        }
    }

    const inativarFaculdade = async (id: number) => {
        setLoading(true)
        try {
            await FaculdadeServices.inativar(id)
            setFaculdade(prev => prev.filter(faculdade => faculdade.facId !== id))
            addNotification({mensagem: "Faculdade inativada com sucesso", tipo: "info"})
        } catch (err) {
            addNotification(err instanceof Error ? err.message : "Erro ao atualizar Faculdade")
            throw err
        }finally{
            setLoading(false)
        }
    }

    return {
        faculdade,
        loading,
        listarFaculdade,
        criarFaculdade,
        atualizarFaculdade,
        inativarFaculdade,
    }
}