"use client"

import type React from "react"

import { useState } from "react"
import { Package, Plus, Search, Edit, Trash2, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Dados de exemplo
const materiaisIniciais = [
  {
    id: 1,
    codigo: "MAT001",
    nome: "Papel A4",
    categoria: "Material de Escritório",
    unidade: "Resma",
    estoque: 1500,
    minimo: 200,
  },
  {
    id: 2,
    codigo: "MAT002",
    nome: "Caneta Esferográfica Azul",
    categoria: "Material de Escritório",
    unidade: "Unidade",
    estoque: 350,
    minimo: 100,
  },
  {
    id: 3,
    codigo: "MAT003",
    nome: "Grampeador",
    categoria: "Material de Escritório",
    unidade: "Unidade",
    estoque: 78,
    minimo: 20,
  },
  {
    id: 4,
    codigo: "MAT004",
    nome: "Pasta Suspensa",
    categoria: "Arquivo",
    unidade: "Unidade",
    estoque: 200,
    minimo: 50,
  },
  {
    id: 5,
    codigo: "MAT005",
    nome: "Toner Impressora HP",
    categoria: "Informática",
    unidade: "Unidade",
    estoque: 25,
    minimo: 10,
  },
  {
    id: 6,
    codigo: "MAT006",
    nome: "Clips",
    categoria: "Material de Escritório",
    unidade: "Caixa",
    estoque: 120,
    minimo: 30,
  },
  {
    id: 7,
    codigo: "MAT007",
    nome: "Envelope A4",
    categoria: "Material de Escritório",
    unidade: "Unidade",
    estoque: 300,
    minimo: 100,
  },
  {
    id: 8,
    codigo: "MAT008",
    nome: "Caderno Universitário",
    categoria: "Material de Escritório",
    unidade: "Unidade",
    estoque: 45,
    minimo: 15,
  },
]

export default function MateriaisPage() {
  const [materiais, setMateriais] = useState(materiaisIniciais)
  const [busca, setBusca] = useState("")
  const [materialAtual, setMaterialAtual] = useState<any>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    codigo: "",
    nome: "",
    categoria: "",
    unidade: "",
    estoque: 0,
    minimo: 0,
  })

  const materiaisFiltrados = materiais.filter(
    (material) =>
      material.nome.toLowerCase().includes(busca.toLowerCase()) ||
      material.codigo.toLowerCase().includes(busca.toLowerCase()) ||
      material.categoria.toLowerCase().includes(busca.toLowerCase()),
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: name === "estoque" || name === "minimo" ? Number.parseInt(value) : value,
    })
  }

  const handleSelectChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (materialAtual) {
      // Editar material existente
      setMateriais(materiais.map((p) => (p.id === materialAtual.id ? { ...formData, id: materialAtual.id } : p)))
    } else {
      // Adicionar novo material
      setMateriais([
        ...materiais,
        {
          id: materiais.length + 1,
          ...formData,
        },
      ])
    }

    setDialogOpen(false)
    setMaterialAtual(null)
    setFormData({
      codigo: "",
      nome: "",
      categoria: "",
      unidade: "",
      estoque: 0,
      minimo: 0,
    })
  }

  const handleEdit = (material: any) => {
    setMaterialAtual(material)
    setFormData({
      codigo: material.codigo,
      nome: material.nome,
      categoria: material.categoria,
      unidade: material.unidade,
      estoque: material.estoque,
      minimo: material.minimo,
    })
    setDialogOpen(true)
  }

  const handleDelete = (id: number) => {
    if (confirm("Tem certeza que deseja excluir este material?")) {
      setMateriais(materiais.filter((p) => p.id !== id))
    }
  }

  const handleAddNew = () => {
    setMaterialAtual(null)
    setFormData({
      codigo: "",
      nome: "",
      categoria: "",
      unidade: "",
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
          Gerenciamento de Materiais
        </h1>
        <Button onClick={handleAddNew} className="bg-[#1e3a8a]">
          <Plus className="h-4 w-4 mr-2" />
          Novo Material
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar materiais..."
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
                <th className="text-left py-3 px-4">Unidade</th>
                <th className="text-left py-3 px-4">Estoque</th>
                <th className="text-left py-3 px-4">Mínimo</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3 px-4">Ações</th>
              </tr>
            </thead>
            <tbody>
              {materiaisFiltrados.map((material) => (
                <tr key={material.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{material.codigo}</td>
                  <td className="py-3 px-4">{material.nome}</td>
                  <td className="py-3 px-4">{material.categoria}</td>
                  <td className="py-3 px-4">{material.unidade}</td>
                  <td className="py-3 px-4">{material.estoque}</td>
                  <td className="py-3 px-4">{material.minimo}</td>
                  <td className="py-3 px-4">
                    {material.estoque <= material.minimo ? (
                      <div className="flex items-center">
                        <AlertTriangle className="h-4 w-4 text-amber-500 mr-1" />
                        <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-xs">Baixo</span>
                      </div>
                    ) : (
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Normal</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon" onClick={() => handleEdit(material)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => handleDelete(material.id)}>
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
            <DialogTitle>{materialAtual ? "Editar Material" : "Novo Material"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="codigo">Código</Label>
                <Input id="codigo" name="codigo" value={formData.codigo} onChange={handleInputChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="categoria">Categoria</Label>
                <Select value={formData.categoria} onValueChange={(value) => handleSelectChange("categoria", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Material de Escritório">Material de Escritório</SelectItem>
                    <SelectItem value="Informática">Informática</SelectItem>
                    <SelectItem value="Arquivo">Arquivo</SelectItem>
                    <SelectItem value="Limpeza">Limpeza</SelectItem>
                    <SelectItem value="Mobiliário">Mobiliário</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="nome">Nome do Material</Label>
              <Input id="nome" name="nome" value={formData.nome} onChange={handleInputChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unidade">Unidade de Medida</Label>
              <Select value={formData.unidade} onValueChange={(value) => handleSelectChange("unidade", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Unidade">Unidade</SelectItem>
                  <SelectItem value="Caixa">Caixa</SelectItem>
                  <SelectItem value="Pacote">Pacote</SelectItem>
                  <SelectItem value="Resma">Resma</SelectItem>
                  <SelectItem value="Metro">Metro</SelectItem>
                  <SelectItem value="Litro">Litro</SelectItem>
                </SelectContent>
              </Select>
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
                {materialAtual ? "Atualizar" : "Cadastrar"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

