import type { ImplementationProject } from '../types'

export type CapacityClass = 'standard' | 'coordinated' | 'complex'

export interface CapacityAssessment { classification: CapacityClass; label: string; reasons: string[] }

export function assessCapacity(project: ImplementationProject): CapacityAssessment {
  const reasons: string[] = []
  if (project.profile.hasCustomization) reasons.push('customização prevista')
  if (project.profile.dataStrategy === 'full_migration') reasons.push('migração completa')
  if (project.profile.storeCount >= 5) reasons.push(`${project.profile.storeCount} lojas`)
  if (project.profile.integrations.length >= 2) reasons.push('múltiplas integrações')
  if (reasons.length) return { classification: 'complex', label: 'Alta coordenação', reasons }
  if (project.profile.storeCount > 1) reasons.push('operação multiunidade')
  if (project.profile.dataStrategy === 'partial_migration') reasons.push('migração parcial')
  if (project.profile.integrations.length === 1) reasons.push('uma integração')
  if (reasons.length) return { classification: 'coordinated', label: 'Coordenação moderada', reasons }
  return { classification: 'standard', label: 'Padrão', reasons: ['núcleo padrão e operação simples'] }
}
