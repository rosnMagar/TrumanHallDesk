import { useState } from 'react'
import {
  AppShell, Group, Button, TextInput, Paper, Title,
  SimpleGrid, Stack, Table, Select,
} from '@mantine/core'
import SiteHeader, { type Tab } from '../Components/SiteHeader'
import SiteFooter from '../Components/SiteFooter'

interface DatastreamUser {
  id: number
  username: string
  viewAccess: string
  editAccess: string
  access: string
}

const BUILDINGS = [
  { value: "All Buildings", label: "All Buildings" },
  { value: "No Buildings", label: "No Buildings" },
  { value: "Blanton-Nason Brewer Hall", label: "Blanton-Nason Brewer Hall" },
  { value: "Ryle Hall", label: "Ryle Hall" },
  { value: "Campbell Apartments", label: "Campbell Apartments" },
  { value: "West Campus Suites", label: "West Campus Suites" },
  { value: "Missouri Hall", label: "Missouri Hall" },
  { value: "Centennial Hall", label: "Centennial Hall" },
  { value: "Dobson Hall", label: "Dobson Hall" },
  { value: "Grim Hall", label: "Grim Hall" },
];

const INITIAL_USERS: DatastreamUser[] = [
  {
    id: 1,
    username: "jsmith",
    viewAccess: "All Buildings",
    editAccess: "All Buildings",
    access: "100",
  },
  {
    id: 2,
    username: "mjones",
    viewAccess: "Ryle Hall",
    editAccess: "No Buildings",
    access: "100",
  },
  {
    id: 3,
    username: "rbrown",
    viewAccess: "All Buildings",
    editAccess: "Ryle Hall",
    access: "100",
  },
];

export default function DatastreamUsers() {
  const [activeTab, setActiveTab] = useState<Tab>('Timeclock')
  const [users, setUsers] = useState<DatastreamUser[]>(INITIAL_USERS)
  const [newUsername, setNewUsername] = useState('')
  const [newViewAccess, setNewViewAccess] = useState<string | null>(null)
  const [newEditAccess, setNewEditAccess] = useState<string | null>(null)
  const [newAccess, setNewAccess] = useState('')

  const handleRemove = (id: number) => {
    setUsers(prev => prev.filter(u => u.id !== id))
  }

  const handleAdd = () => {
    if (!newUsername || !newViewAccess || !newEditAccess || !newAccess) return
    setUsers(prev => [
      ...prev,
      { id: Date.now(), username: newUsername, viewAccess: newViewAccess, editAccess: newEditAccess, access: newAccess },
    ])
    setNewUsername('')
    setNewViewAccess(null)
    setNewEditAccess(null)
    setNewAccess('')
  }

  return (
    <AppShell header={{ height: 56 }} footer={{ height: 100 }} padding={0}>
      <SiteHeader activeTab={activeTab} onTabChange={setActiveTab} isAdmin={true} adminLabel="Datastream Users" isAdminPage={true} />

      <AppShell.Main bg="gray.1">
        <Stack p="xl" maw={900} mx="auto" gap="lg">
          <Title order={2}>Datastream Users</Title>

          <Paper withBorder radius="md" style={{ overflow: 'hidden' }}>
            <Table withColumnBorders highlightOnHover verticalSpacing="md">
              <Table.Thead>
                <Table.Tr>
                  <Table.Th fw={700}>Username</Table.Th>
                  <Table.Th fw={700}>View Access</Table.Th>
                  <Table.Th fw={700}>Edit Access</Table.Th>
                  <Table.Th fw={700}>Access</Table.Th>
                  <Table.Th fw={700}>Remove</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {users.map(user => (
                  <Table.Tr key={user.id}>
                    <Table.Td>{user.username}</Table.Td>
                    <Table.Td>{user.viewAccess}</Table.Td>
                    <Table.Td>{user.editAccess}</Table.Td>
                    <Table.Td>{user.access}</Table.Td>
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
            <SimpleGrid cols={5} spacing="md">
              <TextInput
                label="Username"
                placeholder="Enter username"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
              />
              <Select
                label="View Access"
                placeholder="Select"
                data={BUILDINGS}
                value={newViewAccess}
                onChange={(value) => setNewViewAccess(value)}
              />
              <Select
                label="Edit Access"
                placeholder="Select"
                data={BUILDINGS}
                value={newEditAccess}
                onChange={(value) => setNewEditAccess(value)}
              />
              <TextInput
                label="Access"
                placeholder="Access level"
                value={newAccess}
                onChange={(e) => setNewAccess(e.target.value)}
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
