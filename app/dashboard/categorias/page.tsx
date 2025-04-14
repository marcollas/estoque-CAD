"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Package, Plus, Search, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import Loading from "@/components/Loading"
import { Label } from "@/components/ui/label"
import { useCategoria } from "@/hooks/useCategoria"
import ProtectedRoute from "@/components/ProtectedRoutes"
import type { CategoriaType } from "@/types/categoriaType"
import { useAuth } from "@/contexts/UsuarioContext"

export default function categoriaPage() {
  const {isAutenticado} = useAuth()
  const [busca, setBusca] = useState("")
  const [categoriaAtual, setCategoriaAtual] = useState<any>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [formData, setFormData] = useState<CategoriaType>({
    catProId: 0,
    catProNome: "" 
  })

  const categoriaHook = useCategoria()
  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          categoriaHook.listarCategoria()
        ])
      } catch (error) {
        console.error("Erro ao carregar dados:", error)
      }
    }
  
    if(isAutenticado){
      fetchData()
    }
    
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (categoriaAtual) {
        // Modo Edição - PUT request
        categoriaHook.atualizarCategoria(categoriaAtual.catProId, formData)
      } else {
        // Modo Cadastro - POST request
        categoriaHook.criarCategoria(formData)
      }
  
      // Fecha o diálogo e reseta o formulário
      setDialogOpen(false);
      setCategoriaAtual(null);
      setFormData({
        catProId: 0,
        catProNome: "" 
      });
  
    } catch (error) {
      console.error("Erro ao salvar categoria:", error);
      alert("Ocorreu um erro ao processar sua solicitação.");
    }
  }

  const categoriaFiltrados = categoriaHook.categoria.filter(
    (categoria: CategoriaType) =>
      (categoria.catProNome?.toLowerCase() || '').includes(busca.toLowerCase())
  )

  //Campo recebe o dados do formulário editado
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: name === "proQtd" || name === "proEstoqueMin" ? Number.parseInt(value) : value,
    })
  }
  

  const handleEdit = (categoria: CategoriaType) => {
    //console.log(categoria)
    setCategoriaAtual(categoria)
    setFormData({
      catProId: categoria.catProId,
      catProNome: categoria.catProNome
    })
    setDialogOpen(true)
  }

  const handleDelete = (id: number) => {
    if (confirm("Tem certeza que deseja inativar este categoria?")) {
      categoriaHook.inativarCategoria(id)
    }
  }

  const handleAddNew = () => {
    setCategoriaAtual(null)
    setFormData({
      catProId: 0,
      catProNome: ""
    })
    setDialogOpen(true)
  }

  if (categoriaHook.loading) return <Loading />;

  return (
    <ProtectedRoute>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Package className="h-6 w-6" />
            Gerenciamento de Categoria
          </h1>
          <Button onClick={handleAddNew} className="bg-[#1e3a8a]">
            <Plus className="h-4 w-4 mr-2" />
            Nova categoria
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar Categoria..."
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
                  <th className="text-left py-3 px-4">Nome</th>
                  <th className="text-left py-3 px-4">Ações</th>
                </tr>
              </thead>
              <tbody>
                {categoriaFiltrados.map((categoria, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{categoria.catProNome}</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button variant="outline" size="icon" onClick={() => handleEdit(categoria)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => handleDelete(categoria.catProId)}>
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
              <DialogTitle>{categoriaAtual ? "Editar categoria" : "Novo categoria"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">

              <div className="space-y-2">
                <Label htmlFor="nome">Nome da categoria</Label>
                <Input id="nome" name="catProNome" value={formData.catProNome} onChange={handleInputChange} required />
              </div>
    
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" className="bg-[#1e3a8a]">
                  {categoriaAtual ? "Atualizar" : "Cadastrar"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </ProtectedRoute>
  )
}

