const STORAGE_KEY = 'trumanHallDesk_timeclock_v1'

export type TimeclockPunch = {
  id: string
  bannerId: string
  action: 'in' | 'out'
  at: string
}

function safeParse(raw: string | null): TimeclockPunch[] {
  if (!raw) return []
  try {
    const data = JSON.parse(raw) as unknown
    if (!Array.isArray(data)) return []
    return data.filter(
      (row): row is TimeclockPunch =>
        row &&
        typeof row === 'object' &&
        typeof (row as TimeclockPunch).id === 'string' &&
        typeof (row as TimeclockPunch).bannerId === 'string' &&
        ((row as TimeclockPunch).action === 'in' || (row as TimeclockPunch).action === 'out') &&
        typeof (row as TimeclockPunch).at === 'string'
    )
  } catch {
    return []
  }
}

export function loadPunches(): TimeclockPunch[] {
  if (typeof window === 'undefined') return []
  return safeParse(window.localStorage.getItem(STORAGE_KEY))
}

export function savePunches(punches: TimeclockPunch[]): void {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(punches))
}

export function appendPunch(
  bannerId: string,
  action: 'in' | 'out'
): TimeclockPunch[] {
  const punches = loadPunches()
  const next: TimeclockPunch = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    bannerId,
    action,
    at: new Date().toISOString(),
  }
  const updated = [...punches, next]
  savePunches(updated)
  return updated
}

export function lastActionForBanner(
  bannerId: string,
  punches: TimeclockPunch[]
): 'in' | 'out' | null {
  const trimmed = bannerId.trim()
  if (!trimmed) return null
  const forUser = punches.filter(p => p.bannerId === trimmed)
  if (forUser.length === 0) return null
  const sorted = [...forUser].sort(
    (a, b) => new Date(b.at).getTime() - new Date(a.at).getTime()
  )
  return sorted[0].action
}

export function punchesOnLocalDay(punches: TimeclockPunch[], day: Date): TimeclockPunch[] {
  const start = new Date(day)
  start.setHours(0, 0, 0, 0)
  const end = new Date(start)
  end.setDate(end.getDate() + 1)
  const t0 = start.getTime()
  const t1 = end.getTime()
  return punches.filter(p => {
    const t = new Date(p.at).getTime()
    return t >= t0 && t < t1
  })
}
