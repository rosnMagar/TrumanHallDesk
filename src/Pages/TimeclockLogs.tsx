//Same action table filter issue as the other pages
import { useState } from 'react'
import { Title } from '@mantine/core'
import { type Tab } from '../Components/SiteHeader'
import PageLayout from '../Components/PageLayout'
import DataTable from '../Components/DataTable'

interface TimeclockLog {
  id: number
  building: string
  firstName: string
  lastName: string
  bannerId: string
  inOut: string
  timestamp: string
  ipAddress: string
  computerName: string
}

const INITIAL_LOGS: TimeclockLog[] = [
  {
    id: 1,
    building: "Ryle Hall",
    firstName: "John",
    lastName: "Smith",
    bannerId: "123456789",
    inOut: "In",
    timestamp: "01/15/2024 08:00 AM",
    ipAddress: "192.168.1.101",
    computerName: "RYLE-DSK-01",
  },
  {
    id: 2,
    building: "Dobson Hall",
    firstName: "Jane",
    lastName: "Doe",
    bannerId: "987654321",
    inOut: "Out",
    timestamp: "01/15/2024 05:00 PM",
    ipAddress: "192.168.1.102",
    computerName: "DOBSON-DSK-02",
  },
  {
    id: 3,
    building: "Missouri Hall",
    firstName: "Bob",
    lastName: "Johnson",
    bannerId: "456789123",
    inOut: "In",
    timestamp: "01/16/2024 09:15 AM",
    ipAddress: "192.168.1.103",
    computerName: "MO-DSK-01",
  },
  {
    id: 4,
    building: "Blanton-Nason Brewer Hall",
    firstName: "Alice",
    lastName: "Williams",
    bannerId: "789123456",
    inOut: "In",
    timestamp: "01/16/2024 08:30 AM",
    ipAddress: "192.168.1.104",
    computerName: "BNB-DSK-01",
  },
];

const columns = [
  { key: 'id' as const, label: 'ID', sortable: true },
  { key: 'building' as const, label: 'Building', sortable: true },
  { key: 'firstName' as const, label: 'First Name', sortable: true },
  { key: 'lastName' as const, label: 'Last Name', sortable: true },
  { key: 'bannerId' as const, label: 'Banner ID', sortable: true },
  { key: 'inOut' as const, label: 'In/Out', sortable: true },
  { key: 'timestamp' as const, label: 'Timestamp', sortable: true },
  { key: 'ipAddress' as const, label: 'IP Address', sortable: true },
  { key: 'computerName' as const, label: 'Computer Name', sortable: true },
]

const filterFields = [
  { key: 'building' as const, label: 'Building' },
  { key: 'inOut' as const, label: 'In/Out' },
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
  inOut: [
    { value: 'In', label: 'In' },
    { value: 'Out', label: 'Out' },
  ],
}

export default function TimeclockLogs() {
  const [activeTab, setActiveTab] = useState<Tab>('Timeclock')
  const [logs] = useState<TimeclockLog[]>(INITIAL_LOGS)

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