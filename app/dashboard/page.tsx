"use client"

import { useState, useEffect } from "react"
import { Package, FileText, ShoppingCart, Users, BarChart2, Settings, LogOut, BookOpen, Clipboard, UserRoundPlus, ShoppingBasket, Box, PackagePlus, Notebook, User, List } from "lucide-react"
import { useError } from "@/contexts/NotificationContext"
import Link from "next/link"
import ErrorNotification from "@/components/ErrorNotification"
import { useAuth } from "@/contexts/UsuarioContext"
import ProtectedRoute from "@/components/ProtectedRoutes"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog"
import { DialogTitle } from "@radix-ui/react-dialog"
import { AlterarSenhaType } from "@/types/usuarioype"
import { useUsuario } from "@/hooks/useUsuario"
import Loading from "@/components/Loading"

export default function Dashboard() {
  const {logout, usuario} = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [openDialog, setOpenDialog] = useState<"senha" | null>(null)
  const [senhaAntiga, setSenhaAntiga] = useState("")
  const [novaSenha, setNovaSenha] = useState("")
  const [confirmaSenha, setConfirmaSenha] = useState("")
  const [loadSenha, setLoadSenha] = useState(false)
  const usuarioHook = useUsuario()

  const alterarSenhaUsuario = (id: number | undefined) => {
    if(id == undefined){
      return
    }
    if(confirmaSenha != novaSenha){
      alert("Senha de confirmação difere da senha digitada")
      return
    }
    const dados: AlterarSenhaType = {
      novaSenha: novaSenha,
      senhaAntiga: senhaAntiga
    }
    setLoadSenha(true)
    try {
      usuarioHook.alterarSenhaUsuario(id, dados)
      setConfirmaSenha("")
      setNovaSenha("")
      setSenhaAntiga("")
      setOpenDialog(null)
    } catch (error) {
      console.log("Erro")
    }finally{
      setLoadSenha(false)
    }
    
  }
  return (
    // O sistema está com um comportamento que precisa ser corrigido. Ao fazer login por um curto espaço de tempo, o sistema vem para essa tela e retorna para a tela de login e novamente retorna para essa tela.
    <ProtectedRoute>
      <div className="flex h-screen bg-gray-100">
        {/* Avaliar se esse componente é realmente necessário aqui */}
        <ErrorNotification />
        <aside
          className={`bg-[#1e3a8a] text-white ${
            sidebarOpen ? "w-64" : "w-20"
          } transition-all duration-300 h-screen relative flex flex-col`}
        >
          <div className="p-4 flex justify-between items-center">
            <h2 className={`font-bold ${sidebarOpen ? "block" : "hidden"}`}>
              Almoxarifado
            </h2>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-white"
            >
              {sidebarOpen ? "←" : "→"}
            </button>
          </div>

          <nav className="mt-8 flex-1 overflow-y-auto">
            <ul className="space-y-2 px-2">
              <li>
                <Link
                  href="/dashboard"
                  className="flex items-center gap-3 p-3 rounded-md hover:bg-blue-800"
                >
                  <BarChart2 className="h-5 w-5" />
                  {sidebarOpen && <span>Dashboard</span>}
                </Link>
              </li>

              {usuario?.usuPerfil === "ADMIN" && (
                <li>
                  <Link
                    href="/dashboard/usuarios"
                    className="flex items-center gap-3 p-3 rounded-md hover:bg-blue-800"
                  >
                    <Users className="h-5 w-5" />
                    {sidebarOpen && <span>Usuários</span>}
                  </Link>
                </li>
              )}

              <li>
                <Link
                  href="/dashboard/requisitantes"
                  className="flex items-center gap-3 p-3 rounded-md hover:bg-blue-800"
                >
                  <UserRoundPlus className="h-5 w-5" />
                  {sidebarOpen && <span>Requisitantes</span>}
                </Link>
              </li>

              <li>
                <Link
                  href="/dashboard/saidas"
                  className="flex items-center gap-3 p-3 rounded-md hover:bg-blue-800"
                >
                  <ShoppingCart className="h-5 w-5" />
                  {sidebarOpen && <span>Saida</span>}
                </Link>
              </li>

              <li>
                <Link
                  href="/dashboard/entradas"
                  className="flex items-center gap-3 p-3 rounded-md hover:bg-blue-800"
                >
                  <PackagePlus className="h-5 w-5" />
                  {sidebarOpen && <span>Entradas</span>}
                </Link>
              </li>

              <li>
                <Link
                  href="/dashboard/produtos"
                  className="flex items-center gap-3 p-3 rounded-md hover:bg-blue-800"
                >
                  <Box className="h-5 w-5" />
                  {sidebarOpen && <span>Produtos</span>}
                </Link>
              </li>

              <li>
                <Link
                  href="/dashboard/categorias"
                  className="flex items-center gap-3 p-3 rounded-md hover:bg-blue-800"
                >
                  <Notebook className="h-5 w-5" />
                  {sidebarOpen && <span>Categorias de produtos</span>}
                </Link>
              </li>

              <li>
                <Link
                  href="/dashboard/unidades"
                  className="flex items-center gap-3 p-3 rounded-md hover:bg-blue-800"
                >
                  <FileText className="h-5 w-5" />
                  {sidebarOpen && <span>Unidades</span>}
                </Link>
              </li>

              <li>
                <Link
                  href="/dashboard/faculdades"
                  className="flex items-center gap-3 p-3 rounded-md hover:bg-blue-800"
                >
                  <BookOpen className="h-5 w-5" />
                  {sidebarOpen && <span>Faculdades</span>}
                </Link>
              </li>

              <li>
                <Link
                  href="#"
                  onClick={() => alert("Implementações futuras !!")}
                  className="flex items-center gap-3 p-3 rounded-md hover:bg-blue-800"
                >
                  <Clipboard className="h-5 w-5" />
                  {sidebarOpen && <span>Relatórios</span>}
                </Link>
              </li>

              <li>
                <Link
                  href="#"
                  onClick={() => alert("Implementações futuras !!")}
                  className="flex items-center gap-3 p-3 rounded-md hover:bg-blue-800"
                >
                  <List className="h-5 w-5" />
                  {sidebarOpen && <span>Requisições</span>}
                </Link>
              </li>

              {/* <li>
                <Link
                  href="/dashboard/configuracoes"
                  className="flex items-center gap-3 p-3 rounded-md hover:bg-blue-800"
                >
                  <Settings className="h-5 w-5" />
                  {sidebarOpen && <span>Configurações</span>}
                </Link>
              </li> */}
              <li>
                <button
                  onClick={() => logout()}
                  className="flex items-center gap-3 p-3 w-full rounded-md hover:bg-blue-800"
                >
                  <LogOut className="h-5 w-5" />
                  {sidebarOpen && <span>Sair</span>}
                </button>
            </li>
            </ul>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-auto">
          <header className="bg-white shadow-sm p-4">
            <div className="flex justify-between items-center">
              <h1 className="text-xl font-semibold">Dashboard</h1>
              <div className="flex items-center gap-4">
                <span>Bem-vindo, {usuario?.usuNome}</span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" onClick={() =>console.log("Oi")}>
                      <User className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setOpenDialog("senha")}>
                      Alterar Senha
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={logout}>
                      <LogOut className="h-5 w-5" />
                      Sair
                      
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                
              </div>
            </div>
          </header>
          <Dialog open={openDialog === "senha"} onOpenChange={(open) => !open && setOpenDialog(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Alterar Senha</DialogTitle>
              </DialogHeader>
              {/* Formulário de alteração de senha */}
              {
                loadSenha ? 
                  <Loading />
                :
                  <form className="space-y-4" onSubmit={(e) => {
                    e.preventDefault()
                    alterarSenhaUsuario(usuario?.usuId)
                  }}>
                    <input type="password" placeholder="Senha atual" name="senhaAntiga" className="w-full border rounded p-2" onChange={(e) => setSenhaAntiga(e.target.value)} />
                    <input type="password" placeholder="Nova senha" name="novaSenha" className="w-full border rounded p-2" onChange={(e) => setNovaSenha(e.target.value)}/>
                    <input type="password" placeholder="Confirmar nova senha" className="w-full border rounded p-2" onChange={(e) => setConfirmaSenha(e.target.value)}/>
                    <Button type="submit">Alterar Senha</Button>
                  </form>
              }
             
            </DialogContent>
          </Dialog>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-gray-500 mb-2">Total de Materiais</h3>
                <p className="text-3xl font-bold">487</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-gray-500 mb-2">Requisições Pendentes</h3>
                <p className="text-3xl font-bold">12</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-gray-500 mb-2">Materiais em Baixa</h3>
                <p className="text-3xl font-bold">23</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-gray-500 mb-2">Requisições do Mês</h3>
                <p className="text-3xl font-bold">142</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-semibold mb-4">Requisições Recentes</h3>
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Data</th>
                      <th className="text-left py-2">Departamento</th>
                      <th className="text-left py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2">22/03/2025</td>
                      <td className="py-2">Administração</td>
                      <td className="py-2">
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">Pendente</span>
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">21/03/2025</td>
                      <td className="py-2">Recursos Humanos</td>
                      <td className="py-2">
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Aprovada</span>
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">20/03/2025</td>
                      <td className="py-2">Financeiro</td>
                      <td className="py-2">
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Aprovada</span>
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">19/03/2025</td>
                      <td className="py-2">Secretaria</td>
                      <td className="py-2">
                        <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">Negada</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-semibold mb-4">Materiais Mais Requisitados</h3>
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Material</th>
                      <th className="text-left py-2">Quantidade</th>
                      <th className="text-left py-2">Estoque</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2">Papel A4</td>
                      <td className="py-2">250</td>
                      <td className="py-2">1500</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">Caneta Esferográfica</td>
                      <td className="py-2">120</td>
                      <td className="py-2">350</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">Grampeador</td>
                      <td className="py-2">45</td>
                      <td className="py-2">78</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">Pasta Suspensa</td>
                      <td className="py-2">80</td>
                      <td className="py-2">200</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}

