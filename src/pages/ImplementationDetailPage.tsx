import {
  ArrowLeft,
  Building2,
  Calendar,
  Check,
  ClipboardCheck,
  Eye,
  FileText,
  GitPullRequestArrow,
  RotateCcw,
  Search,
  UserRound,
} from 'lucide-react'
import { useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { ImplementationDiagnosticCard } from '../components/ImplementationDiagnosticCard'
import { StatusBadge } from '../components/StatusBadge'
import { assessCapacity } from '../domain/capacity'
import { dependencyLabels, phaseLabel, phases } from '../domain/catalog'
import { deriveCondition, isFirstValueValidated } from '../domain/condition'
import { evaluateGoLiveGate } from '../domain/gates'
import { requirementCoverage } from '../domain/requirements'
import { evaluateCSTransition } from '../domain/transition'
import { usePortfolio } from '../state/PortfolioContext'
import type {
  RequirementStatus,
  ScopeChange,
  ScopeChangeStatus,
  ScopeChangeType,
  TestResult,
} from '../types'

const statusLabels: Record<RequirementStatus, string> = {
  draft: 'Rascunho',
  review: 'Em revisão',
  approved: 'Aprovado',
  in_delivery: 'Em execução',
  delivered: 'Entregue',
  qa_approved: 'Revisão aprovada',
  client_approved: 'Validado em campo',
  changed: 'Alterado',
}

const resultLabel: Record<TestResult, string> = {
  not_run: 'Não executado',
  approved: 'Aprovado',
  failed: 'Reprovado',
  approved_with_note: 'Aprovado com ressalva',
}

const typeLabels: Record<ScopeChangeType, string> = {
  defect: 'Inconsistência',
  requirement_divergence: 'Divergência de caso de uso',
  scope_change: 'Mudança de escopo do piloto',
  future_improvement: 'Melhoria futura e escala',
  configuration_pending: 'Pendência de alinhamento',
}

const changeStatusLabels: Record<ScopeChangeStatus, string> = {
  analysis: 'Em análise',
  awaiting_client: 'Aguardando validação local',
  approved: 'Aprovada',
  rejected: 'Recusada',
  planned_future: 'Planejada para o futuro',
}

export function ImplementationDetailPage() {
  const { projectId } = useParams()
  const { state, dispatch } = usePortfolio()
  const [activeTab, setActiveTab] = useState<'overview' | 'requirements' | 'tests' | 'changes' | 'portal'>('overview')
  const [selectedReqId, setSelectedReqId] = useState('')
  const [testFilter, setTestFilter] = useState<'all' | 'internal' | 'client'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [isChangeFormOpen, setIsChangeFormOpen] = useState(false)
  const [changeDraft, setChangeDraft] = useState({
    title: '',
    description: '',
    type: 'scope_change' as ScopeChangeType,
    impactDays: 3,
    impactsGoLive: false,
  })

  const project = state.projects.find((p) => p.id === projectId)
  if (!project) return <Navigate to="/app/implantacoes" replace />

  const condition = deriveCondition(project)
  const openPending = project.pendingItems.filter((p) => p.status === 'open')
  const doneReq = project.requirements.filter((r) => ['qa_approved', 'client_approved'].includes(r.status)).length
  const capacity = assessCapacity(project)
  const transition = evaluateCSTransition(project)
  const coverage = requirementCoverage(project.requirements)
  const selectedReq = project.requirements.find((r) => r.id === selectedReqId) ?? project.requirements[0]
  const filteredTests = project.tests.filter((t) => testFilter === 'all' || t.type === testFilter)
  const gate = evaluateGoLiveGate(project)
  const changes = project.scopeChanges ?? []

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

  const valueItems = [
    ['Operação do piloto em ambiente real', project.firstValue.saleProcessed],
    ['Capacitação das equipes concluída', project.firstValue.inventoryUpdated],
    ['Métricas e evidências de impacto registradas', project.firstValue.cashClosed],
    ['Diretrizes éticas e governança consolidadas', project.firstValue.dataReconciled],
  ] as const

  const submitChange = (e: React.FormEvent) => {
    e.preventDefault()
    const now = new Date().toISOString()
    const change: ScopeChange = {
      id: `${project.id}-change-${Date.now()}`,
      code: `MUD-${String(changes.length + 1).padStart(3, '0')}`,
      title: changeDraft.title,
      description: changeDraft.description,
      type: changeDraft.type,
      status: 'analysis',
      requestedBy: 'Visitante do protótipo',
      impactPhase: project.mainPhase,
      impactDays: changeDraft.impactDays,
      impactsGoLive: changeDraft.impactsGoLive,
      createdAt: now,
      updatedAt: now,
    }
    dispatch({ type: 'change/add', projectId: project.id, change })
    setIsChangeFormOpen(false)
    setChangeDraft({ title: '', description: '', type: 'scope_change', impactDays: 3, impactsGoLive: false })
  }

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
            <button className="button button--secondary" onClick={reset}>
              <RotateCcw size={16} /> Restaurar cenário
            </button>
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

        {/* Card de Diagnóstico e Exportação Operacional */}
        <ImplementationDiagnosticCard project={project} />

        {/* Abas Unificadas da Implantação */}
        <nav className="detail-tabs" aria-label="Navegação da implantação">
          <button
            type="button"
            className={`detail-tab ${activeTab === 'overview' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Visão Geral e Ciclo
          </button>
          <button
            type="button"
            className={`detail-tab ${activeTab === 'requirements' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('requirements')}
          >
            <FileText size={15} /> Casos de Uso ({project.requirements.length})
          </button>
          <button
            type="button"
            className={`detail-tab ${activeTab === 'tests' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('tests')}
          >
            <ClipboardCheck size={15} /> Validação em Campo e Mentoria ({project.tests.length})
          </button>
          <button
            type="button"
            className={`detail-tab ${activeTab === 'changes' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('changes')}
          >
            <GitPullRequestArrow size={15} /> Mudanças de Escopo ({changes.length})
          </button>
          <button
            type="button"
            className={`detail-tab ${activeTab === 'portal' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('portal')}
          >
            <Eye size={15} /> Visão Compartilhada
          </button>
        </nav>

        {/* Conteúdo da Aba 1: Visão Geral */}
        {activeTab === 'overview' && (
          <>
            <section className="panel phase-timeline">
              <div className="panel__head">
                <div>
                  <h2>Jornada de inovação</h2>
                  <p>Fase atual: {phaseLabel(project.mainPhase)}</p>
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

            <div className="detail-grid">
              <section className="panel">
                <div className="panel__head">
                  <div>
                    <h2>Saúde da entrega</h2>
                    <p>Cobertura sem percentual artificial</p>
                  </div>
                </div>
                <div className="facts">
                  <div>
                    <span>Critérios validados</span>
                    <strong>{doneReq} de {project.requirements.length}</strong>
                  </div>
                  <div>
                    <span>Pacotes de trabalho</span>
                    <strong>{project.packages.length}</strong>
                  </div>
                  <div>
                    <span>Pendências abertas</span>
                    <strong>{openPending.length}</strong>
                  </div>
                  <div>
                    <span>Validações registradas</span>
                    <strong>{project.tests.length}</strong>
                  </div>
                </div>
              </section>

              <section className="panel">
                <div className="panel__head">
                  <div>
                    <h2>Ciclo de impacto</h2>
                    <p>{isFirstValueValidated(project) ? 'Primeiro ciclo validado' : 'Critérios em consolidação'}</p>
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
              </section>

              <section className="panel">
                <div className="panel__head">
                  <div>
                    <h2>Esforço de facilitação</h2>
                    <p>Classe operacional baseada no perfil local</p>
                  </div>
                </div>
                <strong className={`capacity capacity--${capacity.classification}`}>{capacity.label}</strong>
                <p className="operational-note">{capacity.reasons.join(' · ')}</p>
              </section>

              <section className="panel">
                <div className="panel__head">
                  <div>
                    <h2>Transição para Sustentação</h2>
                    <p>Institucionalização e comunidade de prática</p>
                  </div>
                </div>
                <strong className={`transition transition--${transition.status}`}>{transition.label}</strong>
                <p className="operational-note">{transition.reasons.join(' · ')}</p>
              </section>

              <section className="panel panel--full">
                <div className="panel__head">
                  <div>
                    <h2>Pendências e dependências</h2>
                    <p>O sistema sinaliza; a decisão continua humana.</p>
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
                  <p className="quiet">Nenhuma pendência aberta neste cenário.</p>
                )}
              </section>
            </div>
          </>
        )}

        {/* Conteúdo da Aba 2: Casos de Uso */}
        {activeTab === 'requirements' && (
          <div className="tab-pane">
            <section className="metrics metrics--compact">
              <article className="metric">
                <FileText />
                <span>Casos de uso</span>
                <strong>{coverage.total}</strong>
              </article>
              <article className="metric">
                <span>Entregues</span>
                <strong>{coverage.delivered}</strong>
              </article>
              <article className="metric">
                <span>Validados</span>
                <strong>{coverage.clientApproved}</strong>
              </article>
              <article className="metric metric--danger">
                <span>Bloqueadores do Piloto</span>
                <strong>{coverage.goLiveBlockersOpen}</strong>
              </article>
            </section>

            <div className="split-view">
              <section className="panel requirement-index">
                <div className="panel__head">
                  <div>
                    <h2>Matriz de casos de uso</h2>
                    <p>{project.requirements.length} itens mapeados</p>
                  </div>
                </div>
                {project.requirements.map((req) => (
                  <button
                    className={selectedReq?.id === req.id ? 'is-selected' : ''}
                    onClick={() => setSelectedReqId(req.id)}
                    key={req.id}
                  >
                    <span>
                      <b>{req.code}</b>
                      <small>{req.title}</small>
                    </span>
                    <em>{statusLabels[req.status]}</em>
                  </button>
                ))}
              </section>

              {selectedReq && (
                <section className="panel requirement-detail">
                  <div className="trace-title">
                    <span>{selectedReq.code} · v{selectedReq.version}</span>
                    <h2>{selectedReq.title}</h2>
                  </div>
                  <div className="trace-chain">
                    <article>
                      <small>1. Necessidade Pública / Institucional</small>
                      <p>{selectedReq.businessNeed}</p>
                    </article>
                    <article>
                      <small>2. Diretriz ou Regra do Fluxo</small>
                      <p>{selectedReq.businessRule}</p>
                    </article>
                    <article>
                      <small>3. Critério de Aceite e Sucesso</small>
                      <p>{selectedReq.acceptanceCriteria}</p>
                    </article>
                    <article>
                      <small>4. Evidência de Validação</small>
                      <p>{selectedReq.testIds.length} validação(ões) vinculada(s) · responsável: {selectedReq.validator}</p>
                    </article>
                  </div>
                  <label className="status-control">
                    Atualizar estado do caso de uso
                    <select
                      value={selectedReq.status}
                      onChange={(e) =>
                        dispatch({
                          type: 'requirement/status',
                          projectId: project.id,
                          requirementId: selectedReq.id,
                          status: e.target.value as RequirementStatus,
                        })
                      }
                    >
                      {Object.entries(statusLabels).map(([id, label]) => (
                        <option value={id} key={id}>{label}</option>
                      ))}
                    </select>
                  </label>
                </section>
              )}
            </div>
          </div>
        )}

        {/* Conteúdo da Aba 3: Validação em Campo e Mentoria */}
        {activeTab === 'tests' && (
          <div className="tab-pane">
            <section className={`gate-banner ${gate.ready ? 'is-ready' : 'is-blocked'}`}>
              <div>
                <strong>{gate.ready ? 'Gate de Lançamento do Piloto liberado' : 'Gate de Lançamento do Piloto bloqueado'}</strong>
                <p>{gate.ready ? 'Critérios críticos atendidos para início do piloto no serviço público.' : gate.reasons.join(' · ')}</p>
              </div>
            </section>

            <section className="test-summary">
              <nav>
                <button className={testFilter === 'all' ? 'is-active' : ''} onClick={() => setTestFilter('all')}>
                  Todos ({project.tests.length})
                </button>
                <button className={testFilter === 'internal' ? 'is-active' : ''} onClick={() => setTestFilter('internal')}>
                  Revisão Metodológica
                </button>
                <button className={testFilter === 'client' ? 'is-active' : ''} onClick={() => setTestFilter('client')}>
                  Validação em Campo
                </button>
              </nav>
            </section>

            <section className="test-grid">
              {filteredTests.map((test) => {
                const last = test.executions.at(-1)
                return (
                  <article className="panel test-card" key={test.id}>
                    <header>
                      <span>{test.code} · {test.type === 'internal' ? 'Revisão Metodológica' : 'Validação em Campo'}</span>
                      <b className={`result result--${last?.result ?? 'not_run'}`}>{resultLabel[last?.result ?? 'not_run']}</b>
                    </header>
                    <h2>{test.title}</h2>
                    <p><strong>Resultado esperado:</strong> {test.expectedResult}</p>
                    <footer>
                      <button
                        onClick={() =>
                          dispatch({
                            type: 'test/execute',
                            projectId: project.id,
                            testId: test.id,
                            result: 'approved',
                            executor: test.type === 'client' ? project.profile.clientKeyUser : 'Facilitação Metodológica',
                          })
                        }
                      >
                        Aprovar
                      </button>
                      <button
                        onClick={() =>
                          dispatch({
                            type: 'test/execute',
                            projectId: project.id,
                            testId: test.id,
                            result: 'failed',
                            executor: test.type === 'client' ? project.profile.clientKeyUser : 'Facilitação Metodológica',
                          })
                        }
                      >
                        Reprovar
                      </button>
                    </footer>
                  </article>
                )
              })}
            </section>
          </div>
        )}

        {/* Conteúdo da Aba 4: Mudanças de Escopo */}
        {activeTab === 'changes' && (
          <div className="tab-pane">
            <div className="page__actions" style={{ marginBottom: '16px' }}>
              <button className="button button--primary" onClick={() => setIsChangeFormOpen(!isChangeFormOpen)}>
                + Nova solicitação de mudança
              </button>
            </div>

            {isChangeFormOpen && (
              <form className="panel change-form" onSubmit={submitChange}>
                <label>
                  Título
                  <input required value={changeDraft.title} onChange={(e) => setChangeDraft({ ...changeDraft, title: e.target.value })} />
                </label>
                <label>
                  Classificação
                  <select value={changeDraft.type} onChange={(e) => setChangeDraft({ ...changeDraft, type: e.target.value as ScopeChangeType })}>
                    {Object.entries(typeLabels).map(([id, label]) => (
                      <option value={id} key={id}>{label}</option>
                    ))}
                  </select>
                </label>
                <label className="span-2">
                  Descrição
                  <textarea required value={changeDraft.description} onChange={(e) => setChangeDraft({ ...changeDraft, description: e.target.value })} />
                </label>
                <label>
                  Impacto em dias
                  <input min="0" type="number" value={changeDraft.impactDays} onChange={(e) => setChangeDraft({ ...changeDraft, impactDays: Number(e.target.value) })} />
                </label>
                <footer className="span-2">
                  <button type="button" className="button button--secondary" onClick={() => setIsChangeFormOpen(false)}>
                    Cancelar
                  </button>
                  <button className="button button--primary">Registrar análise</button>
                </footer>
              </form>
            )}

            <section className="change-list">
              {changes.map((change) => (
                <article className="panel" key={change.id}>
                  <header>
                    <span>{change.code} · {typeLabels[change.type]}</span>
                    <b>{changeStatusLabels[change.status]}</b>
                  </header>
                  <h2>{change.title}</h2>
                  <p>{change.description}</p>
                  <footer>
                    <label>
                      Decisão
                      <select
                        value={change.status}
                        onChange={(e) =>
                          dispatch({
                            type: 'change/status',
                            projectId: project.id,
                            changeId: change.id,
                            status: e.target.value as ScopeChangeStatus,
                          })
                        }
                      >
                        {Object.entries(changeStatusLabels).map(([id, label]) => (
                          <option value={id} key={id}>{label}</option>
                        ))}
                      </select>
                    </label>
                  </footer>
                </article>
              ))}
              {!changes.length && <div className="empty-inline">Nenhuma solicitação de mudança registrada.</div>}
            </section>
          </div>
        )}

        {/* Conteúdo da Aba 5: Visão Compartilhada */}
        {activeTab === 'portal' && (
          <div className="tab-pane">
            <section className="panel portal-preview">
              <div className="panel__head">
                <div>
                  <h2>Visão compartilhada com o município</h2>
                  <p>Status transparente para {project.profile.clientName}</p>
                </div>
              </div>
              <div className="facts" style={{ marginBottom: '20px' }}>
                <div>
                  <span>Previsão de Lançamento do Piloto</span>
                  <strong>{new Date(`${project.profile.desiredGoLive}T12:00:00`).toLocaleDateString('pt-BR')}</strong>
                </div>
                <div>
                  <span>Validações em Campo Aprovadas</span>
                  <strong>
                    {project.tests.filter((t) => t.type === 'client' && t.executions.at(-1)?.result === 'approved').length} de{' '}
                    {project.tests.filter((t) => t.type === 'client').length}
                  </strong>
                </div>
                <div>
                  <span>Ações sob responsabilidade do município</span>
                  <strong>{project.pendingItems.filter((p) => p.origin === 'client' && p.status === 'open').length}</strong>
                </div>
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  )
}
