import type { DependencyOrigin, OperationalCondition, PhaseId } from '../types'

export const phases: Array<{ id: PhaseId; label: string; shortLabel: string; inactivityDays: number }> = [
  { id: 'handoff', label: 'Handoff comercial', shortLabel: 'Handoff', inactivityDays: 2 },
  { id: 'discovery', label: 'Discovery', shortLabel: 'Discovery', inactivityDays: 3 },
  { id: 'requirements', label: 'Requisitos e desenho da solução', shortLabel: 'Requisitos', inactivityDays: 3 },
  { id: 'technical_planning', label: 'Refinamento técnico e planejamento', shortLabel: 'Planejamento técnico', inactivityDays: 2 },
  { id: 'delivery', label: 'Configuração e desenvolvimento', shortLabel: 'Desenvolvimento', inactivityDays: 3 },
  { id: 'internal_qa', label: 'Validação interna e QA', shortLabel: 'QA interno', inactivityDays: 2 },
  { id: 'client_validation', label: 'Homologação com o cliente', shortLabel: 'Homologação', inactivityDays: 2 },
  { id: 'go_live', label: 'Preparação e go-live', shortLabel: 'Go-live', inactivityDays: 1 },
  { id: 'first_value', label: 'Primeiro ciclo operacional e transição', shortLabel: 'Primeiro valor', inactivityDays: 1 },
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
  client: 'Cliente', implementation: 'Implantação', technical_team: 'Time técnico',
  sales: 'Comercial', customer_success: 'Customer Success', external: 'Externo', shared: 'Compartilhada',
}

export function phaseLabel(id: PhaseId, short = false) {
  const phase = phases.find(item => item.id === id)
  return phase ? (short ? phase.shortLabel : phase.label) : id
}
