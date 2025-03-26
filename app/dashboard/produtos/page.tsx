"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Package, Plus, Search, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

//Importação do axios
import axios from 'axios'

// Dados de exemplo
const produtosIniciais = [
  { id: 1, codigo: "P001", nome: "Teclado Mecânico", categoria: "Periféricos", estoque: 45, minimo: 10 },
  { id: 2, codigo: "P002", nome: "Mouse Gamer", categoria: "Periféricos", estoque: 32, minimo: 8 },
  { id: 3, codigo: "P003", nome: 'Monitor 24"', categoria: "Monitores", estoque: 18, minimo: 5 },
  { id: 4, codigo: "P004", nome: "Headset", categoria: "Áudio", estoque: 27, minimo: 7 },
  { id: 5, codigo: "P005", nome: "Webcam HD", categoria: "Periféricos", estoque: 15, minimo: 5 },
  { id: 6, codigo: "P006", nome: "SSD 500GB", categoria: "Armazenamento", estoque: 23, minimo: 6 },
  { id: 7, codigo: "P007", nome: "Memória RAM 8GB", categoria: "Componentes", estoque: 41, minimo: 10 },
  { id: 8, codigo: "P008", nome: "Placa de Vídeo", categoria: "Componentes", estoque: 12, minimo: 3 },
]


export default function ProdutosPage() {

  const buscarProdutos = async () =>{
    try{
      const response = await axios.get(`http://localhost:8080/produto/`)
      setProdutos(response.data);
    }catch (error){
      console.log("Erro de comunicação: "+error)
    }
  }

  useEffect(() => {

    buscarProdutos()
  }, [])

  const [produtos, setProdutos] = useState(produtosIniciais)
  const [busca, setBusca] = useState("")
  const [produtoAtual, setProdutoAtual] = useState<any>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    codigo: "",
    nome: "",
    categoria: "",
    estoque: 0,
    minimo: 0,
  })

  const produtosFiltrados = produtos.filter(
    (produto) =>
      produto.nome.toLowerCase().includes(busca.toLowerCase()) ||
      produto.codigo.toLowerCase().includes(busca.toLowerCase()),
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: name === "estoque" || name === "minimo" ? Number.parseInt(value) : value,
    })
  }

  const handleSelectChange = (value: string) => {
    setFormData({
      ...formData,
      categoria: value,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (produtoAtual) {
      // Editar produto existente
      setProdutos(produtos.map((p) => (p.id === produtoAtual.id ? { ...formData, id: produtoAtual.id } : p)))
    } else {
      // Adicionar novo produto
      setProdutos([
        ...produtos,
        {
          id: produtos.length + 1,
          ...formData,
        },
      ])
    }

    setDialogOpen(false)
    setProdutoAtual(null)
    setFormData({
      codigo: "",
      nome: "",
      categoria: "",
      estoque: 0,
      minimo: 0,
    })
  }

  const handleEdit = (produto: any) => {
    setProdutoAtual(produto)
    setFormData({
      codigo: produto.codigo,
      nome: produto.nome,
      categoria: produto.categoria,
      estoque: produto.estoque,
      minimo: produto.minimo,
    })
    setDialogOpen(true)
  }

  const handleDelete = (id: number) => {
    if (confirm("Tem certeza que deseja excluir este produto?")) {
      setProdutos(produtos.filter((p) => p.id !== id))
    }
  }

  const handleAddNew = () => {
    setProdutoAtual(null)
    setFormData({
      codigo: "",
      nome: "",
      categoria: "",
      estoque: 0,
      minimo: 0,
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
                <th className="text-left py-3 px-4">Categoria</th>
                <th className="text-left py-3 px-4">Estoque</th>
                <th className="text-left py-3 px-4">Mínimo</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3 px-4">Ações</th>
              </tr>
            </thead>
            <tbody>
              {produtosFiltrados.map((produto) => (
                <tr key={produto.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{produto.codigo}</td>
                  <td className="py-3 px-4">{produto.nome}</td>
                  <td className="py-3 px-4">{produto.categoria}</td>
                  <td className="py-3 px-4">{produto.estoque}</td>
                  <td className="py-3 px-4">{produto.minimo}</td>
                  <td className="py-3 px-4">
                    {produto.estoque <= produto.minimo ? (
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
                      <Button variant="outline" size="icon" onClick={() => handleDelete(produto.id)}>
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
                <Label htmlFor="codigo">Código</Label>
                <Input id="codigo" name="codigo" value={formData.codigo} onChange={handleInputChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="categoria">Categoria</Label>
                <Select value={formData.categoria} onValueChange={handleSelectChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Periféricos">Periféricos</SelectItem>
                    <SelectItem value="Monitores">Monitores</SelectItem>
                    <SelectItem value="Áudio">Áudio</SelectItem>
                    <SelectItem value="Armazenamento">Armazenamento</SelectItem>
                    <SelectItem value="Componentes">Componentes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="nome">Nome do Produto</Label>
              <Input id="nome" name="nome" value={formData.nome} onChange={handleInputChange} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="estoque">Estoque Atual</Label>
                <Input
                  id="estoque"
                  name="estoque"
                  type="number"
                  min="0"
                  value={formData.estoque}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="minimo">Estoque Mínimo</Label>
                <Input
                  id="minimo"
                  name="minimo"
                  type="number"
                  min="0"
                  value={formData.minimo}
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

