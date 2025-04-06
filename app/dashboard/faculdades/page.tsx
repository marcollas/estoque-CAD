"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Package, Plus, Search, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useFaculdade } from "@/hooks/useFaculdade"
import type { FaculdadeType } from "@/types/faculdadeType"

export default function faculdadePage() {
  const [busca, setBusca] = useState("")
  const [faculdadeAtual, setfaculdadeAtual] = useState<any>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [formData, setFormData] = useState<FaculdadeType>({
    facId: 0,
    facNome: "",
    facSigla: ""
  })

  const faculdadeHook = useFaculdade()
  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          faculdadeHook.listarFaculdade()
        ])
      } catch (error) {
        console.error("Erro ao carregar dados:", error)
      }
    }
  
    fetchData()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (faculdadeAtual) {
        // Modo Edição - PUT request
        faculdadeHook.atualizarFaculdade(faculdadeAtual.facId, formData)
      } else {
        // Modo Cadastro - POST request
        faculdadeHook.criarFaculdade(formData)
      }
  
      // Fecha o diálogo e reseta o formulário
      setDialogOpen(false);
      setfaculdadeAtual(null);
      setFormData({
        facId: 0,
        facNome: "",
        facSigla: ""
      });
  
    } catch (error) {
      console.error("Erro ao salvar Faculdade:", error);
      alert("Ocorreu um erro ao processar sua solicitação.");
    }
  }

  const faculdadeFiltrados = faculdadeHook.faculdade.filter(
    (faculdade: FaculdadeType) =>
      (faculdade.facNome?.toLowerCase() || '').includes(busca.toLowerCase()) ||
      (faculdade.facSigla?.toLowerCase() || '').includes(busca.toLowerCase())
  )

  //Campo recebe o dados do formulário editado
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }
  

  const handleEdit = (faculdade: FaculdadeType) => {
    //console.log(Faculdade)
    setfaculdadeAtual(faculdade)
    setFormData({
      facId: faculdade.facId,
      facNome: faculdade.facNome,
      facSigla: faculdade.facSigla || ""
    })
    setDialogOpen(true)
  }

  const handleDelete = (id: number) => {
    if (confirm("Tem certeza que deseja inativar este Faculdade?")) {
      faculdadeHook.inativarFaculdade(id)
    }
  }

  const handleAddNew = () => {
    setfaculdadeAtual(null)
    setFormData({
      facId: 0,
      facNome: "",
      facSigla: ""
    })
    setDialogOpen(true)
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Package className="h-6 w-6" />
          Gerenciamento de Faculdade
        </h1>
        <Button onClick={handleAddNew} className="bg-[#1e3a8a]">
          <Plus className="h-4 w-4 mr-2" />
          Nova Faculdade
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar Faculdade..."
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
                <th className="text-left py-3 px-4">Sigla</th>
                <th className="text-left py-3 px-4">Ações</th>
              </tr>
            </thead>
            <tbody>
              {faculdadeFiltrados.map((faculdade, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{faculdade.facNome}</td>
                  <td className="py-3 px-4">{faculdade.facSigla}</td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon" onClick={() => handleEdit(faculdade)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => handleDelete(faculdade.facId)}>
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
            <DialogTitle>{faculdadeAtual ? "Editar Faculdade" : "Novo Faculdade"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">

            <div className="space-y-2">
              <Label htmlFor="nome">Nome da Faculdade</Label>
              <Input id="nome" name="facNome" value={formData.facNome} onChange={handleInputChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nome">Sigla da Faculdade</Label>
              <Input id="nome" name="facSigla" value={formData.facSigla} onChange={handleInputChange} required />
            </div>
  
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-[#1e3a8a]">
                {faculdadeAtual ? "Atualizar" : "Cadastrar"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

