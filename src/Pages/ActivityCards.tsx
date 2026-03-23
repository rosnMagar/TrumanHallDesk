import { useState } from 'react'
import {
  AppShell, Group, Button, Text, TextInput, Paper, Title,
  Stack, Table, Checkbox,
} from '@mantine/core'
import { IconSearch, IconAdjustments } from '@tabler/icons-react'
import SiteHeader, { type Tab } from '../Components/SiteHeader'
import SiteFooter from '../Components/SiteFooter'

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

export default function ActivityCards() {
  const [activeTab, setActiveTab] = useState<Tab>('Timeclock')
  const [cards] = useState<ActivityCard[]>(INITIAL_CARDS)
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [search, setSearch] = useState('')

  const filteredCards = cards.filter(card =>
    !search ||
    card.room.toLowerCase().includes(search.toLowerCase()) ||
    card.name.toLowerCase().includes(search.toLowerCase()) ||
    card.bannerId.includes(search)
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

  return (
    <AppShell header={{ height: 56 }} footer={{ height: 100 }} padding={0}>
      <SiteHeader activeTab={activeTab} onTabChange={setActiveTab} isAdmin={true} adminLabel="Activity Cards" />

      <AppShell.Main bg="gray.1">
        <Stack p="xl" maw={900} mx="auto" gap="lg">
          <Title order={2}>Activity Cards</Title>

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
              <Text size="sm" c="dimmed">{filteredCards.length} records</Text>
              <Button
                variant="light"
                color="red"
                size="sm"
                onClick={handleDeleteSelected}
                disabled={selectedIds.length === 0}
              >
                Delete Selected
              </Button>
            </Group>
          </Group>

          <Paper withBorder radius="md" style={{ overflow: 'hidden' }}>
            <Table withColumnBorders highlightOnHover verticalSpacing="md">
              <Table.Thead>
                <Table.Tr>
                  <Table.Th fw={700} w={40}></Table.Th>
                  <Table.Th fw={700}>Room</Table.Th>
                  <Table.Th fw={700}>Name</Table.Th>
                  <Table.Th fw={700}>Banner ID</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {filteredCards.map(card => (
                  <Table.Tr key={card.id}>
                    <Table.Td>
                      <Checkbox
                        checked={selectedIds.includes(card.id)}
                        onChange={() => handleCheckboxChange(card.id)}
                      />
                    </Table.Td>
                    <Table.Td>{card.room}</Table.Td>
                    <Table.Td>{card.name}</Table.Td>
                    <Table.Td>{card.bannerId}</Table.Td>
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
