import { useState } from 'react'
import { checkinEquipment } from '../api/client'

interface UseCheckinResult {
  checkin: (equipmentID: number) => Promise<boolean>
  loading: boolean
  error: string | null
}

export function useCheckin(): UseCheckinResult {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const checkin = async (equipmentID: number): Promise<boolean> => {
    setLoading(true)
    setError(null)
    try {
      await checkinEquipment(equipmentID)
      return true
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Check-in failed')
      return false
    } finally {
      setLoading(false)
    }
  }

  return { checkin, loading, error }
}