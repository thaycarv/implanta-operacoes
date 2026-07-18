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
  { suffix: 'SALE', title: 'Processar venda no PDV', need: 'Registrar a operação principal do varejo.', rule: 'Toda venda confirmada deve gerar transação identificável.', criteria: 'Concluir uma venda real com pagamento registrado.', relevance: 'go_live_blocker', applies: p => p.modules.includes('sales') },
  { suffix: 'STOCK', title: 'Atualizar estoque após venda', need: 'Manter o saldo disponível confiável.', rule: 'A confirmação da venda reduz o saldo do item.', criteria: 'Vender duas unidades e conferir a redução do saldo.', relevance: 'first_value_required', applies: p => p.modules.includes('inventory') },
  { suffix: 'CASH', title: 'Conciliar fechamento de caixa', need: 'Conferir os valores movimentados no período.', rule: 'Transações registradas devem corresponder ao fechamento.', criteria: 'Fechar o caixa e reconciliar vendas e pagamentos.', relevance: 'first_value_required', applies: p => p.modules.includes('cash') },
  { suffix: 'FISCAL', title: 'Emitir documento fiscal válido', need: 'Operar em conformidade fiscal.', rule: 'A venda aplicável deve emitir documento fiscal homologado.', criteria: 'Emitir e validar documento fiscal em ambiente de homologação.', relevance: 'go_live_blocker', applies: p => p.modules.includes('fiscal') },
  { suffix: 'DATA', title: 'Conferir dados migrados', need: 'Iniciar a operação com dados íntegros.', rule: 'A carga deve manter totais e campos essenciais.', criteria: 'Comparar amostra e totais antes e depois da migração.', relevance: 'go_live_blocker', applies: p => p.dataStrategy !== 'new' },
  { suffix: 'MULTI', title: 'Validar múltiplas unidades', need: 'Separar e consolidar corretamente as lojas.', rule: 'Cada transação deve pertencer à unidade correta.', criteria: 'Executar operação em duas unidades e conferir consolidação.', relevance: 'go_live_blocker', applies: p => p.storeCount > 1 },
  { suffix: 'PAY', title: 'Homologar integração de pagamentos', need: 'Registrar pagamentos integrados com segurança.', rule: 'Pagamento aprovado deve retornar à venda correta.', criteria: 'Processar pagamento e conferir retorno e conciliação.', relevance: 'go_live_blocker', applies: p => p.integrations.includes('payments') },
  { suffix: 'ECOM', title: 'Sincronizar pedidos do e-commerce', need: 'Integrar pedidos e estoque entre canais.', rule: 'Pedido confirmado deve atualizar o ERP e a disponibilidade.', criteria: 'Importar pedido e conferir estoque e status.', relevance: 'first_value_required', applies: p => p.integrations.includes('ecommerce') },
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
