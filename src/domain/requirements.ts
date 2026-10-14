import type { ProjectProfile, Requirement, RequirementRelevance } from '../types'

interface RequirementTemplate {
  suffix: string
  title: string
  need: string
  rule: string
  criteria: string
  relevance: RequirementRelevance
  applies: (profile: ProjectProfile) => boolean
}

const templates: RequirementTemplate[] = [
  { suffix: 'SALE', title: 'Processar matrícula no portal', need: 'Registrar a operação principal da instituição.', rule: 'Toda matrícula confirmada deve gerar registro acadêmico identificável.', criteria: 'Concluir uma matrícula real com confirmação registrada.', relevance: 'go_live_blocker', applies: p => p.modules.includes('sales') },
  { suffix: 'STOCK', title: 'Atualizar turmas e vagas', need: 'Manter a disponibilidade de vagas confiável.', rule: 'A confirmação da matrícula atualiza o saldo da turma.', criteria: 'Alocar estudantes e conferir atualização do quadro de vagas.', relevance: 'first_value_required', applies: p => p.modules.includes('inventory') },
  { suffix: 'CASH', title: 'Conciliar registros acadêmicos', need: 'Conferir os registros e dados do período.', rule: 'Matrículas e turmas devem corresponder ao fechamento.', criteria: 'Conciliar registros acadêmicos e planos contratados.', relevance: 'first_value_required', applies: p => p.modules.includes('cash') },
  { suffix: 'FISCAL', title: 'Emitir documentação de conformidade', need: 'Operar em conformidade regulatória.', rule: 'A emissão de contratos e registros acadêmicos deve atender normas vigentes.', criteria: 'Emitir e validar documentação oficial em homologação.', relevance: 'go_live_blocker', applies: p => p.modules.includes('fiscal') },
  { suffix: 'DATA', title: 'Conferir dados migrados', need: 'Iniciar a operação com dados íntegros.', rule: 'A carga deve manter totais e campos essenciais.', criteria: 'Comparar amostra e totais antes e depois da migração.', relevance: 'go_live_blocker', applies: p => p.dataStrategy !== 'new' },
  { suffix: 'MULTI', title: 'Validar múltiplas unidades', need: 'Separar e consolidar corretamente as unidades ou polos.', rule: 'Cada transação deve pertencer à unidade correta.', criteria: 'Executar operação em duas unidades e conferir consolidação.', relevance: 'go_live_blocker', applies: p => p.storeCount > 1 },
  { suffix: 'PAY', title: 'Homologar integração de sistemas e portais', need: 'Integrar sistemas educacionais com segurança.', rule: 'Comunicação entre plataformas deve registrar retorno confiável.', criteria: 'Sincronizar dados entre portal e sistema acadêmico.', relevance: 'go_live_blocker', applies: p => p.integrations.includes('payments') },
  { suffix: 'ECOM', title: 'Sincronizar dados do portal acadêmico', need: 'Integrar inscrições e turmas entre plataformas.', rule: 'Inscrição confirmada deve atualizar o sistema e a disponibilidade de vagas.', criteria: 'Importar solicitação e conferir disponibilidade e status.', relevance: 'first_value_required', applies: p => p.integrations.includes('ecommerce') },
  { suffix: 'CUSTOM', title: 'Aprovar especificação da customização', need: 'Controlar o comportamento não padronizado.', rule: 'Customização só entra em execução após requisito e aceite.', criteria: 'Documento aprovado com regra e resultado esperado.', relevance: 'non_blocking', applies: p => p.hasCustomization },
]

export function generateConditionalRequirements(profile: ProjectProfile, projectId: string, now = new Date()): Requirement[] {
  const timestamp = now.toISOString()
  return templates.filter(template => template.applies(profile)).map((template, index) => ({
    id: `${projectId}-req-${index + 1}`,
    code: `REQ-${String(index + 1).padStart(3, '0')}`,
    packageId: `${projectId}-pkg-core`,
    title: template.title,
    businessNeed: template.need,
    description: template.title,
    businessRule: template.rule,
    acceptanceCriteria: template.criteria,
    commitment: 'contracted',
    relevance: template.relevance,
    status: 'draft',
    version: '0.1',
    validator: profile.clientKeyUser,
    conditional: !['SALE', 'STOCK', 'CASH'].includes(template.suffix),
    testIds: [],
    createdAt: timestamp,
    updatedAt: timestamp,
  }))
}

export function requirementCoverage(requirements: Requirement[]) {
  const total = requirements.length
  const count = (statuses: Requirement['status'][]) => requirements.filter(item => statuses.includes(item.status)).length
  return {
    total,
    approved: count(['approved', 'in_delivery', 'delivered', 'qa_approved', 'client_approved']),
    delivered: count(['delivered', 'qa_approved', 'client_approved']),
    qaApproved: count(['qa_approved', 'client_approved']),
    clientApproved: count(['client_approved']),
    goLiveBlockersOpen: requirements.filter(item => item.relevance === 'go_live_blocker' && item.status !== 'client_approved').length,
    firstValueRequiredOpen: requirements.filter(item => item.relevance === 'first_value_required' && item.status !== 'client_approved').length,
  }
}
