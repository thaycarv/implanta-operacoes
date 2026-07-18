import { isFirstValueValidated } from './condition'
import type { ImplementationProject } from '../types'

export interface GateResult { ready: boolean; reasons: string[] }

export function evaluateGoLiveGate(project: ImplementationProject): GateResult {
  const reasons: string[] = []
  if (project.pendingItems.some(item => item.status !== 'resolved' && item.severity === 'critical')) reasons.push('Existe pendência crítica aberta')
  const blockers = project.requirements.filter(item => item.relevance === 'go_live_blocker' && item.status !== 'client_approved')
  if (blockers.length) reasons.push(`${blockers.length} requisito(s) bloqueador(es) sem homologação`)
  if (project.tests.some(test => test.type === 'internal' && test.executions.at(-1)?.result === 'failed')) reasons.push('Existe teste interno reprovado')
  return { ready: reasons.length === 0, reasons }
}

export function evaluateFirstValueGate(project: ImplementationProject): GateResult {
  const reasons: string[] = []
  if (!project.firstValue.saleProcessed) reasons.push('Venda real ainda não validada')
  if (!project.firstValue.inventoryUpdated) reasons.push('Movimentação de estoque ainda não validada')
  if (!project.firstValue.cashClosed) reasons.push('Fechamento de caixa ainda não validado')
  if (!project.firstValue.dataReconciled) reasons.push('Dados essenciais ainda não conciliados')
  if (project.pendingItems.some(item => item.status !== 'resolved' && item.severity === 'critical')) reasons.push('Existe pendência crítica aberta')
  return { ready: isFirstValueValidated(project) && reasons.length === 0, reasons }
}
