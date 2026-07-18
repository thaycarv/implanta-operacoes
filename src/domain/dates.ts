export function addDays(date: Date, days: number): string {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result.toISOString()
}

export function startOfDay(value: string | Date): Date {
  const date = new Date(value)
  date.setHours(0, 0, 0, 0)
  return date
}

export function differenceInCalendarDays(left: string | Date, right: string | Date): number {
  return Math.floor((startOfDay(left).getTime() - startOfDay(right).getTime()) / 86_400_000)
}

export function isPast(value: string, now = new Date()): boolean {
  return startOfDay(value).getTime() < startOfDay(now).getTime()
}

export function isWithinDays(value: string, days: number, now = new Date()): boolean {
  const difference = differenceInCalendarDays(value, now)
  return difference >= 0 && difference <= days
}
