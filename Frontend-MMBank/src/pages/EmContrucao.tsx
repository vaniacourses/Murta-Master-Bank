export const EmConstrucao = ({ titulo }: { titulo: string }) => (
  <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
    <span style={{ fontSize: '3rem' }}>🚧</span>
    <h2 style={{ marginTop: '1rem', color: 'var(--text-main)' }}>{titulo}</h2>
    <p style={{ color: '#64748b', marginTop: '0.5rem' }}>Página em desenvolvimento estrutural.</p>
  </div>
);