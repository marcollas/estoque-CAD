// hooks/useRequisitante.ts
import { useState } from 'react';
import { RequisitanteServices } from '@/services/requisitanteServices';
import type { RequisitanteType } from '@/types/requisitanteType';
import { useError } from '@/contexts/NotificationContext';

export const useRequisitante = (initialRequisitante: RequisitanteType[] = []) => {
  const [requisitante, setRequisitante] = useState<RequisitanteType[]>(initialRequisitante);
  const [loading, setLoading] = useState(false);
  const {addNotification} = useError()

  // Listar todos os Requisitante
  const listarRequisitante = async (status: number | boolean) => {
    setLoading(true);
    if(status == 0){
        status = false
    }else{
        status = true
    }
    try {
      const data = await RequisitanteServices.listarTodos(status);
      setRequisitante(data);
      return data;
    } catch (err) {
      addNotification(err instanceof Error ? err.message : 'Erro ao carregar Requisitante');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Criar novo Requisitante
  const criarRequisitante = async (dados: RequisitanteType) => {
    setLoading(true);
    try {
      const novoRequisitante = await RequisitanteServices.criar(dados);
      setRequisitante(prev => [...prev, novoRequisitante]);
      addNotification({mensagem: "Requisitante cadastrado com sucesso", tipo: "info"})
      return novoRequisitante;
    } catch (err) {
      addNotification(err instanceof Error ? err.message : 'Erro ao criar Requisitante');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Atualizar Requisitante existente
  const atualizarRequisitante = async (id: number, dados: RequisitanteType) => {
    setLoading(true);
    try {
      const requisitanteAtualizado = await RequisitanteServices.atualizar(id, dados);
      setRequisitante(prev =>
        prev.map(requisitante =>
          requisitante.reqId === id ? { 
            ...requisitante, // Mantém todas as propriedades existentes
            ...requisitanteAtualizado // Atualiza com os novos dados
          } : requisitante
        )
      );
      addNotification({mensagem: "Requisitante atualizado com sucesso", tipo: "info"})
      console.log(requisitanteAtualizado)
      return requisitanteAtualizado;
    } catch (err) {
      addNotification(err instanceof Error ? err.message : 'Erro ao atualizar Requisitante');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // inativar Requisitante
  const inativarRequisitante = async (id: number) => {
    setLoading(true);
    try {
      await RequisitanteServices.inativar(id);
      setRequisitante(prev => prev.filter(requisitante => requisitante.reqId !== id));
      addNotification({mensagem: "Requisitante inativado com sucesso", tipo: "info"})
    } catch (err) {
      addNotification(err instanceof Error ? err.message : 'Erro ao inativar Requisitante');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  return {
    requisitante,
    loading,
    listarRequisitante,
    criarRequisitante,
    atualizarRequisitante,
    inativarRequisitante
  };
};