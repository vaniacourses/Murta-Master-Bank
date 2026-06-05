import React, { createContext, useState, type ReactNode } from 'react';
import { type Usuario, type AuthResponseDTO } from '../types/models/Utilizador';
import { api } from '../service/api';

interface AuthContextData {
  utilizador: Usuario | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (dados: AuthResponseDTO) => void;
  logout: () => void;
}

// Desativa o aviso do Fast Refresh especificamente para a exportação do Contexto
// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Utilizamos Lazy Initialization para ler o localStorage apenas na primeira renderização
  const [utilizador, setUtilizador] = useState<Usuario | null>(() => {
    const storedUser = localStorage.getItem('@MMBank:utilizador');
    const storedToken = localStorage.getItem('@MMBank:token');

    if (storedUser && storedUser !== "undefined" && storedToken) {
      try {
        api.defaults.headers.Authorization = `Bearer ${storedToken}`;
        return JSON.parse(storedUser);
      } catch (error) {
        console.error("Erro ao ler dados do utilizador:", error);
        // Limpa o localStorage corrompido para evitar futuros erros
        localStorage.removeItem('@MMBank:utilizador');
        localStorage.removeItem('@MMBank:token');
        return null;
      }
    }

    return null;
  });

  // Como já validamos na inicialização acima, não precisamos de loading inicial
  const [isLoading] = useState(false);

  const login = ({ token, usuario: userData }: AuthResponseDTO) => {
    localStorage.setItem('@MMBank:token', token);
    localStorage.setItem('@MMBank:utilizador', JSON.stringify(userData));

    api.defaults.headers.Authorization = `Bearer ${token}`;
    setUtilizador(userData);
  };

  const logout = () => {
    localStorage.removeItem('@MMBank:token');
    localStorage.removeItem('@MMBank:utilizador');

    delete api.defaults.headers.Authorization;
    setUtilizador(null);
  };

  return (
    <AuthContext.Provider value={{
      utilizador,
      isAuthenticated: !!utilizador,
      isLoading,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};