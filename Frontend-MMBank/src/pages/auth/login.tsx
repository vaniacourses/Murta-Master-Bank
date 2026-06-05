import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../hooks/useAuth';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Mock da requisição ao authService. Futuramente: await authService.login({ email, senha })
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (email === 'admin@mmbank.com' && senha === '123456') {
        login({
          token: 'mock-jwt-token-12345',
          usuario: { id: 1, nome: 'Gustavo Murta', email, cpf: '123.456.789-00', tipo: 'PF' }
        });
        navigate('/dashboard');
      } else {
        setError('Credenciais inválidas. Tente admin@mmbank.com / 123456');
      }
    } catch (err) {
      setError('Ocorreu um erro ao comunicar com o servidor.');
      throw err; // Relança o erro para evitar comportamento inesperado, mas o usuário já é informado via setError
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <Input 
        id="email"
        type="email" 
        label="E-mail" 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required 
      />
      <Input 
        id="senha"
        type="password" 
        label="Senha" 
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
        required 
      />
      
      {error && <p style={{ color: 'var(--danger)', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</p>}
      
      <Button type="submit" isLoading={isLoading}>
        Entrar
      </Button>
      
      <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem' }}>
        <a href="/recuperar-senha" style={{ color: 'var(--accent-color)', textDecoration: 'none' }}>
          Esqueci-me da senha
        </a>
      </div>
    </form>
  );
};