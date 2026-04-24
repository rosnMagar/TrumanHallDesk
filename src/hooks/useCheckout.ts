import { useState } from 'react'
import { checkoutEquipment } from '../api/client'

interface UseCheckoutResult {
  checkout: (equipmentID: number, bannerID: string) => Promise<boolean>
  loading: boolean
  error: string | null
}

export function useCheckout(): UseCheckoutResult {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const checkout = async (equipmentID: number, bannerID: string): Promise<boolean> => {
    setLoading(true)
    setError(null)
    try {
      await checkoutEquipment(equipmentID, bannerID)
      return true
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Checkout failed')
      return false
    } finally {
      setLoading(false)
    }
  }

  return { checkout, loading, error }
}