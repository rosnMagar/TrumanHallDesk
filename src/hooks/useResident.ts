import { useState } from 'react'
import { getResidentByBannerId } from '../api/client'

interface ResidentInfo {
  residentID: number
  firstName: string
  lastName: string
  phoneNumber: string
}

interface UseResidentResult {
  resident: ResidentInfo | null
  lookup: (bannerID: string) => Promise<ResidentInfo | null>
  loading: boolean
  error: string | null
}

export function useResident(): UseResidentResult {
  const [resident, setResident] = useState<ResidentInfo | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const lookup = async (bannerID: string): Promise<ResidentInfo | null> => {
    if (!bannerID || bannerID.length < 5) return null
    
    setLoading(true)
    setError(null)
    try {
      const result = await getResidentByBannerId(bannerID)
      setResident(result)
      return result
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Resident not found')
      setResident(null)
      return null
    } finally {
      setLoading(false)
    }
  }

  return { resident, lookup, loading, error }
}