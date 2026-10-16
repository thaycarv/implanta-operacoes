import { Navigate } from 'react-router-dom'
import { usePortfolio } from '../state/PortfolioContext'

export function ImplementationsPage() {
  const { state } = usePortfolio()
  const firstId = state.selectedProjectId || state.projects[0]?.id

  if (firstId) {
    return <Navigate to={`/app/implantacoes/${firstId}`} replace />
  }

  return (
    <div className="page">
      <div className="empty-state">
        <h2>Nenhuma implantação disponível</h2>
        <p>Crie uma nova implantação ou restaure os dados demonstrativos para acessar os projetos.</p>
      </div>
    </div>
  )
}
