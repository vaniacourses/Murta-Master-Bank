import React, { type InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, id, ...props }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '1rem' }}>
      <label htmlFor={id} style={{ fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: 500 }}>
        {label}
      </label>
      <input
        id={id}
        style={{
          padding: '0.8rem',
          borderRadius: '8px',
          border: `1px solid ${error ? 'var(--danger)' : '#cbd5e1'}`,
          outline: 'none',
          transition: 'border-color 0.2s',
        }}
        {...props}
      />
      {error && <span style={{ color: 'var(--danger)', fontSize: '0.8rem' }}>{error}</span>}
    </div>
  );
};