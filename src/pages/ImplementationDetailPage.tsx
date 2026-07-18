import { ArrowLeft, Calendar, Check, RotateCcw, Store, UserRound } from 'lucide-react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { StatusBadge } from '../components/StatusBadge'
import { dependencyLabels, phaseLabel, phases } from '../domain/catalog'
import { deriveCondition, isFirstValueValidated } from '../domain/condition'
import { usePortfolio } from '../state/PortfolioContext'
import { assessCapacity } from '../domain/capacity'
import { evaluateCSTransition } from '../domain/transition'

export function ImplementationDetailPage() {
  const { projectId }=useParams(); const {state,dispatch}=usePortfolio(); const project=state.projects.find(p=>p.id===projectId)
  if(!project) return <Navigate to="/app/implantacoes" replace/>
  const condition=deriveCondition(project); const open=project.pendingItems.filter(p=>p.status==='open'); const doneReq=project.requirements.filter(r=>['qa_approved','client_approved'].includes(r.status)).length
  const capacity=assessCapacity(project); const transition=evaluateCSTransition(project)
  const reset=()=>window.confirm(`Restaurar somente o cenário de ${project.profile.clientName}?`)&&dispatch({type:'project/reset',projectId:project.id})
  const valueItems=[['Venda processada',project.firstValue.saleProcessed],['Estoque atualizado',project.firstValue.inventoryUpdated],['Caixa fechado',project.firstValue.cashClosed],['Dados reconciliados',project.firstValue.dataReconciled]] as const
  return <div className="page"><Link className="back-link" to="/app/implantacoes"><ArrowLeft size={16}/> Voltar à carteira</Link><header className="detail-hero"><div><p className="eyebrow">Implantação · {project.source==='visitor'?'criada pelo visitante':'cenário demonstrativo'}</p><h1>{project.profile.clientName}</h1><p>{project.profile.customerGoal}</p></div><div className="detail-hero__actions"><StatusBadge condition={condition}/><button className="button button--secondary" onClick={reset}><RotateCcw size={16}/> Restaurar este cenário</button></div></header>
    <section className="profile-strip"><div><UserRound/><span><small>Responsável</small><strong>{project.profile.implementationOwner}</strong></span></div><div><Store/><span><small>Operação</small><strong>{project.profile.storeCount} loja(s)</strong></span></div><div><Calendar/><span><small>Go-live desejado</small><strong>{new Date(`${project.profile.desiredGoLive}T12:00:00`).toLocaleDateString('pt-BR')}</strong></span></div></section>
    <section className="panel phase-timeline"><div className="panel__head"><div><h2>Jornada de implantação</h2><p>Fase atual: {phaseLabel(project.mainPhase)}</p></div></div><div className="timeline">{phases.map((p,index)=>{const current=phases.findIndex(x=>x.id===project.mainPhase);return <div className={index<current?'is-done':index===current?'is-current':''} key={p.id}><i>{index<current?<Check size={13}/>:index+1}</i><span>{p.shortLabel}</span></div>})}</div></section>
    <div className="detail-grid"><section className="panel"><div className="panel__head"><div><h2>Saúde da entrega</h2><p>Cobertura sem percentual artificial</p></div></div><div className="facts"><div><span>Requisitos validados</span><strong>{doneReq} de {project.requirements.length}</strong></div><div><span>Pacotes de entrega</span><strong>{project.packages.length}</strong></div><div><span>Pendências abertas</span><strong>{open.length}</strong></div><div><span>Testes registrados</span><strong>{project.tests.length}</strong></div></div></section>
      <section className="panel"><div className="panel__head"><div><h2>Primeiro valor</h2><p>{isFirstValueValidated(project)?'Ciclo operacional validado':'Critérios ainda em validação'}</p></div></div><div className="value-list">{valueItems.map(([label,ok])=><div className={ok?'is-ok':''} key={label}><i>{ok&&<Check size={14}/>}</i><span>{label}</span></div>)}</div></section>
      <section className="panel"><div className="panel__head"><div><h2>Esforço de coordenação</h2><p>Classe operacional baseada no perfil</p></div></div><strong className={`capacity capacity--${capacity.classification}`}>{capacity.label}</strong><p className="operational-note">{capacity.reasons.join(' · ')}</p></section>
      <section className="panel"><div className="panel__head"><div><h2>Transição para CS</h2><p>Continuidade após a implantação</p></div></div><strong className={`transition transition--${transition.status}`}>{transition.label}</strong><p className="operational-note">{transition.reasons.join(' · ')}</p></section>
      <section className="panel panel--full"><div className="panel__head"><div><h2>Pendências e dependências</h2><p>O sistema sinaliza; a decisão continua humana.</p></div></div>{open.length?<div className="issues">{open.map(item=><article key={item.id}><span className={`severity severity--${item.severity}`}>{item.severity==='critical'?'Crítica':'Não crítica'}</span><div><strong>{item.title}</strong><p>{item.description}</p><small>{dependencyLabels[item.origin]} · {item.owner} · prazo {new Date(`${item.dueDate}T12:00:00`).toLocaleDateString('pt-BR')}</small></div></article>)}</div>:<p className="quiet">Nenhuma pendência aberta neste cenário.</p>}</section>
    </div>
  </div>
}
