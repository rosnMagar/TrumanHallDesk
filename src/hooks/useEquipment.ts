import { useState, useEffect } from 'react'
import { getAllEquipment, getAvailableEquipment } from '../api/client'
import type { Equipment } from '../api/types'

interface UseEquipmentResult {
  equipment: Equipment[]
  available: Equipment[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useEquipment(): UseEquipmentResult {
  const [equipment, setEquipment] = useState<Equipment[]>([])
  const [available, setAvailable] = useState<Equipment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetch = async () => {
    setLoading(true)
    setError(null)
    try {
      const [all, avail] = await Promise.all([
        getAllEquipment(),
        getAvailableEquipment()
      ])
      setEquipment(all)
      setAvailable(avail)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load equipment')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refetch()
  }, [])

  return { equipment, available, loading, error, refetch }
}