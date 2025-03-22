"use client"

import type React from "react"

import { useState } from "react"
import { ShoppingCart, Plus, Search, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

// Dados de exemplo
const produtosDisponiveis = [
  { id: 1, codigo: "P001", nome: "Teclado Mecânico" },
  { id: 2, codigo: "P002", nome: "Mouse Gamer" },
  { id: 3, codigo: "P003", nome: 'Monitor 24"' },
  { id: 4, codigo: "P004", nome: "Headset" },
  { id: 5, codigo: "P005", nome: "Webcam HD" },
  { id: 6, codigo: "P006", nome: "SSD 500GB" },
  { id: 7, codigo: "P007", nome: "Memória RAM 8GB" },
  { id: 8, codigo: "P008", nome: "Placa de Vídeo" },
]

const entradasIniciais = [
  {
    id: 1,
    data: new Date(2025, 2, 22),
    produto: "Teclado Mecânico",
    quantidade: 10,
    fornecedor: "Tech Supplies",
    notaFiscal: "NF-12345",
  },
  {
    id: 2,
    data: new Date(2025, 2, 20),
    produto: 'Monitor 24"',
    quantidade: 8,
    fornecedor: "Display Solutions",
    notaFiscal: "NF-54321",
  },
  {
    id: 3,
    data: new Date(2025, 2, 18),
    produto: "Memória RAM 8GB",
    quantidade: 15,
    fornecedor: "PC Components",
    notaFiscal: "NF-98765",
  },
  {
    id: 4,
    data: new Date(2025, 2, 15),
    produto: "SSD 500GB",
    quantidade: 12,
    fornecedor: "Storage Inc.",
    notaFiscal: "NF-45678",
  },
]

export default function EntradasPage() {
  const [entradas, setEntradas] = useState(entradasIniciais)
  const [busca, setBusca] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [formData, setFormData] = useState({
    produto: "",
    quantidade: 1,
    fornecedor: "",
    notaFiscal: "",
  })

  const entradasFiltradas = entradas.filter(
    (entrada) =>
      entrada.produto.toLowerCase().includes(busca.toLowerCase()) ||
      entrada.fornecedor.toLowerCase().includes(busca.toLowerCase()) ||
      entrada.notaFiscal.toLowerCase().includes(busca.toLowerCase()),
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: name === "quantidade" ? Number.parseInt(value) : value,
    })
  }

  const handleSelectChange = (value: string) => {
    setFormData({
      ...formData,
      produto: value,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!date) return

    // Adicionar nova entrada
    setEntradas([
      ...entradas,
      {
        id: entradas.length + 1,
        data: date,
        produto: formData.produto,
        quantidade: formData.quantidade,
        fornecedor: formData.fornecedor,
        notaFiscal: formData.notaFiscal,
      },
    ])

    setDialogOpen(false)
    setFormData({
      produto: "",
      quantidade: 1,
      fornecedor: "",
      notaFiscal: "",
    })
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <ShoppingCart className="h-6 w-6" />
          Registro de Entradas
        </h1>
        <Button onClick={() => setDialogOpen(true)} className="bg-[#1e3a8a]">
          <Plus className="h-4 w-4 mr-2" />
          Nova Entrada
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar entradas..."
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
                <th className="text-left py-3 px-4">Produto</th>
                <th className="text-left py-3 px-4">Quantidade</th>
                <th className="text-left py-3 px-4">Fornecedor</th>
                <th className="text-left py-3 px-4">Nota Fiscal</th>
              </tr>
            </thead>
            <tbody>
              {entradasFiltradas.map((entrada) => (
                <tr key={entrada.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{format(entrada.data, "dd/MM/yyyy")}</td>
                  <td className="py-3 px-4">{entrada.produto}</td>
                  <td className="py-3 px-4">{entrada.quantidade}</td>
                  <td className="py-3 px-4">{entrada.fornecedor}</td>
                  <td className="py-3 px-4">{entrada.notaFiscal}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registrar Nova Entrada</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="data">Data</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <Calendar className="mr-2 h-4 w-4" />
                    {date ? format(date, "dd/MM/yyyy", { locale: ptBR }) : <span>Selecione uma data</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent mode="single" selected={date} onSelect={setDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label htmlFor="produto">Produto</Label>
              <Select value={formData.produto} onValueChange={handleSelectChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um produto" />
                </SelectTrigger>
                <SelectContent>
                  {produtosDisponiveis.map((produto) => (
                    <SelectItem key={produto.id} value={produto.nome}>
                      {produto.codigo} - {produto.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantidade">Quantidade</Label>
              <Input
                id="quantidade"
                name="quantidade"
                type="number"
                min="1"
                value={formData.quantidade}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fornecedor">Fornecedor</Label>
              <Input
                id="fornecedor"
                name="fornecedor"
                value={formData.fornecedor}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notaFiscal">Nota Fiscal</Label>
              <Input
                id="notaFiscal"
                name="notaFiscal"
                value={formData.notaFiscal}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-[#1e3a8a]">
                Registrar
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

