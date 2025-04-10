// hooks/useRequisitante.ts
import { useState } from 'react';
import { RequisitanteServices } from '@/services/requisitanteServices';
import type { RequisitanteType } from '@/types/requisitanteType';
import { useError } from '@/contexts/ErrorContext';

export const useRequisitante = (initialRequisitante: RequisitanteType[] = []) => {
  const [requisitante, setRequisitante] = useState<RequisitanteType[]>(initialRequisitante);
  const [loading, setLoading] = useState(false);
  const {addError} = useError()

  // Listar todos os Requisitante
  const listarRequisitante = async () => {
    setLoading(true);
    try {
      const data = await RequisitanteServices.listarTodos();
      setRequisitante(data);
      return data;
    } catch (err) {
      addError(err instanceof Error ? err.message : 'Erro ao carregar Requisitante');
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
      return novoRequisitante;
    } catch (err) {
      addError(err instanceof Error ? err.message : 'Erro ao criar Requisitante');
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
      return requisitanteAtualizado;
    } catch (err) {
      addError(err instanceof Error ? err.message : 'Erro ao atualizar Requisitante');
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
    } catch (err) {
      addError(err instanceof Error ? err.message : 'Erro ao inativar Requisitante');
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