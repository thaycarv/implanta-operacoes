import { ArrowLeft, Check, ChevronRight } from 'lucide-react'
import { FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { usePortfolio } from '../state/PortfolioContext'
import type { ProjectProfile } from '../types'

const modules: Array<[ProjectProfile['modules'][number], string]> = [
  ['sales', 'Capacitação e Formação de Servidores'],
  ['inventory', 'Mapeamento e Fluxos de Atendimento'],
  ['cash', 'Governança Ética e Diretrizes de IA'],
  ['fiscal', 'Conformidade Regulatória e LGPD'],
  ['purchasing', 'Articulação Institucional e Recursos'],
  ['reports', 'Indicadores e Avaliação de Impacto'],
]

const integrations: Array<[ProjectProfile['integrations'][number], string]> = [
  ['ecommerce', 'Portal de Atendimento ao Cidadão'],
  ['payments', 'Sistemas Municipais Legados'],
  ['accounting', 'Bases de Dados Governamentais'],
  ['other', 'Outras Plataformas e APIs'],
]

export function NewImplementationPage() {
  const { dispatch } = usePortfolio()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [profile, setProfile] = useState<ProjectProfile>({
    clientName: '',
    implementationOwner: 'Ana Ribeiro',
    clientSponsor: '',
    clientKeyUser: '',
    storeCount: 1,
    modules: ['sales', 'inventory', 'cash'],
    dataStrategy: 'partial_migration',
    integrations: [],
    hasCustomization: false,
    desiredGoLive: '2026-09-30',
    customerGoal: '',
  })

  const update = <K extends keyof ProjectProfile>(key: K, value: ProjectProfile[K]) =>
    setProfile(p => ({ ...p, [key]: value }))

  const toggle = <K extends 'modules' | 'integrations'>(key: K, value: ProjectProfile[K][number]) =>
    update(
      key,
      (profile[key].includes(value as never)
        ? profile[key].filter(x => x !== value)
        : [...profile[key], value]) as ProjectProfile[K],
    )

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (step < 3) {
      setStep(step + 1)
      return
    }
    dispatch({ type: 'project/add', profile })
    navigate('/app/implantacoes')
  }

  return (
    <div className="page form-page">
      <Link className="back-link" to="/app/implantacoes">
        <ArrowLeft size={16} /> Cancelar e voltar
      </Link>
      <header>
        <p className="eyebrow">Novo cenário</p>
        <h1>Novo projeto de inovação</h1>
        <p>O cadastro cria um projeto explorável para acompanhamento da carteira.</p>
      </header>

      <div className="stepper">
        {['Contexto', 'Escopo', 'Impacto e prazo'].map((label, i) => (
          <div className={step >= i + 1 ? 'is-active' : ''} key={label}>
            <i>{step > i + 1 ? <Check size={13} /> : i + 1}</i>
            <span>{label}</span>
          </div>
        ))}
      </div>

      <form className="form-card" onSubmit={submit}>
        {step === 1 && (
          <div className="form-grid">
            <label>
              Município / Instituição
              <input
                required
                value={profile.clientName}
                onChange={e => update('clientName', e.target.value)}
                placeholder="Ex.: Município de Porto Esperança ou Secretaria de Saúde"
              />
            </label>
            <label>
              Líder da facilitação
              <input
                required
                value={profile.implementationOwner}
                onChange={e => update('implementationOwner', e.target.value)}
              />
            </label>
            <label>
              Patrocinador / Secretário(a)
              <input
                required
                value={profile.clientSponsor}
                onChange={e => update('clientSponsor', e.target.value)}
                placeholder="Nome e cargo institucional"
              />
            </label>
            <label>
              Ponto focal local
              <input
                required
                value={profile.clientKeyUser}
                onChange={e => update('clientKeyUser', e.target.value)}
                placeholder="Responsável pela articulação interna"
              />
            </label>
            <label>
              Número de secretarias / polos envolvidos
              <input
                required
                min="1"
                type="number"
                value={profile.storeCount}
                onChange={e => update('storeCount', Number(e.target.value))}
              />
            </label>
          </div>
        )}

        {step === 2 && (
          <>
            <fieldset>
              <legend>Dimensões de trabalho no escopo</legend>
              <div className="check-grid">
                {modules.map(([id, label]) => (
                  <label key={id}>
                    <input
                      type="checkbox"
                      checked={profile.modules.includes(id)}
                      onChange={() => toggle('modules', id)}
                    />
                    <span>{label}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend>Integrações e canais previstos</legend>
              <div className="check-grid">
                {integrations.map(([id, label]) => (
                  <label key={id}>
                    <input
                      type="checkbox"
                      checked={profile.integrations.includes(id)}
                      onChange={() => toggle('integrations', id)}
                    />
                    <span>{label}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <label className="inline-check">
              <input
                type="checkbox"
                checked={profile.hasCustomization}
                onChange={e => update('hasCustomization', e.target.checked)}
              />
              Há caso de uso customizado previsto
            </label>
          </>
        )}

        {step === 3 && (
          <div className="form-grid">
            <label>
              Estratégia de dados
              <select
                value={profile.dataStrategy}
                onChange={e => update('dataStrategy', e.target.value as ProjectProfile['dataStrategy'])}
              >
                <option value="new">Nova esteira experimental</option>
                <option value="partial_migration">Aproveitamento parcial de bases</option>
                <option value="full_migration">Integração ampla de cadastros</option>
              </select>
            </label>
            <label>
              Lançamento do piloto previsto
              <input
                required
                type="date"
                value={profile.desiredGoLive}
                onChange={e => update('desiredGoLive', e.target.value)}
              />
            </label>
            <label className="span-2">
              Objetivo público do projeto
              <textarea
                required
                value={profile.customerGoal}
                onChange={e => update('customerGoal', e.target.value)}
                placeholder="Que impacto no serviço público e nas decisões locais este piloto deve gerar?"
              />
            </label>
          </div>
        )}

        <footer>
          {step > 1 ? (
            <button type="button" className="button button--secondary" onClick={() => setStep(step - 1)}>
              Voltar
            </button>
          ) : (
            <span />
          )}
          <button className="button button--primary" type="submit">
            {step === 3 ? 'Criar projeto' : 'Continuar'} <ChevronRight size={16} />
          </button>
        </footer>
      </form>
    </div>
  )
}
