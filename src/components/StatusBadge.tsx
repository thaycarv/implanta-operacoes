import { conditionLabels } from '../domain/catalog'
import type { OperationalCondition } from '../types'

export function StatusBadge({ condition }: { condition: OperationalCondition }) {
  return <span className={`status status--${condition}`}>{conditionLabels[condition]}</span>
}
