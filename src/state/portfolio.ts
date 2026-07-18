import { generateConditionalRequirements } from '../domain/requirements'
import { buildSeedPortfolio } from '../data/seed'
import type { ImplementationProject, PortfolioState, ProjectProfile, ScopeChange, TestResult, ViewPerspective } from '../types'

export const STORAGE_KEY = 'implanta.portfolio.v1'

export type PortfolioAction =
  | { type: 'project/add'; profile: ProjectProfile }
  | { type: 'project/update'; project: ImplementationProject }
  | { type: 'requirement/status'; projectId: string; requirementId: string; status: ImplementationProject['requirements'][number]['status'] }
  | { type: 'test/execute'; projectId: string; testId: string; result: TestResult; executor: string }
  | { type: 'change/add'; projectId: string; change: ScopeChange }
  | { type: 'change/status'; projectId: string; changeId: string; status: ScopeChange['status'] }
  | { type: 'project/delete'; projectId: string }
  | { type: 'project/select'; projectId?: string }
  | { type: 'perspective/set'; perspective: ViewPerspective }
  | { type: 'guide/set'; visible: boolean }
  | { type: 'guide/toggle-step'; stepId: string }
  | { type: 'guide/reset' }
  | { type: 'project/reset'; projectId: string }
  | { type: 'portfolio/reset' }

export function createInitialState(now = new Date()): PortfolioState {
  return {
    schemaVersion: 1,
    projects: buildSeedPortfolio(now),
    selectedProjectId: undefined,
    perspective: 'management',
    guideVisible: false,
    guideProgress: [],
    initializedAt: now.toISOString(),
  }
}

export function createVisitorProject(profile: ProjectProfile, now = new Date()): ImplementationProject {
  const suffix = `${now.getTime()}`
  const id = `visitor-${suffix}`
  const requirements = generateConditionalRequirements(profile, id, now)
  const packageId = `${id}-pkg-core`
  requirements.forEach(requirement => { requirement.packageId = packageId })
  return {
    id,
    slug: profile.clientName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    profile,
    source: 'visitor',
    mainPhase: 'handoff',
    packages: [{ id: packageId, name: 'Núcleo da implantação', phase: 'handoff', status: 'not_started', requirementIds: requirements.map(item => item.id), dependencyIds: [], createdAt: now.toISOString(), updatedAt: now.toISOString() }],
    requirements,
    tests: [],
    scopeChanges: [],
    pendingItems: [],
    milestones: [],
    firstValue: { saleProcessed: false, inventoryUpdated: false, cashClosed: false, dataReconciled: false },
    awaitingValidation: false,
    lastMeaningfulActivity: now.toISOString(),
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  }
}

export function portfolioReducer(state: PortfolioState, action: PortfolioAction): PortfolioState {
  switch (action.type) {
    case 'project/add': {
      const project = createVisitorProject(action.profile)
      return { ...state, projects: [...state.projects, project], selectedProjectId: project.id }
    }
    case 'project/update':
      return { ...state, projects: state.projects.map(project => project.id === action.project.id ? action.project : project) }
    case 'requirement/status':
      return { ...state, projects: state.projects.map(project => project.id !== action.projectId ? project : { ...project, requirements: project.requirements.map(requirement => requirement.id === action.requirementId ? { ...requirement, status: action.status, updatedAt: new Date().toISOString() } : requirement), updatedAt: new Date().toISOString() }) }
    case 'test/execute':
      return { ...state, projects: state.projects.map(project => project.id !== action.projectId ? project : { ...project, tests: project.tests.map(test => test.id !== action.testId ? test : { ...test, executions: [...test.executions, { id: `${test.id}-run-${test.executions.length + 1}`, executedAt: new Date().toISOString(), executor: action.executor, result: action.result, evidence: 'Evidência registrada durante a exploração do protótipo.' }], updatedAt: new Date().toISOString() }), updatedAt: new Date().toISOString() }) }
    case 'change/add':
      return { ...state, projects: state.projects.map(project => project.id !== action.projectId ? project : { ...project, scopeChanges: [...(project.scopeChanges ?? []), action.change], updatedAt: new Date().toISOString() }) }
    case 'change/status':
      return { ...state, projects: state.projects.map(project => project.id !== action.projectId ? project : { ...project, scopeChanges: (project.scopeChanges ?? []).map(change => change.id === action.changeId ? { ...change, status: action.status, updatedAt: new Date().toISOString() } : change), updatedAt: new Date().toISOString() }) }
    case 'project/delete': {
      const project = state.projects.find(item => item.id === action.projectId)
      if (!project || project.source !== 'visitor') return state
      return { ...state, projects: state.projects.filter(item => item.id !== action.projectId), selectedProjectId: state.selectedProjectId === action.projectId ? undefined : state.selectedProjectId }
    }
    case 'project/select':
      return { ...state, selectedProjectId: action.projectId }
    case 'perspective/set':
      return { ...state, perspective: action.perspective }
    case 'guide/set':
      return { ...state, guideVisible: action.visible }
    case 'guide/toggle-step': {
      const progress = state.guideProgress ?? []
      return { ...state, guideProgress: progress.includes(action.stepId) ? progress.filter(id => id !== action.stepId) : [...progress, action.stepId] }
    }
    case 'guide/reset':
      return { ...state, guideProgress: [] }
    case 'project/reset': {
      const current = state.projects.find(project => project.id === action.projectId)
      if (!current) return state
      if (current.source === 'visitor') return { ...state, projects: state.projects.filter(project => project.id !== current.id), selectedProjectId: undefined }
      const reset = buildSeedPortfolio(new Date()).find(project => project.slug === current.slug)
      if (!reset) return state
      return { ...state, projects: state.projects.map(project => project.id === current.id ? { ...reset, id: current.id } : project) }
    }
    case 'portfolio/reset':
      return createInitialState(new Date())
    default:
      return state
  }
}

export function loadState(storage: Pick<Storage, 'getItem'> = localStorage): PortfolioState {
  try {
    const serialized = storage.getItem(STORAGE_KEY)
    if (!serialized) return createInitialState()
    const parsed = JSON.parse(serialized) as PortfolioState
    if (parsed.schemaVersion !== 1 || !Array.isArray(parsed.projects)) return createInitialState()
    return parsed
  } catch {
    return createInitialState()
  }
}

export function persistState(state: PortfolioState, storage: Pick<Storage, 'setItem'> = localStorage): void {
  storage.setItem(STORAGE_KEY, JSON.stringify(state))
}
