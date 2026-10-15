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
  const failedFieldValidation = failedTests.filter((t) => t.type === 'client')

  const facts: string[] = []
  const attentionPoints: string[] = []
  let rootCause = ''
  let recommendedAction = ''
  let executiveSummary = ''

  // 1. Coleta de fatos confirmados
  facts.push(`Fase atual: ${phaseLabel(project.mainPhase, true)}`)
  facts.push(`Pendências em aberto: ${openPending.length} item(ns)`)

  if (failedTests.length > 0) {
    facts.push(`Validações reprovadas ou com ressalva: ${failedTests.length} caso(s)`)
  }

  if (project.firstValue.saleProcessed && project.firstValue.cashClosed) {
    facts.push('Ciclo de impacto concluído: operação do piloto e rotinas essenciais validadas')
  }

  // 2. Análise por cenário e condição
  if (project.id === 'project-1' || (project.mainPhase === 'first_value' && !project.firstValue.dataReconciled)) {
    // Cenário Polo Universitário Aurora / Município com piloto ativo
    rootCause = 'Lançamento do piloto realizado, porém primeiro ciclo de impacto bloqueado por divergência crítica na consolidação de dados e cadastros dos serviços locais.'
    attentionPoints.push('Divergência de integração com o sistema municipal impede a validação do ciclo de adoção.')
    attentionPoints.push('Transição para escala e institucionalização retida até a validação das rotinas de atendimento.')
    recommendedAction = 'Realizar alinhamento técnico conjunto com a liderança local e equipe de dados para saneamento dos cadastros.'
    executiveSummary = `O projeto de inovação do ${project.profile.clientName} realizou o lançamento do piloto no serviço público, mas a operação permanece em estado de atenção e bloqueio devido a divergências na consolidação de dados. O foco prioritário deve ser o saneamento da base para transição segura para a etapa de institucionalização e multiplicação.`
  } else if (project.id === 'project-3' || failedFieldValidation.length > 0) {
    // Cenário Colégio Horizonte / Validação em Campo
    rootCause = 'Inconsistência crítica na sincronização de atendimentos identificada durante a validação em campo com os servidores.'
    attentionPoints.push('Sincronização de atendimentos e rotinas reprovada no teste de validação prática.')
    attentionPoints.push('Gate de Lançamento do Piloto bloqueado até reteste e aprovação formal do critério de integração.')
    recommendedAction = 'Ajustar os parâmetros de integração no ambiente de testes e submeter a novo ciclo de validação prática com os servidores e coordenadores.'
    executiveSummary = `O projeto do ${project.profile.clientName} está na fase de validação prática em campo com pendência impeditiva no fluxo de dados. O avanço para o lançamento do piloto está retido até a correção e homologação das turmas e fluxos.`
  } else if (project.id === 'project-2' || (project.firstValue.dataReconciled && openPending.length > 0)) {
    // Cenário Rede Saber Digital / Ciclo validado com melhoria complementar
    rootCause = 'Primeiro ciclo de impacto do piloto validado com sucesso, restando entrega complementar de painel de indicadores.'
    attentionPoints.push('Operação dos servidores estável com rotinas e registros validados no serviço público.')
    attentionPoints.push('Painel complementar de indicadores a ser entregue no cronograma de melhoria contínua.')
    recommendedAction = 'Formalizar o termo de conclusão do piloto e transição para sustentação com repasse da melhoria futura para a comunidade de prática.'
    executiveSummary = `O projeto da ${project.profile.clientName} concluiu com êxito o primeiro ciclo do piloto. A iniciativa está apta para transição assistida para institucionalização e escala contínua.`
  } else if (condition === 'blocked') {
    rootCause = `Projeto com ${criticalPending.length} pendência(s) crítica(s) bloqueando o avanço para a próxima etapa da jornada.`
    attentionPoints.push('Existe dependência externa ou institucional sem resolução dentro do prazo previsto.')
    recommendedAction = 'Convocar alinhamento emergencial com a liderança patrocinadora do projeto para repactuar prazos e destravar dependências.'
    executiveSummary = `O projeto da ${project.profile.clientName} encontra-se bloqueado. É necessária intervenção da coordenação para alinhamento de pendências institucionais.`
  } else if (condition === 'attention' || condition === 'delayed') {
    rootCause = 'Cronograma com oficinas atrasadas ou acúmulo de pendências em acompanhamento.'
    attentionPoints.push('Prazos de entrega de entregáveis próximos ao limite acordado.')
    recommendedAction = 'Revisar o plano de trabalho e redistribuir oficinas para evitar atrasos no lançamento do piloto.'
    executiveSummary = `O projeto da ${project.profile.clientName} requer atenção preventiva na gestão de pendências para manter a previsão de lançamento do piloto.`
  } else {
    rootCause = 'Projeto operando dentro dos parâmetros de normalidade e cronograma planejado.'
    attentionPoints.push('Nenhum bloqueio crítico identificado no momento.')
    recommendedAction = 'Manter o acompanhamento periódico das oficinas, mentorias e marcos programados.'
    executiveSummary = `O projeto da ${project.profile.clientName} segue em conformidade com o plano de trabalho e cronograma do programa.`
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

  return `*Status Report de Inovação e Transformação: ${project.profile.clientName}*
Data: ${dateStr}
Líder da Facilitação: ${project.profile.implementationOwner}
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
