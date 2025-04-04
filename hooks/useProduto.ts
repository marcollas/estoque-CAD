// hooks/useProdutos.ts
import { useState } from 'react';
import { ProdutoServices } from '@/services/produtoServices';
import type { ProdutoType, FormProdutoType } from '@/types/produtoType';

export const useProdutos = (initialProdutos: ProdutoType[] = []) => {
  const [produtos, setProdutos] = useState<ProdutoType[]>(initialProdutos);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Listar todos os produtos
  const listarProdutos = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await ProdutoServices.listarTodos();
      setProdutos(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar produtos');
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
      setError(err instanceof Error ? err.message : 'Erro ao criar produto');
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
      setError(err instanceof Error ? err.message : 'Erro ao atualizar produto');
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
      setError(err instanceof Error ? err.message : 'Erro ao inativar produto');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  return {
    produtos,
    loading,
    error,
    listarProdutos,
    criarProduto,
    atualizarProduto,
    inativarProduto,
    setError // Permite limpar erros manualmente
  };
};