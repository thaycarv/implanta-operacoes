import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { App } from '../App'
import { PortfolioProvider } from '../state/PortfolioContext'
import { STORAGE_KEY } from '../state/portfolio'

describe('Implanta foundation', () => {
  it('redirects root route directly to portfolio dashboard', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <PortfolioProvider>
          <App />
        </PortfolioProvider>
      </MemoryRouter>,
    )
    expect(screen.getByRole('heading', { name: /visão geral da carteira/i })).toBeInTheDocument()
    expect(screen.getByRole('region', { name: /indicadores da carteira/i })).toBeInTheDocument()
    expect(screen.getByRole('region', { name: /pipeline da jornada de implantação/i })).toBeInTheDocument()
  })

  it('renders client portal directly with coherent project context', () => {
    render(
      <MemoryRouter initialEntries={['/app/cliente?project=project-1']}>
        <PortfolioProvider>
          <App />
        </PortfolioProvider>
      </MemoryRouter>,
    )
    expect(screen.getByRole('heading', { name: /olá, polo universitário aurora/i })).toBeInTheDocument()
  })

  it('shows a safe empty state when the portfolio has no projects', () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        schemaVersion: 2,
        projects: [],
        perspective: 'client',
        guideVisible: false,
        guideProgress: [],
        initializedAt: new Date().toISOString(),
      }),
    )

    render(
      <MemoryRouter initialEntries={['/app/cliente']}>
        <PortfolioProvider>
          <App />
        </PortfolioProvider>
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: /nenhum projeto disponível/i })).toBeInTheDocument()
    localStorage.removeItem(STORAGE_KEY)
  })
})
