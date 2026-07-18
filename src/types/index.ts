export type Identifier = string
export type ViewPerspective = 'management' | 'implementation' | 'client'

export type PhaseId =
  | 'handoff'
  | 'discovery'
  | 'requirements'
  | 'technical_planning'
  | 'delivery'
  | 'internal_qa'
  | 'client_validation'
  | 'go_live'
  | 'first_value'

export type OperationalCondition =
  | 'in_progress'
  | 'attention'
  | 'blocked'
  | 'delayed'
  | 'awaiting_validation'
  | 'completed'

export type DependencyOrigin =
  | 'client'
  | 'implementation'
  | 'technical_team'
  | 'sales'
  | 'customer_success'
  | 'external'
  | 'shared'

export type Severity = 'critical' | 'non_critical' | 'informational'
export type RequirementCommitment = 'contracted' | 'discovery_approved' | 'change_approved' | 'future' | 'out_of_scope'
export type RequirementRelevance = 'go_live_blocker' | 'first_value_required' | 'non_blocking' | 'future'
export type RequirementStatus = 'draft' | 'review' | 'approved' | 'in_delivery' | 'delivered' | 'qa_approved' | 'client_approved' | 'changed'
export type TestResult = 'not_run' | 'approved' | 'failed' | 'approved_with_note'
export type MilestoneStatus = 'planned' | 'completed' | 'delayed'
export type ScopeChangeType = 'defect' | 'requirement_divergence' | 'scope_change' | 'future_improvement' | 'configuration_pending'
export type ScopeChangeStatus = 'analysis' | 'awaiting_client' | 'approved' | 'rejected' | 'planned_future'

export interface EntityMetadata {
  id: Identifier
  createdAt: string
  updatedAt: string
}

export interface Stakeholder {
  name: string
  role: string
  organization: 'provider' | 'client' | 'external'
}

export interface ProjectProfile {
  clientName: string
  implementationOwner: string
  clientSponsor: string
  clientKeyUser: string
  storeCount: number
  modules: Array<'sales' | 'inventory' | 'cash' | 'fiscal' | 'purchasing' | 'reports'>
  dataStrategy: 'new' | 'partial_migration' | 'full_migration'
  integrations: Array<'ecommerce' | 'payments' | 'accounting' | 'other'>
  hasCustomization: boolean
  desiredGoLive: string
  customerGoal: string
}

export interface DeliveryPackage extends EntityMetadata {
  name: string
  phase: PhaseId
  status: 'not_started' | 'in_progress' | 'awaiting_validation' | 'blocked' | 'completed'
  requirementIds: Identifier[]
  dependencyIds: Identifier[]
}

export interface Requirement extends EntityMetadata {
  code: string
  packageId: Identifier
  title: string
  businessNeed: string
  description: string
  businessRule: string
  acceptanceCriteria: string
  commitment: RequirementCommitment
  relevance: RequirementRelevance
  status: RequirementStatus
  version: string
  validator: string
  conditional: boolean
  testIds: Identifier[]
}

export interface TestExecution {
  id: Identifier
  executedAt: string
  executor: string
  result: TestResult
  evidence: string
  notes?: string
}

export interface ValidationTest extends EntityMetadata {
  code: string
  requirementId: Identifier
  type: 'internal' | 'client'
  title: string
  expectedResult: string
  executions: TestExecution[]
}

export interface PendingItem extends EntityMetadata {
  title: string
  description: string
  severity: Severity
  origin: DependencyOrigin
  owner: string
  dueDate: string
  status: 'open' | 'mitigated' | 'resolved'
  relatedRequirementId?: Identifier
  relatedPackageId?: Identifier
}

export interface Milestone extends EntityMetadata {
  name: string
  phase: PhaseId
  plannedDate: string
  forecastDate: string
  completedDate?: string
  status: MilestoneStatus
  originalDate?: string
  changeReason?: string
}

export interface FirstValueCriteria {
  saleProcessed: boolean
  inventoryUpdated: boolean
  cashClosed: boolean
  dataReconciled: boolean
}

export interface ScopeChange extends EntityMetadata {
  code: string
  title: string
  description: string
  type: ScopeChangeType
  status: ScopeChangeStatus
  requestedBy: string
  impactPhase: PhaseId
  impactDays: number
  impactsGoLive: boolean
  decisionReason?: string
}

export interface ImplementationProject extends EntityMetadata {
  slug: string
  profile: ProjectProfile
  source: 'seed' | 'visitor'
  mainPhase: PhaseId
  phaseOverrideReason?: string
  packages: DeliveryPackage[]
  requirements: Requirement[]
  tests: ValidationTest[]
  scopeChanges: ScopeChange[]
  pendingItems: PendingItem[]
  milestones: Milestone[]
  firstValue: FirstValueCriteria
  awaitingValidation: boolean
  lastMeaningfulActivity: string
  closedAt?: string
}

export interface PortfolioState {
  schemaVersion: 1
  projects: ImplementationProject[]
  selectedProjectId?: Identifier
  perspective: ViewPerspective
  guideVisible: boolean
  guideProgress: string[]
  initializedAt: string
}

export interface PortfolioIndicators {
  activeProjects: number
  blockedProjects: number
  delayedProjects: number
  upcomingGoLives: number
  firstValueValidated: number
  completedProjects: number
  byPhase: Record<PhaseId, number>
  byCondition: Record<OperationalCondition, number>
}
