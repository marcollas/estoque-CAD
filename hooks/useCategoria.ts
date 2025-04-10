import { useState } from "react";
import { CategoriaServices } from "@/services/categoriaServices";
import { CategoriaType } from "@/types/categoriaType";
import { useError } from "@/contexts/ErrorContext";

export const useCategoria = (initialCategoria: CategoriaType[] = []) => {
    const [categoria, setCategoria] = useState<CategoriaType[]>(initialCategoria)
    const [loading, setLoading] = useState(false);
    const {addError} = useError()
    
    const listarCategoria = async () => {
        setLoading(true)
        try{
            const data = await CategoriaServices.listarTodas()
            setCategoria(data)
        }catch(err){
            addError(err instanceof Error ? err.message : "Erro ao atualizar categoria")
            throw err
        }finally{
            setLoading(false)
        }
    }

    const criarCategoria = async (dados: CategoriaType) => {
        setLoading(true)
        try {
            const novaCategoria = await CategoriaServices.criar(dados)
            setCategoria(prev => [...prev, novaCategoria]); //Insiro no array de Categoria
            return novaCategoria
        } catch (err) {
            addError(err instanceof Error ? err.message : "Erro ao criar Categoria")
            throw err
        }finally{
            setLoading(false)
        }
    }

    const atualizarCategoria = async(id: number, dados: CategoriaType) => {
        setLoading(true)
        try {
            const categoriaAtualizada = await CategoriaServices.atualizar(id, dados)
                setCategoria(prev => prev.map(categoria => categoria.catProId === id ? {
                    ...categoria, //Copio os dados originais
                    ...categoriaAtualizada //Sobrescrevo com o dado atualizado
                } : categoria
            ))
            return categoriaAtualizada
        } catch (err) {
            addError(err instanceof Error ? err.message : "Erro ao atualizar categoria")
            throw err
        }finally{
            setLoading(false)
        }
    }

    const inativarCategoria = async (id: number) => {
        setLoading(true)
        try {
            await CategoriaServices.inativar(id)
            setCategoria(prev => prev.filter(categoria => categoria.catProId !== id))
        } catch (err) {
            addError(err instanceof Error ? err.message : "Erro ao atualizar categoria")
            throw err
        }finally{
            setLoading(false)
        }
    }

    return {
        categoria,
        loading,
        listarCategoria,
        criarCategoria,
        atualizarCategoria,
        inativarCategoria
    }
}