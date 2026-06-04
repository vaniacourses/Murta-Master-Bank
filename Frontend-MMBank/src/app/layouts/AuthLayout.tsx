import React from 'react';
import { Outlet } from 'react-router-dom';

export const AuthLayout: React.FC = () => {
  return (
    <div style={{ 
      display: 'flex', 
      height: '100vh', 
      backgroundColor: 'var(--bg-primary)', 
      alignItems: 'center', 
      justifyContent: 'center' 
    }}>
      <div style={{
        backgroundColor: 'var(--card-bg)',
        padding: '3rem',
        borderRadius: '12px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '2rem', color: 'var(--bg-sidebar)' }}>
            MM<span style={{ color: 'var(--accent-color)' }}>Bank</span>
          </h2>
          <p style={{ color: '#64748b' }}>Acesso à sua conta</p>
        </div>
        <Outlet />
      </div>
    </div>
  );
};  