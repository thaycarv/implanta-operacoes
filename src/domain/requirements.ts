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
  { suffix: 'SALE', title: 'Capacitação de equipes e processo assistencial', need: 'Capacitar as equipes na operação dos novos fluxos do projeto.', rule: 'Ao menos 80% dos servidores e equipes envolvidos devem concluir a formação.', criteria: 'Oficina concluída com avaliação de prontidão registrada.', relevance: 'go_live_blocker', applies: p => p.modules.includes('sales') },
  { suffix: 'STOCK', title: 'Mapeamento de rotinas e disponibilidade de vagas', need: 'Manter a disponibilidade e alocação confiável das unidades.', rule: 'A confirmação do atendimento atualiza o fluxo da unidade.', criteria: 'Conferir alocação e atualização do fluxo da unidade.', relevance: 'first_value_required', applies: p => p.modules.includes('inventory') },
  { suffix: 'CASH', title: 'Governança ética e conciliação de registros', need: 'Conferir os registros e dados do período com governança pública.', rule: 'Rotinas e encaminhamentos devem corresponder ao fechamento do ciclo.', criteria: 'Conciliar registros de atendimento e dados operacionais.', relevance: 'first_value_required', applies: p => p.modules.includes('cash') },
  { suffix: 'FISCAL', title: 'Conformidade legal e documentação regulatória', need: 'Operar em conformidade com as normas vigentes e diretrizes públicas.', rule: 'A emissão de registros e atos deve atender normas regulatórias.', criteria: 'Validar documentação e conformidade no ambiente de testes.', relevance: 'go_live_blocker', applies: p => p.modules.includes('fiscal') },
  { suffix: 'DATA', title: 'Conferir dados migrados', need: 'Iniciar a operação do piloto com dados íntegros e consistentes.', rule: 'A carga deve manter totais e campos essenciais dos cadastros.', criteria: 'Comparar amostra e totais antes e depois da migração.', relevance: 'go_live_blocker', applies: p => p.dataStrategy !== 'new' },
  { suffix: 'MULTI', title: 'Validar múltiplas unidades', need: 'Garantir a operação integrada em secretarias, unidades ou polos.', rule: 'Cada atendimento deve pertencer à unidade correta.', criteria: 'Executar operação em duas unidades e conferir consolidação.', relevance: 'go_live_blocker', applies: p => p.storeCount > 1 },
  { suffix: 'PAY', title: 'Homologar integração de sistemas e portais', need: 'Integrar sistemas educacionais e plataformas públicas com segurança.', rule: 'Comunicação entre plataformas deve registrar retorno confiável.', criteria: 'Sincronizar dados entre portal e sistema de gestão.', relevance: 'go_live_blocker', applies: p => p.integrations.includes('payments') },
  { suffix: 'ECOM', title: 'Sincronizar dados do portal de serviços ao cidadão', need: 'Integrar solicitações e encaminhamentos entre plataformas digitais.', rule: 'Solicitação confirmada deve alimentar a esteira de atendimento.', criteria: 'Importar solicitação e conferir disponibilidade e status.', relevance: 'first_value_required', applies: p => p.integrations.includes('ecommerce') },
  { suffix: 'CUSTOM', title: 'Aprovar especificação da customização', need: 'Formalizar o desenho específico do projeto de inovação.', rule: 'Customização só entra em execução após validação e aceite metodológico.', criteria: 'Documento aprovado com regra e resultado esperado.', relevance: 'non_blocking', applies: p => p.hasCustomization },
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
