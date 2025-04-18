// import { useState } from "react";
// import { UnidadeServices } from "@/services/unidadeServices";
// import type { UnidadeType } from "@/types/unidadeType";
// import { useError } from "@/contexts/NotificationContext";
// import { AlterarSenhaType } from "@/types/usuarioype";

// export const useUnidades = (initialUnidades: UnidadeType[] = []) => {
//     const [unidades, setUnidades] = useState<UnidadeType[]>(initialUnidades)
//     const [loading, setLoading] = useState(false);
//     const {addNotification} = useError()

//     const alterarSenha = async (id: number, dados: AlterarSenhaType) => {
//         setLoading(true)
//         try {
//             await HomeSe.inativar(id)
//             setUnidades(prev => prev.filter(unidade => unidade.unId !== id))
//             addNotification({mensagem: "Unidade inativada com sucesso", tipo: "info"})
//         } catch (err) {
//             addNotification(err instanceof Error ? err.message : "Erro ao atualizar unidade")
//             throw err
//         }finally{
//             setLoading(false)
//         }
//     }

//     return {
//         unidades,
//         loading,
//         inativarUnidade
//     }
// }