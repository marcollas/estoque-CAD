import { useState } from "react";
import { UsuarioServices } from "@/services/usuarioServices";
import { UsuarioType } from "@/types/usuarioype";
import { useError } from '@/contexts/ErrorContext';

export const useUsuario = (initialUsuario: UsuarioType[] = []) => {
    const [usuario, setUsuario] = useState<UsuarioType[]>(initialUsuario)
    const [loading, setLoading] = useState(false);
    const {addError} = useError()
    
    const listarUsuario = async () => {
        setLoading(true)
        try{
            const data = await UsuarioServices.listarTodos()
            setUsuario(data)

        }catch(err){
            addError(err instanceof Error ? err.message : "Erro ao carregar usuario")
            throw err
        }finally{
            setLoading(false)
        }
    }

    const criarUsuario = async (dados: UsuarioType) => {
        setLoading(true)
        try {
            const novaUsuario = await UsuarioServices.criar(dados)
            setUsuario(prev => [...prev, novaUsuario]); //Insiro no array de Usuario
            return novaUsuario
        } catch (err) {
            addError(err instanceof Error ? err.message : "Erro ao criar Usuario")
            throw err
        }finally{
            setLoading(false)
        }
    }

    const atualizarUsuario = async(id: number, dados: UsuarioType) => {
        setLoading(true)
        try {
            const usuarioAtualizada = await UsuarioServices.atualizar(id, dados)
                setUsuario(prev => prev.map(usuario => usuario.usuId === id ? {
                    ...usuario, //Copio os dados originais
                    ...usuarioAtualizada //Sobrescrevo com o dado atualizado
                } : usuario
            ))
            return usuarioAtualizada
        } catch (err) {
            addError(err instanceof Error ? err.message : "Erro ao atualizar Usuario")
            throw err
        }finally{
            setLoading(false)
        }
    }

    const inativarUsuario = async (id: number) => {
        setLoading(true)
        try {
            await UsuarioServices.inativar(id)
            setUsuario(prev => prev.filter(usuario => usuario.usuId !== id))
        } catch (err) {
            addError(err instanceof Error ? err.message : "Erro ao atualizar Usuario")
            throw err
        }finally{
            setLoading(false)
        }
    }

    return {
        usuario,
        loading,
        listarUsuario,
        criarUsuario,
        atualizarUsuario,
        inativarUsuario
    }
}