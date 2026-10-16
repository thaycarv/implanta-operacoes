import {
  FileText,
  LayoutDashboard,
  RotateCcw,
} from 'lucide-react'
import { NavLink, Outlet } from 'react-router-dom'
import { Brand } from '../Brand'
import { usePortfolio } from '../../state/PortfolioContext'

const navigation = [
  { to: '/app/dashboard', label: 'Visão Geral', icon: LayoutDashboard },
  { to: '/app/implantacoes', label: 'Projetos', icon: FileText },
]

export function AppShell() {
  const { dispatch } = usePortfolio()

  const resetPortfolio = () => {
    if (window.confirm('Restaurar todo o cenário inicial? Projetos criados durante a exploração serão removidos.')) {
      dispatch({ type: 'portfolio/reset' })
    }
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Brand />

        <nav className="sidebar__nav" aria-label="Navegação principal">
          {navigation.map(({ to, label, icon: Icon }) => (
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
          <button className="sidebar__reset" type="button" onClick={resetPortfolio}>
            <RotateCcw size={16} aria-hidden="true" />
            Restaurar dados
          </button>
          <p>Gestão de programas de inovação e transformação digital.</p>
        </div>
      </aside>

      <main className="workspace">
        <Outlet />
      </main>
    </div>
  )
}
