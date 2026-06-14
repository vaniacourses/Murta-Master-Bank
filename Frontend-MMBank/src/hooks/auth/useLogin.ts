import { useState } from 'react';
import axios from 'axios';
import { api } from '../../service/api';
import { type AuthResponseDTO, type Usuario } from '../../types/models/Utilizador';

interface BackendUser {
  id: number;
  nome: string;
  email: string;
  role: string;
  documento?: string;
  telefone?: string;
  endereco?: string; // <-- Adicionado
}

export const useLogin = () => {
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const authenticate = async (email: string, senha: string): Promise<AuthResponseDTO | null> => {
        setError('');
        setIsLoading(true);

        try {
            const response = await api.post<{ token: string }>('/auth/login', {
                email,
                senha,
            });
            const { token } = response.data;

            // Define o token no header para a requisição de busca
            api.defaults.headers.Authorization = `Bearer ${token}`;

            let matchedUser: BackendUser | undefined;

            try {
                // Como o endpoint /usuarios é público/permitAll no backend, listamos os usuários
                const usersResponse = await api.get<BackendUser[]>('/clientes');                matchedUser = usersResponse.data.find(
                    (u) => u.email.toLowerCase() === email.toLowerCase()
                );
            } catch (err) {
                console.error("Erro ao buscar detalhes do utilizador no backend:", err);
            }

            // Mapeia os dados do backend para a interface Usuario esperada pelo frontend
            const usuario: Usuario = {
                id: matchedUser?.id || 1,
                nome: matchedUser?.nome || 'Utilizador MMBank',
                email: matchedUser?.email || email,
                cpf: '123.456.789-00', // Mock/default CPF (não existe na tabela usuarios do backend)
                telefone: matchedUser?.telefone || '',
                endereco: matchedUser?.endereco || '', 
                tipo: matchedUser?.role === 'ROLE_ADMIN' ? 'PJ' : 'PF' // Define o tipo de acordo com a role
            };

            return { token, usuario };
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                if (err.response) {
                    const status = err.response.status;
                    if (status === 401 || status === 403) {
                        setError('E-mail ou senha incorretos.');
                    } else {
                        setError(`Erro no servidor (${status}). Por favor, tente novamente mais tarde.`);
                    }
                } else if (err.request) {
                    setError('Não foi possível conectar ao servidor. Verifique se o backend está ativo.');
                } else {
                    setError('Erro ao configurar a requisição de autenticação.');
                }
            } else {
                setError('Ocorreu um erro inesperado.');
            }
            return null; // Retorna nulo em caso de erro
        } finally {
            setIsLoading(false);
        }
    };

    return { authenticate, isLoading, error };
};