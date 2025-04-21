//Dados de interface, onde determino os tipos de objetos
export type ProdutoType = {
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
    proCusto: number
    isAbaixoMin: boolean
    isAtivo: boolean
  }
  
  //Criar o tipo do formulário do produto omitindo alguns campos
export type FormProdutoType = {
    proNome: string
    proSipac: string
    proUnId: number
    proUnSigla: string
    proCategoriaId: number | null
    proCategoriaNome?: string | null
    proDescricao?: string
    proQtd: number
    proEstoqueMin: number
    proCusto: number
    proId?: number  // ProId é opcional, pode estar ou não contido no formulário
}