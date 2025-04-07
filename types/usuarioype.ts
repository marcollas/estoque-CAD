export type UsuarioType = {
    usuId: number,
    usuNome: string,
    usuLogin?: string,
    usuSenha?: string,
    isAtivo?: boolean,
    usuPerfil: string | number
}