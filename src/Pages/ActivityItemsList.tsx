import { useState } from 'react'
import {
  AppShell, Group, Button, Text, TextInput, Paper, Title,
  Stack, Table, Checkbox,
} from '@mantine/core'
import { IconSearch, IconAdjustments } from '@tabler/icons-react'
import SiteHeader, { type Tab } from '../Components/SiteHeader'
import SiteFooter from '../Components/SiteFooter'

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

export default function ActivityItemsList() {
  const [activeTab, setActiveTab] = useState<Tab>('Timeclock')
  const [items] = useState<ActivityItem[]>(INITIAL_ITEMS)
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [search, setSearch] = useState('')

  const filteredItems = items.filter(item =>
    !search ||
    item.room.toLowerCase().includes(search.toLowerCase()) ||
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.itemDescription.toLowerCase().includes(search.toLowerCase()) ||
    item.bannerId.includes(search)
  )

  const handleCheckboxChange = (id: number) => {
    setSelectedIds(prev =>
      prev.includes(id)
        ? prev.filter(i => i !== id)
        : [...prev, id]
    )
  }

  const handleDeleteSelected = () => {
    alert(`Delete ${selectedIds.length} selected items`)
  }

  const handleExportRecords = () => {
    alert(`Export ${selectedIds.length} selected items`)
  }

  return (
    <AppShell header={{ height: 56 }} footer={{ height: 100 }} padding={0}>
      <SiteHeader activeTab={activeTab} onTabChange={setActiveTab} isAdmin={true} adminLabel="Activity Items List" />

      <AppShell.Main bg="gray.1">
        <Stack p="xl" maw={1200} mx="auto" gap="lg">
          <Title order={2}>Activity Items List</Title>

          <Group justify="space-between">
            <Group gap="sm">
              <Button variant="default" size="sm" leftSection={<IconAdjustments size={14} />}>
                Filter
              </Button>
              <TextInput
                placeholder="Search"
                leftSection={<IconSearch size={14} />}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                w={180}
              />
            </Group>
            <Group gap="md">
              <Text size="sm" c="dimmed">{filteredItems.length} records</Text>
              <Button
                variant="light"
                color="red"
                size="sm"
                onClick={handleDeleteSelected}
                disabled={selectedIds.length === 0}
              >
                Delete Selected
              </Button>
              <Button
                color="grape"
                size="sm"
                onClick={handleExportRecords}
                disabled={selectedIds.length === 0}
              >
                Export Records
              </Button>
            </Group>
          </Group>

          <Paper withBorder radius="md" style={{ overflow: 'hidden' }}>
            <Table withColumnBorders highlightOnHover verticalSpacing="md">
              <Table.Thead>
                <Table.Tr>
                  <Table.Th fw={700} w={40}></Table.Th>
                  <Table.Th fw={700}>#</Table.Th>
                  <Table.Th fw={700}>Room</Table.Th>
                  <Table.Th fw={700}>Name</Table.Th>
                  <Table.Th fw={700}>Phone</Table.Th>
                  <Table.Th fw={700}>Banner ID</Table.Th>
                  <Table.Th fw={700}>Item Description</Table.Th>
                  <Table.Th fw={700}>Checkout Date</Table.Th>
                  <Table.Th fw={700}>Checkout Staff</Table.Th>
                  <Table.Th fw={700}>Checkin Date</Table.Th>
                  <Table.Th fw={700}>Checkin Staff</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {filteredItems.map(item => (
                  <Table.Tr key={item.id}>
                    <Table.Td>
                      <Checkbox
                        checked={selectedIds.includes(item.id)}
                        onChange={() => handleCheckboxChange(item.id)}
                      />
                    </Table.Td>
                    <Table.Td>{item.id}</Table.Td>
                    <Table.Td>{item.room}</Table.Td>
                    <Table.Td>{item.name}</Table.Td>
                    <Table.Td>{item.phone}</Table.Td>
                    <Table.Td>{item.bannerId}</Table.Td>
                    <Table.Td>{item.itemDescription}</Table.Td>
                    <Table.Td>{item.checkoutDate}</Table.Td>
                    <Table.Td>{item.checkoutStaff}</Table.Td>
                    <Table.Td>{item.checkinDate}</Table.Td>
                    <Table.Td>{item.checkinStaff}</Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Paper>
        </Stack>
      </AppShell.Main>

      <SiteFooter />
    </AppShell>
  )
}
