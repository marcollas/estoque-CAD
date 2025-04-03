// hooks/useProdutos.ts
import { useState } from 'react';
import { ProdutoServices } from '@/services/produtoServices';
import type { Produto, FormProduto } from '@/types/produtoType';

export const useProdutos = (initialProdutos: Produto[] = []) => {
  const [produtos, setProdutos] = useState<Produto[]>(initialProdutos);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentProduto, setCurrentProduto] = useState<Produto | null>(null);

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
  const criarProduto = async (dados: FormProduto) => {
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
  const atualizarProduto = async (id: number, dados: FormProduto) => {
    setLoading(true);
    try {
      const produtoAtualizado = await ProdutoServices.atualizar(id, dados);
      setProdutos(prev =>
        prev.map(produto =>
          produto.proId === id ? produtoAtualizado : produto
        )
      );
      setCurrentProduto(null); // Limpa o produto em edição
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

  // Preparar produto para edição
  const prepararEdicao = (produto: Produto) => {
    setCurrentProduto(produto);
  };

  // Cancelar edição
  const cancelarEdicao = () => {
    setCurrentProduto(null);
  };

  return {
    produtos,
    loading,
    error,
    currentProduto,
    listarProdutos,
    criarProduto,
    atualizarProduto,
    inativarProduto,
    prepararEdicao,
    cancelarEdicao,
    setError // Permite limpar erros manualmente
  };
};