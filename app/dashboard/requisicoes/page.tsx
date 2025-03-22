"use client"

import type React from "react"

import { useState } from "react"
import { FileText, Plus, Search, Eye, Check, X, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { format } from "date-fns"

// Dados de exemplo
const departamentos = [
  { id: 1, nome: "Administração" },
  { id: 2, nome: "Recursos Humanos" },
  { id: 3, nome: "Financeiro" },
  { id: 4, nome: "Secretaria" },
  { id: 5, nome: "Coordenação de Cursos" },
  { id: 6, nome: "Biblioteca" },
  { id: 7, nome: "Laboratórios" },
]

const materiaisDisponiveis = [
  { id: 1, codigo: "MAT001", nome: "Papel A4", unidade: "Resma", estoque: 1500 },
  { id: 2, codigo: "MAT002", nome: "Caneta Esferográfica Azul", unidade: "Unidade", estoque: 350 },
  { id: 3, codigo: "MAT003", nome: "Grampeador", unidade: "Unidade", estoque: 78 },
  { id: 4, codigo: "MAT004", nome: "Pasta Suspensa", unidade: "Unidade", estoque: 200 },
  { id: 5, codigo: "MAT005", nome: "Toner Impressora HP", unidade: "Unidade", estoque: 25 },
  { id: 6, codigo: "MAT006", nome: "Clips", unidade: "Caixa", estoque: 120 },
  { id: 7, codigo: "MAT007", nome: "Envelope A4", unidade: "Unidade", estoque: 300 },
  { id: 8, codigo: "MAT008", nome: "Caderno Universitário", unidade: "Unidade", estoque: 45 },
]

const requisicoesIniciais = [
  {
    id: 1,
    numero: "REQ-2025-001",
    data: new Date(2025, 2, 22),
    departamento: "Administração",
    solicitante: "João Silva",
    status: "Pendente",
    itens: [
      { material: "Papel A4", quantidade: 5, unidade: "Resma" },
      { material: "Caneta Esferográfica Azul", quantidade: 20, unidade: "Unidade" },
    ],
    observacao: "Material para uso no setor administrativo",
  },
  {
    id: 2,
    numero: "REQ-2025-002",
    data: new Date(2025, 2, 21),
    departamento: "Recursos Humanos",
    solicitante: "Maria Oliveira",
    status: "Aprovada",
    itens: [
      { material: "Pasta Suspensa", quantidade: 30, unidade: "Unidade" },
      { material: "Clips", quantidade: 5, unidade: "Caixa" },
    ],
    observacao: "Material para organização de documentos",
  },
  {
    id: 3,
    numero: "REQ-2025-003",
    data: new Date(2025, 2, 20),
    departamento: "Financeiro",
    solicitante: "Carlos Santos",
    status: "Aprovada",
    itens: [
      { material: "Envelope A4", quantidade: 50, unidade: "Unidade" },
      { material: "Caderno Universitário", quantidade: 2, unidade: "Unidade" },
    ],
    observacao: "Material para uso no departamento financeiro",
  },
  {
    id: 4,
    numero: "REQ-2025-004",
    data: new Date(2025, 2, 19),
    departamento: "Secretaria",
    solicitante: "Ana Pereira",
    status: "Negada",
    itens: [{ material: "Toner Impressora HP", quantidade: 3, unidade: "Unidade" }],
    observacao: "Estoque insuficiente no momento",
  },
]

export default function RequisicoesPage() {
  const [requisicoes, setRequisicoes] = useState(requisicoesIniciais)
  const [busca, setBusca] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [detalhesDialogOpen, setDetalhesDialogOpen] = useState(false)
  const [requisicaoAtual, setRequisicaoAtual] = useState<any>(null)
  const [departamento, setDepartamento] = useState("")
  const [solicitante, setSolicitante] = useState("")
  const [observacao, setObservacao] = useState("")
  const [itensRequisicao, setItensRequisicao] = useState<any[]>([])
  const [materialSelecionado, setMaterialSelecionado] = useState("")
  const [quantidade, setQuantidade] = useState(1)

  const requisicoesFiltradas = requisicoes.filter(
    (requisicao) =>
      requisicao.numero.toLowerCase().includes(busca.toLowerCase()) ||
      requisicao.departamento.toLowerCase().includes(busca.toLowerCase()) ||
      requisicao.solicitante.toLowerCase().includes(busca.toLowerCase()) ||
      requisicao.status.toLowerCase().includes(busca.toLowerCase()),
  )

  const handleAddItem = () => {
    if (!materialSelecionado || quantidade <= 0) return

    const material = materiaisDisponiveis.find((m) => m.nome === materialSelecionado)
    if (!material) return

    setItensRequisicao([
      ...itensRequisicao,
      {
        material: material.nome,
        quantidade,
        unidade: material.unidade,
      },
    ])

    setMaterialSelecionado("")
    setQuantidade(1)
  }

  const handleRemoveItem = (index: number) => {
    setItensRequisicao(itensRequisicao.filter((_, i) => i !== index))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!departamento || !solicitante || itensRequisicao.length === 0) return

    // Criar nova requisição
    const novaRequisicao = {
      id: requisicoes.length + 1,
      numero: `REQ-2025-${String(requisicoes.length + 1).padStart(3, "0")}`,
      data: new Date(),
      departamento,
      solicitante,
      status: "Pendente",
      itens: itensRequisicao,
      observacao,
    }

    setRequisicoes([...requisicoes, novaRequisicao])

    // Limpar formulário
    setDepartamento("")
    setSolicitante("")
    setObservacao("")
    setItensRequisicao([])
    setDialogOpen(false)
  }

  const handleVerDetalhes = (requisicao: any) => {
    setRequisicaoAtual(requisicao)
    setDetalhesDialogOpen(true)
  }

  const handleAprovarRequisicao = (id: number) => {
    if (confirm("Deseja aprovar esta requisição?")) {
      setRequisicoes(requisicoes.map((req) => (req.id === id ? { ...req, status: "Aprovada" } : req)))
    }
  }

  const handleNegarRequisicao = (id: number) => {
    if (confirm("Deseja negar esta requisição?")) {
      setRequisicoes(requisicoes.map((req) => (req.id === id ? { ...req, status: "Negada" } : req)))
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <FileText className="h-6 w-6" />
          Requisições de Materiais
        </h1>
        <Button onClick={() => setDialogOpen(true)} className="bg-[#1e3a8a]">
          <Plus className="h-4 w-4 mr-2" />
          Nova Requisição
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar requisições..."
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
                <th className="text-left py-3 px-4">Número</th>
                <th className="text-left py-3 px-4">Data</th>
                <th className="text-left py-3 px-4">Departamento</th>
                <th className="text-left py-3 px-4">Solicitante</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3 px-4">Ações</th>
              </tr>
            </thead>
            <tbody>
              {requisicoesFiltradas.map((requisicao) => (
                <tr key={requisicao.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{requisicao.numero}</td>
                  <td className="py-3 px-4">{format(requisicao.data, "dd/MM/yyyy")}</td>
                  <td className="py-3 px-4">{requisicao.departamento}</td>
                  <td className="py-3 px-4">{requisicao.solicitante}</td>
                  <td className="py-3 px-4">
                    {requisicao.status === "Pendente" && (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">Pendente</span>
                    )}
                    {requisicao.status === "Aprovada" && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Aprovada</span>
                    )}
                    {requisicao.status === "Negada" && (
                      <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">Negada</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon" onClick={() => handleVerDetalhes(requisicao)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      {requisicao.status === "Pendente" && (
                        <>
                          <Button
                            variant="outline"
                            size="icon"
                            className="text-green-600"
                            onClick={() => handleAprovarRequisicao(requisicao.id)}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="text-red-600"
                            onClick={() => handleNegarRequisicao(requisicao.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Nova Requisição */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Nova Requisição de Material</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="departamento">Departamento</Label>
                <Select value={departamento} onValueChange={setDepartamento}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o departamento" />
                  </SelectTrigger>
                  <SelectContent>
                    {departamentos.map((dep) => (
                      <SelectItem key={dep.id} value={dep.nome}>
                        {dep.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="solicitante">Solicitante</Label>
                <Input id="solicitante" value={solicitante} onChange={(e) => setSolicitante(e.target.value)} required />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Itens da Requisição</Label>
              <div className="border rounded-md p-4">
                <div className="grid grid-cols-[1fr_auto_auto] gap-2 mb-4">
                  <Select value={materialSelecionado} onValueChange={setMaterialSelecionado}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o material" />
                    </SelectTrigger>
                    <SelectContent>
                      {materiaisDisponiveis.map((mat) => (
                        <SelectItem key={mat.id} value={mat.nome}>
                          {mat.codigo} - {mat.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    type="number"
                    min="1"
                    value={quantidade}
                    onChange={(e) => setQuantidade(Number.parseInt(e.target.value))}
                    className="w-24"
                  />
                  <Button type="button" onClick={handleAddItem}>
                    Adicionar
                  </Button>
                </div>

                {itensRequisicao.length > 0 ? (
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Material</th>
                        <th className="text-left py-2">Quantidade</th>
                        <th className="text-left py-2">Unidade</th>
                        <th className="text-left py-2"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {itensRequisicao.map((item, index) => (
                        <tr key={index} className="border-b">
                          <td className="py-2">{item.material}</td>
                          <td className="py-2">{item.quantidade}</td>
                          <td className="py-2">{item.unidade}</td>
                          <td className="py-2">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveItem(index)}
                              className="text-red-500 h-8 w-8"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    <AlertCircle className="h-5 w-5 mx-auto mb-2" />
                    Nenhum item adicionado
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="observacao">Observações</Label>
              <Textarea
                id="observacao"
                value={observacao}
                onChange={(e) => setObservacao(e.target.value)}
                placeholder="Informações adicionais sobre a requisição"
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-[#1e3a8a]"
                disabled={!departamento || !solicitante || itensRequisicao.length === 0}
              >
                Enviar Requisição
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal de Detalhes da Requisição */}
      <Dialog open={detalhesDialogOpen} onOpenChange={setDetalhesDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detalhes da Requisição</DialogTitle>
          </DialogHeader>
          {requisicaoAtual && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Número</p>
                  <p className="font-medium">{requisicaoAtual.numero}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Data</p>
                  <p className="font-medium">{format(requisicaoAtual.data, "dd/MM/yyyy")}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Departamento</p>
                  <p className="font-medium">{requisicaoAtual.departamento}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Solicitante</p>
                  <p className="font-medium">{requisicaoAtual.solicitante}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p>
                    {requisicaoAtual.status === "Pendente" && (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">Pendente</span>
                    )}
                    {requisicaoAtual.status === "Aprovada" && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Aprovada</span>
                    )}
                    {requisicaoAtual.status === "Negada" && (
                      <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">Negada</span>
                    )}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-2">Itens Solicitados</p>
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Material</th>
                      <th className="text-left py-2">Quantidade</th>
                      <th className="text-left py-2">Unidade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requisicaoAtual.itens.map((item: any, index: number) => (
                      <tr key={index} className="border-b">
                        <td className="py-2">{item.material}</td>
                        <td className="py-2">{item.quantidade}</td>
                        <td className="py-2">{item.unidade}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {requisicaoAtual.observacao && (
                <div>
                  <p className="text-sm text-gray-500">Observações</p>
                  <p>{requisicaoAtual.observacao}</p>
                </div>
              )}

              <div className="flex justify-end">
                <Button onClick={() => setDetalhesDialogOpen(false)}>Fechar</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

