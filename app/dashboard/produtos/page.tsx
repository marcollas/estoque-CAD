'use client'

import type React from "react"

import { useState, useEffect } from "react"
import { Package, Plus, Search, Edit, Trash2, Box } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useProdutos } from "@/hooks/useProduto"
import { useUnidades } from "@/hooks/useUnidade"
import { useCategoria } from "@/hooks/useCategoria"
import type { ProdutoType, FormProdutoType } from "@/types/produtoType"
import Loading from "@/components/Loading"
import { Textarea } from "@/components/ui/textarea"
import ProtectedRoute from "@/components/ProtectedRoutes"
import { useAuth } from "@/contexts/UsuarioContext"

export default function ProdutosPage() {
  const {isAutenticado, usuario} = useAuth()
  const [busca, setBusca] = useState("")
  const [produtoAtual, setProdutoAtual] = useState<any>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [formData, setFormData] = useState<FormProdutoType>({
    proNome: "",
    proSipac: "",
    proUnId: 0,
    proUnSigla: "",
    proCategoriaId: null,
    proCategoriaNome: "",
    proQtd: 0,
    proEstoqueMin: 0,
    proCusto: 0,
    proDescricao: ""
  })

  const produtosHook  = useProdutos()
  const unidadesHook = useUnidades()
  const categoriaHook = useCategoria()

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          categoriaHook.listarCategoria(),
          produtosHook.listarProdutos(),
          unidadesHook.listarUnidades()
        ])
      } catch (error) {
        console.error("Erro ao carregar dados:", error)
      }
    }
  
    //Esse IF é implementado pois o sistema faz a consulta no back end sem antes o usuário estar logado. Desse modo, só irá fazer assim que o usuário estiver logado
    if(isAutenticado){
      fetchData()
    }
    
  }, [isAutenticado])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (produtoAtual) {
        // Modo Edição - PUT request
        produtosHook.atualizarProduto(produtoAtual.proId, formData)
      } else {
        // Modo Cadastro - POST request
        produtosHook.criarProduto(formData)
      }
  
      // Fecha o diálogo e reseta o formulário
      setDialogOpen(false);
      setProdutoAtual(null);
      setFormData({
        proNome: "",
        proSipac: "",
        proUnId: 0,
        proUnSigla: "",
        proCategoriaId: null,
        proCategoriaNome: "",
        proQtd: 0,
        proEstoqueMin: 0,
        proCusto: 0,
        proDescricao: ""
      });
  
    } catch (error) {
      console.error("Erro ao salvar produto:", error);
      alert("Ocorreu um erro ao processar sua solicitação.");
    }
  }

  const produtosFiltrados = produtosHook.produtos.filter(
    (produto: ProdutoType) =>
      (produto.proNome?.toLowerCase() || '').includes(busca.toLowerCase()) ||
      (produto.proSipac?.toLowerCase() || '').includes(busca.toLowerCase()),
  )

  //Campo recebe o dados do formulário editado
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement> |  React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      //Faço a verificação se é vazio ou Nan. Se for, substituo por zero
      [name]: (name === "proQtd" || name === "proEstoqueMin")
        ? value === "" || isNaN(Number(value)) 
          ? 0  // Substitui por 0 se for vazio ou inválido
          : Number(value)
        : value
    }));
  }

  const handleUnidadeChange = (unidade: string) => {
    setFormData({
      ...formData,
      proUnId: Number(unidade),
    })
  }

  const handleCategoriaChange = (categoria: string) => {
    setFormData({
      ...formData,
      proCategoriaId: categoria == "0" ? null : Number(categoria)
    })
  }

  const handleEdit = (produto: ProdutoType) => {
    setProdutoAtual(produto)
    setFormData({
      proId: produto.proId,
      proNome: produto.proNome,
      proSipac: produto.proSipac,
      proUnId: produto.proUnId,
      proUnSigla: produto.proUn,
      proCategoriaId: produto.proCategoriaId,
      proCategoriaNome: produto.proCategoria,
      proQtd: produto.proQtd,
      proEstoqueMin: produto.proEstoqueMin,
      proCusto: produto.proCusto,
      proDescricao: produto.proDescricao
    })
    setDialogOpen(true)
  }

  const handleDelete = (id: number) => {
    if (confirm("Tem certeza que deseja inativar este produto?")) {
      produtosHook.inativarProduto(id)
    }
  }

  const handleAddNew = () => {
    setProdutoAtual(null)
    setFormData({
      proNome: "",
      proQtd: 0,
      proEstoqueMin: 0,
      proCusto: 0,
      proSipac: "",
      proUnId: 0,
      proUnSigla: "",
      proCategoriaId: null,
      proCategoriaNome: "",
      proDescricao: ""
    })
    setDialogOpen(true)
  }
  if (produtosHook.loading) return <Loading />;
  //if (produtosHook.error) return <ErrorAlert message={error} />;

  return (
    <ProtectedRoute>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Box className="h-6 w-6" />
            Gerenciamento de Produtos
          </h1>
          <Button onClick={handleAddNew} className="bg-[#1e3a8a]">
            <Plus className="h-4 w-4 mr-2" />
            Novo Produto
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar produtos..."
                className="pl-10"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Código</th>
                  <th className="text-left py-3 px-4">Nome</th>
                  <th className="text-left py-3 px-4">Unidade</th>
                  <th className="text-left py-3 px-4">Categoria</th>
                  <th className="text-left py-3 px-4">Estoque</th>
                  <th className="text-left py-3 px-4">Mínimo</th>
                  <th className="text-left py-3 px-4">Custo</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Ações</th>
                </tr>
              </thead>
              <tbody>
                {produtosFiltrados.map((produto, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{produto.proSipac}</td>
                    <td className="py-3 px-4">{produto.proNome}</td>
                    <td className="py-3 px-4">{produto.proUn}</td>
                    <td className="py-3 px-4">{produto.proCategoria}</td>
                    <td className="py-3 px-4">{produto.proQtd}</td>
                    <td className="py-3 px-4">{produto.proEstoqueMin}</td>
                    <td className="py-3 px-4">R$ {produto.proCusto.toFixed(2)}</td>
                    <td className="py-3 px-4">
                      {produto.isAbaixoMin ? (
                        <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">Baixo</span>
                      ) : (
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Normal</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button variant="outline" size="icon" onClick={() => handleEdit(produto)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => handleDelete(produto.proId)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{produtoAtual ? "Editar Produto" : "Novo Produto"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="categoria">Unidade</Label>
                  <Select value={formData.proUnId.toString()} onValueChange={handleUnidadeChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                    {
                      unidadesHook.unidades.map((unidade, index) => {
                        return <SelectItem key={index} value={unidade.unId.toString()}>{unidade.unNome} - {unidade.unSigla}</SelectItem>
                      })
                    }
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="categoria">Categoria</Label>
                  <Select value={formData.proCategoriaId?.toString() ?? ""} onValueChange={handleCategoriaChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Selecione</SelectItem>
                    {
                      categoriaHook.categoria.map((categoria, index) => {
                        return <SelectItem key={index} value={categoria.catProId.toString()}>{categoria.catProNome}</SelectItem>
                      })
                    }
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="nome">Nome do Produto</Label>
                <Input id="nome" name="proNome" value={formData.proNome} onChange={handleInputChange} required />
              </div>            
              <div className="space-y-2">
                <Label htmlFor="nome">Código SIPAC</Label>
                <Input id="nome" name="proSipac" value={formData.proSipac} onChange={handleInputChange} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="custo">Valor de custo</Label>
                  <Input
                    id="custo"
                    name="proCusto"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.proCusto || ""} 
                    onChange={handleInputChange}
                  />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="minimo">Estoque Mínimo</Label>
                    <Input
                      id="minimo"
                      name="proEstoqueMin"
                      type="number"
                      min="0"
                      value={formData.proEstoqueMin || ""} 
                      onChange={handleInputChange}
                    />
                  </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="observacao">Descrição do produto</Label>
                <Textarea
                  id="observacao"
                  value={formData.proDescricao}
                  name="proDescricao"
                  onChange={handleInputChange}
                  placeholder="Informações adicionais sobre o produto"
                  rows={3}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" className="bg-[#1e3a8a]">
                  {produtoAtual ? "Atualizar" : "Cadastrar"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </ProtectedRoute>
  )
}

