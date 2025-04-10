// hooks/useProdutos.ts
import { useState } from 'react';
import { ProdutoServices } from '@/services/produtoServices';
import type { ProdutoType, FormProdutoType } from '@/types/produtoType';
import { useError } from '@/contexts/ErrorContext';

export const useProdutos = (initialProdutos: ProdutoType[] = []) => {
  const [produtos, setProdutos] = useState<ProdutoType[]>(initialProdutos);
  const [loading, setLoading] = useState(false);
  const {addError} = useError()

  // Listar todos os produtos
  const listarProdutos = async () => {
    setLoading(true);
    try {
      const data = await ProdutoServices.listarTodos();
      setProdutos(data);
      return data;
    } catch (err) {
      addError(err instanceof Error ? err.message : 'Erro ao carregar produtos');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Criar novo produto
  const criarProduto = async (dados: FormProdutoType) => {
    setLoading(true);
    try {
      const novoProduto = await ProdutoServices.criar(dados);
      setProdutos(prev => [...prev, novoProduto]);
      return novoProduto;
    } catch (err) {
      addError(err instanceof Error ? err.message : 'Erro ao criar produto');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Atualizar produto existente
  const atualizarProduto = async (id: number, dados: FormProdutoType) => {
    setLoading(true);
    try {
      const produtoAtualizado = await ProdutoServices.atualizar(id, dados);
      setProdutos(prev =>
        prev.map(produto =>
          produto.proId === id ? { 
            ...produto, // Mantém todas as propriedades existentes
            ...produtoAtualizado // Atualiza com os novos dados
          } : produto
        )
      );
      return produtoAtualizado;
    } catch (err) {
      addError(err instanceof Error ? err.message : 'Erro ao atualizar produto');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // inativar produto
  const inativarProduto = async (id: number) => {
    setLoading(true);
    try {
      await ProdutoServices.inativar(id);
      setProdutos(prev => prev.filter(produto => produto.proId !== id));
    } catch (err) {
      addError(err instanceof Error ? err.message : 'Erro ao inativar produto');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  return {
    produtos,
    loading,
    listarProdutos,
    criarProduto,
    atualizarProduto,
    inativarProduto
  };
};