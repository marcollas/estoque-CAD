"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Package, Plus, Search, Edit, Trash2, ListRestart, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useUsuario } from "@/hooks/useUsuario"
import type { UsuarioType } from "@/types/usuarioype"
import Loading from "@/components/Loading"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/contexts/UsuarioContext"
import ProtectedRoute from "@/components/ProtectedRoutes"
import { useRouter } from "next/navigation"

export default function UsuariosPage() {
  //ADICIONAR PROTEÇÃO PARA CASO DE USUÁRIO NÃO ADM
  const {isAutenticado, usuario, loading} = useAuth()
  const [busca, setBusca] = useState("")
  const [usuarioAtual, setUsuarioAtual] = useState<any>(null)
  const [confirmaSenha, setConfirmarSenha] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [formData, setFormData] = useState<UsuarioType>({
    usuNome: "",
    usuLogin: "",
    usuSenha: "",
    usuPerfil: "",
    usuId: 0
  })
  const router = useRouter()
  const usuarioHook = useUsuario()
  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          usuarioHook.listarUsuario()
        ])
      } catch (error) {
        console.error("Erro ao carregar dados:", error)
      }
    }
  
    if(usuario?.usuPerfil != "ADMIN" && !loading){
      router.push("/dashboard")
    }
    if(isAutenticado && usuario?.usuPerfil == "ADMIN"){
      fetchData()
    }
    
  }, [isAutenticado])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (usuarioAtual) {
        // Modo Edição - PUT request
        usuarioHook.atualizarUsuario(usuarioAtual.usuId, formData)
      } else {
        // Modo Cadastro - POST request
        if(confirmaSenha != formData.usuSenha){
          alert("A senha digitada difere da confirmada")
          return
        }
        usuarioHook.criarUsuario(formData)
      }
  
      // Fecha o diálogo e reseta o formulário
      setDialogOpen(false);
      setConfirmarSenha("")
      setUsuarioAtual(null);
      setFormData({
        usuNome: "",
        usuLogin: "",
        usuSenha: "",
        usuPerfil: "",
        usuId: 0
      });
  
    } catch (error) {
      console.error("Erro ao salvar Usuario:", error);
      alert("Ocorreu um erro ao processar sua solicitação.");
    }
  }

  const usuariosFiltrados = usuarioHook.usuario.filter(
    (usuario: UsuarioType) =>
      (usuario.usuNome?.toLowerCase() || '').includes(busca.toLowerCase()) ||
      (usuario.usuLogin?.toLowerCase() || '').includes(busca.toLowerCase()),
  )

  //Campo recebe o dados do formulário editado
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement> |  React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      //Faço a verificação se é vazio ou Nan. Se for, substituo por zero
      [name] : value
    }));
  }

  const handlePerfilChange = (perfil: string) => {
    setFormData({
      ...formData,
      usuPerfil: perfil,
    })
  }

  const handleEdit = (usuario: UsuarioType) => {
    setUsuarioAtual(usuario)
    setFormData({
      usuNome: usuario.usuNome,
      usuPerfil: usuario.usuPerfil,
      usuId: usuario.usuId
    })
    setDialogOpen(true)
  }

  const handleDelete = (id: number) => {
    if (confirm("Tem certeza que deseja inativar este Usuario?")) {
      usuarioHook.inativarUsuario(id)
    }
  }

  const resetarSenha = (id: number) => {
    if (confirm("Tem certeza que deseja resetar a senha deste usuario para 123?")) {
      usuarioHook.resetarSenha(id)
    }
  }

  const handleAddNew = () => {
    setUsuarioAtual(null)
    setFormData({
      usuNome: "",
      usuLogin: "",
      usuSenha: "",
      usuPerfil: "",
      usuId: 0
    })
    setDialogOpen(true)
  }
  if (usuarioHook.loading) return <Loading />;
  //if (usuarioHook.error) return <ErrorAlert message={error} />;

  return (
    <ProtectedRoute>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Users className="h-6 w-6" />
            Gerenciamento de Usuarios
          </h1>
          <Button onClick={handleAddNew} className="bg-[#1e3a8a]">
            <Plus className="h-4 w-4 mr-2" />
            Novo Usuario
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar Usuarios..."
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
                  <th className="text-left py-3 px-4">Login</th>
                  <th className="text-left py-3 px-4">Perfil</th>
                  <th className="text-left py-3 px-4">Ações</th>
                  <th className="text-left py-3 px-4">Resetar senha</th>
                </tr>
              </thead>
              <tbody>
                {usuariosFiltrados.map((usuario, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{usuario.usuNome}</td>
                    <td className="py-3 px-4">{usuario.usuLogin}</td>
                    <td className="py-3 px-4">{usuario.usuPerfil}</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button variant="outline" size="icon" onClick={() => handleEdit(usuario)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => handleDelete(usuario.usuId)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                        <Button variant="outline" size="icon" onClick={() => resetarSenha(usuario.usuId)}>
                          <ListRestart className="h-4 w-4" />
                        </Button>
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
              <DialogTitle>{usuarioAtual ? "Editar Usuario" : "Novo Usuario"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome do Usuario</Label>
                <Input id="nome" name="usuNome" value={formData.usuNome} onChange={handleInputChange} required />
              </div>
              {
                !usuarioAtual && 
                  (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="nome">Email para login</Label>
                        <Input id="nome" name="usuLogin" type="email" value={formData.usuLogin} onChange={handleInputChange} required />
                      </div> 
                    </>
                  )
                }
              <div className="space-y-2">
                <Label htmlFor="categoria">Perfil de usuário</Label>
                <Select value={formData.usuPerfil?.toString() ?? ""} onValueChange={handlePerfilChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={"ADMIN"}>ADMINISTRADOR</SelectItem>
                    <SelectItem value={"ALMOXARIFADO"}>ALMOXARIFADO</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {
                !usuarioAtual && 
                  (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="nome">Senha</Label>
                        <Input id="nome" name="usuSenha" type = "password" value={formData.usuSenha} onChange={handleInputChange} required />
                      </div> 
                      <div className="space-y-2">
                        <Label htmlFor="nome">Confirme a senha</Label>
                        <Input id="nome" name="usuSenha" type = "password" value={confirmaSenha} onChange={(e) => {setConfirmarSenha(e.target.value)}} required />
                      </div> 
                    </>
                  )
                }
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" className="bg-[#1e3a8a]">
                  {usuarioAtual ? "Atualizar" : "Cadastrar"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </ProtectedRoute>
  )
}

