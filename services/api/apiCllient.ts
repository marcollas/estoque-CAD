// Esse componente terá como propósito, a configuração global do axios, a qual apontará para a API em Spring
import axios from "axios";

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
apiClient.interceptors.response.use((response) => response, (error) => {
      // Transforma erros específicos da API
      if (error.response?.status === 401) {
        console.log("Usuário não autenticado") //Implementar controle de rotos
      }
      return Promise.reject(error);
    }
);

export default apiClient;