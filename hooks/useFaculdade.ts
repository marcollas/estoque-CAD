import { useState } from "react";
import { FaculdadeServices } from "@/services/faculdadeServices";
import { FaculdadeType } from "@/types/faculdadeType";
import { useError } from "@/contexts/ErrorContext";

export const useFaculdade = (initialFaculdade: FaculdadeType[] = []) => {
    const [faculdade, setFaculdade] = useState<FaculdadeType[]>(initialFaculdade)
    const [loading, setLoading] = useState(false);
    const {addError} = useError()
    
    const listarFaculdade = async () => {
        setLoading(true)
        try{
            const data = await FaculdadeServices.listarTodas()
            setFaculdade(data)

        }catch(err){
            addError(err instanceof Error ? err.message : "Erro ao carregar Faculdade")
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
            return novaFaculdade
        } catch (err) {
            addError(err instanceof Error ? err.message : "Erro ao criar Faculdade")
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
            return faculdadeAtualizada
        } catch (err) {
            addError(err instanceof Error ? err.message : "Erro ao atualizar Faculdade")
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
        } catch (err) {
            addError(err instanceof Error ? err.message : "Erro ao atualizar Faculdade")
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