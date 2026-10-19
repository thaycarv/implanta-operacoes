import { describe, it, expect } from 'vitest'
import { PHASES, INITIAL_INITIATIVES } from '../data/socialData'

describe('Modelo de Dados: Empreendedorismo Social e Negocios de Impacto', () => {
  it('deve conter as 4 fases estruturadas do pipeline', () => {
    expect(PHASES).toHaveLength(4)
    expect(PHASES[0].id).toBe('modelagem')
    expect(PHASES[1].id).toBe('capacitacao')
    expect(PHASES[2].id).toBe('comercializacao')
    expect(PHASES[3].id).toBe('lancamento')
  })

  it('deve conter as 4 iniciativas comunitarias demonstrativas', () => {
    expect(INITIAL_INITIATIVES).toHaveLength(4)
    const ids = INITIAL_INITIATIVES.map(item => item.id)
    expect(ids).toContain('tecendo-autonomia')
    expect(ids).toContain('quitanda-da-terra')
    expect(ids).toContain('biosaberes-floresta')
    expect(ids).toContain('estudio-jovem-criativo')
  })

  it('deve validar consistencia da Quitanda da Terra com ponto de atencao ativo', () => {
    const quitanda = INITIAL_INITIATIVES.find(item => item.id === 'quitanda-da-terra')
    expect(quitanda).toBeDefined()
    expect(quitanda?.status).toBe('attention')
    expect(quitanda?.bottleneck).toBeDefined()
    expect(quitanda?.bottleneck?.responsible).toBeTruthy()
    expect(quitanda?.bottleneck?.actionPlan).toBeTruthy()
    expect(quitanda?.readinessChecklist.some(r => !r.completed)).toBe(true)
  })

  it('deve validar consistencia do Estudio Jovem Criativo como concluido e autossustentavel', () => {
    const estudio = INITIAL_INITIATIVES.find(item => item.id === 'estudio-jovem-criativo')
    expect(estudio).toBeDefined()
    expect(estudio?.status).toBe('completed')
    expect(estudio?.progressPercentage).toBe(100)
    expect(estudio?.readinessChecklist.every(r => r.completed)).toBe(true)
  })

  it('todas as iniciativas devem ter checklist de prontidao preenchido', () => {
    INITIAL_INITIATIVES.forEach(item => {
      expect(item.readinessChecklist.length).toBeGreaterThan(0)
      expect(item.beneficiariesCount).toBeGreaterThan(0)
      expect(item.community).toBeTruthy()
      expect(item.coordinator).toBeTruthy()
    })
  })
})
