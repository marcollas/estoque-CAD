import { useState } from "react";
import { CategoriaServices } from "@/services/categoriaServices";
import { CategoriaType } from "@/types/categoriaType";

export const useCategoria = (initialCategoria: CategoriaType[] = []) => {
    const [categoria, setCategoria] = useState<CategoriaType[]>(initialCategoria)
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const listarCategoria = async () => {
        setLoading(true)
        setError(null)
        try{
            const data = await CategoriaServices.listarTodas()
            setCategoria(data)
            setError(null)
        }catch(err){
            setError(err instanceof Error ? err.message : "Erro ao carregar Categoria")
            throw err
        }finally{
            setLoading(false)
        }
    }

    const criarUnidade = async (dados: CategoriaType) => {
        setLoading(true)
        try {
            const novaUnidade = await CategoriaServices.criar(dados)
            setCategoria(prev => [...prev, novaUnidade]); //Insiro no array de Categoria
            return novaUnidade
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erro ao criar Categoria")
            throw err
        }finally{
            setLoading(false)
        }
    }

    const atualizarUnidade = async(id: number, dados: CategoriaType) => {
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
            setError(err instanceof Error ? err.message : "Erro ao atualizar categoria")
            throw err
        }finally{
            setLoading(false)
        }
    }

    const inativarUnidade = async (id: number) => {
        setLoading(true)
        try {
            await CategoriaServices.inativar(id)
            setCategoria(prev => prev.filter(categoria => categoria.catProId !== id))
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erro ao atualizar categoria")
            throw err
        }finally{
            setLoading(false)
        }
    }

    return {
        categoria,
        loading,
        error,
        listarCategoria,
        criarUnidade,
        atualizarUnidade,
        inativarUnidade,
        setError
    }
}