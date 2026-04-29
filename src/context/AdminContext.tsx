import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { checkAdmin, type AdminCheckResult } from '../api/client'

interface AdminContextType {
  isAdmin: boolean
  adminInfo: AdminCheckResult | null
  loading: boolean
}

const AdminContext = createContext<AdminContextType>({
  isAdmin: false,
  adminInfo: null,
  loading: true,
})

export function AdminProvider({ children }: { children: ReactNode }) {
  const [adminInfo, setAdminInfo] = useState<AdminCheckResult | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAdmin()
      .then((result) => {
        setAdminInfo(result)
      })
      .catch(() => {
        setAdminInfo({ isAdmin: false })
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  return (
    <AdminContext.Provider value={{ isAdmin: adminInfo?.isAdmin ?? false, adminInfo, loading }}>
      {children}
    </AdminContext.Provider>
  )
}

export function useAdmin() {
  return useContext(AdminContext)
}
