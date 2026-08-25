import { useState } from 'react'
import {
  BarChart3,
  ClipboardCheck,
  FileText,
  GitPullRequestArrow,
  LayoutDashboard,
  RotateCcw,
  Store,
  Map,
  Sparkles,
} from 'lucide-react'
import { NavLink, Outlet } from 'react-router-dom'
import { Brand } from '../Brand'
import { usePortfolio } from '../../state/PortfolioContext'
import { GuidedTour } from '../GuidedTour'

const navigationV2 = [
  { to: '/app/dashboard', label: 'Visão geral da carteira', icon: LayoutDashboard },
  { to: '/app/implantacoes', label: 'Implantações e Diagnóstico', icon: BarChart3 },
]

const navigationV1 = [
  { to: '/app/dashboard', label: 'Visão geral', icon: LayoutDashboard },
  { to: '/app/implantacoes', label: 'Implantações', icon: BarChart3 },
  { to: '/app/requisitos', label: 'Requisitos e DRN', icon: FileText },
  { to: '/app/testes', label: 'Testes', icon: ClipboardCheck },
  { to: '/app/mudancas', label: 'Mudanças', icon: GitPullRequestArrow },
  { to: '/app/cliente', label: 'Portal do cliente', icon: Store },
]

export function AppShell() {
  const { dispatch } = usePortfolio()
  const [version, setVersion] = useState<'v2' | 'v1'>('v2')

  const resetPortfolio = () => {
    if (window.confirm('Restaurar todo o cenário inicial? Implantações criadas durante o teste serão removidas.')) {
      dispatch({ type: 'portfolio/reset' })
    }
  }

  const currentNav = version === 'v2' ? navigationV2 : navigationV1

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Brand />

        {/* Seletor de Versão 2.0 / 1.0 */}
        <div className="version-box" style={{ margin: '10px 14px 16px', padding: '10px', background: 'rgba(0,0,0,0.03)', borderRadius: '8px', border: '1px solid var(--line)' }}>
          <small style={{ display: 'block', fontSize: '0.68rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
            Modo de Navegação:
          </small>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
            <button
              type="button"
              onClick={() => setVersion('v2')}
              style={{
                padding: '6px 4px',
                fontSize: '0.72rem',
                fontWeight: 700,
                borderRadius: '6px',
                border: 0,
                cursor: 'pointer',
                background: version === 'v2' ? 'var(--petrol-900)' : 'transparent',
                color: version === 'v2' ? '#ffffff' : 'var(--muted)',
                transition: 'all 0.15s',
              }}
            >
              Versão 2.0
            </button>
            <button
              type="button"
              onClick={() => setVersion('v1')}
              style={{
                padding: '6px 4px',
                fontSize: '0.72rem',
                fontWeight: 700,
                borderRadius: '6px',
                border: 0,
                cursor: 'pointer',
                background: version === 'v1' ? 'var(--petrol-900)' : 'transparent',
                color: version === 'v1' ? '#ffffff' : 'var(--muted)',
                transition: 'all 0.15s',
              }}
            >
              Versão 1.0
            </button>
          </div>
        </div>

        <nav className="sidebar__nav" aria-label="Navegação principal">
          {currentNav.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => (isActive ? 'sidebar__link is-active' : 'sidebar__link')}
            >
              <Icon size={18} aria-hidden="true" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar__footer">
          {version === 'v1' && (
            <button className="sidebar__reset sidebar__guide" type="button" onClick={() => dispatch({ type: 'guide/set', visible: true })}>
              <Map size={16} aria-hidden="true" />
              Roteiro guiado
            </button>
          )}
          <button className="sidebar__reset" type="button" onClick={resetPortfolio}>
            <RotateCcw size={16} aria-hidden="true" />
            Restaurar dados
          </button>
          <p>{version === 'v2' ? 'Versão 2.0: Gestão orientada a valor.' : 'Versão 1.0: Estrutura modular original.'}</p>
        </div>
      </aside>

      <main className="workspace">
        <Outlet />
      </main>
      {version === 'v1' && <GuidedTour />}
    </div>
  )
}
