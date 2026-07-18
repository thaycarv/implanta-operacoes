import { Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'
import { LandingPage } from './pages/LandingPage'
import { DashboardPage } from './pages/DashboardPage'
import { ImplementationsPage } from './pages/ImplementationsPage'
import { ImplementationDetailPage } from './pages/ImplementationDetailPage'
import { NewImplementationPage } from './pages/NewImplementationPage'
import { RequirementsPage } from './pages/RequirementsPage'
import { TestsPage } from './pages/TestsPage'
import { ScopeChangesPage } from './pages/ScopeChangesPage'
import { ClientPortalPage } from './pages/ClientPortalPage'

export function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/app" element={<AppShell />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="implantacoes" element={<ImplementationsPage />} />
        <Route path="implantacoes/nova" element={<NewImplementationPage />} />
        <Route path="implantacoes/:projectId" element={<ImplementationDetailPage />} />
        <Route path="requisitos" element={<RequirementsPage />} />
        <Route path="testes" element={<TestsPage />} />
        <Route path="mudancas" element={<ScopeChangesPage />} />
        <Route path="cliente" element={<ClientPortalPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
