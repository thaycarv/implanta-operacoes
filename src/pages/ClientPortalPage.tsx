import {
  Calendar,
  CheckCircle2,
  CircleAlert,
  ExternalLink,
  Store,
} from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import { StatusBadge } from '../components/StatusBadge'
import { phaseLabel } from '../domain/catalog'
import { deriveCondition } from '../domain/condition'
import { evaluateFirstValueGate } from '../domain/gates'
import { usePortfolio } from '../state/PortfolioContext'

export function ClientPortalPage() {
  const { state } = usePortfolio()
  const [searchParams, setSearchParams] = useSearchParams()

  const requestedProjectId = searchParams.get('project')

  const project =
    state.projects.find(item => item.id === requestedProjectId) ??
    state.projects[0]

  if (!project) {
    return (
      <div className="page">
        <section className="panel no-results" role="status">
          <h1>Nenhuma implantação disponível</h1>
          <p>Crie uma implantação ou restaure os dados de demonstração para acessar o Portal do Cliente.</p>
        </section>
      </div>
    )
  }

  const clientItems = project.pendingItems.filter(
    item =>
      item.status === 'open' &&
      (item.origin === 'client' || item.origin === 'shared'),
  )

  const next = project.milestones
    .filter(milestone => milestone.status !== 'completed')
    .sort((a, b) => a.forecastDate.localeCompare(b.forecastDate))[0]

  const value = evaluateFirstValueGate(project)

  const selectProject = (projectId: string) => {
    setSearchParams({ project: projectId })
  }

  return (
    <div className="client-page">
      <header className="client-top">
        <div>
          <span className="client-logo">
            <Store />
            IMPLANTA
          </span>

          <small>Visão compartilhada com o cliente</small>
        </div>

        <label>
          Visualizar como

          <select
            value={project.id}
            onChange={event => selectProject(event.target.value)}
          >
            {state.projects.map(item => (
              <option value={item.id} key={item.id}>
                {item.profile.clientName}
              </option>
            ))}
          </select>
        </label>
      </header>

      <main>
        <section className="client-welcome">
          <div>
            <p className="eyebrow">Sua implantação</p>

            <h1>Olá, {project.profile.clientName}</h1>

            <p>
              Acompanhe o que já avançou, o próximo marco e onde precisamos da
              sua participação.
            </p>
          </div>

          <StatusBadge condition={deriveCondition(project)} />
        </section>

        <section className="client-cards">
          <article>
            <span>
              <ExternalLink />
              Fase atual
            </span>

            <strong>{phaseLabel(project.mainPhase, true)}</strong>

            <small>
              Responsável: {project.profile.implementationOwner}
            </small>
          </article>

          <article>
            <span>
              <Calendar />
              Próximo marco
            </span>

            <strong>{next?.name ?? 'Jornada concluída'}</strong>

            <small>
              {next
                ? new Date(
                    `${next.forecastDate}T12:00:00`,
                  ).toLocaleDateString('pt-BR')
                : 'Ciclo operacional validado'}
            </small>
          </article>

          <article>
            <span>
              <CircleAlert />
              Ações do cliente
            </span>

            <strong>{clientItems.length}</strong>

            <small>
              {clientItems.length
                ? 'item(ns) aguardando sua participação'
                : 'Nenhuma ação pendente'}
            </small>
          </article>
        </section>

        <div className="client-grid">
          <section className="panel">
            <div className="panel__head">
              <div>
                <h2>O que precisamos de você</h2>
                <p>Responsabilidades claras e contextualizadas</p>
              </div>
            </div>

            {clientItems.length ? (
              clientItems.map(item => (
                <article className="client-action" key={item.id}>
                  <CircleAlert />

                  <div>
                    <strong>{item.title}</strong>

                    <p>{item.description}</p>

                    <small>
                      Responsável: {item.owner} · até{' '}
                      {new Date(
                        `${item.dueDate}T12:00:00`,
                      ).toLocaleDateString('pt-BR')}
                    </small>
                  </div>
                </article>
              ))
            ) : (
              <div className="client-clear">
                <CheckCircle2 />

                <strong>Tudo em dia por aqui</strong>

                <span>Nenhuma dependência do cliente está aberta.</span>
              </div>
            )}
          </section>

          <section className="panel">
            <div className="panel__head">
              <div>
                <h2>Ciclo operacional</h2>
                <p>Confirmação do funcionamento da operação em produção</p>
              </div>
            </div>

            <div
              className={`value-message ${value.ready ? 'is-ready' : ''}`}
            >
              <CheckCircle2 />

              <strong>
                {value.ready
                  ? 'Primeiro ciclo validado'
                  : 'Validação em andamento'}
              </strong>

              <p>
                {value.ready
                  ? 'Venda, estoque, caixa e dados foram conciliados.'
                  : value.reasons.slice(0, 3).join(' · ')}
              </p>
            </div>
          </section>
        </div>

        <footer className="client-note">
          Esta visão simplifica a comunicação sem esconder riscos, decisões ou
          responsabilidades.
        </footer>
      </main>
    </div>
  )
}
