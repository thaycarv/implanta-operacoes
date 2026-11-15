import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('Erro de renderização:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: '24px', background: '#f8fafc', color: '#0f172a', fontFamily: 'Inter, system-ui, sans-serif' }}>
          <div style={{ maxWidth: 440, width: '100%', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, color: '#b45309' }}>
              <AlertTriangle size={20} />
              <h1 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#0f172a' }}>Não foi possível exibir o painel</h1>
            </div>
            <p style={{ margin: '0 0 16px', fontSize: 13, lineHeight: 1.5, color: '#475569' }}>
              Ocorreu uma falha inesperada na interface. Recarregue a página para continuar.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 8, border: '1px solid #cbd5e1', background: '#047857', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
            >
              <RotateCcw size={14} />
              <span>Recarregar</span>
            </button>
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}
