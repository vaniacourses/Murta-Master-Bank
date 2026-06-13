import { useState } from 'react';
import axios from 'axios';
import { api } from '../../service/api';

export const useCadastro = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const cadastrar = async (dadosBasicos: any) => {
        setIsLoading(true);
        setError('');

        try {
            const response = await api.post('/usuarios', dadosBasicos);
            
            return response.status === 201;
            
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                if (err.response?.status === 400) {
                    setError('Dados inválidos. Verifique os campos e tente novamente.');
                } else if (err.response?.status === 500) {
                     setError('Erro no servidor. Este e-mail ou CPF já pode estar cadastrado.');
                } else {
                    setError('Erro ao conectar com o servidor.');
                }
            } else {
                setError('Ocorreu um erro inesperado.');
            }
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    return { cadastrar, isLoading, error };
};