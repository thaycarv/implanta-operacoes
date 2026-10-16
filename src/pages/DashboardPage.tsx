import {
  AlertTriangle,
  ArrowRight,
  Calendar,
  CalendarClock,
  CircleCheck,
  Columns3,
  LayoutList,
  Plus,
  RotateCcw,
  ShieldAlert,
  User,
  Users,
} from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { StatusBadge } from '../components/StatusBadge'
import { conditionLabels, dependencyLabels, phaseLabel, phases } from '../domain/catalog'
import { deriveCondition } from '../domain/condition'
import { calculateIndicators } from '../domain/indicators'
import { usePortfolio } from '../state/PortfolioContext'
import type { ImplementationProject, PhaseId } from '../types'

interface KanbanStage {
  id: string
  title: string
  description: string
  phases: PhaseId[]
}

const kanbanStages: KanbanStage[] = [
  {
    id: 'discovery',
    title: '1. Adesão & Diagnóstico',
    description: 'Adesão institucional e diagnóstico de maturidade local',
    phases: ['handoff', 'discovery'],
  },
  {
    id: 'planning',
    title: '2. Casos de Uso & Planejamento',
    description: 'Trilha formativa e plano de trabalho do piloto',
    phases: ['requirements', 'technical_planning'],
  },
  {
    id: 'execution',
    title: '3. Oficinas & Prototipagem',
    description: 'Oficinas práticas e revisão metodológica',
    phases: ['delivery', 'internal_qa'],
  },
  {
    id: 'validation',
    title: '4. Validação em Campo & Lançamento',
    description: 'Experimentação assistida e lançamento do piloto no serviço público',
    phases: ['client_validation', 'go_live'],
  },
  {
    id: 'adoption',
    title: '5. Sustentação & Escala',
    description: 'Multiplicação de conhecimentos e institucionalização',
    phases: ['first_value'],
  },
]

export function DashboardPage() {
  const { state, dispatch } = usePortfolio()
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban')
  const indicators = calculateIndicators(state.projects)
  const attention = state.projects.filter(p => ['blocked', 'delayed', 'attention'].includes(deriveCondition(p))).slice(0, 5)
  const openItems = state.projects.flatMap(project => project.pendingItems.filter(item => item.status === 'open').map(item => ({ ...item, project }))).slice(0, 5)

  const reset = () => {
    if (window.confirm('Restaurar todo o cenário inicial? Projetos criados durante a exploração serão removidos.')) {
      dispatch({ type: 'portfolio/reset' })
    }
  }

  const getProjectsByStage = (stage: KanbanStage): ImplementationProject[] => {
    return state.projects.filter(p => stage.phases.includes(p.mainPhase))
  }

  return (
    <div className="page">
      <header className="page__header">
        <div>
          <h1>Visão geral de projetos</h1>
        </div>
        <div className="page__actions">
          <div className="view-switch" role="group" aria-label="Modo de visualização">
            <button
              type="button"
              className={viewMode === 'kanban' ? 'is-active' : ''}
              onClick={() => setViewMode('kanban')}
            >
              <Columns3 size={15} /> Pipeline Kanban
            </button>
            <button
              type="button"
              className={viewMode === 'table' ? 'is-active' : ''}
              onClick={() => setViewMode('table')}
            >
              <LayoutList size={15} /> Resumo Operacional
            </button>
          </div>
          <button className="button button--secondary" onClick={reset}>
            <RotateCcw size={16} /> Restaurar dados
          </button>
          <Link className="button button--primary" to="/app/implantacoes/nova">
            <Plus size={16} /> Novo projeto
          </Link>
        </div>
      </header>

      {/* Faixa Executiva de Indicadores */}
      <section className="metrics" aria-label="Indicadores de projetos">
        <article className="metric">
          <Users />
          <span>Projetos em curso</span>
          <strong>{indicators.activeProjects}</strong>
        </article>
        <article className="metric metric--danger">
          <ShieldAlert />
          <span>Pontos de Atenção</span>
          <strong>{indicators.blockedProjects}</strong>
          <small>Verificar</small>
        </article>
        <article className="metric metric--warning">
          <CalendarClock />
          <span>Pilotos a lançar</span>
          <strong>{indicators.upcomingGoLives}</strong>
        </article>
        <article className="metric metric--success">
          <CircleCheck />
          <span>Ciclos validados</span>
          <strong>{indicators.firstValueValidated}</strong>
        </article>
      </section>

      {/* MODO 1: PIPELINE KANBAN (PADRÃO) */}
      {viewMode === 'kanban' && (
        <section aria-label="Pipeline da jornada de implantação">
          <div className="kanban-board">
            {kanbanStages.map(stage => {
              const stageProjects = getProjectsByStage(stage)
              return (
                <div className="kanban-column" key={stage.id}>
                  <header className="kanban-column__head">
                    <div className="kanban-column__title">
                      <h3>{stage.title}</h3>
                      <span className="kanban-column__count">{stageProjects.length}</span>
                    </div>
                    <p className="kanban-column__desc">{stage.description}</p>
                  </header>

                  <div className="kanban-column__cards">
                    {stageProjects.length === 0 ? (
                      <div className="kanban-empty">Nenhum projeto nesta etapa</div>
                    ) : (
                      stageProjects.map(project => {
                        const condition = deriveCondition(project)
                        const criticalIssue = project.pendingItems.find(i => i.status === 'open' && i.severity === 'critical')
                        const warningIssue = project.pendingItems.find(i => i.status === 'open' && i.severity !== 'critical')

                        return (
                          <Link
                            key={project.id}
                            to={`/app/implantacoes/${project.id}`}
                            className={`kanban-card kanban-card--${condition}`}
                          >
                            <div className="kanban-card__top">
                              <h4 className="kanban-card__name">{project.profile.clientName}</h4>
                              <StatusBadge condition={condition} />
                            </div>

                            <span className="kanban-card__phase">
                              {phaseLabel(project.mainPhase, true)}
                            </span>

                            {criticalIssue && (
                              <div className="kanban-card__issue">
                                <AlertTriangle size={13} />
                                <span>{criticalIssue.title}</span>
                              </div>
                            )}

                            {!criticalIssue && warningIssue && (
                              <div className="kanban-card__issue kanban-card__issue--warning">
                                <AlertTriangle size={13} />
                                <span>{warningIssue.title}</span>
                              </div>
                            )}

                            <div className="kanban-card__footer">
                              <span className="kanban-card__owner">
                                <User size={12} /> {project.profile.implementationOwner}
                              </span>
                              <span className="kanban-card__date">
                                <Calendar size={11} style={{ display: 'inline', marginRight: '3px' }} />
                                {new Date(`${project.profile.desiredGoLive}T12:00:00`).toLocaleDateString('pt-BR')}
                              </span>
                            </div>
                          </Link>
                        )
                      })
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      )}

      {/* MODO 2: RESUMO OPERACIONAL TABULAR */}
      {viewMode === 'table' && (
        <div className="dashboard-grid">
          <section className="panel panel--wide">
            <div className="panel__head">
              <div>
                <h2>Distribuição por macrofases</h2>
                <p>Volume de projetos em cada uma das 9 etapas</p>
              </div>
              <Link to="/app/implantacoes">
                Ver projetos <ArrowRight size={15} />
              </Link>
            </div>
            <div className="phase-bars">
              {phases.map(phase => (
                <div className="phase-row" key={phase.id}>
                  <span>{phase.shortLabel}</span>
                  <div>
                    <i
                      style={{
                        width: `${Math.max((indicators.byPhase[phase.id] / Math.max(state.projects.length, 1)) * 100, indicators.byPhase[phase.id] ? 10 : 0)}%`,
                      }}
                    />
                  </div>
                  <b>{indicators.byPhase[phase.id]}</b>
                </div>
              ))}
            </div>
          </section>

          <section className="panel">
            <div className="panel__head">
              <div>
                <h2>Condição da carteira</h2>
                <p>Status atual consolidado</p>
              </div>
            </div>
            <div className="condition-list">
              {Object.entries(indicators.byCondition).map(([condition, count]) => (
                <div key={condition}>
                  <StatusBadge condition={condition as keyof typeof conditionLabels} />
                  <strong>{count}</strong>
                </div>
              ))}
            </div>
          </section>

          <section className="panel panel--wide">
            <div className="panel__head">
              <div>
                <h2>Instituições que pedem atenção</h2>
                <p>Prioridade para resolução de impedimentos</p>
              </div>
            </div>
            <div className="project-list">
              {attention.map(project => (
                <Link to={`/app/implantacoes/${project.id}`} className="project-row" key={project.id}>
                  <div>
                    <strong>{project.profile.clientName}</strong>
                    <small>
                      {phaseLabel(project.mainPhase, true)} · {project.profile.implementationOwner}
                    </small>
                  </div>
                  <StatusBadge condition={deriveCondition(project)} />
                  <ArrowRight size={16} />
                </Link>
              ))}
            </div>
          </section>

          <section className="panel">
            <div className="panel__head">
              <div>
                <h2>Pendências em aberto</h2>
                <p>Origem e responsabilidade clara</p>
              </div>
            </div>
            <div className="pending-list">
              {openItems.map(item => (
                <div key={item.id}>
                  <AlertTriangle size={16} />
                  <span>
                    <strong>{item.title}</strong>
                    <small>
                      {item.project.profile.clientName} · {dependencyLabels[item.origin]}
                    </small>
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  )
}
