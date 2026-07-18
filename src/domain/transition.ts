import { isFirstValueValidated } from './condition'
import type { ImplementationProject } from '../types'

export type TransitionStatus = 'not_ready' | 'partial' | 'ready'

export function evaluateCSTransition(project: ImplementationProject): { status: TransitionStatus; label: string; reasons: string[] } {
  const reasons: string[] = []
  if (!isFirstValueValidated(project)) reasons.push('primeiro valor ainda não validado')
  if (project.pendingItems.some(item => item.status === 'open' && item.severity === 'critical')) reasons.push('pendência crítica aberta')
  if (reasons.length) return { status: 'not_ready', label: 'Não recomendada', reasons }
  const residual = project.pendingItems.filter(item => item.status === 'open')
  if (residual.length) return { status: 'partial', label: 'Transição parcial', reasons: residual.map(item => `${item.title} permanece com ${item.owner}`) }
  return { status: 'ready', label: 'Transição completa', reasons: ['primeiro valor validado e sem pendências abertas'] }
}
