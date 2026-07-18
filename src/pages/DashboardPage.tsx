import { AlertTriangle, ArrowRight, CalendarClock, CircleCheck, Plus, RotateCcw, ShieldAlert, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import { StatusBadge } from '../components/StatusBadge'
import { conditionLabels, dependencyLabels, phaseLabel, phases } from '../domain/catalog'
import { deriveCondition } from '../domain/condition'
import { calculateIndicators } from '../domain/indicators'
import { usePortfolio } from '../state/PortfolioContext'

export function DashboardPage() {
  const { state, dispatch } = usePortfolio()
  const indicators = calculateIndicators(state.projects)
  const attention = state.projects.filter(p => ['blocked', 'delayed', 'attention'].includes(deriveCondition(p))).slice(0, 5)
  const openItems = state.projects.flatMap(project => project.pendingItems.filter(item => item.status === 'open').map(item => ({ ...item, project }))).slice(0, 5)
  const reset = () => window.confirm('Restaurar todo o cenário inicial? Implantações criadas durante o teste serão removidas.') && dispatch({ type: 'portfolio/reset' })

  return <div className="page">
    <header className="page__header">
      <div><p className="eyebrow">Carteira simulada</p><h1>Visão geral da carteira</h1><p>Decisões operacionais do requisito ao primeiro valor.</p></div>
      <div className="page__actions"><button className="button button--secondary" onClick={reset}><RotateCcw size={16}/> Restaurar dados</button><Link className="button button--primary" to="/app/implantacoes/nova"><Plus size={16}/> Nova implantação</Link></div>
    </header>

    <section className="metrics" aria-label="Indicadores da carteira">
      <article className="metric"><Users/><span>Implantações ativas</span><strong>{indicators.activeProjects}</strong><small>{state.projects.length} projetos na carteira</small></article>
      <article className="metric metric--danger"><ShieldAlert/><span>Bloqueadas</span><strong>{indicators.blockedProjects}</strong><small>Exigem decisão para avançar</small></article>
      <article className="metric metric--warning"><CalendarClock/><span>Go-lives próximos</span><strong>{indicators.upcomingGoLives}</strong><small>Previsão nos próximos 15 dias</small></article>
      <article className="metric metric--success"><CircleCheck/><span>Primeiro valor</span><strong>{indicators.firstValueValidated}</strong><small>Ciclos operacionais validados</small></article>
    </section>

    <div className="dashboard-grid">
      <section className="panel panel--wide"><div className="panel__head"><div><h2>Fluxo da carteira</h2><p>Distribuição pelas nove fases</p></div><Link to="/app/implantacoes">Ver carteira <ArrowRight size={15}/></Link></div>
        <div className="phase-bars">{phases.map(phase => <div className="phase-row" key={phase.id}><span>{phase.shortLabel}</span><div><i style={{width: `${Math.max(indicators.byPhase[phase.id] / Math.max(state.projects.length, 1) * 100, indicators.byPhase[phase.id] ? 10 : 0)}%`}}/></div><b>{indicators.byPhase[phase.id]}</b></div>)}</div>
      </section>
      <section className="panel"><div className="panel__head"><div><h2>Condição operacional</h2><p>Leitura derivada pelas regras</p></div></div>
        <div className="condition-list">{Object.entries(indicators.byCondition).map(([condition, count]) => <div key={condition}><StatusBadge condition={condition as keyof typeof conditionLabels}/><strong>{count}</strong></div>)}</div>
      </section>
      <section className="panel panel--wide"><div className="panel__head"><div><h2>Projetos que pedem atenção</h2><p>Prioridade para a gestão da carteira</p></div></div>
        <div className="project-list">{attention.map(project => <Link to={`/app/implantacoes/${project.id}`} className="project-row" key={project.id}><div><strong>{project.profile.clientName}</strong><small>{phaseLabel(project.mainPhase, true)} · {project.profile.implementationOwner}</small></div><StatusBadge condition={deriveCondition(project)}/><ArrowRight size={16}/></Link>)}</div>
      </section>
      <section className="panel"><div className="panel__head"><div><h2>Pendências abertas</h2><p>Origem e responsável explícitos</p></div></div>
        <div className="pending-list">{openItems.map(item => <div key={item.id}><AlertTriangle size={16}/><span><strong>{item.title}</strong><small>{item.project.profile.clientName} · {dependencyLabels[item.origin]}</small></span></div>)}</div>
      </section>
    </div>
  </div>
}
