"use client"

import type React from "react"

import { useState } from "react"
import { BookOpen, Plus, Search, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

// Dados de exemplo
const departamentosIniciais = [
  {
    id: 1,
    codigo: "ADM",
    nome: "Administração",
    responsavel: "João Silva",
    email: "joao.silva@faculdade.edu.br",
    ramal: "1001",
  },
  {
    id: 2,
    codigo: "RH",
    nome: "Recursos Humanos",
    responsavel: "Maria Oliveira",
    email: "maria.oliveira@faculdade.edu.br",
    ramal: "1002",
  },
  {
    id: 3,
    codigo: "FIN",
    nome: "Financeiro",
    responsavel: "Carlos Santos",
    email: "carlos.santos@faculdade.edu.br",
    ramal: "1003",
  },
  {
    id: 4,
    codigo: "SEC",
    nome: "Secretaria",
    responsavel: "Ana Pereira",
    email: "ana.pereira@faculdade.edu.br",
    ramal: "1004",
  },
  {
    id: 5,
    codigo: "COORD",
    nome: "Coordenação de Cursos",
    responsavel: "Paulo Mendes",
    email: "paulo.mendes@faculdade.edu.br",
    ramal: "1005",
  },
  {
    id: 6,
    codigo: "BIB",
    nome: "Biblioteca",
    responsavel: "Fernanda Lima",
    email: "fernanda.lima@faculdade.edu.br",
    ramal: "1006",
  },
  {
    id: 7,
    codigo: "LAB",
    nome: "Laboratórios",
    responsavel: "Ricardo Gomes",
    email: "ricardo.gomes@faculdade.edu.br",
    ramal: "1007",
  },
]

export default function DepartamentosPage() {
  const [departamentos, setDepartamentos] = useState(departamentosIniciais)
  const [busca, setBusca] = useState("")
  const [departamentoAtual, setDepartamentoAtual] = useState<any>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    codigo: "",
    nome: "",
    responsavel: "",
    email: "",
    ramal: "",
  })

  const departamentosFiltrados = departamentos.filter(
    (departamento) =>
      departamento.nome.toLowerCase().includes(busca.toLowerCase()) ||
      departamento.codigo.toLowerCase().includes(busca.toLowerCase()) ||
      departamento.responsavel.toLowerCase().includes(busca.toLowerCase()),
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (departamentoAtual) {
      // Editar departamento existente
      setDepartamentos(
        departamentos.map((d) => (d.id === departamentoAtual.id ? { ...formData, id: departamentoAtual.id } : d)),
      )
    } else {
      // Adicionar novo departamento
      setDepartamentos([
        ...departamentos,
        {
          id: departamentos.length + 1,
          ...formData,
        },
      ])
    }

    setDialogOpen(false)
    setDepartamentoAtual(null)
    setFormData({
      codigo: "",
      nome: "",
      responsavel: "",
      email: "",
      ramal: "",
    })
  }

  const handleEdit = (departamento: any) => {
    setDepartamentoAtual(departamento)
    setFormData({
      codigo: departamento.codigo,
      nome: departamento.nome,
      responsavel: departamento.responsavel,
      email: departamento.email,
      ramal: departamento.ramal,
    })
    setDialogOpen(true)
  }

  const handleDelete = (id: number) => {
    if (confirm("Tem certeza que deseja excluir este departamento?")) {
      setDepartamentos(departamentos.filter((d) => d.id !== id))
    }
  }

  const handleAddNew = () => {
    setDepartamentoAtual(null)
    setFormData({
      codigo: "",
      nome: "",
      responsavel: "",
      email: "",
      ramal: "",
    })
    setDialogOpen(true)
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <BookOpen className="h-6 w-6" />
          Gerenciamento de Departamentos
        </h1>
        <Button onClick={handleAddNew} className="bg-[#1e3a8a]">
          <Plus className="h-4 w-4 mr-2" />
          Novo Departamento
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar departamentos..."
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
                <th className="text-left py-3 px-4">Responsável</th>
                <th className="text-left py-3 px-4">Email</th>
                <th className="text-left py-3 px-4">Ramal</th>
                <th className="text-left py-3 px-4">Ações</th>
              </tr>
            </thead>
            <tbody>
              {departamentosFiltrados.map((departamento) => (
                <tr key={departamento.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{departamento.codigo}</td>
                  <td className="py-3 px-4">{departamento.nome}</td>
                  <td className="py-3 px-4">{departamento.responsavel}</td>
                  <td className="py-3 px-4">{departamento.email}</td>
                  <td className="py-3 px-4">{departamento.ramal}</td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon" onClick={() => handleEdit(departamento)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => handleDelete(departamento.id)}>
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
            <DialogTitle>{departamentoAtual ? "Editar Departamento" : "Novo Departamento"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="codigo">Código</Label>
                <Input id="codigo" name="codigo" value={formData.codigo} onChange={handleInputChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nome">Nome</Label>
                <Input id="nome" name="nome" value={formData.nome} onChange={handleInputChange} required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="responsavel">Responsável</Label>
              <Input
                id="responsavel"
                name="responsavel"
                value={formData.responsavel}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ramal">Ramal</Label>
                <Input id="ramal" name="ramal" value={formData.ramal} onChange={handleInputChange} required />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-[#1e3a8a]">
                {departamentoAtual ? "Atualizar" : "Cadastrar"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

