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
import { useUnidades } from "@/hooks/useUnidade"
import type { UnidadeType } from "@/types/unidadeType"

export default function unidadesPage() {
  const [busca, setBusca] = useState("")
  const [unidadeAtual, setUnidadeAtual] = useState<any>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [formData, setFormData] = useState<UnidadeType>({
    unNome: "",
    unSigla: "",
    unId: 0
  })

  const unidadesHook = useUnidades()
  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          unidadesHook.listarUnidades()
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
      if (unidadeAtual) {
        // Modo Edição - PUT request
        unidadesHook.atualizarUnidade(unidadeAtual.unId, formData)
      } else {
        // Modo Cadastro - POST request
        unidadesHook.criarUnidade(formData)
      }
  
      // Fecha o diálogo e reseta o formulário
      setDialogOpen(false);
      setUnidadeAtual(null);
      setFormData({
        unNome: "",
        unSigla: "",
        unId: -1
      });
  
    } catch (error) {
      console.error("Erro ao salvar unidade:", error);
      alert("Ocorreu um erro ao processar sua solicitação.");
    }
  }

  const unidadesFiltrados = unidadesHook.unidades.filter(
    (unidade: UnidadeType) =>
      (unidade.unNome?.toLowerCase() || '').includes(busca.toLowerCase()) ||
      (unidade.unSigla?.toLowerCase() || '').includes(busca.toLowerCase()),
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
      unId: Number(unidade),
    })
  }
  

  const handleEdit = (unidade: UnidadeType) => {
    //console.log(unidade)
    setUnidadeAtual(unidade)
    setFormData({
      unNome: unidade.unNome,
      unSigla: unidade.unSigla,
      unId: unidade.unId
    })
    setDialogOpen(true)
  }

  const handleDelete = (id: number) => {
    if (confirm("Tem certeza que deseja inativar este unidade?")) {
      unidadesHook.inativarUnidade(id)
    }
  }

  const handleAddNew = () => {
    setUnidadeAtual(null)
    setFormData({
      unNome: "",
      unSigla: "",
      unId: -1
    })
    setDialogOpen(true)
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Package className="h-6 w-6" />
          Gerenciamento de Unidades
        </h1>
        <Button onClick={handleAddNew} className="bg-[#1e3a8a]">
          <Plus className="h-4 w-4 mr-2" />
          Nova unidade
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar unidades..."
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
                <th className="text-left py-3 px-4">Ações</th>
              </tr>
            </thead>
            <tbody>
              {unidadesFiltrados.map((unidade, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{unidade.unNome}</td>
                  <td className="py-3 px-4">{unidade.unSigla}</td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon" onClick={() => handleEdit(unidade)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => handleDelete(unidade.unId)}>
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
            <DialogTitle>{unidadeAtual ? "Editar unidade" : "Novo unidade"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">

            <div className="space-y-2">
              <Label htmlFor="nome">Nome da unidade</Label>
              <Input id="nome" name="unNome" value={formData.unNome} onChange={handleInputChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nome">Sigla</Label>
              <Input id="nome" name="unSigla" value={formData.unSigla} onChange={handleInputChange} required />
            </div>
  
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-[#1e3a8a]">
                {unidadeAtual ? "Atualizar" : "Cadastrar"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

