import { addDays } from '../domain/dates'
import { generateConditionalRequirements } from '../domain/requirements'
import type {
  DeliveryPackage,
  FirstValueCriteria,
  ImplementationProject,
  Milestone,
  PendingItem,
  PhaseId,
  ProjectProfile,
  Requirement,
  RequirementStatus,
  ValidationTest,
  ScopeChange,
} from '../types'

interface ProjectSeed {
  slug: string
  client: string
  owner: string
  phase: PhaseId
  stores: number
  modules: ProjectProfile['modules']
  dataStrategy?: ProjectProfile['dataStrategy']
  integrations?: ProjectProfile['integrations']
  customization?: boolean
  requirementStatus: RequirementStatus
  pending?: Array<Pick<PendingItem, 'title' | 'description' | 'severity' | 'origin' | 'owner'> & { dueOffset: number }>
  firstValue?: Partial<FirstValueCriteria>
  awaitingValidation?: boolean
  inactivityOffset?: number
  goLiveOffset: number
  goLiveCompleted?: boolean
  delayed?: boolean
  closed?: boolean
}

const packageFor = (requirement: Requirement) => {
  const title = requirement.title.toLowerCase()
  if (title.includes('fiscal') || title.includes('conformidade') || title.includes('regulatória')) return 'fiscal'
  if (title.includes('pagamento') || title.includes('integração') || title.includes('sistemas')) return 'payments'
  if (title.includes('estoque') || title.includes('unidades') || title.includes('rotinas') || title.includes('vagas')) return 'inventory'
  if (title.includes('caixa') || title.includes('governança') || title.includes('ética')) return 'cash'
  if (title.includes('dados') || title.includes('migrados')) return 'data'
  if (title.includes('customização')) return 'customization'
  return 'sales'
}

function makePackages(projectId: string, phase: PhaseId, requirements: Requirement[], now: Date): DeliveryPackage[] {
  const names: Record<string, string> = {
    sales: 'Formação de Lideranças e Servidores',
    inventory: 'Mapeamento e Fluxos de Atendimento',
    cash: 'Governança Ética e Diretrizes',
    fiscal: 'Conformidade Regulatória e LGPD',
    payments: 'Integração de Dados e Sistemas Públicos',
    data: 'Diagnóstico e Prontidão de Dados',
    customization: 'Casos de Uso Customizados',
  }
  const keys = [...new Set(requirements.map(packageFor))]
  return keys.map((key) => {
    const id = `${projectId}-pkg-${key}`
    requirements.filter(req => packageFor(req) === key).forEach(req => { req.packageId = id })
    return {
      id,
      name: names[key] || 'Pacote de Trabalho',
      phase,
      status: phase === 'first_value' ? 'completed' : phase === 'client_validation' ? 'awaiting_validation' : phase === 'handoff' ? 'not_started' : 'in_progress',
      requirementIds: requirements.filter(req => req.packageId === id).map(req => req.id),
      dependencyIds: [],
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    }
  })
}

function makeTests(projectId: string, requirements: Requirement[], status: RequirementStatus, now: Date): ValidationTest[] {
  const tests: ValidationTest[] = []
  requirements.forEach((requirement, index) => {
    const internalId = `${projectId}-qa-${index + 1}`
    const clientId = `${projectId}-hom-${index + 1}`
    const internalRun = ['qa_approved', 'client_approved'].includes(status)
      ? [{ id: `${internalId}-run-1`, executedAt: addDays(now, -4), executor: 'Revisão Metodológica', result: 'approved' as const, evidence: 'Evidência validada de revisão metodológica.' }]
      : []
    const clientRun = status === 'client_approved'
      ? [{ id: `${clientId}-run-1`, executedAt: addDays(now, -2), executor: requirement.validator, result: 'approved' as const, evidence: 'Validação e aceite em campo com as lideranças.' }]
      : []
    tests.push(
      { id: internalId, code: `REV-${String(index + 1).padStart(3, '0')}`, requirementId: requirement.id, type: 'internal', title: requirement.title, expectedResult: requirement.acceptanceCriteria, executions: internalRun, createdAt: now.toISOString(), updatedAt: now.toISOString() },
      { id: clientId, code: `VAL-${String(index + 1).padStart(3, '0')}`, requirementId: requirement.id, type: 'client', title: requirement.title, expectedResult: requirement.acceptanceCriteria, executions: clientRun, createdAt: now.toISOString(), updatedAt: now.toISOString() },
    )
    requirement.testIds = [internalId, clientId]
  })
  return tests
}

function makeMilestones(projectId: string, seed: ProjectSeed, now: Date): Milestone[] {
  const goLiveDate = addDays(now, seed.goLiveOffset)
  return [
    { id: `${projectId}-milestone-drn`, name: 'Plano de trabalho e casos de uso aprovados', phase: 'requirements', plannedDate: addDays(now, -20), forecastDate: addDays(now, -18), completedDate: addDays(now, -18), status: 'completed', createdAt: now.toISOString(), updatedAt: now.toISOString() },
    { id: `${projectId}-milestone-go-live`, name: 'Lançamento do piloto no serviço público', phase: 'go_live', plannedDate: seed.delayed ? addDays(now, -3) : goLiveDate, forecastDate: goLiveDate, completedDate: seed.goLiveCompleted ? addDays(now, -2) : undefined, status: seed.goLiveCompleted ? 'completed' : seed.delayed ? 'delayed' : 'planned', originalDate: seed.delayed ? addDays(now, -3) : undefined, changeReason: seed.delayed ? 'Integração técnica e alinhamento local pendentes.' : undefined, createdAt: now.toISOString(), updatedAt: now.toISOString() },
    { id: `${projectId}-milestone-value`, name: 'Primeiro ciclo validado e institucionalização', phase: 'first_value', plannedDate: addDays(now, seed.goLiveOffset + 3), forecastDate: addDays(now, seed.goLiveOffset + 3), status: seed.closed ? 'completed' : 'planned', completedDate: seed.closed ? addDays(now, -1) : undefined, createdAt: now.toISOString(), updatedAt: now.toISOString() },
  ]
}

function createProject(seed: ProjectSeed, index: number, now: Date): ImplementationProject {
  const id = `project-${index + 1}`
  const profile: ProjectProfile = {
    clientName: seed.client,
    implementationOwner: seed.owner,
    clientSponsor: `Secretário(a) / Patrocinador ${seed.client}`,
    clientKeyUser: `Ponto Focal ${seed.client}`,
    storeCount: seed.stores,
    modules: seed.modules,
    dataStrategy: seed.dataStrategy ?? 'partial_migration',
    integrations: seed.integrations ?? [],
    hasCustomization: seed.customization ?? false,
    desiredGoLive: addDays(now, seed.goLiveOffset),
    customerGoal: 'Capacitar equipes locais, operar o piloto em ambiente real do serviço público e consolidar governança de IA.',
  }
  const requirements = generateConditionalRequirements(profile, id, now).map(requirement => ({ ...requirement, status: seed.requirementStatus, version: seed.requirementStatus === 'draft' ? '0.1' : '1.0' }))
  const pendingItems: PendingItem[] = (seed.pending ?? []).map((item, pendingIndex) => ({
    id: `${id}-pending-${pendingIndex + 1}`,
    ...item,
    dueDate: addDays(now, item.dueOffset),
    status: 'open',
    createdAt: addDays(now, -3),
    updatedAt: now.toISOString(),
  }))
  const defaultValue: FirstValueCriteria = { saleProcessed: false, inventoryUpdated: false, cashClosed: false, dataReconciled: false }
  const firstValue = { ...defaultValue, ...seed.firstValue }
  const scopeChanges: ScopeChange[] = seed.customization || seed.slug === 'mercado-viva' || seed.slug === 'rede-prisma' ? [{
    id: `${id}-change-1`, code: `MUD-${String(index + 1).padStart(3, '0')}`,
    title: seed.customization ? 'Customização identificada no diagnóstico' : seed.slug === 'mercado-viva' ? 'Ajuste na integração de dados' : 'Painel complementar de indicadores',
    description: seed.customization ? 'Necessidade específica levantada para adequação ao fluxo local da secretaria.' : 'Solicitação registrada para análise de impacto e decisão.',
    type: seed.slug === 'mercado-viva' ? 'requirement_divergence' : seed.slug === 'rede-prisma' ? 'future_improvement' : 'scope_change',
    status: seed.slug === 'rede-prisma' ? 'planned_future' : seed.customization ? 'awaiting_client' : 'analysis', requestedBy: seed.client,
    impactPhase: seed.phase, impactDays: seed.customization ? 5 : 2, impactsGoLive: Boolean(seed.customization),
    createdAt: addDays(now, -5), updatedAt: now.toISOString(),
  }] : []
  const project: ImplementationProject = {
    id,
    slug: seed.slug,
    profile,
    source: 'seed',
    mainPhase: seed.phase,
    packages: [],
    requirements,
    tests: makeTests(id, requirements, seed.requirementStatus, now),
    scopeChanges,
    pendingItems,
    milestones: makeMilestones(id, seed, now),
    firstValue,
    awaitingValidation: seed.awaitingValidation ?? false,
    lastMeaningfulActivity: addDays(now, seed.inactivityOffset ?? -1),
    closedAt: seed.closed ? addDays(now, -1) : undefined,
    createdAt: addDays(now, -35),
    updatedAt: now.toISOString(),
  }
  project.packages = makePackages(id, seed.phase, requirements, now)
  return project
}

const seeds: ProjectSeed[] = [
  { slug: 'rede-aurora', client: 'Polo Universitário Aurora', owner: 'Marina Costa', phase: 'first_value', stores: 3, modules: ['sales', 'inventory', 'cash', 'fiscal'], integrations: ['payments'], requirementStatus: 'client_approved', goLiveOffset: -2, goLiveCompleted: true, firstValue: { saleProcessed: true, inventoryUpdated: true, cashClosed: true }, pending: [{ title: 'Divergência na consolidação de dados locais', description: 'Dados dos cadastros não coincidem com o sistema municipal.', severity: 'critical', origin: 'technical_team', owner: 'Equipe local de dados e TI', dueOffset: -1 }] },
  { slug: 'rede-prisma', client: 'Rede Saber Digital', owner: 'Lucas Mendes', phase: 'first_value', stores: 5, modules: ['sales', 'inventory', 'cash', 'reports'], requirementStatus: 'client_approved', goLiveOffset: -6, goLiveCompleted: true, firstValue: { saleProcessed: true, inventoryUpdated: true, cashClosed: true, dataReconciled: true }, pending: [{ title: 'Painel pedagógico complementar pendente', description: 'Entrega complementar não bloqueante após o primeiro ciclo validado.', severity: 'non_critical', origin: 'technical_team', owner: 'Equipe de indicadores', dueOffset: 8 }] },
  { slug: 'lojas-horizonte', client: 'Colégio Horizonte', owner: 'Marina Costa', phase: 'client_validation', stores: 4, modules: ['sales', 'inventory', 'cash', 'fiscal'], requirementStatus: 'qa_approved', goLiveOffset: 2, pending: [{ title: 'Inconsistência de integração na homologação', description: 'Sincronização de atendimentos rejeitada no teste em campo.', severity: 'critical', origin: 'technical_team', owner: 'Equipe local de dados e TI', dueOffset: 1 }] },
  { slug: 'mercado-viva', client: 'Instituto Inova Edu', owner: 'Rafael Lima', phase: 'delivery', stores: 2, modules: ['sales', 'inventory', 'cash'], integrations: ['payments'], requirementStatus: 'in_delivery', goLiveOffset: 4, delayed: true, pending: [{ title: 'Integração com ambiente virtual atrasada', description: 'Checkpoint técnico da plataforma não foi cumprido.', severity: 'non_critical', origin: 'technical_team', owner: 'Equipe local de dados e TI', dueOffset: -2 }] },
  { slug: 'casa-norte', client: 'Escola Futuro Conectado', owner: 'Bianca Alves', phase: 'requirements', stores: 1, modules: ['sales', 'inventory', 'cash'], customization: true, requirementStatus: 'review', goLiveOffset: 18, pending: [{ title: 'Divergência entre proposta e discovery pedagógico', description: 'Módulo adaptativo citado no diagnóstico não está explícito no alinhamento inicial.', severity: 'non_critical', origin: 'sales', owner: 'Articulação e adesão', dueOffset: 2 }] },
  { slug: 'emporio-central', client: 'Lab de Inovação Digital', owner: 'Lucas Mendes', phase: 'discovery', stores: 1, modules: ['sales', 'inventory', 'cash'], requirementStatus: 'draft', goLiveOffset: 25, inactivityOffset: -5, pending: [{ title: 'Diagnóstico de maturidade incompleto', description: 'Equipe local ainda não confirmou o levantamento de infraestrutura.', severity: 'informational', origin: 'client', owner: 'Usuário-chave', dueOffset: 2 }] },
  { slug: 'varejo-sul', client: 'Complexo Educacional Sul', owner: 'Rafael Lima', phase: 'internal_qa', stores: 6, modules: ['sales', 'inventory', 'cash', 'fiscal'], dataStrategy: 'full_migration', requirementStatus: 'delivered', goLiveOffset: 9, awaitingValidation: true },
  { slug: 'ponto-urbano', client: 'Polo Saber Urbano', owner: 'Bianca Alves', phase: 'first_value', stores: 2, modules: ['sales', 'inventory', 'cash', 'fiscal'], requirementStatus: 'client_approved', goLiveOffset: -10, goLiveCompleted: true, firstValue: { saleProcessed: true, inventoryUpdated: true, cashClosed: true, dataReconciled: true }, closed: true },
]

export function buildSeedPortfolio(now = new Date()): ImplementationProject[] {
  return seeds.map((seed, index) => createProject(seed, index, now))
}
