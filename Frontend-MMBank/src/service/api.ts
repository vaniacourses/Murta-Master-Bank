import axios from 'axios';


const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de Pedido (Request)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('@MMBank:token');
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de Resposta (Response)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Se o token expirar ou for inválido, limpamos o storage e redirecionamos para login
      localStorage.removeItem('@MMBank:token');
      localStorage.removeItem('@MMBank:utilizador');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);