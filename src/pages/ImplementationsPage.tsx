import { Plus, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { StatusBadge } from '../components/StatusBadge'
import { conditionLabels, phaseLabel, phases } from '../domain/catalog'
import { deriveCondition } from '../domain/condition'
import { usePortfolio } from '../state/PortfolioContext'
import { assessCapacity } from '../domain/capacity'
import type { OperationalCondition, PhaseId } from '../types'

export function ImplementationsPage() {
  const { state } = usePortfolio(); const [query, setQuery] = useState(''); const [phase, setPhase] = useState(''); const [condition, setCondition] = useState('')
  const projects = useMemo(() => state.projects.filter(project => (!query || `${project.profile.clientName} ${project.profile.implementationOwner}`.toLowerCase().includes(query.toLowerCase())) && (!phase || project.mainPhase === phase) && (!condition || deriveCondition(project) === condition)), [state.projects, query, phase, condition])
  return <div className="page"><header className="page__header"><div><p className="eyebrow">Gestão ponta a ponta</p><h1>Implantações</h1><p>{projects.length} de {state.projects.length} projetos visíveis.</p></div><Link className="button button--primary" to="/app/implantacoes/nova"><Plus size={16}/> Nova implantação</Link></header>
    <section className="filters"><label className="search"><Search size={17}/><input aria-label="Buscar implantação" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Buscar cliente ou responsável"/></label><select aria-label="Filtrar fase" value={phase} onChange={e=>setPhase(e.target.value)}><option value="">Todas as fases</option>{phases.map(p=><option value={p.id} key={p.id}>{p.shortLabel}</option>)}</select><select aria-label="Filtrar condição" value={condition} onChange={e=>setCondition(e.target.value)}><option value="">Todas as condições</option>{Object.entries(conditionLabels).map(([id,label])=><option value={id} key={id}>{label}</option>)}</select></section>
    <section className="table-wrap"><table className="data-table"><thead><tr><th>Cliente</th><th>Fase atual</th><th>Condição</th><th>Capacidade</th><th>Responsável</th><th>Go-live desejado</th><th>Pendências</th></tr></thead><tbody>{projects.map(project=><tr key={project.id}><td><Link to={`/app/implantacoes/${project.id}`}><strong>{project.profile.clientName}</strong><small>{project.profile.storeCount} loja(s)</small></Link></td><td>{phaseLabel(project.mainPhase,true)}</td><td><StatusBadge condition={deriveCondition(project)}/></td><td><span className={`capacity capacity--${assessCapacity(project).classification}`}>{assessCapacity(project).label}</span></td><td>{project.profile.implementationOwner}</td><td>{new Date(`${project.profile.desiredGoLive}T12:00:00`).toLocaleDateString('pt-BR')}</td><td>{project.pendingItems.filter(p=>p.status==='open').length}</td></tr>)}</tbody></table>{!projects.length&&<div className="no-results">Nenhuma implantação encontrada com esses filtros.</div>}</section>
  </div>
}
