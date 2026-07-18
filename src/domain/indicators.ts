import { deriveCondition, isFirstValueValidated } from './condition'
import { isWithinDays } from './dates'
import { phases } from './catalog'
import type { ImplementationProject, OperationalCondition, PhaseId, PortfolioIndicators } from '../types'

export function calculateIndicators(projects: ImplementationProject[], now = new Date()): PortfolioIndicators {
  const byPhase = Object.fromEntries(phases.map(phase => [phase.id, 0])) as Record<PhaseId, number>
  const conditions: OperationalCondition[] = ['in_progress', 'attention', 'blocked', 'delayed', 'awaiting_validation', 'completed']
  const byCondition = Object.fromEntries(conditions.map(condition => [condition, 0])) as Record<OperationalCondition, number>
  projects.forEach(project => {
    byPhase[project.mainPhase] += 1
    byCondition[deriveCondition(project, now)] += 1
  })
  return {
    activeProjects: projects.filter(project => !project.closedAt).length,
    blockedProjects: byCondition.blocked,
    delayedProjects: byCondition.delayed,
    upcomingGoLives: projects.filter(project => {
      const goLive = project.milestones.find(item => item.phase === 'go_live')
      return goLive && goLive.status !== 'completed' && isWithinDays(goLive.forecastDate, 15, now)
    }).length,
    firstValueValidated: projects.filter(isFirstValueValidated).length,
    completedProjects: byCondition.completed,
    byPhase,
    byCondition,
  }
}
