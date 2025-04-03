"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Package, Plus, Search, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { url, port } from '../../../configApi.json'
import { useProdutos } from "@/hooks/useProduto"

//Importação do axios
import axios from 'axios'
import { error } from "console"

//Dados de interface, onde determino os tipos de objetos
interface Produto{
  proId: number
  proNome: string
  proSipac: string
  proUn: string
  proUnId: number
  proCategoria: string
  proCategoriaId: number
  proDescricao: string
  proQtd: number
  proEstoqueMin: number
  isAbaixoMin: boolean
  isAtivo: boolean
}

//Criar o tipo do formulário do produto omitindo alguns campos
type FormProduto = {
  proNome: string
  proSipac: string
  proUnId: number
  proCategoriaId: number
  proDescricao?: string
  proQtd: number
  proEstoqueMin: number
  proId?: number  // ProId é opcional, pode estar ou não contido no formulário
}

type UnidadesProduto = {
  unId: number,
  unNome: string,
  unSigla: string,
  isAtivo: boolean
}

type CategoriaProduto = {
  catProId: number
  catProNome: string
  isAtivo: true
}

export default function ProdutosPage() {
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [unidadesProduto, setUnidadesProduto] = useState<UnidadesProduto[]>([])
  const [categoria, setCategoria] = useState<CategoriaProduto[]>([])
  const [busca, setBusca] = useState("")
  const [produtoAtual, setProdutoAtual] = useState<any>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [formData, setFormData] = useState<FormProduto>({
    proNome: "",
    proSipac: "",
    proUnId: 0,
    proCategoriaId: 0,
    proQtd: 0,
    proEstoqueMin: 0
  })

  const produtosHook  = useProdutos()
  
  const formatarDadosApi = (formData: FormProduto) =>{
    return {
      proNome: formData.proNome,
      proSipac: formData.proSipac,
      proQtd: formData.proQtd,
      proDescricao: formData.proDescricao || '',
      proEstoqueMin: formData.proEstoqueMin,
      proCategoria: {
        catProId: formData.proCategoriaId || null
      },
      proUn: {
        unId: formData.proUnId
      }
    };
  }
  const buscarUnidades = async () =>{
    try{
      const response = await axios.get(`${url}:${port}/unidadeProduto/`, {
        headers: {
          Authorization: localStorage.getItem("Authorization")
        }
      })
      setUnidadesProduto(response.data)
    }catch (error){
      console.log("Erro de comunicação: "+error)
    }
  }

  // const buscarProdutos = async () =>{
  //   try{
  //     const response = await axios.get(`${url}:${port}/produto/`, {
  //       headers: {
  //         Authorization: localStorage.getItem("Authorization")
  //       }
  //     })
  //     setProdutos(response.data)
  //   }catch (error){
  //     console.log("Erro de comunicação: "+error)
  //   }
  // }

  const buscarCategorias = async () =>{
    try{
      const response = await axios.get(`${url}:${port}/categoriaProduto/`, {
        headers: {
          Authorization: localStorage.getItem("Authorization")
        }
      })
      setCategoria(response.data)
    }catch (error){
      console.log("Erro de comunicação: "+error)
    }
  }


  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          buscarCategorias(),
          produtosHook.listarProdutos(),
          buscarUnidades()
        ])
      } catch (error) {
        console.error("Erro ao carregar dados:", error)
      }
    }
  
    fetchData()
  }, [])

  const atualizarProdutos = async () => {  
    try {
      await axios.put(`${url}:${port}/produto/${produtoAtual.proId}`, formatarDadosApi(formData), {
        headers: {
          Authorization: localStorage.getItem("Authorization") || ''
        }
      })

      alert("Produto atualizado com sucesso!")
    } catch (error) {
      console.log(error)
    }
  }

  const cadastrarProduto = async () => {  
    try {
      await axios.post(`${url}:${port}/produto/`, formatarDadosApi(formData), {
        headers: {
          Authorization: localStorage.getItem("Authorization") || ''
        }
      })

      alert("Produto cadastrado com sucesso!")
    } catch (error) {
      console.log(error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (produtoAtual) {
        // Modo Edição - PUT request
        await atualizarProdutos(); // Adicione await aqui
      } else {
        // Modo Cadastro - POST request
        await cadastrarProduto(); // Adicione await aqui
      }
  
      // Atualiza a lista de produtos
      await produtosHook.listarProdutos();
      
      // Fecha o diálogo e reseta o formulário
      setDialogOpen(false);
      setProdutoAtual(null);
      setFormData({
        proNome: "",
        proSipac: "",
        proUnId: 0,
        proCategoriaId: 0,
        proQtd: 0,
        proEstoqueMin: 0
      });
  
    } catch (error) {
      console.error("Erro ao salvar produto:", error);
      alert("Ocorreu um erro ao processar sua solicitação.");
    }
  }

  const produtosFiltrados = produtosHook.produtos.filter(
    (produto: Produto) =>
      produto.proNome.toLowerCase().includes(busca.toLowerCase()) ||
      produto.proSipac.toLowerCase().includes(busca.toLowerCase()),
  )

  //Campo recebe o dados do formulário editado
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: name === "proQtd" || name === "proEstoqueMin" ? Number.parseInt(value) : value,
    })
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
      proCategoriaId: Number(categoria)
    })
  }

  const handleEdit = (produto: Produto) => {
    //console.log(produto)
    setProdutoAtual(produto)
    setFormData({
      proId: produto.proId,
      proNome: produto.proNome,
      proSipac: produto.proSipac,
      proUnId: produto.proUnId,
      proCategoriaId: produto.proCategoriaId,
      proQtd: produto.proQtd,
      proEstoqueMin: produto.proEstoqueMin
    })
    setDialogOpen(true)
  }

  const handleDelete = (id: number) => {
    if (confirm("Tem certeza que deseja excluir este produto?")) {
      setProdutos(produtos.filter((p) => p.proId !== id))
    }
  }

  const handleAddNew = () => {
    setProdutoAtual(null)
    setFormData({
      proNome: "",
      proQtd: 0,
      proEstoqueMin: 0,
      proSipac: "",
      proUnId: 0,
      proCategoriaId: 0
    })
    setDialogOpen(true)
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Package className="h-6 w-6" />
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
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3 px-4">Ações</th>
              </tr>
            </thead>
            <tbody>
              {produtosFiltrados.map((produto) => (
                <tr key={produto.proId} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{produto.proSipac}</td>
                  <td className="py-3 px-4">{produto.proNome}</td>
                  <td className="py-3 px-4">{produto.proUn}</td>
                  <td className="py-3 px-4">{produto.proCategoria}</td>
                  <td className="py-3 px-4">{produto.proQtd}</td>
                  <td className="py-3 px-4">{produto.proEstoqueMin}</td>
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
              {/* <div className="space-y-2">
                <Label htmlFor="codigo">Código</Label>
                <Input id="codigo" name="codigo" value={formData.proId} onChange={handleInputChange} required />
              </div> */}
              <div className="space-y-2">
                <Label htmlFor="categoria">Unidade</Label>
                <Select value={formData.proUnId.toString()} onValueChange={handleUnidadeChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                  {
                    unidadesProduto.map((unidade, index) => {
                      return <SelectItem key={index} value={unidade.unId.toString()}>{unidade.unNome} - {unidade.unSigla}</SelectItem>
                    })
                  }
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="categoria">Categoria</Label>
                <Select value={formData.proCategoriaId.toString()} onValueChange={handleCategoriaChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                  {
                    categoria.map((categoria, index) => {
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
                <Label htmlFor="estoque">Estoque Atual</Label>
                <Input
                  id="estoque"
                  name="proQtd"
                  type="number"
                  min="0"
                  value={formData.proQtd}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="minimo">Estoque Mínimo</Label>
                <Input
                  id="minimo"
                  name="proEstoqueMin"
                  type="number"
                  min="0"
                  value={formData.proEstoqueMin}
                  onChange={handleInputChange}
                  required
                />
              </div>
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
  )
}

