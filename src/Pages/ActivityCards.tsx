import { useState } from 'react'
import { AppShell, Stack, Title } from '@mantine/core'
import SiteHeader, { type Tab } from '../Components/SiteHeader'
import SiteFooter from '../Components/SiteFooter'
import ActionTable from '../Components/ActionTable'

interface ActivityCard {
  id: number
  room: string
  name: string
  bannerId: string
}

const INITIAL_CARDS: ActivityCard[] = [
  { id: 1, room: 'Truman 101', name: 'John Smith', bannerId: '123456789' },
  { id: 2, room: 'Miller 205', name: 'Jane Doe', bannerId: '987654321' },
  { id: 3, room: 'Cross 302', name: 'Bob Johnson', bannerId: '456789123' },
]

const columns = [
  { key: 'room' as const, label: 'Room', sortable: true },
  { key: 'name' as const, label: 'Name', sortable: true },
  { key: 'bannerId' as const, label: 'Banner ID', sortable: true },
]

const filterFields = [
  { key: 'room' as const, label: 'Room' },
]

const filterOptions: Record<string, { value: string; label: string }[]> = {
  room: ['Truman 101', 'Miller 205', 'Cross 302'].map(v => ({ value: v, label: v })),
}

export default function ActivityCards() {
  const [activeTab, setActiveTab] = useState<Tab>('Timeclock')
  const [cards] = useState<ActivityCard[]>(INITIAL_CARDS)

  const handleDeleteSelected = (ids: number[]) => {
    alert(`Delete ${ids.length} selected items`)
  }

  return (
    <AppShell header={{ height: 56 }} footer={{ height: 100 }} padding={0}>
      <SiteHeader activeTab={activeTab} onTabChange={setActiveTab} isAdmin={true} adminLabel="Activity Cards" isAdminPage={true} />

      <AppShell.Main bg="gray.1">
        <Stack p="xl" maw={900} mx="auto" gap="lg">
          <Title order={2}>Activity Cards</Title>

          <ActionTable
            data={cards}
            columns={columns}
            searchableFields={['room', 'name', 'bannerId']}
            filterFields={filterFields}
            filterOptions={filterOptions}
            onDeleteSelected={handleDeleteSelected}
            deleteLabel="Delete Selected"
          />
        </Stack>
      </AppShell.Main>

      <SiteFooter />
    </AppShell>
  )
}
