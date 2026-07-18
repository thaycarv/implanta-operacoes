import { Check, ChevronRight, Map, RotateCcw, X } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { usePortfolio } from '../state/PortfolioContext'

const tours = [
  {
    id: 'aurora', title: 'Aurora', tag: 'Valor bloqueado após go-live', projectId: 'project-1',
    context: 'O sistema entrou em produção, mas uma divergência crítica no caixa impede validar o primeiro valor.',
    steps: [
      ['aurora-detail', 'Entenda a condição do projeto', '/app/implantacoes/project-1'],
      ['aurora-tests', 'Verifique o gate e as evidências', '/app/testes?project=project-1'],
      ['aurora-client', 'Compare com a visão do cliente', '/app/cliente?project=project-1'],
    ],
  },
  {
    id: 'horizonte', title: 'Horizonte', tag: 'Falha crítica na UAT', projectId: 'project-3',
    context: 'A homologação do cliente encontrou uma falha fiscal crítica próxima ao go-live.',
    steps: [
      ['horizonte-drn', 'Rastreie o requisito fiscal', '/app/requisitos?project=project-3'],
      ['horizonte-uat', 'Explore QA e UAT', '/app/testes?project=project-3'],
      ['horizonte-detail', 'Veja o impacto na jornada', '/app/implantacoes/project-3'],
    ],
  },
  {
    id: 'prisma', title: 'Prisma', tag: 'Valor alcançado com pendência', projectId: 'project-2',
    context: 'O primeiro valor foi validado, embora uma entrega não crítica permaneça planejada.',
    steps: [
      ['prisma-detail', 'Confirme o primeiro valor', '/app/implantacoes/project-2'],
      ['prisma-change', 'Analise a melhoria futura', '/app/mudancas?project=project-2'],
      ['prisma-client', 'Observe a comunicação ao cliente', '/app/cliente?project=project-2'],
    ],
  },
] as const

export function GuidedTour() {
  const { state, dispatch } = usePortfolio()
  const [tourId, setTourId] = useState<string | null>(null)
  if (!state.guideVisible) return null
  const tour = tours.find(item => item.id === tourId)
  const progress = state.guideProgress ?? []
  const close = () => dispatch({ type: 'guide/set', visible: false })
  return <aside className="guide" aria-label="Demonstração guiada">
    <header><span><Map size={18}/> Demonstração guiada</span><button aria-label="Fechar guia" onClick={close}><X size={18}/></button></header>
    {!tour ? <div className="guide__body"><p className="guide__intro">Escolha um cenário ou continue explorando livremente. Você pode sair e voltar quando quiser.</p><div className="guide__cases">{tours.map(item => <button onClick={()=>setTourId(item.id)} key={item.id}><span><b>{item.title}</b><small>{item.tag}</small></span><ChevronRight size={17}/></button>)}</div><p className="guide__hint">O guia não altera dados e não bloqueia nenhuma tela.</p></div>
    : <div className="guide__body"><button className="guide__back" onClick={()=>setTourId(null)}>← Escolher outro cenário</button><span className="guide__tag">Cenário {tour.title}</span><h2>{tour.tag}</h2><p className="guide__context">{tour.context}</p><div className="guide__steps">{tour.steps.map(([id,label,to],index)=>{const done=progress.includes(id);return <div className={done?'is-done':''} key={id}><button aria-label={`Marcar ${label}`} onClick={()=>dispatch({type:'guide/toggle-step',stepId:id})}>{done?<Check size={13}/>:index+1}</button><Link to={to}><span>{label}</span><small>Abrir visão <ChevronRight size={12}/></small></Link></div>})}</div><div className="guide__footer"><span>{tour.steps.filter(([id])=>progress.includes(id)).length} de {tour.steps.length} observações marcadas</span><button onClick={()=>dispatch({type:'guide/reset'})}><RotateCcw size={14}/> Reiniciar roteiro</button></div></div>}
  </aside>
}
