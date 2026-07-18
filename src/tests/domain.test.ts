import { buildSeedPortfolio } from '../data/seed'
import { deriveCondition } from '../domain/condition'
import { evaluateFirstValueGate, evaluateGoLiveGate } from '../domain/gates'
import { calculateIndicators } from '../domain/indicators'
import { generateConditionalRequirements } from '../domain/requirements'
import type { ProjectProfile } from '../types'

const now = new Date('2026-07-17T12:00:00.000Z')

describe('Implanta business rules', () => {
  const projects = buildSeedPortfolio(now)
  const bySlug = (slug: string) => projects.find(project => project.slug === slug)!

  it('creates the eight coherent seed projects', () => {
    expect(projects).toHaveLength(8)
    expect(projects.map(project => project.profile.clientName)).toContain('Rede Aurora')
    expect(projects.map(project => project.profile.clientName)).toContain('Ponto Urbano')
  })

  it('derives operational conditions from observable evidence', () => {
    expect(deriveCondition(bySlug('rede-aurora'), now)).toBe('blocked')
    expect(deriveCondition(bySlug('lojas-horizonte'), now)).toBe('blocked')
    expect(deriveCondition(bySlug('mercado-viva'), now)).toBe('delayed')
    expect(deriveCondition(bySlug('emporio-central'), now)).toBe('attention')
    expect(deriveCondition(bySlug('varejo-sul'), now)).toBe('awaiting_validation')
    expect(deriveCondition(bySlug('ponto-urbano'), now)).toBe('completed')
  })

  it('keeps go-live blocked while critical evidence remains open', () => {
    const result = evaluateGoLiveGate(bySlug('lojas-horizonte'))
    expect(result.ready).toBe(false)
    expect(result.reasons.join(' ')).toMatch(/pendência crítica/i)
  })

  it('does not confuse go-live with first value', () => {
    const result = evaluateFirstValueGate(bySlug('rede-aurora'))
    expect(result.ready).toBe(false)
    expect(result.reasons.join(' ')).toMatch(/conciliados/i)
  })

  it('calculates portfolio indicators without a general health score', () => {
    const indicators = calculateIndicators(projects, now)
    expect(indicators.activeProjects).toBe(7)
    expect(indicators.blockedProjects).toBe(2)
    expect(indicators.completedProjects).toBe(1)
    expect(indicators.firstValueValidated).toBe(2)
  })

  it('generates conditional requirements from implementation scope', () => {
    const profile: ProjectProfile = {
      clientName: 'Teste Livre', implementationOwner: 'Ana', clientSponsor: 'Bruno', clientKeyUser: 'Carla', storeCount: 4,
      modules: ['sales', 'inventory', 'cash', 'fiscal'], dataStrategy: 'full_migration', integrations: ['payments'], hasCustomization: true,
      desiredGoLive: '2026-08-20T00:00:00.000Z', customerGoal: 'Operar com segurança.',
    }
    const titles = generateConditionalRequirements(profile, 'test', now).map(item => item.title)
    expect(titles).toContain('Validar múltiplas unidades')
    expect(titles).toContain('Conferir dados migrados')
    expect(titles).toContain('Homologar integração de pagamentos')
    expect(titles).toContain('Aprovar especificação da customização')
  })
})
