import {
  AlertTriangle,
  ArrowLeft,
  Building2,
  Calendar,
  Check,
  CheckCircle2,
  CircleCheck,
  Columns3,
  FileText,
  RotateCcw,
  Search,
  UserRound,
} from 'lucide-react'
import { useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { ImplementationDiagnosticCard } from '../components/ImplementationDiagnosticCard'
import { StatusBadge } from '../components/StatusBadge'
import { dependencyLabels, phaseLabel, phases } from '../domain/catalog'
import { deriveCondition, isFirstValueValidated } from '../domain/condition'
import { evaluateCSTransition } from '../domain/transition'
import { usePortfolio } from '../state/PortfolioContext'
import type { Requirement, RequirementStatus } from '../types'

export function ImplementationDetailPage() {
  const { projectId } = useParams()
  const { state, dispatch } = usePortfolio()
  const [viewMode, setViewMode] = useState<'executive' | 'kanban'>('executive')
  const [searchQuery, setSearchQuery] = useState('')

  const project = state.projects.find((p) => p.id === projectId)
  if (!project) return <Navigate to="/app/implantacoes" replace />

  const condition = deriveCondition(project)
  const openPending = project.pendingItems.filter((p) => p.status === 'open')
  const transition = evaluateCSTransition(project)

  const isCompleted = (r: Requirement) => ['delivered', 'qa_approved', 'client_approved'].includes(r.status)
  const isInProgress = (r: Requirement) => ['approved', 'in_delivery'].includes(r.status)
  const isTodo = (r: Requirement) => ['draft', 'review'].includes(r.status)

  const completedCount = project.requirements.filter(isCompleted).length
  const totalCount = project.requirements.length

  const filteredMasterList = state.projects.filter(
    (p) =>
      !searchQuery ||
      p.profile.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.profile.implementationOwner.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const reset = () => {
    if (window.confirm(`Restaurar somente o cenário de ${project.profile.clientName}?`)) {
      dispatch({ type: 'project/reset', projectId: project.id })
    }
  }

  const setDeliverableStatus = (reqId: string, status: RequirementStatus) => {
    dispatch({
      type: 'requirement/status',
      projectId: project.id,
      requirementId: reqId,
      status,
    })
  }

  const valueItems = [
    ['Operação do piloto em ambiente real', project.firstValue.saleProcessed],
    ['Capacitação das equipes concluída', project.firstValue.inventoryUpdated],
    ['Métricas e evidências de impacto registradas', project.firstValue.cashClosed],
    ['Diretrizes éticas e governança consolidadas', project.firstValue.dataReconciled],
  ] as const

  // Agrupamento para o Modo Quadro Kanban
  const kanbanColumns = [
    {
      id: 'todo',
      title: 'A Iniciar',
      items: project.requirements.filter((r) => isTodo(r)),
      targetStatus: 'in_delivery' as RequirementStatus,
      targetAction: 'Iniciar',
    },
    {
      id: 'in_progress',
      title: 'Em Andamento',
      items: project.requirements.filter((r) => isInProgress(r)),
      targetStatus: 'client_approved' as RequirementStatus,
      targetAction: 'Concluir',
    },
    {
      id: 'attention',
      title: 'Em Atenção',
      items: project.requirements.filter((r) => r.status === 'changed'),
      targetStatus: 'in_delivery' as RequirementStatus,
      targetAction: 'Retomar',
    },
    {
      id: 'done',
      title: 'Concluído',
      items: project.requirements.filter((r) => isCompleted(r)),
      targetStatus: 'draft' as RequirementStatus,
      targetAction: 'Reabrir',
    },
  ]

  return (
    <div className="split-pane-layout">
      {/* PAINEL MESTRE (ESQUERDA): Lista Rápida de Instituições */}
      <aside className="split-master" aria-label="Lista de instituições da carteira">
        <div className="split-master__header">
          <div className="split-master__title-row">
            <h2>Instituições</h2>
            <span className="split-master__count">{filteredMasterList.length}</span>
          </div>
          <div className="split-master__search">
            <Search size={14} color="var(--muted)" />
            <input
              type="text"
              placeholder="Buscar instituição ou líder..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Buscar instituição na lista"
            />
          </div>
        </div>

        <div className="split-master__list">
          {filteredMasterList.map((p) => {
            const pCondition = deriveCondition(p)
            const pPendingCount = p.pendingItems.filter((i) => i.status === 'open').length

            return (
              <Link
                key={p.id}
                to={`/app/implantacoes/${p.id}`}
                className={`split-item ${p.id === project.id ? 'is-active' : ''}`}
              >
                <div className="split-item__top">
                  <span className="split-item__name">{p.profile.clientName}</span>
                  <StatusBadge condition={pCondition} />
                </div>
                <span className="split-item__phase">{phaseLabel(p.mainPhase, true)}</span>
                <div className="split-item__meta">
                  <span>{p.profile.implementationOwner}</span>
                  {pPendingCount > 0 && <span>{pPendingCount} pendência(s)</span>}
                </div>
              </Link>
            )
          })}
        </div>
      </aside>

      {/* COCKPIT DE DETALHES (DIREITA): Projeto Selecionado */}
      <main className="split-detail">
        <div className="detail-top-nav">
          <Link className="back-link" to="/app/dashboard">
            <ArrowLeft size={16} /> Voltar ao Pipeline Kanban
          </Link>
          <div className="scenario-quick-pills">
            <span className="scenario-quick-label">Cenários rápidos:</span>
            {state.projects.slice(0, 3).map((p) => (
              <Link
                key={p.id}
                to={`/app/implantacoes/${p.id}`}
                className={`scenario-pill ${p.id === project.id ? 'is-active' : ''}`}
              >
                {p.profile.clientName}
              </Link>
            ))}
          </div>
        </div>

        <div className="detail-view-bar">
          <div className="view-switch" role="group" aria-label="Modo de visualização do projeto">
            <button
              type="button"
              className={viewMode === 'executive' ? 'is-active' : ''}
              onClick={() => setViewMode('executive')}
            >
              <FileText size={15} /> Ficha Executiva
            </button>
            <button
              type="button"
              className={viewMode === 'kanban' ? 'is-active' : ''}
              onClick={() => setViewMode('kanban')}
            >
              <Columns3 size={15} /> Quadro de Atividades
            </button>
          </div>

          <button className="button button--secondary" onClick={reset}>
            <RotateCcw size={16} /> Restaurar cenário
          </button>
        </div>

        <header className="detail-hero">
          <div>
            <p className="eyebrow">
              Projeto: {project.source === 'visitor' ? 'criado pelo visitante' : 'cenário demonstrativo'}
            </p>
            <h1>{project.profile.clientName}</h1>
            <p>{project.profile.customerGoal}</p>
          </div>
          <div className="detail-hero__actions">
            <StatusBadge condition={condition} />
          </div>
        </header>

        <section className="profile-strip">
          <div>
            <UserRound />
            <span>
              <small>Líder da Facilitação</small>
              <strong>{project.profile.implementationOwner}</strong>
            </span>
          </div>
          <div>
            <Building2 />
            <span>
              <small>Abrangência</small>
              <strong>{project.profile.storeCount} unidade(s) / secretaria(s)</strong>
            </span>
          </div>
          <div>
            <Calendar />
            <span>
              <small>Previsão de Lançamento do Piloto</small>
              <strong>{new Date(`${project.profile.desiredGoLive}T12:00:00`).toLocaleDateString('pt-BR')}</strong>
            </span>
          </div>
        </section>

        {/* MODALIDADE 1: FICHA EXECUTIVA ONE-PAGE (PADRÃO) */}
        {viewMode === 'executive' && (
          <>
            {/* Linha do Tempo da Jornada */}
            <section className="panel phase-timeline" style={{ marginTop: '20px' }}>
              <div className="panel__head">
                <div>
                  <h2>Jornada de inovação pública</h2>
                  <p>Etapa atual: {phaseLabel(project.mainPhase)}</p>
                </div>
              </div>
              <div className="timeline">
                {phases.map((p, index) => {
                  const current = phases.findIndex((x) => x.id === project.mainPhase)
                  return (
                    <div className={index < current ? 'is-done' : index === current ? 'is-current' : ''} key={p.id}>
                      <i>{index < current ? <Check size={13} /> : index + 1}</i>
                      <span>{p.shortLabel}</span>
                    </div>
                  )
                })}
              </div>
            </section>

            {/* Grid Executivo em 2 Colunas */}
            <div className="executive-grid">
              {/* Coluna Esquerda: Diagnóstico, Bloqueios e Sustentação */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Card de Diagnóstico e Exportação */}
                <ImplementationDiagnosticCard project={project} />

                {/* Card de Bloqueios e Pendências */}
                <section className="panel">
                  <div className="panel__head">
                    <div>
                      <h2>Impedimentos e Pendências</h2>
                      <p>Ações necessárias para o avanço da jornada</p>
                    </div>
                  </div>
                  {openPending.length ? (
                    <div className="issues">
                      {openPending.map((item) => (
                        <article key={item.id}>
                          <span className={`severity severity--${item.severity}`}>
                            {item.severity === 'critical' ? 'Crítica' : 'Não crítica'}
                          </span>
                          <div>
                            <strong>{item.title}</strong>
                            <p>{item.description}</p>
                            <small>
                              {dependencyLabels[item.origin]} · {item.owner} · prazo {new Date(`${item.dueDate}T12:00:00`).toLocaleDateString('pt-BR')}
                            </small>
                          </div>
                        </article>
                      ))}
                    </div>
                  ) : (
                    <div className="client-clear" style={{ padding: '16px 0' }}>
                      <CheckCircle2 size={24} color="var(--success)" />
                      <div>
                        <strong>Sem impedimentos no momento</strong>
                        <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: 'var(--muted)' }}>
                          Todas as atividades estão em dia e sem bloqueios institucionais.
                        </p>
                      </div>
                    </div>
                  )}
                </section>

                {/* Card do Ciclo de Impacto e Governança */}
                <section className="panel">
                  <div className="panel__head">
                    <div>
                      <h2>Ciclo de Impacto e Governança</h2>
                      <p>{isFirstValueValidated(project) ? 'Primeiro ciclo validado com sucesso' : 'Critérios em consolidação'}</p>
                    </div>
                  </div>
                  <div className="value-list">
                    {valueItems.map(([label, ok]) => (
                      <div className={ok ? 'is-ok' : ''} key={label}>
                        <i>{ok && <Check size={14} />}</i>
                        <span>{label}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid var(--line)' }}>
                    <small style={{ color: 'var(--muted)', display: 'block', marginBottom: '6px' }}>Transição para sustentação</small>
                    <strong className={`transition transition--${transition.status}`}>{transition.label}</strong>
                    <p className="operational-note" style={{ marginTop: '6px' }}>{transition.reasons.join(' · ')}</p>
                  </div>
                </section>
              </div>

              {/* Coluna Direita: Entregáveis & Atividades Práticas do Piloto */}
              <section className="deliverables-box">
                <div className="deliverables-box__head">
                  <div>
                    <h2>Entregáveis do Piloto</h2>
                    <p style={{ margin: '4px 0 0 0', fontSize: '0.78rem', color: 'var(--muted)' }}>
                      Acompanhamento direto das atividades essenciais da jornada
                    </p>
                  </div>
                  <span className="deliverables-box__progress">
                    {completedCount} de {totalCount} concluídos
                  </span>
                </div>

                <div className="deliverables-list">
                  {project.requirements.map((req) => {
                    const done = isCompleted(req)
                    const wip = isInProgress(req)

                    return (
                      <article
                        className={`deliverable-card ${done ? 'is-done' : wip ? 'is-in-progress' : ''}`}
                        key={req.id}
                      >
                        <div className="deliverable-card__top">
                          <div>
                            <span className="deliverable-card__code">{req.code}</span>
                            <h3 className="deliverable-card__title">{req.title}</h3>
                          </div>
                          {done && <CircleCheck size={18} color="#28a745" />}
                        </div>

                        <p className="deliverable-card__desc">{req.acceptanceCriteria}</p>

                        <div className="deliverable-card__footer">
                          <span>
                            <strong>Ponto focal:</strong> {req.validator}
                          </span>

                          <div className="deliverable-status-actions" role="group" aria-label={`Status de ${req.code}`}>
                            <button
                              type="button"
                              className={`deliverable-status-btn ${!done && !wip ? 'is-active-todo' : ''}`}
                              onClick={() => setDeliverableStatus(req.id, 'draft')}
                              title="Marcar como A Iniciar"
                            >
                              A Iniciar
                            </button>
                            <button
                              type="button"
                              className={`deliverable-status-btn ${wip ? 'is-active-wip' : ''}`}
                              onClick={() => setDeliverableStatus(req.id, 'in_delivery')}
                              title="Marcar como Em Andamento"
                            >
                              Em Andamento
                            </button>
                            <button
                              type="button"
                              className={`deliverable-status-btn ${done ? 'is-active-done' : ''}`}
                              onClick={() => setDeliverableStatus(req.id, 'client_approved')}
                              title="Marcar como Concluído"
                            >
                              Concluído
                            </button>
                          </div>
                        </div>
                      </article>
                    )
                  })}
                </div>
              </section>
            </div>
          </>
        )}

        {/* MODALIDADE 2: QUADRO KANBAN DE ATIVIDADES DO PILOTO */}
        {viewMode === 'kanban' && (
          <section aria-label="Quadro de atividades do piloto">
            <div className="pilot-kanban-board">
              {kanbanColumns.map((col) => (
                <div className="pilot-kanban-col" key={col.id}>
                  <header className="pilot-kanban-col__head">
                    <h3>{col.title}</h3>
                    <span className="pilot-kanban-col__count">{col.items.length}</span>
                  </header>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {col.items.length === 0 ? (
                      <p style={{ fontSize: '0.75rem', color: 'var(--muted)', textAlign: 'center', padding: '20px 0' }}>
                        Nenhuma atividade nesta coluna
                      </p>
                    ) : (
                      col.items.map((req) => (
                        <article className="pilot-kanban-card" key={req.id}>
                          <span style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--muted)' }}>{req.code}</span>
                          <h4>{req.title}</h4>
                          <p>{req.acceptanceCriteria}</p>
                          <small style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>
                            Focal: {req.validator}
                          </small>

                          <div className="pilot-kanban-card__actions">
                            <button
                              type="button"
                              onClick={() => setDeliverableStatus(req.id, col.targetStatus)}
                            >
                              {col.targetAction} →
                            </button>
                          </div>
                        </article>
                      ))
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  )
}
