"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { ArrowRight, CalendarIcon, Plus, Search, ShoppingBag, Trash2, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import { MovimentcaoType } from "@/types/movimentacaoType"
import { useMovimentacao } from "@/hooks/useMovimentacao"
import { useProdutos } from "@/hooks/useProduto"
import { useRequisitante } from "@/hooks/useRequisitante"

// Dados de exemplo
const requisitantesIniciais = [
  { id: 1, nome: "João Silva", departamento: "Administração", matricula: "ADM001" },
  { id: 2, nome: "Maria Oliveira", departamento: "Recursos Humanos", matricula: "RH002" },
  { id: 3, nome: "Carlos Santos", departamento: "Financeiro", matricula: "FIN003" },
  { id: 4, nome: "Ana Pereira", departamento: "Secretaria", matricula: "SEC004" },
  { id: 5, nome: "Paulo Mendes", departamento: "Coordenação de Cursos", matricula: "COORD005" },
  { id: 6, nome: "Fernanda Lima", departamento: "Biblioteca", matricula: "BIB006" },
  { id: 7, nome: "Ricardo Gomes", departamento: "Laboratórios", matricula: "LAB007" },
]

const produtosIniciais = [
  { id: 1, codigo: "MAT001", nome: "Papel A4", unidade: "Resma", estoque: 1500 },
  { id: 2, codigo: "MAT002", nome: "Caneta Esferográfica Azul", unidade: "Unidade", estoque: 350 },
  { id: 3, codigo: "MAT003", nome: "Grampeador", unidade: "Unidade", estoque: 78 },
  { id: 4, codigo: "MAT004", nome: "Pasta Suspensa", unidade: "Unidade", estoque: 200 },
  { id: 5, codigo: "MAT005", nome: "Toner Impressora HP", unidade: "Unidade", estoque: 25 },
  { id: 6, codigo: "MAT006", nome: "Clips", unidade: "Caixa", estoque: 120 },
  { id: 7, codigo: "MAT007", nome: "Envelope A4", unidade: "Unidade", estoque: 300 },
  { id: 8, codigo: "MAT008", nome: "Caderno Universitário", unidade: "Unidade", estoque: 45 },
]

export default function MovimentacoesPage() {
  const movimentacaoHook = useMovimentacao()
  const produtosHook  = useProdutos()
  const requisitanteHook = useRequisitante()
  const [busca, setBusca] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [requisitanteDialogOpen, setRequisitanteDialogOpen] = useState(false)
  const [produtoDialogOpen, setProdutoDialogOpen] = useState(false)
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [requisitantes] = useState(requisitantesIniciais)
  const [produtos] = useState(produtosIniciais)
  const [requisitanteSelecionado, setRequisitanteSelecionado] = useState<any>(null)
  const [buscaRequisitante, setBuscaRequisitante] = useState("")
  const [buscaProduto, setBuscaProduto] = useState("")
  const [produtoSelecionado, setProdutoSelecionado] = useState<any>(null)
  const [quantidade, setQuantidade] = useState(1)
  const [itensSelecionados, setItensSelecionados] = useState<any[]>([])
  const [formData, setFormData] = useState({
    numeroNF: "",
    numeroRequisicao: "",
  })

    useEffect(() => {
      const fetchData = async () => {
        try {
          await Promise.all([
            movimentacaoHook.listarMovimentacao(),
            produtosHook.listarProdutos(),
            requisitanteHook.listarRequisitante()
          ])
        } catch (error) {
          console.error("Erro ao carregar dados:", error)
        }
      }
      fetchData()
      
    }, [])

  const movimentacoesFiltradas = movimentacaoHook.movimentacao.filter(
    (movimentacao) =>
      movimentacao.movNumRequisicao?.toLowerCase().includes(busca.toLowerCase()) ||
      movimentacao.movNf?.toLowerCase().includes(busca.toLowerCase()) ||
      movimentacao.movRequisitante.toLowerCase().includes(busca.toLowerCase()) ||
      movimentacao.movUsuario.toLowerCase().includes(busca.toLowerCase()),
  )

  const requisitantesFiltrados = requisitanteHook.requisitante.filter(
    (requisitante) =>
      requisitante.reqNome.toLowerCase().includes(buscaRequisitante.toLowerCase()) ||
      requisitante.reqFacSigla?.toLowerCase().includes(buscaRequisitante.toLowerCase()) ||
      requisitante.reqFacNome?.toLowerCase().includes(buscaRequisitante.toLowerCase()),
  )

  const produtosFiltrados = produtosHook.produtos.filter(
    (produto) =>
      produto.proNome.toLowerCase().includes(buscaProduto.toLowerCase()) ||
      produto.proSipac.toLowerCase().includes(buscaProduto.toLowerCase()) ||
      produto.proDescricao.toLowerCase().includes(buscaProduto.toLowerCase()) ||
      produto.proUn.toLowerCase().includes(buscaProduto.toLowerCase()),
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSelecionarRequisitante = (requisitante: any) => {
    setRequisitanteSelecionado(requisitante)
    setRequisitanteDialogOpen(false)
  }

  const handleAdicionarProduto = () => {
    if (!produtoSelecionado || quantidade <= 0) return

    // Verificar se o produto já está na lista
    const produtoExistente = itensSelecionados.find((item) => item.produto.id === produtoSelecionado.id)

    if (produtoExistente) {
      // Atualizar a quantidade se o produto já estiver na lista
      setItensSelecionados(
        itensSelecionados.map((item) =>
          item.produto.id === produtoSelecionado.id ? { ...item, quantidade: item.quantidade + quantidade } : item,
        ),
      )
    } else {
      // Adicionar novo produto à lista
      setItensSelecionados([
        ...itensSelecionados,
        {
          produto: produtoSelecionado,
          quantidade,
          unidade: produtoSelecionado.unidade,
        },
      ])
    }

    // Limpar seleção
    setProdutoSelecionado(null)
    setQuantidade(1)
    setProdutoDialogOpen(false)
  }

  const handleRemoverProduto = (index: number) => {
    setItensSelecionados(itensSelecionados.filter((_, i) => i !== index))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

  //   if (!requisitanteSelecionado || itensSelecionados.length === 0 || !date) return

  //   // Criar nova movimentação
  //   const novaMovimentacao = {
  //     id: movimentacoes.length + 1,
  //     data: date,
  //     numeroNF: formData.numeroNF,
  //     numeroRequisicao: formData.numeroRequisicao,
  //     requisitante: requisitanteSelecionado.nome,
  //     departamento: requisitanteSelecionado.departamento,
  //     itens: itensSelecionados.map((item) => ({
  //       produto: item.produto.nome,
  //       quantidade: item.quantidade,
  //       unidade: item.unidade,
  //     })),
  //     total: itensSelecionados.reduce((acc, item) => acc + item.quantidade, 0),
  //   }

  //   setMovimentacoes([...movimentacoes, novaMovimentacao])

  //   // Limpar formulário
  //   setRequisitanteSelecionado(null)
  //   setItensSelecionados([])
  //   setFormData({
  //     numeroNF: "",
  //     numeroRequisicao: "",
  //   })
  //   setDialogOpen(false)
  // }
  }
  const handleNovaMovimentacao = () => {
    setRequisitanteSelecionado(null)
    setItensSelecionados([])
    setFormData({
      numeroNF: "",
      numeroRequisicao: "",
    })
    setDate(new Date())
    setDialogOpen(true)
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <ShoppingBag className="h-6 w-6" />
          Movimentações de Estoque
        </h1>
        <Button onClick={handleNovaMovimentacao} className="bg-[#1e3a8a]">
          <Plus className="h-4 w-4 mr-2" />
          Nova Movimentação
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar movimentações..."
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
                <th className="text-left py-3 px-4">Data</th>
                <th className="text-left py-3 px-4">Horário</th>
                <th className="text-left py-3 px-4">Usuario</th>
                <th className="text-left py-3 px-4">Nº Requisição</th>
                <th className="text-left py-3 px-4">Requisitante</th>
                <th className="text-left py-3 px-4">Itens</th>
              </tr>
            </thead>
            <tbody>
              {movimentacoesFiltradas.map((movimentacao, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{format(movimentacao.movData, "dd/MM/yyyy")}</td>
                  <td className="py-3 px-4">{movimentacao.movHorario}</td>
                  <td className="py-3 px-4">{movimentacao.movUsuario}</td>
                  <td className="py-3 px-4">{movimentacao.movNumRequisicao}</td>
                  <td className="py-3 px-4">{movimentacao.movRequisitante}</td>
                  <td className="py-3 px-4">
                    <div className="flex flex-wrap gap-1">
                      {movimentacao.produtosMov.map((item, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {item.produto.proNome} - {item.qtdProduto}
                        </Badge>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Nova Movimentação */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Nova Movimentação de Estoque</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="data">Data</Label>
                <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      id="date"
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                      onClick={() => setCalendarOpen(true)}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "dd/MM/yyyy", { locale: ptBR }) : <span>Selecione uma data</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(date) => {
                        setDate(date)
                        setCalendarOpen(false)
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label htmlFor="requisitante">Requisitante</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                    onClick={() => setRequisitanteDialogOpen(true)}
                  >
                    <User className="mr-2 h-4 w-4" />
                    {requisitanteSelecionado ? (
                      <span>
                        {requisitanteSelecionado.nome} ({requisitanteSelecionado.departamento})
                      </span>
                    ) : (
                      <span>Selecionar requisitante</span>
                    )}
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="numeroNF">Número da NF</Label>
                <Input
                  id="numeroNF"
                  name="numeroNF"
                  value={formData.numeroNF}
                  onChange={handleInputChange}
                  placeholder="Ex: NF-12345"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="numeroRequisicao">Número da Requisição</Label>
                <Input
                  id="numeroRequisicao"
                  name="numeroRequisicao"
                  value={formData.numeroRequisicao}
                  onChange={handleInputChange}
                  placeholder="Ex: REQ-2025-001"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>Produtos</Label>
                <Button type="button" variant="outline" size="sm" onClick={() => setProdutoDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-1" /> Adicionar Produto
                </Button>
              </div>

              {itensSelecionados.length > 0 ? (
                <div className="border rounded-md overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-muted">
                      <tr>
                        <th className="text-left py-2 px-4">Código</th>
                        <th className="text-left py-2 px-4">Produto</th>
                        <th className="text-left py-2 px-4">Quantidade</th>
                        <th className="text-left py-2 px-4">Unidade</th>
                        <th className="text-left py-2 px-4"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {itensSelecionados.map((item, index) => (
                        <tr key={index} className="border-t">
                          <td className="py-2 px-4">{item.produto.proSipac}</td>
                          <td className="py-2 px-4">{item.produto.proNome}</td>
                          <td className="py-2 px-4">{item.produto.proQtd}</td>
                          <td className="py-2 px-4">{item.produto.proUn}</td>
                          <td className="py-2 px-4">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoverProduto(index)}
                              className="h-8 w-8 text-red-500"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="border rounded-md p-8 text-center text-muted-foreground">
                  Nenhum produto adicionado. Clique em "Adicionar Produto" para começar.
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-[#1e3a8a]"
                disabled={!requisitanteSelecionado || itensSelecionados.length === 0}
              >
                Finalizar Movimentação
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal de Seleção de Requisitante */}
      <Dialog open={requisitanteDialogOpen} onOpenChange={setRequisitanteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Selecionar Requisitante</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar requisitante..."
                className="pl-10"
                value={buscaRequisitante}
                onChange={(e) => setBuscaRequisitante(e.target.value)}
              />
            </div>
            <div className="border rounded-md overflow-hidden max-h-[300px] overflow-y-auto">
              <table className="w-full">
                <thead className="bg-muted sticky top-0">
                  <tr>
                    <th className="text-left py-2 px-4">Nome</th>
                    <th className="text-left py-2 px-4">Faculdade</th>
                    <th className="text-left py-2 px-4">Sigla Faculdade</th>
                    <th className="text-left py-2 px-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {requisitantesFiltrados.map((requisitante, index) => (
                    <tr key={index} className="border-t hover:bg-muted/50 cursor-pointer">
                      <td className="py-2 px-4">{requisitante.reqNome}</td>
                      <td className="py-2 px-4">{requisitante.reqFacNome}</td>
                      <td className="py-2 px-4">{requisitante.reqFacSigla}</td>
                      <td className="py-2 px-4">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSelecionarRequisitante(requisitante)}
                        >
                          Selecionar
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de Seleção de Produto */}
      <Dialog open={produtoDialogOpen} onOpenChange={setProdutoDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Produto</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar produto..."
                className="pl-10"
                value={buscaProduto}
                onChange={(e) => setBuscaProduto(e.target.value)}
              />
            </div>
            <div className="border rounded-md overflow-hidden max-h-[300px] overflow-y-auto">
              <table className="w-full">
                <thead className="bg-muted sticky top-0">
                  <tr>
                    <th className="text-left py-2 px-4">Código</th>
                    <th className="text-left py-2 px-4">Produto</th>
                    <th className="text-left py-2 px-4">Estoque</th>
                    <th className="text-left py-2 px-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {produtosFiltrados.map((produto, index) => (
                    <tr
                      key={index}
                      className={`border-t hover:bg-muted/50 cursor-pointer ${produtoSelecionado?.proId === produto.proId ? "bg-muted/50" : ""}`}
                      onClick={() => setProdutoSelecionado(produto)}
                    >
                      <td className="py-2 px-4">{produto.proSipac}</td>
                      <td className="py-2 px-4">{produto.proNome}</td>
                      <td className="py-2 px-4">
                        {produto.proQtd} {produto.proUn}
                      </td>
                      <td className="py-2 px-4">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            setProdutoSelecionado(produto)
                          }}
                        >
                          Selecionar
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {produtoSelecionado && (
              <div className="border rounded-md p-4 bg-muted/20">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h4 className="font-medium">{produtoSelecionado.nome}</h4>
                    <p className="text-sm text-muted-foreground">{produtoSelecionado.codigo}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="quantidade">Quantidade:</Label>
                    <Input
                      id="quantidade"
                      type="number"
                      min="1"
                      max={produtoSelecionado.estoque}
                      value={quantidade}
                      onChange={(e) => setQuantidade(Number.parseInt(e.target.value))}
                      className="w-20"
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button type="button" onClick={handleAdicionarProduto} disabled={quantidade <= 0}>
                    Adicionar <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
  }
