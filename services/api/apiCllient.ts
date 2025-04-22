// Esse componente terá como propósito, a configuração global do axios, a qual apontará para a API em Spring
import axios from "axios";

let errorHandler: ((msg: string) => void) | null = null;

export const setErrorHandler = (handler: (msg: string) => void) => {
  errorHandler = handler;
}
const apiClient = axios.create({
    baseURL: `http://127.0.0.1:8080`,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
})

//Interceptor para as requisições de API
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('Authorization')
    if(token){
        config.headers.Authorization = token
    }
    return config
})

//Interceptor para as resposta da API
// Interceptor de resposta
apiClient.interceptors.response.use(
  response => response,
  error => {
    const msg = error.response?.data?.mensagem || "Erro inesperado na API";
    if (errorHandler && error.response?.data?.status != 401) {
      errorHandler(msg);
    }

    return Promise.reject(error);
  }
)

export default apiClient;