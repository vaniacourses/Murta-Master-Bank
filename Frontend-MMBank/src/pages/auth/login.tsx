import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../hooks/auth/useAuth';
import { useLogin } from '../../hooks/auth/useLogin';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  // Use as funções extraídas do hook
  const { authenticate, isLoading, error } = useLogin();
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Faz a chamada à API através do hook
    const data = await authenticate(email, senha);

    // 2. Se tiver sucesso (data não é nulo), atualiza o contexto e navega
    if (data) {
      const { token, usuario } = data;

      // NOTA: Se a sua função login do useAuth retornar uma Promise, 
      // adicione um 'await' antes de 'login' abaixo.
      login({ token, usuario });

      // Redireciona usando replace para não deixar rasto do login no histórico
      navigate('/dashboard', { replace: true });
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