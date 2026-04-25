import { useState } from 'react'
import {
  AppShell, Group, Button, TextInput, Paper, Title,
  SimpleGrid, Stack, Table, Select,
} from '@mantine/core'
import SiteHeader, { type Tab } from '../Components/SiteHeader'
import SiteFooter from '../Components/SiteFooter'

interface AllowedUser {
  id: number
  username: string
  building: string
}

const BUILDINGS = [
  { value: "Blanton-Nason Brewer Hall", label: "Blanton-Nason Brewer Hall" },
  { value: "Ryle Hall", label: "Ryle Hall" },
  { value: "Campbell Apartments", label: "Campbell Apartments" },
  { value: "West Campus Suites", label: "West Campus Suites" },
  { value: "Missouri Hall", label: "Missouri Hall" },
  { value: "Centennial Hall", label: "Centennial Hall" },
  { value: "Dobson Hall", label: "Dobson Hall" },
  { value: "Grim Hall", label: "Grim Hall" },
];

const INITIAL_USERS: AllowedUser[] = [
  { id: 1, username: "jsmith", building: "Ryle Hall" },
  { id: 2, username: "mjones", building: "Missouri Hall" },
  { id: 3, username: "rbrown", building: "Dobson Hall" },
];

export default function AllowedUsers() {
  const [activeTab, setActiveTab] = useState<Tab>('Timeclock')
  const [users, setUsers] = useState<AllowedUser[]>(INITIAL_USERS)
  const [newUsername, setNewUsername] = useState('')
  const [newBuilding, setNewBuilding] = useState<string | null>(null)

  const handleRemove = (id: number) => {
    setUsers(prev => prev.filter(u => u.id !== id))
  }

  const handleAdd = () => {
    if (!newUsername || !newBuilding) return
    setUsers(prev => [
      ...prev,
      { id: Date.now(), username: newUsername, building: newBuilding },
    ])
    setNewUsername('')
    setNewBuilding(null)
  }

  return (
    <AppShell header={{ height: 56 }} footer={{ height: 100 }} padding={0}>
      <SiteHeader activeTab={activeTab} onTabChange={setActiveTab} isAdmin={true} adminLabel="Allowed Users" isAdminPage={true} />

      <AppShell.Main bg="gray.1">
        <Stack p="xl" maw={900} mx="auto" gap="lg">
          <Title order={2}>Allowed Users</Title>

          <Paper withBorder radius="md" style={{ overflow: 'hidden' }}>
            <Table withColumnBorders highlightOnHover verticalSpacing="md">
              <Table.Thead>
                <Table.Tr>
                  <Table.Th fw={700}>Username</Table.Th>
                  <Table.Th fw={700}>Building</Table.Th>
                  <Table.Th fw={700}>Remove</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {users.map(user => (
                  <Table.Tr key={user.id}>
                    <Table.Td>{user.username}</Table.Td>
                    <Table.Td>{user.building}</Table.Td>
                    <Table.Td>
                      <Button
                        size="xs"
                        variant="light"
                        color="red"
                        onClick={() => handleRemove(user.id)}
                      >
                        Remove
                      </Button>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Paper>

          <Paper withBorder p="xl" radius="md">
            <Title order={4} mb="md">Add New User</Title>
            <SimpleGrid cols={3} spacing="md">
              <TextInput
                label="Username"
                placeholder="Enter username"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
              />
              <Select
                label="Building"
                placeholder="Select building"
                data={BUILDINGS}
                value={newBuilding}
                onChange={(value) => setNewBuilding(value)}
              />
              <Group align="flex-end">
                <Button color="grape" onClick={handleAdd}>
                  Add
                </Button>
              </Group>
            </SimpleGrid>
          </Paper>
        </Stack>
      </AppShell.Main>

      <SiteFooter />
    </AppShell>
  )
}