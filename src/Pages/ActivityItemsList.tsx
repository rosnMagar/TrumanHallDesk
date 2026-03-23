import { useState } from 'react'
import { AppShell, Stack, Title } from '@mantine/core'
import SiteHeader, { type Tab } from '../Components/SiteHeader'
import SiteFooter from '../Components/SiteFooter'
import ActionTable from '../Components/ActionTable'

interface ActivityItem {
  id: number
  room: string
  name: string
  phone: string
  bannerId: string
  itemDescription: string
  checkoutDate: string
  checkoutStaff: string
  checkinDate: string
  checkinStaff: string
}

const INITIAL_ITEMS: ActivityItem[] = [
  { id: 1, room: 'Truman 101', name: 'John Smith', phone: '555-1234', bannerId: '123456789', itemDescription: 'Board Games', checkoutDate: '01/15/2024', checkoutStaff: 'JDoe', checkinDate: '01/16/2024', checkinStaff: 'JDoe' },
  { id: 2, room: 'Miller 205', name: 'Jane Doe', phone: '555-5678', bannerId: '987654321', itemDescription: 'Projector', checkoutDate: '01/17/2024', checkoutStaff: 'ASmith', checkinDate: '', checkinStaff: '' },
  { id: 3, room: 'Cross 302', name: 'Bob Johnson', phone: '555-9012', bannerId: '456789123', itemDescription: 'Sports Equipment', checkoutDate: '01/18/2024', checkoutStaff: 'JDoe', checkinDate: '', checkinStaff: '' },
]

const columns = [
  { key: 'id' as const, label: '#', sortable: true },
  { key: 'room' as const, label: 'Room', sortable: true },
  { key: 'name' as const, label: 'Name', sortable: true },
  { key: 'phone' as const, label: 'Phone', sortable: true },
  { key: 'bannerId' as const, label: 'Banner ID', sortable: true },
  { key: 'itemDescription' as const, label: 'Item Description', sortable: true },
  { key: 'checkoutDate' as const, label: 'Checkout Date', sortable: true },
  { key: 'checkoutStaff' as const, label: 'Checkout Staff', sortable: true },
  { key: 'checkinDate' as const, label: 'Checkin Date', sortable: true },
  { key: 'checkinStaff' as const, label: 'Checkin Staff', sortable: true },
]

const filterFields = [
  { key: 'room' as const, label: 'Room' },
]

const filterOptions: Record<string, { value: string; label: string }[]> = {
  room: ['Truman 101', 'Miller 205', 'Cross 302'].map(v => ({ value: v, label: v })),
}

export default function ActivityItemsList() {
  const [activeTab, setActiveTab] = useState<Tab>('Timeclock')
  const [items] = useState<ActivityItem[]>(INITIAL_ITEMS)

  const handleDeleteSelected = (ids: number[]) => {
    alert(`Delete ${ids.length} selected items`)
  }

  const handleExportSelected = (ids: number[]) => {
    alert(`Export ${ids.length} selected items`)
  }

  return (
    <AppShell header={{ height: 56 }} footer={{ height: 100 }} padding={0}>
      <SiteHeader activeTab={activeTab} onTabChange={setActiveTab} isAdmin={true} adminLabel="Activity Items List" isAdminPage={true} />

      <AppShell.Main bg="gray.1">
        <Stack p="xl" maw={1200} mx="auto" gap="lg">
          <Title order={2}>Activity Items List</Title>

          <ActionTable
            data={items}
            columns={columns}
            searchableFields={['room', 'name', 'itemDescription', 'bannerId']}
            filterFields={filterFields}
            filterOptions={filterOptions}
            onDeleteSelected={handleDeleteSelected}
            onExportSelected={handleExportSelected}
          />
        </Stack>
      </AppShell.Main>

      <SiteFooter />
    </AppShell>
  )
}
