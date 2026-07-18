import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { App } from './App'
import { PortfolioProvider } from './state/PortfolioContext'
import './styles/global.css'
import './styles/stress.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <PortfolioProvider>
        <App />
      </PortfolioProvider>
    </HashRouter>
  </StrictMode>,
)
