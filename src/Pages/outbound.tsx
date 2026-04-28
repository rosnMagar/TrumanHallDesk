import { useState } from 'react'
import {
  Button, Paper, Title,
} from '@mantine/core'
import { type Tab } from '../Components/SiteHeader'
import PageLayout from '../Components/PageLayout'
import ActionTable, { type Column, type FilterField } from '../Components/ActionTable'

interface Package {
  id: number
  building: string
  tracking: string
  description: string
  name: string
  inDate: string
  outDate: string
  status: 'pickup' | 'forward'
}

const INITIAL_PACKAGES: Package[] = [
  {
    id: 456,
    building: 'Ryle',
    tracking: '676767',
    description: 'small box D that has multiple lines of text to test how the table handles long descriptions and whether it wraps or overflows',
    name: 'Bill Gates Testing what happensing with a really long name that should be truncated',
    inDate: '01/02/2014',
    outDate: '',
    status: 'forward',
  },
  {
    id: 123,
    building: 'BNB',
    tracking: '42069',
    description: 'big box A',
    name: 'Linus Torvalds',
    inDate: '01/02/1999',
    outDate: '',
    status: 'pickup',
  },
]

export default function ResidenceLifeOutbound() {
  const [activeTab, setActiveTab] = useState<Tab>('Outbound')
  const [packages, setPackages] = useState<Package[]>(INITIAL_PACKAGES)

  const handlePickup = (id: number) => {
    setPackages(p =>
      p.map(pkg =>
        pkg.id === id ? { ...pkg, outDate: new Date().toLocaleDateString() } : pkg
      )
    )
  }

  const handleForward = (id: number) => {
    alert(`Forwarding package ID ${id}`)
  }


  const columns: Column<Package>[] = [
    { key: 'id', label: 'Package ID', sortable: true },
    { key: 'building', label: 'Building', sortable: true },
    { key: 'tracking', label: 'Tracking #', sortable: true },
    { key: 'description', label: 'Description', sortable: true },
    { key: 'name', label: 'Name', sortable: true },
    { key: 'inDate', label: 'In-date', sortable: true },
    { key: 'outDate', label: 'Out-date', sortable: true },
    {
      key: 'status', label: 'Action',
      render: (pkg) => pkg.status === 'pickup' ? (
        <Button size="xs" color="brand-purple" onClick={() => handlePickup(pkg.id)}>
          Pick Up
        </Button>
      ) : (
        <Button size="xs" variant="light" color="brand-purple" onClick={() => handleForward(pkg.id)}>
          Forward
        </Button>
      ),
    },
  ]

  const filterFields: FilterField<Package>[] = [
    { key: 'building', label: 'Building' },
    { key: 'status', label: 'Status' },
  ]

  const filterOptions = {
    building: ['Ryle', 'BNB'].map(v => ({ value: v, label: v })),
    status: [
      { value: 'pickup', label: 'Pick Up' },
      { value: 'forward', label: 'Forward' },
    ],
  }

  return (
    <PageLayout activeTab={activeTab} onTabChange={setActiveTab}>
      <Paper withBorder shadow="xs" p="lg" radius="md">
        <Title order={4} mb="md">Package Pickup and Forwarding</Title>

        <ActionTable
          data={packages}
          columns={columns}
          searchableFields={['name', 'tracking', 'description', 'building']}
          filterFields={filterFields}
          filterOptions={filterOptions}
        />
      </Paper>
    </PageLayout>
  )
}