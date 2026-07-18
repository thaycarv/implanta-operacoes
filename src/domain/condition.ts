import { phases } from './catalog'
import { differenceInCalendarDays, isPast } from './dates'
import type { ImplementationProject, OperationalCondition } from '../types'

export function isFirstValueValidated(project: ImplementationProject): boolean {
  return Object.values(project.firstValue).every(Boolean)
}

export function projectAlerts(project: ImplementationProject, now = new Date()): string[] {
  const alerts: string[] = []
  if (project.pendingItems.some(item => item.status !== 'resolved' && isPast(item.dueDate, now))) alerts.push('Pendência com prazo vencido')
  if (project.milestones.some(item => item.status !== 'completed' && isPast(item.forecastDate, now))) alerts.push('Marco atrasado')
  const phase = phases.find(item => item.id === project.mainPhase)
  if (phase && differenceInCalendarDays(now, project.lastMeaningfulActivity) > phase.inactivityDays) alerts.push('Sem avanço relevante')
  if (project.pendingItems.some(item => item.status !== 'resolved' && item.origin === 'client')) alerts.push('Aguardando cliente')
  return [...new Set(alerts)]
}

export function deriveCondition(project: ImplementationProject, now = new Date()): OperationalCondition {
  if (project.closedAt) return 'completed'
  if (project.pendingItems.some(item => item.status !== 'resolved' && item.severity === 'critical')) return 'blocked'
  if (project.milestones.some(item => item.status === 'delayed' || (item.status !== 'completed' && isPast(item.forecastDate, now)))) return 'delayed'
  if (project.awaitingValidation) return 'awaiting_validation'
  if (projectAlerts(project, now).length > 0) return 'attention'
  return 'in_progress'
}
