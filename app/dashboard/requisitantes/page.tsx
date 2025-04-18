"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Package, Plus, Search, Edit, Trash2, UserRoundPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { url, port } from '../../../configApi.json'
import Loading from "@/components/Loading"
import { useRequisitante } from "@/hooks/useRequisitante"
import { useFaculdade } from "@/hooks/useFaculdade"
import type { RequisitanteType } from "@/types/requisitanteType"
import { useAuth } from "@/contexts/UsuarioContext"
import ProtectedRoute from "@/components/ProtectedRoutes"

export default function RequisitantesPage() {
  const {isAutenticado} = useAuth()
  const [busca, setBusca] = useState("")
  const [requisitanteAtual, setRequisitanteAtual] = useState<any>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [formData, setFormData] = useState<RequisitanteType>({
    reqId: 0,
    reqNome: "",
    reqFacNome: "",
    reqFacSigla: "",
    reqFaqId: null
  })

  const requisitanteHook = useRequisitante()
  const faculdadeHook = useFaculdade()

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          requisitanteHook.listarRequisitante(),
          faculdadeHook.listarFaculdade()
        ])
      } catch (error) {
        console.error("Erro ao carregar dados:", error)
      }
    }
    console.log(requisitanteHook.requisitante)
    if(isAutenticado){
      fetchData()
    }
    
  }, [isAutenticado])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (requisitanteAtual) {
        // Modo Edição - PUT request
        requisitanteHook.atualizarRequisitante(requisitanteAtual.reqId, formData)
      } else {
        // Modo Cadastro - POST request
        requisitanteHook.criarRequisitante(formData)
      }
  
      // Fecha o diálogo e reseta o formulário
      setDialogOpen(false);
      setRequisitanteAtual(null);
      setFormData({
        reqId: 0,
        reqNome: "",
        reqFacNome: "",
        reqFacSigla: "",
        reqFaqId: null
      });
  
    } catch (error) {
      console.error("Erro ao salvar Requisitante:", error);
      alert("Ocorreu um erro ao processar sua solicitação.");
    }
  }

  const requisitantesFiltrados = requisitanteHook.requisitante.filter(
    (requisitante: RequisitanteType) =>
      (requisitante.reqNome?.toLowerCase() || '').includes(busca.toLowerCase()) ||
      (requisitante.reqFacNome?.toLowerCase() || '').includes(busca.toLowerCase()) ||
      (requisitante.reqFacSigla?.toLowerCase() || '').includes(busca.toLowerCase())
  )

  //Campo recebe o dados do formulário editado
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement> |  React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handlefaculdadeChange = (faculdade: string) => {
    setFormData({
      ...formData,
      reqFaqId: faculdade == "0" ? null : Number(faculdade),
    })
  }

  const handleEdit = (requisitante: RequisitanteType) => {
    setRequisitanteAtual(requisitante)
    //console.log(requisitante)
    setFormData({
      reqId: requisitante.reqId,
      reqNome: requisitante.reqNome,
      reqFacNome: requisitante.reqFacNome,
      reqFacSigla: requisitante.reqFacSigla,
      reqFaqId: requisitante.reqFaqId
    })
    setDialogOpen(true)
  }

  const handleDelete = (id: number) => {
    if (confirm("Tem certeza que deseja inativar este Requisitante?")) {
      requisitanteHook.inativarRequisitante(id)
    }
  }

  const handleAddNew = () => {
    setRequisitanteAtual(null)
    setFormData({
      reqId: 0,
      reqNome: "",
      reqFacNome: "",
      reqFacSigla: "",
      reqFaqId: null
    })
    setDialogOpen(true)
  }
  if (requisitanteHook.loading) return <Loading />;

  return (
    <ProtectedRoute>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <UserRoundPlus className="h-6 w-6" />
            Gerenciamento de Requisitantes
          </h1>
          <Button onClick={handleAddNew} className="bg-[#1e3a8a]">
            <Plus className="h-4 w-4 mr-2" />
            Novo Requisitante
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar Requisitantes..."
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
                  <th className="text-left py-3 px-4">Faculdade</th>
                  <th className="text-left py-3 px-4">Sigla faculdade</th>
                  <th className="text-left py-3 px-4">Ações</th>
                </tr>
              </thead>
              <tbody>
                {requisitantesFiltrados.map((requisitante, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{requisitante.reqNome}</td>
                    <td className="py-3 px-4">{requisitante.reqFacNome}</td>
                    <td className="py-3 px-4">{requisitante.reqFacSigla}</td>

                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button variant="outline" size="icon" onClick={() => handleEdit(requisitante)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => handleDelete(requisitante.reqId)}>
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
              <DialogTitle>{requisitanteAtual ? "Editar Requisitante" : "Novo Requisitante"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome do Requisitante</Label>
                <Input id="nome" name="reqNome" value={formData.reqNome} onChange={handleInputChange} required />
              </div> 
              <div className="space-y-2">
                <Label htmlFor="categoria">Faculdades</Label>
                <Select value={formData.reqFaqId?.toString() ?? ""} onValueChange={handlefaculdadeChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                  <SelectItem value={"0"}>Selecione...</SelectItem>
                  {
                    faculdadeHook.faculdade.map((faculdade, index) => {
                      return <SelectItem key={index} value={faculdade.facId.toString()}>{faculdade.facNome} - {faculdade.facSigla}</SelectItem>
                    })
                  }
                  </SelectContent>
                </Select>
              </div>           
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" className="bg-[#1e3a8a]">
                  {requisitanteAtual ? "Atualizar" : "Cadastrar"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </ProtectedRoute>
  )
}

