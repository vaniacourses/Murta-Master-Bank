import React, { type ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  isLoading, 
  disabled, 
  style, 
  ...props 
}) => {
  const getBackgroundColor = () => {
    if (variant === 'danger') return 'var(--danger)';
    if (variant === 'secondary') return '#64748b';
    return 'var(--accent-color)';
  };

  return (
    <button
      disabled={disabled || isLoading}
      style={{
        backgroundColor: getBackgroundColor(),
        color: 'white',
        padding: '0.8rem 1.5rem',
        border: 'none',
        borderRadius: '8px',
        fontWeight: 600,
        cursor: (disabled || isLoading) ? 'not-allowed' : 'pointer',
        opacity: (disabled || isLoading) ? 0.7 : 1,
        width: '100%',
        transition: 'opacity 0.2s',
        ...style
      }}
      {...props}
    >
      {isLoading ? 'A processar...' : children}
    </button>
  );
};