export type ProdutosPorRequisitanteType = {
    totalMovimentacao: number,
    totalProdutos: number,
    requisitante: string
}

export type ProdutoMaisMovimentadoType = {
    isAbaixoMin: boolean,
    qtdTotal: number,
    produto: string,
    estoque: number,
    qtdMov: number
}