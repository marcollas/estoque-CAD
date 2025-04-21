// // hooks/useProdutos.ts
// import { useState } from 'react';
// import { RelatorioServices } from '@/services/relatorioServices';
// import type { ProdutoMaisMovimentado, RequisitanteMaisProdutosType } from '@/types/RelatorioType'
// import { useError } from '@/contexts/NotificationContext';

// export const useProdutos = () => {
//   const [loading, setLoading] = useState(false);
//   const {addNotification} = useError()

//   // Listar todos os produtos
//   const listarDados = async () => {
//     setLoading(true);
//     try {
//       const data = await ProdutoServices.listarTodos();
//       setProdutos(data);
//       return data;
//     } catch (err) {
//       addNotification(err instanceof Error ? err.message : 'Erro ao carregar produtos');
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   };
//   return {
//     produtos,
//     loading,
//     listarProdutos
//   };
// };