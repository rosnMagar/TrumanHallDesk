import { useState, useEffect } from 'react'
import { Title } from '@mantine/core'
import { type Tab } from '../Components/SiteHeader'
import PageLayout from '../Components/PageLayout'
import DataTable from '../Components/DataTable'
import { getAllPunches } from '../api/client'

interface TimeclockLog {
  id: string
  building: string
  firstName: string
  lastName: string
  bannerId: string
  action: 'in' | 'out'
  at: string
}

const columns = [
  { key: 'bannerId' as const, label: 'Banner ID', sortable: true },
  { key: 'firstName' as const, label: 'First Name', sortable: true },
  { key: 'lastName' as const, label: 'Last Name', sortable: true },
  { key: 'building' as const, label: 'Building', sortable: true },
  { key: 'action' as const, label: 'In/Out', sortable: true },
  { key: 'at' as const, label: 'Timestamp', sortable: true },
]

const filterFields = [
  { key: 'building' as const, label: 'Building' },
  { key: 'action' as const, label: 'In/Out' },
]

const filterOptions: Record<string, { value: string; label: string }[]> = {
  building: [
    "Ryle Hall",
    "Blanton-Nason Brewer Hall",
    "Missouri Hall",
    "Centennial Hall",
    "Dobson Hall",
    "West Hall",
    "Campbell Hall",
    "Grim",
  ].map((v) => ({ value: v, label: v })),
  action: [
    { value: 'in', label: 'In' },
    { value: 'out', label: 'Out' },
  ],
}

export default function TimeclockLogs() {
  const [activeTab, setActiveTab] = useState<Tab>('Timeclock')
  const [logs, setLogs] = useState<TimeclockLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchLogs = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getAllPunches()
      setLogs(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load timeclock logs')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLogs()
  }, [])

  return (
    <PageLayout activeTab={activeTab} onTabChange={setActiveTab} isAdmin={true} adminLabel="Timeclock" isAdminPage={true}>
      <Title order={2}>Timeclock</Title>

      <DataTable
        data={logs}
        columns={columns}
        searchableFields={['building', 'firstName', 'lastName', 'bannerId']}
        filterFields={filterFields}
        filterOptions={filterOptions}
      />
    </PageLayout>
  )
}