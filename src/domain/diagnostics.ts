import { ImplementationProject, ValidationTest } from '../types'
import { deriveCondition } from './condition'
import { phaseLabel } from './catalog'

export interface ProjectDiagnostic {
  title: string
  condition: string
  rootCause: string
  facts: string[]
  attentionPoints: string[]
  recommendedAction: string
  executiveSummary: string
}

export function generateProjectDiagnostic(project: ImplementationProject): ProjectDiagnostic {
  const condition = deriveCondition(project)
  const openPending = project.pendingItems.filter((i) => i.status === 'open')
  const criticalPending = openPending.filter((i) => i.severity === 'critical')
  
  const failedTests = project.tests.filter((t: ValidationTest) => {
    const last = t.executions.at(-1)
    return last?.result === 'failed'
  })
  const failedUat = failedTests.filter((t) => t.type === 'client')

  const facts: string[] = []
  const attentionPoints: string[] = []
  let rootCause = ''
  let recommendedAction = ''
  let executiveSummary = ''

  // 1. Coleta de fatos confirmados
  facts.push(`Fase atual: ${phaseLabel(project.mainPhase, true)}`)
  facts.push(`Pendências em aberto: ${openPending.length} item(ns)`)

  if (failedTests.length > 0) {
    facts.push(`Testes reprovados registrados: ${failedTests.length} caso(s)`)
  }

  if (project.firstValue.saleProcessed && project.firstValue.cashClosed) {
    facts.push('Ciclo de uso concluído: operação inicial e rotinas essenciais validadas')
  }

  // 2. Análise por cenário e condição
  if (project.id === 'project-1' || (project.mainPhase === 'first_value' && !project.firstValue.dataReconciled)) {
    // Cenário Polo Universitário Aurora: Go-live feito, mas conciliação de matrículas divergente
    rootCause = 'Go-live concluído, porém primeiro ciclo de uso bloqueado por divergência crítica na conciliação de matrículas e dados acadêmicos.'
    attentionPoints.push('Divergência na conciliação com o portal acadêmico impede a validação do ciclo de adoção.')
    attentionPoints.push('Transição para sustentação contínua retida até a validação das rotinas operacionais.')
    recommendedAction = 'Realizar alinhamento técnico conjunto com a equipe acadêmica para saneamento dos dados de matrículas.'
    executiveSummary = `A implantação do ${project.profile.clientName} realizou o go-live, mas a operação permanece em estado de atenção e bloqueio devido a divergências na conciliação acadêmica. O foco prioritário deve ser o saneamento da base para transição segura para sustentação.`
  } else if (project.id === 'project-3' || failedUat.length > 0) {
    // Cenário Colégio Horizonte: Inconsistência na homologação
    rootCause = 'Inconsistência crítica na sincronização do diário de classe identificada durante a homologação com o cliente (UAT).'
    attentionPoints.push('Sincronização de turmas e diário de classe reprovada no teste de estresse da homologação.')
    attentionPoints.push('Gate de Go-live bloqueado até reteste e aprovação formal do requisito de integração.')
    recommendedAction = 'Ajustar os parâmetros de sincronização no ambiente de homologação e submeter a novo ciclo de validação com os coordenadores.'
    executiveSummary = `A implantação do ${project.profile.clientName} está na fase de homologação (UAT) com pendência impeditiva no sincronismo de dados. O avanço para a fase de go-live está retido até a correção e homologação das turmas.`
  } else if (project.id === 'project-2' || (project.firstValue.dataReconciled && openPending.length > 0)) {
    // Cenário Rede Saber Digital: Ciclo validado com pendência não crítica
    rootCause = 'Primeiro ciclo letivo validado com sucesso, restando entrega complementar de painel pedagógico.'
    attentionPoints.push('Operação acadêmica estável com matrículas, turmas e registros validados.')
    attentionPoints.push('Painel pedagógico residual a ser entregue no cronograma de melhoria contínua.')
    recommendedAction = 'Formalizar a ata de transição para sustentação com repasse da melhoria futura para o backlog planejado.'
    executiveSummary = `A implantação da ${project.profile.clientName} concluiu com êxito o primeiro ciclo operacional. O projeto está apto para transição assistida para sustentação contínua.`
  } else if (condition === 'blocked') {
    rootCause = `Projeto com ${criticalPending.length} pendência(s) crítica(s) bloqueando o avanço para a próxima fase.`
    attentionPoints.push('Existe dependência externa ou técnica sem resolução dentro do prazo previsto.')
    recommendedAction = 'Convocar alinhamento emergencial com o patrocinador do projeto para repactuar prazos e destravar dependências.'
    executiveSummary = `A implantação da ${project.profile.clientName} encontra-se bloqueada. É necessário intervenção da coordenação para alinhamento de pendências com o cliente.`
  } else if (condition === 'attention' || condition === 'delayed') {
    rootCause = 'Cronograma com marcos atrasados ou acúmulo de pendências em acompanhamento.'
    attentionPoints.push('Prazos de entrega próximos ao limite acordado.')
    recommendedAction = 'Revisar o plano de trabalho e redistribuir atividades para evitar atrasos no go-live.'
    executiveSummary = `A implantação da ${project.profile.clientName} requer atenção preventiva na gestão de pendências para manter a previsão de go-live.`
  } else {
    rootCause = 'Projeto operando dentro dos parâmetros de normalidade e cronograma planejado.'
    attentionPoints.push('Nenhum bloqueio crítico identificado no momento.')
    recommendedAction = 'Manter o acompanhamento periódico dos marcos e execução dos testes programados.'
    executiveSummary = `A implantação da ${project.profile.clientName} segue em conformidade com o cronograma de implantação.`
  }

  return {
    title: project.profile.clientName,
    condition,
    rootCause,
    facts,
    attentionPoints,
    recommendedAction,
    executiveSummary,
  }
}

export function formatExecutiveStatusReport(project: ImplementationProject, diagnostic: ProjectDiagnostic): string {
  const openPending = project.pendingItems.filter((i) => i.status === 'open')
  const dateStr = new Date().toLocaleDateString('pt-BR')

  return `*Status Report de Implantação: ${project.profile.clientName}*
Data: ${dateStr}
Responsável da Implantação: ${project.profile.implementationOwner}
Fase Atual: ${phaseLabel(project.mainPhase, true)}
Condição Operacional: ${diagnostic.condition.toUpperCase()}

*1. Resumo Executivo:*
${diagnostic.executiveSummary}

*2. Diagnóstico e Causa Raiz:*
${diagnostic.rootCause}

*3. Fatos e Indicadores:*
${diagnostic.facts.map((f) => `- ${f}`).join('\n')}

*4. Pontos de Atenção:*
${diagnostic.attentionPoints.map((a) => `- ${a}`).join('\n')}

*5. Próxima Ação Recomendada:*
${diagnostic.recommendedAction}

*6. Pendências em Aberto (${openPending.length}):*
${
  openPending.length > 0
    ? openPending.map((p) => `- [${p.severity.toUpperCase()}] ${p.title} (Origem: ${p.origin})`).join('\n')
    : '- Nenhuma pendência em aberto'
}
`
}
