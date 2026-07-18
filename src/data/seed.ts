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
  if (title.includes('fiscal')) return 'fiscal'
  if (title.includes('pagamento')) return 'payments'
  if (title.includes('estoque') || title.includes('unidades')) return 'inventory'
  if (title.includes('caixa')) return 'cash'
  if (title.includes('dados')) return 'data'
  if (title.includes('customização')) return 'customization'
  return 'sales'
}

function makePackages(projectId: string, phase: PhaseId, requirements: Requirement[], now: Date): DeliveryPackage[] {
  const names: Record<string, string> = {
    sales: 'Vendas e PDV', inventory: 'Estoque', cash: 'Caixa', fiscal: 'Fiscal', payments: 'Integração de pagamentos', data: 'Migração de dados', customization: 'Customização',
  }
  const keys = [...new Set(requirements.map(packageFor))]
  return keys.map((key, index) => {
    const id = `${projectId}-pkg-${key}`
    requirements.filter(req => packageFor(req) === key).forEach(req => { req.packageId = id })
    return {
      id,
      name: names[key],
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
      ? [{ id: `${internalId}-run-1`, executedAt: addDays(now, -4), executor: 'Equipe de QA', result: 'approved' as const, evidence: 'Evidência simulada de teste interno.' }]
      : []
    const clientRun = status === 'client_approved'
      ? [{ id: `${clientId}-run-1`, executedAt: addDays(now, -2), executor: requirement.validator, result: 'approved' as const, evidence: 'Aceite simulado do cliente.' }]
      : []
    tests.push(
      { id: internalId, code: `QA-${String(index + 1).padStart(3, '0')}`, requirementId: requirement.id, type: 'internal', title: requirement.title, expectedResult: requirement.acceptanceCriteria, executions: internalRun, createdAt: now.toISOString(), updatedAt: now.toISOString() },
      { id: clientId, code: `HOM-${String(index + 1).padStart(3, '0')}`, requirementId: requirement.id, type: 'client', title: requirement.title, expectedResult: requirement.acceptanceCriteria, executions: clientRun, createdAt: now.toISOString(), updatedAt: now.toISOString() },
    )
    requirement.testIds = [internalId, clientId]
  })
  return tests
}

function makeMilestones(projectId: string, seed: ProjectSeed, now: Date): Milestone[] {
  const goLiveDate = addDays(now, seed.goLiveOffset)
  return [
    { id: `${projectId}-milestone-drn`, name: 'DRN aprovado', phase: 'requirements', plannedDate: addDays(now, -20), forecastDate: addDays(now, -18), completedDate: addDays(now, -18), status: 'completed', createdAt: now.toISOString(), updatedAt: now.toISOString() },
    { id: `${projectId}-milestone-go-live`, name: 'Go-live', phase: 'go_live', plannedDate: seed.delayed ? addDays(now, -3) : goLiveDate, forecastDate: goLiveDate, completedDate: seed.goLiveCompleted ? addDays(now, -2) : undefined, status: seed.goLiveCompleted ? 'completed' : seed.delayed ? 'delayed' : 'planned', originalDate: seed.delayed ? addDays(now, -3) : undefined, changeReason: seed.delayed ? 'Integração técnica ainda não concluída.' : undefined, createdAt: now.toISOString(), updatedAt: now.toISOString() },
    { id: `${projectId}-milestone-value`, name: 'Primeiro ciclo validado', phase: 'first_value', plannedDate: addDays(now, seed.goLiveOffset + 3), forecastDate: addDays(now, seed.goLiveOffset + 3), status: seed.closed ? 'completed' : 'planned', completedDate: seed.closed ? addDays(now, -1) : undefined, createdAt: now.toISOString(), updatedAt: now.toISOString() },
  ]
}

function createProject(seed: ProjectSeed, index: number, now: Date): ImplementationProject {
  const id = `project-${index + 1}`
  const profile: ProjectProfile = {
    clientName: seed.client,
    implementationOwner: seed.owner,
    clientSponsor: `Responsável ${seed.client}`,
    clientKeyUser: `Usuário-chave ${seed.client}`,
    storeCount: seed.stores,
    modules: seed.modules,
    dataStrategy: seed.dataStrategy ?? 'partial_migration',
    integrations: seed.integrations ?? [],
    hasCustomization: seed.customization ?? false,
    desiredGoLive: addDays(now, seed.goLiveOffset),
    customerGoal: 'Operar vendas, estoque e caixa com dados conciliados.',
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
    title: seed.customization ? 'Customização identificada no discovery' : seed.slug === 'mercado-viva' ? 'Ajuste na integração de pagamentos' : 'Relatório adicional para gestão',
    description: seed.customization ? 'Necessidade não contemplada no núcleo padrão da solução.' : 'Solicitação registrada para análise de impacto e decisão.',
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
  { slug: 'rede-aurora', client: 'Rede Aurora', owner: 'Marina Costa', phase: 'first_value', stores: 3, modules: ['sales', 'inventory', 'cash', 'fiscal'], integrations: ['payments'], requirementStatus: 'client_approved', goLiveOffset: -2, goLiveCompleted: true, firstValue: { saleProcessed: true, inventoryUpdated: true, cashClosed: true }, pending: [{ title: 'Divergência no fechamento de caixa', description: 'Valores registrados não coincidem com a conciliação.', severity: 'critical', origin: 'technical_team', owner: 'Equipe técnica', dueOffset: -1 }] },
  { slug: 'rede-prisma', client: 'Rede Prisma', owner: 'Lucas Mendes', phase: 'first_value', stores: 5, modules: ['sales', 'inventory', 'cash', 'reports'], requirementStatus: 'client_approved', goLiveOffset: -6, goLiveCompleted: true, firstValue: { saleProcessed: true, inventoryUpdated: true, cashClosed: true, dataReconciled: true }, pending: [{ title: 'Relatório personalizado pendente', description: 'Entrega contratual não bloqueante após primeiro valor.', severity: 'non_critical', origin: 'technical_team', owner: 'Equipe de relatórios', dueOffset: 8 }] },
  { slug: 'lojas-horizonte', client: 'Lojas Horizonte', owner: 'Marina Costa', phase: 'client_validation', stores: 4, modules: ['sales', 'inventory', 'cash', 'fiscal'], requirementStatus: 'qa_approved', goLiveOffset: 2, pending: [{ title: 'Falha fiscal na homologação', description: 'Documento fiscal rejeitado no cenário crítico.', severity: 'critical', origin: 'technical_team', owner: 'Equipe fiscal', dueOffset: 1 }] },
  { slug: 'mercado-viva', client: 'Mercado Viva', owner: 'Rafael Lima', phase: 'delivery', stores: 2, modules: ['sales', 'inventory', 'cash'], integrations: ['payments'], requirementStatus: 'in_delivery', goLiveOffset: 4, delayed: true, pending: [{ title: 'Integração de pagamentos atrasada', description: 'Checkpoint técnico não foi cumprido.', severity: 'non_critical', origin: 'technical_team', owner: 'Equipe de integrações', dueOffset: -2 }] },
  { slug: 'casa-norte', client: 'Casa Norte', owner: 'Bianca Alves', phase: 'requirements', stores: 1, modules: ['sales', 'inventory', 'cash'], customization: true, requirementStatus: 'review', goLiveOffset: 18, pending: [{ title: 'Divergência entre proposta e discovery', description: 'Customização citada no discovery não está explícita no handoff comercial.', severity: 'non_critical', origin: 'sales', owner: 'Executivo comercial', dueOffset: 2 }] },
  { slug: 'emporio-central', client: 'Empório Central', owner: 'Lucas Mendes', phase: 'discovery', stores: 1, modules: ['sales', 'inventory', 'cash'], requirementStatus: 'draft', goLiveOffset: 25, inactivityOffset: -5, pending: [{ title: 'Mapeamento operacional incompleto', description: 'Cliente ainda não confirmou a rotina de fechamento.', severity: 'informational', origin: 'client', owner: 'Usuário-chave', dueOffset: 2 }] },
  { slug: 'varejo-sul', client: 'Varejo Sul', owner: 'Rafael Lima', phase: 'internal_qa', stores: 6, modules: ['sales', 'inventory', 'cash', 'fiscal'], dataStrategy: 'full_migration', requirementStatus: 'delivered', goLiveOffset: 9, awaitingValidation: true },
  { slug: 'ponto-urbano', client: 'Ponto Urbano', owner: 'Bianca Alves', phase: 'first_value', stores: 2, modules: ['sales', 'inventory', 'cash', 'fiscal'], requirementStatus: 'client_approved', goLiveOffset: -10, goLiveCompleted: true, firstValue: { saleProcessed: true, inventoryUpdated: true, cashClosed: true, dataReconciled: true }, closed: true },
]

export function buildSeedPortfolio(now = new Date()): ImplementationProject[] {
  return seeds.map((seed, index) => createProject(seed, index, now))
}
