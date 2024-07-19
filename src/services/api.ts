import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3333",
});

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      console.error("Erro de resposta da API:", error.response.data);
    } else if (error.request) {
      console.error("Erro de requisição sem resposta:", error.request);
    } else {
      console.error("Erro ao configurar a requisição:", error.message);
    }
    return Promise.reject(error);
  }
);

export default api; 

// Mudança

export function setupAPIClient() {
  return api;
}
