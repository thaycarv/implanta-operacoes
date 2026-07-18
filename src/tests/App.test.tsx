import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { App } from '../App'
import { PortfolioProvider } from '../state/PortfolioContext'

describe('Implanta foundation', () => {
  it('presents the project positioning on the landing page', () => {
    render(<MemoryRouter><PortfolioProvider><App /></PortfolioProvider></MemoryRouter>)
    expect(screen.getByRole('heading', { name: /da necessidade do cliente ao primeiro valor/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /explorar o protótipo/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /iniciar demonstração guiada/i })).toBeInTheDocument()
  })
})
