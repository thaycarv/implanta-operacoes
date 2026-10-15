import { CheckCircle2, FileText, Link2, PackageCheck } from 'lucide-react'
import { useMemo, useState } from 'react'
import { ProjectPicker } from '../components/ProjectPicker'
import { phaseLabel } from '../domain/catalog'
import { requirementCoverage } from '../domain/requirements'
import { usePortfolio } from '../state/PortfolioContext'
import type { RequirementStatus } from '../types'

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

const relevanceLabels = {
  go_live_blocker: 'Bloqueia lançamento do piloto',
  first_value_required: 'Necessário ao ciclo de impacto',
  non_blocking: 'Não bloqueante',
  future: 'Futuro',
}

export function RequirementsPage() {
  const { state, dispatch } = usePortfolio()
  const [projectId, setProjectId] = useState(state.projects[0]?.id ?? '')
  const [selected, setSelected] = useState('')
  const project = state.projects.find(p => p.id === projectId) ?? state.projects[0]
  const coverage = useMemo(() => requirementCoverage(project?.requirements ?? []), [project])
  const requirement = project?.requirements.find(r => r.id === selected) ?? project?.requirements[0]

  if (!project) return null

  return (
    <div className="page">
      <header className="page__header">
        <div>
          <p className="eyebrow">Rastreabilidade ponta a ponta</p>
          <h1>Casos de uso e critérios</h1>
          <p>Da necessidade pública à validação em campo com servidores.</p>
        </div>
        <ProjectPicker
          projects={state.projects}
          value={project.id}
          onChange={id => {
            setProjectId(id)
            setSelected('')
          }}
        />
      </header>

      <section className="metrics metrics--compact">
        <article className="metric">
          <FileText />
          <span>Casos de uso</span>
          <strong>{coverage.total}</strong>
          <small>Matriz versão {project.requirements[0]?.version ?? '0.1'}</small>
        </article>
        <article className="metric">
          <PackageCheck />
          <span>Entregues</span>
          <strong>{coverage.delivered}</strong>
          <small>Concluídos na facilitação</small>
        </article>
        <article className="metric">
          <CheckCircle2 />
          <span>Validados</span>
          <strong>{coverage.clientApproved}</strong>
          <small>Validados em campo</small>
        </article>
        <article className="metric metric--danger">
          <Link2 />
          <span>Bloqueadores abertos</span>
          <strong>{coverage.goLiveBlockersOpen}</strong>
          <small>Críticos para o piloto</small>
        </article>
      </section>

      <div className="split-view">
        <section className="panel requirement-index">
          <div className="panel__head">
            <div>
              <h2>Matriz de casos de uso</h2>
              <p>
                {project.profile.clientName} · {phaseLabel(project.mainPhase, true)}
              </p>
            </div>
          </div>
          {project.requirements.map(req => (
            <button
              className={requirement?.id === req.id ? 'is-selected' : ''}
              onClick={() => setSelected(req.id)}
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

        {requirement && (
          <section className="panel requirement-detail">
            <div className="trace-title">
              <span>
                {requirement.code} · v{requirement.version}
              </span>
              <h2>{requirement.title}</h2>
              <div>
                <b>{relevanceLabels[requirement.relevance]}</b>
                <b>{requirement.conditional ? 'Condicional' : 'Núcleo do programa'}</b>
              </div>
            </div>
            <div className="trace-chain">
              <article>
                <small>1 · Necessidade Pública</small>
                <p>{requirement.businessNeed}</p>
              </article>
              <article>
                <small>2 · Regra e Diretriz</small>
                <p>{requirement.businessRule}</p>
              </article>
              <article>
                <small>3 · Critério de Aceite</small>
                <p>{requirement.acceptanceCriteria}</p>
              </article>
              <article>
                <small>4 · Evidência</small>
                <p>
                  {requirement.testIds.length} validação(ões) vinculada(s) · validador: {requirement.validator}
                </p>
              </article>
            </div>
            <label className="status-control">
              Atualizar estado do caso de uso
              <select
                value={requirement.status}
                onChange={e =>
                  dispatch({
                    type: 'requirement/status',
                    projectId: project.id,
                    requirementId: requirement.id,
                    status: e.target.value as RequirementStatus,
                  })
                }
              >
                {Object.entries(statusLabels).map(([id, label]) => (
                  <option value={id} key={id}>
                    {label}
                  </option>
                ))}
              </select>
              <small>A alteração é simulada e pode ser restaurada a qualquer momento.</small>
            </label>
          </section>
        )}
      </div>
    </div>
  )
}
