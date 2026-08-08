import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { App } from '../App'
import { guidedTours } from '../components/GuidedTour'
import { PortfolioProvider } from '../state/PortfolioContext'
import { STORAGE_KEY } from '../state/portfolio'

describe('Implanta foundation', () => {
  it('presents the project positioning on the landing page', () => {
    render(<MemoryRouter><PortfolioProvider><App /></PortfolioProvider></MemoryRouter>)
    expect(screen.getByRole('heading', { name: /da necessidade do cliente ao primeiro ciclo operacional validado/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /explorar o protótipo/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /iniciar demonstração guiada/i })).toBeInTheDocument()
  })

  const clientRoutes = guidedTours.flatMap(tour => {
    const step = tour.steps.find(([, , to]) => to.startsWith('/app/cliente'))
    return step ? [[tour.title, step[2], tour.projectId] as const] : []
  })

  it.each(clientRoutes)('opens the correct client from the %s guided tour', (_, route, projectId) => {
    render(
      <MemoryRouter initialEntries={[route]}>
        <PortfolioProvider><App /></PortfolioProvider>
      </MemoryRouter>,
    )

    const expectedNames: Record<string, string> = {
      'project-1': 'Rede Aurora',
      'project-2': 'Rede Prisma',
    }
    expect(screen.getByRole('heading', { name: `Olá, ${expectedNames[projectId]}` })).toBeInTheDocument()
  })

  it('shows a safe empty state when the portfolio has no projects', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      schemaVersion: 1,
      projects: [],
      perspective: 'client',
      guideVisible: false,
      guideProgress: [],
      initializedAt: new Date().toISOString(),
    }))

    render(
      <MemoryRouter initialEntries={['/app/cliente']}>
        <PortfolioProvider><App /></PortfolioProvider>
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: /nenhuma implantação disponível/i })).toBeInTheDocument()
    localStorage.removeItem(STORAGE_KEY)
  })
})
