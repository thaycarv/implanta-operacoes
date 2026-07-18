import {
  BarChart3,
  ClipboardCheck,
  FileText,
  GitPullRequestArrow,
  LayoutDashboard,
  RotateCcw,
  Store,
  Map,
} from 'lucide-react'
import { NavLink, Outlet } from 'react-router-dom'
import { Brand } from '../Brand'
import { usePortfolio } from '../../state/PortfolioContext'
import { GuidedTour } from '../GuidedTour'

const navigation = [
  { to: '/app/dashboard', label: 'Visão geral', icon: LayoutDashboard },
  { to: '/app/implantacoes', label: 'Implantações', icon: BarChart3 },
  { to: '/app/requisitos', label: 'Requisitos e DRN', icon: FileText },
  { to: '/app/testes', label: 'Testes', icon: ClipboardCheck },
  { to: '/app/mudancas', label: 'Mudanças', icon: GitPullRequestArrow },
  { to: '/app/cliente', label: 'Portal do cliente', icon: Store },
]

export function AppShell() {
  const { dispatch } = usePortfolio()
  const resetPortfolio = () => {
    if (window.confirm('Restaurar todo o cenário inicial? Implantações criadas durante o teste serão removidas.')) dispatch({ type: 'portfolio/reset' })
  }
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Brand />
        <nav className="sidebar__nav" aria-label="Navegação principal">
          {navigation.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} className={({ isActive }) => isActive ? 'sidebar__link is-active' : 'sidebar__link'}>
              <Icon size={18} aria-hidden="true" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="sidebar__footer">
          <button className="sidebar__reset sidebar__guide" type="button" onClick={() => dispatch({ type: 'guide/set', visible: true })}>
            <Map size={16} aria-hidden="true" />
            Roteiro guiado
          </button>
          <button className="sidebar__reset" type="button" onClick={resetPortfolio}>
            <RotateCcw size={16} aria-hidden="true" />
            Restaurar dados
          </button>
          <p>Do requisito ao primeiro valor.</p>
        </div>
      </aside>
      <main className="workspace"><Outlet /></main>
      <GuidedTour />
    </div>
  )
}
