import { ArrowRight, CheckCircle2, GitBranch, ShieldCheck, UsersRound } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { Brand } from '../components/Brand'
import { usePortfolio } from '../state/PortfolioContext'

const evidence = [
  ['9', 'macrofases acompanhadas'],
  ['9', 'cenários testados'],
  ['8', 'implantações simuladas'],
  ['3', 'projetos interativos'],
]

const highlights = [
  { icon: GitBranch, title: 'Rastreabilidade', text: 'Necessidade, requisito, entrega, teste e homologação conectados.' },
  { icon: ShieldCheck, title: 'Exceções controladas', text: 'Criticidade, responsabilidade e prazo preservados ao longo da jornada.' },
  { icon: CheckCircle2, title: 'Valor além do go-live', text: 'A implantação só alcança seu objetivo após o primeiro ciclo validado.' },
  { icon: UsersRound, title: 'Visões conectadas', text: 'Gestão, Implantação e Cliente observam o mesmo projeto no contexto adequado.' },
]

export function LandingPage() {
  const { dispatch } = usePortfolio()
  const navigate = useNavigate()
  const startGuide = () => { dispatch({ type: 'guide/set', visible: true }); navigate('/app/dashboard') }
  return (
    <div className="landing">
      <header className="landing__header container">
        <Brand />
        <nav aria-label="Navegação da apresentação">
          <a href="#proposta">Proposta</a>
          <a href="#diferenciais">Diferenciais</a>
          <Link to="/app/dashboard">Protótipo</Link>
        </nav>
      </header>

      <main>
        <section className="hero container">
          <div className="hero__content">
            <p className="eyebrow">Projeto autoral de Implantação, Projetos e Customer Success</p>
            <h1>Da necessidade do cliente ao primeiro valor em produção.</h1>
            <p className="hero__lead">Um protótipo funcional para acompanhar projetos de software entre handoff, discovery, requisitos, desenvolvimento, homologação, go-live e validação do primeiro ciclo operacional.</p>
            <div className="hero__actions">
              <Link className="button button--primary" to="/app/dashboard">Explorar o protótipo <ArrowRight size={17} /></Link>
              <button className="button button--secondary" type="button" onClick={startGuide}>Iniciar demonstração guiada</button>
            </div>
          </div>
          <div className="hero__preview" aria-label="Prévia conceitual do dashboard">
            <div className="preview__top"><span>Visão geral da carteira</span><i /></div>
            <div className="preview__metrics"><b>7</b><b>2</b><b>3</b></div>
            <div className="preview__rows"><span /><span /><span /><span /></div>
          </div>
        </section>

        <section className="evidence" aria-label="Evidências do projeto">
          <div className="container evidence__grid">
            {evidence.map(([value, label]) => <div key={label}><strong>{value}</strong><span>{label}</span></div>)}
          </div>
        </section>

        <section id="proposta" className="proposal container section">
          <div><p className="eyebrow">O problema</p><h2>O go-live pode acontecer antes de o valor ser comprovado.</h2></div>
          <p>Informações fragmentadas dificultam a visualização de prazos, requisitos, bloqueios, responsabilidades e resultados. O Implanta conecta esses elementos do handoff ao primeiro ciclo operacional.</p>
        </section>

        <section id="diferenciais" className="section container">
          <p className="eyebrow">Como o projeto responde</p>
          <div className="highlight-grid">
            {highlights.map(({ icon: Icon, title, text }) => <article key={title} className="highlight-card"><Icon size={22} /><h3>{title}</h3><p>{text}</p></article>)}
          </div>
        </section>
      </main>
    </div>
  )
}
