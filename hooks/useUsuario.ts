import { useState } from "react";
import { UsuarioServices } from "@/services/usuarioServices";
import { AlterarSenhaType, UsuarioType } from "@/types/usuarioype";
import { useError } from '@/contexts/NotificationContext';

export const useUsuario = (initialUsuario: UsuarioType[] = []) => {
    const [usuario, setUsuario] = useState<UsuarioType[]>(initialUsuario)
    const [loading, setLoading] = useState(false);
    const {addNotification} = useError()
    
    const listarUsuario = async (status: number | boolean) => {
        setLoading(true)
        if(status == 0){
            status = false
        }else{
            status = true
        }
        try{
            const data = await UsuarioServices.listarTodos(status)
            setUsuario(data)
            
        }catch(err){
            addNotification(err instanceof Error ? err.message : "Erro ao carregar usuario")
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
            addNotification({mensagem: "Usuário cadastrado com sucesso", tipo: "info"})
            return novaUsuario
        } catch (err) {
            addNotification(err instanceof Error ? err.message : "Erro ao criar Usuario")
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
            addNotification({mensagem: "Usuário atualizado com sucesso", tipo: "info"})
            return usuarioAtualizada
        } catch (err) {
            addNotification(err instanceof Error ? err.message : "Erro ao atualizar Usuario")
            throw err
        }finally{
            setLoading(false)
        }
    }

    const alterarSenhaUsuario = async (id: number, dados: AlterarSenhaType) => {
        setLoading(true)
        try {
            await UsuarioServices.alterarSenhaUsuario(id, dados)
            addNotification({mensagem: "Senha de usuário alterada com sucesso", tipo: "info"})
        } catch (err) {
            addNotification(err instanceof Error ? err.message : "Erro ao altera senha de Usuario")
            throw err
        }finally{
            setLoading(false)
        }
    }

    const resetarSenha = async (id: number) => {
        setLoading(true)
        try {
            await UsuarioServices.resetarSenhaDeUsuario(id)
            addNotification({mensagem: "Senha de usuário resetada com sucesso", tipo: "info"})
        } catch (err) {
            addNotification(err instanceof Error ? err.message : "Erro ao altera senha de Usuario")
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
            addNotification({mensagem: "Usuário inativado com sucesso", tipo: "info"})
        } catch (err) {
            addNotification(err instanceof Error ? err.message : "Erro ao atualizar Usuario")
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
        inativarUsuario,
        alterarSenhaUsuario,
        resetarSenha
    }
}