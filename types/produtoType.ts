//Dados de interface, onde determino os tipos de objetos
export type Produto = {
    proId: number
    proNome: string
    proSipac: string
    proUn: string
    proUnId: number
    proCategoria: string
    proCategoriaId: number
    proDescricao: string
    proQtd: number
    proEstoqueMin: number
    isAbaixoMin: boolean
    isAtivo: boolean
  }
  
  //Criar o tipo do formulário do produto omitindo alguns campos
export type FormProduto = {
    proNome: string
    proSipac: string
    proUnId: number
    proCategoriaId: number
    proDescricao?: string
    proQtd: number
    proEstoqueMin: number
    proId?: number  // ProId é opcional, pode estar ou não contido no formulário
}