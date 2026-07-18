import { createInitialState, loadState, portfolioReducer, STORAGE_KEY } from '../state/portfolio'
import type { ProjectProfile } from '../types'

const profile: ProjectProfile = {
  clientName: 'Nova Loja', implementationOwner: 'Marina', clientSponsor: 'Patrícia', clientKeyUser: 'João', storeCount: 2,
  modules: ['sales', 'inventory', 'cash', 'fiscal'], dataStrategy: 'partial_migration', integrations: ['payments'], hasCustomization: false,
  desiredGoLive: '2026-09-01T00:00:00.000Z', customerGoal: 'Validar o primeiro ciclo.',
}

describe('Portfolio state', () => {
  it('adds a visitor project and generates its requirements', () => {
    const initial = createInitialState(new Date('2026-07-17T12:00:00.000Z'))
    const state = portfolioReducer(initial, { type: 'project/add', profile })
    expect(state.projects).toHaveLength(9)
    const created = state.projects.at(-1)!
    expect(created.source).toBe('visitor')
    expect(created.requirements.length).toBeGreaterThan(4)
    expect(state.selectedProjectId).toBe(created.id)
  })

  it('does not delete a seeded project individually', () => {
    const initial = createInitialState(new Date('2026-07-17T12:00:00.000Z'))
    const state = portfolioReducer(initial, { type: 'project/delete', projectId: initial.projects[0].id })
    expect(state.projects).toHaveLength(8)
  })

  it('restores a valid initial state when persisted data is invalid', () => {
    const storage = { getItem: (key: string) => key === STORAGE_KEY ? '{invalid-json' : null }
    const state = loadState(storage)
    expect(state.projects).toHaveLength(8)
    expect(state.schemaVersion).toBe(1)
  })

  it('records a test execution without blocking exploration', () => {
    const initial = createInitialState(new Date('2026-07-17T12:00:00.000Z'))
    const project = initial.projects[4]
    const test = project.tests[0]
    const state = portfolioReducer(initial, { type: 'test/execute', projectId: project.id, testId: test.id, result: 'failed', executor: 'Visitante' })
    expect(state.projects[4].tests[0].executions.at(-1)?.result).toBe('failed')
    expect(state.projects).toHaveLength(8)
  })

  it('updates a scope-change decision while preserving its impact analysis', () => {
    const initial = createInitialState(new Date('2026-07-17T12:00:00.000Z'))
    const project = initial.projects.find(item => item.scopeChanges.length > 0)!
    const change = project.scopeChanges[0]
    const state = portfolioReducer(initial, { type: 'change/status', projectId: project.id, changeId: change.id, status: 'approved' })
    const updated = state.projects.find(item => item.id === project.id)!.scopeChanges[0]
    expect(updated.status).toBe('approved')
    expect(updated.impactDays).toBe(change.impactDays)
  })

  it('tracks and resets optional guide observations independently from project data', () => {
    const initial = createInitialState(new Date('2026-07-17T12:00:00.000Z'))
    const marked = portfolioReducer(initial, { type: 'guide/toggle-step', stepId: 'aurora-detail' })
    expect(marked.guideProgress).toEqual(['aurora-detail'])
    const reset = portfolioReducer(marked, { type: 'guide/reset' })
    expect(reset.guideProgress).toEqual([])
    expect(reset.projects).toHaveLength(initial.projects.length)
  })
})
