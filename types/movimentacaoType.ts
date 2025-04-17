import { ProdutoType } from "./produtoType"
import { RequisitanteType } from "./requisitanteType"

export type MovimentacaoType = {
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
    proMovProduto: ProdutosMovType[]
}

export type ProdutosMovType = {
    produto: ProdutoType
    qtdProduto: number
}

export type FormMovimentacaoType = {
    movId?: number
    movOrigem: string
    movTipo: string
    movNf?: string
    movNumRequisicao?: string
    movRequisitante?: RequisitanteType | null
    produtosMov?: ProdutosMovType[] | null
}