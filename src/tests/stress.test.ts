import { assessCapacity } from '../domain/capacity'
import { deriveCondition, isFirstValueValidated } from '../domain/condition'
import { evaluateGoLiveGate } from '../domain/gates'
import { evaluateCSTransition } from '../domain/transition'
import { buildSeedPortfolio } from '../data/seed'
import { portfolioReducer, createInitialState } from '../state/portfolio'

const now = new Date('2026-07-17T12:00:00.000Z')

describe('Nove testes de estresse do IMPLANTA', () => {
  const projects = buildSeedPortfolio(now)
  const bySlug = (slug: string) => projects.find(project => project.slug === slug)!

  it('1. mantém DRN incremental organizado em pacotes rastreáveis', () => {
    const project = bySlug('rede-aurora')
    expect(project.packages.length).toBeGreaterThan(1)
    expect(project.requirements.every(req => project.packages.some(pkg => pkg.id === req.packageId))).toBe(true)
    expect(project.requirements.every(req => req.testIds.length === 2)).toBe(true)
  })

  it('2. isola o impacto de mudança ao projeto afetado', () => {
    const initial = createInitialState(now)
    const target = initial.projects[4]
    const untouched = initial.projects[0]
    const change = target.scopeChanges[0]
    const state = portfolioReducer(initial, { type: 'change/status', projectId: target.id, changeId: change.id, status: 'approved' })
    expect(state.projects[4].scopeChanges[0].status).toBe('approved')
    expect(state.projects[0]).toEqual(untouched)
  })

  it('3. distingue divergência de requisito de defeito e novo escopo', () => {
    const project = bySlug('mercado-viva')
    expect(project.scopeChanges[0].type).toBe('requirement_divergence')
    expect(project.scopeChanges[0].impactsGoLive).toBe(false)
  })

  it('4. impede liberação operacional do go-live com falha crítica', () => {
    const gate = evaluateGoLiveGate(bySlug('lojas-horizonte'))
    expect(gate.ready).toBe(false)
    expect(gate.reasons).toContain('Existe pendência crítica aberta')
  })

  it('5. não confunde go-live executado com primeiro valor validado', () => {
    const project = bySlug('rede-aurora')
    expect(project.milestones.find(item => item.phase === 'go_live')?.status).toBe('completed')
    expect(isFirstValueValidated(project)).toBe(false)
    expect(deriveCondition(project, now)).toBe('blocked')
  })

  it('6. diferencia classes de capacidade sem percentual genérico', () => {
    expect(assessCapacity(bySlug('casa-norte')).classification).toBe('complex')
    expect(assessCapacity(bySlug('emporio-central')).classification).toBe('coordinated')
  })

  it('7. torna explícita a divergência originada no handoff comercial', () => {
    const project = bySlug('casa-norte')
    expect(project.pendingItems.some(item => item.origin === 'sales' && item.status === 'open')).toBe(true)
  })

  it('8. isola dependência do cliente sem atribuir falha ao time interno', () => {
    const project = bySlug('emporio-central')
    expect(project.pendingItems.some(item => item.origin === 'client')).toBe(true)
    expect(deriveCondition(project, now)).toBe('attention')
  })

  it('9. permite transição parcial para CS com pendência não crítica explícita', () => {
    const transition = evaluateCSTransition(bySlug('rede-prisma'))
    expect(transition.status).toBe('partial')
    expect(transition.reasons[0]).toMatch(/Relatório personalizado pendente/)
    expect(evaluateCSTransition(bySlug('ponto-urbano')).status).toBe('ready')
  })
})
