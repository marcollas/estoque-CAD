import { ProdutoType } from "./produtoType"

export type MovimentcaoType = {
    movId: number,
    movData: string,
    movDataCancelamento?: Date | null,
    movHorario: string,
    movHorarioCancelamento?: string | null,
    movNf: string | null,
    movNumRequisicao: string | null,
    movStatus: string,
    movOrigem: string,
    movTipo: string,
    movUsuario: string
    movRequisitante: string
    produtosMov: ProdutosMovType[]
}

type ProdutosMovType = {
    produto: ProdutoType,
    qtdProduto: number
}