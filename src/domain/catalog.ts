import type { DependencyOrigin, OperationalCondition, PhaseId } from '../types'

export const phases: Array<{ id: PhaseId; label: string; shortLabel: string; inactivityDays: number }> = [
  { id: 'handoff', label: 'Adesão e alinhamento institucional', shortLabel: 'Adesão', inactivityDays: 2 },
  { id: 'discovery', label: 'Diagnóstico de maturidade e capacidades locais', shortLabel: 'Diagnóstico', inactivityDays: 3 },
  { id: 'requirements', label: 'Trilha formativa e casos de uso priorizados', shortLabel: 'Casos de uso', inactivityDays: 3 },
  { id: 'technical_planning', label: 'Plano de trabalho e recursos do piloto', shortLabel: 'Plano do piloto', inactivityDays: 2 },
  { id: 'delivery', label: 'Oficinas práticas e estruturação do piloto', shortLabel: 'Oficinas e piloto', inactivityDays: 3 },
  { id: 'internal_qa', label: 'Revisão metodológica e mentoria quinzenal', shortLabel: 'Revisão metodológica', inactivityDays: 2 },
  { id: 'client_validation', label: 'Validação em campo com servidores e lideranças', shortLabel: 'Validação em campo', inactivityDays: 2 },
  { id: 'go_live', label: 'Lançamento do piloto no serviço público', shortLabel: 'Lançamento do piloto', inactivityDays: 1 },
  { id: 'first_value', label: 'Multiplicação de conhecimentos e institucionalização', shortLabel: 'Escala e impacto', inactivityDays: 1 },
]

export const conditionLabels: Record<OperationalCondition, string> = {
  in_progress: 'Em andamento',
  attention: 'Em atenção',
  blocked: 'Bloqueada',
  delayed: 'Atrasada',
  awaiting_validation: 'Aguardando validação',
  completed: 'Concluída',
}

export const dependencyLabels: Record<DependencyOrigin, string> = {
  client: 'Município / Secretaria',
  implementation: 'Facilitação do programa',
  technical_team: 'Equipe local de dados e TI',
  sales: 'Articulação e adesão',
  customer_success: 'Comunidade de prática',
  external: 'Parceiro externo / Controle',
  shared: 'Responsabilidade compartilhada',
}

export function phaseLabel(id: PhaseId, short = false) {
  const phase = phases.find(item => item.id === id)
  return phase ? (short ? phase.shortLabel : phase.label) : id
}
