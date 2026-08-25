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
    facts.push('Ciclo operacional concluído: venda processada e caixa fechado')
  }

  // 2. Análise por cenário e condição
  if (project.id === 'proj-01' || (project.mainPhase === 'first_value' && !project.firstValue.cashClosed)) {
    // Cenário Rede Aurora: Go-live feito, mas caixa divergente
    rootCause = 'Go-live concluído, porém primeiro ciclo operacional bloqueado por divergência crítica no fechamento de caixa.'
    attentionPoints.push('Divergência financeira no fechamento de caixa impede a validação do ciclo.')
    attentionPoints.push('Transição para Customer Success retida até a validação das rotinas financeiras.')
    recommendedAction = 'Realizar auditoria conjunta com a equipe financeira do cliente nas rotinas de sangria e conciliação bancária.'
    executiveSummary = `A implantação da ${project.profile.clientName} realizou o go-live, mas a operação permanece em estado de bloqueio devido a divergências no fechamento de caixa. O foco prioritário deve ser o saneamento contábil para posterior liberação da transição para CS.`
  } else if (project.id === 'proj-02' || failedUat.length > 0) {
    // Cenário Lojas Horizonte: Falha fiscal no UAT
    rootCause = 'Falha crítica em regras fiscais identificada durante a homologação com o cliente (UAT).'
    attentionPoints.push('Emissão de documentos fiscais e regras tributárias reprovadas na validação do cliente.')
    attentionPoints.push('Gate de Go-live bloqueado até reteste e aprovação formal do DRN fiscal.')
    recommendedAction = 'Ajustar as tabelas de tributação no ambiente de homologação e submeter a novo ciclo de UAT com o responsável fiscal do cliente.'
    executiveSummary = `A implantação da ${project.profile.clientName} está na fase de homologação (UAT) com pendência impeditiva no cálculo de impostos. O avanço para a fase de go-live está retido até a correção e homologação das notas fiscais.`
  } else if (project.id === 'proj-03' || (project.firstValue.cashClosed && openPending.length > 0)) {
    // Cenário Rede Prisma: Ciclo validado com pendência não crítica
    rootCause = 'Primeiro ciclo operacional validado com sucesso, restando pendências secundárias de parametrização.'
    attentionPoints.push('Operação de loja estável com vendas, estoque e conciliação validados.')
    attentionPoints.push('Pendências residuais de baixa severidade a serem acompanhadas pela equipe de suporte.')
    recommendedAction = 'Formalizar a ata de transição para Customer Success com repasse das pendências não impeditivas para o backlog de sustentação.'
    executiveSummary = `A implantação da ${project.profile.clientName} concluiu com êxito o primeiro ciclo operacional. O projeto está apto para transição assistida para a equipe de Customer Success.`
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
