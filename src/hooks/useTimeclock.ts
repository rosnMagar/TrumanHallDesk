import { useState, useEffect, useCallback } from 'react'
import { getPunches, recordPunch } from '../api/client'
import type { TimeclockPunch } from '../api/types'

interface UseTimeclockResult {
  punches: TimeclockPunch[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
  punch: (action: 'in' | 'out') => Promise<{ success: boolean; message: string; timestamp?: string }>
}

export function useTimeclock(): UseTimeclockResult {
  const [punches, setPunches] = useState<TimeclockPunch[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetch = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getPunches()
      setPunches(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load punches')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refetch()
  }, [])

  const punch = useCallback(async (action: 'in' | 'out') => {
    try {
      const result = await recordPunch(action)
      await refetch()
      return {
        success: true,
        message: action === 'in' ? `Clocked in` : `Clocked out`,
        timestamp: result.at
      }
    } catch (e) {
      return { success: false, message: e instanceof Error ? e.message : 'Failed to record punch' }
    }
  }, [refetch])

  return { punches, loading, error, refetch, punch }
}