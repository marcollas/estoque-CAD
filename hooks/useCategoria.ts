import { useState } from "react";
import { CategoriaServices } from "@/services/categoriaServices";
import { CategoriaType } from "@/types/categoriaType";
import { useError } from "@/contexts/NotificationContext";

export const useCategoria = (initialCategoria: CategoriaType[] = []) => {
    const [categoria, setCategoria] = useState<CategoriaType[]>(initialCategoria)
    const [loading, setLoading] = useState(false);
    const {addNotification} = useError()
    
    const listarCategoria = async (status: number | boolean) => {
        setLoading(true)
        if(status == 0){
            status = false
        }else{
            status = true
        }
        try{
            const data = await CategoriaServices.listarTodas(status)
            setCategoria(data)
        }catch(err){
            addNotification(err instanceof Error ? err.message : "Erro ao atualizar categoria")
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
            addNotification({mensagem: "Categoria cadastrada com sucesso", tipo: "info"})
            return novaCategoria
        } catch (err) {
            addNotification(err instanceof Error ? err.message : "Erro ao criar Categoria")
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
            addNotification({mensagem: "Categoria atualizada com sucesso", tipo: "info"})
            return categoriaAtualizada
        } catch (err) {
            addNotification(err instanceof Error ? err.message : "Erro ao atualizar categoria")
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
            addNotification({mensagem: "Categoria inativada com sucesso", tipo: "info"})
        } catch (err) {
            addNotification(err instanceof Error ? err.message : "Erro ao atualizar categoria")
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